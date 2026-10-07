import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ProductCard = ({ product, initialWishlisted = false }) => {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        <Link 
          to={`/products/${product._id}`} 
          style={{ flex: 1, textAlign: 'center', background: '#007bff', color: 'white', padding: '10px', borderRadius: '4px', textDecoration: 'none' }}
        >
          View Details
        </Link>
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
          {loading ? '⏳ Saving...' : isWishlisted ? '♥ Added' : '♡ Wishlist'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
