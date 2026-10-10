import PageLayout, { PageHeading, Notice, LoadingState, EmptyState } from '../components/PageLayout';
import Icon from '../components/Icon';
import { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

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

  return <PageLayout><header className="catalog-hero"><div><p className="eyebrow">A LITTLE DISCOVERY, EVERY DAY</p><h1>Everyday finds.<br /><em>Exceptional style.</em></h1><p>Explore the things that make your world<br className="desktop-break" /> a little more you.</p></div><div className="hero-detail" aria-hidden="true"><Icon name="bag" size={46} /><span>Find your favourite.</span><small>THE SHOPKART COLLECTION</small></div></header>
    <div className="catalog-toolbar">
      <div>
        <label htmlFor="product-search" className="field-label">Find something you love</label>
        <div className="search-field">
          <Icon name="search" size={18} />
          <input id="product-search" type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div>
        <label htmlFor="product-category" className="field-label">Category</label>
        <select id="product-category" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Books">Books</option>
          <option value="Home">Home</option>
        </select>
      </div>
      <div>
        <label htmlFor="product-sort" className="field-label">Sort by</label>
        <select id="product-sort" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
    <div className="catalog-caption"><h2>Product Catalog</h2>{!loading && !error && <span>{products.length} product{products.length === 1 ? '' : 's'}</span>}</div>
    {loading && <LoadingState>Loading products...</LoadingState>}{error && <Notice>{error}</Notice>}
    {!loading && !error && products.length === 0 && <EmptyState icon="search" title="No products found matching your criteria." />}
    {!loading && !error && products.length > 0 && <div className="product-grid">{products.map(product => <ProductCard key={product._id} product={product} initialWishlisted={wishlistIds.includes(product._id)} />)}</div>}
  </PageLayout>;
};

export default Products;
