import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartIcon from './CartIcon';
import OrderHistory from './OrderHistory';
import { API_BASE_URL } from '../config';

function MenuBar({ user, setUser, setPage, onMenuScroll, setShowLogin, setShowCart }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Kiểm tra thông báo mới mỗi 30 giây
  useEffect(() => {
    if (!user) {
      // Clear thông báo khi user đăng xuất
      setNotifications([]);
      setAllNotifications([]);
      return;
    }

    const checkNotifications = async () => {
      if (!user || !user.email) {
        console.log('User or user.email is null in MenuBar:', user);
        return;
      }

      try {
                    const response = await fetch(`${API_BASE_URL}/api/orders?customerEmail=${encodeURIComponent(user.email)}`);
        if (response.ok) {
          const orders = await response.json();
          const newNotifications = orders
            .filter(order => order.orderStatus !== 'Đã hoàn thành' && order.orderStatus !== 'Đã hủy')
            .map(order => ({
              id: order.id,
              orderNumber: order.orderNumber,
              status: order.orderStatus,
              message: `Đơn hàng #${order.orderNumber} - ${order.orderStatus}`
            }));
          setNotifications(newNotifications);
          setAllNotifications(newNotifications);
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra thông báo:', error);
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 30000); // Kiểm tra mỗi 30 giây

    return () => clearInterval(interval);
  }, [user]); // Loại bỏ allNotifications khỏi dependency

  // Hàm helper để lấy màu cho trạng thái
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

  // Hàm helper để lấy thông báo cho trạng thái
  const getStatusMessage = (status) => {
    switch (status) {
      case 'Đã đặt hàng': return 'Đơn hàng của bạn đã được đặt thành công và đang chờ xác nhận.';
      case 'Đã xác nhận': return 'Đơn hàng đã được xác nhận và đang được chuẩn bị.';
      case 'Đang chuẩn bị': return 'Đơn hàng đang được chuẩn bị, sẽ sẵn sàng giao hàng sớm.';
      case 'Đang giao hàng': return 'Đơn hàng đang được giao đến địa chỉ của bạn.';
      case 'Đã hoàn thành': return 'Đơn hàng đã được giao thành công.';
      case 'Đã hủy': return 'Đơn hàng đã bị hủy.';
      default: return 'Đơn hàng đang được xử lý.';
    }
  };

  return (
    <>
      <nav className="menu-bar-modern">
        {/* Logo */}
        <div className="menu-bar-logo" onClick={() => { setPage('home'); navigate('/'); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none" style={{ marginRight: 6 }}>
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
          <span className="menu-bar-logo-text" style={{
            fontFamily: 'Dancing Script, Segoe UI, Roboto, cursive, sans-serif',
            fontSize: isMobile ? '1.8rem' : '2.1rem',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #b48c5a 60%, #fff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center'
          }}>nui_tea</span>
        </div>

        {/* Desktop Menu */}
        <ul className="menu-bar-list" style={{
          display: isMobile ? 'none' : 'flex',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          gap: '32px',
          alignItems: 'center'
        }}>
          <li onClick={() => { setPage('home'); navigate('/'); }} style={{ cursor: 'pointer', fontWeight: 600, color: '#333', transition: 'color 0.2s' }}>Trang chủ</li>
          <li onClick={() => navigate('/menu')} style={{ cursor: 'pointer', fontWeight: 600, color: '#333', transition: 'color 0.2s' }}>Thực đơn</li>
          <li onClick={() => { setPage('about'); navigate('/about'); }} style={{ cursor: 'pointer', fontWeight: 600, color: '#333', transition: 'color 0.2s' }}>Giới thiệu</li>
          <li onClick={() => onMenuScroll && onMenuScroll('promo')} style={{ cursor: 'pointer', fontWeight: 600, color: '#333', transition: 'color 0.2s' }}>Khuyến mãi</li>
          <li onClick={() => onMenuScroll && onMenuScroll('contact')} style={{ cursor: 'pointer', fontWeight: 600, color: '#333', transition: 'color 0.2s' }}>Liên hệ</li>
        </ul>

        {/* Desktop User Actions */}
        <div className="menu-bar-user" style={{
          position: 'relative',
          display: isMobile ? 'none' : 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <CartIcon onClick={() => setShowCart && setShowCart(true)} />
          <button
            onClick={() => {
              if (!user) {
                alert('Vui lòng đăng nhập để xem thông báo');
                setShowLogin && setShowLogin(true);
                return;
              }
              setShowNotifications(true);
              setNotifications([]);
            }}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              color: '#999',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.7
            }}
          >
            🔔
            {user && notifications.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: '#e74c3c',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                animation: 'pulse 2s infinite'
              }}>
                {notifications.length}
              </span>
            )}
          </button>
          {user ? (
            <>
              <div onClick={() => setUserMenuOpen(v => !v)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#b48c5a"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 8-4 8-4s8 0 8 4" /></svg>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{user.FullName || user.Username || user.email}</span>
              </div>
              {userMenuOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 36,
                  background: '#fff',
                  border: '1px solid #eee',
                  borderRadius: 10,
                  boxShadow: '0 4px 24px #b8860b22',
                  minWidth: 160,
                  zIndex: 100
                }}>
                  <div style={{ padding: 12, borderBottom: '1px solid #eee', fontWeight: 600, fontSize: '14px' }}>{user.email}</div>
                  <div style={{ padding: 12, cursor: 'pointer' }} onClick={() => { setUser(null); localStorage.removeItem('nui_tea_user'); setUserMenuOpen(false); }}>Đăng xuất</div>
                </div>
              )}
            </>
          ) : (
            <button onClick={() => setShowLogin && setShowLogin(true)} style={{
              background: 'linear-gradient(90deg,#b8860b,#e5d3b3)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer'
            }}>Đăng nhập</button>
          )}
        </div>

        {/* Mobile Menu Button */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CartIcon onClick={() => setShowCart && setShowCart(true)} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hamburger-button"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1001
              }}
            >
              <div className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} style={{
                width: '24px',
                height: '3px',
                background: '#333',
                borderRadius: '2px',
                transition: 'all 0.3s'
              }}></div>
              <div className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} style={{
                width: '24px',
                height: '3px',
                background: '#333',
                borderRadius: '2px',
                transition: 'all 0.3s'
              }}></div>
              <div className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} style={{
                width: '24px',
                height: '3px',
                background: '#333',
                borderRadius: '2px',
                transition: 'all 0.3s'
              }}></div>
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && isMobile && (
        <div className="mobile-menu-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1002,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <div style={{
            background: '#fff',
            width: '280px',
            height: '100vh',
            padding: '20px',
            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            zIndex: 1003
          }}>
            {/* Mobile Menu Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #eee',
              paddingBottom: '16px'
            }}>
              <span style={{ fontWeight: 700, fontSize: '18px', color: '#333' }}>Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  zIndex: 1004
                }}
              >
                ×
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div onClick={() => { setPage('home'); navigate('/'); setMobileMenuOpen(false); }} style={{ padding: '12px', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s', zIndex: 1004 }}>🏠 Trang chủ</div>
              <div onClick={() => { navigate('/menu'); setMobileMenuOpen(false); }} style={{ padding: '12px', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s', zIndex: 1004 }}>🍽️ Thực đơn</div>
              <div onClick={() => { setPage('about'); navigate('/about'); setMobileMenuOpen(false); }} style={{ padding: '12px', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s', zIndex: 1004 }}>ℹ️ Giới thiệu</div>
              <div onClick={() => { onMenuScroll && onMenuScroll('promo'); setMobileMenuOpen(false); }} style={{ padding: '12px', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s', zIndex: 1004 }}>🎉 Khuyến mãi</div>
              <div onClick={() => { onMenuScroll && onMenuScroll('contact'); setMobileMenuOpen(false); }} style={{ padding: '12px', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s', zIndex: 1004 }}>📞 Liên hệ</div>
            </div>

            {/* Mobile User Section */}
            <div style={{ marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '16px' }}>
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#b48c5a"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 8-4 8-4s8 0 8 4" /></svg>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{user.FullName || user.Username || user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (!user) {
                        alert('Vui lòng đăng nhập để xem thông báo');
                        setShowLogin && setShowLogin(true);
                        return;
                      }
                      setShowNotifications(true);
                      setNotifications([]);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'none',
                      border: 'none',
                      padding: '12px',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      position: 'relative'
                    }}
                  >
                    🔔 Thông báo
                    {user && notifications.length > 0 && (
                      <span style={{
                        position: 'absolute',
                        right: '12px',
                        background: '#e74c3c',
                        color: 'white',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}>
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => { setUser(null); localStorage.removeItem('nui_tea_user'); setMobileMenuOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'none',
                      border: 'none',
                      padding: '12px',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      color: '#e74c3c'
                    }}
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setShowLogin && setShowLogin(true); setMobileMenuOpen(false); }}
                  style={{
                    background: 'linear-gradient(90deg,#b8860b,#e5d3b3)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 16px',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Đăng nhập
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1003
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '1px solid #eee',
              paddingBottom: '12px'
            }}>
              <h2 style={{ margin: 0, color: '#333', fontSize: '1.5rem' }}>🔔 Thông báo đơn hàng</h2>
              <button
                onClick={() => setShowNotifications(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              {allNotifications.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
                  Không có thông báo đơn hàng nào
                </p>
              ) : (
                <div>
                  <p style={{ color: '#666', marginBottom: '16px' }}>
                    Bạn có {allNotifications.length} đơn hàng đang được xử lý:
                  </p>
                  {allNotifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      style={{
                        background: '#f8f9fa',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        border: '1px solid #e9ecef',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#e9ecef';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#f8f9fa';
                        e.target.style.transform = 'translateY(0)';
                      }}
                      onClick={() => {
                        setShowNotifications(false);
                        // Lưu thông tin đơn hàng vào localStorage để OrderStatusPage có thể đọc
                        const orderData = {
                          id: notification.id,
                          orderNumber: notification.orderNumber,
                          orderStatus: notification.status,
                          customerName: notification.customerName || 'N/A',
                          phone: notification.phone || 'N/A',
                          address: notification.address || 'N/A',
                          items: notification.items || [],
                          totalAmount: notification.totalAmount || 0,
                          paymentMethod: notification.paymentMethod || 'N/A',
                          paymentStatus: notification.paymentStatus || 'Chưa thanh toán',
                          createdAt: notification.createdAt || new Date().toISOString(),
                          estimatedDelivery: notification.estimatedDelivery || null
                        };
                        localStorage.setItem('currentOrder', JSON.stringify(orderData));
                        // Chuyển đến trang chi tiết đơn hàng
                        navigate(`/order-status/${notification.id}`);
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <strong style={{ color: '#333', fontSize: '1.1rem' }}>
                          Đơn hàng #{notification.orderNumber}
                        </strong>
                        <span style={{
                          background: getStatusColor(notification.status),
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}>
                          {notification.status}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: '#666' }}>
                        {getStatusMessage(notification.status)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowNotifications(false)}
                style={{
                  background: 'linear-gradient(90deg, #b8860b, #e5d3b3)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order History Modal */}
      {showOrderHistory && (
        <OrderHistory isOpen={showOrderHistory} onClose={() => setShowOrderHistory(false)} user={user} />
      )}
    </>
  );
}

export default MenuBar; 