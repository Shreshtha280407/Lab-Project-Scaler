import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Cart = () => {
  const { cartItems, loading, error, updateQuantity, removeFromCart, cartCount, subtotal } = useCart();

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="page-container" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading your cart...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="page-container" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ padding: '1rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '0.5rem', marginBottom: '1.5rem', fontWeight: '500' }}>
            Unable to load your cart.
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="page-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
          <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-color)' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h2 className="page-title">My Cart</h2>
        
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Cart Items List */}
          <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cartItems.map((item) => {
              const product = item.product;
              if (!product) return null; // Handle deleted products

              return (
                <div key={product._id} className="card" style={{ padding: '1rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                  ) : (
                    <div style={{ width: '100px', height: '100px', background: 'var(--border-color)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No Image</div>
                  )}
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{product.name}</h3>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', fontSize: '1.1rem' }}>₹{product.price}</p>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {product.stock > 0 ? `${product.stock} units left in stock` : <span style={{ color: 'var(--danger)' }}>Out of Stock</span>}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-color)', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                      <button 
                        onClick={() => updateQuantity(product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        style={{ border: 'none', background: 'white', borderRadius: '0.25rem', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 'bold', color: item.quantity <= 1 ? 'var(--text-muted)' : 'var(--text-color)' }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: '600', minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(product._id, item.quantity + 1)}
                        disabled={item.quantity >= product.stock}
                        style={{ border: 'none', background: 'white', borderRadius: '0.25rem', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: item.quantity >= product.stock ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 'bold', color: item.quantity >= product.stock ? 'var(--text-muted)' : 'var(--text-color)' }}
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(product._id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div style={{ minWidth: '100px', textAlign: 'right', fontWeight: '700', fontSize: '1.25rem' }}>
                    ₹{product.price * item.quantity}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="card" style={{ flex: '1 1 300px', position: 'sticky', top: '2rem', background: '#f9fafb' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Order Summary</h3>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              <span>Items:</span>
              <span style={{ fontWeight: '500', color: 'var(--text-color)' }}>{cartCount}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '700' }}>
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>

            <Link 
              to="/checkout"
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
