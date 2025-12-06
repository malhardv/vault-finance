import Portfolio from '../models/Portfolio.js';

/**
 * Calculate gain/loss for an investment
 * Gain/Loss = Current Value - Initial Amount
 */
const calculateGainLoss = (currentValue, initialAmount) => {
  return currentValue - initialAmount;
};

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 * Formula: (current/initial)^(1/years) - 1
 */
const calculateCAGR = (currentValue, initialAmount, investmentDate) => {
  const now = new Date();
  const startDate = new Date(investmentDate);
  
  // Calculate years elapsed (including fractional years)
  const millisecondsPerYear = 365.25 * 24 * 60 * 60 * 1000;
  const years = (now - startDate) / millisecondsPerYear;
  
  // Avoid division by zero or negative years
  if (years <= 0) {
    return 0;
  }
  
  // Avoid division by zero for initial amount
  if (initialAmount === 0) {
    return 0;
  }
  
  // Calculate CAGR: (current/initial)^(1/years) - 1
  const cagr = Math.pow(currentValue / initialAmount, 1 / years) - 1;
  
  return cagr;
};

/**
 * Calculate portfolio allocation percentages
 */
const calculateAllocation = (investments) => {
  // Calculate total portfolio value
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  
  // Avoid division by zero
  if (totalValue === 0) {
    return investments.map(inv => ({
      ...inv,
      allocation: 0
    }));
  }
  
  // Calculate allocation percentage for each investment
  return investments.map(inv => ({
    ...inv,
    allocation: (inv.currentValue / totalValue) * 100
  }));
};

/**
 * Create a new investment
 * POST /portfolio
 */
export const createInvestment = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware
    const { investmentName, initialAmount, currentValue, investmentDate } = req.body;

    // Input validation
    if (!investmentName || initialAmount === undefined || currentValue === undefined || !investmentDate) {
      return res.status(400).json({
        success: false,
        message: 'Investment name, initial amount, current value, and investment date are required'
      });
    }

    // Validate amounts
    if (typeof initialAmount !== 'number' || initialAmount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Initial amount must be a non-negative number'
      });
    }

    if (typeof currentValue !== 'number' || currentValue < 0) {
      return res.status(400).json({
        success: false,
        message: 'Current value must be a non-negative number'
      });
    }

    // Validate investmentDate
    const parsedDate = new Date(investmentDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid investment date format'
      });
    }

    // Create investment
    const investment = new Portfolio({
      userId,
      investmentName,
      initialAmount,
      currentValue,
      investmentDate: parsedDate
    });

    await investment.save();

    res.status(201).json({
      success: true,
      message: 'Investment created successfully',
      data: investment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get portfolio with calculations
 * GET /portfolio
 */
export const getPortfolio = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware

    // Fetch all investments for the user
    const investments = await Portfolio.find({ userId }).lean();

    // Calculate gain/loss and CAGR for each investment
    const investmentsWithCalculations = investments.map(inv => {
      const gainLoss = calculateGainLoss(inv.currentValue, inv.initialAmount);
      const cagr = calculateCAGR(inv.currentValue, inv.initialAmount, inv.investmentDate);
      
      return {
        ...inv,
        gainLoss,
        cagr: cagr * 100 // Convert to percentage
      };
    });

    // Calculate portfolio allocation percentages
    const portfolioWithAllocation = calculateAllocation(investmentsWithCalculations);

    res.json({
      success: true,
      data: portfolioWithAllocation
    });
  } catch (error) {
    next(error);
  }
};
