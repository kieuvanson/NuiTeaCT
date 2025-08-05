/* eslint-disable */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginModal({ onClose, onRegister, onForgot, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            let url = 'http://localhost:5249/api/customers/login';
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess('Đăng nhập thành công!');
                const userData = data.customer || data;
                // Chuẩn hóa user để luôn có trường role (chữ thường)
                const normalizedUser = {
                    ...userData,
                    role: userData.role || userData.Role || '',
                };
                if (onLoginSuccess) onLoginSuccess(normalizedUser);
                localStorage.setItem('nui_tea_user', JSON.stringify(normalizedUser));

                // Kiểm tra nếu là admin thì chuyển đến trang admin
                if (normalizedUser.role === 'admin' || normalizedUser.email === 'admin@nuitea.com') {
                    // Reload trang để cập nhật state và chuyển đến trang admin
                    window.location.href = '/admin';
                } else {
                    navigate('/');
                }
            } else {
                setError(data.message || 'Đăng nhập thất bại!');
            }
        } catch (err) {
            setError('Lỗi kết nối server!');
        }
        setLoading(false);
    };

    return (
        <div className="login-modal-overlay">
            <div className="login-modal">
                {onClose && <button className="login-modal-close" onClick={onClose}>&times;</button>}
                <h2>Đăng nhập tài khoản</h2>
                <form className="login-form" onSubmit={handleLogin}>
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Nhập email" required />
                    <label>Mật khẩu</label>
                    <div className="login-password-row">
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Nhập mật khẩu" required />
                        <button type="button" className="show-hide-btn" onClick={() => setShowPassword(v => !v)}>{showPassword ? 'Ẩn' : 'Hiện'}</button>
                    </div>
                    <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
                </form>
                {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
                {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
                <div className="login-modal-footer">
                    <span>Bạn chưa có tài khoản? <a href="#" onClick={e => { e.preventDefault(); onRegister && onRegister(); }}>Đăng ký</a></span>
                    <br />
                    <span><a href="#" onClick={e => { e.preventDefault(); onForgot && onForgot(); }}>Quên mật khẩu?</a></span>
                </div>
            </div>
        </div>
    );
}

export default LoginModal; 