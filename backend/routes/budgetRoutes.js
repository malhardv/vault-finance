import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createBudget, getBudget } from '../controllers/budgetController.js';

const router = express.Router();

// POST /budget - Create or update budget (protected)
router.post('/budget', authMiddleware, createBudget);

// GET /budget - Get budget with spending calculations (protected)
router.get('/budget', authMiddleware, getBudget);

export default router;
