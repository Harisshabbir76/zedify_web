import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
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

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);

        if (!res || !res.data) {
          throw new Error('No data received from server');
        }

        let categories = [];

        if (Array.isArray(res.data)) {
          categories = res.data;
        } else if (Array.isArray(res.data.categories)) {
          categories = res.data.categories;
        } else if (Array.isArray(res.data.data)) {
          categories = res.data.data;
        } else if (Array.isArray(res.data.items)) {
          categories = res.data.items;
        } else {
          throw new Error('Invalid data format: Expected array');
        }

        setCategories(categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message || 'Failed to load categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Function to get the full image URL from Cloudinary
  const getCategoryImageUrl = (category) => {
    if (!category.image) {
      return null;
    }
    
    // If it's already a full URL (starts with http), return as is
    if (category.image.startsWith('http')) {
      return category.image;
    }
    
    // If it's a Cloudinary path, construct the full URL
    if (category.image.includes('cloudinary')) {
      return category.image;
    }
    
    // Otherwise, prepend the API URL (assuming it's a relative path)
    return `${process.env.REACT_APP_API_URL}${category.image.startsWith('/') ? '' : '/'}${category.image}`;
  };

  // Fallback icon based on category name
  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('watch')) return '⌚';
    if (name.includes('fashion')) return '👗';
    if (name.includes('ethnic')) return '🥻';
    if (name.includes('goggle')) return '👓';
    if (name.includes('tote') || name.includes('bag')) return '👜';
    if (name.includes('shoe')) return '👟';
    if (name.includes('men')) return '👔';
    if (name.includes('women')) return '👚';
    if (name.includes('kids')) return '👕';
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
            Error loading categories: {error}
          </Alert>
        ) : categories.length === 0 ? (
          <Alert variant="info" className="text-center">
            No categories found.
          </Alert>
        ) : (
          <div className="categories-circle-grid">
            {categories.map((category) => (
              <div
                key={category._id || category.name}
                className="category-circle-wrapper"
                onClick={() => navigate(`/category/${category.name.replace(/\s+/g, '-').replace(/'/g, '')}`)}
                style={{ cursor: 'pointer' }}
              >
                {/* Category Circle */}
                <div className="category-circle">
                  {getCategoryImageUrl(category) ? (
                    <img 
                      src={getCategoryImageUrl(category)} 
                      alt={category.name}
                      className="category-circle-image"
                      onError={(e) => {
                        // If image fails to load, show icon instead
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="category-circle-icon">${getCategoryIcon(category.name)}</span>`;
                        }
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