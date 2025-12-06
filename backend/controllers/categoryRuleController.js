import CategoryRule from '../models/CategoryRule.js';

/**
 * Get all category rules
 * GET /category-rules
 */
export const getCategoryRules = async (req, res, next) => {
  try {
    const categoryRules = await CategoryRule.find().sort({ priority: -1, keyword: 1 });
    
    res.json({
      success: true,
      data: categoryRules
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new category rule
 * POST /category-rules
 */
export const createCategoryRule = async (req, res, next) => {
  try {
    const { keyword, category, priority } = req.body;

    // Validate required fields
    if (!keyword || !category) {
      return res.status(400).json({
        success: false,
        message: 'Keyword and category are required'
      });
    }

    // Check if keyword already exists
    const existingRule = await CategoryRule.findOne({ keyword: keyword.toLowerCase() });
    if (existingRule) {
      return res.status(409).json({
        success: false,
        message: 'A rule with this keyword already exists'
      });
    }

    const categoryRule = await CategoryRule.create({
      keyword,
      category,
      priority: priority || 0
    });

    res.status(201).json({
      success: true,
      data: categoryRule
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a category rule
 * PUT /category-rules/:id
 */
export const updateCategoryRule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { keyword, category, priority } = req.body;

    // Find the category rule
    const categoryRule = await CategoryRule.findById(id);
    if (!categoryRule) {
      return res.status(404).json({
        success: false,
        message: 'Category rule not found'
      });
    }

    // If keyword is being changed, check if new keyword already exists
    if (keyword && keyword.toLowerCase() !== categoryRule.keyword) {
      const existingRule = await CategoryRule.findOne({ keyword: keyword.toLowerCase() });
      if (existingRule) {
        return res.status(409).json({
          success: false,
          message: 'A rule with this keyword already exists'
        });
      }
    }

    // Update fields
    if (keyword) categoryRule.keyword = keyword;
    if (category) categoryRule.category = category;
    if (priority !== undefined) categoryRule.priority = priority;

    await categoryRule.save();

    res.json({
      success: true,
      data: categoryRule
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a category rule
 * DELETE /category-rules/:id
 */
export const deleteCategoryRule = async (req, res, next) => {
  try {
    const { id } = req.params;

    const categoryRule = await CategoryRule.findByIdAndDelete(id);
    if (!categoryRule) {
      return res.status(404).json({
        success: false,
        message: 'Category rule not found'
      });
    }

    res.json({
      success: true,
      message: 'Category rule deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
