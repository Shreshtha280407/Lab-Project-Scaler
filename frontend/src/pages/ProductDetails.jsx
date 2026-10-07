import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { addToCart, cartItems } = useCart();
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState('');

  const cartItem = cartItems.find(item => item.product?._id === id || item.product === id);
  const inCartQuantity = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError('Something went wrong while loading the product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setCartLoading(true);
    setCartError('');
    const res = await addToCart(product._id);
    if (!res.success) {
      setCartError(res.message);
    }
    setCartLoading(false);
  };

  if (loading) {
    return (
      <div style={{ fontFamily: 'sans-serif' }}>
        <Navbar />
        <div style={{ padding: '50px', textAlign: 'center' }}>Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ fontFamily: 'sans-serif' }}>
        <Navbar />
        <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
        <Link to="/products" style={{ textDecoration: 'none', color: '#007bff', display: 'inline-block', marginBottom: '20px' }}>
          &larr; Back to Products
        </Link>
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: '100%', maxWidth: '400px', height: 'auto', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} 
          />
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h1 style={{ marginTop: 0 }}>{product.name}</h1>
            <span style={{ fontSize: '14px', color: '#666', background: '#eee', padding: '6px 12px', borderRadius: '16px' }}>
              {product.category}
            </span>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '20px 0' }}>₹{product.price}</p>
            <p style={{ color: '#555', lineHeight: '1.6' }}>{product.description}</p>
            <p style={{ color: product.stock > 0 ? 'green' : 'red', fontWeight: 'bold', marginTop: '20px' }}>
              {product.stock > 0 ? `In Stock (${product.stock} units left)` : 'Out of Stock'}
            </p>
            
            {cartError && <p style={{ color: 'red', margin: '10px 0 0 0' }}>{cartError}</p>}
            <button 
              disabled={product.stock === 0 || cartLoading}
              style={{ 
                marginTop: '20px', 
                padding: '15px 30px', 
                background: product.stock === 0 ? '#ccc' : '#28a745', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '4px', 
                fontSize: '16px', 
                cursor: product.stock > 0 && !cartLoading ? 'pointer' : 'not-allowed',
                width: '100%'
              }}
              onClick={handleAddToCart}
            >
              {cartLoading ? 'Adding...' : inCartQuantity > 0 ? 'Add Another to Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
