/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import './App.css';

export default function About() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentSection, setCurrentSection] = useState(0);
    const heroRef = useRef(null);
    const sectionsRef = useRef([]);

    useEffect(() => {
        setIsVisible(true);

        // Intersection Observer cho animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setCurrentSection(index);
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        sectionsRef.current.forEach(section => {
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    const addToRefs = (el) => {
        if (el && !sectionsRef.current.includes(el)) {
            sectionsRef.current.push(el);
        }
    };

    return (
        <div className="about-page-modern">
            {/* Hero Section với Parallax */}
            <div className="about-hero-modern" ref={heroRef}>
                <div className="hero-background">
                    <div className="floating-elements">
                        <div className="floating-leaf leaf-1">🍃</div>
                        <div className="floating-leaf leaf-2">🌿</div>
                        <div className="floating-leaf leaf-3">🍂</div>
                        <div className="floating-leaf leaf-4">🌱</div>
                    </div>
                    <div className="mountain-gradient"></div>
                </div>

                <div className="hero-content">
                    <div className={`hero-text ${isVisible ? 'animate-in' : ''}`}>
                        <h1 className="hero-title">
                            <span className="title-line">Về</span>
                            <span className="title-line highlight">Nui Tea</span>
                        </h1>
                        <p className="hero-subtitle">Hương vị từ núi rừng, tinh hoa lá trà</p>
                        <div className="hero-description">
                            <p>Nui Tea là thương hiệu trà sữa hiện đại, lấy cảm hứng từ thiên nhiên, núi rừng và những lá trà tươi ngon nhất. Chúng tôi cam kết mang đến trải nghiệm trà sữa tinh tế, an toàn, chất lượng và thân thiện với môi trường.</p>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="logo-animation">
                            <div className="nui-tea-logo">
                                <svg width="200" height="200" viewBox="0 0 48 48" fill="none">
                                    <rect x="8" y="8" width="32" height="32" rx="16" fill="url(#grad1)" />
                                    <path d="M24 12 C28 12, 32 16, 32 20 C32 24, 28 28, 24 28 C20 28, 16 24, 16 20 C16 16, 20 12, 24 12 Z" fill="#8B4513" />
                                    <path d="M24 14 C26 14, 28 16, 28 18 C28 20, 26 22, 24 22 C22 22, 20 20, 20 18 C20 16, 22 14, 24 14 Z" fill="#A0522D" />
                                    <rect x="23" y="28" width="2" height="6" rx="1" fill="#654321" />
                                    <path d="M12 32 L20 24 L28 32 L36 24 L36 40 L12 40 Z" fill="#8B4513" opacity="0.7" />
                                    <path d="M16 36 L22 30 L28 36 L32 30 L32 40 L16 40 Z" fill="#A0522D" opacity="0.8" />
                                    <defs>
                                        <linearGradient id="grad1" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#D2B48C" />
                                            <stop offset="1" stopColor="#F5DEB3" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="logo-text">nui_tea</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sections với animations */}
            <div className="about-sections-modern">
                {/* Section 1: Lịch sử - Story Mode */}
                <section className="about-section-modern story-section" ref={addToRefs}>
                    <div className="section-content">
                        <div className="section-header">
                            <div className="section-icon">📖</div>
                            <h2>Câu chuyện Nui Tea</h2>
                            <div className="section-line"></div>
                        </div>
                        <div className="story-container">
                            <div className="story-chapter chapter-1 animate-in">
                                <div className="chapter-background mountain-bg">
                                    <div className="floating-clouds">
                                        <div className="cloud cloud-1">☁️</div>
                                        <div className="cloud cloud-2">☁️</div>
                                        <div className="cloud cloud-3">☁️</div>
                                    </div>
                                </div>
                                <div className="chapter-content">
                                    <div className="chapter-number">Chương 1</div>
                                    <h3 className="chapter-title">Khởi nguồn từ núi rừng</h3>
                                    <div className="chapter-text">
                                        <p>Ngày xửa ngày xưa, ở một vùng núi xanh mát, nơi những đồi chè trải dài bất tận, sương sớm phủ trắng và không khí trong lành...</p>
                                        <p><strong>Kiều Văn Sơn</strong> - người sáng lập Nui Tea, lớn lên giữa thiên nhiên, mang trong mình tình yêu với lá trà, với đất trời và khát vọng lan tỏa giá trị thuần khiết ấy đến mọi người.</p>
                                        <p>Mỗi buổi sáng, khi ánh nắng đầu tiên chiếu lên sườn núi, cũng là lúc những búp trà non được hái bằng đôi tay trân trọng của người nông dân.</p>
                                    </div>
                                    <div className="chapter-icon">🏔️</div>
                                </div>
                            </div>

                            <div className="story-transition animate-in">
                                <div className="transition-line"></div>
                                <div className="transition-icon">🍃</div>
                            </div>

                            <div className="story-chapter chapter-2 animate-in">
                                <div className="chapter-background shop-bg">
                                    <div className="floating-leaves">
                                        <div className="leaf leaf-1">🍃</div>
                                        <div className="leaf leaf-2">🌿</div>
                                        <div className="leaf leaf-3">🍂</div>
                                    </div>
                                </div>
                                <div className="chapter-content">
                                    <div className="chapter-number">Chương 2</div>
                                    <h3 className="chapter-title">Hành trình vượt núi</h3>
                                    <div className="chapter-text">
                                        <p>Bắt đầu từ một cửa hàng nhỏ dưới chân núi, <strong>Kiều Văn Sơn</strong> và Nui Tea đã trải qua nhiều thử thách...</p>
                                        <p>Từ những ngày đầu tự tay pha chế, phục vụ từng vị khách đầu tiên, đến khi trở thành chuỗi thương hiệu được yêu thích.</p>
                                        <p>Mỗi ly trà sữa là một câu chuyện về hành trình vượt núi, chọn lá, ủ trà và gửi gắm tâm huyết của <strong>Kiều Văn Sơn</strong> cùng cả một tập thể.</p>
                                    </div>
                                    <div className="chapter-icon">🏪</div>
                                </div>
                            </div>

                            <div className="story-transition animate-in">
                                <div className="transition-line"></div>
                                <div className="transition-icon">🌟</div>
                            </div>

                            <div className="story-chapter chapter-3 animate-in">
                                <div className="chapter-background community-bg">
                                    <div className="floating-stars">
                                        <div className="star star-1">⭐</div>
                                        <div className="star star-2">✨</div>
                                        <div className="star star-3">💫</div>
                                    </div>
                                </div>
                                <div className="chapter-content">
                                    <div className="chapter-number">Chương 3</div>
                                    <h3 className="chapter-title">Kết nối cộng đồng</h3>
                                    <div className="chapter-text">
                                        <p>Ngày nay, dưới sự dẫn dắt của <strong>Kiều Văn Sơn</strong>, Nui Tea không chỉ là điểm đến của những người yêu trà sữa...</p>
                                        <p>Mà còn là nơi kết nối cộng đồng, lan tỏa cảm hứng sống xanh, sống lành mạnh và trân trọng từng giá trị tự nhiên mà núi rừng ban tặng.</p>
                                        <p>Đó là hành trình của sự kiên trì, sáng tạo và lòng biết ơn với thiên nhiên - tất cả bắt đầu từ tình yêu và đam mê của <strong>Kiều Văn Sơn</strong> với lá trà.</p>
                                    </div>
                                    <div className="chapter-icon">🤝</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Giá trị cốt lõi */}
                <section className="about-section-modern values-section" ref={addToRefs}>
                    <div className="section-content">
                        <div className="section-header">
                            <div className="section-icon">🌱</div>
                            <h2>Giá trị cốt lõi</h2>
                            <div className="section-line"></div>
                        </div>
                        <div className="values-grid">
                            <div className="value-card">
                                <div className="value-icon">☘️</div>
                                <h3>Nguyên liệu tự nhiên</h3>
                                <p>Chỉ sử dụng lá trà tươi ngon từ các vùng núi cao, đảm bảo vị trà thuần khiết và giàu dưỡng chất.</p>
                            </div>
                            <div className="value-card">
                                <div className="value-icon">🧊</div>
                                <h3>Quy trình sạch</h3>
                                <p>Tuân thủ quy trình vệ sinh nghiêm ngặt, ứng dụng công nghệ hiện đại nhưng giữ trọn hương vị truyền thống.</p>
                            </div>
                            <div className="value-card">
                                <div className="value-icon">💚</div>
                                <h3>Bảo vệ môi trường</h3>
                                <p>Ưu tiên vật liệu thân thiện, giảm thiểu rác thải nhựa và tổ chức các hoạt động bảo vệ môi trường.</p>
                            </div>
                            <div className="value-card">
                                <div className="value-icon">🤎</div>
                                <h3>Phục vụ tận tâm</h3>
                                <p>Đội ngũ luôn đặt khách hàng làm trung tâm, phục vụ bằng cả trái tim và sự chuyên nghiệp.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Cam kết */}
                <section className="about-section-modern commitment-section" ref={addToRefs}>
                    <div className="section-content">
                        <div className="section-header">
                            <div className="section-icon">🤝</div>
                            <h2>Cam kết với khách hàng</h2>
                            <div className="section-line"></div>
                        </div>
                        <div className="commitment-content">
                            <div className="commitment-text">
                                <div className="commitment-quote">
                                    <div className="quote-icon">💝</div>
                                    <p>"Chúng tôi cam kết mỗi sản phẩm đến tay khách hàng đều là kết tinh của sự chọn lọc kỹ lưỡng, kiểm soát chất lượng nghiêm ngặt và lòng đam mê với trà sữa."</p>
                                </div>
                                <div className="commitment-features">
                                    <div className="feature-item">
                                        <div className="feature-icon">🌿</div>
                                        <div className="feature-text">
                                            <h4>Nguyên liệu tươi ngon</h4>
                                            <p>100% tự nhiên, không chất bảo quản</p>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <div className="feature-icon">⚡</div>
                                        <div className="feature-text">
                                            <h4>Phục vụ nhanh chóng</h4>
                                            <p>Đảm bảo thời gian giao hàng</p>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <div className="feature-icon">💎</div>
                                        <div className="feature-text">
                                            <h4>Chất lượng đỉnh cao</h4>
                                            <p>Kiểm soát nghiêm ngặt từ A-Z</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="commitment-stats">
                                <div className="stat-card">
                                    <div className="stat-icon">🌱</div>
                                    <div className="stat-number">100%</div>
                                    <div className="stat-label">Tự nhiên</div>
                                    <div className="stat-desc">Không chất bảo quản</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">⏰</div>
                                    <div className="stat-number">24/7</div>
                                    <div className="stat-label">Hỗ trợ</div>
                                    <div className="stat-desc">Luôn sẵn sàng phục vụ</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">⭐</div>
                                    <div className="stat-number">5★</div>
                                    <div className="stat-label">Chất lượng</div>
                                    <div className="stat-desc">Được khách hàng tin tưởng</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">🚚</div>
                                    <div className="stat-number">30'</div>
                                    <div className="stat-label">Giao hàng</div>
                                    <div className="stat-desc">Nhanh chóng, an toàn</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="about-section-modern cta-section" ref={addToRefs}>
                    <div className="cta-background">
                        <div className="cta-pattern">
                            <div className="pattern-leaf leaf-1">🍃</div>
                            <div className="pattern-leaf leaf-2">🌿</div>
                            <div className="pattern-leaf leaf-3">🍂</div>
                            <div className="pattern-leaf leaf-4">🌱</div>
                        </div>
                    </div>
                    <div className="cta-content">
                        <div className="cta-icon">🌟</div>
                        <h2>Khám phá hương vị Nui Tea!</h2>
                        <p>Hãy cùng chúng tôi trải nghiệm những hương vị tuyệt vời từ núi rừng</p>
                        <div className="cta-buttons">
                            <a href="/menu" className="cta-btn primary">
                                <span className="btn-icon">🍃</span>
                                <span className="btn-text">Xem Menu</span>
                            </a>
                            <a href="#contact" className="cta-btn secondary">
                                <span className="btn-icon">📞</span>
                                <span className="btn-text">Liên hệ</span>
                            </a>
                        </div>
                        <div className="cta-decoration">
                            <div className="decoration-line"></div>
                            <div className="decoration-dot"></div>
                            <div className="decoration-line"></div>
                        </div>
                    </div>
                </section>

                {/* Author Section */}
                <section className="about-section-modern author-section" ref={addToRefs}>
                    <div className="section-content">
                        <div className="section-header">
                            <div className="section-icon">👨‍💻</div>
                            <h2>Tác giả</h2>
                            <div className="section-line"></div>
                        </div>
                        <div className="author-content">
                            <div className="author-card">
                                <div className="author-avatar">
                                    <div className="avatar-icon">👨‍💻</div>
                                </div>
                                <div className="author-info">
                                    <h3 className="author-name">Kiều Vân Sơn</h3>
                                    <p className="author-title">Nhà sáng lập & CEO</p>
                                    <p className="author-description">
                                        Với niềm đam mê bất tận với trà sữa và công nghệ, Kiều Vân Sơn đã tạo ra Nui Tea 
                                        như một sự kết hợp hoàn hảo giữa hương vị truyền thống và công nghệ hiện đại. 
                                        Anh luôn tin rằng mỗi ly trà sữa không chỉ là một thức uống, mà còn là một 
                                        trải nghiệm, một câu chuyện về tình yêu với thiên nhiên và con người.
                                    </p>
                                    <div className="author-quote">
                                        <div className="quote-icon">💝</div>
                                        <p>"Mỗi ly trà sữa là một tác phẩm nghệ thuật, mỗi khách hàng là một người bạn."</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
} 