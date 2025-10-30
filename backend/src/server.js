require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { testConnection, closePool } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: [
    'http://localhost:8081',
    'http://localhost:19006',
    'http://localhost:19000',
    'http://192.168.1.240:8081',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '0.1.0'
  });
});

// Import routes
const authRoutes = require('./api/authRoutes');
const tournamentRoutes = require('./api/tournamentRoutes');
const adminRoutes = require('./api/adminRoutes');
const emailRoutes = require('./api/emailRoutes');

// API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Pairings API v0.1.0',
    documentation: '/api/docs',
    health: '/health',
    endpoints: {
      auth: '/api/auth',
      tournaments: '/api/tournaments',
      admin: '/api/admin',
      emailPreferences: '/api/email-preferences'
    }
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/email-preferences', emailRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`
🚀 Server running on port ${PORT}
📍 Environment: ${process.env.NODE_ENV}
🏥 Health check: http://localhost:${PORT}/health
📚 API: http://localhost:${PORT}/api
  `);

  // Test database connection
  await testConnection();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await closePool();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  await closePool();
  process.exit(0);
});

module.exports = app;
