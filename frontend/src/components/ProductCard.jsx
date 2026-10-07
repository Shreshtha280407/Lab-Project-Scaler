import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, initialWishlisted = false }) => {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { addToCart, cartItems } = useCart();
  
  const cartItem = cartItems.find(item => item.product?._id === product._id || item.product === product._id);
  const inCartQuantity = cartItem ? cartItem.quantity : 0;

  const toggleWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.patch(`/wishlist/${product._id}/toggle`);
      setIsWishlisted(data.isWishlisted);
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (err) {
      setError('Unable to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setCartLoading(true);
    setError('');
    const res = await addToCart(product._id);
    if (!res.success) {
      setError(res.message);
    }
    setCartLoading(false);
  };

  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative' }}>
      <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
      <h3 style={{ margin: '0' }}>{product.name}</h3>
      <span style={{ fontSize: '12px', color: '#666', background: '#eee', padding: '4px 8px', borderRadius: '12px', width: 'fit-content' }}>
        {product.category}
      </span>
      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>₹{product.price}</p>
      <p style={{ margin: 0, color: product.stock > 0 ? 'green' : 'red' }}>
        {product.stock > 0 ? `${product.stock} units left` : 'Out of Stock'}
      </p>
      {error && <p style={{ color: 'red', fontSize: '12px', margin: 0 }}>{error}</p>}
      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
        <button
          onClick={toggleWishlist}
          disabled={loading}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '4px',
            border: `1px solid ${isWishlisted ? '#ff4757' : '#ccc'}`,
            background: isWishlisted ? '#ff4757' : 'white',
            color: isWishlisted ? 'white' : '#333',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳...' : isWishlisted ? '♥ Added' : '♡ Wishlist'}
        </button>
        <button
          onClick={handleAddToCart}
          disabled={cartLoading || product.stock === 0}
          style={{
            flex: 2,
            padding: '10px',
            borderRadius: '4px',
            border: 'none',
            background: product.stock === 0 ? '#ccc' : '#007bff',
            color: 'white',
            cursor: product.stock === 0 || cartLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {cartLoading ? 'Adding...' : inCartQuantity > 0 ? 'Add Another' : 'Add to Cart'}
        </button>
      </div>
      <Link 
        to={`/products/${product._id}`} 
        style={{ textAlign: 'center', color: '#007bff', padding: '5px', borderRadius: '4px', textDecoration: 'none', fontSize: '14px' }}
      >
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
