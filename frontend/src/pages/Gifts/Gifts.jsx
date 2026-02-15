import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import Header from '../../components/layouts/Header/Header';
import Footer from '../../components/layouts/Footer/Footer';
import styles from './Gifts.module.css';
import Button from '../../components/UI/button';
import Input from '../../components/UI/Input';
import api from '../../api/axios';

const Gifts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategory, setSelectedCategory] = useState('All Gifts');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('popularity');
  const PRODUCTS_PER_PAGE = 9;

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setRefreshing(true);
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
      setRefreshing(false);
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
  const occasions = ['Birthday', 'Anniversary', 'Graduation', 'Wedding', 'New Baby'];
  const deliveryOptions = ['Same Day Delivery', 'Next Day Delivery'];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesCategory = selectedCategory === 'All Gifts' || product.category === selectedCategory;
    const matchesOccasion = !selectedOccasion || product.occasion === selectedOccasion;
    
    return matchesSearch && matchesPrice && matchesCategory && matchesOccasion;
  });

 // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
  switch(sortBy) {
    case 'price_low':
      return a.price - b.price;
    case 'price_high':
      return b.price - a.price;
    case 'newest':
      // Sort by date (newest first)    
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA; // Most recent first
    case 'popularity':
    default:
      return 0; // Keep original order for popularity
  }
});

  // Calculate pagination
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priceRange, selectedCategory, selectedOccasion, deliveryOption, sortBy]);

  const handlePriceChange = (e) => {
    setPriceRange([priceRange[0], parseInt(e.target.value)]);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 500]);
    setSelectedCategory('All Gifts');
    setSelectedOccasion('');
    setDeliveryOption('');
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add pages around current page
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
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
              <div className={styles.filterBadges}>
                <span className={styles.badge}>Under $100</span>
                <span className={styles.badge}>Available Today</span>
                <button className={styles.clearBtn} onClick={handleClearFilters}>Clear all</button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            {/* Sidebar Filters */}
            <aside className={styles.sidebar}>
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
                    <label key={occ} className={styles.occasionItem}>
                      <input
                        type="checkbox"
                        checked={selectedOccasion === occ}
                        onChange={() => setSelectedOccasion(selectedOccasion === occ ? '' : occ)}
                        className={styles.checkboxInput}
                      />
                      <span>{occ}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>PRICE RANGE</h3>
                <div className={styles.priceRange}>
                  <div className={styles.priceInputs}>
                    <span className={styles.priceLabel}>$0</span>
                    <span className={styles.priceLabel}>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={handlePriceChange}
                    className={styles.rangeSlider}
                  />
                  <div className={styles.priceDisplay}>
                    $0 - ${priceRange[1]}
                  </div>
                </div>
              </div>

              {/* Delivery Options */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>DELIVERY</h3>
                <div className={styles.deliveryList}>
                  {deliveryOptions.map(option => (
                    <label key={option} className={styles.deliveryItem}>
                      <input
                        type="checkbox"
                        checked={deliveryOption === option}
                        onChange={() => setDeliveryOption(deliveryOption === option ? '' : option)}
                        className={styles.checkboxInput}
                      />
                      <span>{option}</span>
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
                <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
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
                  
                  <button 
                    onClick={fetchProducts}
                    disabled={refreshing}
                    style={{
                      padding: '8px 12px',
                      background: refreshing ? '#ccc' : '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: refreshing ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    title="Refresh gift list to see new items"
                  >
                    <RefreshCw size={16} style={{animation: refreshing ? 'spin 1s linear infinite' : 'none'}} />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
              </div>

              <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>

              <div className={styles.productsGrid}>
                {loading ? (
                  <div className={styles.loadingMessage} style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px'}}>
                    <p>Loading products...</p>
                  </div>
                ) : error ? (
                  <div className={styles.errorMessage} style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: '#d32f2f'}}>
                    <p>{error}</p>
                    <p style={{fontSize: '14px', marginTop: '10px'}}>Please refresh the page to try again.</p>
                  </div>
                ) : currentProducts.length > 0 ? (
                  currentProducts.map(product => (
                    <div key={product.id} className={styles.productCard}>
                      <div className={styles.productImageWrapper}>
                        <img src={product.image} alt={product.name} className={styles.productImage} />
                        <span className={styles.productCategory}>{product.category}</span>
                        <button className={styles.addToCartBtn} aria-label="Add to cart">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
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
                  <div className={styles.noProducts} style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px'}}>
                    <p>No products found matching your filters.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {!loading && sortedProducts.length > 0 && totalPages > 1 && (
                <div className={styles.pagination}>
                  {/* Previous Button */}
                  <button 
                    className={styles.paginationBtn}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    ‹
                  </button>

                  {/* Page Numbers */}
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

                  {/* Next Button */}
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