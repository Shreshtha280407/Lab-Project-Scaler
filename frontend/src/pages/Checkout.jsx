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

  // If cart is empty, redirect to cart or products
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

    // Basic Validation
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

      // Step 1: Create Order
      const { data } = await api.post('/orders/create-payment-order', {
        shippingAddress
      });

      // Step 2: Open Razorpay Checkout
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "ShopKart",
        description: "ShopKart Order",
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            // Step 3: Verify Payment
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
          color: "#007bff"
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
    <div style={{ fontFamily: 'sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
        <h2>Checkout</h2>
        {error && <p style={{ color: 'red', background: '#ffe6e6', padding: '10px', borderRadius: '4px' }}>{error}</p>}
        
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          
          {/* Shipping Form */}
          <div style={{ flex: 2, minWidth: '300px' }}>
            <h3 style={{ marginTop: 0 }}>Shipping Details</h3>
            <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Full Name</label>
                <input type="text" name="fullName" value={shippingAddress.fullName} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Phone</label>
                <input type="text" name="phone" value={shippingAddress.phone} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Address Line 1</label>
                <input type="text" name="addressLine1" value={shippingAddress.addressLine1} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>City</label>
                  <input type="text" name="city" value={shippingAddress.city} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>State</label>
                  <input type="text" name="state" value={shippingAddress.state} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Pincode</label>
                <input type="text" name="pincode" value={shippingAddress.pincode} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', background: '#f8f9fa', position: 'sticky', top: '20px' }}>
              <h3 style={{ marginTop: 0 }}>Order Summary</h3>
              <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '15px 0' }} />
              
              <div style={{ marginBottom: '20px' }}>
                {cartItems.map((item) => {
                  const product = item.product;
                  if (!product) return null;
                  return (
                    <div key={product._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span>{product.name} &times; {item.quantity}</span>
                      <span>₹{product.price * item.quantity}</span>
                    </div>
                  );
                })}
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '15px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
                <span>Total:</span>
                <span>₹{subtotal}</span>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                style={{ width: '100%', padding: '15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
