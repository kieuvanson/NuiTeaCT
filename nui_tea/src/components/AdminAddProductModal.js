  import React, { useState, useEffect } from 'react';
import './CartModal.css'; // Sử dụng style chung với CartModal
import { API_BASE_URL } from '../config';

function AdminAddProductModal({ open, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load danh sách categories khi mở modal
  useEffect(() => {
    if (open) {
      fetch(`${API_BASE_URL}/productcategories`)
        .then(res => res.json())
        .then(data => setCategories(data))
        .catch(err => console.error('Error loading categories:', err));
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let categoryId;

      // Nếu chọn category có sẵn
      if (selectedCategory) {
        categoryId = parseInt(selectedCategory);
      }
      // Nếu tạo category mới
      else if (categoryName) {
        // Tạo category mới
        const categoryRes = await fetch(`${API_BASE_URL}/productcategories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: categoryName,
            description: categoryDescription || categoryName // Sử dụng tên category làm description nếu không có
          })
        });

        if (!categoryRes.ok) {
          const errorData = await categoryRes.json();
          throw new Error(errorData.errors?.["Category.Description"]?.[0] || 'Không thể tạo danh mục sản phẩm mới');
        }

        const newCategory = await categoryRes.json();
        categoryId = newCategory.id;
      } else {
        throw new Error('Vui lòng chọn hoặc tạo danh mục sản phẩm');
      }

      let category;
      if (selectedCategory) {
        const foundCat = categories.find(c => c.id === parseInt(selectedCategory));
        category = {
          id: foundCat.id,
          name: foundCat.name,
          description: foundCat.description || foundCat.name || 'No description'
        };
      } else {
        category = {
          name: categoryName,
          description: categoryDescription || categoryName
        };
      }

      const productData = {
        name: name,
        price: parseFloat(price),
        description: description || name,
        image: image || '',
        categoryId: selectedCategory ? parseInt(selectedCategory) : categoryId,
       
      };

      // Gửi request tạo sản phẩm
      const productRes = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      // Xử lý response
      if (!productRes.ok) {
        const errorData = await productRes.json();
        throw new Error(errorData.message || 'Không thể tạo sản phẩm mới');
      }

      // Nếu thành công
      const newProduct = await productRes.json();

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal" style={{ maxWidth: 500 }}>
        <button className="login-modal-close" onClick={onClose}>&times;</button>
        <h2>Thêm sản phẩm mới</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Tên sản phẩm *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nhập tên sản phẩm"
            required
          />

          <label>Giá (VND) *</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="Nhập giá"
            required
            min="0"
          />

          <label>Mô tả</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Nhập mô tả sản phẩm"
            rows="3"
          />

          <label>Ảnh URL</label>
          <input
            type="url"
            value={image}
            onChange={e => setImage(e.target.value)}
            placeholder="Nhập URL ảnh sản phẩm"
          />

          <label>Danh mục sản phẩm *</label>
          <div style={{ marginBottom: 20 }}>
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                if (e.target.value) {
                  setCategoryName('');
                  setCategoryDescription('');
                }
              }}
              style={{ marginBottom: 10, width: '100%' }}
            >
              <option value="">-- Tạo danh mục mới --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {!selectedCategory && (
              <div style={{ marginTop: 10 }}>
                <div>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={e => setCategoryName(e.target.value)}
                    placeholder="Tên danh mục mới *"
                    style={{ marginBottom: 10 }}
                    required={!selectedCategory}
                  />
                </div>
                <div>
                  <textarea
                    value={categoryDescription}
                    onChange={e => setCategoryDescription(e.target.value)}
                    placeholder="Mô tả danh mục *"
                    rows="2"
                    required={!selectedCategory}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading || (!selectedCategory && !categoryName)}
          >
            {loading ? 'Đang thêm...' : 'Thêm sản phẩm'}
          </button>
        </form>

        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
    </div>
  );
}

export default AdminAddProductModal;
