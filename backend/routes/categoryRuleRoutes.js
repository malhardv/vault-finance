import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { 
  getCategoryRules, 
  createCategoryRule, 
  updateCategoryRule, 
  deleteCategoryRule 
} from '../controllers/categoryRuleController.js';

const router = express.Router();

// GET /category-rules - Get all category rules (protected)
router.get('/category-rules', authMiddleware, getCategoryRules);

// POST /category-rules - Create a new category rule (protected)
router.post('/category-rules', authMiddleware, createCategoryRule);

// PUT /category-rules/:id - Update a category rule (protected)
router.put('/category-rules/:id', authMiddleware, updateCategoryRule);

// DELETE /category-rules/:id - Delete a category rule (protected)
router.delete('/category-rules/:id', authMiddleware, deleteCategoryRule);

export default router;
