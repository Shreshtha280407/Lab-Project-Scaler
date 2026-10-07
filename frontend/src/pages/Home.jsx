import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    return <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>{error || 'Loading profile...'}</div>;
  }

  return (
    <div style={{ fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <h2>Welcome to ShopKart, {customer.fullName}!</h2>
        <p style={{ color: '#555', marginBottom: '30px' }}>You are successfully logged in.</p>
        
        <button onClick={() => navigate('/products')} style={{ display: 'inline-block', background: '#007bff', color: '#fff', padding: '12px 24px', borderRadius: '4px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          Browse Products
        </button>
        
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginTop: '40px', textAlign: 'left' }}>
          <h3 style={{ marginTop: 0 }}>Your Profile</h3>
          <p><strong>Name:</strong> {customer.fullName}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
