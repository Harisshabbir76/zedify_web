import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaShoppingCart, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

// Navbar color palette
const logoColors = {
    primary: '#fe7e8b',
    secondary: '#e65c70',
    light: '#ffd1d4',
    background: '#fff5f6',
    gradient: 'linear-gradient(135deg, #fe7e8b 0%, #e65c70 100%)',
};

export default function LatestBundles() {
    const [bundles, setBundles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLatestBundles = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/bundles/latest`);
                setBundles(res.data);
            } catch (err) {
                console.error('Error fetching bundles:', err);
                setError('Failed to load bundles.');
            } finally {
                setLoading(false);
            }
        };

        fetchLatestBundles();
    }, []);

    // Calculate total pages
    const totalPages = Math.ceil(bundles.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const visibleBundles = bundles.slice(startIndex, startIndex + itemsPerPage);

    // Navigation handlers
    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleBundleClick = (bundleId) => {
        navigate(`/bundles`);
    };

    const handleAddBundleToCart = (e, bundle) => {
        e.stopPropagation();
        // Add bundle as single cart item using bundlePrice
        const bundleItem = {
            ...bundle,
            _id: `bundle_${bundle._id}`,
            isBundle: true,
            quantity: 1,
            price: bundle.bundlePrice,
            discountedPrice: bundle.bundlePrice,
            name: bundle.name,
            bundleProducts: bundle.products,
            image: bundle.image ? [bundle.image] : bundle.products[0]?.image || []
        };
        addToCart(bundleItem);
    };

    const handleBuyNow = (e, bundle) => {
        e.stopPropagation();
        navigate('/checkout', {
            state: {
                products: [{
                    ...bundle,
                    _id: `bundle_${bundle._id}`,
                    isBundle: true,
                    quantity: 1,
                    price: bundle.bundlePrice,
                    discountedPrice: bundle.bundlePrice,
                    name: bundle.name,
                    bundleProducts: bundle.products,
                    image: bundle.image ? [bundle.image] : bundle.products[0]?.image || []
                }]
            }
        });
    };

    const getProductImage = (product) => {
        if (!product?.image?.[0]) return '/placeholder.jpg';
        if (product.image[0].startsWith('http')) return product.image[0];
        return `${process.env.REACT_APP_API_URL}${product.image[0].startsWith('/') ? '' : '/'}${product.image[0]}`;
    };

    if (loading) {
        return (
            <Container className="text-center my-5 py-5">
                <Spinner animation="border" style={{ color: logoColors.primary }} />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    // If no bundles, return nothing
    if (bundles.length === 0) return null;

    return (
        <div style={{
            background: logoColors.background,
            padding: '3rem 0',
        }}>
            <Container>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{
                        fontSize: '2rem',
                        color: '#2D3748',
                        marginBottom: '0.5rem',
                        fontWeight: '600'
                    }}>
                        Latest <span style={{ color: logoColors.primary }}>Bundles</span>
                    </h2>
                    <p style={{ color: '#718096', fontSize: '1rem' }}>
                        Great value product packages
                    </p>
                </div>

                {/* Bundles Grid */}
                <div style={{ position: 'relative', padding: '0 50px' }}>
                    {/* Previous Button */}
                    {totalPages > 1 && currentPage > 0 && (
                        <button
                            onClick={goToPrevPage}
                            style={{
                                position: 'absolute',
                                left: '0',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                background: 'white',
                                border: `2px solid ${logoColors.primary}`,
                                color: logoColors.primary,
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                fontSize: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: `0 4px 12px ${logoColors.primary}30`
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = logoColors.primary;
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = logoColors.primary;
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                            }}
                        >
                            <FaArrowLeft />
                        </button>
                    )}

                    {/* Next Button */}
                    {totalPages > 1 && currentPage < totalPages - 1 && (
                        <button
                            onClick={goToNextPage}
                            style={{
                                position: 'absolute',
                                right: '0',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                background: 'white',
                                border: `2px solid ${logoColors.primary}`,
                                color: logoColors.primary,
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                fontSize: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: `0 4px 12px ${logoColors.primary}30`
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = logoColors.primary;
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = logoColors.primary;
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                            }}
                        >
                            <FaArrowRight />
                        </button>
                    )}

                    {/* Bundles Grid */}
                    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                        {visibleBundles.map((bundle) => (
                            <Col key={bundle._id}>
                                <Card
                                    className="product-card h-100 border-0"
                                    onClick={() => handleBundleClick(bundle._id)}
                                    style={{
                                        background: 'white',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                        cursor: 'pointer',
                                        height: '100%'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = `0 8px 20px ${logoColors.primary}30`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                                    }}
                                >
                                    <div className="product-image-container" style={{ position: 'relative' }}>
                                        {/* Product Images Collage */}
                                        <div style={{
                                            height: '180px',
                                            display: 'flex',
                                            padding: '0.5rem',
                                            gap: '2px',
                                            backgroundColor: '#f8f9fa'
                                        }}>
                                            {bundle.products?.slice(0, 4).map((product, idx) => (
                                                <div
                                                    key={idx}
                                                    style={{
                                                        flex: 1,
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    <img
                                                        src={getProductImage(product)}
                                                        alt={product.name}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                        }}
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder.jpg';
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Discount Badge */}
                                        {bundle.originalPrice > bundle.bundlePrice && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '10px',
                                                left: '10px',
                                                background: logoColors.gradient,
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                zIndex: 1
                                            }}>
                                                {Math.round(100 - (bundle.bundlePrice / bundle.originalPrice) * 100)}% OFF
                                            </div>
                                        )}

                                        {/* Bundle Badge */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            background: logoColors.primary,
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            zIndex: 1
                                        }}>
                                            Bundle
                                        </div>
                                    </div>

                                    <Card.Body className="d-flex flex-column" style={{ padding: '1rem' }}>
                                        <Card.Title style={{
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            color: '#2D3748',
                                            marginBottom: '0.25rem'
                                        }}>
                                            {bundle.name}
                                        </Card.Title>

                                        <div className="d-flex flex-wrap gap-1 mb-2">
                                            <span style={{
                                                background: logoColors.softGradient,
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontSize: '0.65rem',
                                                color: logoColors.primary
                                            }}>
                                                {bundle.products?.length || 0} Products
                                            </span>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div className="price">
                                                    {bundle.originalPrice > bundle.bundlePrice && (
                                                        <span className="original-price text-muted text-decoration-line-through me-2" style={{ fontSize: '0.75rem' }}>
                                                            Rs. {bundle.originalPrice?.toLocaleString()}
                                                        </span>
                                                    )}
                                                    <span className="current-price fw-bold" style={{ color: logoColors.primary, fontSize: '1rem' }}>
                                                        Rs. {bundle.bundlePrice?.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="d-flex gap-2">
                                                <button
                                                    onClick={(e) => handleAddBundleToCart(e, bundle)}
                                                    className="btn w-50"
                                                    style={{
                                                        background: 'white',
                                                        border: `1px solid ${logoColors.primary}`,
                                                        color: logoColors.primary,
                                                        padding: '0.4rem',
                                                        borderRadius: '6px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.background = logoColors.primary;
                                                        e.target.style.color = 'white';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.background = 'white';
                                                        e.target.style.color = logoColors.primary;
                                                    }}
                                                >
                                                    <FaShoppingCart className="me-1" size={10} />
                                                    Cart
                                                </button>
                                                <button
                                                    onClick={(e) => handleBuyNow(e, bundle)}
                                                    className="btn w-50"
                                                    style={{
                                                        background: logoColors.gradient,
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '0.4rem',
                                                        borderRadius: '6px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.opacity = '0.9';
                                                        e.target.style.transform = 'translateY(-1px)';
                                                        e.target.style.boxShadow = `0 4px 8px ${logoColors.primary}40`;
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.opacity = '1';
                                                        e.target.style.transform = 'translateY(0)';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    Buy Now
                                                </button>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Pagination Dots */}
                {totalPages > 1 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px',
                        marginTop: '2rem'
                    }}>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index)}
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: index === currentPage ? logoColors.primary : '#ddd',
                                    cursor: 'pointer',
                                    padding: 0,
                                    transition: 'all 0.3s ease',
                                    transform: index === currentPage ? 'scale(1.2)' : 'scale(1)'
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* View All Button */}
                {bundles.length > 0 && (
                    <div className="text-center mt-4">
                        <button
                            onClick={() => navigate('/bundles')}
                            style={{
                                background: 'transparent',
                                border: `2px solid ${logoColors.primary}`,
                                color: logoColors.primary,
                                padding: '0.6rem 2rem',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = logoColors.primary;
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = logoColors.primary;
                            }}
                        >
                            View All Bundles
                        </button>
                    </div>
                )}
            </Container>
        </div>
    );
}