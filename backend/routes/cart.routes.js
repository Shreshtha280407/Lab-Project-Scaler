import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
} from '../controllers/cart.controller.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCart);

router.route('/:productId')
  .post(addToCart)
  .patch(updateQuantity)
  .delete(removeFromCart);

export default router;
