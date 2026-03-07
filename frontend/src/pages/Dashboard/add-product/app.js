import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  Spinner,
  Row,
  Col,
  InputGroup,
  Image
} from 'react-bootstrap';
import {
  FiPackage,
  FiTag,
  FiFileText,
  FiDollarSign,
  FiPercent,
  FiHash,
  FiLink,
  FiImage,
  FiUpload,
  FiX
} from 'react-icons/fi';

// Logo pink color palette
const logoColors = {
  primary: '#FF69B4', // Hot pink - main logo color
  secondary: '#FF1493', // Deep pink - darker shade
  light: '#FFB6C1', // Light pink - for accents
  dark: '#C71585', // Medium violet red - very dark pink
  background: '#FFF5F7', // Super light pink - almost white
  gradient: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)', // Pink gradient from logo
  softGradient: 'linear-gradient(135deg, #FFF0F3 0%, #FFE4E8 100%)', // Very soft pink gradient
};

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    category: '',
    stock: '',
    slug: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index]);

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/dashboard/add-product`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccess("Product Added Successfully");
      setFormData({
        name: '',
        description: '',
        originalPrice: '',
        discountedPrice: '',
        category: '',
        stock: '',
        slug: ''
      });

      // Clean up image previews
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setImages([]);
      setImagePreviews([]);
    } catch (err) {
      console.error(err);
      setError("Product Addition Failed: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/404');
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.user?.email?.toLowerCase() === 'harisshabbir17@gmail.com') {
          setIsAuthorized(true);
        } else {
          navigate('/404');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/404');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  if (isLoading) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: '100vh',
          background: logoColors.background
        }}
      >
        <div className="text-center">
          <Spinner animation="border" style={{ color: logoColors.primary }} />
          <p className="mt-3" style={{ color: '#4A5568' }}>Loading...</p>
        </div>
      </Container>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <Container
      fluid
      style={{
        background: logoColors.background,
        minHeight: '100vh',
        padding: '2rem 0'
      }}
    >
      <Container>
        <Card
          className="border-0 shadow-lg mx-auto"
          style={{
            maxWidth: '900px',
            borderRadius: '16px',
            overflow: 'hidden'
          }}
        >
          {/* Card Header with Pink Gradient */}
          <div style={{
            background: logoColors.gradient,
            padding: '2rem 1.5rem',
            textAlign: 'center'
          }}>
            <h1 className="text-white mb-0" style={{ fontWeight: '600', fontSize: '2rem' }}>
              <FiPackage className="me-2" style={{ verticalAlign: 'middle' }} />
              Add New Product
            </h1>
            <p className="text-white-50 mt-2" style={{ opacity: 0.9 }}>
              Fill in the details to add a new product to your catalog
            </p>
          </div>

          <Card.Body style={{ padding: '2rem' }}>
            {error && (
              <Alert
                variant="danger"
                className="text-center"
                style={{
                  background: '#FFE4E8',
                  border: `1px solid ${logoColors.primary}`,
                  color: logoColors.dark,
                  borderRadius: '8px'
                }}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                variant="success"
                className="text-center"
                style={{
                  background: logoColors.softGradient,
                  border: `1px solid ${logoColors.light}`,
                  color: logoColors.dark,
                  borderRadius: '8px'
                }}
              >
                {success}
              </Alert>
            )}

            <Form onSubmit={handleProductSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: logoColors.dark, fontWeight: '500' }}>
                      <FiPackage className="me-2" style={{ color: logoColors.primary }} />
                      Product Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{
                        borderColor: logoColors.light,
                        padding: '0.75rem',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = logoColors.primary;
                        e.target.style.boxShadow = `0 0 0 3px ${logoColors.primary}20`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = logoColors.light;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: logoColors.dark, fontWeight: '500' }}>
                      <FiTag className="me-2" style={{ color: logoColors.primary }} />
                      Category
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      style={{
                        borderColor: logoColors.light,
                        padding: '0.75rem',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = logoColors.primary;
                        e.target.style.boxShadow = `0 0 0 3px ${logoColors.primary}20`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = logoColors.light;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label style={{ color: logoColors.dark, fontWeight: '500' }}>
                  <FiFileText className="me-2" style={{ color: logoColors.primary }} />
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  style={{
                    borderColor: logoColors.light,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = logoColors.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${logoColors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = logoColors.light;
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: logoColors.dark, fontWeight: '500' }}>
                      <FiDollarSign className="me-2" style={{ color: logoColors.primary }} />
                      Original Price
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={{
                        background: 'white',
                        borderColor: logoColors.light,
                        color: logoColors.primary
                      }}>
                        $
                      </InputGroup.Text>
                      <Form.Control
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        required
                        style={{
                          borderColor: logoColors.light,
                          padding: '0.75rem',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = logoColors.primary;
                          e.target.style.boxShadow = `0 0 0 3px ${logoColors.primary}20`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = logoColors.light;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: logoColors.dark, fontWeight: '500' }}>
                      <FiPercent className="me-2" style={{ color: logoColors.primary }} />
                      Discounted Price
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={{
                        background: 'white',
                        borderColor: logoColors.light,
                        color: logoColors.primary
                      }}>
                        $
                      </InputGroup.Text>
                      <Form.Control
                        type="number"
                        name="discountedPrice"
                        value={formData.discountedPrice}
                        onChange={handleChange}
                        required
                        style={{
                          borderColor: logoColors.light,
                          padding: '0.75rem',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = logoColors.primary;
                          e.target.style.boxShadow = `0 0 0 3px ${logoColors.primary}20`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = logoColors.light;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: logoColors.dark, fontWeight: '500' }}>
                      <FiHash className="me-2" style={{ color: logoColors.primary }} />
                      Stock Quantity
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      style={{
                        borderColor: logoColors.light,
                        padding: '0.75rem',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = logoColors.primary;
                        e.target.style.boxShadow = `0 0 0 3px ${logoColors.primary}20`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = logoColors.light;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: logoColors.dark, fontWeight: '500' }}>
                      <FiLink className="me-2" style={{ color: logoColors.primary }} />
                      Product Slug
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      required
                      style={{
                        borderColor: logoColors.light,
                        padding: '0.75rem',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = logoColors.primary;
                        e.target.style.boxShadow = `0 0 0 3px ${logoColors.primary}20`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = logoColors.light;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label style={{ color: logoColors.dark, fontWeight: '500' }}>
                  <FiImage className="me-2" style={{ color: logoColors.primary }} />
                  Product Images
                </Form.Label>
                <div
                  className="border rounded p-4 text-center"
                  style={{
                    borderColor: logoColors.light,
                    background: logoColors.lighterBg,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    if (files.length > 0) {
                      handleImageChange({ target: { files } });
                    }
                  }}
                >
                  <FiUpload
                    size={32}
                    style={{ color: logoColors.primary, marginBottom: '1rem' }}
                  />
                  <p style={{ color: '#4A5568', marginBottom: '0.5rem' }}>
                    Drag and drop images here or click to browse
                  </p>
                  <Form.Control
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <Button
                    variant="outline-primary"
                    onClick={() => document.getElementById('image-upload').click()}
                    style={{
                      borderColor: logoColors.primary,
                      color: logoColors.primary,
                      background: 'white',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = logoColors.softGradient;
                      e.target.style.color = logoColors.dark;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.color = logoColors.primary;
                    }}
                  >
                    Select Images
                  </Button>
                  <Form.Text className="d-block mt-2" style={{ color: '#718096' }}>
                    Upload multiple images for the product (JPEG, PNG, GIF)
                  </Form.Text>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <Row className="mt-3">
                    {imagePreviews.map((preview, index) => (
                      <Col key={index} xs={4} md={3} className="mb-2">
                        <div className="position-relative">
                          <Image
                            src={preview}
                            thumbnail
                            style={{
                              height: '100px',
                              width: '100%',
                              objectFit: 'cover',
                              borderColor: logoColors.light
                            }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1"
                            onClick={() => removeImage(index)}
                            style={{
                              background: '#dc3545',
                              border: 'none',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.opacity = '0.9';
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.opacity = '1';
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            <FiX size={12} />
                          </Button>
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 py-3"
                style={{
                  background: logoColors.gradient,
                  border: 'none',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 4px 15px ${logoColors.primary}40`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <FiPackage size={20} />
                Add Product
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Container>
  );
}