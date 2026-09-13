import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/mine', protect, getMyOrders);
router.get('/', protect, isAdmin, getAllOrders);
router.patch('/:id/status', protect, isAdmin, updateOrderStatus);

export default router;
