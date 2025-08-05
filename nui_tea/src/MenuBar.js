import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MenuBar() {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check if user is admin when component mounts
        const checkAdminStatus = () => {
            const userData = localStorage.getItem('nui_tea_user');
            if (userData) {
                const user = JSON.parse(userData);
                setIsAdmin(user.role === 'admin');
            }
        };

        checkAdminStatus();
        // Listen for storage changes
        window.addEventListener('storage', checkAdminStatus);
        return () => window.removeEventListener('storage', checkAdminStatus);
    }, []);

    return (
        <div className="menu-bar">
            {/* Menu items */}
            <button
                onClick={() => navigate('/')}
                style={{ marginRight: 16, background: 'none', border: 'none', color: '#b8860b', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}
            >
                Trang chủ
            </button>
            <button
                onClick={() => navigate('/menu')}
                style={{ marginRight: 16, background: 'none', border: 'none', color: '#b8860b', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}
            >
                Thực đơn
            </button>
            {/* Admin Panel Button - only shown for admin users */}
            {isAdmin && (
                <button
                    onClick={() => navigate('/admin')}
                    style={{
                        padding: '8px 16px',
                        marginLeft: '10px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Quản trị viên
                </button>
            )}
        </div>
    );
} 