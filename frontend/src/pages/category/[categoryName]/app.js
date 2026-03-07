import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaBoxOpen, FaStar } from 'react-icons/fa';
import { CartContext } from '../../../components/CartContext';
import FilterComponent from '../../../components/Filter';
import '../../../App.css';

// Logo pink color palette
const logoColors = {
  primary: '#FF69B4', // Hot pink - main logo color
  secondary: '#FF1493', // Deep pink - darker shade
  light: '#FFB6C1', // Light pink - for accents
  dark: '#C71585', // Medium violet red - very dark pink
  background: '#FFF5F7', // Super light pink - almost white
  lighterBg: '#FFF9FA', // Even lighter - subtle pink tint
  gradient: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)', // Pink gradient from logo
  softGradient: 'linear-gradient(135deg, #FFF0F3 0%, #FFE4E8 100%)', // Very soft pink gradient
};

export default function CategoryProducts() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    if (!categoryName) return;

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/${encodeURIComponent(categoryName)}`);
        const productsWithDefaults = res.data.map(product => ({
          ...product,
          stock: product.stock !== undefined ? product.stock : Math.floor(Math.random() * 16) + 5,
          rating: product.rating || (Math.random() * 1 + 4).toFixed(1)
        }));
        setProducts(productsWithDefaults);
        setFilteredProducts(productsWithDefaults);
      } catch (err) {
        setError(err.message || 'Failed to load products');
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  useEffect(() => {
    const sortProducts = () => {
      let sorted = [...products];

      switch (sortOption) {
        case 'price-high-low':
          sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);
          break;
        case 'price-low-high':
          sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);
          break;
        case 'rating-high':
          sorted.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }

      setFilteredProducts(sorted);
    };

    sortProducts();
  }, [sortOption, products]);

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart({
        ...product,
        quantity: 1
      });
    }
  };

  const getProductImage = (product) => {
    if (!product?.image?.[0]) return '/placeholder.jpg';
    if (product.image[0].startsWith('http')) return product.image[0];
    return `${process.env.REACT_APP_API_URL}${product.image[0]}`;
  };

  const renderProductCard = (product) => (
    <Col key={product._id} xs={6} md={4} lg={3} className="mb-4">
      <Card
        className="product-card h-100 border-0"
        onClick={() => product.stock > 0 && navigate(`/category/${categoryName}/${product.slug}`)}
        style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          cursor: product.stock > 0 ? 'pointer' : 'default'
        }}
        onMouseEnter={(e) => {
          if (product.stock > 0) {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = `0 8px 20px ${logoColors.primary}30`;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
        }}
      >
        <div className="product-image-container" style={{ position: 'relative' }}>
          <Card.Img
            variant="top"
            src={getProductImage(product)}
            alt={product.name}
            className="product-img"
            style={{
              height: '200px',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (product.stock > 0) {
                e.target.style.transform = 'scale(1.05)';
              }
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
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#2D3748',
              marginBottom: '0.25rem'
            }}
          >
            {product.name}
          </Card.Title>
          <Card.Text className="text-muted product-category" style={{
            fontSize: '0.85rem',
            marginBottom: '0.5rem',
            color: '#718096'
          }}>
            {product.category || 'Uncategorized'}
          </Card.Text>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="price">
                {product.discountedPrice < product.originalPrice && (
                  <span className="original-price text-muted text-decoration-line-through me-2" style={{ fontSize: '0.8rem' }}>
                    ${product.originalPrice}
                  </span>
                )}
                <span className="current-price fw-bold" style={{ color: logoColors.primary, fontSize: '1.1rem' }}>
                  ${product.discountedPrice || product.price}
                </span>
              </div>
              <div className="rating" style={{ fontSize: '0.85rem' }}>
                <FaStar style={{ color: logoColors.primary }} />
                <span className="ms-1" style={{ color: '#4A5568' }}>{product.rating}</span>
              </div>
            </div>
            <button
              className={`add-to-cart-btn w-100 mt-2 ${product.stock <= 0 ? 'disabled' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
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
              data-track={product.stock > 0 ? "add_to_cart" : undefined}
              data-track-meta={product.stock > 0 ? JSON.stringify({
                product_id: product.id,
                price: product.price,
                name: product.name,
                category: product.category,
                stock_status: 'in_stock'
              }) : undefined}
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
          <h1 className="page-header" style={{ color: logoColors.dark, textTransform: 'capitalize' }}>
            {categoryName}
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
          onSortChange={setSortOption}
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
        ) : filteredProducts.length === 0 ? (
          <Alert variant="info" className="text-center">
            No products found in this category.
          </Alert>
        ) : (
          <>
            <div className="d-block d-md-none">
              <Row className="g-3">
                {filteredProducts.map(product => renderProductCard(product))}
              </Row>
            </div>

            <div className="d-none d-md-block">
              <Row className="g-4">
                {filteredProducts.map(product => renderProductCard(product))}
              </Row>
            </div>
          </>
        )}
      </Container>
    </Container>
  );
}