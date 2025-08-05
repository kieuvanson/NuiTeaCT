-- Thêm cột ShelfLifeDays vào bảng Materials
USE nui_tea_db;

-- Thêm cột ShelfLifeDays với giá trị mặc định 30 ngày
ALTER TABLE Materials ADD COLUMN ShelfLifeDays INT DEFAULT 30;

-- Cập nhật ngày hết hạn cho các nguyên vật liệu hiện có (sử dụng ID để tránh safe update mode)
UPDATE Materials 
SET ExpiryDate = DATE_ADD(ImportDate, INTERVAL ShelfLifeDays DAY)
WHERE Id IN (SELECT Id FROM (SELECT Id FROM Materials WHERE ExpiryDate IS NULL AND ShelfLifeDays > 0) AS temp);

-- Hoặc tắt safe update mode tạm thời
-- SET SQL_SAFE_UPDATES = 0;
-- UPDATE Materials SET ExpiryDate = DATE_ADD(ImportDate, INTERVAL ShelfLifeDays DAY) WHERE ExpiryDate IS NULL AND ShelfLifeDays > 0;
-- SET SQL_SAFE_UPDATES = 1;

-- Hiển thị kết quả
SELECT 
    Id,
    Name,
    Category,
    Supplier,
    Quantity,
    Unit,
    ImportPrice,
    ImportDate,
    ExpiryDate,
    ShelfLifeDays,
    CASE 
        WHEN ExpiryDate IS NULL THEN 'normal'
        WHEN ExpiryDate <= CURDATE() THEN 'expired'
        WHEN ExpiryDate <= DATE_ADD(CURDATE(), INTERVAL 3 DAY) THEN 'warning'
        ELSE 'normal'
    END as ExpiryStatus,
    CASE 
        WHEN ExpiryDate IS NULL THEN NULL
        ELSE DATEDIFF(ExpiryDate, CURDATE())
    END as DaysUntilExpiry
FROM Materials 
WHERE IsActive = 1
ORDER BY ExpiryDate; 