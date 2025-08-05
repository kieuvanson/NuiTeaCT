import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MenuBar from './components/MenuBar';

export default function OrderStatusPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Lấy dữ liệu đơn hàng từ localStorage
        const savedOrder = localStorage.getItem('currentOrder');
        console.log('Saved order from localStorage:', savedOrder);
        console.log('Current orderId from URL:', orderId);

        if (savedOrder) {
            try {
                const orderData = JSON.parse(savedOrder);
                console.log('Parsed order data:', orderData);
                console.log('Comparing orderData.id:', orderData.id, 'with orderId:', orderId);

                // Kiểm tra xem có phải đơn hàng hiện tại không
                if (orderData.id.toString() === orderId || orderData.id === parseInt(orderId)) {
                    setOrder(orderData);
                    setLoading(false);
                } else {
                    console.log('Order ID mismatch. Expected:', orderId, 'Found:', orderData.id);
                    setError('Không tìm thấy thông tin đơn hàng');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error parsing order data:', error);
                setError('Lỗi đọc dữ liệu đơn hàng');
                setLoading(false);
            }
        } else {
            console.log('No saved order found in localStorage');
            setError('Không tìm thấy thông tin đơn hàng');
            setLoading(false);
        }
    }, [orderId]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Đã đặt hàng': return '#2196F3';
            case 'Đang chuẩn bị': return '#FF9800';
            case 'Đang giao hàng': return '#9C27B0';
            case 'Đã giao hàng': return '#4CAF50';
            case 'Đã hủy': return '#F44336';
            default: return '#666';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Đã đặt hàng': return '📋';
            case 'Đang chuẩn bị': return '👨‍🍳';
            case 'Đang giao hàng': return '🚚';
            case 'Đã giao hàng': return '✅';
            case 'Đã hủy': return '❌';
            default: return '📦';
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#f6f5f3' }}>
                <MenuBar />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'calc(100vh - 80px)',
                    fontSize: 18,
                    color: '#666'
                }}>
                    Đang tải thông tin đơn hàng...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: '100vh', background: '#f6f5f3' }}>
                <MenuBar />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'calc(100vh - 80px)',
                    fontSize: 18,
                    color: '#f44336'
                }}>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f6f5f3' }}>
            <MenuBar />

            <div style={{
                maxWidth: 800,
                margin: '40px auto',
                padding: '0 20px'
            }}>
                {/* Header */}
                <div style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: 32,
                    marginBottom: 24,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16
                    }}>
                        <h1 style={{
                            color: '#b8860b',
                            fontWeight: 700,
                            fontSize: 28,
                            margin: 0
                        }}>
                            Trạng thái đơn hàng
                        </h1>
                        <div style={{
                            background: '#f0e6d3',
                            padding: '8px 16px',
                            borderRadius: 20,
                            fontSize: 14,
                            fontWeight: 600,
                            color: '#b8860b'
                        }}>
                            {order.orderNumber}
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 8
                    }}>
                        <span style={{ fontSize: 24 }}>
                            {getStatusIcon(order.orderStatus)}
                        </span>
                        <span style={{
                            fontSize: 20,
                            fontWeight: 600,
                            color: getStatusColor(order.orderStatus)
                        }}>
                            {order.orderStatus}
                        </span>
                    </div>

                    <div style={{ color: '#666', fontSize: 14 }}>
                        Đặt hàng lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </div>
                </div>

                {/* Thông tin khách hàng */}
                <div style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: 24,
                    marginBottom: 24,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{
                        color: '#333',
                        fontWeight: 600,
                        marginBottom: 16,
                        fontSize: 18
                    }}>
                        Thông tin giao hàng
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#666' }}>Tên khách hàng:</span>
                            <span style={{ fontWeight: 600 }}>{order.customerName}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#666' }}>Số điện thoại:</span>
                            <span style={{ fontWeight: 600 }}>{order.phone}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#666' }}>Địa chỉ:</span>
                            <span style={{ fontWeight: 600 }}>{order.address}</span>
                        </div>
                    </div>
                </div>

                {/* Sản phẩm đã đặt */}
                <div style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: 24,
                    marginBottom: 24,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{
                        color: '#333',
                        fontWeight: 600,
                        marginBottom: 16,
                        fontSize: 18
                    }}>
                        Sản phẩm đã đặt
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {order.items.map((item, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                gap: 16,
                                padding: '16px 0',
                                borderBottom: index < order.items.length - 1 ? '1px solid #eee' : 'none'
                            }}>
                                <div style={{
                                    width: 60,
                                    height: 60,
                                    background: '#f8f8f8',
                                    borderRadius: 8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 24,
                                    overflow: 'hidden'
                                }}>
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

                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontWeight: 600,
                                        fontSize: 16,
                                        marginBottom: 4
                                    }}>
                                        {item.name}
                                    </div>
                                    <div style={{
                                        fontSize: 14,
                                        color: '#666',
                                        marginBottom: 4
                                    }}>
                                        {item.options?.size ? `${item.options.size} | ` : ''}
                                        {item.options?.type ? `${item.options.type === 'lanh' ? 'Lạnh' : 'Nóng'} | ` : ''}
                                        {item.options?.sugar ? `${item.options.sugar}` : ''}
                                    </div>
                                    {item.options?.toppings && item.options.toppings.length > 0 && (
                                        <div style={{
                                            fontSize: 13,
                                            color: '#b8860b'
                                        }}>
                                            Topping: {item.options.toppings.join(', ')}
                                        </div>
                                    )}
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        fontWeight: 600,
                                        color: '#b8860b',
                                        fontSize: 16
                                    }}>
                                        {item.price.toLocaleString()}đ
                                    </div>
                                    <div style={{
                                        fontSize: 14,
                                        color: '#666'
                                    }}>
                                        x{item.quantity}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Thông tin thanh toán */}
                <div style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: 24,
                    marginBottom: 24,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{
                        color: '#333',
                        fontWeight: 600,
                        marginBottom: 16,
                        fontSize: 18
                    }}>
                        Thông tin thanh toán
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#666' }}>Phương thức thanh toán:</span>
                            <span style={{ fontWeight: 600 }}>{order.paymentMethod}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#666' }}>Trạng thái thanh toán:</span>
                            <span style={{
                                fontWeight: 600,
                                color: order.paymentStatus === 'Đã thanh toán' ? '#4CAF50' : '#FF9800'
                            }}>
                                {order.paymentStatus}
                            </span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingTop: 12,
                            borderTop: '1px solid #eee',
                            fontSize: 18,
                            fontWeight: 700,
                            color: '#b8860b'
                        }}>
                            <span>Tổng cộng:</span>
                            <span>{order.totalAmount.toLocaleString()}đ</span>
                        </div>
                    </div>
                </div>

                {/* Thời gian dự kiến */}
                <div style={{
                    background: '#e8f5e8',
                    borderRadius: 16,
                    padding: 24,
                    marginBottom: 24,
                    border: '1px solid #4CAF50'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 8
                    }}>
                        <span style={{ fontSize: 24 }}>⏰</span>
                        <span style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: '#2e7d32'
                        }}>
                            Thời gian dự kiến giao hàng
                        </span>
                    </div>
                    <div style={{
                        fontSize: 16,
                        color: '#2e7d32',
                        fontWeight: 600
                    }}>
                        {new Date(order.estimatedDelivery).toLocaleString('vi-VN')}
                    </div>
                </div>

                {/* Nút hành động */}
                <div style={{
                    display: 'flex',
                    gap: 16,
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '12px 24px',
                            background: '#b8860b',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: 16
                        }}
                    >
                        Về trang chủ
                    </button>
                    <button
                        onClick={() => navigate('/menu')}
                        style={{
                            padding: '12px 24px',
                            background: '#fff',
                            color: '#b8860b',
                            border: '2px solid #b8860b',
                            borderRadius: 8,
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: 16
                        }}
                    >
                        Đặt thêm
                    </button>
                </div>
            </div>
        </div>
    );
} 