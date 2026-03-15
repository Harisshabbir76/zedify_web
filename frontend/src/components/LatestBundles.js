import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';
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

                <div className="product-scroll-container">
                    <Row className="flex-nowrap flex-md-wrap g-3 pb-3 pb-md-0" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        {bundles.map(bundle => (
                            <Col key={bundle._id} xs={9} sm={6} md={4} lg={3} className="mb-4 flex-shrink-0 flex-md-shrink-1">
                            <Card
                                className="product-card h-100 border-0"

                                onClick={() => {
                                  handleBundleClick(bundle._id);
                                  // Order Now - pass bundle to checkout
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
                                }}

                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    cursor: 'pointer'
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
                                <div className="position-relative">
                                    <div style={{
                                        height: '180px',
                                        display: 'flex',
                                        padding: '0.5rem',
                                        gap: '0.25rem',
                                        overflow: 'hidden'
                                    }}>
                                        {bundle.image ? (
                                            <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden' }}>
                                                <img 
                                                    src={bundle.image.startsWith('http') ? bundle.image : `${process.env.REACT_APP_API_URL}${bundle.image.startsWith('/') ? '' : '/'}${bundle.image}`}
                                                    alt={bundle.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                        ) : (
                                            bundle.products?.slice(0, 4).map((product, idx) => (
                                                <div
                                                    key={idx}
                                                    style={{
                                                        flex: 1,
                                                        borderRadius: '8px',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <img
                                                        src={getProductImage(product)}
                                                        alt={product.name}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    {bundle.originalPrice > bundle.bundlePrice && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            left: '10px',
                                            background: logoColors.gradient,
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            zIndex: 1
                                        }}>
                                            {Math.round(100 - (bundle.bundlePrice / bundle.originalPrice) * 100)}% OFF
                                        </div>
                                    )}
                                </div>
                                <Card.Body className="d-flex flex-column" style={{ padding: '1rem' }}>
                                    <Card.Title className="mb-2" style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: '#2D3748',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {bundle.name}
                                    </Card.Title>
                                    <Card.Text className="text-muted" style={{
                                        fontSize: '0.8rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {bundle.products?.length} products
                                    </Card.Text>
                                    <div className="mt-auto">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <div className="price">
                                                {bundle.originalPrice > bundle.bundlePrice && (
                                                    <span className="original-price text-muted text-decoration-line-through me-2" style={{ fontSize: '0.8rem' }}>
                                                        Rs. {bundle.originalPrice?.toLocaleString()}
                                                    </span>
                                                )}
                                                <span className="current-price fw-bold" style={{ color: logoColors.primary, fontSize: '1.1rem' }}>
                                                    Rs. {bundle.bundlePrice?.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => handleAddBundleToCart(e, bundle)}
                                            className="btn w-100 mt-2 mb-1"
                                            style={{
                                                background: 'white',
                                                color: logoColors.primary,
                                                border: `2px solid ${logoColors.primary}`,
                                                padding: '0.6rem',
                                                borderRadius: '8px',
                                                fontSize: '0.85rem',
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
                                            <FaShoppingCart className="me-2" />
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={() => {
                                              // Order Now checkout
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
                                            }}
                                            className="btn w-100"
                                            style={{
                                                background: logoColors.gradient,
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.6rem',
                                                borderRadius: '8px',
                                                fontSize: '0.85rem',
                                                fontWeight: '500',
                                                cursor: 'pointer',
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
                                        </button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                    </Row>
                </div>
                <style>{`
                    @media (max-width: 768px) {
                        .product-scroll-container {
                            margin-right: -15px;
                            margin-left: -15px;
                            padding-right: 15px;
                            padding-left: 15px;
                        }
                        .product-scroll-container .row::-webkit-scrollbar {
                            display: none;
                        }
                        .product-scroll-container .row {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    }
                    @media (min-width: 769px) {
                        .product-scroll-container .row {
                            overflow-x: visible !important;
                        }
                    }
                `}</style>

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

