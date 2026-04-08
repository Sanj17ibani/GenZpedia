const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const slangRoutes = require("./routes/slangRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");

dotenv.config();        // 1️⃣ Load env variables
connectDB();            // 2️⃣ CONNECT TO DATABASE (HERE ✅)

const app = express();  // 3️⃣ Create app

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/slang", slangRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("GenZpedia backend is running");
});

// Error middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});