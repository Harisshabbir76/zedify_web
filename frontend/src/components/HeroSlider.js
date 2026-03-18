import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './heroSlider.css';

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
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateSize = () => setIsMobile(window.innerWidth <= 768);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/hero-slides`);
        setSlides(res.data || []);
      } catch (err) {
        console.error('Error fetching hero slides:', err);
        setSlides([{
          desktopImage: 'https://via.placeholder.com/1920x800',
          mobileImage: 'https://via.placeholder.com/390x500',
          title: 'HAIR DRYER',
          subtitle: 'Checkout latest dryer',
          ctaText: 'Shop Now',
          ctaLink: '/catalog'
        }]);
      }
    };
    fetchSlides();
  }, []);

  const goToNext = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => prev === 0 ? slides.length - 1 : prev - 1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?query=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext, slides.length]);

  const getImageSrc = (slide) => {
    if (isMobile && slide.mobileImage) return slide.mobileImage;
    return slide.desktopImage || slide.image || 'https://via.placeholder.com/1920x800';
  };

  if (slides.length === 0) return null;

  const currentSlideData = slides[currentSlide];

  // ── Helper: split title into words and render each on its own line ──
  const renderTitle = (title) => {
    const words = (title || 'Featured').split(' ');
    return words.map((word, i) => (
      <span key={i} style={{ display: 'block' }}>{word}</span>
    ));
  };

  const contentPosition = {
    position: 'absolute',
    top: '50%',
    left: isMobile ? '50%' : '10%',
    transform: isMobile ? 'translate(-50%, -50%)' : 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: isMobile ? 'center' : 'flex-start',
    width: isMobile ? '88%' : '45%',
    maxWidth: isMobile ? '420px' : '600px',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    zIndex: 2,
    textAlign: isMobile ? 'center' : 'left',
    padding: isMobile ? '0 8px' : '0',
  };

  // Each word is forced to its own line via renderTitle(), so font size stays readable
  const titleStyle = {
    fontSize: isMobile ? '2rem' : 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: '900',
    marginBottom: isMobile ? '0.4rem' : '0.75rem',
    lineHeight: '1.05',
    color: 'white',
    width: '100%',
    textAlign: 'inherit',
    textTransform: 'uppercase',
    letterSpacing: isMobile ? '1px' : '2px',
  };

  const subtitleStyle = {
    fontSize: isMobile ? '0.78rem' : '0.95rem',
    marginBottom: isMobile ? '0.65rem' : '0.75rem',
    color: 'rgba(255,255,255,0.95)',
    lineHeight: '1.4',
    width: '100%',
    wordWrap: 'break-word',
    textAlign: 'inherit',
  };

  const searchWrapperStyle = {
    marginBottom: isMobile ? '1rem' : '1.5rem',
    width: '100%',
    maxWidth: isMobile ? '320px' : '500px',
  };

  const searchFormStyle = {
    display: 'flex',
    alignItems: 'stretch',
    background: 'white',
    borderRadius: '50px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    width: '100%',
    height: isMobile ? '36px' : '42px',
  };

  const searchInputStyle = {
    flex: 1,
    border: 'none',
    padding: isMobile ? '0 0.9rem' : '0 1.2rem',
    fontSize: isMobile ? '0.78rem' : '0.85rem',
    outline: 'none',
    background: 'transparent',
  };

  const searchBtnStyle = {
    background: logoColors.gradient,
    border: 'none',
    color: 'white',
    width: isMobile ? '38px' : '44px',
    flexShrink: 0,
    cursor: 'pointer',
    transition: 'opacity 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const ctaRowStyle = {
    display: 'flex',
    justifyContent: isMobile ? 'center' : 'flex-start',
    width: '100%',
    marginBottom: isMobile ? '1rem' : 'clamp(1.5rem, 3vh, 2.5rem)',
  };

  const ctaBtnStyle = {
    background: logoColors.gradient,
    color: 'white',
    border: 'none',
    padding: isMobile ? '8px 20px' : '9px 24px',
    borderRadius: '50px',
    fontWeight: '600',
    fontSize: isMobile ? '0.78rem' : '0.85rem',
    letterSpacing: '0.5px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    boxShadow: `0 4px 15px ${logoColors.primary}40`,
    display: 'inline-block',
    textAlign: 'center',
  };

  const memberRowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isMobile ? 'center' : 'flex-start',
    gap: '0.4rem',
    fontSize: isMobile ? '0.72rem' : '0.82rem',
    marginTop: isMobile ? '0.25rem' : '0.5rem',
    flexWrap: 'wrap',
    width: '100%',
  };

  const svgSize = isMobile ? 13 : 15;

  return (
    <div
      className="hero-slider"
      style={{ background: logoColors.background, marginTop: '0 !important', paddingTop: '0 !important' }}
    >
      {/* ── Prev Arrow ── */}
      <button
        className="slider-arrow prev-arrow"
        onClick={goToPrev}
        aria-label="Previous slide"
        style={{
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(5px)',
          border: `1px solid ${logoColors.light}`,
          color: 'white',
          transition: 'all 0.3s ease',
          width: isMobile ? '34px' : '44px',
          height: isMobile ? '34px' : '44px',
          fontSize: isMobile ? '0.9rem' : '1.1rem',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = logoColors.gradient;
          e.currentTarget.style.borderColor = 'transparent';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          e.currentTarget.style.boxShadow = `0 4px 12px ${logoColors.primary}40`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
          e.currentTarget.style.borderColor = logoColors.light;
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        &#10094;
      </button>

      {/* ── Slides ── */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${getImageSrc(slide)})` }}
        >
          <div style={contentPosition}>

            {/* Title — each word rendered as its own block line */}
            <h1 style={titleStyle}>
              {renderTitle(currentSlideData.title || currentSlideData.mainTitle || 'Featured')}
            </h1>

            {/* Subtitle */}
            <p style={subtitleStyle}>
              {currentSlideData.subtitle}
            </p>

            {/* Search Bar */}
            <div style={searchWrapperStyle}>
              <form onSubmit={handleSearch} style={searchFormStyle}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={searchInputStyle}
                />
                <button
                  type="submit"
                  style={searchBtnStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <svg width={svgSize} height={svgSize} viewBox="0 0 24 24" fill="none">
                    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" />
                    <path d="M15 15L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </form>
            </div>

            {/* CTA Button */}
            <div style={ctaRowStyle}>
              <a
                href={currentSlideData.ctaLink}
                className="slide-shop-btn"
                style={ctaBtnStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 6px 20px ${logoColors.primary}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 15px ${logoColors.primary}40`;
                }}
              >
                {currentSlideData.ctaText}
              </a>
            </div>

            {/* Sign Up Row */}
            <div style={memberRowStyle}>
              <span style={{ color: 'rgba(255,255,255,0.9)' }}>Not yet Member?</span>
              <a
                href="/signup"
                style={{ color: 'white', textDecoration: 'underline', fontWeight: '700', transition: 'color 0.3s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = logoColors.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
              >
                Sign Up Now
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* ── Next Arrow ── */}
      <button
        className="slider-arrow next-arrow"
        onClick={goToNext}
        aria-label="Next slide"
        style={{
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(5px)',
          border: `1px solid ${logoColors.light}`,
          color: 'white',
          transition: 'all 0.3s ease',
          width: isMobile ? '34px' : '44px',
          height: isMobile ? '34px' : '44px',
          fontSize: isMobile ? '0.9rem' : '1.1rem',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = logoColors.gradient;
          e.currentTarget.style.borderColor = 'transparent';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          e.currentTarget.style.boxShadow = `0 4px 12px ${logoColors.primary}40`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
          e.currentTarget.style.borderColor = logoColors.light;
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        &#10095;
      </button>

      {/* ── Dots ── */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            style={{
              width: isMobile ? '9px' : '12px',
              height: isMobile ? '9px' : '12px',
              borderRadius: '50%',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: index === currentSlide ? logoColors.primary : 'rgba(255,255,255,0.5)',
              border: index === currentSlide ? 'none' : `1px solid ${logoColors.light}`,
              transform: index === currentSlide ? 'scale(1.2)' : 'scale(1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.2)';
              if (index !== currentSlide) e.currentTarget.style.background = logoColors.light;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = index === currentSlide ? 'scale(1.2)' : 'scale(1)';
              if (index !== currentSlide) e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;