import PageLayout, { PageHeading, Notice, LoadingState, EmptyState } from '../components/PageLayout';
import Icon from '../components/Icon';
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, loading, error, updateQuantity, removeFromCart, cartCount, subtotal } = useCart();

  return <PageLayout><PageHeading eyebrow="GOOD CHOICES, ALL TOGETHER" title="My Cart" subtitle={`${cartCount} item${cartCount === 1 ? '' : 's'} in your cart.`} />
    {loading ? <LoadingState>Loading your cart...</LoadingState> : error ? <Notice>{error}</Notice> : cartItems.length === 0 ? <EmptyState icon="cart" title="Your cart is empty"><p>Looks like you haven't added anything yet.</p><Link to="/products" className="btn btn-primary">Browse Products<Icon name="arrow" size={18} /></Link></EmptyState> : <div className="two-column"><div className="item-list">{cartItems.map(item => {
      const product = item.product; if (!product) return null;
      return <article key={product._id} className="card cart-item">{product.image ? <img src={product.image} alt={product.name} className="item-image" /> : <div className="item-image image-placeholder"><Icon name="bag" /></div>}<div className="item-info"><h3>{product.name}</h3><span className="price">₹{product.price.toLocaleString('en-IN')}</span><p>{product.stock > 0 ? `${product.stock} units left in stock` : <span className="stock-label unavailable">Out of Stock</span>}</p><div className="item-controls"><div className="quantity-control"><button onClick={() => updateQuantity(product._id, item.quantity - 1)} disabled={item.quantity <= 1} aria-label={`Decrease quantity of ${product.name}`}><Icon name="minus" size={14} /></button><span aria-live="polite">{item.quantity}</span><button onClick={() => updateQuantity(product._id, item.quantity + 1)} disabled={item.quantity >= product.stock} aria-label={`Increase quantity of ${product.name}`}><Icon name="plus" size={14} /></button></div><button onClick={() => removeFromCart(product._id)} className="remove-button" aria-label={`Remove ${product.name} from cart`}>Remove</button></div></div><span className="price">₹{(product.price * item.quantity).toLocaleString('en-IN')}</span></article>;
    })}</div><aside className="card summary-card"><h2>Order Summary</h2><div className="summary-line"><span>Items</span><span>{cartCount}</span></div><div className="summary-total"><span>Subtotal</span><span className="price">₹{subtotal.toLocaleString('en-IN')}</span></div><Link to="/checkout" className="btn btn-primary btn-block">Proceed to Checkout<Icon name="arrow" size={18} /></Link></aside></div>}
  </PageLayout>;
};

export default Cart;
