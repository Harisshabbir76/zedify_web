import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Button,
  Badge,
  ListGroup,
  Accordion
} from 'react-bootstrap';
import {
  FaUsers,
  FaBullseye,
  FaHandshake,
  FaAward,
  FaCheckCircle,
  FaQuoteLeft
} from 'react-icons/fa';

// Import team member images
import member1 from '../images/member1.jpeg';
import member2 from '../images/member2.jpeg';
import member3 from '../images/member3.jpeg';
import member4 from '../images/member4.jpeg';

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

const AboutUs = () => {
  const teamMembers = [
    { name: 'John Doe', role: 'CEO', image: member1 },
    { name: 'Jane Smith', role: 'Design Director', image: member2 },
    { name: 'Mike Johnson', role: 'Tech Lead', image: member3 },
    { name: 'Sarah Williams', role: 'Marketing Head', image: member4 }
  ];

  const milestones = [
    { year: '2010', event: 'Company Founded' },
    { year: '2014', event: 'First Major Client' },
    { year: '2018', event: 'Expanded to 3 Countries' },
    { year: '2022', event: 'Reached 1M Customers' }
  ];

  return (
    <Container fluid style={{ background: logoColors.background, minHeight: '100vh', padding: '2rem 0' }}>
      <Container>
        {/* Hero Section */}
        <Row className="mb-5 text-center">
          <Col>
            <h1 className="display-4 mb-4" style={{ color: logoColors.dark }}>About Our Company</h1>
            <p className="lead" style={{ color: '#4A5568' }}>
              We've been delivering excellence for over a decade, serving customers worldwide with passion and dedication.
            </p>

            {/* Decorative line under header */}
            <div style={{
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${logoColors.primary}40, transparent)`,
              width: '200px',
              margin: '1.5rem auto'
            }} />
          </Col>
        </Row>

        {/* Mission and Values */}
        <Row className="mb-5">
          <Col md={6} className="mb-4 mb-md-0">
            <Card className="h-100 border-0 shadow-sm" style={{
              borderRadius: '12px',
              background: 'white',
              transition: 'all 0.3s ease'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = `0 8px 20px ${logoColors.primary}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
              }}>
              <Card.Body className="p-4">
                <FaBullseye style={{ color: logoColors.primary, marginBottom: '1rem' }} size={32} />
                <Card.Title as="h3" style={{ color: logoColors.dark }}>Our Mission</Card.Title>
                <Card.Text style={{ color: '#4A5568', lineHeight: '1.8' }}>
                  To provide innovative solutions that transform businesses and create lasting value for our customers,
                  employees, and communities through technology and exceptional service.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100 border-0 shadow-sm" style={{
              borderRadius: '12px',
              background: 'white',
              transition: 'all 0.3s ease'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = `0 8px 20px ${logoColors.primary}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
              }}>
              <Card.Body className="p-4">
                <FaHandshake style={{ color: logoColors.primary, marginBottom: '1rem' }} size={32} />
                <Card.Title as="h3" style={{ color: logoColors.dark }}>Our Values</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item className="border-0" style={{ background: 'transparent', padding: '0.5rem 0' }}>
                    <FaCheckCircle style={{ color: logoColors.primary, marginRight: '0.75rem' }} />
                    <span style={{ color: '#4A5568' }}>Integrity in all we do</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0" style={{ background: 'transparent', padding: '0.5rem 0' }}>
                    <FaCheckCircle style={{ color: logoColors.primary, marginRight: '0.75rem' }} />
                    <span style={{ color: '#4A5568' }}>Customer-first approach</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0" style={{ background: 'transparent', padding: '0.5rem 0' }}>
                    <FaCheckCircle style={{ color: logoColors.primary, marginRight: '0.75rem' }} />
                    <span style={{ color: '#4A5568' }}>Continuous innovation</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0" style={{ background: 'transparent', padding: '0.5rem 0' }}>
                    <FaCheckCircle style={{ color: logoColors.primary, marginRight: '0.75rem' }} />
                    <span style={{ color: '#4A5568' }}>Team collaboration</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Team Section */}
        <Row className="mb-5">
          <Col>
            <h2 className="text-center mb-4" style={{ color: logoColors.dark }}>
              <FaUsers style={{ color: logoColors.primary, marginRight: '0.5rem' }} /> Meet Our Team
            </h2>

            {/* Decorative line under team header */}
            <div style={{
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${logoColors.primary}40, transparent)`,
              width: '150px',
              margin: '1rem auto 2rem auto'
            }} />

            <Row>
              {teamMembers.map((member, index) => (
                <Col key={index} xs={6} md={3} className="mb-4">
                  <Card className="h-100 border-0 text-center" style={{
                    borderRadius: '12px',
                    background: 'white',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = `0 8px 20px ${logoColors.primary}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                    }}>
                    <div className="d-flex justify-content-center mt-3">
                      <Image
                        src={member.image}
                        roundedCircle
                        style={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'cover',
                          border: `3px solid ${logoColors.primary}`
                        }}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title style={{ color: '#2D3748' }}>{member.name}</Card.Title>
                      <Badge
                        pill
                        style={{
                          background: logoColors.gradient,
                          border: 'none',
                          padding: '0.5rem 1rem'
                        }}
                      >
                        {member.role}
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* History/Accordion */}
        <Row className="mb-5">
          <Col>
            <h2 className="text-center mb-4" style={{ color: logoColors.dark }}>
              <FaAward style={{ color: logoColors.primary, marginRight: '0.5rem' }} /> Our Journey
            </h2>

            {/* Decorative line under history header */}
            <div style={{
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${logoColors.primary}40, transparent)`,
              width: '150px',
              margin: '1rem auto 2rem auto'
            }} />

            <Accordion defaultActiveKey="0" flush>
              {milestones.map((item, index) => (
                <Accordion.Item
                  key={index}
                  eventKey={index.toString()}
                  style={{
                    marginBottom: '1rem',
                    border: `1px solid ${logoColors.primary}20`,
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                >
                  <Accordion.Header>
                    <strong className="me-2" style={{ color: logoColors.primary }}>{item.year}:</strong>
                    <span style={{ color: '#2D3748' }}>{item.event}</span>
                  </Accordion.Header>
                  <Accordion.Body style={{ background: logoColors.lighterBg, color: '#4A5568' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua.
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>
        </Row>

        {/* Testimonial */}
        <Row className="mb-5">
          <Col>
            <Card className="border-0" style={{
              background: logoColors.softGradient,
              borderRadius: '12px',
              transition: 'all 0.3s ease'
            }}>
              <Card.Body className="p-5 text-center">
                <FaQuoteLeft style={{ color: logoColors.primary, marginBottom: '1rem' }} size={24} />
                <blockquote className="blockquote mb-0">
                  <p className="fs-4" style={{ color: '#2D3748' }}>
                    "Working with this company has been transformative for our business. Their
                    innovative approach and dedicated team delivered results beyond our expectations."
                  </p>
                  <footer className="blockquote-footer mt-3" style={{ color: '#4A5568' }}>
                    Satisfied Customer from <cite style={{ color: logoColors.primary }}>Global Enterprises</cite>
                  </footer>
                </blockquote>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* CTA */}
        <Row className="text-center">
          <Col>
            <Card className="border-0" style={{
              background: logoColors.gradient,
              borderRadius: '12px'
            }}>
              <Card.Body className="p-5">
                <h3 className="text-white mb-3">Ready to work with us?</h3>
                <p className="mb-4" style={{ color: 'rgba(255,255,255,0.9)' }}>Join thousands of satisfied customers worldwide</p>
                <Button
                  as={Link}
                  to="/contact-us"
                  variant="light"
                  size="lg"
                  className="px-5"
                  style={{
                    borderRadius: '8px',
                    fontWeight: '500',
                    color: logoColors.primary,
                    border: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Contact Us Today
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default AboutUs;