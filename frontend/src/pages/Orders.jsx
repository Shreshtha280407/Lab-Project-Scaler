import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data.orders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Unable to load your orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="page-container" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ color: 'var(--text-muted)' }}>Loading your orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="page-container">
          <div style={{ padding: '1rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '0.5rem', textAlign: 'center', fontWeight: '500' }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="page-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>You haven't placed any orders yet.</h2>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="page-container" style={{ maxWidth: '800px' }}>
        <h2 className="page-title">My Orders</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Order #{order._id.slice(-8).toUpperCase()}</h3>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ margin: '0 0 0.5rem 0', fontWeight: '700', fontSize: '1.25rem' }}>₹{order.totalAmount}</div>
                  <span className={`badge ${order.status === 'PLACED' ? 'badge-success' : 'badge-neutral'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {order.items.slice(0, 2).map((item) => (
                    <div key={item._id} style={{ display: 'flex', alignItems: 'center', color: 'var(--text-color)' }}>
                      <span style={{ fontWeight: '500', minWidth: '30px' }}>{item.quantity}x</span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
                {order.items.length > 2 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.75rem', fontWeight: '500' }}>
                    + {order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link to={`/orders/${order._id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
