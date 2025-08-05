/* eslint-disable */
import React from 'react';
import './App.css';

export default function About() {
    return (
        <div className="about-page mountain-theme">
            <div className="about-hero-mountain">
                {/* SVG núi lớn và lá trà */}
                <div className="about-mountain-bg">
                    <svg viewBox="0 0 900 260" width="100%" height="220" className="mountain-svg">
                        <defs>
                            <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#b7e0c7" />
                                <stop offset="100%" stopColor="#e0f7fa" />
                            </linearGradient>
                        </defs>
                        <path d="M0 220 Q 120 120 220 180 Q 320 240 420 120 Q 520 0 620 120 Q 720 240 900 100 L900 260 L0 260 Z" fill="url(#mountainGrad)" />
                        <ellipse cx="180" cy="120" rx="22" ry="10" fill="#7cb342" opacity="0.7" />
                        <ellipse cx="600" cy="80" rx="18" ry="8" fill="#388e3c" opacity="0.7" />
                        <ellipse cx="350" cy="60" rx="14" ry="7" fill="#a5d6a7" opacity="0.7" />
                        <ellipse cx="750" cy="150" rx="16" ry="7" fill="#81c784" opacity="0.7" />
                    </svg>
                    {/* Lá trà lớn */}
                    <svg className="about-leaf leaf1" width="48" height="48" viewBox="0 0 48 48"><path d="M24 44 Q12 24 24 4 Q36 24 24 44 Z" fill="#7cb342" stroke="#388e3c" strokeWidth="2" /></svg>
                    <svg className="about-leaf leaf2" width="32" height="32" viewBox="0 0 32 32"><path d="M16 30 Q8 16 16 2 Q24 16 16 30 Z" fill="#a5d6a7" stroke="#388e3c" strokeWidth="1.2" /></svg>
                </div>
                <div className="about-hero-content-mountain">
                    <h1 className="about-title-mountain">Về Nui Tea</h1>
                    <p className="about-slogan-mountain">Hương vị từ núi rừng, tinh hoa lá trà</p>
                    <p className="about-desc-mountain">Nui Tea là thương hiệu trà sữa hiện đại, lấy cảm hứng từ thiên nhiên, núi rừng và những lá trà tươi ngon nhất. Chúng tôi cam kết mang đến trải nghiệm trà sữa tinh tế, an toàn, chất lượng và thân thiện với môi trường.</p>
                </div>
            </div>
            <div className="about-sections-mountain">
                <div className="about-section-mountain">
                    <h2><span className="about-leaf-icon">🍃</span> Lịch sử hình thành</h2>
                    <p>Nui Tea khởi nguồn từ một vùng núi xanh mát, nơi những đồi chè trải dài bất tận, sương sớm phủ trắng và không khí trong lành. Người sáng lập Nui Tea lớn lên giữa thiên nhiên, mang trong mình tình yêu với lá trà, với đất trời và khát vọng lan tỏa giá trị thuần khiết ấy đến mọi người. Mỗi buổi sáng, khi ánh nắng đầu tiên chiếu lên sườn núi, cũng là lúc những búp trà non được hái bằng đôi tay trân trọng của người nông dân.</p>
                    <p>Bắt đầu từ một cửa hàng nhỏ dưới chân núi, Nui Tea đã trải qua nhiều thử thách, từ những ngày đầu tự tay pha chế, phục vụ từng vị khách đầu tiên, đến khi trở thành chuỗi thương hiệu được yêu thích. Chúng tôi tin rằng, mỗi ly trà sữa là một câu chuyện về hành trình vượt núi, chọn lá, ủ trà và gửi gắm tâm huyết của cả một tập thể. Đó là hành trình của sự kiên trì, sáng tạo và lòng biết ơn với thiên nhiên.</p>
                    <p>Ngày nay, Nui Tea không chỉ là điểm đến của những người yêu trà sữa, mà còn là nơi kết nối cộng đồng, lan tỏa cảm hứng sống xanh, sống lành mạnh và trân trọng từng giá trị tự nhiên mà núi rừng ban tặng.</p>
                </div>
                <div className="about-section-mountain">
                    <h2><span className="about-leaf-icon">🌱</span> Giá trị cốt lõi</h2>
                    <ul className="about-values-mountain">
                        <li>☘️ <b>Nguyên liệu tự nhiên</b>: Chúng tôi chỉ sử dụng lá trà tươi ngon, được chọn lọc kỹ lưỡng từ các vùng núi cao, đảm bảo vị trà thuần khiết và giàu dưỡng chất. Mỗi búp trà là kết tinh của đất trời, của khí hậu trong lành và bàn tay chăm sóc tận tụy.</li>
                        <li>🧊 <b>Quy trình sạch, an toàn</b>: Từ khâu thu hái, chế biến đến pha chế, mọi công đoạn đều tuân thủ quy trình vệ sinh nghiêm ngặt, ứng dụng công nghệ hiện đại nhưng vẫn giữ trọn hương vị truyền thống. Chúng tôi tin rằng sự an tâm của khách hàng là nền tảng cho sự phát triển bền vững.</li>
                        <li>💚 <b>Bảo vệ môi trường</b>: Nui Tea ưu tiên sử dụng vật liệu thân thiện, giảm thiểu rác thải nhựa, tái chế và tiết kiệm năng lượng. Chúng tôi tổ chức các hoạt động trồng cây, làm sạch môi trường, góp phần bảo vệ màu xanh của núi rừng cho thế hệ mai sau.</li>
                        <li>🤎 <b>Phục vụ tận tâm</b>: Đội ngũ Nui Tea luôn đặt khách hàng làm trung tâm, phục vụ bằng cả trái tim, lắng nghe và thấu hiểu từng nhu cầu nhỏ nhất. Chúng tôi mong muốn mỗi khách hàng khi đến với Nui Tea đều cảm nhận được sự ấm áp, thân thiện và chuyên nghiệp.</li>
                    </ul>
                    <p>Chúng tôi tin rằng, giá trị thật sự không chỉ nằm ở sản phẩm, mà còn ở trải nghiệm, cảm xúc và sự kết nối giữa con người với con người, giữa con người với thiên nhiên.</p>
                </div>
                <div className="about-section-mountain">
                    <h2><span className="about-leaf-icon">🍂</span> Cam kết với khách hàng</h2>
                    <p>Chúng tôi cam kết mỗi sản phẩm đến tay khách hàng đều là kết tinh của sự chọn lọc kỹ lưỡng, kiểm soát chất lượng nghiêm ngặt và lòng đam mê với trà sữa. Nui Tea không chỉ là một ly trà sữa, mà còn là trải nghiệm về sự an lành, tươi mới và kết nối với thiên nhiên.</p>
                    <p>Chúng tôi luôn lắng nghe ý kiến đóng góp, không ngừng đổi mới để mang lại dịch vụ tốt nhất, giá cả hợp lý và lan tỏa năng lượng tích cực đến cộng đồng. Nui Tea mong muốn trở thành người bạn đồng hành tin cậy, mang lại niềm vui, sự thư giãn và cảm hứng sống xanh cho mọi khách hàng.</p>
                    <p>Hãy cùng Nui Tea gìn giữ và lan tỏa những giá trị tốt đẹp của núi rừng, của lá trà và của tình người – để mỗi ngày đều là một hành trình mới, đầy hứng khởi và ý nghĩa.</p>
                </div>
                <div className="about-section-mountain about-cta-mountain">
                    <h2>Khám phá hương vị Nui Tea!</h2>
                    <a href="#" className="about-cta-btn-mountain"><span role="img" aria-label="leaf">🍃</span> Xem menu & Đặt hàng</a>
                </div>
            </div>
        </div>
    );
} 