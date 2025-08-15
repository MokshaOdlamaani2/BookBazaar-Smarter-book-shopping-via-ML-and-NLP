import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { placeOrder, getOrders } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/', protect, getOrders);

export default router;
