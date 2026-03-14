import React from 'react'
import Categories from '../components/category'
import HomeFeaturedCategories from '../components/HomeFeaturedCategories'
import TopRatedProducts from '../components/TopRatedProducts'
import LatestBundles from '../components/LatestBundles'
import FAQs from '../components/FAQs'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi';
import HeroSlider from '../components/HeroSlider'
import { useEffect, useState } from 'react';

// Navbar color palette - light backgrounds
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

      {/* Featured Categories Products - Shows products from categories with showOnHome enabled */}
      <HomeFeaturedCategories />

      {/* Divider after Featured Categories */}
      <div style={sectionDividerStyle}></div>

      {/* Top Rated Products - Shows highest rated products */}
      <TopRatedProducts />

      {/* Divider after Top Products */}
      <div style={sectionDividerStyle}></div>

      {/* Latest Bundles - Shows latest bundles */}
      <LatestBundles />

      {/* Divider after Bundles */}
      <div style={sectionDividerStyle}></div>

      {/* FAQs Section */}
      <FAQs />

    </div>
  )
}