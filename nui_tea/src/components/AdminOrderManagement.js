import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function AdminOrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetail, setShowOrderDetail] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/orders`);
            if (!response.ok) {
                throw new Error('Lỗi khi tải danh sách đơn hàng');
            }
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderStatus: newStatus })
            });

            if (!response.ok) {
                throw new Error('Lỗi khi cập nhật trạng thái');
            }

            // Cập nhật lại danh sách đơn hàng
            await fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng');
        }
    };

    const updatePaymentStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/${orderId}/payment-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paymentStatus: newStatus })
            });

            if (!response.ok) {
                throw new Error('Lỗi khi cập nhật trạng thái thanh toán');
            }

            // Cập nhật lại danh sách đơn hàng
            await fetchOrders();
        } catch (error) {
            console.error('Error updating payment status:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái thanh toán');
        }
    };

    const deleteOrder = async (orderId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Lỗi khi xóa đơn hàng');
            }

            // Cập nhật lại danh sách đơn hàng
            await fetchOrders();
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Có lỗi xảy ra khi xóa đơn hàng');
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

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'Đã thanh toán': return '#4CAF50';
            case 'Chưa thanh toán': return '#FF9800';
            default: return '#666';
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <div>Đang tải danh sách đơn hàng...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                <div>{error}</div>
                <button onClick={fetchOrders} style={{ marginTop: '10px', padding: '8px 16px' }}>
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#b8860b', marginBottom: '20px' }}>Quản lý đơn hàng</h2>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    Chưa có đơn hàng nào
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {orders.map((order) => (
                        <div key={order.id} style={{
                            background: '#fff',
                            borderRadius: '12px',
                            padding: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            border: '1px solid #eee'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>
                                        Đơn hàng #{order.orderNumber}
                                    </h3>
                                    <div style={{ color: '#666', fontSize: '14px' }}>
                                        {new Date(order.createdAt).toLocaleString('vi-VN')}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#b8860b' }}>
                                        {formatPrice(order.totalAmount)}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginBottom: '12px' }}>
                                <div>
                                    <strong>Khách hàng:</strong> {order.customerName}
                                </div>
                                <div>
                                    <strong>SĐT:</strong> {order.phone}
                                </div>
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <strong>Địa chỉ:</strong> {order.address}
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
                                <div>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        color: '#fff',
                                        background: getStatusColor(order.orderStatus)
                                    }}>
                                        {order.orderStatus}
                                    </span>
                                </div>
                                <div>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        color: '#fff',
                                        background: getPaymentStatusColor(order.paymentStatus)
                                    }}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setShowOrderDetail(true);
                                    }}
                                    style={{
                                        padding: '8px 16px',
                                        background: '#b8860b',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    Xem chi tiết
                                </button>

                                <select
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                    value={order.orderStatus}
                                    style={{
                                        padding: '8px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                >
                                    <option value="Đã đặt hàng">Đã đặt hàng</option>
                                    <option value="Đang chuẩn bị">Đang chuẩn bị</option>
                                    <option value="Đang giao hàng">Đang giao hàng</option>
                                    <option value="Đã giao hàng">Đã giao hàng</option>
                                    <option value="Đã hủy">Đã hủy</option>
                                </select>

                                <select
                                    onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                                    value={order.paymentStatus}
                                    style={{
                                        padding: '8px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                >
                                    <option value="Chưa thanh toán">Chưa thanh toán</option>
                                    <option value="Đã thanh toán">Đã thanh toán</option>
                                </select>

                                <button
                                    onClick={() => deleteOrder(order.id)}
                                    style={{
                                        padding: '8px 16px',
                                        background: '#f44336',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal chi tiết đơn hàng */}
            {showOrderDetail && selectedOrder && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '24px',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#b8860b' }}>Chi tiết đơn hàng #{selectedOrder.orderNumber}</h2>
                            <button
                                onClick={() => setShowOrderDetail(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h3>Thông tin khách hàng</h3>
                            <div><strong>Tên:</strong> {selectedOrder.customerName}</div>
                            <div><strong>SĐT:</strong> {selectedOrder.phone}</div>
                            <div><strong>Địa chỉ:</strong> {selectedOrder.address}</div>
                            {selectedOrder.note && <div><strong>Ghi chú:</strong> {selectedOrder.note}</div>}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h3>Sản phẩm đã đặt</h3>
                            {selectedOrder.items.map((item, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    gap: '12px',
                                    padding: '12px 0',
                                    borderBottom: index < selectedOrder.items.length - 1 ? '1px solid #eee' : 'none'
                                }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        background: '#f8f8f8',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '20px',
                                        overflow: 'hidden'
                                    }}>
                                        {item.productImage ? (
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        ) : (
                                            '🍵'
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold' }}>{item.productName}</div>
                                        <div style={{ fontSize: '14px', color: '#666' }}>
                                            {item.options?.size && `${item.options.size} | `}
                                            {item.options?.type && `${item.options.type === 'lanh' ? 'Lạnh' : 'Nóng'} | `}
                                            {item.options?.sugar && `${item.options.sugar}`}
                                        </div>
                                        {item.options?.toppings && item.options.toppings.length > 0 && (
                                            <div style={{ fontSize: '13px', color: '#b8860b' }}>
                                                Topping: {item.options.toppings.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold', color: '#b8860b' }}>
                                            {formatPrice(item.price)}
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#666' }}>
                                            x{item.quantity}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h3>Thông tin thanh toán</h3>
                            <div><strong>Phương thức:</strong> {selectedOrder.paymentMethod}</div>
                            <div><strong>Trạng thái:</strong> {selectedOrder.paymentStatus}</div>
                            <div><strong>Tổng cộng:</strong> {formatPrice(selectedOrder.totalAmount)}</div>
                            {selectedOrder.couponCode && (
                                <div><strong>Mã giảm giá:</strong> {selectedOrder.couponCode}</div>
                            )}
                            {selectedOrder.discountAmount && (
                                <div><strong>Giảm giá:</strong> {formatPrice(selectedOrder.discountAmount)}</div>
                            )}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h3>Thông tin đơn hàng</h3>
                            <div><strong>Trạng thái:</strong> {selectedOrder.orderStatus}</div>
                            <div><strong>Ngày đặt:</strong> {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</div>
                            {selectedOrder.estimatedDelivery && (
                                <div><strong>Dự kiến giao:</strong> {new Date(selectedOrder.estimatedDelivery).toLocaleString('vi-VN')}</div>
                            )}
                            {selectedOrder.completedAt && (
                                <div><strong>Hoàn thành:</strong> {new Date(selectedOrder.completedAt).toLocaleString('vi-VN')}</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 