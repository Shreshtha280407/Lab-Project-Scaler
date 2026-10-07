import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setCartItems(data.cart || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId) => {
    try {
      const { data } = await api.post(`/cart/${productId}`);
      setCartItems(data.cart);
      return { success: true };
    } catch (err) {
      console.error('Failed to add to cart:', err);
      return { success: false, message: err.response?.data?.message || 'Failed to add to cart' };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await api.patch(`/cart/${productId}`, { quantity });
      setCartItems(data.cart);
      return { success: true };
    } catch (err) {
      console.error('Failed to update quantity:', err);
      return { success: false, message: err.response?.data?.message || 'Failed to update quantity' };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      setCartItems(data.cart);
      return { success: true };
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      return { success: false, message: err.response?.data?.message || 'Failed to remove from cart' };
    }
  };

  // Derived values
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => {
    // Some cart items might not have their product populated if it was deleted, but we handle it
    const price = item.product?.price || 0;
    return acc + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      error,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      cartCount,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
