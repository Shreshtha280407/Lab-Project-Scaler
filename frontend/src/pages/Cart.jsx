import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Cart = () => {
  const { cartItems, loading, error, updateQuantity, removeFromCart, cartCount, subtotal } = useCart();

  if (loading) {
    return (
      <div style={{ fontFamily: 'sans-serif' }}>
        <Navbar />
        <div style={{ padding: '50px', textAlign: 'center', fontSize: '18px' }}>
          Loading your cart...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ fontFamily: 'sans-serif' }}>
        <Navbar />
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <p style={{ color: 'red', fontSize: '18px' }}>Unable to load your cart.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ fontFamily: 'sans-serif' }}>
        <Navbar />
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h2>Your cart is empty 🛒</h2>
          <p style={{ color: '#555', fontSize: '18px' }}>Looks like you haven't added anything yet.</p>
          <Link to="/products" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
        <h2>My Cart</h2>
        
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          {/* Cart Items List */}
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cartItems.map((item) => {
              const product = item.product;
              if (!product) return null; // Handle deleted products

              return (
                <div key={product._id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <img src={product.image} alt={product.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
                    <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>₹{product.price}</p>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      {product.stock > 0 ? `${product.stock} units left in stock` : 'Out of Stock'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f9fa', padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}>
                      <button 
                        onClick={() => updateQuantity(product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        style={{ border: 'none', background: 'transparent', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', fontSize: '16px', padding: '0 8px' }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(product._id, item.quantity + 1)}
                        disabled={item.quantity >= product.stock}
                        style={{ border: 'none', background: 'transparent', cursor: item.quantity >= product.stock ? 'not-allowed' : 'pointer', fontSize: '16px', padding: '0 8px' }}
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(product._id)}
                      style={{ background: 'transparent', border: 'none', color: '#dc3545', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div style={{ minWidth: '100px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px' }}>
                    ₹{product.price * item.quantity}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', background: '#f8f9fa', position: 'sticky', top: '20px' }}>
              <h3 style={{ marginTop: 0 }}>Order Summary</h3>
              <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '15px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span>Items:</span>
                <span>{cartCount}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>

              <Link 
                to="/checkout"
                style={{ display: 'block', textAlign: 'center', width: '100%', padding: '15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none', boxSizing: 'border-box' }}
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
