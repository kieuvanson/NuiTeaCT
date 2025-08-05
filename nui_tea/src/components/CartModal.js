/* eslint-disable */
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import OrderHistory from './OrderHistory';

export default function CartModal({ isOpen, onClose, user, setShowLogin }) {
    const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [showOrderHistory, setShowOrderHistory] = useState(false);
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Hàm tính giá topping
    const calculateToppingPrice = (toppings) => {
        if (!toppings || toppings.length === 0) return 0;

        const toppingPrices = {
            'tran-chau-den': 7000,
            'thach-dua': 5000,
            'pudding-trung': 6000,
            'kem-cheese': 8000,
            'thach-trai-cay': 5000,
            'thach-dao': 5000
        };

        return toppings.reduce((total, topping) => {
            return total + (toppingPrices[topping] || 0);
        }, 0);
    };

    // Hàm tính tổng giá cho một item
    const calculateItemTotal = (item) => {
        const basePrice = item.price || 0;
        const toppingPrice = calculateToppingPrice(item.options?.toppings);
        return (basePrice + toppingPrice) * item.quantity;
    };

    // Hàm tính tổng giá giỏ hàng
    const calculateCartTotal = () => {
        return items.reduce((total, item) => {
            return total + calculateItemTotal(item);
        }, 0);
    };

    const handleGoToCheckout = () => {
        // Kiểm tra nếu chưa đăng nhập
        if (!user) {
            // Hiển thị thông báo đẹp hơn thay vì alert
            const shouldLogin = window.confirm('Bạn cần đăng nhập để tiếp tục đặt hàng. Bạn có muốn đăng nhập ngay bây giờ không?');
            if (shouldLogin) {
                onClose(); // Đóng cart modal
                setTimeout(() => setShowLogin(true), 300); // Mở modal đăng nhập sau khi đóng cart
            }
            return;
        }

        onClose();
        setTimeout(() => navigate('/checkout'), 200); // Đợi modal đóng rồi mới chuyển trang
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '500px',
                    maxHeight: '80vh',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    animation: 'cart-modal-slide-in 0.3s ease-out'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '20px 24px',
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'linear-gradient(135deg, #b8860b, #e5d3b3)',
                        color: '#fff'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                            🛒 Giỏ hàng ({items.length} sản phẩm)
                        </h2>
                        <button
                            onClick={() => {
                                if (!user) {
                                    alert('Vui lòng đăng nhập để xem lịch sử đơn hàng');
                                    onClose(); // Đóng cart modal
                                    return;
                                }
                                setShowOrderHistory(true);
                            }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                color: '#fff',
                                fontSize: '12px',
                                cursor: 'pointer',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontWeight: '600',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                        >
                            📋 Lịch sử
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                        ×
                    </button>
                </div>

                {/* Cart Items */}
                <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '0' }}>
                    {items.length === 0 ? (
                        <div
                            style={{
                                padding: '40px 24px',
                                textAlign: 'center',
                                color: '#666'
                            }}
                        >
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
                            <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>Giỏ hàng trống</h3>
                            <p style={{ margin: 0 }}>Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm!</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    padding: '16px 24px',
                                    borderBottom: '1px solid #f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                            >
                                {/* Product Image */}
                                <div
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '8px',
                                        background: item.image ? 'transparent' : 'linear-gradient(135deg, #b8860b, #e5d3b3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontSize: '24px',
                                        flexShrink: 0,
                                        overflow: 'hidden'
                                    }}
                                >
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : (
                                        item.emoji || '🍵'
                                    )}
                                </div>

                                {/* Product Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#333' }}>
                                        {item.name}
                                    </h4>
                                    <p style={{ margin: 0, color: '#b8860b', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        {formatPrice(calculateItemTotal(item) / item.quantity)}
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        flexShrink: 0
                                    }}
                                >
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            border: '1px solid #ddd',
                                            background: '#fff',
                                            color: '#666',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '18px',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#f0f0f0';
                                            e.target.style.borderColor = '#b8860b';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = '#fff';
                                            e.target.style.borderColor = '#ddd';
                                        }}
                                    >
                                        -
                                    </button>
                                    <span
                                        style={{
                                            minWidth: '32px',
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            border: '1px solid #ddd',
                                            background: '#fff',
                                            color: '#666',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '18px',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#f0f0f0';
                                            e.target.style.borderColor = '#b8860b';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = '#fff';
                                            e.target.style.borderColor = '#ddd';
                                        }}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeItem(item.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#ff4757',
                                        cursor: 'pointer',
                                        padding: '8px',
                                        borderRadius: '50%',
                                        transition: 'background 0.2s',
                                        flexShrink: 0
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#fff5f5'}
                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div
                        style={{
                            padding: '20px 24px',
                            borderTop: '1px solid #eee',
                            background: '#f8f9fa'
                        }}
                    >
                        {/* Total */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '16px',
                                padding: '12px 0',
                                borderBottom: '1px solid #eee'
                            }}
                        >
                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>
                                Tổng cộng:
                            </span>
                            <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#b8860b' }}>
                                {formatPrice(calculateCartTotal())}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        {!user && (
                            <div style={{
                                background: '#fff3cd',
                                border: '1px solid #ffeaa7',
                                borderRadius: '8px',
                                padding: '12px',
                                marginBottom: '16px',
                                color: '#856404',
                                fontSize: '14px',
                                textAlign: 'center'
                            }}>
                                ⚠️ Bạn cần đăng nhập để tiếp tục đặt hàng
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={clearCart}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    background: '#fff',
                                    color: '#666',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = '#f0f0f0';
                                    e.target.style.borderColor = '#999';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = '#fff';
                                    e.target.style.borderColor = '#ddd';
                                }}
                            >
                                Xóa giỏ hàng
                            </button>
                            <button
                                onClick={handleGoToCheckout}
                                disabled={isCheckingOut}
                                style={{
                                    flex: 2,
                                    padding: '12px',
                                    border: 'none',
                                    background: isCheckingOut
                                        ? '#ccc'
                                        : !user
                                            ? '#ff6b6b'
                                            : 'linear-gradient(135deg, #b8860b, #e5d3b3)',
                                    color: '#fff',
                                    borderRadius: '8px',
                                    cursor: isCheckingOut ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isCheckingOut) {
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(184, 134, 11, 0.3)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isCheckingOut) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                {!user ? 'Đăng nhập để đặt hàng' : 'Đặt hàng ngay'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes cart-modal-slide-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>

            {/* Order History Modal */}
            {showOrderHistory && (
                <OrderHistory onClose={() => setShowOrderHistory(false)} user={user} />
            )}
        </div>
    );
} 