import express from 'express';
import {registerCustomer, loginCustomer, getMe, logoutCustomer, changePassword} from '../controllers/customer.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutCustomer);
router.patch('/change-password', protect, changePassword);

export default router;
