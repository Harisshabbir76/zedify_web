import React, { useState, useEffect } from 'react';
import './heroSlider.css';
import hero1 from '../images/hero1.png';
import hero2 from '../images/hero2.png';
import hero3 from '../images/hero3.png';

// Logo pink color palette
const logoColors = {
  primary: '#FF69B4', // Hot pink - main logo color
  secondary: '#FF1493', // Deep pink - darker shade
  light: '#FFB6C1', // Light pink - for accents
  dark: '#C71585', // Medium violet red - very dark pink
  background: '#FFF5F7', // Super light pink - almost white
  gradient: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)', // Pink gradient from logo
  softGradient: 'linear-gradient(135deg, #FFF0F3 0%, #FFE4E8 100%)', // Very soft pink gradient
};

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: hero1,
      title: 'Summer Collection',
      subtitle: 'Discover our new arrivals',
      ctaText: 'Shop Now',
      ctaLink: '/catalog'
    },
    {
      image: hero2,
      title: 'Winter Specials',
      subtitle: 'Up to 50% off selected items',
      ctaText: 'View Offers',
      ctaLink: '/catalog'
    },
    {
      image: hero3,
      title: 'New Arrivals',
      subtitle: 'Fresh styles for the season',
      ctaText: 'Explore',
      ctaLink: '/new-arrivals'
    }
  ];

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="hero-slider" style={{ background: logoColors.background }}>
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
          <div className="slide-content">
            <h1 style={{ color: 'white', textShadow: `2px 2px 4px ${logoColors.dark}` }}>{slide.title}</h1>
            <p style={{ color: 'rgba(255,255,255,0.95)', textShadow: `1px 1px 2px ${logoColors.dark}` }}>{slide.subtitle}</p>
            <a
              href={slide.ctaLink}
              className="cta-button"
              style={{
                background: logoColors.gradient,
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '50px',
                fontWeight: '600',
                fontSize: '1rem',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 15px ${logoColors.primary}40`,
                display: 'inline-block'
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