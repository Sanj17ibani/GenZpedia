const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET must be set in .env');
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI must be set in .env');
  process.exit(1);
}

const mongoose = require('./config/mongoose');
const express = require('express');
const cors = require('cors');
const { getConnectionOptions, logMongoUriPlan } = require('./config/db');

const requestLogger = require('./middleware/requestLogger');
const PORT = Number(process.env.PORT) || 5000;

async function start() {
  const uri = process.env.MONGO_URI;
  logMongoUriPlan(uri);

  await mongoose.connect(uri, getConnectionOptions(uri));

  console.log('MongoDB Connected');
  console.log(
    `mongoose.connection.readyState: ${mongoose.connection.readyState} (1 = connected)`
  );
  console.log(
    `mongoose.connection.db.databaseName: ${mongoose.connection.db.databaseName}`
  );
  console.log(`Connected database name: ${mongoose.connection.name}`);
  
  require('./models/userModel');
  require('./models/slangModel');

  const errorHandler = require('./middleware/errorHandler');
  const notFound = require('./middleware/notFound');
  const authRoutes = require('./routes/authRoutes');
  const slangRoutes = require('./routes/slangRoutes');

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);
  app.use((req, res, next) => {
    console.log("👉 REQUEST HIT:", req.method, req.url);
    next();
  });
  app.use('/api/auth', authRoutes);
  app.use('/api/slang', slangRoutes);

  app.use(notFound);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
