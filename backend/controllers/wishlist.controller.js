import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const customerId = req.user._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const customer = await Customer.findById(customerId);

    // Check if already in wishlist
    if (customer.wishlist.some(id => id.toString() === productId)) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist' });
    }

    customer.wishlist.push(productId);
    await customer.save();

    res.status(200).json({ success: true, message: 'Added to wishlist', wishlist: customer.wishlist });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get current user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const customerId = req.user._id;

    const customer = await Customer.findById(customerId).populate('wishlist');
    
    res.status(200).json({ success: true, wishlist: customer.wishlist });
  } catch (error) {
    console.error('Error getting wishlist:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const customerId = req.user._id;

    const customer = await Customer.findById(customerId);

    // Filter out the product ID
    customer.wishlist = customer.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await customer.save();

    res.status(200).json({ success: true, message: 'Removed from wishlist', wishlist: customer.wishlist });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Toggle wishlist (Bonus)
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const customerId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const customer = await Customer.findById(customerId);

    const isInWishlist = customer.wishlist.some(id => id.toString() === productId);

    if (isInWishlist) {
      customer.wishlist = customer.wishlist.filter(
        (id) => id.toString() !== productId
      );
    } else {
      customer.wishlist.push(productId);
    }

    await customer.save();

    res.status(200).json({ 
      success: true, 
      message: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      isWishlisted: !isInWishlist,
      wishlist: customer.wishlist 
    });
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
