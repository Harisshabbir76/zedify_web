import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import { FaTrash, FaUpload } from 'react-icons/fa';

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

const ProductEditModal = ({ show, product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    discountedPrice: 0,
    description: '',
    category: '',
    stock: 0,
    images: [],
    isFeatured: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.originalPrice || 0,
        discountedPrice: product.discountedPrice || 0,
        description: product.description || '',
        category: (typeof product.category === 'object' && product.category !== null) ? (product.category.name || '') : (product.category || ''),
        stock: product.stock || 0,
        images: product.image || [],
        isFeatured: product.isFeatured || false
      });
      setNewImages([]);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'price' || name === 'discountedPrice' || name === 'stock' ? Number(value) : value)
    }));
  };

  const handleImageUpload = async (e) => {
    let files = [];
    if (e.target.files) {
      files = Array.from(e.target.files);
    } else if (e.dataTransfer && e.dataTransfer.files) {
      files = Array.from(e.dataTransfer.files);
    }

    if (files.length === 0) return;
    
    setImageUploading(true);
    
    // Store new image files as object URLs for preview
    const previewUrls = files.map(file => ({ file, url: URL.createObjectURL(file) }));
    setNewImages(prev => [...prev, ...previewUrls]);
    
    setImageUploading(false);
  };

  const removeImage = (index, isNewImage) => {
    if (isNewImage) {
      // Revoke object URL to avoid memory leaks
      URL.revokeObjectURL(newImages[index].url);
      setNewImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare update data
      const updateData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        stock: formData.stock,
        originalPrice: formData.price,
        discountedPrice: formData.discountedPrice,
        image: formData.images,
        isFeatured: formData.isFeatured
      };

      console.log('Sending update with isFeatured:', updateData.isFeatured);

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update/${product._id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('Update response:', response.data);
      
      // If there are new images to upload, handle them separately
      if (newImages.length > 0) {
        const imageFormData = new FormData();
        newImages.forEach(({ file }) => {
          imageFormData.append('images', file);
        });
        
        // You might need an additional endpoint to add images to existing product
        // For now, we'll just show a warning
        console.warn('New images selected but need separate upload endpoint');
      }

      onSave(response.data);
      onClose();
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_API_URL}${imagePath}`;
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="xl"
      dialogClassName="modal-90w"
      centered
      style={{
        backdropFilter: 'blur(5px)'
      }}
    >
      <Modal.Header
        closeButton
        style={{
          background: logoColors.softGradient,
          borderBottom: `1px solid ${logoColors.light}`,
          padding: '1rem 1.5rem'
        }}
      >
        <Modal.Title style={{ color: logoColors.dark, fontWeight: '600' }}>
          Edit Product
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: '1.5rem', background: 'white' }}>
        {error && <Alert variant="danger" style={{ borderRadius: '8px' }}>{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: logoColors.dark, fontWeight: '500' }}>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    borderRadius: '8px',
                    borderColor: logoColors.light
                  }}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: logoColors.dark, fontWeight: '500' }}>Original Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                      style={{
                        borderRadius: '8px',
                        borderColor: logoColors.light
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: logoColors.dark, fontWeight: '500' }}>Discounted Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="discountedPrice"
                      value={formData.discountedPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      style={{
                        borderRadius: '8px',
                        borderColor: logoColors.light
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: logoColors.dark, fontWeight: '500' }}>Stock Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      required
                      style={{
                        borderRadius: '8px',
                        borderColor: logoColors.light
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: logoColors.dark, fontWeight: '500' }}>Category</Form.Label>
                    <Form.Control
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      style={{
                        borderRadius: '8px',
                        borderColor: logoColors.light
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Featured Product Toggle */}
              <Form.Group className="mb-3">
                <div style={{
                  background: logoColors.softGradient,
                  padding: '1rem',
                  borderRadius: '8px',
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
                    Enable to show this product in Featured Products section on home page
                  </Form.Text>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ color: logoColors.dark, fontWeight: '500' }}>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  style={{
                    minHeight: '150px',
                    borderRadius: '8px',
                    borderColor: logoColors.light
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-4">
                <Form.Label style={{ color: logoColors.dark, fontWeight: '500' }}>Product Images</Form.Label>
                <div className="border p-3 rounded" style={{
                  minHeight: '200px',
                  borderColor: logoColors.light,
                  borderRadius: '8px',
                  background: logoColors.lighterBg
                }}>
                  {/* Existing Images */}
                  {formData.images.length > 0 && (
                    <div className="mb-3">
                      <h6 style={{ color: logoColors.dark, fontWeight: '600' }}>Current Images</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {formData.images.map((img, index) => (
                          <div key={`existing-${index}`} className="position-relative" style={{ width: '100px' }}>
                            <Image
                              src={getImageUrl(img)}
                              thumbnail
                              style={{
                                width: '100%',
                                height: '100px',
                                objectFit: 'cover',
                                borderColor: logoColors.light
                              }}
                            />
                            <Button
                              variant="danger"
                              size="sm"
                              className="position-absolute top-0 end-0 m-1"
                              onClick={() => removeImage(index, false)}
                              style={{
                                background: '#dc3545',
                                border: 'none',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px'
                              }}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images */}
                  <div 
                    className="mb-3 border rounded p-3 text-center"
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
                      handleImageUpload(e);
                    }}
                    style={{
                      borderColor: isDragging ? logoColors.primary : logoColors.light,
                      background: isDragging ? logoColors.softGradient : logoColors.lighterBg,
                      borderStyle: isDragging ? 'dashed' : 'solid',
                      borderWidth: '2px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <h6 style={{ color: logoColors.dark, fontWeight: '600' }}>Add New Images</h6>
                    {newImages.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {newImages.map((img, index) => (
                          <div key={`new-${index}`} className="position-relative" style={{ width: '100px' }}>
                            <Image
                              src={img.url}
                              thumbnail
                              style={{
                                width: '100%',
                                height: '100px',
                                objectFit: 'cover',
                                borderColor: logoColors.light
                              }}
                            />
                            <Button
                              variant="danger"
                              size="sm"
                              className="position-absolute top-0 end-0 m-1"
                              onClick={() => removeImage(index, true)}
                              style={{
                                background: '#dc3545',
                                border: 'none',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px'
                              }}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div className="text-center mt-3">
                    <Form.Label
                      htmlFor="image-upload"
                      className="btn w-100"
                      style={{
                        background: logoColors.gradient,
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontWeight: '500',
                        transition: 'all 0.3s ease',
                        cursor: imageUploading ? 'not-allowed' : 'pointer',
                        opacity: imageUploading ? 0.7 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!imageUploading) {
                          e.target.style.opacity = '0.9';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = `0 4px 12px ${logoColors.primary}40`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!imageUploading) {
                          e.target.style.opacity = '1';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {imageUploading ? (
                        <Spinner size="sm" animation="border" variant="light" />
                      ) : (
                        <>
                          <FaUpload className="me-2" />
                          Upload New Images
                        </>
                      )}
                    </Form.Label>
                    <Form.Control
                      type="file"
                      id="image-upload"
                      multiple
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      accept="image/*"
                      disabled={imageUploading}
                    />
                    <Form.Text className="text-muted" style={{ color: '#718096' }}>
                      Upload additional product images
                    </Form.Text>
                  </div>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button
              variant="secondary"
              onClick={onClose}
              style={{
                border: `1px solid ${logoColors.light}`,
                color: '#4A5568',
                background: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = logoColors.softGradient;
                e.target.style.borderColor = logoColors.primary;
                e.target.style.color = logoColors.dark;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = logoColors.light;
                e.target.style.color = '#4A5568';
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading || imageUploading}
              style={{
                background: logoColors.gradient,
                border: 'none',
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading && !imageUploading) {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 4px 12px ${logoColors.primary}40`;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && !imageUploading) {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {loading ? <Spinner size="sm" animation="border" variant="light" /> : 'Save Changes'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductEditModal;