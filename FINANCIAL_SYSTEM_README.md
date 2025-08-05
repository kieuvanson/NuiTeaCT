# Hệ thống Quản lý Tài chính NUiTea

## Tổng quan

Hệ thống quản lý tài chính tự động cho cửa hàng trà sữa NUiTea, bao gồm:

- **Thu nhập tự động**: Tự động tính từ đơn hàng đã hoàn thành
- **Chi phí tự động**: Tự động tính từ việc nhập nguyên vật liệu
- **Báo cáo tài chính**: Dashboard tổng hợp với biểu đồ trực quan
- **Quản lý lợi nhuận**: Theo dõi hiệu quả kinh doanh

## Các tính năng chính

### 1. Thu nhập (Income)
- **Tự động tạo**: Khi đơn hàng chuyển sang trạng thái "Completed"
- **Thông tin lưu trữ**:
  - Số tiền từ đơn hàng
  - Mô tả tự động
  - Liên kết với đơn hàng
  - Thời gian tạo

### 2. Chi phí (Expense)
- **Tự động tạo**: Khi nhập nguyên vật liệu
- **Thông tin lưu trữ**:
  - Số tiền chi phí (số lượng × đơn giá)
  - Thông tin nguyên vật liệu
  - Nhà cung cấp
  - Số hóa đơn (tùy chọn)

### 3. Báo cáo tài chính (Financial Reports)
- **Dashboard tổng hợp**:
  - Tổng thu nhập, chi phí, lợi nhuận
  - Số lượng đơn hàng và tỷ lệ hoàn thành
  - Biểu đồ thu nhập theo ngày
  - Biểu đồ chi phí theo ngày
  - Top sản phẩm bán chạy

## Cài đặt và Chạy

### 1. Cập nhật Database
Chạy file SQL để tạo các bảng mới:

```sql
-- Chạy file: NuiTeaApi/create_financial_tables.sql
```

### 2. Build và chạy Backend
```bash
cd NuiTeaApi
dotnet build
dotnet run
```

### 3. Chạy Frontend
```bash
cd nui_tea
npm install
npm start
```

## API Endpoints

### Thu nhập (Incomes)
- `GET /api/Incomes` - Lấy danh sách thu nhập
- `GET /api/Incomes/{id}` - Lấy chi tiết thu nhập
- `GET /api/Incomes/summary` - Tổng hợp thu nhập
- `POST /api/Incomes/from-order` - Tạo thu nhập từ đơn hàng

### Chi phí (Expenses)
- `GET /api/Expenses` - Lấy danh sách chi phí
- `GET /api/Expenses/{id}` - Lấy chi tiết chi phí
- `GET /api/Expenses/summary` - Tổng hợp chi phí
- `POST /api/Expenses/from-material` - Tạo chi phí từ nguyên vật liệu

### Báo cáo tài chính (Financial Reports)
- `GET /api/FinancialReports` - Lấy danh sách báo cáo
- `GET /api/FinancialReports/dashboard` - Dashboard tổng hợp
- `POST /api/FinancialReports/generate` - Tạo báo cáo mới

## Cách sử dụng

### 1. Tự động tạo thu nhập
Khi admin cập nhật trạng thái đơn hàng thành "Completed", hệ thống sẽ tự động:
- Tạo bản ghi thu nhập
- Tính toán số tiền từ đơn hàng
- Lưu thông tin vào database

### 2. Tự động tạo chi phí
Khi admin nhập nguyên vật liệu, cần cung cấp:
- Số lượng nhập
- Đơn giá
- Nhà cung cấp (tùy chọn)

Hệ thống sẽ tự động:
- Cập nhật số lượng nguyên vật liệu
- Tạo bản ghi chi phí
- Tính toán tổng chi phí

### 3. Xem báo cáo tài chính
Truy cập dashboard tài chính để xem:
- Tổng quan thu chi
- Biểu đồ theo thời gian
- Top sản phẩm bán chạy
- Tỷ lệ hoàn thành đơn hàng

## Cấu trúc Database

### Bảng Incomes
```sql
CREATE TABLE Incomes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Description NVARCHAR(100) NOT NULL,
    Type NVARCHAR(20) NOT NULL DEFAULT 'order',
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'completed',
    FOREIGN KEY (OrderId) REFERENCES Orders(Id)
);
```

### Bảng Expenses
```sql
CREATE TABLE Expenses (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    MaterialId INT NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Quantity INT NOT NULL,
    Unit NVARCHAR(20) NOT NULL,
    Description NVARCHAR(100) NOT NULL,
    Type NVARCHAR(20) NOT NULL DEFAULT 'material',
    Supplier NVARCHAR(100) NOT NULL,
    ExpenseDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'completed',
    ReceiptNumber NVARCHAR(100) NULL,
    FOREIGN KEY (MaterialId) REFERENCES Materials(Id)
);
```

### Bảng FinancialReports
```sql
CREATE TABLE FinancialReports (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ReportDate DATETIME2 NOT NULL,
    Period NVARCHAR(20) NOT NULL DEFAULT 'daily',
    TotalIncome DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalExpense DECIMAL(18,2) NOT NULL DEFAULT 0,
    NetProfit DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalOrders INT NOT NULL DEFAULT 0,
    CompletedOrders INT NOT NULL DEFAULT 0,
    CancelledOrders INT NOT NULL DEFAULT 0,
    AverageOrderValue DECIMAL(18,2) NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    Notes NVARCHAR(500) NULL
);
```

## Lưu ý quan trọng

1. **Thu nhập tự động**: Chỉ tạo khi đơn hàng hoàn thành, không tạo lại nếu đã có
2. **Chi phí tự động**: Tạo mỗi lần nhập nguyên vật liệu với thông tin đầy đủ
3. **Báo cáo**: Có thể tạo theo ngày, tuần, tháng, năm
4. **Dashboard**: Hiển thị dữ liệu real-time từ database

## Troubleshooting

### Lỗi thường gặp
1. **Không tạo được thu nhập**: Kiểm tra trạng thái đơn hàng phải là "Completed"
2. **Không tạo được chi phí**: Đảm bảo cung cấp đủ thông tin (số lượng, đơn giá)
3. **Dashboard không hiển thị**: Kiểm tra kết nối API và dữ liệu trong database

### Kiểm tra dữ liệu
```sql
-- Kiểm tra thu nhập
SELECT * FROM Incomes ORDER BY CreatedAt DESC;

-- Kiểm tra chi phí
SELECT * FROM Expenses ORDER BY CreatedAt DESC;

-- Kiểm tra báo cáo
SELECT * FROM FinancialReports ORDER BY ReportDate DESC;
```

## Hỗ trợ

Nếu gặp vấn đề, vui lòng kiểm tra:
1. Log của ứng dụng
2. Kết nối database
3. Cấu hình API endpoints
4. Dữ liệu trong các bảng liên quan 