import React from 'react'
import Categories from '../components/category'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi';
import HeroSlider from '../components/HeroSlider'
import { useEffect, useState } from 'react';
import Tshirt from '../components/t-shirt'
import Bottom from '../components/bottom'
import ContactUs from './contact-us'

// Logo pink color palette - much lighter backgrounds
const logoColors = {
  primary: '#FF69B4', // Hot pink - main logo color
  secondary: '#FF1493', // Deep pink - darker shade
  light: '#FFB6C1', // Light pink - for accents
  dark: '#C71585', // Medium violet red - very dark pink
  background: '#FFF5F7', // Super light pink - almost white with hint of pink
  lighterBg: '#FFF9FA', // Even lighter - subtle pink tint
  gradient: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)', // Pink gradient from logo
  softGradient: 'linear-gradient(135deg, #FFF0F3 0%, #FFE4E8 100%)', // Very soft pink gradient
};

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 320);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Hero section style with very light pink overlay
  const heroStyle = {
    position: 'relative',
    background: logoColors.background,
    padding: 0,
    margin: 0,
  };

  const welcomeSectionStyle = {
    textAlign: 'center',
    padding: '4rem 1rem',
    background: logoColors.background, // Match all other light sections
  };

  const welcomeTitleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2D3748', // Dark gray instead of dark pink for better contrast on light bg
    marginBottom: '1rem',
  };

  const welcomeTextStyle = {
    fontSize: '1.1rem',
    color: '#4A5568', // Medium gray
    maxWidth: '600px',
    margin: '0 auto 2rem auto',
    lineHeight: '1.6',
  };

  const ctaButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 2rem',
    background: logoColors.gradient,
    color: 'white',
    border: 'none',
    borderRadius: '2rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    boxShadow: `0 4px 15px ${logoColors.primary}30`, // More subtle shadow
  };

  const sectionDividerStyle = {
    height: '1px',
    background: `linear-gradient(90deg, transparent, ${logoColors.primary}20, ${logoColors.primary}40, ${logoColors.primary}20, transparent)`,
    width: '100%',
    margin: '0 auto',
  };

  const sectionTitleStyle = {
    fontSize: '2rem',
    color: '#2D3748', // Dark gray
    marginBottom: '0.5rem',
    fontWeight: '600',
  };

  const sectionSubtitleStyle = {
    color: '#718096', // Light gray
    fontSize: '1rem',
  };

  return (
    <div style={{ background: logoColors.background }}> {/* Consistent base background */}
      {/* Hero Section */}
      <div style={heroStyle}>
        {!isMobile && <HeroSlider />}
        {isMobile && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ color: '#2D3748' }}>Welcome to Zedify</h2>
            <p style={{ color: logoColors.primary }}>Own your Aura</p>
          </div>
        )}
      </div>

      {/* Divider after Hero */}
      <div style={sectionDividerStyle}></div>

      {/* Welcome Section */}
      <div style={welcomeSectionStyle}>
        <div style={welcomeTitleStyle}>
          Own Your <span style={{ color: logoColors.primary }}>Aura</span>
        </div>
        <div style={welcomeTextStyle}>
          Discover our latest collection that speaks to your unique style.
          From trendy casuals to elegant essentials, find pieces that reflect your personality.
        </div>
        <Link
          to="/catalog"
          style={ctaButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = `0 6px 20px ${logoColors.primary}40`;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = `0 4px 15px ${logoColors.primary}30`;
          }}
        >
          Shop Now <FiArrowRight />
        </Link>
      </div>

      {/* Divider after Welcome */}
      <div style={sectionDividerStyle}></div>

      {/* Categories Section */}
      <div style={{ background: logoColors.background }}>
        <Categories />
      </div>

      {/* Divider after Categories */}
      <div style={sectionDividerStyle}></div>

      {/* Featured Products Section */}
      <div style={{
        background: logoColors.background,
        padding: '3rem 0',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={sectionTitleStyle}>
            Featured <span style={{ color: logoColors.primary }}>T-Shirts</span>
          </h2>
          <p style={sectionSubtitleStyle}>
            Express yourself with our exclusive collection
          </p>
        </div>
        <Tshirt />
      </div>

      {/* Divider after Featured Products */}
      <div style={sectionDividerStyle}></div>

      {/* Bottom Component */}
      <div style={{ background: logoColors.background }}>
        <Bottom />
      </div>

      {/* Divider after Bottom */}
      <div style={sectionDividerStyle}></div>

      {/* Contact Section */}
      <div style={{
        background: logoColors.background,
        padding: '3rem 0',
      }}>
        <ContactUs />
      </div>

    </div>
  )
}