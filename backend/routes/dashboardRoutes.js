import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getCategorySpending,
  getMonthlyTrends,
  getIncomeExpense
} from '../controllers/dashboardController.js';

const router = express.Router();

// GET /dashboard/category-spending - Get category spending for pie charts (protected)
router.get('/dashboard/category-spending', authMiddleware, getCategorySpending);

// GET /dashboard/monthly-trends - Get monthly spending trends for line charts (protected)
router.get('/dashboard/monthly-trends', authMiddleware, getMonthlyTrends);

// GET /dashboard/income-expense - Get income vs expense for bar charts (protected)
router.get('/dashboard/income-expense', authMiddleware, getIncomeExpense);

export default router;
