import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import inquiryRoutes from './routes/inquiry.routes.js';
import offerRoutes from './routes/offer.routes.js';
import customerProfileRoutes from './routes/customerProfile.routes.js';
import mockDataRoutes from './routes/mockData.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

const app = express();
const PORT = 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/customer-profiles', customerProfileRoutes);
app.use('/api', mockDataRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Backend server running on http://localhost:${PORT}`);
  logger.info(`📊 API endpoints:`);
  logger.info(`   - GET  /api/inquiries`);
  logger.info(`   - POST /api/inquiries`);
  logger.info(`   - GET  /api/offers`);
  logger.info(`   - POST /api/offers`);
  logger.info(`   - GET  /api/customer-profiles`);
  logger.info(`   - PUT  /api/customer-profiles/:clientId`);
  logger.info(`   - GET  /api/clients`);
  logger.info(`   - GET  /api/products`);
  logger.info(`   - GET  /api/templates`);
  logger.info(`   - GET  /health`);
});
