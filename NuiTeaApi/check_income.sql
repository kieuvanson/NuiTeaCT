-- Kiểm tra thu nhập
SELECT * FROM Incomes ORDER BY CreatedAt DESC;

-- Kiểm tra đơn hàng đã hoàn thành
SELECT Id, OrderNumber, OrderStatusString, TotalAmount, CreatedAt 
FROM Orders 
WHERE OrderStatusString = 'Completed' 
ORDER BY CreatedAt DESC;

-- Kiểm tra chi phí
SELECT * FROM Expenses ORDER BY CreatedAt DESC; 