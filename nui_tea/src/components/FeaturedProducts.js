import React, { useState } from 'react';
import '../App.css';
import ProductOptionModal from './ProductOptionModal';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export default function FeaturedProducts({ products, user, setShowLogin }) {
    const [showOption, setShowOption] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addItem } = useCart();
    const navigate = useNavigate();

    const handleShowOption = (product) => {
        console.log('Button clicked for product:', product.name);
        console.log('User:', user);
        
        // Kiểm tra nếu chưa đăng nhập
        if (!user) {
            alert('Vui lòng đăng nhập để đặt hàng!');
            setShowLogin(true);
            return;
        }

        console.log('Setting selected product and showing modal');
        setSelectedProduct(product);
        setShowOption(true);
    };
    const handleCloseOption = () => {
        setShowOption(false);
        setSelectedProduct(null);
    };

    // Lọc bỏ sản phẩm hết hàng và lấy 9 sản phẩm đầu tiên
    const availableProducts = products.filter(p => p.isSoldOut !== true);
    const productsToShow = availableProducts.slice(0, 9);

    // Debug: Log số lượng sản phẩm
    console.log('Total products:', products.length);
    console.log('Available products:', availableProducts.length);
    console.log('Products to show:', productsToShow.length);

    return (
        <section className="featured-section">
            <h2 className="featured-title">Sản phẩm nổi bật ({productsToShow.length}/9)</h2>
            <div className="featured-products-grid">
                {productsToShow.map(product => (
                    <div
                        key={product.id}
                        className="featured-product-card"
                        style={{
                            background: '#fff',
                            borderRadius: 22,
                            boxShadow: '0 6px 32px #b8860b22',
                            padding: 28,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'relative',
                            height: 420,
                            width: '100%',
                            maxWidth: 320,
                            transition: 'transform 0.18s, box-shadow 0.18s',
                            cursor: 'pointer',
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
                            e.currentTarget.style.boxShadow = '0 12px 40px #b8860b33';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = '0 6px 32px #b8860b22';
                        }}
                    >
                        {product.isBestSeller && (
                            <div className="best-seller-badge" style={{
                                position: 'absolute',
                                top: 16,
                                left: 16,
                                background: '#ff9800',
                                color: '#fff',
                                fontWeight: 700,
                                borderRadius: 10,
                                padding: '3px 14px',
                                fontSize: 15,
                                boxShadow: '0 2px 8px #ff980033'
                            }}>
                                Best Seller
                            </div>
                        )}
                        {product.isSoldOut && (
                            <div className="sold-out-overlay" style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: 22,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10
                            }}>
                                <div className="sold-out-badge" style={{
                                    background: '#e74c3c',
                                    color: '#fff',
                                    fontWeight: 800,
                                    borderRadius: 12,
                                    padding: '8px 20px',
                                    fontSize: 18,
                                    boxShadow: '0 2px 8px rgba(231, 76, 60, 0.3)',
                                    transform: 'rotate(-8deg)',
                                    letterSpacing: 1
                                }}>
                                    HẾT HÀNG
                                </div>
                            </div>
                        )}
                        <img
                            src={product.image}
                            alt={product.name}
                            className="featured-product-image"
                            style={{
                                width: 140,
                                height: 140,
                                objectFit: 'cover',
                                borderRadius: 16,
                                marginBottom: 18,
                                boxShadow: '0 2px 12px #b8860b22'
                            }}
                        />
                        <div className="featured-product-name" style={{
                            fontWeight: 800,
                            fontSize: 20,
                            color: '#7c4d03',
                            textAlign: 'center',
                            marginBottom: 8,
                            height: 60,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {product.name}
                        </div>
                        <div className="featured-product-description" style={{
                            color: '#666',
                            fontSize: 14,
                            textAlign: 'center',
                            marginBottom: 8,
                            lineHeight: 1.4,
                            height: 60,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {product.description}
                        </div>
                        <div className="featured-product-price" style={{
                            color: '#b8860b',
                            fontWeight: 800,
                            fontSize: 18,
                            marginBottom: 12,
                            height: 30,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {product.price?.toLocaleString()}đ
                        </div>
                        <button
                            className="featured-product-button"
                            style={{
                                background: product.isSoldOut ? '#ccc' : 'linear-gradient(90deg,#b8860b,#e5d3b3)',
                                color: product.isSoldOut ? '#666' : '#fff',
                                border: 'none',
                                borderRadius: 12,
                                padding: '13px 0',
                                fontWeight: 600,
                                fontSize: 18,
                                width: '100%',
                                marginTop: 10,
                                cursor: product.isSoldOut ? 'not-allowed' : 'pointer',
                                boxShadow: '0 2px 8px #b8860b33',
                                letterSpacing: 1,
                                transition: 'background 0.18s, box-shadow 0.18s',
                                fontFamily: 'Segoe UI, Arial, sans-serif',
                            }}
                            disabled={product.isSoldOut}
                            onMouseOver={e => {
                                if (!product.isSoldOut) {
                                    e.currentTarget.style.background = '#b8860b';
                                    e.currentTarget.style.boxShadow = '0 4px 18px #b8860b33';
                                }
                            }}
                            onMouseOut={e => {
                                if (!product.isSoldOut) {
                                    e.currentTarget.style.background = 'linear-gradient(90deg,#b8860b,#e5d3b3)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px #b8860b33';
                                }
                            }}
                            onClick={() => handleShowOption(product)}
                        >
                            {product.isSoldOut ? 'Hết hàng' : 'Đặt ngay'}
                        </button>
                    </div>
                ))}
            </div>

            <ProductOptionModal
                isOpen={showOption}
                onClose={handleCloseOption}
                product={selectedProduct}
                onAddToCart={addItem}
                user={user}
            />
            
            {/* Debug info */}
            <div style={{ 
                position: 'fixed', 
                top: '10px', 
                right: '10px', 
                background: 'rgba(0,0,0,0.8)', 
                color: 'white', 
                padding: '10px', 
                borderRadius: '5px',
                fontSize: '12px',
                zIndex: 10000
            }}>
                Modal Open: {showOption ? 'Yes' : 'No'}<br/>
                Selected Product: {selectedProduct?.name || 'None'}<br/>
                User: {user ? 'Logged in' : 'Not logged in'}
            </div>
        </section>
    );
} 