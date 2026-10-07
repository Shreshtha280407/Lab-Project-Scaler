import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  createPaymentOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
} from '../controllers/order.controller.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMyOrders);

router.route('/create-payment-order')
  .post(createPaymentOrder);

router.route('/verify-payment')
  .post(verifyPayment);

router.route('/:id')
  .get(getOrderById);

export default router;
