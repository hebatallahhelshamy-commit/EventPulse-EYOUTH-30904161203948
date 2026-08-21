require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
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
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

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

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('join-event', (eventId) => {
    socket.join(eventId);
    console.log(`Socket ${socket.id} joined event room: ${eventId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(mongoSanitize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/announcements', announcementRoutes);

// Handling 404 Routes
app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'الرابط غير موجود' });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
} else {
  connectDB();
}

module.exports = app;