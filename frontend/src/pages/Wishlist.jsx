import PageLayout, { PageHeading, Notice, LoadingState, EmptyState } from '../components/PageLayout';
import Icon from '../components/Icon';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/wishlist');
      setWishlist(data.wishlist);
    } catch (err) {
      setError('Failed to load wishlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlist(prev => prev.filter(item => item._id !== productId));
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (err) {
      console.error('Failed to remove from wishlist', err);
    }
  };

  return <PageLayout><PageHeading eyebrow="KEEP THE GOOD FINDS CLOSE" title="My Wishlist" subtitle="All your favourites, in one lovely place." />
    {loading ? <LoadingState>Loading wishlist...</LoadingState> : error ? <Notice>{error}</Notice> : wishlist.length === 0 ? <EmptyState icon="heart" title="Your wishlist is empty."><Link to="/products" className="btn btn-primary">Browse Products<Icon name="arrow" size={18} /></Link></EmptyState> : <div className="product-grid">{wishlist.map(product => <article key={product._id} className="card product-card"><div className="product-image-wrap">{product.image ? <img src={product.image} alt={product.name} className="product-image" loading="lazy" /> : <div className="image-placeholder"><Icon name="bag" size={30} /><span>No Image</span></div>}</div><div className="product-copy"><p className="product-category">{product.category}</p><h3 className="product-name">{product.name}</h3><p className="product-description">{product.description}</p><p className="price">₹{product.price.toLocaleString('en-IN')}</p><div className="wishlist-actions"><Link to={`/products/${product._id}`} className="btn btn-outline">View Details</Link><button onClick={() => handleRemove(product._id)} className="btn btn-outline" aria-label={`Remove ${product.name} from wishlist`}><Icon name="heart" size={15} />Remove</button></div></div></article>)}</div>}
  </PageLayout>;
};

export default Wishlist;
