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
import { useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../components/CartContext';
import logo from '../images/logo.png';

const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);

  // Colors
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

  // Fetch categories for dropdown
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
      <BootstrapNavbar
        expand="lg"
        sticky="top"
        style={{
          background: navbarColors.background,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          borderBottom: `1px solid ${navbarColors.border}`,
          padding: '0.5rem 0',
        }}
      >
        <Container fluid="lg">
          {/* Logo */}
          <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center me-3">
            <Image
              src={logo}
              alt="Zedify"
              style={{
                height: '40px',
                width: 'auto',
                maxWidth: '140px',
                objectFit: 'contain'
              }}
            />
          </BootstrapNavbar.Brand>

          {/* Mobile menu and cart button */}
          <div className="d-flex align-items-center d-lg-none gap-2">
            {/* Mobile Cart Icon */}
            <Button
              variant="link"
              className="p-2 position-relative"
              as={Link}
              to="/cart"
              style={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none'
              }}
            >
              <FiShoppingBag size={20} />
              {cartCount > 0 && (
                <Badge
                  pill
                  style={{
                    position: 'absolute',
                    top: '-0.25rem',
                    right: '-0.25rem',
                    fontSize: '0.6rem',
                    height: '1.1rem',
                    width: '1.1rem',
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

            <Button
              variant="link"
              className="p-2"
              onClick={() => setShowSidebar(true)}
              style={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none'
              }}
            >
              <FiMenu size={20} />
            </Button>
          </div>

          {/* Desktop Navigation */}
          <BootstrapNavbar.Collapse id="navbar-nav">
            <Nav className="me-auto" style={{ flexWrap: 'nowrap' }}>
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
                    fontSize: '0.9rem',
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

              {/* Categories Dropdown - After Catalog */}
              <div
                className="dropdown"
                style={{
                  position: 'relative',
                  display: 'inline-block'
                }}
              >
                <button
                  className="dropbtn"
                  style={{
                    fontSize: '0.9rem',
                    border: 'none',
                    outline: 'none',
                    color: 'white',
                    padding: '0.5rem 0.8rem',
                    backgroundColor: 'transparent',
                    fontFamily: 'inherit',
                    margin: '0 0.15rem',
                    borderRadius: '2rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = navbarColors.primary;
                    e.currentTarget.style.backgroundColor = '#fff5f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Categories <FiChevronDown size={14} />
                </button>
                <div
                  className="dropdown-content"
                  style={{
                    display: 'none',
                    position: 'absolute',
                    backgroundColor: 'white',
                    minWidth: '200px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    borderRadius: '12px',
                    marginTop: '0.5rem',
                    padding: '0.5rem 0',
                    left: 0
                  }}
                >
                  <Link
                    to="/category"
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
              </div>

              {/* Remaining nav links after Categories */}
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
                    fontSize: '0.9rem',
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

            {/* Search Bar - Always visible */}
            <div className="d-flex align-items-center mx-2" style={{ minWidth: '220px' }}>
              <Form onSubmit={handleSearch} className="w-100">
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      borderRadius: '50px 0 0 50px',
                      border: `1px solid ${navbarColors.border}`,
                      borderRight: 'none',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.85rem',
                      backgroundColor: '#F5F5F5'
                    }}
                  />
                  <Button
                    type="submit"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '0 50px 50px 0',
                      padding: '0.4rem 0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    <FiSearch size={18} color="#222" />
                  </Button>
                </InputGroup>
              </Form>
            </div>

            {/* Right side icons */}
            <div className="d-flex align-items-center gap-1">
              <Button
                variant="link"
                className="p-2"
                onClick={isLoggedIn ? handleLogout : undefined}
                as={isLoggedIn ? 'button' : Link}
                to={isLoggedIn ? undefined : '/login'}
                style={{
                  color: navbarColors.text,
                  backgroundColor: '#F5F5F5',
                  borderRadius: '0.5rem',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#E5E5E5';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#F5F5F5';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {isLoggedIn ? <FiLogOut size={16} /> : <FiUser size={16} />}
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
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#E5E5E5';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#F5F5F5';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <FiShoppingBag size={16} />
                {cartCount > 0 && (
                  <Badge
                    pill
                    style={{
                      position: 'absolute',
                      top: '-0.25rem',
                      right: '-0.25rem',
                      fontSize: '0.6rem',
                      height: '1.1rem',
                      width: '1.1rem',
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
          placement="end"
          style={{ width: '280px' }}
        >
          <Offcanvas.Header
            closeButton
            style={{
              background: navbarColors.background,
              borderBottom: `1px solid ${navbarColors.border}`
            }}
          >
            <Offcanvas.Title style={{ color: navbarColors.text, fontWeight: 600 }}>
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body style={{ padding: '1rem' }}>
            <Nav className="flex-column">
              {/* First three links - Home, New Arrivals, Catalog */}
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
                    color: location.pathname === link.path ? navbarColors.primary : navbarColors.text,
                    backgroundColor: location.pathname === link.path ? '#fff5f6' : 'transparent',
                    marginBottom: '0.25rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setShowSidebar(false)}
                  onMouseEnter={(e) => {
                    if (location.pathname !== link.path) {
                      e.currentTarget.style.backgroundColor = '#F9F9F9';
                      e.currentTarget.style.color = navbarColors.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== link.path) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = navbarColors.text;
                    }
                  }}
                >
                  <span className="me-3" style={{ color: location.pathname === link.path ? navbarColors.primary : '#9CA3AF' }}>
                    {link.icon}
                  </span>
                  {link.name}
                </Nav.Link>
              ))}

              {/* Mobile Categories - After Catalog */}
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
                    color: navbarColors.text,
                    backgroundColor: mobileCategoriesOpen ? '#F9F9F9' : 'transparent',
                    marginBottom: '0.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="me-3" style={{ color: '#9CA3AF' }}>
                      <FiGrid size={18} />
                    </span>
                    Categories
                  </span>
                  {mobileCategoriesOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                </div>

                {/* Mobile Categories Dropdown - Shows all categories when clicked */}
                {mobileCategoriesOpen && (
                  <div style={{
                    marginLeft: '2.5rem',
                    marginBottom: '0.5rem',
                    padding: '0.5rem 0',
                    borderLeft: `2px solid ${navbarColors.light}`,
                    paddingLeft: '0.5rem'
                  }}>
                    <div
                      onClick={() => handleCategorySelect('/category')}
                      style={{
                        padding: '0.6rem 0.8rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.95rem',
                        color: navbarColors.text,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        marginBottom: '0.25rem'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9F9F9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      All Categories
                    </div>
                    {/* Map through all categories */}
                    {categories.map(cat => (
                      <div
                        key={cat._id || cat.name}
                        onClick={() => handleCategorySelect(`/category/${cat.name.replace(/\s+/g, '-').replace(/'/g, '')}`)}
                        style={{
                          padding: '0.6rem 0.8rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.95rem',
                          color: navbarColors.text,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          marginBottom: '0.25rem'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9F9F9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {cat.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Remaining links after Categories - Bundles, About, Contact Us */}
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
                    color: location.pathname === link.path ? navbarColors.primary : navbarColors.text,
                    backgroundColor: location.pathname === link.path ? '#fff5f6' : 'transparent',
                    marginBottom: '0.25rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setShowSidebar(false)}
                  onMouseEnter={(e) => {
                    if (location.pathname !== link.path) {
                      e.currentTarget.style.backgroundColor = '#F9F9F9';
                      e.currentTarget.style.color = navbarColors.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== link.path) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = navbarColors.text;
                    }
                  }}
                >
                  <span className="me-3" style={{ color: location.pathname === link.path ? navbarColors.primary : '#9CA3AF' }}>
                    {link.icon}
                  </span>
                  {link.name}
                </Nav.Link>
              ))}

              <div className="mt-3 pt-2 border-top" style={{ borderColor: navbarColors.border }}>
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
                    color: navbarColors.text,
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F9F9F9';
                    e.currentTarget.style.color = navbarColors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = navbarColors.text;
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
      </BootstrapNavbar>

      {/* Add CSS for dropdown hover effect */}
      <style>{`
        .dropdown:hover .dropdown-content {
          display: block !important;
        }
        .dropdown-content {
          display: none;
        }
        .dropdown-content a:hover {
          background-color: #f5f5f5 !important;
          color: ${navbarColors.primary} !important;
        }
      `}</style>
    </>
  );
};

export default Navbar;