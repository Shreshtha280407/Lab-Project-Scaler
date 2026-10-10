import { Link } from 'react-router-dom';
import Icon from './Icon';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const ProductCard = ({ product, initialWishlisted }) => {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();

  const handleWishlistToggle = async () => {
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${product._id}`);
        setIsWishlisted(false);
      } else {
        await api.post(`/wishlist/${product._id}`);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Failed to update wishlist');
      alert('Could not update wishlist. Please try again.');
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await addToCart(product._id);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  return <article className="card product-card">
    <div className="product-image-wrap">
      {product.image ? <img src={product.image} alt={product.name} className="product-image" loading="lazy" /> : <div className="image-placeholder"><Icon name="bag" size={30} /><span>No Image</span></div>}
      <button onClick={handleWishlistToggle} className={`wishlist-toggle ${isWishlisted ? 'is-active' : ''}`} aria-label={`${isWishlisted ? 'Remove' : 'Add'} ${product.name} ${isWishlisted ? 'from' : 'to'} wishlist`} aria-pressed={!!isWishlisted} title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}><Icon name="heart" size={19} filled={!!isWishlisted} /></button>
    </div>
    <div className="product-copy"><p className="product-category">{product.category}</p><h3 className="product-name"><Link to={`/products/${product._id}`}>{product.name}</Link></h3><p className="product-description">{product.description}</p>
      <div className="product-bottom"><span className="price">₹{product.price.toLocaleString('en-IN')}</span><button onClick={handleAddToCart} disabled={product.stock === 0 || addingToCart} className="btn btn-primary">{product.stock > 0 && !addingToCart && <Icon name="plus" size={14} />}{product.stock === 0 ? 'Out of Stock' : addingToCart ? 'Adding...' : 'Add to Cart'}</button></div>
    </div>
  </article>;
};

export default ProductCard;
