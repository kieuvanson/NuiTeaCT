# Hướng dẫn triển khai NUiTeaplus

## 🚀 **Kiến trúc triển khai:**

- **Backend:** Railway.com (.NET API)
- **Frontend:** Vercel.com (React)
- **Database:** MySQL trên Railway

## 📋 **Bước 1: Deploy Backend trên Railway**

### **1.1 Tạo Database MySQL**
1. Đăng nhập Railway.com
2. Tạo project mới
3. Thêm MySQL service
4. Lấy connection string

### **1.2 Deploy Backend API**
1. Thêm Web Service
2. Connect GitHub repo
3. Chọn thư mục `NuiTeaApi`
4. Railway tự động detect .NET

### **1.3 Cấu hình Environment Variables**
- `DATABASE_URL` = Connection string từ MySQL
- `ASPNETCORE_ENVIRONMENT` = `Production`

## 📋 **Bước 2: Deploy Frontend trên Vercel**

### **2.1 Tạo Vercel Project**
1. Đăng nhập Vercel.com
2. Import GitHub repository
3. Chọn thư mục `nui_tea`
4. Vercel tự động detect React

### **2.2 Cấu hình Environment Variables**
- `REACT_APP_API_URL` = URL của backend Railway

## 🔧 **Cấu hình kết nối:**

### **Backend (Railway):**
- Port: 3000 (Railway standard)
- Health check: `/health`
- CORS: Cho phép tất cả domain

### **Frontend (Vercel):**
- Build command: `npm run build`
- Output directory: `build`
- API calls: Sử dụng `REACT_APP_API_URL`

## ✅ **Kiểm tra triển khai:**

1. **Backend:** `https://your-app.railway.app/health`
2. **Frontend:** `https://your-app.vercel.app`

## 🛠️ **Troubleshooting:**

### **Lỗi database connection:**
- Kiểm tra `DATABASE_URL` format
- Đảm bảo MySQL service đang chạy

### **Lỗi CORS:**
- Backend đã cấu hình `AllowAll`
- Kiểm tra domain frontend

### **Lỗi build:**
- Kiểm tra .NET version (8.0)
- Kiểm tra dependencies 