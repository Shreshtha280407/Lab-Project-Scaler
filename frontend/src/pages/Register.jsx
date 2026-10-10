import AuthLayout from '../components/AuthLayout';
import { Notice } from '../components/PageLayout';
import Icon from '../components/Icon';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/customers/register', formData);
      alert('Account created successfully! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return <AuthLayout register><p className="eyebrow">YOUR NEXT GOOD FIND STARTS HERE</p><h2>Create an Account</h2><p className="auth-description">A world of everyday favourites awaits.</p>
    {error && <Notice>{error}</Notice>}
    <form onSubmit={handleSubmit} className="auth-fields">
      <div><label htmlFor="register-name">Full Name</label><input id="register-name" type="text" name="fullName" autoComplete="name" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} required /></div>
      <div><label htmlFor="register-email">Email address</label><input id="register-email" type="email" name="email" autoComplete="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required /></div>
      <div><label htmlFor="register-phone">Phone Number</label><input id="register-phone" type="text" name="phone" autoComplete="tel" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} required /></div>
      <div><label htmlFor="register-password">Password</label><input id="register-password" type="password" name="password" autoComplete="new-password" placeholder="Password (min 6 chars)" value={formData.password} onChange={handleChange} required minLength="6" /></div>
      <button type="submit" className="btn btn-primary btn-block">Create Account<Icon name="arrow" size={18} /></button>
    </form><p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
  </AuthLayout>;
};

export default Register;
