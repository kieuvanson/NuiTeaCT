import React from 'react';

export default function ContactSection({ contactRef }) {
    return (
        <section className="contact-section" ref={contactRef}>
            <div className="container">
                <h2>Liên hệ & Đặt hàng</h2>
                <div className="contact-info">
                    <div className="contact-item">
                        <h3>📞 Điện thoại</h3>
                        <p>0867859033</p>
                        <p>Hỗ trợ 24/7</p>
                    </div>
                    <div className="contact-item">
                        <h3>📍 Địa chỉ</h3>
                        <p>Ngõ 225 Lạc Long Quân</p>
                        <p>TP. Hà Nội</p>
                    </div>
                    <div className="contact-item">
                        <h3>🕒 Giờ mở cửa</h3>
                        <p>Thứ 2 - Chủ nhật</p>
                        <p>8:00 - 22:00</p>
                    </div>
                </div>

                <div className="contact-order-section">
                    <div className="contact-illustration">
                        <span role="img" aria-label="order" style={{ fontSize: 48 }}>📱</span>
                    </div>
                    <div className="contact-title">Đặt hàng online nhanh chóng</div>
                    <div className="contact-desc">Liên hệ ngay để được tư vấn và đặt hàng với nhiều ưu đãi hấp dẫn!</div>
                    <div className="contact-order-grid">
                        <a href="https://zalo.me/0867859033" target="_blank" rel="noopener noreferrer" className="contact-order-btn zalo">
                            <div className="contact-icon">Z</div>
                            Zalo: 0867859033
                        </a>
                        <a href="https://facebook.com/yourfanpage" target="_blank" rel="noopener noreferrer" className="contact-order-btn fb">
                            <div className="contact-icon">f</div>
                            Facebook: nui_tea
                        </a>
                        <a href="tel:0867859033" className="contact-order-btn call">
                            <div className="contact-icon">📞</div>
                            Gọi ngay: 0867859033
                        </a>
                    </div>
                    <div className="contact-support-note">
                        * Hỗ trợ đặt hàng và tư vấn miễn phí 24/7
                    </div>
                </div>
            </div>
        </section>
    );
} 