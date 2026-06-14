import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import v1Routes from './routes/v1';
import { swaggerSpec } from './config/swagger';
import { logger } from './config/logger';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
  if (req.originalUrl !== '/api/v1/health') {
    logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Wash API Documentation',
}));

// Apply general rate limiter to all /api routes
app.use('/api/', apiLimiter);

// API Routes
app.use('/api/v1', v1Routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, statusCode: 404, message: 'Endpoint not found' });
});

// Global error handler
app.use(errorHandler);

export default app;
