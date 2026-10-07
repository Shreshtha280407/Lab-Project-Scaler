import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.order);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('Unable to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="page-container" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading order details...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <Navbar />
        <div className="page-container" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ padding: '1rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '0.5rem', marginBottom: '1.5rem', fontWeight: '500' }}>
            {error || 'Order not found'}
          </div>
          <Link to="/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="page-container" style={{ maxWidth: '800px' }}>
        {order.status === 'PLACED' && (
          <div style={{ background: 'var(--success-bg)', color: '#065F46', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', textAlign: 'center', border: '1px solid #A7F3D0' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Order Placed Successfully
            </h2>
            <p style={{ margin: 0, opacity: 0.9 }}>Your order has been saved successfully.</p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="page-title" style={{ margin: 0 }}>Order Details</h2>
          <Link to="/orders" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            &larr; All Orders
          </Link>
        </div>

        <div className="card" style={{ marginBottom: '2rem', background: '#f9fafb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Order ID</div>
              <div style={{ fontWeight: '600', fontFamily: 'monospace', fontSize: '1.1rem' }}>{order._id}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Date Placed</div>
              <div style={{ fontWeight: '600' }}>
                {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Amount</div>
              <div style={{ fontWeight: '700', fontSize: '1.5rem' }}>₹{order.totalAmount}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Status</div>
              <span className={`badge ${order.status === 'PLACED' ? 'badge-success' : 'badge-neutral'}`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>

        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Shipping Address</h3>
        <div style={{ marginBottom: '2rem', color: 'var(--text-color)', lineHeight: '1.6', background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
          <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{order.shippingAddress.fullName}</div>
          <div>{order.shippingAddress.addressLine1}</div>
          <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</div>
          <div style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Phone: {order.shippingAddress.phone}</div>
        </div>

        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Order Items</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {order.items.map((item) => (
            <div key={item._id} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
              {item.image ? (
                <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }} />
              ) : (
                <div style={{ width: '80px', height: '80px', background: 'var(--border-color)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No Image</div>
              )}
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{item.name}</h4>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Qty: {item.quantity}</div>
              </div>
              <div style={{ fontWeight: '700', fontSize: '1.25rem' }}>
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
