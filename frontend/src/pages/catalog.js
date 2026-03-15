import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Badge
} from 'react-bootstrap';
import { FaShoppingCart, FaBoxOpen, FaStar } from 'react-icons/fa';
import { CartContext } from '../components/CartContext';
import FilterComponent from '../components/Filter';
import '../App.css';

// Navbar color palette
const logoColors = {
  primary: '#fe7e8b', // Navbar primary color
  secondary: '#e65c70', // Navbar secondary color
  light: '#ffd1d4', // Navbar light color
  dark: '#d64555', // Navbar dark color
  background: '#fff5f6', // Super light - almost white
  lighterBg: '#fff9fa', // Even lighter - subtle tint
  gradient: 'linear-gradient(135deg, #fe7e8b 0%, #e65c70 100%)', // Navbar gradient
  softGradient: 'linear-gradient(135deg, #fff5f6 0%, #ffd1d4 100%)', // Very soft gradient
};

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('default');
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/catalog`);
        const data = res.data;

        let products = [];

        if (Array.isArray(data)) {
          products = data;
        } else if (data && Array.isArray(data.data)) {
          products = data.data;
        } else if (data && Array.isArray(data.products)) {
          products = data.products;
        } else {
          throw new Error('Unexpected API response: expected an array of products');
        }

        const processedProducts = products.map(product => ({
          ...product,
          stock: product.stock !== undefined ? product.stock : 0,
          rating: product.averageRating || 0,
          reviewCount: product.reviewCount || 0,
          price: product.discountedPrice || product.price || 0,
          createdAt: product.createdAt ? new Date(product.createdAt) : new Date()
        }));

        setProducts(processedProducts);
        setFilteredProducts(processedProducts);

        const uniqueCategories = [...new Set(processedProducts.map(p => {
          if (typeof p.category === 'object' && p.category !== null) return p.category.name;
          return p.category;
        }).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load products');
        console.error('Fetch products error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(p => {
        const catName = typeof p.category === 'object' ? p.category.name : p.category;
        return catName === selectedCategory;
      });
    }

    switch (sortOption) {
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'rating-high':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      default:
        // Default sorting
        break;
    }

    setFilteredProducts(filtered);
  }, [sortOption, products, selectedCategory]);

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const getProductImage = (product) => {
    if (!product?.image?.[0]) return '/placeholder.jpg';
    if (product.image[0].startsWith('http')) return product.image[0];
    return `${process.env.REACT_APP_API_URL}${product.image[0]}`;
  };

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart({
        ...product,
        quantity: 1
      });
    }
  };

  const renderProductCard = (product) => (
    <Col key={product._id || product.id}>
      <Card className="product-card h-100 border-0" style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
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
        <div className="product-image-container" style={{ position: 'relative' }}>
          <Card.Img
            onClick={() => navigate(`/catalog/${product.slug}`)}
            variant="top"
            src={getProductImage(product)}
            alt={product.name}
            className="product-img"
            style={{
              height: '250px',
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
          {product.discountedPrice < product.originalPrice && (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: logoColors.gradient,
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              zIndex: 1
            }}>
              {Math.round(100 - (product.discountedPrice / product.originalPrice) * 100)}% OFF
            </div>
          )}
          <Badge
            bg={product.stock > 0 ? "success" : "danger"}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              padding: '4px 8px',
              fontSize: '0.7rem',
              zIndex: 1,
              background: product.stock > 0 ? logoColors.primary : '#dc3545',
              border: 'none'
            }}
          >
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>
        <Card.Body className="d-flex flex-column" style={{ padding: '1rem' }}>
          <Card.Title
            className="product-title"
            onClick={() => navigate(`/catalog/${product.slug}`)}
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#2D3748',
              marginBottom: '0.25rem',
              cursor: 'pointer'
            }}
          >
            {product.name}
          </Card.Title>
          <Card.Text className="text-muted product-category" style={{
            fontSize: '0.85rem',
            marginBottom: '0.5rem'
          }}>
            {typeof product.category === 'object' ? product.category.name : (product.category || 'Uncategorized')}
          </Card.Text>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="price">
                {product.discountedPrice < product.originalPrice && (
                  <span className="original-price text-muted text-decoration-line-through me-2" style={{ fontSize: '0.8rem' }}>
                    Rs. {product.originalPrice}
                  </span>
                )}
                <span className="current-price fw-bold" style={{ color: logoColors.primary, fontSize: '1.1rem' }}>
                  Rs. {product.discountedPrice || product.price}
                </span>
              </div>
              <div className="rating" style={{ fontSize: '0.85rem' }}>
                {product.reviewCount > 0 ? (
                  <>
                    <FaStar style={{ color: logoColors.primary }} />
                    <span className="ms-1" style={{ color: '#4A5568' }}>{product.rating.toFixed(1)}</span>
                    <small className="text-muted ms-1" style={{ color: '#718096' }}>({product.reviewCount})</small>
                  </>
                ) : (
                  <small className="text-muted" style={{ color: '#718096' }}>No reviews yet</small>
                )}
              </div>
            </div>
            <button
              className={`add-to-cart-btn w-100 mt-2 ${product.stock <= 0 ? 'disabled' : ''}`}
              onClick={() => handleAddToCart(product)}
              disabled={product.stock <= 0}
              style={{
                background: product.stock > 0 ? logoColors.gradient : '#e2e8f0',
                color: product.stock > 0 ? 'white' : '#718096',
                border: 'none',
                padding: '0.6rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (product.stock > 0) {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 4px 12px ${logoColors.primary}40`;
                }
              }}
              onMouseLeave={(e) => {
                if (product.stock > 0) {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {product.stock > 0 ? (
                <>
                  <FaShoppingCart className="me-2" />
                  Add to Cart
                </>
              ) : (
                <>
                  <FaBoxOpen className="me-2" />
                  Out of Stock
                </>
              )}
            </button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Container fluid className="tshirt-products-page py-3 py-md-5" style={{
      background: logoColors.background,
      minHeight: '100vh'
    }}>
      <Container>
        <div className="page-header-wrapper mb-4 mb-md-5 text-center">
          <h1 className="page-header" style={{ color: logoColors.dark }}>
            Our Products
          </h1>

          {/* Decorative line under header */}
          <div style={{
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${logoColors.primary}40, transparent)`,
            width: '150px',
            margin: '1rem auto 2rem auto'
          }} />
        </div>

        <FilterComponent
          sortOption={sortOption}
          onSortChange={handleSortChange}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {loading ? (
          <div className="text-center my-5 py-5">
            <Spinner animation="border" style={{ color: logoColors.primary }} />
            <p className="mt-3" style={{ color: '#4A5568' }}>Loading products...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        ) : (
          <>
            {/* Mobile view - show 2 products per row */}
            <div className="d-block d-md-none">
              <Row xs={2} className="g-3">
                {filteredProducts.map(product => renderProductCard(product))}
              </Row>
            </div>

            {/* Tablet/Desktop view - show responsive columns */}
            <div className="d-none d-md-block">
              <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {filteredProducts.map(product => renderProductCard(product))}
              </Row>
            </div>
          </>
        )}
      </Container>
    </Container>
  );
}