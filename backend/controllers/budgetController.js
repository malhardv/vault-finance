import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';

/**
 * Create or update budget for a specific month
 * POST /budget
 */
export const createBudget = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware
    const { month, totalBudget, categoryBudgets } = req.body;

    // Input validation
    if (!month || !totalBudget) {
      return res.status(400).json({
        success: false,
        message: 'Month and total budget are required'
      });
    }

    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        success: false,
        message: 'Month must be in YYYY-MM format'
      });
    }

    // Validate totalBudget is a positive number
    if (typeof totalBudget !== 'number' || totalBudget < 0) {
      return res.status(400).json({
        success: false,
        message: 'Total budget must be a non-negative number'
      });
    }

    // Validate categoryBudgets if provided
    if (categoryBudgets) {
      if (!Array.isArray(categoryBudgets)) {
        return res.status(400).json({
          success: false,
          message: 'Category budgets must be an array'
        });
      }

      for (const catBudget of categoryBudgets) {
        if (!catBudget.category || typeof catBudget.limit !== 'number' || catBudget.limit < 0) {
          return res.status(400).json({
            success: false,
            message: 'Each category budget must have a category name and non-negative limit'
          });
        }
      }
    }

    // Check if budget already exists for this user and month
    const existingBudget = await Budget.findOne({ userId, month });

    let budget;
    if (existingBudget) {
      // Update existing budget
      existingBudget.totalBudget = totalBudget;
      existingBudget.categoryBudgets = categoryBudgets || [];
      budget = await existingBudget.save();
    } else {
      // Create new budget
      budget = new Budget({
        userId,
        month,
        totalBudget,
        categoryBudgets: categoryBudgets || []
      });
      await budget.save();
    }

    res.status(201).json({
      success: true,
      message: 'Budget saved successfully',
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get budget for a specific month with spending calculations
 * GET /budget?month=2024-01
 */
export const getBudget = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware
    const { month } = req.query;

    // Input validation
    if (!month) {
      return res.status(400).json({
        success: false,
        message: 'Month parameter is required'
      });
    }

    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        success: false,
        message: 'Month must be in YYYY-MM format'
      });
    }

    // Find budget for the specified month
    const budget = await Budget.findOne({ userId, month });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'No budget found for the specified month'
      });
    }

    // Calculate current spending for the month
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    // Fetch all debit transactions for the month
    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
      type: 'debit'
    });

    // Calculate total spending
    const totalSpending = transactions.reduce((sum, txn) => sum + txn.amount, 0);

    // Calculate category-wise spending
    const categorySpending = {};
    transactions.forEach(txn => {
      if (!categorySpending[txn.category]) {
        categorySpending[txn.category] = 0;
      }
      categorySpending[txn.category] += txn.amount;
    });

    // Calculate budget status with warnings and exceeded flags
    const categoryBudgetStatus = budget.categoryBudgets.map(catBudget => {
      const spent = categorySpending[catBudget.category] || 0;
      const percentageUsed = (spent / catBudget.limit) * 100;
      
      return {
        category: catBudget.category,
        limit: catBudget.limit,
        spent,
        remaining: Math.max(0, catBudget.limit - spent),
        percentageUsed: parseFloat(percentageUsed.toFixed(2)),
        warning: percentageUsed >= 80 && percentageUsed < 100,
        exceeded: percentageUsed >= 100
      };
    });

    // Calculate overall budget status
    const totalPercentageUsed = (totalSpending / budget.totalBudget) * 100;

    res.json({
      success: true,
      data: {
        month,
        totalBudget: budget.totalBudget,
        totalSpending,
        totalRemaining: Math.max(0, budget.totalBudget - totalSpending),
        totalPercentageUsed: parseFloat(totalPercentageUsed.toFixed(2)),
        totalWarning: totalPercentageUsed >= 80 && totalPercentageUsed < 100,
        totalExceeded: totalPercentageUsed >= 100,
        categoryBudgets: categoryBudgetStatus
      }
    });
  } catch (error) {
    next(error);
  }
};
