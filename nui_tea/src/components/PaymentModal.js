/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function PaymentModal({ open, onClose, paymentMethod, amount, orderInfo, onPaymentSuccess }) {
    const [qrCode, setQrCode] = useState('');
    const [paymentId, setPaymentId] = useState('');
    const [paymentData, setPaymentData] = useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const [timeLeft, setTimeLeft] = useState(900); // 15 phút

    useEffect(() => {
        if (open && paymentMethod !== 'cod') {
            generatePaymentQR();
            startTimer();
        }
    }, [open, paymentMethod, amount]);

    const generatePaymentQR = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/payments/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    method: paymentMethod,
                    amount: amount,
                    orderInfo: orderInfo
                })
            });

            const data = await response.json();
            if (response.ok) {
                setQrCode(data.qrCode);
                setPaymentId(data.paymentId);
                setPaymentData(data);
            } else {
                alert('Lỗi tạo thanh toán: ' + data.message);
            }
        } catch (error) {
            alert('Lỗi kết nối server!');
        }
    };

    const startTimer = () => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    };

    const checkPaymentStatus = async () => {
        setIsChecking(true);
        try {
            const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();
            if (response.ok) {
                if (data.success) {
                    onPaymentSuccess();
                } else {
                    alert(data.message);
                }
            } else {
                alert('Lỗi kiểm tra thanh toán: ' + data.message);
            }
        } catch (error) {
            alert('Lỗi kết nối server!');
        }
        setIsChecking(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getPaymentInfo = () => {
        if (paymentData) {
            return {
                title: paymentData.method === 'bank' ? 'Chuyển khoản ngân hàng' :
                    paymentData.method === 'momo' ? 'Ví MoMo' : 'VNPay',
                icon: paymentData.method === 'bank' ? '🏦' :
                    paymentData.method === 'momo' ? '💜' : '💳',
                account: paymentData.bankAccount,
                bank: paymentData.bankName,
                holder: paymentData.accountHolder,
                content: paymentData.content
            };
        }

        // Fallback nếu chưa có data từ API
        switch (paymentMethod) {
            case 'bank':
                return {
                    title: 'Chuyển khoản ngân hàng',
                    icon: '🏦',
                    account: '123456789',
                    bank: 'Vietcombank',
                    holder: 'KIEU VAN SON',
                    content: `Thanh toan ${orderInfo}`
                };
            case 'momo':
                return {
                    title: 'Ví MoMo',
                    icon: '💜',
                    account: '0123456789',
                    bank: 'MoMo',
                    holder: 'KIEU VAN SON',
                    content: `Thanh toan ${orderInfo}`
                };
            case 'vnpay':
                return {
                    title: 'VNPay',
                    icon: '💳',
                    account: '987654321',
                    bank: 'VNPay',
                    holder: 'KIEU VAN SON',
                    content: `Thanh toan ${orderInfo}`
                };
            default:
                return {};
        }
    };

    if (!open) return null;

    const paymentInfo = getPaymentInfo();

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20
        }}>
            <div style={{
                background: '#fff', borderRadius: 20, maxWidth: 500, width: '100%',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)', padding: 32,
                position: 'relative', maxHeight: '90vh', overflowY: 'auto'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: 16, right: 16,
                    background: 'none', border: 'none', fontSize: 24,
                    color: '#666', cursor: 'pointer', zIndex: 10
                }}>&times;</button>

                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{paymentInfo.icon}</div>
                    <h2 style={{ color: '#b8860b', fontWeight: 700, marginBottom: 8 }}>
                        {paymentInfo.title}
                    </h2>
                    <div style={{ color: '#666', fontSize: 16 }}>
                        Số tiền: <span style={{ color: '#b8860b', fontWeight: 700, fontSize: 20 }}>
                            {amount.toLocaleString()}đ
                        </span>
                    </div>
                </div>

                {/* Thời gian còn lại */}
                <div style={{
                    background: timeLeft < 300 ? '#ffebee' : '#e8f5e8',
                    padding: 12, borderRadius: 10, textAlign: 'center', marginBottom: 24
                }}>
                    <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
                        Thời gian còn lại
                    </div>
                    <div style={{
                        fontSize: 24, fontWeight: 700,
                        color: timeLeft < 300 ? '#d32f2f' : '#2e7d32'
                    }}>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Thông tin chuyển khoản */}
                <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 20, marginBottom: 24 }}>
                    <h3 style={{ color: '#333', fontWeight: 600, marginBottom: 16 }}>
                        Thông tin chuyển khoản
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#666' }}>Ngân hàng:</span>
                            <span style={{ fontWeight: 600 }}>{paymentInfo.bank}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#666' }}>Số tài khoản:</span>
                            <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 16 }}>
                                {paymentInfo.account}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#666' }}>Chủ tài khoản:</span>
                            <span style={{ fontWeight: 600 }}>{paymentInfo.holder}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#666' }}>Nội dung:</span>
                            <span style={{ fontWeight: 600, color: '#b8860b', fontSize: 14 }}>
                                {paymentInfo.content}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Mã QR */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{
                        width: 200, height: 200, margin: '0 auto',
                        borderRadius: 12,
                        overflow: 'hidden',
                        border: '2px solid #f0f0f0'
                    }}>
                        <img
                            src="/qr-ck.jpg"
                            alt="QR Code"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
                        Quét mã QR bằng ứng dụng {paymentInfo.bank}
                    </div>
                </div>

                {/* Mã giao dịch */}
                <div style={{
                    background: '#fff3cd', border: '1px solid #ffeaa7',
                    borderRadius: 8, padding: 12, marginBottom: 24, textAlign: 'center'
                }}>
                    <div style={{ fontSize: 12, color: '#856404', marginBottom: 4 }}>
                        Mã giao dịch
                    </div>
                    <div style={{ fontWeight: 700, color: '#856404', fontFamily: 'monospace' }}>
                        {paymentId}
                    </div>
                </div>

                {/* Nút kiểm tra thanh toán */}
                <button
                    onClick={checkPaymentStatus}
                    disabled={isChecking || timeLeft === 0}
                    style={{
                        width: '100%', padding: '16px 0',
                        background: isChecking || timeLeft === 0 ? '#ccc' : 'linear-gradient(90deg,#b8860b,#e5d3b3)',
                        color: '#fff', fontWeight: 700, fontSize: 16,
                        border: 'none', borderRadius: 12, cursor: isChecking || timeLeft === 0 ? 'not-allowed' : 'pointer',
                        boxShadow: '0 2px 8px #b8860b22'
                    }}
                >
                    {isChecking ? 'Đang kiểm tra...' : timeLeft === 0 ? 'Hết thời gian' : 'Đã thanh toán xong'}
                </button>

                {/* Hướng dẫn */}
                <div style={{ marginTop: 20, padding: 16, background: '#e3f2fd', borderRadius: 8 }}>
                    <h4 style={{ color: '#1976d2', marginBottom: 8 }}>Hướng dẫn thanh toán:</h4>
                    <ol style={{ color: '#1976d2', fontSize: 14, lineHeight: 1.6, margin: 0, paddingLeft: 20 }}>
                        <li>Chuyển khoản chính xác số tiền và nội dung</li>
                        <li>Đợi 1-2 phút sau khi chuyển khoản</li>
                        <li>Nhấn "Đã thanh toán xong" để kiểm tra</li>
                        <li>Hệ thống sẽ tự động xác nhận đơn hàng</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

export default PaymentModal; 