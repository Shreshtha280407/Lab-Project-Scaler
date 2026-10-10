import PageLayout, { PageHeading, Notice, LoadingState, EmptyState } from '../components/PageLayout';
import Icon from '../components/Icon';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
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

  if (loading) return <PageLayout><LoadingState>Loading product...</LoadingState></PageLayout>;
  if (error || !product) return <PageLayout><Notice>{error || 'Product not found'}</Notice><Link to="/products" className="back-link"><Icon name="back" size={18} />Back to Products</Link></PageLayout>;
  return <PageLayout><Link to="/products" className="back-link"><Icon name="back" size={18} />Back to Products</Link><div className="product-detail">
    {product.image ? <img src={product.image} alt={product.name} className="detail-image" /> : <div className="detail-image image-placeholder"><Icon name="bag" size={45} /><span>No Image</span></div>}
    <div className="detail-copy"><span className="badge badge-neutral">{product.category}</span><h1>{product.name}</h1><span className="price">₹{product.price.toLocaleString('en-IN')}</span><p className="detail-description">{product.description}</p><p className={`stock-label ${product.stock === 0 ? 'unavailable' : ''}`}><Icon name={product.stock > 0 ? 'check' : 'alert'} size={18} />{product.stock > 0 ? `In Stock (${product.stock} units left)` : 'Out of Stock'}</p>
      {cartError && <Notice>{cartError}</Notice>}<button onClick={handleAddToCart} disabled={product.stock === 0 || cartLoading} className="btn btn-primary btn-block"><Icon name="cart" size={18} />{cartLoading ? 'Adding...' : inCartQuantity > 0 ? 'Add Another to Cart' : 'Add to Cart'}</button>
    </div>
  </div></PageLayout>;
};

export default ProductDetails;
