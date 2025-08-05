import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';

export default function ProductCard({ product }) {
    const { addItem } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleAddToCart = () => {
        setIsAdding(true);
        addItem(product);

        // Show success animation
        setTimeout(() => {
            setIsAdding(false);
        }, 1000);
    };

    return (
        <div
            style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-8px)';
                e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            }}
        >
            {/* Product Image */}
            <div
                style={{
                    width: '100%',
                    height: '200px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #b8860b, #e5d3b3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '64px',
                    marginBottom: '16px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <span style={{ zIndex: 1 }}>{product.emoji || '🍵'}</span>
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                        transform: 'translateX(-100%)',
                        transition: 'transform 0.6s ease'
                    }}
                    className="product-shine"
                />
            </div>

            {/* Product Info */}
            <div style={{ marginBottom: '16px' }}>
                <h3
                    style={{
                        margin: '0 0 8px 0',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#333',
                        lineHeight: '1.3'
                    }}
                >
                    {product.name}
                </h3>
                <p
                    style={{
                        margin: '0 0 12px 0',
                        color: '#666',
                        fontSize: '0.9rem',
                        lineHeight: '1.4',
                        minHeight: '40px'
                    }}
                >
                    {product.description}
                </p>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px'
                    }}
                >
                    <span
                        style={{
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            color: '#b8860b'
                        }}
                    >
                        {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span
                            style={{
                                fontSize: '0.9rem',
                                color: '#999',
                                textDecoration: 'line-through'
                            }}
                        >
                            {formatPrice(product.originalPrice)}
                        </span>
                    )}
                </div>
            </div>

            {/* Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                disabled={isAdding}
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    background: isAdding
                        ? '#28a745'
                        : 'linear-gradient(135deg, #b8860b, #e5d3b3)',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: isAdding ? 'default' : 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                    if (!isAdding) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(184, 134, 11, 0.3)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isAdding) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                    }
                }}
            >
                {isAdding ? (
                    <>
                        <span style={{ opacity: 0 }}>Thêm vào giỏ</span>
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <div
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid #fff',
                                    borderTop: '2px solid transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}
                            />
                            <span>Đã thêm!</span>
                        </div>
                    </>
                ) : (
                    '🛒 Thêm vào giỏ'
                )}
            </button>

            {/* Badge for special items */}
            {product.badge && (
                <div
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: product.badge.color || '#ff4757',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        zIndex: 2
                    }}
                >
                    {product.badge.text}
                </div>
            )}

            <style jsx>{`
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .product-shine:hover {
          transform: translateX(100%);
        }
      `}</style>
        </div>
    );
} 