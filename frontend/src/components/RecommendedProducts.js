import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';
import RatingStars from './RatingStars';

// Navbar color palette
const logoColors = {
  primary: '#fe7e8b',
  secondary: '#e65c70',
  light: '#ffd1d4',
  dark: '#d64555',
  background: '#fff5f6',
  gradient: 'linear-gradient(135deg, #fe7e8b 0%, #e65c70 100%)',
  softGradient: 'linear-gradient(135deg, #fff5f6 0%, #ffd1d4 100%)',
};

const RecommendedProducts = ({ currentProductId, category, onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        if (!category) {
          setLoading(false);
          return;
        }

        console.log(`Fetching products for category: ${category}`);
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/catalog?category=${encodeURIComponent(typeof category === 'object' ? category.name : category)}`
        );

        // Handle different response structures
        let productList = [];
        if (Array.isArray(res.data)) {
          productList = res.data;
        } else if (res.data && Array.isArray(res.data.products)) {
          productList = res.data.products;
        } else if (res.data && Array.isArray(res.data.data)) {
          productList = res.data.data;
        }

        // Filter out current product and limit to 4
        const filteredProducts = productList
          .filter(product => product._id !== currentProductId)
          .slice(0, 4);

        setProducts(filteredProducts);
      } catch (err) {
        console.error('Error fetching recommended products:', err);
        setError(err.message || 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, [category, currentProductId]);

  const getProductImage = (product) => {
    if (!product?.image?.[0]) return '/placeholder.jpg';
    if (product.image[0].startsWith('http')) return product.image[0];
    return `${process.env.REACT_APP_API_URL}${product.image[0]}`;
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();
    if (onAddToCart && product.stock > 0) {
      onAddToCart(product);
    }
  };

  if (!category) {
    return null;
  }

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <Spinner animation="border" style={{ color: logoColors.primary }} />
        <p className="mt-3" style={{ color: '#4A5568' }}>Loading recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="warning" className="my-4" style={{ borderRadius: '8px' }}>
        {error}
      </Alert>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-5">
      <div className="text-center mb-4">
        <h4 style={{ 
          color: logoColors.dark, 
          fontWeight: '600',
          fontSize: 'clamp(1.2rem, 4vw, 1.5rem)'
        }}>
          You May Also Like
        </h4>
        <div style={{
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${logoColors.primary}40, transparent)`,
          width: 'clamp(60px, 15vw, 150px)',
          margin: '0.5rem auto'
        }} />
      </div>

      <Row xs={2} md={4} className="g-2 g-md-4">
        {products.map((product) => (
          <Col key={product._id}>
            <Link 
              to={`/product/${product.slug || product._id}`} 
              style={{ textDecoration: 'none' }}
            >
              <Card 
                className="product-card h-100 border-0"
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  height: '100%',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 8px 16px ${logoColors.primary}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                }}
              >
                {/* Image Container */}
                <div
                  className="product-image-container"
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: isMobile ? '1 / 1' : '3 / 4',
                    overflow: 'hidden',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={getProductImage(product)}
                    alt={product.name}
                    className="product-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                  />

                  {/* Discount Badge */}
                  {product.discountedPrice < product.originalPrice && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: logoColors.gradient,
                      color: 'white',
                      padding: isMobile ? '2px 6px' : '4px 8px',
                      borderRadius: '4px',
                      fontSize: isMobile ? '0.6rem' : '0.7rem',
                      fontWeight: '600',
                      zIndex: 2,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {Math.round(100 - (product.discountedPrice / product.originalPrice * 100))}% OFF
                    </div>
                  )}

                  {/* Quick Add Button - Desktop only */}
                  {onAddToCart && (
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="d-none d-md-block"
                      disabled={product.stock <= 0}
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'white',
                        border: `1px solid ${logoColors.primary}`,
                        color: logoColors.primary,
                        padding: '6px 12px',
                        borderRadius: '30px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                        opacity: 0,
                        transition: 'opacity 0.2s ease',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        zIndex: 3
                      }}
                      onMouseEnter={(e) => {
                        if (product.stock > 0) {
                          e.target.style.background = logoColors.primary;
                          e.target.style.color = 'white';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (product.stock > 0) {
                          e.target.style.background = 'white';
                          e.target.style.color = logoColors.primary;
                        }
                      }}
                    >
                      <FaShoppingCart className="me-1" size={12} />
                      Quick Add
                    </button>
                  )}

                  <style>{`
                    .product-card:hover .d-md-block { opacity: 1 !important; }
                  `}</style>
                </div>

                {/* Card Body */}
                <Card.Body
                  className="d-flex flex-column"
                  style={{ padding: isMobile ? '0.4rem' : '0.75rem' }}
                >
                  {/* Title */}
                  <Card.Title
                    className="product-title"
                    style={{
                      fontSize: isMobile ? '0.72rem' : '0.9rem',
                      fontWeight: '500',
                      color: '#2D3748',
                      marginBottom: '0.2rem',
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minHeight: isMobile ? '2rem' : '2.5rem'
                    }}
                  >
                    {product.name}
                  </Card.Title>

                  {/* Category - Desktop only */}
                  <Card.Text
                    className="d-none d-md-block text-muted product-category"
                    style={{
                      fontSize: '0.75rem',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {typeof product.category === 'object'
                      ? product.category.name
                      : (product.category || 'Uncategorized')}
                  </Card.Text>

                  {/* Price */}
                  <div className="price-wrapper mb-1">
                    <div className="price d-flex align-items-center flex-wrap">
                      {product.discountedPrice < product.originalPrice && (
                        <span
                          className="original-price text-muted text-decoration-line-through me-1"
                          style={{ fontSize: isMobile ? '0.6rem' : '0.7rem' }}
                        >
                          Rs. {product.originalPrice?.toLocaleString()}
                        </span>
                      )}
                      <span
                        className="current-price fw-bold"
                        style={{
                          color: logoColors.primary,
                          fontSize: isMobile ? '0.78rem' : '0.95rem'
                        }}
                      >
                        Rs. {product.discountedPrice?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="rating-wrapper mb-1">
                    <RatingStars 
                      rating={product.averageRating || 0} 
                      reviewCount={product.reviewCount || 0} 
                      size="small" 
                    />
                  </div>

                  {/* Stock Badge - Mobile only */}
                  <div className="d-md-none mb-1">
                    <Badge
                      bg={product.stock > 0 ? 'success' : 'danger'}
                      style={{
                        background: product.stock > 0 ? logoColors.primary : '#dc3545',
                        border: 'none',
                        fontSize: '0.55rem',
                        padding: '2px 5px',
                        fontWeight: '400'
                      }}
                    >
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>

                  {/* Add to Cart Button - Mobile only */}
                  {onAddToCart && (
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="d-md-none w-100"
                      disabled={product.stock <= 0}
                      style={{
                        background: product.stock > 0 ? logoColors.gradient : '#e2e8f0',
                        color: product.stock > 0 ? 'white' : '#718096',
                        border: 'none',
                        padding: '5px 0',
                        borderRadius: '5px',
                        fontSize: '0.7rem',
                        fontWeight: '500',
                        cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease',
                        marginTop: 'auto'
                      }}
                    >
                      {product.stock > 0 ? (
                        <><FaShoppingCart className="me-1" size={10} />Add to Cart</>
                      ) : (
                        <><FaShoppingCart className="me-1" size={10} />Out of Stock</>
                      )}
                    </button>
                  )}
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RecommendedProducts;