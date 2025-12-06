import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import categoryRuleRoutes from './routes/categoryRuleRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Root endpoint - API welcome message (must be before other routes)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Vault Finance API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/auth/login, /auth/register',
      transactions: '/transactions',
      budget: '/budget',
      subscriptions: '/subscriptions',
      portfolio: '/portfolio',
      dashboard: '/dashboard/*',
      categoryRules: '/category-rules'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Favicon handler - silently ignore favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/favicon.png', (req, res) => res.status(204).end());

// API Routes
app.use('/auth', authRoutes);
app.use('/', transactionRoutes);
app.use('/', budgetRoutes);
app.use('/', subscriptionRoutes);
app.use('/', portfolioRoutes);
app.use('/', dashboardRoutes);
app.use('/', categoryRuleRoutes);

// 404 handler for undefined routes (must be after all other routes)
app.use(notFoundHandler);

// Global error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
