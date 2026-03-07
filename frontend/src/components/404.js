import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

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

const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: logoColors.background
    }}>
      {/* Navbar removed - it should be in your layout component */}

      <Container
        className="d-flex flex-column align-items-center justify-content-center text-center py-5"
        style={{ flex: 1 }}
      >
        <div
          className="p-5 rounded"
          style={{
            background: logoColors.softGradient,
            border: `1px solid ${logoColors.light}`,
            boxShadow: `0 10px 25px -5px ${logoColors.primary}30`
          }}
        >
          <h1
            className="display-1 fw-bold mb-4"
            style={{
              background: logoColors.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: `0 2px 10px ${logoColors.primary}40`
            }}
          >
            404
          </h1>

          <h2 className="h4 mb-4" style={{ color: logoColors.dark }}>
            Oops! Page not found
          </h2>

          <p className="mb-4" style={{ color: '#4A5568', maxWidth: '500px' }}>
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Button
            as={Link}
            to="/"
            variant="primary"
            className="px-5 py-3"
            style={{
              background: logoColors.gradient,
              border: 'none',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '0.9';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = `0 8px 20px ${logoColors.primary}40`;
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '1';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Return Home
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default NotFoundPage;