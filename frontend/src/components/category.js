import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import './heroSlider.css';

// Navbar color palette
const logoColors = {
  primary: '#fe7e8b',
  secondary: '#e65c70',
  light: '#ffd1d4',
  dark: '#d64555',
  background: '#fff5f6',
  gradient: 'linear-gradient(135deg, #fe7e8b 0%, #e65c70 100%)',
};

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);

        if (res.data && res.data.length > 0) {
          setCategories(res.data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryImage = (category) => {
    if (!category || !category.image) return '';
    if (category.image.startsWith('http')) return category.image;
    return `${process.env.REACT_APP_API_URL}${category.image.startsWith('/') ? '' : '/'}${category.image}`;
  };

  // Function to get icon based on category name (purely visual, no logic change)
  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('watch')) return '⌚';
    if (name.includes('fashion')) return '👗';
    if (name.includes('ethnic')) return '🥻';
    if (name.includes('goggle')) return '👓';
    if (name.includes('tote') || name.includes('bag')) return '👜';
    if (name.includes('shoe')) return '👟';
    return '📦';
  };

  return (
    <Container fluid style={{ background: logoColors.background, padding: '3rem 0' }}>
      <Container>
        {/* Section Title */}
        <h2 className="categories-circle-title">Categories</h2>

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
          <div className="categories-circle-grid">
            {categories.map((category) => (
              <div
                key={category._id || category.name}
                className="category-circle-wrapper"
                onClick={() => navigate(`/category/${category.name.replace(/\s+/g, '-').replace(/'/g, '')}`)}
              >
                {/* Category Circle */}
                <div className="category-circle">
                  {getCategoryImage(category) ? (
                    <img 
                      src={getCategoryImage(category)} 
                      alt={category.name}
                      className="category-circle-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<span class="category-circle-icon">${getCategoryIcon(category.name)}</span>`;
                      }}
                    />
                  ) : (
                    <span className="category-circle-icon">{getCategoryIcon(category.name)}</span>
                  )}
                </div>
                
                {/* Category Name */}
                <span className="category-circle-text">{category.name}</span>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Container>
  );
}