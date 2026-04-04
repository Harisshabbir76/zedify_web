import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import { FiStar } from 'react-icons/fi';

// Navbar color palette - reuse from other components
const logoColors = {
  primary: '#fe7e8b',
  secondary: '#e65c70',
  light: '#ffd1d4',
  dark: '#d64555',
  background: '#fff5f6',
  gradient: 'linear-gradient(135deg, #fe7e8b 0%, #e65c70 100%)',
};

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        console.log('Fetching featured products...');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/featured-products`);
        console.log('Featured products response:', response.data);
        console.log('Number of featured products:', response.data.length);
        
        if (response.data.length === 0) {
          console.log('No featured products found. Check if any products have isFeatured=true');
        } else {
          console.log('Featured products:', response.data.map(p => ({ name: p.name, isFeatured: p.isFeatured })));
        }
        
        setFeaturedProducts(response.data);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const getProductImage = (product) => {
    if (!product?.image?.[0]) return '/placeholder.jpg';
    if (product.image[0].startsWith('http')) return product.image[0];
    return `${process.env.REACT_APP_API_URL}${product.image[0]}`;
  };

  const getProductPath = (product) => {
    return `/product/${product.slug || product._id}`;
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" style={{ color: logoColors.primary }} />
        <p className="mt-3 text-muted">Loading featured products...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: logoColors.softGradient || '#fff5f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <FiStar size={32} style={{ color: logoColors.primary }} />
          </div>
          <h4 style={{ color: logoColors.dark, marginBottom: '0.5rem' }}>No Featured Products Yet</h4>
          <p style={{ color: '#718096', fontSize: '1rem', maxWidth: '400px', margin: '0 auto' }}>
            Check back soon for our featured collection!
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5" style={{ backgroundColor: '#fff5f6' }}>
      <Container>
        <div className="text-center mb-5">
          <h2 style={{ 
            color: '#2D3748', 
            fontWeight: 'bold',
            fontSize: '2.5rem',
            marginBottom: '1rem'
          }}>
            <FiStar style={{ color: logoColors.primary, marginRight: '1rem' }} />
            Featured Products
          </h2>
          <p style={{ color: '#718096', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Our hand-picked selection of top products you won't want to miss
          </p>
          <div style={{
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${logoColors.primary}40, transparent)`,
            width: 'clamp(80px, 20vw, 200px)',
            margin: '1rem auto'
          }} />
        </div>

        <Row className="g-4">
          {featuredProducts.map((product) => (
            <Col key={product._id} xs={6} sm={6} md={4} lg={3}>
              <Link to={getProductPath(product)} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card className="featured-card h-100 border-0 shadow-sm" 
                      style={{ 
                        borderRadius: '16px', 
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        background: 'white',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = `0 8px 20px ${logoColors.primary}30`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                      }}>
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <Card.Img 
                      variant="top"
                      src={getProductImage(product)}
                      style={{ 
                        height: '100%', 
                        width: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: logoColors.gradient,
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      zIndex: 2
                    }}>
                      Featured
                    </div>
                    {product.discountedPrice < product.originalPrice && (
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        background: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        zIndex: 2
                      }}>
                        {Math.round(100 - (product.discountedPrice / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  <Card.Body className="p-3">
                    <Card.Title className="mb-2" style={{ 
                      fontSize: '0.9rem', 
                      fontWeight: '600', 
                      color: '#2D3748',
                      height: '2.5rem',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {product.name}
                    </Card.Title>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        {product.originalPrice && product.discountedPrice < product.originalPrice && (
                          <small className="text-muted text-decoration-line-through me-2" style={{ fontSize: '0.7rem' }}>
                            Rs. {product.originalPrice}
                          </small>
                        )}
                        <strong style={{ color: logoColors.primary, fontSize: '1rem' }}>
                          Rs. {product.discountedPrice || product.originalPrice}
                        </strong>
                      </div>
                    </div>
                    <div className="mt-2">
                      <RatingStars rating={product.averageRating || 0} reviewCount={product.reviewCount || 0} size="small" />
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default FeaturedProducts;