import { NavLink } from 'react-router-dom';
import Brand from './Brand';
import ThemeToggle from './ThemeToggle';
import Icon from './Icon';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const handleLogout = async () => {
    try {
      await api.post('/customers/logout');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed');
    }
  };

  return <nav className="site-nav" aria-label="Main navigation"><div className="nav-inner">
    <Brand />
    <div className="nav-links">
      <NavLink to="/products" className="nav-link"><Icon name="grid" size={18} />Products</NavLink>
      <NavLink to="/wishlist" className="nav-link"><Icon name="heart" size={18} />Wishlist</NavLink>
      <NavLink to="/orders" className="nav-link"><Icon name="box" size={18} />Orders</NavLink>
      <NavLink to="/cart" className="nav-link"><Icon name="cart" size={18} />Cart{cartCount > 0 && <span className="cart-count">{cartCount}</span>}</NavLink>
    </div>
    <div className="nav-actions"><ThemeToggle /><button onClick={handleLogout} className="logout-button"><Icon name="logout" size={17} />Logout</button></div>
  </div></nav>;
};

export default Navbar;
