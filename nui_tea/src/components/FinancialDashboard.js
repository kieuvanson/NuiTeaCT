/* eslint-disable */
import React, { useState, useEffect } from 'react';
import './FinancialDashboard.css';
import { API_BASE_URL } from '../config';

const FinancialDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState('30'); // 30 days default

    useEffect(() => {
        // Tự động đồng bộ thu nhập từ đơn hàng hoàn thành khi component được load
        syncIncomesFromCompletedOrders();
        fetchDashboardData();
    }, [dateRange]);

    const syncIncomesFromCompletedOrders = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/FinancialReports/sync-incomes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const result = await response.json();

                // Tự động tải lại dữ liệu dashboard sau khi đồng bộ
                setTimeout(() => {
                    fetchDashboardData();
                }, 1000);
            } else {
                const errorText = await response.text();
            }
        } catch (error) {
        }
    };



    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - parseInt(dateRange));

            const url = `${API_BASE_URL}/api/FinancialReports/dashboard?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Không thể tải dữ liệu dashboard`);
            }

            const responseText = await response.text();

            let data;
            try {
                data = JSON.parse(responseText);

                setDashboardData(data);
            } catch (parseError) {
                throw new Error('Lỗi parse dữ liệu từ server');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '0 ₫';

        // Chuyển đổi string thành number nếu cần
        let numAmount = amount;
        if (typeof amount === 'string') {
            // Xử lý format có dấu phẩy (ví dụ: "1273000,00")
            numAmount = parseFloat(amount.replace(',', '.'));
        }

        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(numAmount);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('vi-VN').format(number);
    };



    if (loading || !dashboardData) {
        return (
            <div className="financial-dashboard">
                <div className="loading">Đang tải dữ liệu...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="financial-dashboard">
                <div className="error">Lỗi: {error}</div>
            </div>
        );
    }



    // Kiểm tra an toàn trước khi destructuring
    const Summary = dashboardData?.summary; // Sửa từ Summary thành summary
    const DailyIncome = dashboardData?.dailyIncome; // Sửa từ DailyIncome thành dailyIncome
    const DailyExpense = dashboardData?.dailyExpense; // Sửa từ DailyExpense thành dailyExpense
    const TopProducts = dashboardData?.topProducts; // Sửa từ TopProducts thành topProducts



    return (
        <div className="financial-dashboard">
            <div className="dashboard-header">
                <h1>Bảng điều khiển tài chính</h1>
                <div className="dashboard-controls">
                    <div className="date-range-selector">
                        <label>Khoảng thời gian: </label>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                        >
                            <option value="7">7 ngày qua</option>
                            <option value="90" selected>90 ngày qua</option>
                            <option value="90">90 ngày qua</option>
                            <option value="365">1 năm qua</option>
                        </select>
                    </div>
                    <button
                        onClick={syncIncomesFromCompletedOrders}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#b8860b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            marginRight: '10px'
                        }}
                    >
                        🔄 Đồng bộ thu nhập
                    </button>
                    <button
                        onClick={fetchDashboardData}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        📊 Tải lại dữ liệu
                    </button>
                </div>
            </div>

            {/* Tổng quan */}
            <div className="summary-cards">
                <div className="summary-card income">
                    <div className="card-icon">💰</div>
                    <div className="card-content">
                        <h3>Thu nhập</h3>
                        <div className="amount">{formatCurrency(Summary?.totalIncome || 0)}</div>
                        <div className="subtitle">{Summary?.completedOrders || 0} đơn hàng hoàn thành</div>
                    </div>
                </div>

                <div className="summary-card expense">
                    <div className="card-icon">📉</div>
                    <div className="card-content">
                        <h3>Chi phí</h3>
                        <div className="amount">{formatCurrency(Summary?.totalExpense || 0)}</div>
                        <div className="subtitle">Chi phí nguyên vật liệu</div>
                    </div>
                </div>

                <div className="summary-card profit">
                    <div className="card-icon">📊</div>
                    <div className="card-content">
                        <h3>Lợi nhuận</h3>
                        <div className="amount">{formatCurrency(Summary?.netProfit || 0)}</div>
                        <div className="subtitle">
                            {(Summary?.totalIncome || 0) > 0 ?
                                `${(((Summary?.netProfit || 0) / (Summary?.totalIncome || 1)) * 100).toFixed(1)}% tỷ suất lợi nhuận` :
                                '0% tỷ suất lợi nhuận'
                            }
                        </div>
                    </div>
                </div>

                <div className="summary-card orders">
                    <div className="card-icon">📦</div>
                    <div className="card-content">
                        <h3>Đơn hàng</h3>
                        <div className="amount">{formatNumber(Summary?.totalOrders || 0)}</div>
                        <div className="subtitle">
                            {(Summary?.completionRate || 0).toFixed(1)}% tỷ lệ hoàn thành
                        </div>
                    </div>
                </div>
            </div>

            {/* Biểu đồ */}
            <div className="charts-section">
                <div className="chart-container">
                    <h3>📈 Thu nhập</h3>
                    <div className="chart-placeholder">
                        {(DailyIncome || []).length > 0 ? (
                            <div className="income-chart">
                                {DailyIncome.map((item, index) => (
                                    <div key={index} className="chart-bar">
                                        <div
                                            className="bar-fill income-fill"
                                            style={{
                                                height: `${(item.amount / Math.max(...DailyIncome.map(d => d.amount))) * 100}%`
                                            }}
                                        ></div>
                                        <div className="bar-label">
                                            {new Date(item.date).toLocaleDateString('vi-VN', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="bar-value">{formatCurrency(item.amount)}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-data">[Biểu đồ thu nhập sẽ hiển thị ở đây]</div>
                        )}
                    </div>
                </div>

                <div className="chart-container">
                    <h3>📉 Chi phí</h3>
                    <div className="chart-placeholder">
                        {(DailyExpense || []).length > 0 ? (
                            <div className="expense-chart">
                                {DailyExpense.map((item, index) => (
                                    <div key={index} className="chart-bar">
                                        <div
                                            className="bar-fill expense-fill"
                                            style={{
                                                height: `${(item.amount / Math.max(...DailyExpense.map(d => d.amount))) * 100}%`
                                            }}
                                        ></div>
                                        <div className="bar-label">
                                            {new Date(item.date).toLocaleDateString('vi-VN', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="bar-value">{formatCurrency(item.amount)}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-data">[Biểu đồ chi phí sẽ hiển thị ở đây]</div>
                        )}
                    </div>
                </div>

                <div className="chart-container">
                    <h3>📊 Tổng kết thu chi</h3>
                    <div className="chart-placeholder">
                        {(DailyIncome || []).length > 0 && (DailyExpense || []).length > 0 ? (
                            <div className="summary-chart">
                                <div className="summary-item">
                                    <div className="summary-label">Thu nhập</div>
                                    <div className="summary-value income">{formatCurrency(Summary?.totalIncome || 0)}</div>
                                </div>
                                <div className="summary-item">
                                    <div className="summary-label">Chi phí</div>
                                    <div className="summary-value expense">{formatCurrency(Summary?.totalExpense || 0)}</div>
                                </div>
                                <div className="summary-item total">
                                    <div className="summary-label">Lợi nhuận ròng</div>
                                    <div className="summary-value profit">{formatCurrency(Summary?.netProfit || 0)}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="no-data">[Biểu đồ tổng kết thu chi sẽ hiển thị ở đây]</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sản phẩm bán chạy */}
            {TopProducts && TopProducts.length > 0 && (
                <div className="top-products">
                    <h3>🏆 Top sản phẩm bán chạy</h3>
                    <div className="products-list">
                        {TopProducts.map((product, index) => (
                            <div key={index} className="product-item">
                                <div className="product-rank">#{index + 1}</div>
                                <div className="product-info">
                                    <div className="product-name">{product.ProductName}</div>
                                    <div className="product-stats">
                                        <span>SL: {formatNumber(product.TotalQuantity)}</span>
                                        <span>DT: {formatCurrency(product.TotalRevenue)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinancialDashboard; 