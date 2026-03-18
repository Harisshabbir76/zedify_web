import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Form, Modal, Card, Spinner, Alert, Image, Row, Col } from 'react-bootstrap';
import { FiPlus, FiEdit2, FiTrash2, FiUpload, FiCheck, FiX, FiMonitor, FiSmartphone } from 'react-icons/fi';

const logoColors = {
    primary: '#fe7e8b',
    light: '#ffd1d4',
    dark: '#d64555',
    background: '#fff9fa',
    gradient: 'linear-gradient(135deg, #fe7e8b 0%, #e65c70 100%)',
    softGradient: 'linear-gradient(135deg, #fff5f6 0%, #ffd1d4 100%)',
};

export default function HeroManagement() {
    const [slides, setSlides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        ctaText: '',
        ctaLink: '',
        isActive: true,
        desktopImage: null,
        mobileImage: null
    });
    const [desktopImagePreview, setDesktopImagePreview] = useState(null);
    const [mobileImagePreview, setMobileImagePreview] = useState(null);
    const [error, setError] = useState(null);

    const fetchSlides = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/hero-slides`);
            setSlides(res.data);
        } catch (err) {
            console.error('Error fetching slides:', err);
            setError('Failed to load slides');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    const handleOpenModal = (slide = null) => {
        if (slide) {
            setEditingSlide(slide);
            setFormData({
                title: slide.title || '',
                subtitle: slide.subtitle || '',
                ctaText: slide.ctaText || '',
                ctaLink: slide.ctaLink || '',
                isActive: slide.isActive,
                desktopImage: null,
                mobileImage: null
            });
            setDesktopImagePreview(slide.desktopImage || slide.image);
            setMobileImagePreview(slide.mobileImage);
        } else {
            setEditingSlide(null);
            setFormData({
                title: '',
                subtitle: '',
                ctaText: '',
                ctaLink: '',
                isActive: true,
                desktopImage: null,
                mobileImage: null
            });
            setDesktopImagePreview(null);
            setMobileImagePreview(null);
        }
        setShowModal(true);
        setError(null);
    };

    const handleDesktopImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, desktopImage: file });
            setDesktopImagePreview(URL.createObjectURL(file));
        }
    };

    const handleMobileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, mobileImage: file });
            setMobileImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (slides.length >= 5 && !editingSlide) {
            setError('Maximum 5 slides allowed');
            return;
        }
        if (!desktopImagePreview && !formData.desktopImage) {
            setError('Desktop image is required');
            return;
        }
        if (!mobileImagePreview && !formData.mobileImage) {
            setError('Mobile image is required');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        try {
            if (editingSlide) {
                await axios.put(`${process.env.REACT_APP_API_URL}/api/hero-slides/${editingSlide._id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/hero-slides`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            fetchSlides();
            setShowModal(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save slide');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this slide?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/hero-slides/${id}`);
                fetchSlides();
            } catch (err) {
                setError('Failed to delete slide');
            }
        }
    };

    const getPreviewImage = (slide) => slide.desktopImage || slide.image || slide.mobileImage;

    if (isLoading) return <div className="text-center py-5"><Spinner animation="border" style={{ color: logoColors.primary }} /></div>;

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 style={{ color: logoColors.dark, margin: 0 }}>Hero Slider Management</h4>
                    <small className="text-muted">{slides.length}/5 slides used</small>
                </div>
                <Button onClick={() => handleOpenModal()} disabled={slides.length >= 5} style={{ background: logoColors.gradient, border: 'none' }}>
                    <FiPlus className="me-2" /> Add Slide
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="g-4">
                {slides.map((slide) => (
                    <Col key={slide._id} md={6} lg={4}>
                        <Card className="h-100 border-0 shadow-sm overflow-hidden">
                            <div style={{ position: 'relative', paddingTop: '50%' }}>
                                <Image src={getPreviewImage(slide)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                    {slide.isActive ? <div className="bg-success text-white p-1 rounded-circle"><FiCheck size={12} /></div> : <div className="bg-secondary text-white p-1 rounded-circle"><FiX size={12} /></div>}
                                </div>
                            </div>
                            <Card.Body>
                                <h6 className="mb-1 text-truncate">{slide.title || 'Untitled'}</h6>
                                <p className="text-muted small mb-3 text-truncate">{slide.subtitle || 'No subtitle'}</p>
                                <div className="d-flex justify-content-end gap-2">
                                    <Button size="sm" variant="outline-primary" onClick={() => handleOpenModal(slide)}><FiEdit2 /> Edit</Button>
                                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(slide._id)}><FiTrash2 /></Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: logoColors.dark }}>{editingSlide ? 'Edit Slide' : 'Add Hero Slide'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Subtitle</Form.Label>
                                    <Form.Control type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Button Text</Form.Label>
                                    <Form.Control type="text" value={formData.ctaText} onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Button Link</Form.Label>
                                    <Form.Control type="text" value={formData.ctaLink} onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })} />
                                </Form.Group>
                                <Form.Check type="switch" label="Active" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label><FiMonitor className="me-1" /> Desktop Image <span className="text-muted small">(Recommended: 1920×800px)</span></Form.Label>
                                    <div className="border rounded p-3 text-center h-100 d-flex flex-column justify-content-center" style={{ background: '#f8f9fa', cursor: 'pointer', minHeight: '150px' }} onClick={() => document.getElementById('desktop-image').click()}>
                                        {desktopImagePreview ? <Image src={desktopImagePreview} fluid style={{ maxHeight: '120px', objectFit: 'cover' }} /> : <div><FiUpload size={24} className="mb-2 text-muted" /><p className="mb-0 small">Click to upload desktop</p></div>}
                                    </div>
                                    <Form.Control id="desktop-image" type="file" className="d-none mt-2" accept="image/*" onChange={handleDesktopImageChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><FiSmartphone className="me-1" /> Mobile Image <span className="text-muted small">(Recommended: 390×500px)</span></Form.Label>
                                    <div className="border rounded p-3 text-center h-100 d-flex flex-column justify-content-center" style={{ background: '#f8f9fa', cursor: 'pointer', minHeight: '150px' }} onClick={() => document.getElementById('mobile-image').click()}>
                                        {mobileImagePreview ? <Image src={mobileImagePreview} fluid style={{ maxHeight: '120px', objectFit: 'cover' }} /> : <div><FiUpload size={24} className="mb-2 text-muted" /><p className="mb-0 small">Click to upload mobile</p></div>}
                                    </div>
                                    <Form.Control id="mobile-image" type="file" className="d-none mt-2" accept="image/*" onChange={handleMobileImageChange} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} style={{ background: logoColors.gradient, border: 'none' }}>
                            {isSubmitting ? 'Saving...' : 'Save Slide'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}

