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
      // Extract IDs from populated wishlist or list of IDs
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
    }, 300); // 300ms debounce for typing
    return () => clearTimeout(delayDebounceFn);
  }, [search, category, sort]);

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
        <h2>Product Catalog</h2>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Books">Books</option>
            <option value="Home">Home</option>
          </select>
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">Sort By</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* States */}
        {loading && <p style={{ textAlign: 'center', fontSize: '18px' }}>Loading products...</p>}
        {error && <p style={{ textAlign: 'center', color: 'red', fontSize: '18px' }}>{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p style={{ textAlign: 'center', fontSize: '18px', color: '#555' }}>No products found.</p>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
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
