import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/wishlist');
      setWishlist(data.wishlist);
    } catch (err) {
      setError('Failed to load wishlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlist(prev => prev.filter(item => item._id !== productId));
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (err) {
      console.error('Failed to remove from wishlist', err);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
        <h2>My Wishlist</h2>
        <p>{wishlist.length} products saved</p>

        {loading && <p style={{ textAlign: 'center', fontSize: '18px' }}>Loading wishlist...</p>}
        {error && <p style={{ textAlign: 'center', color: 'red', fontSize: '18px' }}>{error}</p>}
        
        {!loading && !error && wishlist.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p style={{ fontSize: '18px', color: '#555' }}>Your wishlist is empty.</p>
            <Link to="/products" style={{ background: '#007bff', color: 'white', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block', marginTop: '10px' }}>
              Continue Shopping
            </Link>
          </div>
        )}

        {!loading && !error && wishlist.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {wishlist.map(product => (
              <div key={product._id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
                <h3 style={{ margin: '0' }}>{product.name}</h3>
                <span style={{ fontSize: '12px', color: '#666', background: '#eee', padding: '4px 8px', borderRadius: '12px', width: 'fit-content' }}>
                  {product.category}
                </span>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>₹{product.price}</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <Link 
                    to={`/products/${product._id}`} 
                    style={{ flex: 1, textAlign: 'center', background: '#007bff', color: 'white', padding: '10px', borderRadius: '4px', textDecoration: 'none' }}
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRemove(product._id)}
                    style={{
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #dc3545',
                      background: 'white',
                      color: '#dc3545',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
