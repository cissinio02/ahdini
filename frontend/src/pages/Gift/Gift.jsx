import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/layouts/Header/Header';
import Footer from '../../components/layouts/Footer/Footer';
import styles from './Gift.module.css';
import api from '../../api/axios';

const Gift = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [purchaseType, setPurchaseType] = useState('onetime');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageRef = useRef(null);
  const videoRef = useRef(null);

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log('Fetching product with ID:', id);
        const response = await api.get(`shop.php?action=get_gift&id=${id}`);

        console.log('API Response:', response);

        if (response.data.status === 'success') {
          const productData = response.data.data;
          console.log('Product data:', productData);

          const transformedProduct = {
            id: productData.id,
            name: productData.title,
            price: parseFloat(productData.price),
            subscribePrice: parseFloat(productData.price) * 0.85,
            subscribeDiscount: 15,
            rating: productData.rating || 0,
            reviews: productData.review_count || 0,
            media: productData.media && productData.media.length > 0
              ? productData.media.map(m => ({
                path: m.media_path,
                type: m.media_type,
                order: m.display_order
              }))
              : [{ path: productData.image, type: 'image', order: 0 }],
            description: productData.description || '',
            info: productData.info || '',
            features: productData.info
              ? productData.info.split('•').map(f => f.trim()).filter(f => f)
              : [],
            shipping: "Shipping will calculated at checkout",
            vendor: productData.vendor ? {
              name: productData.vendor.first_name && productData.vendor.last_name
                ? `${productData.vendor.first_name} ${productData.vendor.last_name}`
                : productData.vendor.name || 'Unknown Vendor',
              image: productData.vendor.profile_img
                ? `/images/${productData.vendor.profile_img}`
                : productData.vendor.logo
                  ? `/images/${productData.vendor.logo}`
                  : '/images/default_user.png'
            } : {
              name: 'Ahdini Shop',
              image: '/images/default_user.png'
            },
            reviewsList: productData.reviews ? productData.reviews.map(review => ({
              id: review.id,
              userName: `${review.first_name} ${review.last_name}`,
              userImage: review.profile_img ? `/images/${review.profile_img}` : '/images/default_user.png',
              rating: review.rating,
              date: formatDate(review.created_at),
              comment: review.comment
            })) : []
          };

          setProduct(transformedProduct);
          setError(null);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Handle image zoom magnifier
  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setZoomPosition({ x: xPercent, y: yPercent });
  };

  const handleMouseEnter = () => {
    if (product && product.media[selectedImage].type === 'image') {
      setShowZoom(true);
    }
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalImageChange = (direction) => {
    if (direction === 'next') {
      setSelectedImage(selectedImage < product.media.length - 1 ? selectedImage + 1 : 0);
    } else {
      setSelectedImage(selectedImage > 0 ? selectedImage - 1 : product.media.length - 1);
    }
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    console.log('Review submitted:', { rating: reviewRating, text: reviewText });
    setReviewText('');
    setReviewRating(0);
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.wrapper}>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <p style={{ fontSize: '18px', color: '#666' }}>Loading product...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className={styles.wrapper}>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <p style={{ fontSize: '18px', color: '#d32f2f', marginBottom: '20px' }}>
                {error || 'Product not found'}
              </p>
              <button
                onClick={() => window.history.back()}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#a1241f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Go Back
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.productContainer}>
            {/* Left Side - Images & Videos */}
            <div className={styles.imageSection}>
              {/* Thumbnail Images */}
              <div className={styles.thumbnailList}>
                {product.media.map((item, index) => (
                  <button
                    key={index}
                    className={`${styles.thumbnail} ${selectedImage === index ? styles.thumbnailActive : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    {item.type === 'image' ? (
                      <img src={item.path} alt={`${product.name} ${index + 1}`} />
                    ) : (
                      <div className={styles.videoThumbnailSmall}>
                        <video
                          src={item.path}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div className={styles.playIconSmall}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="12" fill="rgba(0, 0, 0, 0.6)" />
                            <path d="M10 8L16 12L10 16V8Z" fill="white" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Main Image/Video Container */}
              <div className={styles.mainImageWrapper}>
                <div className={styles.mainImageContainer}>
                  <button
                    className={styles.navButton}
                    onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : product.media.length - 1)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div
                    className={styles.mainImage}
                    onMouseMove={product.media[selectedImage].type === 'image' ? handleMouseMove : undefined}
                    onMouseEnter={product.media[selectedImage].type === 'image' ? handleMouseEnter : undefined}
                    onMouseLeave={product.media[selectedImage].type === 'image' ? handleMouseLeave : undefined}
                    onClick={handleImageClick}
                    style={{ cursor: 'zoom-in' }}
                  >
                    {product.media[selectedImage].type === 'image' ? (
                      <img
                        ref={imageRef}
                        src={product.media[selectedImage].path}
                        alt={product.name}
                      />
                    ) : (
                      <div className={styles.videoThumbnail}>
                        <video
                          src={product.media[selectedImage].path}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div className={styles.playOverlay}>
                          <div className={styles.playButton}>
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="40" cy="40" r="40" fill="rgba(0, 0, 0, 0.7)" />
                              <path d="M32 25L55 40L32 55V25Z" fill="white" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    className={styles.navButton}
                    onClick={() => setSelectedImage(selectedImage < product.media.length - 1 ? selectedImage + 1 : 0)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                {/* Zoom Preview Box */}
                {showZoom && product.media[selectedImage].type === 'image' && (
                  <div className={styles.zoomBox}>
                    <div
                      className={styles.zoomImage}
                      style={{
                        backgroundImage: `url(${product.media[selectedImage].path})`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundSize: '300%'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Product Info */}
            <div className={styles.productInfo}>
              <h1 className={styles.productTitle}>{product.name}</h1>

              {/* Vendor Profile & Rating Combined */}
              <div className={styles.vendorRatingSection}>
                <div className={styles.vendorSection}>
                  <img
                    src={product.vendor.image}
                    alt={product.vendor.name}
                    className={styles.vendorImage}
                  />
                  <span className={styles.vendorName}>{product.vendor.name}</span>
                </div>

                <div className={styles.ratingSection}>
                  <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= Math.floor(product.rating) ? styles.starFilled : styles.starEmpty}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className={styles.reviewCount}>({product.reviews} reviews)</span>
                </div>
              </div>

              {/* Features (Info) */}
              {product.features.length > 0 && (
                <ul className={styles.featureList}>
                  {product.features.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>{feature}</li>
                  ))}
                </ul>
              )}

              {/* Price */}
              <div className={styles.priceSection}>
                <span className={styles.price}>${product.price.toFixed(2)}</span>
                <span className={styles.shipping}>{product.shipping}</span>
              </div>

              {/* Divider */}
              <hr className={styles.divider} />

              {/* Purchase Options */}
              <div className={styles.purchaseOptions}>
                {/* One Time Purchase */}
                <label className={styles.purchaseOption}>
                  <input
                    type="radio"
                    name="purchase"
                    value="onetime"
                    checked={purchaseType === 'onetime'}
                    onChange={(e) => setPurchaseType(e.target.value)}
                    className={styles.radio}
                  />
                  <div className={styles.optionContent}>
                    <span className={styles.optionLabel}>ONE TIME PURCHASE</span>
                    <span className={styles.optionPrice}>${product.price.toFixed(2)}</span>
                  </div>
                </label>

                {/* Subscribe & Save */}
                <label className={styles.purchaseOption}>
                  <input
                    type="radio"
                    name="purchase"
                    value="subscribe"
                    checked={purchaseType === 'subscribe'}
                    onChange={(e) => setPurchaseType(e.target.value)}
                    className={styles.radio}
                  />
                  <div className={styles.optionContent}>
                    <div className={styles.subscribeInfo}>
                      <span className={styles.optionLabel}>SUBSCRIBE & SAVE ({product.subscribeDiscount}%)</span>
                      <button className={styles.subscriptionDetails} type="button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                          <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Subscription details
                      </button>
                    </div>
                    <span className={styles.optionPrice}>${product.subscribePrice.toFixed(2)}</span>
                  </div>
                </label>
              </div>

              {/* Quantity */}
              <div className={styles.quantitySection}>
                <label className={styles.quantityLabel}>QUANTITY</label>
                <div className={styles.quantityControl}>
                  <button
                    className={styles.quantityBtn}
                    onClick={handleQuantityDecrease}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className={styles.quantityInput}
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                  />
                  <button
                    className={styles.quantityBtn}
                    onClick={handleQuantityIncrease}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button className={styles.addToCartBtn}>
                ADD TO CART
              </button>

              {/* Description */}
              {product.description && (
                <div className={styles.descriptionSection}>
                  <h3 className={styles.descriptionTitle}>Description</h3>
                  <p className={styles.descriptionText}>{product.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className={styles.reviewsContainer}>
            <h2 className={styles.reviewsTitle}>Customer Reviews</h2>

            {/* Write a Review Form */}
            <div className={styles.writeReviewSection}>
              <h3 className={styles.writeReviewTitle}>Write a Review</h3>
              <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
                {/* Star Rating Input */}
                <div className={styles.ratingInput}>
                  <label className={styles.ratingInputLabel}>Your Rating:</label>
                  <div className={styles.ratingStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={styles.ratingStarBtn}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewRating(star)}
                      >
                        <span className={star <= (hoverRating || reviewRating) ? styles.starFilledInput : styles.starEmptyInput}>
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text Area */}
                <div className={styles.reviewTextArea}>
                  <label className={styles.reviewTextLabel}>Your Review:</label>
                  <textarea
                    className={styles.reviewTextInput}
                    placeholder="Share your thoughts about this product..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows="5"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button type="submit" className={styles.submitReviewBtn}>
                  Submit Review
                </button>
              </form>
            </div>

            {/* Reviews List */}
            {product.reviewsList && product.reviewsList.length > 0 ? (
              <div className={styles.reviewsList}>
                {product.reviewsList.map((review) => (
                  <div key={review.id} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewUser}>
                        <img
                          src={review.userImage}
                          alt={review.userName}
                          className={styles.reviewUserImage}
                        />
                        <div className={styles.reviewUserInfo}>
                          <span className={styles.reviewUserName}>{review.userName}</span>
                          <span className={styles.reviewDate}>{review.date}</span>
                        </div>
                      </div>
                      <div className={styles.reviewStars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={star <= review.rating ? styles.starFilled : styles.starEmpty}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className={styles.reviewComment}>{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Image/Video Modal/Lightbox */}
      {isModalOpen && (
        <div className={styles.modal} onClick={handleModalClose}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={handleModalClose}>×</button>

            <button
              className={styles.modalNav}
              onClick={() => handleModalImageChange('prev')}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className={styles.modalImage}>
              {product.media[selectedImage].type === 'image' ? (
                <img src={product.media[selectedImage].path} alt={product.name} />
              ) : (
                <video
                  src={product.media[selectedImage].path}
                  controls
                  autoPlay
                  style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '8px' }}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            <button
              className={styles.modalNav}
              onClick={() => handleModalImageChange('next')}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gift;