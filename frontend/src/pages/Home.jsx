import PageLayout, { PageHeading, Notice, LoadingState, EmptyState } from '../components/PageLayout';
import Icon from '../components/Icon';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

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

  if (loading) return <PageLayout><LoadingState>{error || 'Loading profile...'}</LoadingState></PageLayout>;
  return <PageLayout><div className="profile-welcome"><div className="avatar">{customer.fullName.charAt(0).toUpperCase()}</div><div><p className="eyebrow">MAKE YOURSELF AT HOME</p><h1>Welcome, {customer.fullName}.</h1><p>Good things are waiting to be discovered.</p></div></div>
    <section className="card profile-card"><h2 className="section-title"><Icon name="user" />Your Profile</h2><dl className="profile-details"><div><dt>Full Name</dt><dd>{customer.fullName}</dd></div><div><dt>Email Address</dt><dd>{customer.email}</dd></div><div><dt>Phone Number</dt><dd>{customer.phone}</dd></div></dl><Link to="/products" className="btn btn-primary">Start Shopping<Icon name="arrow" size={18} /></Link></section>
  </PageLayout>;
};

export default Home;
