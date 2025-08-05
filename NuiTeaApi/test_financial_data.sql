-- Thêm dữ liệu test cho hệ thống tài chính

-- 1. Thêm một số đơn hàng test (chỉ sử dụng các cột cơ bản)
INSERT INTO Orders (OrderNumber, CustomerName, Phone, Email, TotalAmount, OrderStatusString, CreatedAt) VALUES
('ORD001', 'Nguyễn Văn A', '0123456789', 'nguyenvana@email.com', 150000, 'Completed', NOW()),
('ORD002', 'Trần Thị B', '0987654321', 'tranthib@email.com', 200000, 'Completed', NOW()),
('ORD003', 'Lê Văn C', '0111222333', 'levanc@email.com', 180000, 'Completed', NOW()),
('ORD004', 'Phạm Thị D', '0444555666', 'phamthid@email.com', 120000, 'Completed', NOW()),
('ORD005', 'Hoàng Văn E', '0777888999', 'hoangvane@email.com', 250000, 'Completed', NOW());

-- 2. Thêm thu nhập từ các đơn hàng đã hoàn thành
INSERT INTO Incomes (OrderId, Amount, Description, Type, Status, CreatedAt) VALUES
(1, 150000, 'Thu nhập từ đơn hàng #ORD001', 'order', 'completed', NOW()),
(2, 200000, 'Thu nhập từ đơn hàng #ORD002', 'order', 'completed', NOW()),
(3, 180000, 'Thu nhập từ đơn hàng #ORD003', 'order', 'completed', NOW()),
(4, 120000, 'Thu nhập từ đơn hàng #ORD004', 'order', 'completed', NOW()),
(5, 250000, 'Thu nhập từ đơn hàng #ORD005', 'order', 'completed', NOW());

-- 3. Thêm một số nguyên vật liệu test (chỉ sử dụng các cột cơ bản)
INSERT INTO Materials (Name, Unit, CurrentStock, MinimumStock, ImportPrice, Supplier, CreatedAt) VALUES
('Trà đen', 'kg', 50, 10, 50000, 'Nhà cung cấp A', NOW()),
('Sữa tươi', 'lít', 100, 20, 25000, 'Nhà cung cấp B', NOW()),
('Đường', 'kg', 30, 5, 15000, 'Nhà cung cấp C', NOW()),
('Bột trân châu', 'kg', 25, 8, 80000, 'Nhà cung cấp D', NOW()),
('Hương liệu', 'chai', 40, 10, 120000, 'Nhà cung cấp E', NOW());

-- 4. Thêm chi phí nhập nguyên vật liệu
INSERT INTO Expenses (MaterialId, Amount, Quantity, Unit, Description, Type, Supplier, Status, ExpenseDate, CreatedAt) VALUES
(1, 500000, 10, 'kg', 'Nhập 10 kg Trà đen', 'material', 'Nhà cung cấp A', 'completed', NOW(), NOW()),
(2, 500000, 20, 'lít', 'Nhập 20 lít Sữa tươi', 'material', 'Nhà cung cấp B', 'completed', NOW(), NOW()),
(3, 150000, 10, 'kg', 'Nhập 10 kg Đường', 'material', 'Nhà cung cấp C', 'completed', NOW(), NOW()),
(4, 400000, 5, 'kg', 'Nhập 5 kg Bột trân châu', 'material', 'Nhà cung cấp D', 'completed', NOW(), NOW()),
(5, 240000, 2, 'chai', 'Nhập 2 chai Hương liệu', 'material', 'Nhà cung cấp E', 'completed', NOW(), NOW());

-- 5. Tạo báo cáo tài chính mẫu
INSERT INTO FinancialReports (ReportDate, Period, TotalIncome, TotalExpense, NetProfit, TotalOrders, CompletedOrders, CancelledOrders, AverageOrderValue, CreatedAt) VALUES
(NOW(), 'daily', 900000, 1790000, -890000, 5, 5, 0, 180000, NOW()); 