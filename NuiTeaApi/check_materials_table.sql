USE nui_tea_db;

-- Kiểm tra cấu trúc bảng Materials
DESCRIBE Materials;

-- Kiểm tra xem có cột ShelfLifeDays không
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'nui_tea_db' 
AND TABLE_NAME = 'Materials' 
AND COLUMN_NAME = 'ShelfLifeDays';

-- Hiển thị dữ liệu mẫu
SELECT Id, Name, Category, Supplier, Quantity, Unit, ImportPrice, ImportDate, ExpiryDate, ShelfLifeDays
FROM Materials 
WHERE IsActive = 1 
LIMIT 5; 