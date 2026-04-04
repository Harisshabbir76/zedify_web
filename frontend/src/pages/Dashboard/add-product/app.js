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
  FiImage,
  FiUpload,
  FiX
} from 'react-icons/fi';

// Navbar color palette
const logoColors = {
  primary: '#fe7e8b',
  secondary: '#e65c70',
  light: '#ffd1d4',
  dark: '#d64555',
  background: '#fff5f6',
  gradient: 'linear-gradient(135deg, #fe7e8b 0%, #e65c70 100%)',
  softGradient: 'linear-gradient(135deg, #fff5f6 0%, #ffd1d4 100%)',
};

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    category: '',
    stock: '',
    sizes: '',
    colors: '',
    isFeatured: false
  });
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    let files = [];
    if (e.target.files) {
      files = Array.from(e.target.files);
    } else if (e.dataTransfer && e.dataTransfer.files) {
      files = Array.from(e.dataTransfer.files);
    }
    
    if (files.length === 0) return;
    
    setImages(prev => [...prev, ...files]);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
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
    
    // Append all form data including isFeatured
    Object.entries(formData).forEach(([key, value]) => {
      // Convert isFeatured to string for FormData
      if (key === 'isFeatured') {
        data.append(key, value ? 'true' : 'false');
      } else {
        data.append(key, value);
      }
    });

    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/dashboard/add-product`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Product added with isFeatured:', formData.isFeatured);
      setSuccess("Product Added Successfully");
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        originalPrice: '',
        discountedPrice: '',
        category: '',
        stock: '',
        sizes: '',
        colors: '',
        isFeatured: false
      });

      // Clean up image previews
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setImages([]);
      setImagePreviews([]);

      // Redirect to dashboard catalog after a short delay
      setTimeout(() => {
        navigate('/dashboard/catalog');
      }, 2000);
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
    
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    checkAuth();
    fetchCategories();
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
                  background: '#ffd1d4',
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
                    <Form.Select
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
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </Form.Select>
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
                        Rs.
                      </InputGroup.Text>
                      <Form.Control
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleChange}
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
                        Rs.
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
              </Row>

              {/* Variants Section - Optional */}
              <div className="mb-4" style={{
                background: logoColors.softGradient,
                padding: '1.5rem',
                borderRadius: '12px',
                border: `1px solid ${logoColors.light}`
              }}>
                <h5 style={{ color: logoColors.dark, marginBottom: '1rem' }}>
                  Product Variants (Optional)
                </h5>
                <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Add sizes and colors for this product. Leave empty if not applicable.
                </p>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: logoColors.dark, fontWeight: '500' }}>
                        Sizes (comma separated)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="sizes"
                        value={formData.sizes || ''}
                        onChange={handleChange}
                        placeholder="e.g., S, M, L, XL, XXL"
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
                      <Form.Text className="text-muted" style={{ color: '#718096' }}>
                        Example: S, M, L, XL
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: logoColors.dark, fontWeight: '500' }}>
                        Colors (comma separated)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="colors"
                        value={formData.colors || ''}
                        onChange={handleChange}
                        placeholder="e.g., Red, Blue, Green, Black"
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
                      <Form.Text className="text-muted" style={{ color: '#718096' }}>
                        Example: Red, Blue, Black, White
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Featured Product Toggle */}
              <Form.Group className="mb-4">
                <div style={{
                  background: logoColors.softGradient,
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: `1px solid ${logoColors.light}`
                }}>
                  <Form.Check
                    type="switch"
                    name="isFeatured"
                    label="Feature this product on homepage"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    style={{ fontWeight: '500', fontSize: '1rem' }}
                  />
                  <Form.Text style={{ color: '#718096', fontSize: '0.9rem', marginTop: '0.5rem', display: 'block' }}>
                    Enable to show this product in the Featured Products section on the home page
                  </Form.Text>
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label style={{ color: logoColors.dark, fontWeight: '500' }}>
                  <FiImage className="me-2" style={{ color: logoColors.primary }} />
                  Product Images
                </Form.Label>
                <div
                  className="border rounded p-4 text-center"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleImageChange(e);
                  }}
                  style={{
                    borderColor: isDragging ? logoColors.primary : logoColors.light,
                    background: isDragging ? logoColors.softGradient : logoColors.lighterBg,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderStyle: isDragging ? 'dashed' : 'solid',
                    borderWidth: '2px'
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