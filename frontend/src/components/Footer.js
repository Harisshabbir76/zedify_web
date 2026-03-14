import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './heroSlider.css';

// Navbar color palette
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

export default function Footer() {
  return (
    <footer className="site-footer" style={{
      background: logoColors.background,
      padding: '3rem 0 1.5rem',
      marginTop: 'auto',
      position: 'relative',
      borderTop: `2px solid ${logoColors.primary}30` // Subtle pink bar at top
    }}>
      <Container>
        <Row>
          {/* Quick Links Column */}
          <Col xs={6} md={6} className="footer-col">
            <h5 className="footer-heading" style={{
              color: logoColors.dark,
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '1.2rem'
            }}>
              Quick Links
            </h5>
            <ul className="footer-links" style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {['Home', 'Shop', 'T-Shirts', 'Bottoms', 'About', 'Contact'].map((item, index) => {
                const paths = ['/', '/catalog', '/category/t-shirt', '/category/bottom', '/about', '/contact'];
                return (
                  <li key={index} style={{ marginBottom: '0.75rem' }}>
                    <a
                      href={paths[index]}
                      style={{
                        color: '#4A5568',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        fontSize: '0.95rem',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = logoColors.primary;
                        e.target.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#4A5568';
                        e.target.style.transform = 'translateX(0)';
                      }}
                    >
                      {item}
                    </a>
                  </li>
                );
              })}
            </ul>
          </Col>

          {/* Contact Info Column */}
          <Col xs={6} md={6} className="footer-col">
            <h5 className="footer-heading" style={{
              color: logoColors.dark,
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '1.2rem'
            }}>
              Contact Info
            </h5>
            <ul className="contact-info" style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}>
                <FaMapMarkerAlt style={{
                  color: logoColors.primary,
                  fontSize: '1rem',
                  marginTop: '0.2rem',
                  flexShrink: 0
                }} />
                <span style={{ color: '#4A5568', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  123 Fashion Street, Style City
                </span>
              </li>
              <li style={{
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <FaPhone style={{
                  color: logoColors.primary,
                  fontSize: '0.9rem',
                  flexShrink: 0
                }} />
                <span style={{ color: '#4A5568', fontSize: '0.95rem' }}>
                  (123) 456-7890
                </span>
              </li>
              <li style={{
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <FaEnvelope style={{
                  color: logoColors.primary,
                  fontSize: '0.9rem',
                  flexShrink: 0
                }} />
                <span style={{ color: '#4A5568', fontSize: '0.95rem' }}>
                  info@zedify.com
                </span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="social-icons" style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '0.5rem'
            }}>
              {[
                { icon: FaFacebook, url: 'https://facebook.com', label: 'Facebook' },
                { icon: FaInstagram, url: 'https://instagram.com', label: 'Instagram' },
                { icon: FaTwitter, url: 'https://twitter.com', label: 'Twitter' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  aria-label={social.label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: logoColors.softGradient,
                    color: logoColors.primary,
                    transition: 'all 0.3s ease',
                    border: `1px solid ${logoColors.primary}20`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = logoColors.gradient;
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = `0 5px 15px ${logoColors.primary}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = logoColors.softGradient;
                    e.currentTarget.style.color = logoColors.primary;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </Col>
        </Row>

        {/* Footer Bottom - No border line */}
        <Row className="footer-bottom" style={{
          marginTop: '2.5rem',
          paddingTop: '0.5rem'
        }}>
          <Col className="text-center">
            <p className="copyright" style={{
              color: '#718096',
              fontSize: '0.9rem',
              margin: 0
            }}>
              &copy; {new Date().getFullYear()} Zedify. All Rights Reserved.{' '}
              <span style={{ color: logoColors.primary }}>Own your Aura</span>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}