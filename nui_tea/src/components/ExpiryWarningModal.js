import React, { useState, useEffect } from 'react';
import './ExpiryWarningModal.css';
import { API_BASE_URL } from '../config';

const ExpiryWarningModal = ({ isOpen, onClose }) => {
    const [warnings, setWarnings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchExpiryWarnings();
        }
    }, [isOpen]);

    const fetchExpiryWarnings = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/Materials/expiry-warnings`);
            if (response.ok) {
                const data = await response.json();
                setWarnings(data.warnings || []);
            }
        } catch (error) {
            console.error('Lỗi khi tải cảnh báo hạn sử dụng:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'expired':
                return '#dc3545'; // Đỏ
            case 'warning':
                return '#ffc107'; // Vàng
            default:
                return '#28a745'; // Xanh
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'expired':
                return 'Đã hết hạn';
            case 'warning':
                return 'Sắp hết hạn';
            default:
                return 'Bình thường';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="expiry-warning-modal-overlay">
            <div className="expiry-warning-modal">
                <div className="modal-header">
                    <h2>⚠️ Cảnh báo hạn sử dụng</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="modal-content">
                    {loading ? (
                        <div className="loading">Đang tải...</div>
                    ) : warnings.length === 0 ? (
                        <div className="no-warnings">
                            <div className="success-icon">✅</div>
                            <p>Không có cảnh báo hạn sử dụng nào!</p>
                            <p>Tất cả nguyên vật liệu đều trong hạn sử dụng.</p>
                        </div>
                    ) : (
                        <div className="warnings-list">
                            {warnings.map((warning) => (
                                <div
                                    key={warning.id}
                                    className="warning-item"
                                    style={{ borderLeftColor: getStatusColor(warning.status) }}
                                >
                                    <div className="warning-header">
                                        <h3>{warning.name}</h3>
                                        <span
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(warning.status) }}
                                        >
                                            {getStatusText(warning.status)}
                                        </span>
                                    </div>

                                    <div className="warning-details">
                                        <div className="detail-row">
                                            <span className="label">Loại:</span>
                                            <span className="value">{warning.category}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Số lượng:</span>
                                            <span className="value">{warning.quantity} {warning.unit}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Hạn sử dụng:</span>
                                            <span className="value">{formatDate(warning.expiryDate)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Còn lại:</span>
                                            <span className={`value ${warning.daysUntilExpiry < 0 ? 'expired' : 'warning'}`}>
                                                {warning.daysUntilExpiry < 0
                                                    ? `${Math.abs(warning.daysUntilExpiry)} ngày đã hết hạn`
                                                    : `${warning.daysUntilExpiry} ngày`
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="refresh-button" onClick={fetchExpiryWarnings}>
                        🔄 Làm mới
                    </button>
                    <button className="close-modal-button" onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpiryWarningModal; 