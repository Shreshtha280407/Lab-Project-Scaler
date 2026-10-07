import { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');

  const fetchProductsAndWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const [productsRes, wishlistRes] = await Promise.all([
        api.get('/products', { params: { search, category, sort } }),
        api.get('/wishlist').catch(() => ({ data: { wishlist: [] } }))
      ]);
      
      setProducts(productsRes.data.products);
      const ids = wishlistRes.data.wishlist.map(item => item._id || item);
      setWishlistIds(ids);
    } catch (err) {
      setError('Something went wrong while loading products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProductsAndWishlist();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, category, sort]);

  return (
    <div>
      <Navbar />
      <div className="page-container" style={{ maxWidth: '1200px' }}>
        <h2 className="page-title">Product Catalog</h2>

        {/* Search & Filter Bar */}
        <div className="card" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', padding: '1rem' }}>
          <div style={{ flex: '1 1 300px' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Books">Books</option>
              <option value="Home">Home</option>
            </select>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Sort By</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* States */}
        {loading && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading products...</div>}
        {error && <div style={{ padding: '1rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '0.5rem', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
        {!loading && !error && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No products found matching your criteria.</div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {products.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                initialWishlisted={wishlistIds.includes(product._id)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
