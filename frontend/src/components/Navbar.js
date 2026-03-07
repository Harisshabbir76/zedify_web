import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Button,
  Form,
  InputGroup,
  Badge,
  Image,
  Offcanvas
} from 'react-bootstrap';
import {
  FiShoppingBag,
  FiMenu,
  FiX,
  FiSearch,
  FiUser,
  FiLogOut,
  FiHome,
  FiShoppingCart,
  FiGrid,
  FiInfo,
  FiMail
} from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../components/CartContext';
import logo from '../images/logo.png';

const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);

  const navLinks = [
    { name: 'Home', path: '/', icon: <FiHome size={18} /> },
    { name: 'New Arrivals', path: '/new-arrivals', icon: <FiShoppingCart size={18} /> },
    { name: 'Catalog', path: '/catalog', icon: <FiShoppingCart size={18} /> },
    { name: 'Categories', path: '/category', icon: <FiGrid size={18} /> },
    { name: 'About', path: '/about-us', icon: <FiInfo size={18} /> },
    { name: 'Contact Us', path: '/contact-us', icon: <FiMail size={18} /> }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/logout`);
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      setIsLoggedIn(false);
      navigate('/');
      setShowSidebar(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Colors extracted from your logo
  const logoColors = {
    primary: '#FF69B4', // Hot pink - main logo color
    secondary: '#FF1493', // Deep pink - darker shade
    light: '#FFB6C1', // Light pink - for accents
    dark: '#C71585', // Medium violet red - very dark pink
    background: '#FFE4E1', // Misty rose - lightest pink for backgrounds
    gradient: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)', // Pink gradient from logo
  };

  return (
    <>
      <BootstrapNavbar
        expand="md"
        sticky="top"
        style={{
          background: logoColors.gradient,
          boxShadow: '0 4px 20px -2px rgba(255, 105, 180, 0.3)',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          marginBottom: '0 !important',
          padding: '0.5rem 0',
        }}
      >
        <Container fluid="md">
          {/* Logo */}
          <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <Image
              src={logo}
              alt="Zedify"
              style={{
                height: '45px',
                width: 'auto',
                maxWidth: '160px',
                objectFit: 'contain',
                filter: 'brightness(1) drop-shadow(0 2px 4px rgba(255, 105, 180, 0.3))'
              }}
            />
          </BootstrapNavbar.Brand>

          {/* Mobile menu and search buttons */}
          <div className="d-flex align-items-center">
            <Button
              variant="link"
              className="d-md-none p-2 me-2"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              style={{
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '0.5rem',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FiSearch size={18} />
            </Button>

            <Button
              variant="link"
              className="d-md-none p-2"
              onClick={() => setShowSidebar(true)}
              style={{
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '0.5rem',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FiMenu size={20} />
            </Button>
          </div>

          {/* Desktop Navigation */}
          <BootstrapNavbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              {navLinks.map((link) => (
                <Nav.Link
                  key={link.path}
                  as={Link}
                  to={link.path}
                  active={location.pathname === link.path}
                  style={{
                    margin: '0 0.25rem',
                    borderRadius: '2rem',
                    color: location.pathname === link.path ? logoColors.primary : 'rgba(255,255,255,0.95)',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    padding: '0.5rem 1.2rem',
                    transition: 'all 0.2s ease',
                    ...(location.pathname === link.path && {
                      backgroundColor: 'white',
                      boxShadow: `0 4px 10px rgba(255, 105, 180, 0.2)`
                    })
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== link.path) {
                      e.target.style.color = logoColors.primary;
                      e.target.style.backgroundColor = 'white';
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== link.path) {
                      e.target.style.color = 'rgba(255,255,255,0.95)';
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {link.name}
                </Nav.Link>
              ))}
            </Nav>

            {/* Right side icons */}
            <div className="d-flex align-items-center gap-1">
              <Button
                variant="link"
                className="d-none d-md-flex p-2"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                style={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '0.5rem',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <FiSearch size={18} />
              </Button>

              <Button
                variant="link"
                className="p-2"
                onClick={isLoggedIn ? handleLogout : undefined}
                as={isLoggedIn ? 'button' : Link}
                to={isLoggedIn ? undefined : '/login'}
                style={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '0.5rem',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {isLoggedIn ? <FiLogOut size={18} /> : <FiUser size={18} />}
              </Button>

              <Button
                variant="link"
                className="p-2 position-relative"
                as={Link}
                to="/cart"
                style={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '0.5rem',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <FiShoppingBag size={18} />
                {cartCount > 0 && (
                  <Badge
                    pill
                    style={{
                      position: 'absolute',
                      top: '-0.25rem',
                      right: '-0.25rem',
                      fontSize: '0.625rem',
                      height: '1.2rem',
                      width: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: logoColors.dark,
                      color: 'white',
                      border: '2px solid white',
                      fontWeight: 'bold'
                    }}
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </div>
          </BootstrapNavbar.Collapse>
        </Container>

        {/* Mobile Sidebar */}
        <Offcanvas
          show={showSidebar}
          onHide={() => setShowSidebar(false)}
          placement="end"
          style={{ width: '280px' }}
        >
          <Offcanvas.Header
            closeButton
            style={{
              background: logoColors.gradient,
              color: 'white'
            }}
          >
            <Offcanvas.Title style={{ color: 'white', fontWeight: 600 }}>
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body style={{ padding: '1rem' }}>
            <Nav className="flex-column">
              {navLinks.map((link) => (
                <Nav.Link
                  key={link.path}
                  as={Link}
                  to={link.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    fontWeight: 500,
                    fontSize: '1rem',
                    color: location.pathname === link.path ? logoColors.primary : '#4B5563',
                    backgroundColor: location.pathname === link.path ? logoColors.background : 'transparent',
                    marginBottom: '0.25rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setShowSidebar(false)}
                  onMouseEnter={(e) => {
                    if (location.pathname !== link.path) {
                      e.currentTarget.style.backgroundColor = logoColors.background;
                      e.currentTarget.style.color = logoColors.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== link.path) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#4B5563';
                    }
                  }}
                >
                  <span className="me-3" style={{ color: location.pathname === link.path ? logoColors.primary : '#9CA3AF' }}>
                    {link.icon}
                  </span>
                  {link.name}
                </Nav.Link>
              ))}

              <div className="mt-3 pt-2 border-top" style={{ borderColor: '#E5E7EB' }}>
                <Nav.Link
                  as={Link}
                  to={isLoggedIn ? undefined : '/login'}
                  onClick={() => {
                    if (isLoggedIn) {
                      handleLogout();
                    }
                    setShowSidebar(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    fontWeight: 500,
                    fontSize: '1rem',
                    color: '#4B5563',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = logoColors.background;
                    e.currentTarget.style.color = logoColors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#4B5563';
                  }}
                >
                  <span className="me-3" style={{ color: '#9CA3AF' }}>
                    {isLoggedIn ? <FiLogOut size={18} /> : <FiUser size={18} />}
                  </span>
                  {isLoggedIn ? 'Logout' : 'Login'}
                </Nav.Link>
              </div>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Search Bar */}
        {isSearchOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: logoColors.gradient,
              boxShadow: '0 10px 25px -5px rgba(255, 105, 180, 0.4)',
              zIndex: 1040,
              padding: '1rem',
              borderTop: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <Container fluid="md">
              <Form onSubmit={handleSearch} className="d-flex align-items-center">
                <InputGroup style={{ flex: 1 }}>
                  <InputGroup.Text
                    style={{
                      backgroundColor: 'transparent',
                      position: 'absolute',
                      left: '0.75rem',
                      zIndex: 5,
                      border: 'none',
                      color: 'rgba(255,255,255,0.7)'
                    }}
                  >
                    <FiSearch size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search our collection..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      paddingLeft: '2.5rem',
                      borderRadius: '2rem',
                      border: 'none',
                      boxShadow: '0 2px 10px rgba(255, 105, 180, 0.2)',
                      backgroundColor: 'white',
                      height: '45px'
                    }}
                    autoFocus
                  />
                </InputGroup>
                <Button
                  variant="link"
                  className="ms-3 p-2"
                  onClick={() => setIsSearchOpen(false)}
                  style={{
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '0.5rem',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FiX size={20} />
                </Button>
              </Form>
            </Container>
          </div>
        )}
      </BootstrapNavbar>
    </>
  );
};

export default Navbar;