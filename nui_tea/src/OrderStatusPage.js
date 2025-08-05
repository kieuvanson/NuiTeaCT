import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MenuBar from './components/MenuBar';

export default function OrderStatusPage({ user, setUser, setPage, onMenuScroll, setShowLogin, setShowCart }) {
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
                    // Kiểm tra xem có đủ thông tin không
                    if (orderData.items && orderData.items.length > 0 && orderData.customerName && orderData.customerName !== 'N/A') {
                        setOrder(orderData);
                        setLoading(false);
                    } else {
                        // Nếu thiếu thông tin, thử lấy từ API
                        fetchOrderFromAPI(orderId);
                    }
                } else {
                    console.log('Order ID mismatch. Expected:', orderId, 'Found:', orderData.id);
                    fetchOrderFromAPI(orderId);
                }
            } catch (error) {
                console.error('Error parsing order data:', error);
                fetchOrderFromAPI(orderId);
            }
        } else {
            console.log('No saved order found in localStorage');
            fetchOrderFromAPI(orderId);
        }
    }, [orderId]);

    const fetchOrderFromAPI = async (orderId) => {
        try {
            console.log('Fetching order from API:', orderId);
            const response = await fetch(`http://localhost:5249/api/orders/${orderId}`);

            if (response.ok) {
                const orderData = await response.json();
                console.log('Order data from API:', orderData);

                // Lưu lại vào localStorage với đầy đủ thông tin
                localStorage.setItem('currentOrder', JSON.stringify(orderData));
                setOrder(orderData);
                setLoading(false);
            } else {
                console.log('Order not found in API');
                setError('Không tìm thấy thông tin đơn hàng');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching order from API:', error);
            setError('Lỗi kết nối server');
            setLoading(false);
        }
    };

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
            <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f5f0 0%, #faf8f3 100%)' }}>
                <MenuBar user={user} setUser={setUser} setPage={setPage} onMenuScroll={onMenuScroll} setShowLogin={setShowLogin} setShowCart={setShowCart} />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'calc(100vh - 80px)',
                    fontSize: 18,
                    color: '#a0522d'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
                        <div>Đang tải thông tin đơn hàng...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f5f0 0%, #faf8f3 100%)' }}>
                <MenuBar user={user} setUser={setUser} setPage={setPage} onMenuScroll={onMenuScroll} setShowLogin={setShowLogin} setShowCart={setShowCart} />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'calc(100vh - 80px)',
                    fontSize: 18,
                    color: '#d32f2f'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
                        <div>{error}</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f5f0 0%, #faf8f3 100%)' }}>
                <MenuBar user={user} setUser={setUser} setPage={setPage} onMenuScroll={onMenuScroll} setShowLogin={setShowLogin} setShowCart={setShowCart} />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'calc(100vh - 80px)',
                    fontSize: 18,
                    color: '#a0522d'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                        <div>Không tìm thấy thông tin đơn hàng</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f5f0 0%, #faf8f3 100%)' }}>
            <MenuBar user={user} setUser={setUser} setPage={setPage} onMenuScroll={onMenuScroll} setShowLogin={setShowLogin} setShowCart={setShowCart} />

            <div style={{
                maxWidth: 900,
                margin: '20px auto',
                padding: '100px 20px 20px 20px'
            }}>
                {/* Header tinh tế */}
                <div style={{
                    background: '#ffffff',
                    borderRadius: 20,
                    padding: '30px',
                    marginBottom: 24,
                    boxShadow: '0 4px 25px rgba(184, 134, 11, 0.15)',
                    border: '1px solid #e5d3b3'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 24,
                        flexWrap: 'wrap',
                        gap: 16
                    }}>
                        <div>
                            <h1 style={{
                                color: '#8B4513',
                                fontWeight: 700,
                                fontSize: '28px',
                                margin: '0 0 8px 0'
                            }}>
                                Chi tiết đơn hàng
                            </h1>
                            <p style={{
                                color: '#a0522d',
                                margin: 0,
                                fontSize: '14px'
                            }}>
                                Theo dõi trạng thái đơn hàng của bạn
                            </p>
                        </div>
                        <div style={{
                            background: 'linear-gradient(135deg, #b8860b, #e5d3b3)',
                            color: '#fff',
                            padding: '12px 20px',
                            borderRadius: 25,
                            fontSize: '14px',
                            fontWeight: 600,
                            boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)'
                        }}>
                            #{order.orderNumber || 'N/A'}
                        </div>
                    </div>

                    {/* Status card */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                        padding: '24px',
                        background: 'linear-gradient(135deg, #faf8f3 0%, #f5f5f0 100%)',
                        borderRadius: 16,
                        border: '1px solid #e5d3b3'
                    }}>
                        <div style={{
                            width: 70,
                            height: 70,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${getStatusColor(order.orderStatus || 'pending')}, ${getStatusColor(order.orderStatus || 'pending')}dd)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 32,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}>
                            {getStatusIcon(order.orderStatus || 'pending')}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: '22px',
                                fontWeight: 700,
                                color: getStatusColor(order.orderStatus || 'pending'),
                                marginBottom: 6
                            }}>
                                {order.orderStatus || 'Đang xử lý'}
                            </div>
                            <div style={{
                                color: '#a0522d',
                                fontSize: '14px'
                            }}>
                                Đặt hàng lúc: {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thông tin khách hàng */}
                <div style={{
                    background: '#ffffff',
                    borderRadius: 20,
                    padding: '30px',
                    marginBottom: 24,
                    boxShadow: '0 4px 25px rgba(184, 134, 11, 0.15)',
                    border: '1px solid #e5d3b3'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 24
                    }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #b8860b, #e5d3b3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 18,
                            color: '#fff'
                        }}>
                            👤
                        </div>
                        <h3 style={{
                            color: '#8B4513',
                            fontWeight: 600,
                            fontSize: '20px',
                            margin: 0
                        }}>
                            Thông tin giao hàng
                        </h3>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 20
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #faf8f3 0%, #f5f5f0 100%)',
                            padding: '20px',
                            borderRadius: 12,
                            border: '1px solid #e5d3b3'
                        }}>
                            <div style={{ color: '#a0522d', fontSize: '13px', marginBottom: 6, textTransform: 'uppercase', fontWeight: 600 }}>Tên khách hàng</div>
                            <div style={{ fontWeight: 600, color: '#8B4513', fontSize: '16px' }}>{order.customerName || 'N/A'}</div>
                        </div>
                        <div style={{
                            background: 'linear-gradient(135deg, #faf8f3 0%, #f5f5f0 100%)',
                            padding: '20px',
                            borderRadius: 12,
                            border: '1px solid #e5d3b3'
                        }}>
                            <div style={{ color: '#a0522d', fontSize: '13px', marginBottom: 6, textTransform: 'uppercase', fontWeight: 600 }}>Số điện thoại</div>
                            <div style={{ fontWeight: 600, color: '#8B4513', fontSize: '16px' }}>{order.phone || 'N/A'}</div>
                        </div>
                        <div style={{
                            background: 'linear-gradient(135deg, #faf8f3 0%, #f5f5f0 100%)',
                            padding: '20px',
                            borderRadius: 12,
                            border: '1px solid #e5d3b3',
                            gridColumn: '1 / -1'
                        }}>
                            <div style={{ color: '#a0522d', fontSize: '13px', marginBottom: 6, textTransform: 'uppercase', fontWeight: 600 }}>Địa chỉ</div>
                            <div style={{ fontWeight: 600, color: '#8B4513', fontSize: '16px' }}>{order.address || 'N/A'}</div>
                        </div>
                    </div>
                </div>

                {/* Sản phẩm đã đặt */}
                <div style={{
                    background: '#ffffff',
                    borderRadius: 20,
                    padding: '30px',
                    marginBottom: 24,
                    boxShadow: '0 4px 25px rgba(184, 134, 11, 0.15)',
                    border: '1px solid #e5d3b3'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 24
                    }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #b8860b, #e5d3b3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 18,
                            color: '#fff'
                        }}>
                            🛒
                        </div>
                        <h3 style={{
                            color: '#8B4513',
                            fontWeight: 600,
                            fontSize: '20px',
                            margin: 0
                        }}>
                            Sản phẩm đã đặt
                        </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {order.items && order.items.length > 0 ? (
                            order.items.map((item, index) => {
                                console.log('Rendering item:', item);
                                return (
                                    <div key={index} style={{
                                        background: 'linear-gradient(135deg, #faf8f3 0%, #f5f5f0 100%)',
                                        borderRadius: 16,
                                        padding: '20px',
                                        border: '1px solid #e5d3b3',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 16
                                    }}>
                                        {/* Top Row - Image and Basic Info */}
                                        <div style={{
                                            display: 'flex',
                                            gap: 16,
                                            alignItems: 'flex-start'
                                        }}>
                                            {/* Product Image */}
                                            <div style={{
                                                width: '70px',
                                                height: '70px',
                                                background: '#ffffff',
                                                borderRadius: 12,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '28px',
                                                overflow: 'hidden',
                                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                                flexShrink: 0,
                                                border: '2px solid #e9ecef'
                                            }}>
                                                {item.image || item.productImage ? (
                                                    <img
                                                        src={item.image || item.productImage}
                                                        alt={item.name || item.productName || 'Sản phẩm'}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div style={{
                                                    display: item.image || item.productImage ? 'none' : 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '100%',
                                                    height: '100%',
                                                    fontSize: '28px'
                                                }}>
                                                    {item.emoji || '🍵'}
                                                </div>
                                            </div>

                                            {/* Product Name and Price */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    fontWeight: 700,
                                                    fontSize: '16px',
                                                    marginBottom: 8,
                                                    color: '#8B4513',
                                                    lineHeight: 1.3
                                                }}>
                                                    {item.name || item.productName || 'Sản phẩm không xác định'}
                                                </div>
                                                <div style={{
                                                    fontWeight: 700,
                                                    color: '#e74c3c',
                                                    fontSize: '18px',
                                                    marginBottom: 4
                                                }}>
                                                    {item.price ? item.price.toLocaleString() : '0'}đ
                                                </div>
                                                <div style={{
                                                    fontSize: '12px',
                                                    color: '#a0522d',
                                                    fontWeight: 600
                                                }}>
                                                    Số lượng: {item.quantity || 1}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Options Row */}
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 6,
                                            marginBottom: 8
                                        }}>
                                            {item.options?.size && (
                                                <span style={{
                                                    background: '#3498db',
                                                    color: '#fff',
                                                    padding: '4px 10px',
                                                    borderRadius: 16,
                                                    fontSize: '11px',
                                                    fontWeight: 600
                                                }}>
                                                    {item.options.size}
                                                </span>
                                            )}
                                            {item.options?.type && (
                                                <span style={{
                                                    background: '#e74c3c',
                                                    color: '#fff',
                                                    padding: '4px 10px',
                                                    borderRadius: 16,
                                                    fontSize: '11px',
                                                    fontWeight: 600
                                                }}>
                                                    {item.options.type === 'lanh' ? 'Lạnh' : 'Nóng'}
                                                </span>
                                            )}
                                            {item.options?.sugar && (
                                                <span style={{
                                                    background: '#27ae60',
                                                    color: '#fff',
                                                    padding: '4px 10px',
                                                    borderRadius: 16,
                                                    fontSize: '11px',
                                                    fontWeight: 600
                                                }}>
                                                    {item.options.sugar}
                                                </span>
                                            )}
                                        </div>

                                        {/* Toppings */}
                                        {item.options?.toppings && item.options.toppings.length > 0 && (
                                            <div style={{
                                                fontSize: '12px',
                                                color: '#e67e22',
                                                fontWeight: 600,
                                                padding: '8px 12px',
                                                background: 'rgba(230, 126, 34, 0.1)',
                                                borderRadius: 8,
                                                border: '1px solid rgba(230, 126, 34, 0.2)'
                                            }}>
                                                🎯 Topping: {item.options.toppings.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: '40px 20px',
                                color: '#a0522d',
                                fontSize: '16px',
                                background: 'linear-gradient(135deg, #faf8f3 0%, #f5f5f0 100%)',
                                borderRadius: 16,
                                border: '2px dashed #e5d3b3'
                            }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                                <div>Không có thông tin sản phẩm</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Thông tin thanh toán */}
                <div style={{
                    background: '#ffffff',
                    borderRadius: 20,
                    padding: '30px',
                    marginBottom: 24,
                    boxShadow: '0 4px 25px rgba(184, 134, 11, 0.15)',
                    border: '1px solid #e5d3b3'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        marginBottom: 30
                    }}>
                        <div style={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #b8860b, #e5d3b3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 22,
                            color: '#fff',
                            boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)'
                        }}>
                            💳
                        </div>
                        <div>
                            <h3 style={{
                                color: '#8B4513',
                                fontWeight: 700,
                                fontSize: '22px',
                                margin: '0 0 4px 0'
                            }}>
                                Thông tin thanh toán
                            </h3>
                            <p style={{
                                color: '#a0522d',
                                fontSize: '14px',
                                margin: 0,
                                opacity: 0.8
                            }}>
                                Chi tiết phương thức và trạng thái thanh toán
                            </p>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 24
                    }}>
                        {/* Payment Method & Status Row */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: 20
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #faf8f3 0%, #f5f5f0 100%)',
                                padding: '24px',
                                borderRadius: 16,
                                border: '1px solid #e5d3b3',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '60px',
                                    height: '60px',
                                    background: 'linear-gradient(135deg, transparent 50%, rgba(184, 134, 11, 0.1) 50%)',
                                    borderRadius: '0 16px 0 60px'
                                }} />
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{
                                        color: '#a0522d',
                                        fontSize: '12px',
                                        marginBottom: 8,
                                        textTransform: 'uppercase',
                                        fontWeight: 700,
                                        letterSpacing: '0.5px'
                                    }}>
                                        Phương thức thanh toán
                                    </div>
                                    <div style={{
                                        fontWeight: 700,
                                        color: '#8B4513',
                                        fontSize: '18px',
                                        lineHeight: 1.3
                                    }}>
                                        {order.paymentMethod || 'N/A'}
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, #faf8f3 0%, #f5f5f0 100%)',
                                padding: '24px',
                                borderRadius: 16,
                                border: '1px solid #e5d3b3',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '60px',
                                    height: '60px',
                                    background: 'linear-gradient(135deg, transparent 50%, rgba(184, 134, 11, 0.1) 50%)',
                                    borderRadius: '0 16px 0 60px'
                                }} />
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{
                                        color: '#a0522d',
                                        fontSize: '12px',
                                        marginBottom: 8,
                                        textTransform: 'uppercase',
                                        fontWeight: 700,
                                        letterSpacing: '0.5px'
                                    }}>
                                        Trạng thái thanh toán
                                    </div>
                                    <div style={{
                                        fontWeight: 700,
                                        color: (order.paymentStatus || '') === 'Đã thanh toán' ? '#27ae60' : '#b8860b',
                                        fontSize: '18px',
                                        lineHeight: 1.3
                                    }}>
                                        {order.paymentStatus || 'Chưa thanh toán'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Amount */}
                        <div style={{
                            background: '#ffffff',
                            padding: '28px',
                            borderRadius: 16,
                            border: '2px solid #e5d3b3',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(135deg, transparent 50%, rgba(184, 134, 11, 0.08) 50%)',
                                borderRadius: '0 16px 0 80px'
                            }} />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '60px',
                                height: '60px',
                                background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.05) 50%, transparent 50%)',
                                borderRadius: '0 0 0 60px'
                            }} />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: 16
                                }}>
                                    <div>
                                        <div style={{
                                            color: '#a0522d',
                                            fontSize: '13px',
                                            marginBottom: 6,
                                            textTransform: 'uppercase',
                                            fontWeight: 700,
                                            letterSpacing: '0.5px'
                                        }}>
                                            Tổng cộng
                                        </div>
                                        <div style={{
                                            color: '#8B4513',
                                            fontSize: '14px',
                                            opacity: 0.8,
                                            fontWeight: 500
                                        }}>
                                            Đã bao gồm phí giao hàng
                                        </div>
                                    </div>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #b8860b, #e5d3b3)',
                                        padding: '16px 24px',
                                        borderRadius: 12,
                                        color: '#fff',
                                        boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)',
                                        minWidth: 'fit-content'
                                    }}>
                                        <div style={{
                                            fontSize: '24px',
                                            fontWeight: 800,
                                            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                            textAlign: 'center'
                                        }}>
                                            {order.totalAmount ? order.totalAmount.toLocaleString() : '0'}đ
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thời gian dự kiến */}
                <div style={{
                    background: 'linear-gradient(135deg, #faf8f3 0%, #f5f5f0 100%)',
                    borderRadius: 20,
                    padding: '30px',
                    marginBottom: 24,
                    border: '2px solid #b8860b',
                    boxShadow: '0 4px 20px rgba(184, 134, 11, 0.2)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20
                    }}>
                        <div style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #b8860b, #e5d3b3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28,
                            color: '#fff',
                            boxShadow: '0 4px 20px rgba(184, 134, 11, 0.3)'
                        }}>
                            ⏰
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: '20px',
                                fontWeight: 700,
                                color: '#8B4513',
                                marginBottom: 6
                            }}>
                                Thời gian dự kiến giao hàng
                            </div>
                            <div style={{
                                fontSize: '16px',
                                color: '#a0522d',
                                fontWeight: 600
                            }}>
                                {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleString('vi-VN') : 'Đang cập nhật...'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nút hành động */}
                <div style={{
                    display: 'flex',
                    gap: 16,
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '14px 28px',
                            background: 'linear-gradient(135deg, #b8860b, #e5d3b3)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 25,
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '16px',
                            boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)',
                            transition: 'all 0.3s ease',
                            minWidth: 'fit-content'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(184, 134, 11, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(184, 134, 11, 0.3)';
                        }}
                    >
                        🏠 Về trang chủ
                    </button>
                    <button
                        onClick={() => navigate('/menu')}
                        style={{
                            padding: '14px 28px',
                            background: '#ffffff',
                            color: '#b8860b',
                            border: '2px solid #b8860b',
                            borderRadius: 25,
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '16px',
                            boxShadow: '0 4px 15px rgba(184, 134, 11, 0.1)',
                            transition: 'all 0.3s ease',
                            minWidth: 'fit-content'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(184, 134, 11, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(184, 134, 11, 0.1)';
                        }}
                    >
                        🛒 Đặt thêm
                    </button>
                </div>
            </div>
        </div>
    );
} 
