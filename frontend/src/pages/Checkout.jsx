import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cartItems, subtotal, clearCart, cartCount } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cartCount === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (
      !shippingAddress.fullName.trim() ||
      !shippingAddress.phone.trim() ||
      !shippingAddress.addressLine1.trim() ||
      !shippingAddress.city.trim() ||
      !shippingAddress.state.trim() ||
      !shippingAddress.pincode.trim()
    ) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    if (!/^\d{6}$/.test(shippingAddress.pincode.trim())) {
      setError('Pincode must contain 6 digits.');
      setLoading(false);
      return;
    }

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        setError('Failed to load Razorpay SDK. Are you online?');
        setLoading(false);
        return;
      }

      const { data } = await api.post('/orders/create-payment-order', {
        shippingAddress
      });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "ShopKart",
        description: "ShopKart Order",
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/orders/verify-payment', {
              shopKartOrderId: data.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              clearCart();
              navigate(`/orders/${data.shopKartOrderId}`);
            }
          } catch (err) {
            console.error('Verification failed', err);
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone
        },
        theme: {
          color: "#0F172A"
        }
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function (response) {
        console.error("Payment failed", response.error);
        setError('Payment failed. Your cart has not been cleared. Please try again.');
      });

      paymentObject.open();

    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container" style={{ maxWidth: '1100px' }}>
        <h2 className="page-title" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '2rem' }}>Checkout</h2>
        
        {error && (
          <div style={{ padding: '1rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '0.5rem', marginBottom: '2rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {error}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* Shipping Form */}
          <div style={{ flex: '2 1 450px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--text-primary)' }}>Shipping Details</h3>
            <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#fff', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div>
                <label>Full Name</label>
                <input type="text" name="fullName" value={shippingAddress.fullName} onChange={handleInputChange} placeholder="Enter your full name" />
              </div>
              <div>
                <label>Phone Number</label>
                <input type="text" name="phone" value={shippingAddress.phone} onChange={handleInputChange} placeholder="10-digit mobile number" />
              </div>
              <div>
                <label>Address Line 1</label>
                <input type="text" name="addressLine1" value={shippingAddress.addressLine1} onChange={handleInputChange} placeholder="House no, street, area" />
              </div>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <div style={{ flex: 1 }}>
                  <label>City</label>
                  <input type="text" name="city" value={shippingAddress.city} onChange={handleInputChange} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>State</label>
                  <input type="text" name="state" value={shippingAddress.state} onChange={handleInputChange} />
                </div>
              </div>
              <div>
                <label>Pincode</label>
                <input type="text" name="pincode" value={shippingAddress.pincode} onChange={handleInputChange} placeholder="6-digit PIN code" />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div style={{ flex: '1 1 350px', position: 'sticky', top: '5rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--text-primary)' }}>Order Summary</h3>
            <div className="card" style={{ background: '#F8FAFC', border: '1px solid var(--border-light)' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {cartItems.map((item) => {
                  const product = item.product;
                  if (!product) return null;
                  return (
                    <div key={product._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'var(--border-light)', width: '32px', height: '32px', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                          {item.quantity}
                        </div>
                        <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{product.name}</span>
                      </div>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>₹{product.price * item.quantity}</span>
                    </div>
                  );
                })}
              </div>

              <hr style={{ margin: '1.5rem 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                <span>Total</span>
                <span>₹{subtotal}</span>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              >
                {loading ? 'Processing...' : 'Place Order & Pay'}
              </button>
              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Payments are securely processed via Razorpay.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
