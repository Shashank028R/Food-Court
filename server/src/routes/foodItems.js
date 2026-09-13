import express from 'express';
import {
  getFoodItems,
  getFoodItemBySlug,
  createFoodItem,
  updateFoodItem,
  toggleFoodStatus,
  deleteFoodItem,
} from '../controllers/foodController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getFoodItems);
router.get('/:slug', getFoodItemBySlug);
router.post('/', protect, isAdmin, createFoodItem);
router.put('/:id', protect, isAdmin, updateFoodItem);
router.patch('/:id/toggle', protect, isAdmin, toggleFoodStatus);
router.delete('/:id', protect, isAdmin, deleteFoodItem);

export default router;
