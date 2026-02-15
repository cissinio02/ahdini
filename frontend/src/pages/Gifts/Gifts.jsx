import React, { useState, useEffect } from 'react';
import Header from '../../components/layouts/Header/Header';
import Footer from '../../components/layouts/Footer/Footer';
import styles from './Gifts.module.css';
import Button from '../../components/UI/button';
import Input from '../../components/UI/Input';
import api from '../../api/axios';

const Gifts = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategory, setSelectedCategory] = useState('All Gifts');
  const [selectedOccasion, setSelectedOccasion] = useState('All Occasions');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('popularity');
  const PRODUCTS_PER_PAGE = 9;

  // Fetch products from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('Fetching products from API...');
        const response = await api.get('shop.php?action=get_gifts');
        
        console.log('API Response:', response);
        console.log('Response status:', response.data.status);
        console.log('Response data:', response.data.data);
        
        if (response.data.status === 'success' && Array.isArray(response.data.data)) {
          console.log('Products found:', response.data.data.length);
          // Transform API data to match component expectations
          const transformedProducts = response.data.data.map(product => ({
          id: product.id,
          name: product.title,
          category: product.category || 'Other',
          description: product.description || '',
          price: parseFloat(product.price),
          image: product.image,
          occasion: product.category || 'General',
          createdAt: product.created_at // Make sure this matches the exact field name from API
          }));
          console.log('Transformed products:', transformedProducts);
          setProducts(transformedProducts);
          setError(null);
        } else {
          console.log('Unexpected response structure');
          setProducts([]);
          setError('Unexpected response format from server.');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        console.error('Error message:', err.message);
        console.error('Error response:', err.response);
        setError(`Failed to load products: ${err.message}`);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto-refresh gifts every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-refreshing gift list...');
      fetchProducts();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Dynamically get unique categories from products
  const uniqueCategories = products.length > 0
    ? ['All Gifts', ...new Set(products.map(p => p.category))]
    : ['All Gifts'];
  const categories = uniqueCategories.length > 0 ? uniqueCategories : ['All Gifts', 'Flowers & Bouquets', 'Gourmet Chocolates', 'Watches & Jewelry', 'Perfumes', 'Experience Boxes'];

  // Dynamically get unique occasions from products
  const uniqueOccasions = products.length > 0
    ? ['All Occasions', ...new Set(products.map(p => p.occasion).filter(Boolean))]
    : ['All Occasions'];
  const occasions = uniqueOccasions.length > 0 ? uniqueOccasions : ['All Occasions', 'Birthday', 'Anniversary', 'Graduation', 'Wedding', 'New Baby'];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesCategory = selectedCategory === 'All Gifts' || product.category === selectedCategory;
    const matchesOccasion = selectedOccasion === 'All Occasions' || product.occasion === selectedOccasion;

    return matchesSearch && matchesPrice && matchesCategory && matchesOccasion;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'newest':
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      case 'popularity':
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priceRange, selectedCategory, selectedOccasion, sortBy]);

  const handleMinPriceChange = (e) => {
    const newMin = parseInt(e.target.value);
    if (newMin <= priceRange[1]) {
      setPriceRange([newMin, priceRange[1]]);
    }
  };

  const handleMaxPriceChange = (e) => {
    const newMax = parseInt(e.target.value);
    if (newMax >= priceRange[0]) {
      setPriceRange([priceRange[0], newMax]);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 500]);
    setSelectedCategory('All Gifts');
    setSelectedOccasion('All Occasions');
    setCurrentPage(1);
  };

  const handleRemovePriceFilter = () => {
    setPriceRange([0, 500]);
  };

  const handleRemoveCategoryFilter = () => {
    setSelectedCategory('All Gifts');
  };

  const handleRemoveOccasionFilter = () => {
    setSelectedOccasion('All Occasions');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Navigate to product detail page
  const handleProductClick = (productId) => {
    navigate(`/gift/${productId}`);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (startPage > 2) {
        pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (priceRange[0] !== 0 || priceRange[1] !== 500) ||
      selectedCategory !== 'All Gifts' ||
      selectedOccasion !== 'All Occasions';
  };

  return (
    <div className={styles.wrapper}>
      <Header />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.container}>
            <h1 className={styles.heroTitle}>Find the Perfect GIFT</h1>
            <p className={styles.heroSubtitle}>Curated premium gifts for your special moments.</p>

            <div className={styles.searchSection}>
              <input
                type="text"
                placeholder="Search for flowers, chocolates, watches..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Dynamic Filter Badges */}
              {hasActiveFilters() && (
                <div className={styles.filterBadges}>
                  {/* Price Range Badge */}
                  {(priceRange[0] !== 0 || priceRange[1] !== 500) && (
                    <span className={styles.badge}>
                      ${priceRange[0]} - ${priceRange[1]}
                      <button
                        className={styles.badgeClose}
                        onClick={handleRemovePriceFilter}
                        aria-label="Remove price filter"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {/* Category Badge */}
                  {selectedCategory !== 'All Gifts' && (
                    <span className={styles.badge}>
                      {selectedCategory}
                      <button
                        className={styles.badgeClose}
                        onClick={handleRemoveCategoryFilter}
                        aria-label="Remove category filter"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {/* Occasion Badge */}
                  {selectedOccasion !== 'All Occasions' && (
                    <span className={styles.badge}>
                      {selectedOccasion}
                      <button
                        className={styles.badgeClose}
                        onClick={handleRemoveOccasionFilter}
                        aria-label="Remove occasion filter"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {/* Clear All Button */}
                  <button className={styles.clearBtn} onClick={handleClearFilters}>
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            {/* Sidebar Filters */}
            <aside className={styles.sidebar}>
              {/* Price Range */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>PRICE RANGE</h3>
                <div className={styles.priceRange}>

                  {/* Min Price Slider */}
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>
                      <h3>Minimum:</h3>
                    </label>
                    <input type="range" min="0" max="500" value={priceRange[0]} onChange={handleMinPriceChange} className={styles.rangeSlider} />
                  </div>

                  {/* Max Price Slider */}
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>
                      <h3>Maximum:</h3>
                    </label>
                    <input type="range" min="0" max="500" value={priceRange[1]} onChange={handleMaxPriceChange} className={styles.rangeSlider} />
                  </div>

                  <div className={styles.priceDisplay}>
                    ${priceRange[0]} - ${priceRange[1]}
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>CATEGORIES</h3>
                <div className={styles.categoryList}>
                  {categories.map(cat => (
                    <label key={cat} className={styles.categoryItem}>
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.categoryLabel}>{cat}</span>
                      <span className={styles.categoryCount}>
                        {cat === 'All Gifts' ? products.length : products.filter(p => p.category === cat).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>OCCASION</h3>
                <div className={styles.occasionList}>
                  {occasions.map(occ => (
                    <label key={occ} className={styles.categoryItem}>
                      <input
                        type="radio"
                        name="occasion"
                        value={occ}
                        checked={selectedOccasion === occ}
                        onChange={(e) => setSelectedOccasion(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.categoryLabel}>{occ}</span>
                      <span className={styles.categoryCount}>
                        {occ === 'All Occasions' ? products.length : products.filter(p => p.occasion === occ).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <section className={styles.productsSection}>
              <div className={styles.productsHeader}>
                <p className={styles.resultCount}>
                  {loading ? 'Loading...' : `Showing ${sortedProducts.length > 0 ? startIndex + 1 : 0}-${Math.min(endIndex, sortedProducts.length)} of ${sortedProducts.length} products`}
                </p>
                <select 
                  className={styles.sortSelect}
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="popularity">Sort by: Popularity</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>

              <div className={styles.productsGrid}>
                {loading ? (
                  <div className={styles.loadingMessage} style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px' }}>
                    <p>Loading products...</p>
                  </div>
                ) : error ? (
                  <div className={styles.errorMessage} style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: '#d32f2f' }}>
                    <p>{error}</p>
                    <p style={{ fontSize: '14px', marginTop: '10px' }}>Please refresh the page to try again.</p>
                  </div>
                ) : currentProducts.length > 0 ? (
                  currentProducts.map(product => (
                    <div
                      key={product.id}
                      className={styles.productCard}
                      onClick={() => handleProductClick(product.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.productImageWrapper}>
                        <img src={product.image} alt={product.name} className={styles.productImage} />
                        <span className={styles.productCategory}>{product.category}</span>
                        <button
                          className={styles.addToCartBtn}
                          aria-label="Add to cart"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click when clicking add to cart
                            console.log('Add to cart clicked for product:', product.id);
                          }}
                        >
                          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.01 16.136L4.141 4H3a1 1 0 0 1 0-2h1.985a.993.993 0 0 1 .66.235.997.997 0 0 1 .346.627L6.319 5H14v2H6.627l1.23 8h9.399l1.5-5h2.088l-1.886 6.287A1 1 0 0 1 18 17H7.016a.993.993 0 0 1-.675-.248.999.999 0 0 1-.332-.616zM10 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm9 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0-18a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0V6h-1a1 1 0 1 1 0-2h1V3a1 1 0 0 1 1-1z" fill="#0D0D0D" /></svg>
                        </button>
                      </div>
                      <div className={styles.productInfo}>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <p className={styles.productDescription}>{product.description}</p>
                        <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noProducts} style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px' }}>
                    <p>No products found matching your filters.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {!loading && sortedProducts.length > 0 && totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.paginationBtn}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    ‹
                  </button>

                  {getPageNumbers().map((pageNum, index) => (
                    pageNum === '...' ? (
                      <span key={`ellipsis-${index}`} className={styles.paginationEllipsis}>...</span>
                    ) : (
                      <button
                        key={pageNum}
                        className={`${styles.paginationBtn} ${currentPage === pageNum ? styles.active : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    )
                  ))}

                  <button
                    className={styles.paginationBtn}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                  >
                    ›
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Gifts;