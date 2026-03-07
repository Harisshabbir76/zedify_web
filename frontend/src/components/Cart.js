import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import { Button, Table, Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './heroSlider.css'; // We'll create this CSS file

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

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    clearCart
  } = useContext(CartContext);

  if (cartCount === 0) {
    return (
      <Container fluid className="py-5 text-center" style={{
        background: logoColors.background,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '500px' }}>
          <h2 className="mb-4" style={{ color: logoColors.dark }}>Your cart is empty</h2>
          <Link
            to="/catalog"
            className="btn btn-lg"
            style={{
              background: logoColors.gradient,
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '1.1rem',
              textDecoration: 'none',
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
            Continue Shopping
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid style={{ background: logoColors.background, minHeight: '100vh', padding: '2rem 0' }}>
      <Container className="py-4 cart-container">
        <h2 className="mb-4" style={{ color: logoColors.dark }}>Your Cart ({cartCount} items)</h2>

        {/* Decorative line under header */}
        <div style={{
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${logoColors.primary}40, transparent)`,
          width: '100px',
          marginBottom: '2rem'
        }} />

        {/* Desktop Table View */}
        <div className="d-none d-md-block">
          <Table striped bordered hover responsive style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
            <thead style={{ background: logoColors.softGradient }}>
              <tr>
                <th style={{ color: logoColors.dark, borderBottom: `2px solid ${logoColors.primary}` }}>Product</th>
                <th style={{ color: logoColors.dark, borderBottom: `2px solid ${logoColors.primary}` }}>Price</th>
                <th style={{ color: logoColors.dark, borderBottom: `2px solid ${logoColors.primary}` }}>Quantity</th>
                <th style={{ color: logoColors.dark, borderBottom: `2px solid ${logoColors.primary}` }}>Total</th>
                <th style={{ color: logoColors.dark, borderBottom: `2px solid ${logoColors.primary}` }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={`${process.env.REACT_APP_API_URL}${item.image[0]}`}
                        alt={item.name}
                        className="cart-item-img"
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', marginRight: '1rem' }}
                      />
                      <span style={{ color: '#2D3748' }}>{item.name}</span>
                    </div>
                  </td>
                  <td style={{ color: logoColors.primary, fontWeight: '600' }}>Rs. {item.discountedPrice}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                      className="quantity-input"
                      style={{
                        width: '70px',
                        padding: '0.375rem',
                        border: `1px solid ${logoColors.light}`,
                        borderRadius: '6px',
                        textAlign: 'center'
                      }}
                    />
                  </td>
                  <td style={{ color: logoColors.primary, fontWeight: '600' }}>Rs. {(item.discountedPrice * item.quantity).toFixed(2)}</td>
                  <td>
                    <Button
                      size="sm"
                      onClick={() => removeFromCart(item._id)}
                      className="remove-btn"
                      style={{
                        background: '#dc3545',
                        border: 'none',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.opacity = '0.9';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(220,53,69,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end">
                  <strong style={{ color: '#2D3748' }}>Total:</strong>
                </td>
                <td colSpan="2">
                  <strong style={{ color: logoColors.primary, fontSize: '1.2rem' }}>Rs. {cartTotal.toFixed(2)}</strong>
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="d-md-none">
          {cart.map((item) => (
            <Card key={item._id} className="mb-3 cart-item-card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <Card.Body>
                <Row>
                  <Col xs={4}>
                    <img
                      src={`${process.env.REACT_APP_API_URL}${item.image[0]}`}
                      alt={item.name}
                      className="cart-item-img-mobile"
                      style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </Col>
                  <Col xs={8}>
                    <h5 style={{ color: '#2D3748' }}>{item.name}</h5>
                    <div className="mb-2" style={{ color: logoColors.primary, fontWeight: '600' }}>Rs. {item.discountedPrice}</div>
                    <div className="d-flex align-items-center mb-2">
                      <span className="me-2" style={{ color: '#4A5568' }}>Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                        className="quantity-input-mobile"
                        style={{
                          width: '60px',
                          padding: '0.25rem',
                          border: `1px solid ${logoColors.light}`,
                          borderRadius: '6px',
                          textAlign: 'center'
                        }}
                      />
                    </div>
                    <div className="mb-2">
                      <strong style={{ color: '#2D3748' }}>Total: <span style={{ color: logoColors.primary }}>Rs. {(item.discountedPrice * item.quantity).toFixed(2)}</span></strong>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => removeFromCart(item._id)}
                      className="w-100 remove-btn-mobile"
                      style={{
                        background: '#dc3545',
                        border: 'none',
                        padding: '0.375rem',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.opacity = '0.9';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(220,53,69,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
          <Card className="mb-3 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <Card.Body className="text-center">
              <h5 style={{ color: '#2D3748' }}>Cart Total: <span style={{ color: logoColors.primary, fontSize: '1.3rem' }}>Rs. {cartTotal.toFixed(2)}</span></h5>
            </Card.Body>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="cart-actions mt-4">
          <Row>
            <Col xs={12} md={6} className="mb-3 mb-md-0">
              <Link
                to="/catalog"
                className="btn w-100"
                style={{
                  border: `2px solid ${logoColors.primary}`,
                  color: logoColors.primary,
                  background: 'transparent',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = logoColors.softGradient;
                  e.target.style.color = logoColors.dark;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = logoColors.primary;
                }}
              >
                Continue Shopping
              </Link>
            </Col>
            <Col xs={12} md={6} className="d-flex flex-column flex-md-row justify-content-md-end">
              <Button
                variant="outline-danger"
                onClick={clearCart}
                className="mb-2 mb-md-0 me-md-2 w-100 w-md-auto"
                style={{
                  border: `2px solid #dc3545`,
                  color: '#dc3545',
                  background: 'transparent',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#dc3545';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#dc3545';
                }}
              >
                Clear Cart
              </Button>
              <Link
                to="/checkout"
                className="btn w-100 w-md-auto"
                style={{
                  background: logoColors.gradient,
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 4px 12px ${logoColors.primary}40`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Proceed to Checkout
              </Link>
            </Col>
          </Row>
        </div>
      </Container>
    </Container>
  );
}