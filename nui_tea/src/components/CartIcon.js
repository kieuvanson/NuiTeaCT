import React from 'react';
import { useCart } from '../contexts/CartContext';

export default function CartIcon({ onClick, className = '' }) {
    const { getTotalItems } = useCart();
    const totalItems = getTotalItems();

    return (
        <div
            className={`cart-icon ${className}`}
            onClick={onClick}
            style={{
                position: 'relative',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #b8860b, #e5d3b3)',
                color: '#fff',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(184, 134, 11, 0.3)'
            }}
            onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 4px 12px rgba(184, 134, 11, 0.4)';
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 2px 8px rgba(184, 134, 11, 0.3)';
            }}
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>

            {totalItems > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#ff4757',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        border: '2px solid #fff',
                        animation: totalItems > 0 ? 'cart-badge-pulse 0.6s ease-in-out' : 'none'
                    }}
                >
                    {totalItems > 99 ? '99+' : totalItems}
                </div>
            )}

            <style>{`
        @keyframes cart-badge-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
        </div>
    );
} 