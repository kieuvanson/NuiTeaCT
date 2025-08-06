/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useCart } from './contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import PaymentModal from './components/PaymentModal';
import { API_BASE_URL } from './config';

export default function CheckoutPage() {
    const { items, getTotalPrice, clearCart } = useCart();
    const [customerName, setCustomerName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [coupon, setCoupon] = useState('');
    const [note, setNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod'); // Thêm state cho phương thức thanh toán
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const navigate = useNavigate();

    // Lấy thông tin user từ localStorage
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('nui_tea_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        fetch(`${API_BASE_URL}/coupons/active`)
            .then(res => res.json())
            .then(data => setCoupons(data))
            .catch(() => setCoupons([]));
    }, []);

    // Tự động điền thông tin nếu user đã đăng nhập
    useEffect(() => {
        if (user) {
            setCustomerName(user.FullName || user.Username || '');
            setEmail(user.email || '');
            // Không tự động điền số điện thoại vì user có thể không có
            // setPhone(user.Phone || '');
            // Có thể thêm địa chỉ mặc định nếu user có
            // setAddress(user.Address || '');
        }
    }, [user]);

    const selectedCoupon = coupons.find(c => c.code === coupon);

    // Hàm tính số tiền được giảm
    const getDiscountAmount = () => {
        if (!selectedCoupon) return 0;
        const total = getTotalPrice();
        // Điều kiện tối thiểu nếu có
        if (selectedCoupon.minOrder && total < selectedCoupon.minOrder) return 0;
        if (selectedCoupon.discountType === 'percent') {
            return Math.floor(total * (selectedCoupon.discountValue / 100));
        }
        if (selectedCoupon.discountType === 'amount') {
            return Math.min(selectedCoupon.discountValue, total);
        }
        return 0;
    };
    const discount = getDiscountAmount();
    const totalAfterDiscount = getTotalPrice() - discount;

    // Kiểm tra giỏ hàng trống và chuyển về trang chủ
    useEffect(() => {
        if (!items || items.length === 0) {
            navigate('/');
        }
    }, [items, navigate]);

    if (!items || items.length === 0) {
        return null; // Không hiển thị gì cả
    }

    const handleOrder = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!customerName.trim() || !email.trim() || !phone.trim() || !address.trim()) {
            setError('Vui lòng nhập đầy đủ tên, email, số điện thoại và địa chỉ!');
            return;
        }
        if (!paymentMethod) {
            setError('Vui lòng chọn phương thức thanh toán!');
            return;
        }

        // Nếu thanh toán online, hiển thị modal thanh toán
        if (paymentMethod !== 'cod') {
            setShowPaymentModal(true);
            return;
        }

        // Nếu thanh toán COD, xử lý ngay
        processOrder();
    };



    const handlePaymentSuccess = () => {
        setShowPaymentModal(false);
        processOrder();
    };

    const processOrder = async () => {
        setLoading(true);
        try {
            const paymentText = {
                'cod': 'Thanh toán khi nhận hàng',
                'bank': 'Chuyển khoản ngân hàng',
                'momo': 'Ví MoMo',
                'vnpay': 'VNPay'
            };

            // Tạo mã đơn hàng
            const orderId = 'ORD' + Date.now();

            // Chuẩn bị dữ liệu đơn hàng
            const orderItems = items.map(item => ({
                productId: item.id,
                productName: item.name,
                productImage: item.image,
                quantity: item.quantity,
                price: item.price,
                options: item.options
            }));

            // Sử dụng email và phone từ form
            const customerEmail = email;
            const customerPhone = phone;

            console.log('Customer info:', {
                name: customerName,
                email: customerEmail,
                phone: customerPhone,
                address: address
            });

            // Chuẩn bị dữ liệu đơn hàng
            const orderData = {
                orderNumber: orderId,
                customerName: customerName,
                phone: customerPhone, // Số điện thoại
                email: customerEmail, // Email
                address: address,
                note: note,
                totalAmount: totalAfterDiscount,
                paymentMethod: paymentText[paymentMethod],
                paymentStatus: paymentMethod === 'cod' ? 'Chưa thanh toán' : 'Đã thanh toán',
                orderStatus: 'Đã đặt hàng',
                couponCode: coupon,
                discountAmount: discount,
                items: orderItems
            };

            console.log('Sending order data:', orderData);

            // Gửi đơn hàng lên server
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('Lỗi khi tạo đơn hàng');
            }

            const result = await response.json();

            // Lưu thông tin đơn hàng vào localStorage để truyền sang trang trạng thái
            const orderDataForStorage = {
                id: result.id,
                orderNumber: orderId,
                customerName: customerName,
                email: customerEmail,
                phone: customerPhone, // Số điện thoại thực
                address: address,
                items: orderItems, // Sử dụng orderItems thay vì items để có đầy đủ thông tin
                totalAmount: totalAfterDiscount,
                paymentMethod: paymentText[paymentMethod],
                paymentStatus: paymentMethod === 'cod' ? 'Chưa thanh toán' : 'Đã thanh toán',
                orderStatus: 'Đã đặt hàng',
                createdAt: new Date().toISOString(),
                estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 phút
                note: note,
                coupon: coupon
            };

            localStorage.setItem('currentOrder', JSON.stringify(orderDataForStorage));

            setSuccess(`Đặt hàng thành công! Phương thức thanh toán: ${paymentText[paymentMethod]}. Chúng tôi sẽ liên hệ xác nhận đơn hàng.`);
            clearCart();
            setLoading(false);

            // Chuyển hướng đến trang trạng thái đơn hàng sau 2 giây
            setTimeout(() => {
                navigate(`/order-status/${result.id}`);
            }, 2000);

        } catch (error) {
            console.error('Error creating order:', error);
            setError('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 700, margin: '40px auto', background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #b8860b22', padding: 32 }}>
            <h2 style={{ color: '#a0522d', fontWeight: 800, marginBottom: 18 }}>Xác nhận đơn hàng</h2>

            {user && (
                <div style={{
                    background: '#e8f5e8',
                    border: '1px solid #4CAF50',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                    fontSize: 14,
                    color: '#2e7d32'
                }}>
                    ✅ Đã đăng nhập với tài khoản: <strong>{user.email}</strong>
                    <br />
                    Thông tin sẽ được tự động điền và đơn hàng sẽ được liên kết với tài khoản của bạn.
                </div>
            )}

            <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <label>Họ và tên *</label>
                <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Nhập họ và tên" style={{ padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} required />

                <label>Email *</label>
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    style={{ padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }}
                    required
                    readOnly={user} // Chỉ đọc nếu đã đăng nhập
                />

                <label>Số điện thoại *</label>
                <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                    style={{ padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }}
                    required
                />

                <label>Địa chỉ nhận hàng *</label>
                <input
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ"
                    style={{ padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }}
                    required
                />
                <label>Mã giảm giá (nếu có)</label>
                <select value={coupon} onChange={e => setCoupon(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }}>
                    <option value="">-- Chọn mã giảm giá --</option>
                    {coupons.map(c => (
                        <option key={c.code} value={c.code}>
                            {c.code} {c.discountType === 'percent' ? `- Giảm ${c.discountValue}%` : `- Giảm ${c.discountValue.toLocaleString()}đ`}
                        </option>
                    ))}
                </select>
                {selectedCoupon && (
                    <div style={{ color: '#a0522d', fontSize: 15, marginTop: 4, marginBottom: -8 }}>
                        {selectedCoupon.description} (HSD: {selectedCoupon.expiryDate ? selectedCoupon.expiryDate.slice(0, 10) : ''})
                    </div>
                )}
                <label>Ghi chú cho cửa hàng</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Ghi chú (tuỳ chọn)" style={{ padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16, minHeight: 60 }} />

                {/* Phương thức thanh toán */}
                <div style={{ marginTop: 8 }}>
                    <label style={{ fontWeight: 600, color: '#a0522d', marginBottom: 8, display: 'block' }}>Phương thức thanh toán *</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 16px', border: paymentMethod === 'cod' ? '2px solid #b8860b' : '1px solid #ddd', borderRadius: 10, background: paymentMethod === 'cod' ? '#faf8f3' : '#fff', transition: 'all 0.2s' }}>
                            <input
                                type="radio"
                                name="payment"
                                value="cod"
                                checked={paymentMethod === 'cod'}
                                onChange={() => setPaymentMethod('cod')}
                                style={{ width: 18, height: 18 }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 20 }}>💵</span>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#333' }}>Thanh toán khi nhận hàng (COD)</div>
                                    <div style={{ fontSize: 13, color: '#666' }}>Trả tiền mặt khi giao hàng</div>
                                </div>
                            </div>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 16px', border: paymentMethod === 'bank' ? '2px solid #b8860b' : '1px solid #ddd', borderRadius: 10, background: paymentMethod === 'bank' ? '#faf8f3' : '#fff', transition: 'all 0.2s' }}>
                            <input
                                type="radio"
                                name="payment"
                                value="bank"
                                checked={paymentMethod === 'bank'}
                                onChange={() => setPaymentMethod('bank')}
                                style={{ width: 18, height: 18 }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 20 }}>🏦</span>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#333' }}>Chuyển khoản ngân hàng</div>
                                    <div style={{ fontSize: 13, color: '#666' }}>Chuyển khoản trước khi giao hàng</div>
                                </div>
                            </div>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 16px', border: paymentMethod === 'momo' ? '2px solid #b8860b' : '1px solid #ddd', borderRadius: 10, background: paymentMethod === 'momo' ? '#faf8f3' : '#fff', transition: 'all 0.2s' }}>
                            <input
                                type="radio"
                                name="payment"
                                value="momo"
                                checked={paymentMethod === 'momo'}
                                onChange={() => setPaymentMethod('momo')}
                                style={{ width: 18, height: 18 }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 20 }}>💜</span>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#333' }}>Ví MoMo</div>
                                    <div style={{ fontSize: 13, color: '#666' }}>Thanh toán qua ứng dụng MoMo</div>
                                </div>
                            </div>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 16px', border: paymentMethod === 'vnpay' ? '2px solid #b8860b' : '1px solid #ddd', borderRadius: 10, background: paymentMethod === 'vnpay' ? '#faf8f3' : '#fff', transition: 'all 0.2s' }}>
                            <input
                                type="radio"
                                name="payment"
                                value="vnpay"
                                checked={paymentMethod === 'vnpay'}
                                onChange={() => setPaymentMethod('vnpay')}
                                style={{ width: 18, height: 18 }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 20 }}>💳</span>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#333' }}>VNPay</div>
                                    <div style={{ fontSize: 13, color: '#666' }}>Thanh toán qua cổng VNPay</div>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                <div style={{ margin: '18px 0 8px 0', fontWeight: 700, color: '#a0522d', fontSize: 18 }}>Sản phẩm đã chọn</div>
                <div style={{ background: '#faf8f3', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                    {items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 14, borderBottom: idx < items.length - 1 ? '1px solid #eee' : 'none', padding: '10px 0' }}>
                            <div style={{ width: 54, height: 54, borderRadius: 8, background: '#f3e9dd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, overflow: 'hidden' }}>
                                {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (item.emoji || '🍵')}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700 }}>{item.name}</div>
                                <div style={{ fontSize: 14, color: '#b8860b', fontWeight: 600 }}>{item.options && item.options.size ? `Size: ${item.options.size}` : ''} {item.options && item.options.type ? `| ${item.options.type === 'lanh' ? 'Lạnh' : 'Nóng'}` : ''} {item.options && item.options.sugar ? `| Đường: ${item.options.sugar}` : ''}</div>
                                {item.options && item.options.toppings && item.options.toppings.length > 0 && (
                                    <div style={{ fontSize: 13, color: '#a0522d', marginTop: 2 }}>Topping: {item.options.toppings.map(t => t.replace(/-/g, ' ')).join(', ')}</div>
                                )}
                            </div>
                            <div style={{ fontWeight: 700, color: '#a0522d', minWidth: 70, textAlign: 'right' }}>{item.price.toLocaleString()}đ x {item.quantity}</div>
                        </div>
                    ))}
                </div>
                {discount > 0 && (
                    <div style={{ textAlign: 'right', color: '#27ae60', fontWeight: 700, fontSize: 17 }}>
                        Đã giảm: -{discount.toLocaleString()}đ
                    </div>
                )}
                <div style={{ textAlign: 'right', fontWeight: 800, color: '#e67e22', fontSize: 20, marginBottom: 18 }}>
                    Tổng cộng: {totalAfterDiscount.toLocaleString()}đ
                </div>
                <button type="submit" disabled={loading} style={{ background: 'linear-gradient(90deg,#b8860b,#e5d3b3)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 0', fontWeight: 700, fontSize: 18, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px #b8860b22', marginTop: 8 }}>
                    {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                </button>
                {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
                {success && <div style={{ color: 'green', marginTop: 10 }}>{success}</div>}
            </form>

            {/* Payment Modal */}
            <PaymentModal
                open={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                paymentMethod={paymentMethod}
                amount={totalAfterDiscount}
                orderInfo={`Don hang ${Date.now()}`}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </div>
    );
} 