import Transaction from '../models/Transaction.js';

/**
 * Get category spending data formatted for pie charts
 * GET /dashboard/category-spending?month=2024-01
 */
export const getCategorySpending = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware
    const { month } = req.query;

    // Input validation
    if (!month) {
      return res.status(400).json({
        success: false,
        message: 'Month parameter is required (format: YYYY-MM)'
      });
    }

    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        success: false,
        message: 'Month must be in YYYY-MM format'
      });
    }

    // Parse month to get date range
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    // Fetch all debit transactions for the month
    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
      type: 'debit'
    });

    // Aggregate spending by category
    const categorySpending = {};
    transactions.forEach(txn => {
      if (!categorySpending[txn.category]) {
        categorySpending[txn.category] = 0;
      }
      categorySpending[txn.category] += txn.amount;
    });

    // Format data for pie chart: array of objects with 'category' and 'amount' fields
    const pieChartData = Object.entries(categorySpending).map(([category, amount]) => ({
      category,
      amount: parseFloat(amount.toFixed(2))
    }));

    // Sort by amount descending for better visualization
    pieChartData.sort((a, b) => b.amount - a.amount);

    res.json({
      success: true,
      data: {
        month,
        categorySpending: pieChartData
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get monthly spending trends formatted for line charts
 * GET /dashboard/monthly-trends?months=6
 */
export const getMonthlyTrends = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware
    const months = parseInt(req.query.months) || 6; // Default to 6 months

    // Validate months parameter
    if (months < 1 || months > 24) {
      return res.status(400).json({
        success: false,
        message: 'Months parameter must be between 1 and 24'
      });
    }

    // Calculate date range for the specified number of months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    // Fetch all transactions in the date range
    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    // Aggregate spending by month
    const monthlyData = {};

    transactions.forEach(txn => {
      const monthKey = `${txn.date.getFullYear()}-${String(txn.date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          income: 0,
          spending: 0
        };
      }

      if (txn.type === 'debit') {
        monthlyData[monthKey].spending += txn.amount;
      } else if (txn.type === 'credit') {
        monthlyData[monthKey].income += txn.amount;
      }
    });

    // Format data for line chart: array of objects with 'month' and 'amount' fields
    const lineChartData = [];
    
    // Generate all months in the range (even if no transactions)
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      
      lineChartData.push({
        month: monthKey,
        amount: parseFloat((monthlyData[monthKey]?.spending || 0).toFixed(2))
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    res.json({
      success: true,
      data: {
        monthlyTrends: lineChartData
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get income vs expense data formatted for bar charts
 * GET /dashboard/income-expense?months=6
 */
export const getIncomeExpense = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware
    const months = parseInt(req.query.months) || 6; // Default to 6 months

    // Validate months parameter
    if (months < 1 || months > 24) {
      return res.status(400).json({
        success: false,
        message: 'Months parameter must be between 1 and 24'
      });
    }

    // Calculate date range for the specified number of months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    // Fetch all transactions in the date range
    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    // Aggregate income and expense by month
    const monthlyData = {};

    transactions.forEach(txn => {
      const monthKey = `${txn.date.getFullYear()}-${String(txn.date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          income: 0,
          expense: 0
        };
      }

      if (txn.type === 'debit') {
        monthlyData[monthKey].expense += txn.amount;
      } else if (txn.type === 'credit') {
        monthlyData[monthKey].income += txn.amount;
      }
    });

    // Format data for bar chart: object with 'income' and 'expense' arrays
    const income = [];
    const expense = [];
    
    // Generate all months in the range (even if no transactions)
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      
      income.push({
        month: monthKey,
        amount: parseFloat((monthlyData[monthKey]?.income || 0).toFixed(2))
      });

      expense.push({
        month: monthKey,
        amount: parseFloat((monthlyData[monthKey]?.expense || 0).toFixed(2))
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    res.json({
      success: true,
      data: {
        income,
        expense
      }
    });
  } catch (error) {
    next(error);
  }
};
