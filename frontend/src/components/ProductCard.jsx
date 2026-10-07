import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
      <h3 style={{ margin: '0' }}>{product.name}</h3>
      <span style={{ fontSize: '12px', color: '#666', background: '#eee', padding: '4px 8px', borderRadius: '12px', width: 'fit-content' }}>
        {product.category}
      </span>
      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>₹{product.price}</p>
      <p style={{ margin: 0, color: product.stock > 0 ? 'green' : 'red' }}>
        {product.stock > 0 ? `${product.stock} units left` : 'Out of Stock'}
      </p>
      <Link 
        to={`/products/${product._id}`} 
        style={{ marginTop: 'auto', textAlign: 'center', background: '#007bff', color: 'white', padding: '10px', borderRadius: '4px', textDecoration: 'none' }}
      >
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
