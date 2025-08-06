/* eslint-disable */
import React, { useState, useEffect } from 'react';
import './OrderHistory.css';
import { API_BASE_URL } from '../config';

const OrderHistory = ({ isOpen, onClose, user }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            fetchOrders();
        }
    }, [isOpen, user]);

    const fetchOrders = async () => {
        if (!user || !user.email) {
            console.log('User or user.email is null:', user);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/orders?customerEmail=${encodeURIComponent(user.email)}`);
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                console.error('Lỗi khi tải lịch sử đơn hàng');
                setOrders([]);
            }
        } catch (error) {
            console.error('Lỗi kết nối:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Đã đặt hàng': return 'Đã đặt hàng';
            case 'Đã xác nhận': return 'Đã xác nhận';
            case 'Đang chuẩn bị': return 'Đang chuẩn bị';
            case 'Đang giao hàng': return 'Đang giao hàng';
            case 'Đã hoàn thành': return 'Đã hoàn thành';
            case 'Đã hủy': return 'Đã hủy';
            default: return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Đã đặt hàng': return '#ffa500';
            case 'Đã xác nhận': return '#007bff';
            case 'Đang chuẩn bị': return '#17a2b8';
            case 'Đang giao hàng': return '#28a745';
            case 'Đã hoàn thành': return '#28a745';
            case 'Đã hủy': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    };

    if (!isOpen) return null;

    return (
        <div className="order-history-overlay">
            <div className="order-history-modal">
                <div className="order-history-header">
                    <h2>Lịch sử đơn hàng</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="order-history-content">
                    {loading ? (
                        <div className="loading">Đang tải...</div>
                    ) : orders.length === 0 ? (
                        <div className="no-orders">
                            <p>Chưa có đơn hàng nào</p>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <div key={order.id} className="order-item">
                                    <div className="order-header">
                                        <div className="order-info">
                                            <h3>Đơn hàng #{order.orderNumber}</h3>
                                            <p className="order-date">{formatDate(order.createdAt)}</p>
                                        </div>
                                        <div
                                            className="order-status"
                                            style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                                        >
                                            {getStatusText(order.orderStatus)}
                                        </div>
                                    </div>

                                    <div className="order-items">
                                        {order.items && order.items.map((item, index) => (
                                            <div key={index} className="order-product">
                                                <div className="product-info">
                                                    <img
                                                        src={item.productImage || '/logo192.png'}
                                                        alt={item.productName}
                                                        className="product-image"
                                                    />
                                                    <div className="product-details">
                                                        <h4>{item.productName}</h4>
                                                        <p>Size: {item.options?.size || 'Mặc định'}</p>
                                                        <p>Đường: {item.options?.sugar || 'Mặc định'}</p>
                                                        {item.options?.toppings && item.options.toppings.length > 0 && (
                                                            <p>Topping: {item.options.toppings.join(', ')}</p>
                                                        )}
                                                        <p>Số lượng: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <div className="product-price">
                                                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-summary">
                                        <div className="summary-row">
                                            <span>Tổng tiền:</span>
                                            <span>{order.totalAmount.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                        {order.discountAmount > 0 && (
                                            <div className="summary-row discount">
                                                <span>Giảm giá:</span>
                                                <span>-{order.discountAmount.toLocaleString('vi-VN')}đ</span>
                                            </div>
                                        )}
                                        <div className="summary-row total">
                                            <span>Thành tiền:</span>
                                            <span>{(order.totalAmount - order.discountAmount).toLocaleString('vi-VN')}đ</span>
                                        </div>
                                    </div>

                                    <div className="order-details">
                                        <p><strong>Khách hàng:</strong> {order.customerName}</p>
                                        <p><strong>Số điện thoại:</strong> {order.phone}</p>
                                        <p><strong>Email:</strong> {order.email}</p>
                                        <p><strong>Địa chỉ:</strong> {order.address}</p>
                                        {order.note && <p><strong>Ghi chú:</strong> {order.note}</p>}
                                        <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
                                        <p><strong>Trạng thái thanh toán:</strong> {order.paymentStatus}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory; 