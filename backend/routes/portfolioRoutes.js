import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createInvestment, getPortfolio } from '../controllers/portfolioController.js';

const router = express.Router();

// POST /portfolio - Create a new investment (protected)
router.post('/portfolio', authMiddleware, createInvestment);

// GET /portfolio - Get portfolio with calculations (protected)
router.get('/portfolio', authMiddleware, getPortfolio);

export default router;
