import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchWishlistCount = async () => {
    try {
      const { data } = await api.get('/wishlist');
      setWishlistCount(data.wishlist.length);
    } catch (error) {
      console.error('Failed to fetch wishlist count', error);
    }
  };

  useEffect(() => {
    fetchWishlistCount();

    const handleWishlistUpdate = () => fetchWishlistCount();
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/customers/logout');
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <nav style={{ background: '#333', color: '#fff', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0 }}>
        <Link to="/home" style={{ color: '#fff', textDecoration: 'none' }}>ShopKart</Link>
      </h2>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/products" style={{ color: '#fff', textDecoration: 'none' }}>Shop</Link>
        <Link to="/wishlist" style={{ color: '#fff', textDecoration: 'none' }}>
          Wishlist <span style={{ background: '#ff4757', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', marginLeft: '5px' }}>{wishlistCount}</span>
        </Link>
        <button 
          onClick={handleLogout} 
          style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
