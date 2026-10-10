import PageLayout, { PageHeading, Notice, LoadingState, EmptyState } from '../components/PageLayout';
import Icon from '../components/Icon';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

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

  return <PageLayout><PageHeading eyebrow="GOOD FINDS, ON THEIR WAY" title="My Orders" subtitle="A home for everything you've ordered." />
    {loading ? <LoadingState>Loading your orders...</LoadingState> : error ? <Notice>{error}</Notice> : orders.length === 0 ? <EmptyState icon="box" title="You haven't placed any orders yet."><Link to="/products" className="btn btn-primary">Start Shopping<Icon name="arrow" size={18} /></Link></EmptyState> : <div className="orders-list">{orders.map(order => <article key={order._id} className="card"><div className="order-card-top"><div><h2>Order #{order._id.slice(-8).toUpperCase()}</h2><span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div><div><span className="price">₹{order.totalAmount.toLocaleString('en-IN')}</span><span className={`badge ${order.status === 'PLACED' ? 'badge-success' : 'badge-neutral'}`}>{order.status}</span></div></div><div className="order-card-bottom"><div className="order-preview">{order.items.slice(0,2).map(item => <div key={item._id}><span>{item.quantity}x</span><span>{item.name}</span></div>)}{order.items.length > 2 && <p className="text-muted text-small">+ {order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}</p>}</div><Link to={`/orders/${order._id}`} className="btn btn-outline">View Details<Icon name="arrow" size={16} /></Link></div></article>)}</div>}
  </PageLayout>;
};

export default Orders;
