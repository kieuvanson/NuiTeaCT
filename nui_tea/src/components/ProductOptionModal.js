import React, { useState } from 'react';

const SIZES = [
    { label: 'Size M', value: 'M' },
    { label: 'Size L', value: 'L' }
];
const TYPES = [
    { label: 'Lạnh', value: 'lanh' },
    { label: 'Nóng', value: 'nong' }
];
const SUGARS = [
    { label: '100% đường', value: '100%' },
    { label: '70% đường', value: '70%' },
    { label: '50% đường', value: '50%' },
    { label: '30% đường', value: '30%' },
    { label: 'Không đường', value: '0%' }
];
const TOPPINGS = [
    { label: 'Trân châu đen (+7k)', value: 'tran-chau-den' },
    { label: 'Thạch dừa (+5k)', value: 'thach-dua' },
    { label: 'Pudding trứng (+6k)', value: 'pudding-trung' },
    { label: 'Kem cheese (+8k)', value: 'kem-cheese' },
    { label: 'Thạch trái cây (+5k)', value: 'thach-trai-cay' }
];

// Topping cho trà sữa (có sẵn chân châu)
const MILK_TEA_TOPPINGS = [
    { label: 'Thêm trân châu đen (+5k)', value: 'tran-chau-den' },
    { label: 'Thạch dừa (+3k)', value: 'thach-dua' },
    { label: 'Pudding trứng (+4k)', value: 'pudding-trung' },
    { label: 'Kem cheese (+6k)', value: 'kem-cheese' },
    { label: 'Thạch trái cây (+3k)', value: 'thach-trai-cay' }
];

// Topping cho trà hoa quả (có sẵn thạch đào)
const FRUIT_TEA_TOPPINGS = [
    { label: 'Thêm thạch đào (+3k)', value: 'thach-dao' },
    { label: 'Thạch dừa (+3k)', value: 'thach-dua' },
    { label: 'Thạch trái cây (+3k)', value: 'thach-trai-cay' },
    { label: 'Kem cheese (+6k)', value: 'kem-cheese' }
];

function ProductOptionModal({ product, open, onClose, onConfirm }) {
    const [size, setSize] = useState('M');
    const [type, setType] = useState('lanh');
    const [sugar, setSugar] = useState('100%');
    const [quantity, setQuantity] = useState(1);
    const [toppings, setToppings] = useState([]);

    if (!open || !product) return null;

    // Xác định loại topping dựa trên category
    const getToppingsByCategory = () => {
        if (!product.category) return TOPPINGS;

        const categoryName = product.category.name?.toLowerCase() || '';
        if (categoryName.includes('trà sữa') || categoryName.includes('milk tea')) {
            return MILK_TEA_TOPPINGS;
        } else if (categoryName.includes('trà hoa quả') || categoryName.includes('fruit tea')) {
            return FRUIT_TEA_TOPPINGS;
        }
        return TOPPINGS;
    };

    const availableToppings = getToppingsByCategory();

    const handleConfirm = () => {
        console.log('Product being added to cart:', product);
        console.log('Product image:', product.image);
        onConfirm({
            ...product,
            options: { size, type, sugar, toppings },
            quantity
        });
    };

    return (
        <div
            tabIndex={-1} // Đảm bảo không bị blur khi chuyển focus
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.35)', zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 0,
                minHeight: '100vh',
                minWidth: '100vw',
                transition: 'background 0.3s',
                animation: 'fadeIn 0.2s'
            }}
        // KHÔNG có onClick, onBlur, onMouseLeave ở đây!
        >
            <div style={{
                background: '#fff', borderRadius: 18, maxWidth: 500, width: '100%',
                boxShadow: '0 8px 40px #b8860b22', padding: '32px 24px 24px 24px', position: 'relative',
                margin: '0 auto',
                maxHeight: '96vh',
                overflowY: 'auto',
                display: 'flex', flexDirection: 'column',
                animation: 'slideDown 0.25s'
            }}>
                <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 30, color: '#888', cursor: 'pointer', zIndex: 10 }}>&times;</button>
                <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 18 }}>
                    <div style={{ width: 100, height: 100, borderRadius: 14, background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {product.image ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 44 }}>{product.emoji || '🍵'}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 4 }}>{product.name}</div>
                        <div style={{ color: '#b8860b', fontWeight: 700, fontSize: 20 }}>{product.price.toLocaleString()}đ</div>
                        <div style={{ color: '#888', fontSize: 14, marginTop: 4 }}>{product.description || 'Chưa có thông tin.'}</div>
                    </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, color: '#b8860b', marginBottom: 6, display: 'block' }}>Chọn loại</label>
                    <div style={{ display: 'flex', gap: 16 }}>
                        {TYPES.map(opt => (
                            <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                                <input type="radio" name="type" value={opt.value} checked={type === opt.value} onChange={() => setType(opt.value)} />
                                {opt.label}
                            </label>
                        ))}
                    </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, color: '#b8860b', marginBottom: 6, display: 'block' }}>Chọn size</label>
                    <div style={{ display: 'flex', gap: 16 }}>
                        {SIZES.map(opt => (
                            <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                                <input type="radio" name="size" value={opt.value} checked={size === opt.value} onChange={() => setSize(opt.value)} />
                                {opt.label}
                            </label>
                        ))}
                    </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, color: '#b8860b', marginBottom: 6, display: 'block' }}>Chọn đường</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                        {SUGARS.map(opt => (
                            <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', minWidth: 100 }}>
                                <input type="radio" name="sugar" value={opt.value} checked={sugar === opt.value} onChange={() => setSugar(opt.value)} />
                                {opt.label}
                            </label>
                        ))}
                    </div>
                </div>
                {/* Topping */}
                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, color: '#b8860b', marginBottom: 6, display: 'block' }}>
                        Chọn topping
                        {product.category?.name?.toLowerCase().includes('trà sữa') &&
                            <span style={{ fontSize: 12, color: '#666', fontWeight: 400 }}> (Có sẵn trân châu đen)</span>
                        }
                        {product.category?.name?.toLowerCase().includes('trà hoa quả') &&
                            <span style={{ fontSize: 12, color: '#666', fontWeight: 400 }}> (Có sẵn thạch đào)</span>
                        }
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                        {availableToppings.map(opt => (
                            <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', minWidth: 120 }}>
                                <input
                                    type="checkbox"
                                    value={opt.value}
                                    checked={toppings.includes(opt.value)}
                                    onChange={e => {
                                        if (e.target.checked) {
                                            setToppings([...toppings, opt.value]);
                                        } else {
                                            setToppings(toppings.filter(t => t !== opt.value));
                                        }
                                    }}
                                />
                                {opt.label}
                            </label>
                        ))}
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 36, height: 36, borderRadius: 18, border: '1px solid #eee', background: '#faf8f3', color: '#b8860b', fontWeight: 700, fontSize: 22, cursor: 'pointer' }}>-</button>
                    <span style={{ fontWeight: 700, fontSize: 20 }}>{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} style={{ width: 36, height: 36, borderRadius: 18, border: '1px solid #eee', background: '#faf8f3', color: '#b8860b', fontWeight: 700, fontSize: 22, cursor: 'pointer' }}>+</button>
                </div>
                <button onClick={handleConfirm} style={{ width: '100%', padding: '16px 0', background: 'linear-gradient(90deg,#b8860b,#e5d3b3)', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 2px 8px #b8860b22' }}>Thêm vào giỏ hàng</button>
            </div>
            <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(-32px); opacity: 0.7; } to { transform: none; opacity: 1; } }
        @media (max-width: 600px) {
          .product-option-modal-content { max-width: 100vw !important; border-radius: 0 !important; padding: 18px 4px 12px 4px !important; }
        }
      `}</style>
        </div>
    );
}

export default ProductOptionModal;