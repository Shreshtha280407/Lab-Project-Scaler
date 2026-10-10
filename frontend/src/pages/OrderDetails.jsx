import PageLayout, { PageHeading, Notice, LoadingState, EmptyState } from '../components/PageLayout';
import Icon from '../components/Icon';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

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

  if (loading) return <PageLayout><LoadingState>Loading order details...</LoadingState></PageLayout>;
  if (error || !order) return <PageLayout><Notice>{error || 'Order not found'}</Notice><Link to="/orders" className="btn btn-primary">Back to Orders</Link></PageLayout>;
  return <PageLayout>{order.status === 'PLACED' && <div className="success-banner"><Icon name="check" size={28} /><div><h2>Order Placed Successfully</h2><p>Your order has been saved successfully.</p></div></div>}<PageHeading eyebrow="EVERY LITTLE DETAIL" title="Order Details" action={<Link to="/orders" className="back-link"><Icon name="back" size={18} />All Orders</Link>} />
    <section className="card"><dl className="order-meta"><div><dt>Order ID</dt><dd className="order-id">{order._id}</dd></div><div><dt>Date Placed</dt><dd>{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</dd></div><div><dt>Total Amount</dt><dd className="price">₹{order.totalAmount.toLocaleString('en-IN')}</dd></div><div><dt>Status</dt><dd><span className={`badge ${order.status === 'PLACED' ? 'badge-success' : 'badge-neutral'}`}>{order.status}</span></dd></div></dl></section>
    <div className="order-details-grid"><section><h2 className="section-title"><Icon name="box" />Order Items</h2><div className="item-list">{order.items.map(item => <article key={item._id} className="card order-item">{item.image ? <img src={item.image} alt={item.name} className="item-image" /> : <div className="item-image image-placeholder"><Icon name="bag" /><span>No Image</span></div>}<div className="item-info"><h3>{item.name}</h3><p>Qty: {item.quantity}</p></div><span className="price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span></article>)}</div></section><section className="card shipping-card"><h2 className="section-title"><Icon name="pin" />Shipping Address</h2><h3>{order.shippingAddress.fullName}</h3><p>{order.shippingAddress.addressLine1}</p><p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p><p>Phone: {order.shippingAddress.phone}</p></section></div><div className="continue-shopping"><Link to="/products" className="btn btn-primary">Continue Shopping<Icon name="arrow" size={18} /></Link></div>
  </PageLayout>;
};

export default OrderDetails;
