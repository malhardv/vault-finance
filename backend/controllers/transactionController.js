import Transaction from '../models/Transaction.js';
import { categorizeTransaction } from '../utils/categorizer.js';

/**
 * Create a new transaction manually
 * POST /transactions
 */
export const createTransaction = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware
    const { date, description, amount, type, category } = req.body;

    // Validation
    if (!date || !description || !amount || !type) {
      return res.status(400).json({
        success: false,
        message: 'Date, description, amount, and type are required'
      });
    }

    // Validate type
    if (!['debit', 'credit'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "debit" or "credit"'
      });
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    // Auto-categorize if category not provided
    let finalCategory = category;
    if (!finalCategory) {
      finalCategory = await categorizeTransaction(description);
    }

    // Create transaction
    const transaction = new Transaction({
      userId,
      date: new Date(date),
      description,
      amount: parseFloat(amount),
      type,
      category: finalCategory
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get transactions with pagination
 * GET /transactions?page=1&limit=20
 */
export const getTransactions = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware
    
    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Fetch transactions ordered by date descending
    const transactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination metadata
    const totalCount = await Transaction.countDocuments({ userId });
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a transaction
 * PUT /transactions/:id
 */
export const updateTransaction = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware
    const { id } = req.params;
    const { date, description, amount, type, category } = req.body;

    // Find transaction
    const transaction = await Transaction.findOne({ _id: id, userId });
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Validate type if provided
    if (type && !['debit', 'credit'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "debit" or "credit"'
      });
    }

    // Validate amount if provided
    if (amount !== undefined && (isNaN(amount) || amount <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    // Update fields
    if (date) transaction.date = new Date(date);
    if (description) transaction.description = description;
    if (amount) transaction.amount = parseFloat(amount);
    if (type) transaction.type = type;
    if (category) transaction.category = category;

    await transaction.save();

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a transaction
 * DELETE /transactions/:id
 */
export const deleteTransaction = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware
    const { id } = req.params;

    // Find and delete transaction
    const transaction = await Transaction.findOneAndDelete({ _id: id, userId });
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get monthly summary with aggregation
 * GET /transactions/monthly-summary?month=2024-01
 */
export const getMonthlySummary = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware
    const { month } = req.query; // Format: YYYY-MM

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid month format. Use YYYY-MM format (e.g., 2024-01)'
      });
    }

    // Parse month
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    // Fetch all transactions for the month
    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    // Calculate total spending (debits) and income (credits)
    let totalSpending = 0;
    let totalIncome = 0;
    const categorySpending = {};
    let weekdaySpending = 0;
    let weekendSpending = 0;

    transactions.forEach(txn => {
      if (txn.type === 'debit') {
        totalSpending += txn.amount;
        
        // Category spending
        if (!categorySpending[txn.category]) {
          categorySpending[txn.category] = 0;
        }
        categorySpending[txn.category] += txn.amount;
        
        // Weekday vs weekend spending
        const dayOfWeek = txn.date.getDay(); // 0 = Sunday, 6 = Saturday
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          weekendSpending += txn.amount;
        } else {
          weekdaySpending += txn.amount;
        }
      } else if (txn.type === 'credit') {
        totalIncome += txn.amount;
      }
    });

    // Calculate month-over-month change
    const previousMonth = new Date(year, monthNum - 2, 1);
    const previousMonthEnd = new Date(year, monthNum - 1, 0, 23, 59, 59, 999);
    
    const previousTransactions = await Transaction.find({
      userId,
      date: { $gte: previousMonth, $lte: previousMonthEnd },
      type: 'debit'
    });

    const previousMonthSpending = previousTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );

    let monthOverMonthChange = 0;
    if (previousMonthSpending > 0) {
      monthOverMonthChange = 
        ((totalSpending - previousMonthSpending) / previousMonthSpending) * 100;
    }

    res.json({
      success: true,
      data: {
        month,
        totalSpending,
        totalIncome,
        netBalance: totalIncome - totalSpending,
        categorySpending,
        weekdaySpending,
        weekendSpending,
        monthOverMonthChange: parseFloat(monthOverMonthChange.toFixed(2)),
        transactionCount: transactions.length
      }
    });
  } catch (error) {
    next(error);
  }
};

