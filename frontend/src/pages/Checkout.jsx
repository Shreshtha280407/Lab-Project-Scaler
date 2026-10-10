import PageLayout, { PageHeading, Notice, LoadingState, EmptyState } from '../components/PageLayout';
import Icon from '../components/Icon';
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Navigate } from 'react-router-dom';
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

  return <PageLayout><PageHeading eyebrow="THE FINAL LITTLE DETAIL" title="Checkout" subtitle="Your next favourites are almost yours." />
    {error && <Notice>{error}</Notice>}<div className="two-column"><section className="card checkout-section"><h2 className="section-title"><Icon name="pin" size={20} />Shipping Details</h2><form onSubmit={handlePlaceOrder} className="checkout-form">
      <div><label htmlFor="shipping-name">Full Name</label><input id="shipping-name" type="text" name="fullName" autoComplete="shipping name" value={shippingAddress.fullName} onChange={handleInputChange} placeholder="Enter your full name" /></div>
      <div><label htmlFor="shipping-phone">Phone Number</label><input id="shipping-phone" type="text" name="phone" autoComplete="shipping tel" value={shippingAddress.phone} onChange={handleInputChange} placeholder="10-digit mobile number" /></div>
      <div className="full-width"><label htmlFor="shipping-address">Address Line 1</label><input id="shipping-address" type="text" name="addressLine1" autoComplete="shipping address-line1" value={shippingAddress.addressLine1} onChange={handleInputChange} placeholder="House no, street, area" /></div>
      <div><label htmlFor="shipping-city">City</label><input id="shipping-city" type="text" name="city" autoComplete="shipping address-level2" value={shippingAddress.city} onChange={handleInputChange} placeholder="City" /></div>
      <div><label htmlFor="shipping-state">State</label><input id="shipping-state" type="text" name="state" autoComplete="shipping address-level1" value={shippingAddress.state} onChange={handleInputChange} placeholder="State" /></div>
      <div className="full-width"><label htmlFor="shipping-pincode">Pincode</label><input id="shipping-pincode" type="text" name="pincode" inputMode="numeric" autoComplete="shipping postal-code" value={shippingAddress.pincode} onChange={handleInputChange} placeholder="6-digit PIN code" /></div>
    </form></section><aside className="card summary-card"><h2>Order Summary</h2><div className="order-summary-items">{cartItems.map(item => {
      const product = item.product; if (!product) return null;
      return <div key={product._id} className="order-summary-item"><div><span className="item-quantity">{item.quantity}</span><span>{product.name}</span></div><span>₹{(product.price * item.quantity).toLocaleString('en-IN')}</span></div>;
    })}</div><div className="summary-total"><span>Total</span><span className="price">₹{subtotal.toLocaleString('en-IN')}</span></div><button onClick={handlePlaceOrder} disabled={loading} className="btn btn-primary btn-block"><Icon name="lock" size={16} />{loading ? 'Processing...' : 'Place Order & Pay'}</button><p className="secure-note"><Icon name="lock" size={12} />Payments securely processed via Razorpay.</p></aside></div>
  </PageLayout>;
};

export default Checkout;
