import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { 
  createSubscription, 
  getSubscriptions, 
  updateSubscription, 
  deleteSubscription 
} from '../controllers/subscriptionController.js';

const router = express.Router();

// POST /subscriptions - Create a new subscription (protected)
router.post('/subscriptions', authMiddleware, createSubscription);

// GET /subscriptions - Get all subscriptions (protected)
router.get('/subscriptions', authMiddleware, getSubscriptions);

// PUT /subscriptions/:id - Update a subscription (protected)
router.put('/subscriptions/:id', authMiddleware, updateSubscription);

// DELETE /subscriptions/:id - Delete a subscription (protected)
router.delete('/subscriptions/:id', authMiddleware, deleteSubscription);

export default router;
