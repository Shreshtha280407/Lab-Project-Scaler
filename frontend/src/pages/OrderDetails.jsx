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
      <div style={{ fontFamily: 'sans-serif' }}>
        <Navbar />
        <div style={{ padding: '50px', textAlign: 'center', fontSize: '18px' }}>
          Loading order details...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ fontFamily: 'sans-serif' }}>
        <Navbar />
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <p style={{ color: 'red', fontSize: '18px' }}>{error || 'Order not found'}</p>
          <Link to="/orders" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>
        {order.status === 'PLACED' && (
          <div style={{ background: '#d4edda', color: '#155724', padding: '20px', borderRadius: '8px', marginBottom: '30px', textAlign: 'center', border: '1px solid #c3e6cb' }}>
            <h2 style={{ margin: '0 0 10px 0' }}>✅ Order Placed Successfully</h2>
            <p style={{ margin: 0 }}>Your order has been saved successfully.</p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Order Details</h2>
          <Link to="/orders" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
            &larr; View All Orders
          </Link>
        </div>

        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', marginBottom: '30px', background: '#f8f9fa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#666' }}>Order ID</p>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{order._id}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 5px 0', color: '#666' }}>Date Placed</p>
              <p style={{ margin: 0, fontWeight: 'bold' }}>
                {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#666' }}>Total Amount</p>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>₹{order.totalAmount}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 5px 0', color: '#666' }}>Status</p>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{order.status}</p>
            </div>
          </div>
        </div>

        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Shipping Address</h3>
        <div style={{ marginBottom: '30px', color: '#333', lineHeight: '1.6' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{order.shippingAddress.fullName}</p>
          <p style={{ margin: 0 }}>{order.shippingAddress.addressLine1}</p>
          <p style={{ margin: 0 }}>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
          <p style={{ margin: 0 }}>Phone: {order.shippingAddress.phone}</p>
        </div>

        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Order Items</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {order.items.map((item) => (
            <div key={item._id} style={{ display: 'flex', gap: '15px', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', alignItems: 'center' }}>
              {item.image && (
                <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
              )}
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
                <p style={{ margin: 0, color: '#666' }}>Qty: {item.quantity}</p>
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link to="/products" style={{ display: 'inline-block', padding: '12px 24px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
