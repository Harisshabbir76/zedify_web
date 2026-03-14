import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

// Navbar color palette
const logoColors = {
    primary: '#fe7e8b', // Navbar primary color
    secondary: '#e65c70', // Navbar secondary color
    light: '#ffd1d4', // Navbar light color
    background: '#fff5f6', // Super light - almost white
    gradient: 'linear-gradient(135deg, #fe7e8b 0%, #e65c70 100%)', // Navbar gradient
};

export default function TopRatedProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopRatedProducts = async () => {
            try {
                setLoading(true);
                // Fetch all products from catalog
                const prodRes = await axios.get(`${process.env.REACT_APP_API_URL}/catalog`);
                let allProducts = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data?.data || prodRes.data?.products || [];
                
                // Sort by rating (highest first) and take top 6
                const sortedProducts = allProducts
                    .filter(p => p.averageRating > 0)
                    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
                    .slice(0, 6);
                
                setProducts(sortedProducts);
            } catch (err) {
                console.error('Error fetching top rated products:', err);
                setError('Failed to load top rated products.');
            } finally {
                setLoading(false);
            }
        };

        fetchTopRatedProducts();
    }, []);

    const handleProductClick = (product) => {
        navigate(`/catalog/${product._id}`);
    };


    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        addToCart(product, 1);
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

    // If no products, return nothing
    if (products.length === 0) return null;

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
                        Top <span style={{ color: logoColors.primary }}>Products</span>
                    </h2>
                    <p style={{ color: '#718096', fontSize: '1rem' }}>
                        Our most highly rated products by customers
                    </p>
                </div>

                <Row className="g-4">
                    {products.map(product => (
                        <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                            <Card
                                className="product-card h-100 border-0"
                                onClick={() => handleProductClick(product)}

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
                                    <Card.Img
                                        variant="top"
                                        src={getProductImage(product)}
                                        alt={product.name}
                                        style={{ height: '250px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'scale(1)';
                                        }}
                                    />
                                    {product.discountedPrice < product.originalPrice && (
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
                                            {Math.round(100 - (product.discountedPrice / product.originalPrice) * 100)}% OFF
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            padding: '4px 8px',
                                            fontSize: '0.7rem',
                                            zIndex: 1,
                                            background: product.stock > 0 ? logoColors.primary : '#dc3545',
                                            border: 'none',
                                            borderRadius: '4px',
                                            color: 'white'
                                        }}
                                    >
                                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </div>
                                    {product.averageRating > 0 && (
                                        <div
                                            className="position-absolute bottom-0 start-0 m-2 bg-white px-2 py-1 rounded-pill"
                                            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                                        >
                                            <FaStar className="me-1" style={{ color: '#FFD700' }} />
                                            <span className="fw-bold fs-6">{product.averageRating.toFixed(1)}</span>
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
                                        {product.name}
                                    </Card.Title>
                                    <Card.Text className="text-muted" style={{
                                        fontSize: '0.85rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {typeof product.category === 'object' ? product.category.name : (product.category || 'Uncategorized')}
                                    </Card.Text>
                                    <div className="mt-auto">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <div className="price">
                                                {product.discountedPrice < product.originalPrice && (
                                                    <span className="original-price text-muted text-decoration-line-through me-2" style={{ fontSize: '0.8rem' }}>
                                                        Rs. {product.originalPrice?.toLocaleString()}
                                                    </span>
                                                )}
                                                <span className="current-price fw-bold" style={{ color: logoColors.primary, fontSize: '1.1rem' }}>
                                                    Rs. {(product.discountedPrice || product.originalPrice)?.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => handleAddToCart(e, product)}
                                            className="btn w-100 mt-2"
                                            style={{
                                                background: product.stock > 0 ? logoColors.gradient : '#e2e8f0',
                                                color: product.stock > 0 ? 'white' : '#718096',
                                                border: 'none',
                                                padding: '0.6rem',
                                                borderRadius: '8px',
                                                fontSize: '0.9rem',
                                                fontWeight: '500',
                                                cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                                                transition: 'all 0.3s ease'
                                            }}
                                            disabled={product.stock <= 0}
                                            onMouseEnter={(e) => {
                                                if (product.stock > 0) {
                                                    e.target.style.opacity = '0.9';
                                                    e.target.style.transform = 'translateY(-2px)';
                                                    e.target.style.boxShadow = `0 4px 12px ${logoColors.primary}40`;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (product.stock > 0) {
                                                    e.target.style.opacity = '1';
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = 'none';
                                                }
                                            }}
                                        >
                                            <FaShoppingCart className="me-2" />
                                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}

