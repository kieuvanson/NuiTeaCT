import React from 'react';

function DeleteProductModal({ open, onClose, onDelete, product }) {
  if (!open || !product) return null;
  return (
    <div className="login-modal-overlay" style={{
      background: 'rgba(0,0,0,0.3)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="login-modal" style={{ maxWidth: 400, background: '#fffaf3', borderRadius: 16, boxShadow: '0 8px 40px #b8860b33', padding: 32, position: 'relative', border: '2px solid #b8860b' }}>
        <button className="login-modal-close" onClick={onClose} style={{ position: 'absolute', top: 12, right: 18, fontSize: 22, color: '#b8860b', background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
        <h3 style={{ color: '#b8860b', fontWeight: 800, fontSize: 20, marginBottom: 18 }}>Xác nhận xóa sản phẩm</h3>
        <div style={{ marginBottom: 24, color: '#7c4d03', fontSize: 16 }}>
          Bạn có chắc chắn muốn xóa sản phẩm <b>{product.name}</b> không?
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
          <button onClick={onClose} style={{ background: '#eee', color: '#7c4d03', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Hủy</button>
          <button onClick={() => onDelete(product)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Xóa</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteProductModal;
