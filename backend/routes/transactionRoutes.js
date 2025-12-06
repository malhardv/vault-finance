import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getMonthlySummary
} from '../controllers/transactionController.js';

const router = express.Router();

// POST /transactions - Create a new transaction (protected)
router.post('/transactions', authMiddleware, createTransaction);

// GET /transactions - Get transactions with pagination (protected)
router.get('/transactions', authMiddleware, getTransactions);

// PUT /transactions/:id - Update a transaction (protected)
router.put('/transactions/:id', authMiddleware, updateTransaction);

// DELETE /transactions/:id - Delete a transaction (protected)
router.delete('/transactions/:id', authMiddleware, deleteTransaction);

// GET /transactions/monthly-summary - Get monthly summary (protected)
router.get('/transactions/monthly-summary', authMiddleware, getMonthlySummary);

export default router;

