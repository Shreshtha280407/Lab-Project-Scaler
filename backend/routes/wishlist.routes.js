import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  toggleWishlist,
} from '../controllers/wishlist.controller.js';

const router = express.Router();

// All wishlist routes should be protected
router.use(protect);

router.route('/')
  .get(getWishlist);

router.route('/:productId')
  .post(addToWishlist)
  .delete(removeFromWishlist);

router.route('/:productId/toggle')
  .patch(toggleWishlist);

export default router;
