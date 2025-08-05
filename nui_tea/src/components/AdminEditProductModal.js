import React, { useState, useEffect } from 'react';

function AdminEditProductModal({ open, onClose, product, categories, onSuccess }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [isSoldOut, setIsSoldOut] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && product) {
            setName(product.name || '');
            setPrice(product.price || '');
            setDescription(product.description || '');
            setImage(product.image || '');
            setCategoryId(product.categoryId || (product.category?.id) || '');
            setIsSoldOut(product.isSoldOut || false);
            setError('');
        }
    }, [open, product]);

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const productData = {
                Name: name,
                Price: Number(price),
                Description: description,
                Image: image,
                CategoryId: Number(categoryId),
                IsActive: true,
                IsSoldOut: isSoldOut,
                CreatedAt: product.createdAt || new Date().toISOString()
            };
            const res = await fetch(`http://localhost:5249/api/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            const data = await res.json();
            if (res.ok) {
                onSuccess && onSuccess();
                onClose();
            } else {
                let errorMsg = data.message || '';
                if (data.errors) {
                    errorMsg += Object.values(data.errors).flat().join(' | ');
                }
                if (!errorMsg) errorMsg = 'Cập nhật sản phẩm thất bại!';
                setError(errorMsg);
            }
        } catch (err) {
            setError('Lỗi kết nối server!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="login-modal-overlay"
            style={{
                background: 'rgba(0,0,0,0.5)',
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div className="login-modal" style={{ maxWidth: 600, minWidth: 400, width: '100%', height: '80vh', border: '3px solid #b8860b', background: '#fffaf3', zIndex: 10000, borderRadius: 18, position: 'relative', padding: 32, boxShadow: '0 8px 40px #b8860b33', margin: 'auto', overflow: 'auto' }}>
                <button className="login-modal-close" onClick={onClose} style={{ position: 'absolute', top: 12, right: 18, fontSize: 24, color: '#b8860b', background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
                <h2 style={{ color: '#b8860b', fontWeight: 800, fontSize: 24, marginBottom: 16 }}>Sửa sản phẩm</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label style={{ fontWeight: 600, color: '#7c4d03' }}>Tên sản phẩm *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder="Nhập tên sản phẩm"
                        style={{ padding: 12, borderRadius: 10, border: '1.5px solid #e0c9a6', fontSize: 17, marginBottom: 10 }}
                    />

                    <label style={{ fontWeight: 600, color: '#7c4d03' }}>Giá (VND) *</label>
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        required
                        min="0"
                        placeholder="Nhập giá"
                        style={{ padding: 12, borderRadius: 10, border: '1.5px solid #e0c9a6', fontSize: 17, marginBottom: 10 }}
                    />

                    <label style={{ fontWeight: 600, color: '#7c4d03' }}>Mô tả</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Nhập mô tả sản phẩm"
                        rows="3"
                        style={{ padding: 12, borderRadius: 10, border: '1.5px solid #e0c9a6', fontSize: 16, marginBottom: 10 }}
                    />

                    <label style={{ fontWeight: 600, color: '#7c4d03' }}>Ảnh URL</label>
                    <input
                        type="url"
                        value={image}
                        onChange={e => setImage(e.target.value)}
                        placeholder="Nhập URL ảnh sản phẩm"
                        style={{ padding: 12, borderRadius: 10, border: '1.5px solid #e0c9a6', fontSize: 17, marginBottom: 10 }}
                    />

                    <label style={{ fontWeight: 600, color: '#7c4d03' }}>Danh mục sản phẩm *</label>
                    <select
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        required
                        style={{ marginBottom: 24, width: '100%', padding: 12, borderRadius: 10, border: '1.5px solid #e0c9a6', fontSize: 17 }}
                    >
                        <option value="">-- Chọn loại sản phẩm --</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 24 }}>
                        <input
                            type="checkbox"
                            checked={isSoldOut}
                            onChange={e => setIsSoldOut(e.target.checked)}
                            style={{ width: 18, height: 18 }}
                        />
                        <span style={{ fontWeight: 600, color: '#7c4d03' }}>Đánh dấu hết hàng</span>
                    </label>

                    <button
                        type="submit"
                        className="login-btn"
                        style={{ background: 'linear-gradient(90deg,#b8860b,#e5d3b3)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 0', fontWeight: 700, fontSize: 19, marginTop: 10, boxShadow: '0 2px 8px #b8860b33', letterSpacing: 1 }}
                        disabled={loading}
                    >
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </form>
                {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
            </div>
        </div>
    );
}

export default AdminEditProductModal; 