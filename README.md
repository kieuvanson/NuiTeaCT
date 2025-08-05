# NUiTeaplus - Hệ thống Quản lý Quán Trà

## 📋 Mô tả
NUiTeaplus là một hệ thống quản lý quán trà hoàn chỉnh với giao diện web hiện đại, bao gồm cả phần frontend (React) và backend (ASP.NET Core).

## 🚀 Tính năng chính

### 👤 Quản lý người dùng
- Đăng ký/Đăng nhập tài khoản
- Phân quyền admin/user
- Quản lý thông tin cá nhân

### 🛍️ Quản lý sản phẩm
- Thêm/Sửa/Xóa sản phẩm
- Quản lý danh mục sản phẩm
- Tính năng "Sold Out" cho sản phẩm
- Upload hình ảnh sản phẩm

### 🛒 Giỏ hàng & Đặt hàng
- Thêm sản phẩm vào giỏ hàng
- Chọn topping và tùy chọn
- Thanh toán (COD, Bank Transfer, MoMo, VNPay)
- Theo dõi trạng thái đơn hàng

### 📦 Quản lý đơn hàng
- Xem danh sách đơn hàng
- Cập nhật trạng thái đơn hàng
- Lịch sử đơn hàng cho khách hàng

### 📊 Quản lý kho
- Quản lý nguyên vật liệu
- Nhập/Xuất kho
- Cảnh báo hàng tồn kho thấp
- Cảnh báo hàng hết hạn

### 👥 Quản lý tài khoản (Admin)
- Xem danh sách tài khoản
- Khóa/Mở khóa tài khoản
- Xóa tài khoản
- Tìm kiếm tài khoản

### 🔔 Hệ thống thông báo
- Thông báo đơn hàng mới
- Cảnh báo kho hàng
- Thông báo trạng thái đơn hàng

## 🛠️ Công nghệ sử dụng

### Frontend
- **React.js** - Framework JavaScript
- **React Router** - Routing
- **CSS3** - Styling
- **Context API** - State Management

### Backend
- **ASP.NET Core 9.0** - Web API
- **Entity Framework Core** - ORM
- **MySQL** - Database
- **BCrypt** - Password Hashing

## 📁 Cấu trúc dự án

```
NUiTeaplus/
├── nui_tea/                 # Frontend React
│   ├── src/
│   │   ├── components/      # React Components
│   │   ├── contexts/        # Context Providers
│   │   └── ...
│   └── public/              # Static files
├── NuiTeaApi/              # Backend ASP.NET Core
│   ├── Controllers/         # API Controllers
│   ├── Models/             # Data Models
│   ├── Migrations/         # Database Migrations
│   └── ...
└── database_schema.sql     # Database Schema
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 16+
- .NET 9.0 SDK
- MySQL 8.0+

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd NUiTeaplus
```

### Bước 2: Cài đặt Frontend
```bash
cd nui_tea
npm install
npm start
```

### Bước 3: Cài đặt Backend
```bash
cd NuiTeaApi
dotnet restore
dotnet run
```

### Bước 4: Cài đặt Database
1. Tạo database MySQL
2. Chạy script `database_schema.sql`
3. Cập nhật connection string trong `appsettings.json`

## 📝 API Endpoints

### Authentication
- `POST /api/customers/register` - Đăng ký
- `POST /api/customers/login` - Đăng nhập

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `POST /api/products` - Thêm sản phẩm
- `PUT /api/products/{id}` - Cập nhật sản phẩm
- `PUT /api/products/{id}/toggle-soldout` - Toggle sold out

### Orders
- `GET /api/orders` - Lấy danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng
- `PUT /api/orders/{id}` - Cập nhật trạng thái

### Materials
- `GET /api/materials` - Lấy danh sách nguyên liệu
- `POST /api/materials` - Thêm nguyên liệu
- `PUT /api/materials/{id}/import` - Nhập kho
- `PUT /api/materials/{id}/export` - Xuất kho

### Customers
- `GET /api/customers` - Lấy danh sách tài khoản
- `PUT /api/customers/{id}/toggle-status` - Khóa/mở khóa

## 👥 Tài khoản mặc định

### Admin
- Email: `admin@example.com`
- Password: `admin123`

### User
- Email: `user@example.com`
- Password: `user123`

## 📸 Screenshots

[Thêm screenshots của ứng dụng ở đây]

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phát hành dưới MIT License.

## 📞 Liên hệ

- Email: [your-email@example.com]
- GitHub: [your-github-username]

---

**NUiTeaplus** - Hệ thống quản lý quán trà hiện đại và chuyên nghiệp! 🍵 