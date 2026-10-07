import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();

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
