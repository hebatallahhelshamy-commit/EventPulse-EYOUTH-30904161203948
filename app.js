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

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(mongoSanitize());

// Middleware للاتصال بقاعدة البيانات مع كل طلب في Vercel
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/announcements', announcementRoutes);

// Handling 404 Routes
app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'الرابط غير موجود' });
});

// Central Error Handler
app.use(errorHandler);

// التشغيل المحلي فقط (Local Development)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

// تصدير app كـ Serverless Handler لـ Vercel
module.exports = app;