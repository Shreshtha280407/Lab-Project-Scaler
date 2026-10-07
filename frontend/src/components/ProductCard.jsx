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
        await api.post('/wishlist', { productId: product._id });
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

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.25rem' }}>
      <div style={{ position: 'relative', paddingTop: '100%', backgroundColor: '#F8FAFC', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '1.25rem' }}>
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No Image
          </div>
        )}
        <button 
          onClick={handleWishlistToggle}
          style={{ 
            position: 'absolute', 
            top: '0.75rem', 
            right: '0.75rem', 
            background: 'white', 
            border: 'none', 
            borderRadius: '50%', 
            width: '36px', 
            height: '36px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            color: isWishlisted ? 'var(--danger)' : 'var(--text-muted)',
            transition: 'all 0.2s',
            opacity: 0.9
          }}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          onMouseOver={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.05)' }}
          onMouseOut={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'scale(1)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: '600' }}>
          {product.category}
        </div>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.4' }}>
          {product.name}
        </h3>
        <p style={{ margin: '0 0 1.25rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>
        
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
            ₹{product.price}
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addingToCart}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: '0.375rem' }}
          >
            {product.stock === 0 ? 'Out of Stock' : addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
