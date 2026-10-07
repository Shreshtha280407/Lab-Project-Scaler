import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Home = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/customers/me');
        setCustomer(response.data);
        setLoading(false);
      } catch (err) {
        setError('Not authorized, redirecting...');
        setTimeout(() => navigate('/login'), 1500);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="page-container" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          {error || 'Loading profile...'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="page-container" style={{ maxWidth: '600px', marginTop: '4rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            {customer.fullName.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', marginTop: 0 }}>Welcome back, {customer.fullName}!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You are successfully logged in to ShopKart.</p>
          
          <Link to="/products" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
            Start Shopping
          </Link>
          
          <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '0.5rem', marginTop: '3rem', textAlign: 'left', border: '1px solid var(--border-color)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-color)' }}>Your Profile Details</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex' }}>
                <span style={{ color: 'var(--text-muted)', width: '80px' }}>Name:</span>
                <span style={{ fontWeight: '500' }}>{customer.fullName}</span>
              </div>
              <div style={{ display: 'flex' }}>
                <span style={{ color: 'var(--text-muted)', width: '80px' }}>Email:</span>
                <span style={{ fontWeight: '500' }}>{customer.email}</span>
              </div>
              <div style={{ display: 'flex' }}>
                <span style={{ color: 'var(--text-muted)', width: '80px' }}>Phone:</span>
                <span style={{ fontWeight: '500' }}>{customer.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
