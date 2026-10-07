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
      <div style={{ fontFamily: 'sans-serif' }}>
        <Navbar />
        <div style={{ padding: '50px', textAlign: 'center', fontSize: '18px' }}>
          Loading your orders...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ fontFamily: 'sans-serif' }}>
        <Navbar />
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <p style={{ color: 'red', fontSize: '18px' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ fontFamily: 'sans-serif' }}>
        <Navbar />
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h2>You have not placed any orders yet.</h2>
          <Link to="/products" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>
        <h2>My Orders</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div key={order._id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>Order #{order._id}</h3>
                  <span style={{ color: '#666', fontSize: '14px' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '18px' }}>₹{order.totalAmount}</p>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    background: order.status === 'PLACED' ? '#d4edda' : '#e2e3e5',
                    color: order.status === 'PLACED' ? '#155724' : '#383d41'
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                {order.items.slice(0, 2).map((item) => (
                  <div key={item._id} style={{ marginBottom: '5px', color: '#555' }}>
                    {item.name} &times; {item.quantity}
                  </div>
                ))}
                {order.items.length > 2 && (
                  <div style={{ color: '#888', fontSize: '14px', marginTop: '5px' }}>
                    +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                  </div>
                )}
              </div>

              <Link 
                to={`/orders/${order._id}`} 
                style={{ display: 'inline-block', padding: '8px 16px', border: '1px solid #007bff', color: '#007bff', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
