import Order from '../models/order.model.js';
import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';
import razorpay from '../config/razorpay.js';
import crypto from 'crypto';

// Create Razorpay Order
export const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const customerId = req.user._id;

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Invalid shipping address' });
    }

    const customer = await Customer.findById(customerId);

    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of customer.cart) {
      const product = await Product.findById(cartItem.product);
      
      if (!product) {
        return res.status(400).json({ success: false, message: 'Product in cart no longer exists' });
      }

      if (cartItem.quantity > product.stock) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = product.price * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        image: product.image,
      });
    }

    // Create ShopKart pending order
    const order = new Order({
      user: customerId,
      items: orderItems,
      shippingAddress,
      totalAmount,
    });

    await order.save();

    // Create Razorpay Order in paise
    const amountInPaise = Math.round(totalAmount * 100);

    const razorpayOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: order._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(razorpayOptions);

    // Save Razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      success: true,
      shopKartOrderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    });
  } catch (error) {
    console.error('Error creating payment order:', error.stack || error.response || error);
    res.status(500).json({ success: false, message: 'Server error: ' + (error.message || JSON.stringify(error)) });
  }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const customerId = req.user._id;

    const order = await Order.findOne({ _id: shopKartOrderId, user: customerId });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ success: false, message: 'Invalid order ID' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Payment successful
    order.paymentStatus = 'PAID';
    order.status = 'PLACED';
    order.razorpayPaymentId = razorpay_payment_id;

    // Deduct stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    await order.save();

    // Clear user cart
    const customer = await Customer.findById(customerId);
    customer.cart = [];
    await customer.save();

    res.status(200).json({ success: true, message: 'Payment verified and order placed', order });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + (error.message || JSON.stringify(error)) });
  }
};

// Get My Orders
export const getMyOrders = async (req, res) => {
  try {
    const customerId = req.user._id;
    const orders = await Order.find({ user: customerId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + (error.message || JSON.stringify(error)) });
  }
};

// Get Single Order
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user._id;

    const order = await Order.findOne({ _id: id, user: customerId });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error fetching single order:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + (error.message || JSON.stringify(error)) });
  }
};
