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
const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT) || 5000;

function buildCorsOptions() {
  const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (allowedOrigins.length === 0) {
    return {
      origin: true,
      credentials: true,
    };
  }

  return {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  };
}

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
  const corsOptions = buildCorsOptions();

  app.set('trust proxy', true);
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(requestLogger);

  app.get('/health', (_req, res) => {
    res.json({
      ok: true,
      host: HOST,
      port: PORT,
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/slang', slangRoutes);

  app.use(notFound);
  app.use(errorHandler);

  app.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});

