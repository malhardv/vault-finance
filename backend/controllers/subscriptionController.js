import Subscription from '../models/Subscription.js';

/**
 * Calculate next renewal date based on cycle and start date
 */
const calculateNextRenewalDate = (startDate, cycle) => {
  const date = new Date(startDate);
  const today = new Date();
  
  // Keep adding cycle periods until we get a date in the future
  while (date <= today) {
    if (cycle === 'monthly') {
      date.setMonth(date.getMonth() + 1);
    } else if (cycle === 'yearly') {
      date.setFullYear(date.getFullYear() + 1);
    }
  }
  
  return date;
};

/**
 * Create a new subscription
 * POST /subscriptions
 */
export const createSubscription = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware
    const { name, amount, cycle, startDate } = req.body;

    // Input validation
    if (!name || !amount || !cycle || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Name, amount, cycle, and start date are required'
      });
    }

    // Validate cycle
    if (!['monthly', 'yearly'].includes(cycle)) {
      return res.status(400).json({
        success: false,
        message: 'Cycle must be either "monthly" or "yearly"'
      });
    }

    // Validate amount
    if (typeof amount !== 'number' || amount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a non-negative number'
      });
    }

    // Validate startDate
    const parsedStartDate = new Date(startDate);
    if (isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid start date format'
      });
    }

    // Calculate next renewal date
    const nextRenewalDate = calculateNextRenewalDate(parsedStartDate, cycle);

    // Create subscription
    const subscription = new Subscription({
      userId,
      name,
      amount,
      cycle,
      startDate: parsedStartDate,
      nextRenewalDate
    });

    await subscription.save();

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all subscriptions for the authenticated user
 * GET /subscriptions
 */
export const getSubscriptions = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware

    // Fetch all subscriptions for the user, ordered by next renewal date (ascending)
    const subscriptions = await Subscription.find({ userId })
      .sort({ nextRenewalDate: 1 });

    res.json({
      success: true,
      data: subscriptions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a subscription
 * PUT /subscriptions/:id
 */
export const updateSubscription = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware
    const { id } = req.params;
    const { name, amount, cycle, startDate } = req.body;

    // Find subscription and verify ownership
    const subscription = await Subscription.findOne({ _id: id, userId });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    // Update fields if provided
    if (name !== undefined) subscription.name = name;
    if (amount !== undefined) {
      if (typeof amount !== 'number' || amount < 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be a non-negative number'
        });
      }
      subscription.amount = amount;
    }
    if (cycle !== undefined) {
      if (!['monthly', 'yearly'].includes(cycle)) {
        return res.status(400).json({
          success: false,
          message: 'Cycle must be either "monthly" or "yearly"'
        });
      }
      subscription.cycle = cycle;
    }
    if (startDate !== undefined) {
      const parsedStartDate = new Date(startDate);
      if (isNaN(parsedStartDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid start date format'
        });
      }
      subscription.startDate = parsedStartDate;
    }

    // Recalculate next renewal date if cycle or startDate changed
    if (cycle !== undefined || startDate !== undefined) {
      subscription.nextRenewalDate = calculateNextRenewalDate(
        subscription.startDate,
        subscription.cycle
      );
    }

    await subscription.save();

    res.json({
      success: true,
      message: 'Subscription updated successfully',
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a subscription
 * DELETE /subscriptions/:id
 */
export const deleteSubscription = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware
    const { id } = req.params;

    // Find and delete subscription, verify ownership
    const subscription = await Subscription.findOneAndDelete({ _id: id, userId });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    res.json({
      success: true,
      message: 'Subscription deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
