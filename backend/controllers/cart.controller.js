import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const customerId = req.user._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const customer = await Customer.findById(customerId);

    // Find if product already in cart
    const cartItemIndex = customer.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      // Product exists, check stock
      if (customer.cart[cartItemIndex].quantity + 1 > product.stock) {
        return res.status(400).json({ success: false, message: 'Not enough stock' });
      }
      customer.cart[cartItemIndex].quantity += 1;
    } else {
      // Product does not exist, check stock
      if (1 > product.stock) {
        return res.status(400).json({ success: false, message: 'Not enough stock' });
      }
      customer.cart.push({ product: productId, quantity: 1 });
    }

    await customer.save();

    // Populate for response
    await customer.populate('cart.product');

    res.status(200).json({ success: true, message: 'Cart updated', cart: customer.cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get current user cart
export const getCart = async (req, res) => {
  try {
    const customerId = req.user._id;
    const customer = await Customer.findById(customerId).populate('cart.product');
    
    // Filter out items where the product might have been deleted from DB entirely
    const validCartItems = customer.cart.filter(item => item.product !== null);
    
    if (validCartItems.length !== customer.cart.length) {
      customer.cart = validCartItems;
      await customer.save();
    }

    res.status(200).json({ success: true, cart: customer.cart });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update product quantity
export const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const customerId = req.user._id;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ success: false, message: 'Quantity exceeds stock' });
    }

    const customer = await Customer.findById(customerId);

    const cartItemIndex = customer.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not in cart' });
    }

    customer.cart[cartItemIndex].quantity = quantity;
    await customer.save();

    await customer.populate('cart.product');

    res.status(200).json({ success: true, message: 'Cart updated', cart: customer.cart });
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Remove product from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const customerId = req.user._id;

    const customer = await Customer.findById(customerId);

    customer.cart = customer.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await customer.save();

    await customer.populate('cart.product');

    res.status(200).json({ success: true, message: 'Removed from cart', cart: customer.cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
