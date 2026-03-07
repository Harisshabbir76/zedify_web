import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Button,
  Badge,
  Card,
  Stack,
  Form,
  ListGroup
} from 'react-bootstrap';
import { useCart } from '../../components/CartContext';
import RecommendedProducts from '../../components/RecommendedProducts';

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

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    userEmail: '',
    rating: 0,
    comment: ''
  });
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/${slug}`);
        setProduct(res.data);
        setReviews(res.data.reviews || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: quantity
    });
  };

  const handleOrderNow = () => {
    navigate('/checkout', {
      state: {
        products: [{
          ...product,
          quantity: quantity
        }]
      }
    });
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setReviewForm(prev => ({
      ...prev,
      rating
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/reviews`, {
        product: product._id,
        ...reviewForm
      });

      // Refresh product and reviews
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/${slug}`);
      setProduct(res.data);
      setReviews(res.data.reviews);

      setReviewSuccess('Review submitted successfully!');
      setReviewError('');
      setReviewForm({
        userName: '',
        userEmail: '',
        rating: 0,
        comment: ''
      });
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Error submitting review');
      setReviewSuccess('');
    }
  };

  if (loading) {
    return (
      <Container fluid className="text-center py-5" style={{ background: logoColors.background, minHeight: '100vh' }}>
        <Spinner animation="border" style={{ color: logoColors.primary }} />
        <p className="mt-3" style={{ color: '#4A5568' }}>Loading product details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-5" style={{ background: logoColors.background, minHeight: '100vh' }}>
        <Alert variant="danger">
          Error loading product: {error.message}
        </Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container fluid className="py-5" style={{ background: logoColors.background, minHeight: '100vh' }}>
        <Alert variant="info">Product not found</Alert>
      </Container>
    );
  }

  return (
    <Container fluid style={{ background: logoColors.background, minHeight: '100vh', padding: '2rem 0' }}>
      <Container>
        <Row className="g-4">
          {/* Product Images */}
          <Col md={6}>
            <Row xs={2} md={3} className="g-3">
              {product.image.map((img, index) => {
                const imgUrl = img.startsWith('http') ? img : `${process.env.REACT_APP_API_URL}${img}`;
                return (
                  <Col key={index}>
                    <Card
                      className={`h-100 cursor-pointer border ${index === selectedImage ? `border-2` : 'border-light'}`}
                      onClick={() => setSelectedImage(index)}
                      style={{
                        cursor: 'pointer',
                        borderColor: index === selectedImage ? logoColors.primary : '#e2e8f0',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Card.Img
                        src={imgUrl}
                        alt={`${product.name} image ${index + 1}`}
                        style={{ objectFit: 'cover', height: '150px', width: '100%' }}
                        onError={e => { e.target.src = '/placeholder.jpg'; }}
                      />
                    </Card>
                  </Col>
                );
              })}
            </Row>

            <Card className="mt-4 border-0 shadow-sm" style={{
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <Card.Img
                src={product.image[selectedImage].startsWith('http') ? product.image[selectedImage] : `${process.env.REACT_APP_API_URL}${product.image[selectedImage]}`}
                alt={`${product.name} main image`}
                style={{
                  objectFit: 'contain',
                  height: '400px',
                  width: '100%',
                  backgroundColor: '#f8f9fa'
                }}
                onError={e => { e.target.src = '/placeholder.jpg'; }}
              />
            </Card>
          </Col>

          {/* Product Details */}
          <Col md={6}>
            <Stack gap={3}>
              <div>
                <Badge
                  bg="light"
                  text="dark"
                  className="mb-2"
                  style={{
                    background: logoColors.softGradient,
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    color: logoColors.dark,
                    fontWeight: '500'
                  }}
                >
                  {product.category}
                </Badge>
                <h1 className="display-5 fw-bold" style={{ color: '#2D3748' }}>{product.name}</h1>
                {product.stock > 0 ? (
                  <Badge
                    className="mb-3"
                    style={{
                      background: logoColors.primary,
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px'
                    }}
                  >
                    In Stock
                  </Badge>
                ) : (
                  <Badge
                    bg="danger"
                    className="mb-3"
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px'
                    }}
                  >
                    Out of Stock
                  </Badge>
                )}
              </div>

              <div>
                <p className="text-muted" style={{ color: '#4A5568', lineHeight: '1.8' }}>{product.description}</p>
              </div>

              <div className="d-flex align-items-center gap-3">
                <h3 className="mb-0" style={{ color: logoColors.primary }}>
                  Rs. {product.discountedPrice}
                </h3>
                {product.discountedPrice < product.originalPrice && (
                  <del className="text-muted" style={{ color: '#718096' }}>Rs. {product.originalPrice}</del>
                )}
              </div>

              {/* Rating Display */}
              <div className="d-flex align-items-center mt-2">
                <div className="d-flex me-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      style={{
                        color: product.averageRating > i ? logoColors.primary : '#ccc',
                        fontSize: '1.2rem'
                      }}
                    >
                      {product.averageRating > i ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="text-muted" style={{ color: '#718096' }}>
                  ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <Form.Group controlId="quantity" className="mt-3">
                  <Form.Label style={{ color: '#4A5568', fontWeight: '500' }}>Quantity:</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    style={{
                      width: '100px',
                      borderRadius: '8px',
                      borderColor: '#e2e8f0'
                    }}
                  />
                  <Form.Text className="text-muted" style={{ color: '#718096' }}>
                    Max {product.stock} available
                  </Form.Text>
                </Form.Group>
              )}

              <Stack direction="horizontal" gap={3} className="mt-4">
                {product.stock > 0 ? (
                  <>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleOrderNow}
                      style={{
                        background: logoColors.gradient,
                        border: 'none',
                        flex: 1,
                        padding: '0.75rem',
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
                      Order Now
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="lg"
                      onClick={() => {
                        handleAddToCart();
                      }}
                      style={{
                        borderColor: logoColors.primary,
                        color: logoColors.primary,
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '8px',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = logoColors.softGradient;
                        e.target.style.color = logoColors.dark;
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = `0 4px 12px ${logoColors.primary}40`;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = logoColors.primary;
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                      data-track="add_to_cart"
                      data-track-meta={JSON.stringify({
                        product_id: product.id,
                        price: product.price,
                        name: product.name,
                        category: product.category,
                      })}
                    >
                      Add to Cart
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="secondary"
                    size="lg"
                    disabled
                    style={{ width: '100%' }}
                  >
                    Currently Unavailable
                  </Button>
                )}
              </Stack>
            </Stack>
          </Col>
        </Row>

        {/* Reviews Section */}
        <Row className="mt-5">
          <Col md={12}>
            <Card className="mb-4 border-0 shadow-sm" style={{
              borderRadius: '12px',
              background: 'white'
            }}>
              <Card.Body style={{ padding: '2rem' }}>
                <h4 style={{ color: logoColors.dark, marginBottom: '1.5rem' }}>Write a Review</h4>
                {reviewError && <Alert variant="danger">{reviewError}</Alert>}
                {reviewSuccess && <Alert variant="success">{reviewSuccess}</Alert>}

                <Form onSubmit={handleReviewSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#4A5568', fontWeight: '500' }}>Your Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="userName"
                          value={reviewForm.userName}
                          onChange={handleReviewChange}
                          required
                          style={{
                            borderRadius: '8px',
                            borderColor: '#e2e8f0'
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#4A5568', fontWeight: '500' }}>Your Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="userEmail"
                          value={reviewForm.userEmail}
                          onChange={handleReviewChange}
                          required
                          style={{
                            borderRadius: '8px',
                            borderColor: '#e2e8f0'
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#4A5568', fontWeight: '500' }}>Rating</Form.Label>
                    <div className="d-flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          style={{
                            cursor: 'pointer',
                            color: reviewForm.rating > i ? logoColors.primary : '#ccc',
                            fontSize: '1.5rem',
                            transition: 'color 0.2s ease'
                          }}
                          onClick={() => handleRatingChange(i + 1)}
                          onMouseEnter={(e) => {
                            if (reviewForm.rating <= i) {
                              e.target.style.color = logoColors.light;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (reviewForm.rating <= i) {
                              e.target.style.color = '#ccc';
                            }
                          }}
                        >
                          {reviewForm.rating > i ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#4A5568', fontWeight: '500' }}>Review</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="comment"
                      value={reviewForm.comment}
                      onChange={handleReviewChange}
                      required
                      style={{
                        borderRadius: '8px',
                        borderColor: '#e2e8f0'
                      }}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    style={{
                      background: logoColors.gradient,
                      border: 'none',
                      padding: '0.75rem 2rem',
                      borderRadius: '8px',
                      fontWeight: '500'
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
                    Submit Review
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Reviews List */}
            <h4 style={{ color: logoColors.dark, marginBottom: '1.5rem' }}>Customer Reviews</h4>
            {reviews.length === 0 ? (
              <p style={{ color: '#718096' }}>No reviews yet. Be the first to review!</p>
            ) : (
              <ListGroup variant="flush">
                {reviews.map((review) => (
                  <ListGroup.Item key={review._id} className="px-0 mb-3" style={{ background: 'transparent' }}>
                    <Card className="border-0 shadow-sm" style={{
                      borderRadius: '12px',
                      background: 'white'
                    }}>
                      <Card.Body style={{ padding: '1.5rem' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <strong style={{ color: '#2D3748' }}>{review.userName}</strong>
                            <small className="text-muted ms-2" style={{ color: '#718096' }}>{review.userEmail}</small>
                          </div>
                          <div className="d-flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                style={{
                                  color: review.rating > i ? logoColors.primary : '#ccc',
                                  fontSize: '1.2rem'
                                }}
                              >
                                {review.rating > i ? '★' : '☆'}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Card.Text style={{ color: '#4A5568', lineHeight: '1.6' }}>{review.comment}</Card.Text>
                        <small className="text-muted" style={{ color: '#718096' }}>
                          Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                        </small>
                      </Card.Body>
                    </Card>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
        </Row>

        {/* Recommended Products Section */}
        <Row className="mt-5">
          <Col>
            <RecommendedProducts
              currentProductId={product._id}
              category={product.category}
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}