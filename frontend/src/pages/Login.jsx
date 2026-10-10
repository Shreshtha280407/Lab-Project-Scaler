import AuthLayout from '../components/AuthLayout';
import { Notice } from '../components/PageLayout';
import Icon from '../components/Icon';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/customers/login', formData);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Credentials');
    }
  };

  return <AuthLayout><p className="eyebrow">WELCOME BACK</p><h2>Good to see you.</h2><p className="auth-description">Login to discover your next favourite find.</p>
    {error && <Notice>{error}</Notice>}
    <form onSubmit={handleSubmit} className="auth-fields">
      <div><label htmlFor="login-email">Email address</label><input id="login-email" type="email" name="email" autoComplete="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required /></div>
      <div><label htmlFor="login-password">Password</label><input id="login-password" type="password" name="password" autoComplete="current-password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required /></div>
      <button type="submit" className="btn btn-primary btn-block">Login<Icon name="arrow" size={18} /></button>
    </form><p className="auth-switch">Don't have an account? <Link to="/register">Register</Link></p>
  </AuthLayout>;
};

export default Login;
