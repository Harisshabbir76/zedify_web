import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaChevronRight } from 'react-icons/fa';
import './heroSlider.css';

import bottomImg from '../images/bottom.jpeg';
import poloImg from '../images/polo.jpeg';
import tshirtImg from '../images/t-shirt.jpeg';
import watchImg from '../images/watch.jpeg';
import BrowseImg from '../images/browse.jpeg';

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

const categoryImages = {
  'bottom': bottomImg,
  'polo': poloImg,
  't-shirt': tshirtImg,
  'watch': watchImg
};

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);
        setCategories(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryImage = (category) => {
    return categoryImages[category] || 'https://via.placeholder.com/300';
  };

  // Function to render category card
  const renderCategoryCard = (category, isBrowseAll = false) => (
    <Col key={isBrowseAll ? 'browse-all' : category} className="mb-4">
      <Card
        className="product-card h-100 border-0"
        onClick={() =>
          isBrowseAll
            ? navigate('/category')
            : navigate(`/category/${category.toString().replace(/\s+/g, '-')}`)
        }
        role="button"
        style={{
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
        }}
      >
        <div className="product-image-container" style={{ position: 'relative' }}>
          <Card.Img
            variant="top"
            src={isBrowseAll ? BrowseImg : getCategoryImage(category)}
            alt={isBrowseAll ? 'Browse All' : category}
            className="product-img"
            style={{
              height: '200px',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          />
        </div>
        <Card.Body className="d-flex flex-column" style={{ padding: '1rem' }}>
          <Card.Title
            className="product-title text-capitalize"
            style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#2D3748',
              marginBottom: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isBrowseAll ? 'Browse All' : category}
            <FaChevronRight
              className="ms-2"
              style={{
                color: logoColors.primary,
                fontSize: '0.9rem',
                transition: 'transform 0.2s ease'
              }}
            />
          </Card.Title>
          {isBrowseAll && (
            <Card.Text
              className="product-category"
              style={{
                fontSize: '0.9rem',
                color: '#718096',
                textAlign: 'center'
              }}
            >
              See all categories
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Container fluid style={{ background: logoColors.background, minHeight: '100vh', padding: '2rem 0' }}>
      <Container className="tshirt-products-page py-3 py-md-5">
        <div className="page-header-wrapper mb-4 mb-md-5 text-center">
          <h1 className="page-header" style={{ color: logoColors.dark }}>Shop by Category</h1>

          {/* Decorative line under header */}
          <div style={{
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${logoColors.primary}40, transparent)`,
            width: '150px',
            margin: '1rem auto 2rem auto'
          }} />
        </div>

        {loading ? (
          <div className="text-center my-5 py-5">
            <Spinner animation="border" style={{ color: logoColors.primary }} />
            <p className="mt-3" style={{ color: '#4A5568' }}>Loading categories...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">
            Error loading categories: {error.message}
          </Alert>
        ) : (
          <>
            {/* Mobile view - show only 3 categories + browse all (2x2 grid) */}
            <div className="d-block d-md-none">
              <Row xs={2} className="g-3">
                {categories.slice(0, 3).map(category => renderCategoryCard(category))}
                {renderCategoryCard(null, true)}
              </Row>
            </div>

            {/* Tablet/Desktop view - show all categories with responsive columns */}
            <div className="d-none d-md-block">
              <Row xs={1} sm={2} md={3} lg={5} className="g-4">
                {categories.slice(0, 4).map(category => renderCategoryCard(category))}
                {renderCategoryCard(null, true)}
              </Row>
            </div>
          </>
        )}
      </Container>
    </Container>
  );
}