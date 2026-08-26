require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const swaggerDocs = require('./config/swagger');

const app = express();

// Swagger Documentation
swaggerDocs(app);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(mongoSanitize());

// Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    await connectDB();

    res.status(200).json({
      status: 'ok',
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      database: 'connected',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      database: 'disconnected',
      timestamp: new Date(),
    });
  }
});

// Connect to MongoDB before API routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/announcements', announcementRoutes);

// Handling 404 Routes
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'الرابط غير موجود',
  });
});

// Central Error Handler
app.use(errorHandler);

// Local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

// Vercel Serverless Handler
module.exports = app;