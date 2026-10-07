import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
            <button 
              disabled={product.stock === 0}
              style={{ 
                marginTop: '20px', 
                padding: '15px 30px', 
                background: product.stock > 0 ? '#28a745' : '#ccc', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '4px', 
                fontSize: '16px', 
                cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                width: '100%'
              }}
              onClick={() => alert('Added to cart! (Functionality coming in Lab-04)')}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
