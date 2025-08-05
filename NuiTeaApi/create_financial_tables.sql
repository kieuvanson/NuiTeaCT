-- Tạo bảng Incomes (Thu nhập) - MySQL syntax
CREATE TABLE IF NOT EXISTS Incomes (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    OrderId INT NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Description VARCHAR(100) NOT NULL DEFAULT '',
    Type VARCHAR(20) NOT NULL DEFAULT 'order',
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NULL,
    Status VARCHAR(50) NOT NULL DEFAULT 'completed'
);

-- Tạo bảng Expenses (Chi phí) - MySQL syntax
CREATE TABLE IF NOT EXISTS Expenses (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    MaterialId INT NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Quantity INT NOT NULL,
    Unit VARCHAR(20) NOT NULL DEFAULT '',
    Description VARCHAR(100) NOT NULL DEFAULT '',
    Type VARCHAR(20) NOT NULL DEFAULT 'material',
    Supplier VARCHAR(100) NOT NULL DEFAULT '',
    ExpenseDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NULL,
    Status VARCHAR(50) NOT NULL DEFAULT 'completed',
    ReceiptNumber VARCHAR(100) NULL
);

-- Tạo bảng FinancialReports (Báo cáo tài chính) - MySQL syntax
CREATE TABLE IF NOT EXISTS FinancialReports (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ReportDate DATETIME NOT NULL,
    Period VARCHAR(20) NOT NULL DEFAULT 'daily',
    TotalIncome DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalExpense DECIMAL(18,2) NOT NULL DEFAULT 0,
    NetProfit DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalOrders INT NOT NULL DEFAULT 0,
    CompletedOrders INT NOT NULL DEFAULT 0,
    CancelledOrders INT NOT NULL DEFAULT 0,
    AverageOrderValue DECIMAL(18,2) NOT NULL DEFAULT 0,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NULL,
    Notes VARCHAR(500) NULL
);

-- Tạo index cơ bản (chạy từng lệnh một nếu cần)
CREATE INDEX IX_Incomes_OrderId ON Incomes(OrderId);
CREATE INDEX IX_Incomes_CreatedAt ON Incomes(CreatedAt);
CREATE INDEX IX_Expenses_MaterialId ON Expenses(MaterialId);
CREATE INDEX IX_Expenses_ExpenseDate ON Expenses(ExpenseDate);
CREATE INDEX IX_FinancialReports_ReportDate ON FinancialReports(ReportDate);
CREATE INDEX IX_FinancialReports_Period ON FinancialReports(Period); 