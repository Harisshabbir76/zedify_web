import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Button,
  Form,
  Badge,
  Image,
  Offcanvas
} from 'react-bootstrap';
import {
  FiShoppingBag,
  FiMenu,
  FiSearch,
  FiUser,
  FiLogOut,
  FiHome,
  FiShoppingCart,
  FiGrid,
  FiInfo,
  FiMail,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../components/CartContext';
import logoImage from '../images/logo.png';

const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [desktopCategoriesOpen, setDesktopCategoriesOpen] = useState(false);
  const categoriesRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);

  const navbarColors = {
    primary: '#fe7e8b',
    secondary: '#e65c70',
    light: '#ffd1d4',
    dark: '#d64555',
    background: '#fe7e8b',
    text: '#333333',
    textLight: '#666666',
    border: '#EEEEEE',
    gradient: 'linear-gradient(135deg, #fe7e8b 0%, #e65c70 100%)',
    softGradient: 'linear-gradient(135deg, #fff5f6 0%, #ffe0e3 100%)',
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
        if (res.data && res.data.length > 0) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setDesktopCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: <FiHome size={18} /> },
    { name: 'New Arrivals', path: '/new-arrivals', icon: <FiShoppingCart size={18} /> },
    { name: 'Catalog', path: '/catalog', icon: <FiShoppingCart size={18} /> },
    { name: 'Bundles', path: '/bundles', icon: <FiGrid size={18} /> },
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
      setSearchQuery('');
    }
  };

  const handleMobileCategoryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileCategoriesOpen(!mobileCategoriesOpen);
  };

  const handleCategorySelect = (path) => {
    navigate(path);
    setShowSidebar(false);
    setMobileCategoriesOpen(false);
  };

  return (
    <>
      <style>{`
        .text-logo {
          font-size: clamp(1.8rem, 5vw, 2.8rem);
          font-weight: 900;
          color: white;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1;
          display: flex;
          align-items: center;
        }

        body, html {
          margin: 0 !important;
          padding: 0 !important;
        }

        .navbar {
          margin-bottom: 0 !important;
          padding-top: 0.5rem !important;
          padding-bottom: 0.5rem !important;
        }

        .container-fluid {
          padding-left: 15px !important;
          padding-right: 15px !important;
        }

        @media (max-width: 991px) {
          .mobile-nav-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 0 10px;
          }
          .mobile-left {
            flex: 1;
            display: flex;
            justify-content: flex-start;
          }
          .mobile-center {
            flex: 1;
            display: flex;
            justify-content: center;
          }
          .mobile-right {
            flex: 1;
            display: flex;
            justify-content: flex-end;
          }
          .mobile-cart-btn,
          .mobile-menu-btn {
            width: 44px !important;
            height: 44px !important;
          }
        }

        .offcanvas {
          background: ${navbarColors.background} !important;
        }
        .offcanvas-header {
          background: ${navbarColors.background} !important;
          border-bottom: 1px solid ${navbarColors.border} !important;
        }
        .offcanvas-title {
          color: white !important;
          font-weight: 600 !important;
        }
        .offcanvas .btn-close {
          filter: brightness(0) invert(1) !important;
        }
        .offcanvas .nav-link {
          color: white !important;
        }
        .offcanvas .nav-link:hover {
          color: ${navbarColors.primary} !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .offcanvas .nav-link.active {
          color: ${navbarColors.primary} !important;
          background-color: rgba(255, 255, 255, 0.15) !important;
        }
        .offcanvas .border-top {
          border-color: rgba(255, 255, 255, 0.2) !important;
        }
      `}</style>

      <BootstrapNavbar
        expand="lg"
        sticky="top"
        style={{
          background: navbarColors.background,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          borderBottom: `1px solid ${navbarColors.border}`,
          padding: '0.5rem 0',
          margin: 0
        }}
      >
        <Container fluid="lg" className="justify-content-center" style={{ padding: 0, gap: '2rem' }}>

          {/* Desktop Logo */}
          <BootstrapNavbar.Brand
            as={Link}
            to="/"
            className="d-none d-lg-flex align-items-center m-0"
            style={{ padding: 0 }}
          >
            <span className="text-logo">
              <img
                src={logoImage}
                alt="Logo"
                style={{
                  height: '50px',
                  objectFit: 'contain',
                  transition: 'all 0.3s ease'
                }}
              />
            </span>
          </BootstrapNavbar.Brand>

          {/* Mobile Layout */}
          <div className="d-lg-none w-100 mobile-nav-container">
            {/* Left - Menu */}
            <div className="mobile-left">
              <Button
                variant="link"
                className="p-2 mobile-menu-btn"
                onClick={() => setShowSidebar(true)}
                style={{
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  padding: 0,
                  margin: 0
                }}
              >
                <FiMenu size={22} />
              </Button>
            </div>

            {/* Center - Logo */}
            <div className="mobile-center">
              <Link to="/" style={{ textDecoration: 'none' }}>
                <span className="text-logo" style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)' }}>
                  <img
                    src={logoImage}
                    alt="Logo"
                    style={{
                      height: '55px',
                      objectFit: 'contain',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </span>
              </Link>
            </div>

            {/* Right - Cart */}
            <div className="mobile-right">
              <Button
                variant="link"
                className="p-2 position-relative mobile-cart-btn"
                as={Link}
                to="/cart"
                style={{
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  padding: 0,
                  margin: 0
                }}
              >
                <FiShoppingBag size={22} />
                {cartCount > 0 && (
                  <Badge
                    pill
                    style={{
                      position: 'absolute',
                      top: '-0.25rem',
                      right: '-0.25rem',
                      fontSize: '0.7rem',
                      height: '1.2rem',
                      width: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'white',
                      color: navbarColors.primary,
                      border: '2px solid white',
                      fontWeight: 'bold'
                    }}
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <BootstrapNavbar.Collapse id="navbar-nav" className="flex-grow-0 justify-content-center" style={{ gap: '1rem' }}>
            <Nav className="m-0" style={{ flexWrap: 'nowrap' }}>

              {/* First 3 nav links: Home, New Arrivals, Catalog */}
              {navLinks.slice(0, 3).map((link) => (
                <Nav.Link
                  key={link.path}
                  as={Link}
                  to={link.path}
                  active={location.pathname === link.path}
                  style={{
                    margin: '0 0.15rem',
                    borderRadius: '2rem',
                    color: location.pathname === link.path ? navbarColors.primary : 'white',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    padding: '0.5rem 0.8rem',
                    transition: 'all 0.2s ease',
                    backgroundColor: location.pathname === link.path ? '#fff5f6' : 'transparent',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== link.path) {
                      e.target.style.color = navbarColors.primary;
                      e.target.style.backgroundColor = '#fff5f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== link.path) {
                      e.target.style.color = 'white';
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {link.name}
                </Nav.Link>
              ))}

              {/* Desktop Categories Dropdown - Click based */}
              <div
                ref={categoriesRef}
                style={{ position: 'relative', display: 'inline-block' }}
              >
                <button
                  onClick={() => setDesktopCategoriesOpen(prev => !prev)}
                  style={{
                    fontSize: '0.95rem',
                    border: 'none',
                    outline: 'none',
                    color: desktopCategoriesOpen ? navbarColors.primary : 'white',
                    padding: '0.5rem 0.8rem',
                    backgroundColor: desktopCategoriesOpen ? '#fff5f6' : 'transparent',
                    fontFamily: 'inherit',
                    margin: '0 0.15rem',
                    borderRadius: '2rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!desktopCategoriesOpen) {
                      e.currentTarget.style.color = navbarColors.primary;
                      e.currentTarget.style.backgroundColor = '#fff5f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!desktopCategoriesOpen) {
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  Categories {desktopCategoriesOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                </button>

                {desktopCategoriesOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      backgroundColor: 'white',
                      minWidth: '200px',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      zIndex: 1000,
                      borderRadius: '12px',
                      marginTop: '0.5rem',
                      padding: '0.5rem 0',
                    }}
                  >
                    <Link
                      to="/category"
                      onClick={() => setDesktopCategoriesOpen(false)}
                      style={{
                        color: '#333',
                        padding: '10px 16px',
                        textDecoration: 'none',
                        display: 'block',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                        e.currentTarget.style.color = navbarColors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#333';
                      }}
                    >
                      All Categories
                    </Link>
                    <div style={{ height: '1px', backgroundColor: '#eee', margin: '4px 0' }} />
                    {categories.map(cat => (
                      <Link
                        key={cat._id || cat.name}
                        to={`/category/${cat.name.replace(/\s+/g, '-').replace(/'/g, '')}`}
                        onClick={() => setDesktopCategoriesOpen(false)}
                        style={{
                          color: '#333',
                          padding: '10px 16px',
                          textDecoration: 'none',
                          display: 'block',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f5f5f5';
                          e.currentTarget.style.color = navbarColors.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#333';
                        }}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Remaining nav links: Bundles, About, Contact Us */}
              {navLinks.slice(3).map((link) => (
                <Nav.Link
                  key={link.path}
                  as={Link}
                  to={link.path}
                  active={location.pathname === link.path}
                  style={{
                    margin: '0 0.15rem',
                    borderRadius: '2rem',
                    color: location.pathname === link.path ? navbarColors.primary : 'white',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    padding: '0.5rem 0.8rem',
                    transition: 'all 0.2s ease',
                    backgroundColor: location.pathname === link.path ? '#fff5f6' : 'transparent',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== link.path) {
                      e.target.style.color = navbarColors.primary;
                      e.target.style.backgroundColor = '#fff5f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== link.path) {
                      e.target.style.color = 'white';
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {link.name}
                </Nav.Link>
              ))}
            </Nav>

            {/* Search Bar */}
            <div className="d-none d-lg-flex align-items-center m-0" style={{ minWidth: '260px' }}>
              <Form onSubmit={handleSearch} className="w-100">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  borderRadius: '50px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  width: '100%',
                  height: '40px'
                }}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      border: 'none',
                      padding: '0 1rem',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: 'white',
                      height: '100%'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: 'white',
                      border: 'none',
                      color: navbarColors.primary,
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <FiSearch size={18} />
                  </button>
                </div>
              </Form>
            </div>

            {/* Desktop Right Icons */}
            <div className="d-none d-lg-flex align-items-center gap-1">
              <Button
                variant="link"
                onClick={isLoggedIn ? handleLogout : undefined}
                as={isLoggedIn ? 'button' : Link}
                to={isLoggedIn ? undefined : '/login'}
                style={{
                  color: navbarColors.text,
                  backgroundColor: '#F5F5F5',
                  borderRadius: '0.5rem',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  transition: 'all 0.2s ease',
                  padding: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E5E5E5';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F5F5F5';
                  e.currentTarget.style.transform = 'scale(1)';
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
                  color: navbarColors.text,
                  backgroundColor: '#F5F5F5',
                  borderRadius: '0.5rem',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  transition: 'all 0.2s ease',
                  padding: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E5E5E5';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F5F5F5';
                  e.currentTarget.style.transform = 'scale(1)';
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
                      fontSize: '0.7rem',
                      height: '1.2rem',
                      width: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: navbarColors.primary,
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
          placement="start"
          style={{
            width: '280px',
            background: navbarColors.background
          }}
        >
          <Offcanvas.Header
            closeButton
            style={{
              background: navbarColors.background,
              borderBottom: `1px solid rgba(255, 255, 255, 0.2)`,
              color: 'white'
            }}
          >
            <Offcanvas.Title style={{ color: 'white', fontWeight: 600 }}>
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body style={{ padding: '1rem', background: navbarColors.background }}>
            <Nav className="flex-column">

              {/* First 3 links: Home, New Arrivals, Catalog */}
              {navLinks.slice(0, 3).map((link) => (
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
                    color: location.pathname === link.path ? navbarColors.primary : 'white',
                    backgroundColor: location.pathname === link.path ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    marginBottom: '0.25rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setShowSidebar(false)}
                  onMouseEnter={(e) => {
                    if (location.pathname !== link.path) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.color = navbarColors.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== link.path) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                >
                  <span className="me-3" style={{ color: location.pathname === link.path ? navbarColors.primary : 'rgba(255,255,255,0.7)' }}>
                    {link.icon}
                  </span>
                  {link.name}
                </Nav.Link>
              ))}

              {/* Mobile Categories Accordion */}
              <div style={{ width: '100%' }}>
                <div
                  onClick={handleMobileCategoryClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    fontWeight: 500,
                    fontSize: '1rem',
                    color: 'white',
                    backgroundColor: mobileCategoriesOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    marginBottom: '0.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="me-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <FiGrid size={18} />
                    </span>
                    Categories
                  </span>
                  {mobileCategoriesOpen
                    ? <FiChevronUp size={16} style={{ color: 'white' }} />
                    : <FiChevronDown size={16} style={{ color: 'white' }} />
                  }
                </div>

                {mobileCategoriesOpen && (
                  <div style={{
                    marginLeft: '2.5rem',
                    marginBottom: '0.5rem',
                    padding: '0.5rem 0',
                    borderLeft: `2px solid rgba(255, 255, 255, 0.2)`,
                    paddingLeft: '0.5rem'
                  }}>
                    <div
                      onClick={() => handleCategorySelect('/category')}
                      style={{
                        padding: '0.6rem 0.8rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.95rem',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        marginBottom: '0.25rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.color = navbarColors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'white';
                      }}
                    >
                      All Categories
                    </div>
                    {categories.map(cat => (
                      <div
                        key={cat._id || cat.name}
                        onClick={() => handleCategorySelect(`/category/${cat.name.replace(/\s+/g, '-').replace(/'/g, '')}`)}
                        style={{
                          padding: '0.6rem 0.8rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.95rem',
                          color: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          marginBottom: '0.25rem'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.color = navbarColors.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'white';
                        }}
                      >
                        {cat.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Remaining links: Bundles, About, Contact Us */}
              {navLinks.slice(3).map((link) => (
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
                    color: location.pathname === link.path ? navbarColors.primary : 'white',
                    backgroundColor: location.pathname === link.path ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    marginBottom: '0.25rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setShowSidebar(false)}
                  onMouseEnter={(e) => {
                    if (location.pathname !== link.path) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.color = navbarColors.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== link.path) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                >
                  <span className="me-3" style={{ color: location.pathname === link.path ? navbarColors.primary : 'rgba(255,255,255,0.7)' }}>
                    {link.icon}
                  </span>
                  {link.name}
                </Nav.Link>
              ))}

              {/* Login / Logout */}
              <div className="mt-3 pt-2 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                <Nav.Link
                  as={isLoggedIn ? 'div' : Link}
                  to={isLoggedIn ? undefined : '/login'}
                  onClick={() => {
                    if (isLoggedIn) handleLogout();
                    setShowSidebar(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    fontWeight: 500,
                    fontSize: '1rem',
                    color: 'white',
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = navbarColors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  <span className="me-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {isLoggedIn ? <FiLogOut size={18} /> : <FiUser size={18} />}
                  </span>
                  {isLoggedIn ? 'Logout' : 'Login'}
                </Nav.Link>
              </div>

            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </BootstrapNavbar>
    </>
  );
};

export default Navbar;