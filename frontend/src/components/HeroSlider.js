import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './heroSlider.css';

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

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/hero-slides`);
        if (res.data && res.data.length > 0) {
          setSlides(res.data);
        } else {
          // Fallback slides if API returns empty
          setSlides([
            {
              image: 'https://via.placeholder.com/1920x800',
              mainTitle: 'HAIR DRYER',
              subtitle: 'Checkout latest dryer',
              description: 'Made from Soft. Durable. US-grown Supima Cotton.',
              ctaText: 'Shop Now',
              ctaLink: '/catalog'
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching hero slides:', err);
        // Fallback slides on error
        setSlides([
          {
            image: 'https://via.placeholder.com/1920x800',
            mainTitle: 'HAIR DRYER',
            subtitle: 'Checkout latest dryer',
            description: 'Made from Soft. Durable. US-grown Supima Cotton.',
            ctaText: 'Shop Now',
            ctaLink: '/catalog'
          }
        ]);
      }
    };
    fetchSlides();
  }, []);

  const goToNext = React.useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?query=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [goToNext, slides.length]);

  if (slides.length === 0) {
    return null; // Don't render slider if there are no slides 
  }

  return (
    <div className="hero-slider" style={{ 
      background: logoColors.background, 
      marginTop: '0 !important', 
      paddingTop: '0 !important',
      position: 'relative',
      top: 0
    }}>
      {/* Previous arrow button */}
      <button
        className="slider-arrow prev-arrow"
        onClick={goToPrev}
        aria-label="Previous slide"
        style={{
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(5px)',
          border: `1px solid ${logoColors.light}`,
          color: 'white',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = logoColors.gradient;
          e.target.style.borderColor = 'transparent';
          e.target.style.transform = 'translateY(-50%) scale(1.1)';
          e.target.style.boxShadow = `0 4px 12px ${logoColors.primary}40`;
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.2)';
          e.target.style.borderColor = logoColors.light;
          e.target.style.transform = 'translateY(-50%) scale(1)';
          e.target.style.boxShadow = 'none';
        }}
      >
        &#10094;
      </button>

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div
            className="slide-content-left"
            style={{
              position: 'absolute',
              top: '50%',
              left: window.innerWidth <= 768 ? '50%' : '10%',
              transform: window.innerWidth <= 768 ? 'translate(-50%, -50%)' : 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: window.innerWidth <= 768 ? 'center' : 'flex-start',
              width: '90%',
              maxWidth: '700px',
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              zIndex: 2,
              textAlign: window.innerWidth <= 768 ? 'center' : 'left'
            }}
          >
            {/* Main Title - Increased size and made bolder */}
            <h1 style={{
              fontSize: 'clamp(4rem, 9vw, 7rem)',
              fontWeight: '900',
              marginBottom: '1rem',
              lineHeight: '1.1',
              color: 'white',
              width: '100%',
              wordWrap: 'break-word',
              textAlign: 'inherit',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              {slide.mainTitle}
            </h1>

            {/* Subtitle - Dynamic sizing */}
            <p style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
              marginBottom: '0.75rem',
              color: 'rgba(255,255,255,0.95)',
              lineHeight: '1.4',
              width: '100%',
              wordWrap: 'break-word',
              textAlign: 'inherit'
            }}>
              {slide.subtitle}
            </p>

            {/* Description - Dynamic sizing */}
            <p style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              marginBottom: '2rem',
              color: 'rgba(255,255,255,0.95)',
              lineHeight: '1.6',
              width: '100%',
              wordWrap: 'break-word',
              textAlign: 'inherit'
            }}>
              {slide.description}
            </p>

            {/* Search Bar - Moved UP */}
            <div style={{
              marginBottom: '1.5rem',
              width: '100%',
              maxWidth: 'min(500px, 100%)'
            }}>
              <form
                onSubmit={handleSearch}
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  background: 'white',
                  borderRadius: '50px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  width: '100%',
                  height: '48px'
                }}
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    padding: '0 1.2rem',
                    fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                    outline: 'none',
                    background: 'transparent',
                    display: 'block'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: logoColors.gradient,
                    border: 'none',
                    color: 'white',
                    width: '56px',
                    flexShrink: 0,
                    cursor: 'pointer',
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Shop Now button - Moved BELOW Search */}
            <div style={{
              display: 'flex',
              justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start',
              width: '100%',
              marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)'
            }}>
              <a
                href={slide.ctaLink}
                className="slide-shop-btn"
                style={{
                  background: logoColors.gradient,
                  color: 'white',
                  border: 'none',
                  padding: 'clamp(0.6rem, 2.5vw, 1rem) clamp(2rem, 5vw, 3.5rem)',
                  borderRadius: '50px',
                  fontWeight: '700',
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 4px 15px ${logoColors.primary}40`,
                  display: 'inline-block',
                  textAlign: 'center',
                  minWidth: 'clamp(140px, 25vw, 200px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 6px 20px ${logoColors.primary}60`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = `0 4px 15px ${logoColors.primary}40`;
                }}
              >
                {slide.ctaText}
              </a>
            </div>

            {/* Sign Up Link */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start',
              gap: '0.5rem',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
              marginTop: '0.5rem',
              flexWrap: 'wrap',
              width: '100%'
            }}>
              <span style={{ color: 'rgba(255,255,255,0.9)' }}>Not yet Member?</span>
              <a
                href="/signup"
                style={{
                  color: 'white',
                  textDecoration: 'underline',
                  fontWeight: '700',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = logoColors.primary}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                Sign Up Now
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Next arrow button */}
      <button
        className="slider-arrow next-arrow"
        onClick={goToNext}
        aria-label="Next slide"
        style={{
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(5px)',
          border: `1px solid ${logoColors.light}`,
          color: 'white',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = logoColors.gradient;
          e.target.style.borderColor = 'transparent';
          e.target.style.transform = 'translateY(-50%) scale(1.1)';
          e.target.style.boxShadow = `0 4px 12px ${logoColors.primary}40`;
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.2)';
          e.target.style.borderColor = logoColors.light;
          e.target.style.transform = 'translateY(-50%) scale(1)';
          e.target.style.boxShadow = 'none';
        }}
      >
        &#10095;
      </button>

      {/* Dots indicator */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              padding: 0,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: index === currentSlide ? logoColors.primary : 'rgba(255,255,255,0.5)',
              border: index === currentSlide ? 'none' : `1px solid ${logoColors.light}`,
              transform: index === currentSlide ? 'scale(1.2)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.2)';
              if (index !== currentSlide) {
                e.target.style.background = logoColors.light;
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = index === currentSlide ? 'scale(1.2)' : 'scale(1)';
              if (index !== currentSlide) {
                e.target.style.background = 'rgba(255,255,255,0.5)';
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;