# Hướng dẫn triển khai NUiTeaplus lên Render

## Bước 1: Chuẩn bị cơ sở dữ liệu

### Tùy chọn 1: Sử dụng MySQL trên Render
1. Tạo MySQL database trên Render
2. Lấy connection string từ Render dashboard
3. Cập nhật biến môi trường `DATABASE_URL` trong backend service

### Tùy chọn 2: Sử dụng PlanetScale (MySQL)
1. Tạo database trên PlanetScale
2. Lấy connection string
3. Cập nhật biến môi trường

## Bước 2: Triển khai Backend API

1. Đăng nhập vào Render.com
2. Tạo New Web Service
3. Kết nối với GitHub repository
4. Chọn thư mục `NuiTeaApi`
5. Cấu hình:
   - **Environment**: .NET
   - **Build Command**: `dotnet build`
   - **Start Command**: `dotnet run`
   - **Plan**: Free

6. Thêm Environment Variables:
   - `ASPNETCORE_ENVIRONMENT`: `Production`
   - `DATABASE_URL`: Connection string của database

## Bước 3: Triển khai Frontend

1. Tạo New Static Site trên Render
2. Kết nối với GitHub repository
3. Chọn thư mục `nui_tea`
4. Cấu hình:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Plan**: Free

5. Thêm Environment Variables:
   - `REACT_APP_API_URL`: URL của backend API (ví dụ: https://your-api.onrender.com)

## Bước 4: Cập nhật cấu hình

### Cập nhật API URL trong frontend
Sau khi có URL của backend, cập nhật:
- `nui_tea/src/config.js` (nếu có)
- Environment variable `REACT_APP_API_URL`

### Cập nhật CORS trong backend
Đảm bảo CORS cho phép domain của frontend.

## Bước 5: Kiểm tra

1. Kiểm tra backend API: `https://your-api.onrender.com/health`
2. Kiểm tra frontend: `https://your-frontend.onrender.com`

## Lưu ý quan trọng

- Render free tier có thể sleep sau 15 phút không hoạt động
- Database connection cần được cấu hình đúng
- CORS policy cần cho phép frontend domain
- Environment variables cần được set đúng

## Troubleshooting

### Lỗi database connection
- Kiểm tra connection string
- Đảm bảo database đã được tạo
- Kiểm tra network access

### Lỗi CORS
- Cập nhật CORS policy trong backend
- Kiểm tra domain của frontend

### Lỗi build
- Kiểm tra dependencies trong package.json
- Kiểm tra .NET version compatibility 