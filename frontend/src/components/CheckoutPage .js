// CheckoutPage.js
import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
  ListGroup
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext ';
import { Link } from 'react-router-dom';

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

const CheckoutPage = () => {
  const { cart, cartCount, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'creditCard'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // In a real app, you would send this data to your backend
      console.log('Submitting order:', { formData, cart });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartCount === 0 && !orderSuccess) {
    return (
      <Container fluid className="py-5" style={{ background: logoColors.background, minHeight: '100vh' }}>
        <Container>
          <Alert variant="info" style={{ borderRadius: '8px' }}>
            Your cart is empty. <Link to="/" style={{ color: logoColors.primary }}>Continue shopping</Link>.
          </Alert>
        </Container>
      </Container>
    );
  }

  if (orderSuccess) {
    return (
      <Container fluid className="py-5" style={{ background: logoColors.background, minHeight: '100vh' }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <Alert variant="success" className="mb-4" style={{
                borderRadius: '12px',
                border: `1px solid ${logoColors.light}`
              }}>
                <h4 style={{ color: '#2D3748' }}>Thank you for your order!</h4>
                <p style={{ color: '#4A5568' }}>Your order has been placed successfully.</p>
              </Alert>
              <Button
                as={Link}
                to="/"
                variant="primary"
                style={{
                  background: logoColors.gradient,
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  fontWeight: '500',
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
                Continue Shopping
              </Button>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }

  return (
    <Container fluid style={{ background: logoColors.background, minHeight: '100vh', padding: '2rem 0' }}>
      <Container>
        <Row>
          <Col lg={8}>
            <h2 className="mb-4" style={{ color: logoColors.dark }}>Checkout</h2>

            {/* Decorative line under header */}
            <div style={{
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${logoColors.primary}40, transparent)`,
              width: '100px',
              marginBottom: '1.5rem'
            }} />

            <Form onSubmit={handleSubmit}>
              <Card className="mb-4 border-0 shadow-sm" style={{
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <Card.Body style={{ padding: '2rem' }}>
                  <Card.Title style={{ color: logoColors.dark, marginBottom: '1.5rem' }}>Shipping Information</Card.Title>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#4A5568', fontWeight: '500' }}>First Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          isInvalid={!!errors.firstName}
                          style={{
                            borderRadius: '8px',
                            borderColor: logoColors.light
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.firstName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#4A5568', fontWeight: '500' }}>Last Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          isInvalid={!!errors.lastName}
                          style={{
                            borderRadius: '8px',
                            borderColor: logoColors.light
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.lastName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#4A5568', fontWeight: '500' }}>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      style={{
                        borderRadius: '8px',
                        borderColor: logoColors.light
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#4A5568', fontWeight: '500' }}>Phone *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      isInvalid={!!errors.phone}
                      style={{
                        borderRadius: '8px',
                        borderColor: logoColors.light
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#4A5568', fontWeight: '500' }}>Address *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      isInvalid={!!errors.address}
                      style={{
                        borderRadius: '8px',
                        borderColor: logoColors.light
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#4A5568', fontWeight: '500' }}>City *</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          isInvalid={!!errors.city}
                          style={{
                            borderRadius: '8px',
                            borderColor: logoColors.light
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.city}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#4A5568', fontWeight: '500' }}>State *</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          isInvalid={!!errors.state}
                          style={{
                            borderRadius: '8px',
                            borderColor: logoColors.light
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.state}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#4A5568', fontWeight: '500' }}>Zip Code *</Form.Label>
                        <Form.Control
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          isInvalid={!!errors.zipCode}
                          style={{
                            borderRadius: '8px',
                            borderColor: logoColors.light
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.zipCode}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#4A5568', fontWeight: '500' }}>Country *</Form.Label>
                    <Form.Control
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      isInvalid={!!errors.country}
                      style={{
                        borderRadius: '8px',
                        borderColor: logoColors.light
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.country}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Card.Body>
              </Card>

              <Card className="mb-4 border-0 shadow-sm" style={{
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <Card.Body style={{ padding: '2rem' }}>
                  <Card.Title style={{ color: logoColors.dark, marginBottom: '1.5rem' }}>Payment Method</Card.Title>
                  <Form.Group>
                    <Form.Check
                      type="radio"
                      id="creditCard"
                      name="paymentMethod"
                      label="Credit Card"
                      value="creditCard"
                      checked={formData.paymentMethod === 'creditCard'}
                      onChange={handleChange}
                      className="mb-2"
                      style={{ color: '#4A5568' }}
                    />
                    <Form.Check
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      label="PayPal"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleChange}
                      className="mb-2"
                      style={{ color: '#4A5568' }}
                    />
                    <Form.Check
                      type="radio"
                      id="cashOnDelivery"
                      name="paymentMethod"
                      label="Cash on Delivery"
                      value="cashOnDelivery"
                      checked={formData.paymentMethod === 'cashOnDelivery'}
                      onChange={handleChange}
                      style={{ color: '#4A5568' }}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              <div className="d-flex justify-content-between">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate('/cart')}
                  style={{
                    borderColor: logoColors.primary,
                    color: logoColors.primary,
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '500',
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
                  Back to Cart
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  style={{
                    background: logoColors.gradient,
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.opacity = '0.9';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = `0 4px 12px ${logoColors.primary}40`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </Button>
              </div>
            </Form>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm" style={{
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'sticky',
              top: '2rem'
            }}>
              <Card.Body style={{ padding: '1.5rem' }}>
                <Card.Title style={{ color: logoColors.dark, marginBottom: '1.5rem' }}>Order Summary</Card.Title>
                <ListGroup variant="flush">
                  {cart.map(item => (
                    <ListGroup.Item key={item.productId} className="d-flex justify-content-between border-0 px-0" style={{ background: 'transparent' }}>
                      <div style={{ color: '#4A5568' }}>
                        {item.name} <small style={{ color: logoColors.primary }}>x{item.quantity}</small>
                      </div>
                      <div style={{ color: '#2D3748', fontWeight: '500' }}>${(item.price * item.quantity).toFixed(2)}</div>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item className="d-flex justify-content-between fw-bold border-0 px-0 pt-3" style={{ background: 'transparent' }}>
                    <div style={{ color: '#2D3748' }}>Total</div>
                    <div style={{ color: logoColors.primary, fontSize: '1.2rem' }}>${totalPrice.toFixed(2)}</div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default CheckoutPage;