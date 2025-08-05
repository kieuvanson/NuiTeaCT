-- Database Schema cho Website Bán Trà Sữa Nui Tea
-- Tạo database
CREATE DATABASE IF NOT EXISTS nui_tea_db;
USE nui_tea_db;

-- Bảng danh mục sản phẩm
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng sản phẩm
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    category_id INT,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    stock_quantity INT DEFAULT 0,
    calories INT,
    sugar_level ENUM('0%', '25%', '50%', '75%', '100%') DEFAULT '50%',
    ice_level ENUM('0%', '25%', '50%', '75%', '100%') DEFAULT '50%',
    size_options JSON, -- Lưu các size và giá tương ứng
    toppings JSON, -- Lưu các topping có thể thêm
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Bảng người dùng (khách hàng)
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng admin
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('super_admin', 'admin', 'staff') DEFAULT 'staff',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng đơn hàng
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('cash', 'card', 'momo', 'zalopay', 'vnpay') DEFAULT 'cash',
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    delivery_address TEXT,
    delivery_phone VARCHAR(20),
    delivery_note TEXT,
    estimated_delivery_time TIMESTAMP,
    actual_delivery_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- Bảng chi tiết đơn hàng
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    size VARCHAR(20),
    sugar_level ENUM('0%', '25%', '50%', '75%', '100%'),
    ice_level ENUM('0%', '25%', '50%', '75%', '100%'),
    toppings JSON,
    special_instructions TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Bảng đánh giá sản phẩm
CREATE TABLE product_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    customer_id INT NOT NULL,
    order_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Bảng khuyến mãi
CREATE TABLE promotions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed_amount') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    max_discount DECIMAL(10,2),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    usage_limit INT,
    used_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng mã khuyến mãi
CREATE TABLE promo_codes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    promotion_id INT NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE
);

-- Bảng lịch sử sử dụng khuyến mãi
CREATE TABLE promotion_usage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    promotion_id INT NOT NULL,
    customer_id INT NOT NULL,
    order_id INT NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Tạo bảng Orders
CREATE TABLE Orders (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    OrderNumber VARCHAR(50) NOT NULL,
    CustomerName VARCHAR(100) NOT NULL,
    Phone VARCHAR(20) NOT NULL,
    Address VARCHAR(500) NOT NULL,
    Note VARCHAR(1000),
    TotalAmount DECIMAL(10,2) NOT NULL,
    PaymentMethod VARCHAR(50) NOT NULL,
    PaymentStatus VARCHAR(50) NOT NULL DEFAULT 'Chưa thanh toán',
    OrderStatus VARCHAR(50) NOT NULL DEFAULT 'Đã đặt hàng',
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    EstimatedDelivery DATETIME,
    CompletedAt DATETIME,
    CouponCode VARCHAR(50),
    DiscountAmount DECIMAL(10,2),
    ItemsJson JSON
);

-- Thêm index cho các trường thường query
CREATE INDEX idx_orders_createdat ON Orders(CreatedAt);
CREATE INDEX idx_orders_status ON Orders(OrderStatus);
CREATE INDEX idx_orders_payment_status ON Orders(PaymentStatus);
CREATE INDEX idx_orders_ordernumber ON Orders(OrderNumber);

-- Insert dữ liệu mẫu cho danh mục
INSERT INTO categories (name, description, image_url) VALUES
('Trà sữa', 'Các loại trà sữa truyền thống và hiện đại', '/images/categories/trasua.jpg'),
('Trà hoa quả', 'Trà hoa quả tươi mát, giàu vitamin', '/images/categories/trahoaqua.jpg'),
('Matcha', 'Các sản phẩm từ bột trà xanh Matcha Nhật Bản', '/images/categories/matcha.jpg'),
('Cà phê', 'Cà phê đen, cà phê sữa và các biến thể', '/images/categories/caphe.jpg'),
('Sinh tố', 'Sinh tố hoa quả tươi, bổ dưỡng', '/images/categories/sinhto.jpg'),
('Topping', 'Các loại topping để thêm vào đồ uống', '/images/categories/topping.jpg');

-- Insert dữ liệu mẫu cho sản phẩm
INSERT INTO products (name, description, price, original_price, category_id, image_url, stock_quantity, calories, size_options, toppings) VALUES
-- Trà sữa
('Trà sữa trân châu đường đen', 'Trà sữa truyền thống với trân châu đường đen thơm ngọt', 35000, 40000, 1, '/images/products/trasua-tranchau.jpg', 100, 250, '{"S": 30000, "M": 35000, "L": 40000}', '["Trân châu đường đen", "Thạch dừa", "Bánh flan"]'),
('Trà sữa thái xanh', 'Trà sữa thái xanh mát lạnh với hương vị đặc trưng', 40000, 45000, 1, '/images/products/trasua-thaixanh.jpg', 80, 280, '{"S": 35000, "M": 40000, "L": 45000}', '["Thạch thái", "Trân châu trắng", "Bánh flan"]'),
('Trà sữa khoai môn', 'Trà sữa khoai môn béo ngậy, thơm ngon', 45000, 50000, 1, '/images/products/trasua-khoaimon.jpg', 60, 320, '{"S": 40000, "M": 45000, "L": 50000}', '["Trân châu đường đen", "Bánh flan", "Kem cheese"]'),

-- Trà hoa quả
('Trà đào cam sả', 'Trà đào cam sả tươi mát, giàu vitamin C', 50000, 55000, 2, '/images/products/tra-dao-cam-sa.jpg', 70, 180, '{"S": 45000, "M": 50000, "L": 55000}', '["Đào tươi", "Cam tươi", "Sả tươi"]'),
('Trà vải', 'Trà vải thơm ngọt, mát lạnh', 45000, 50000, 2, '/images/products/tra-vai.jpg', 90, 160, '{"S": 40000, "M": 45000, "L": 50000}', '["Vải tươi", "Thạch vải", "Đá viên"]'),
('Trà chanh dây', 'Trà chanh dây chua ngọt, sảng khoái', 40000, 45000, 2, '/images/products/tra-chanh-day.jpg', 85, 140, '{"S": 35000, "M": 40000, "L": 45000}', '["Chanh dây tươi", "Thạch chanh dây", "Đá viên"]'),

-- Matcha
('Matcha latte', 'Matcha latte truyền thống Nhật Bản', 55000, 60000, 3, '/images/products/matcha-latte.jpg', 50, 220, '{"S": 50000, "M": 55000, "L": 60000}', '["Kem cheese", "Bánh flan", "Trân châu trắng"]'),
('Matcha đá xay', 'Matcha đá xay mát lạnh với kem tươi', 60000, 65000, 3, '/images/products/matcha-da-xay.jpg', 40, 350, '{"S": 55000, "M": 60000, "L": 65000}', '["Kem tươi", "Bánh flan", "Trân châu trắng"]'),
('Matcha brown sugar', 'Matcha với đường nâu thơm ngọt', 50000, 55000, 3, '/images/products/matcha-brown-sugar.jpg', 65, 280, '{"S": 45000, "M": 50000, "L": 55000}', '["Trân châu đường đen", "Kem cheese", "Bánh flan"]'),

-- Cà phê
('Cà phê sữa đá', 'Cà phê sữa đá truyền thống Việt Nam', 25000, 30000, 4, '/images/products/caphe-sua-da.jpg', 120, 120, '{"S": 20000, "M": 25000, "L": 30000}', '["Sữa đặc", "Đá viên"]'),
('Cà phê đen đá', 'Cà phê đen đá đậm đà', 20000, 25000, 4, '/images/products/caphe-den-da.jpg', 110, 80, '{"S": 15000, "M": 20000, "L": 25000}', '["Đá viên"]'),
('Cappuccino', 'Cappuccino kiểu Ý với bọt sữa mịn', 45000, 50000, 4, '/images/products/cappuccino.jpg', 75, 180, '{"S": 40000, "M": 45000, "L": 50000}', '["Bọt sữa", "Bột ca cao"]'),

-- Sinh tố
('Sinh tố dâu tây', 'Sinh tố dâu tây tươi ngọt', 50000, 55000, 5, '/images/products/sinhto-dau-tay.jpg', 60, 200, '{"S": 45000, "M": 50000, "L": 55000}', '["Dâu tây tươi", "Sữa tươi", "Đá viên"]'),
('Sinh tố xoài', 'Sinh tố xoài thơm ngọt', 45000, 50000, 5, '/images/products/sinhto-xoai.jpg', 80, 180, '{"S": 40000, "M": 45000, "L": 50000}', '["Xoài tươi", "Sữa tươi", "Đá viên"]'),
('Sinh tố bơ', 'Sinh tố bơ béo ngậy', 55000, 60000, 5, '/images/products/sinhto-bo.jpg', 45, 350, '{"S": 50000, "M": 55000, "L": 60000}', '["Bơ tươi", "Sữa tươi", "Đá viên"]');

-- Insert admin mẫu
INSERT INTO admins (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@nuitea.com', '$2b$10$hashed_password_here', 'Admin Chính', 'super_admin'),
('staff1', 'staff1@nuitea.com', '$2b$10$hashed_password_here', 'Nhân viên 1', 'staff'),
('staff2', 'staff2@nuitea.com', '$2b$10$hashed_password_here', 'Nhân viên 2', 'staff');

-- Tạo indexes để tối ưu hiệu suất
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_promotions_active ON promotions(is_active, start_date, end_date); 