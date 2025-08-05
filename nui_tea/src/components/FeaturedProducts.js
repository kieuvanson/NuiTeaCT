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
        // Kiểm tra nếu chưa đăng nhập
        if (!user) {
            alert('Vui lòng đăng nhập để đặt hàng!');
            setShowLogin(true);
            return;
        }

        setSelectedProduct(product);
        setShowOption(true);
    };
    const handleCloseOption = () => {
        setShowOption(false);
        setSelectedProduct(null);
    };

    // Chia sản phẩm thành 2 hàng, mỗi hàng 4 sản phẩm
    // Lọc bỏ sản phẩm hết hàng
    const availableProducts = products.filter(p => p.isSoldOut !== true);
    const productsToShow = availableProducts.slice(0, 8);
    const productsTop = productsToShow.slice(0, 4);
    const productsBottom = productsToShow.slice(4, 8);

    return (
        <section className="featured-section">
            <h2 className="featured-title">Sản phẩm nổi bật</h2>
            <div className="featured-list" style={{ marginBottom: 20 }}>
                {productsTop.map(product => (
                    <div
                        className={`product-card${showOption ? ' modal-open' : ''}`}
                        key={product.id}
                        style={showOption ? { pointerEvents: 'none', filter: 'grayscale(0.2) opacity(0.7)' } : {}}
                    >
                        {product.isBestSeller && (
                            <div className="product-badge">Best Seller</div>
                        )}
                        {product.isSoldOut && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: 16,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10
                            }}>
                                <div style={{
                                    background: '#e74c3c',
                                    color: '#fff',
                                    fontWeight: 800,
                                    borderRadius: 10,
                                    padding: '6px 16px',
                                    fontSize: 16,
                                    boxShadow: '0 2px 8px rgba(231, 76, 60, 0.3)',
                                    transform: 'rotate(-8deg)',
                                    letterSpacing: 1
                                }}>
                                    HẾT HÀNG
                                </div>
                            </div>
                        )}
                        <img className="product-image" src={product.image} alt={product.name} />
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-desc">{product.description}</p>
                            <div className="product-price">
                                {product.price?.toLocaleString()}đ
                            </div>
                            <button
                                className="order-btn"
                                onClick={() => handleShowOption(product)}
                                disabled={showOption || product.isSoldOut}
                                style={{
                                    background: product.isSoldOut ? '#ccc' : undefined,
                                    color: product.isSoldOut ? '#666' : undefined,
                                    cursor: product.isSoldOut ? 'not-allowed' : undefined
                                }}
                            >
                                {product.isSoldOut ? 'Hết hàng' : 'Đặt ngay'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="featured-list" style={{ marginBottom: 20 }}>
                {productsBottom.map(product => (
                    <div
                        className={`product-card${showOption ? ' modal-open' : ''}`}
                        key={product.id}
                        style={showOption ? { pointerEvents: 'none', filter: 'grayscale(0.2) opacity(0.7)' } : {}}
                    >
                        {product.isBestSeller && (
                            <div className="product-badge">Best Seller</div>
                        )}
                        {product.isSoldOut && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: 16,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10
                            }}>
                                <div style={{
                                    background: '#e74c3c',
                                    color: '#fff',
                                    fontWeight: 800,
                                    borderRadius: 10,
                                    padding: '6px 16px',
                                    fontSize: 16,
                                    boxShadow: '0 2px 8px rgba(231, 76, 60, 0.3)',
                                    transform: 'rotate(-8deg)',
                                    letterSpacing: 1
                                }}>
                                    HẾT HÀNG
                                </div>
                            </div>
                        )}
                        <img className="product-image" src={product.image} alt={product.name} />
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-desc">{product.description}</p>
                            <div className="product-price">
                                {product.price?.toLocaleString()}đ
                            </div>
                            <button
                                className="order-btn"
                                onClick={() => handleShowOption(product)}
                                disabled={showOption || product.isSoldOut}
                                style={{
                                    background: product.isSoldOut ? '#ccc' : undefined,
                                    color: product.isSoldOut ? '#666' : undefined,
                                    cursor: product.isSoldOut ? 'not-allowed' : undefined
                                }}
                            >
                                {product.isSoldOut ? 'Hết hàng' : 'Đặt ngay'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {products.length > 8 && (
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <button
                        onClick={() => navigate('/menu')}
                        style={{
                            background: 'linear-gradient(90deg, #4CAF50, #45a049)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 25,
                            padding: '12px 30px',
                            fontSize: 16,
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                        }}
                    >
                        Xem thêm
                    </button>
                </div>
            )}
            <ProductOptionModal
                product={selectedProduct}
                open={showOption}
                onClose={handleCloseOption}
                onConfirm={itemWithOptions => {
                    addItem(itemWithOptions);
                    handleCloseOption();
                }}
            />
        </section>
    );
} 