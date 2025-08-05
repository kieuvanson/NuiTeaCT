using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuiTeaApi.Models;

namespace NuiTeaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FinancialReportsController : ControllerBase
    {
        private readonly NuiTeaContext _context;

        public FinancialReportsController(NuiTeaContext context)
        {
            _context = context;
        }

        // GET: api/FinancialReports
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FinancialReport>>> GetFinancialReports()
        {
            return await _context.FinancialReports
                .OrderByDescending(f => f.ReportDate)
                .ToListAsync();
        }

        // GET: api/FinancialReports/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FinancialReport>> GetFinancialReport(int id)
        {
            var financialReport = await _context.FinancialReports.FindAsync(id);

            if (financialReport == null)
            {
                return NotFound();
            }

            return financialReport;
        }

        // GET: api/FinancialReports/test
        [HttpGet("test")]
        public async Task<ActionResult<object>> TestEndpoint()
        {
            try
            {
                var incomeCount = await _context.Incomes.CountAsync();
                var expenseCount = await _context.Expenses.CountAsync();
                var orderCount = await _context.Orders.CountAsync();
                
                return new
                {
                    message = "API hoạt động bình thường",
                    incomeCount = incomeCount,
                    expenseCount = expenseCount,
                    orderCount = orderCount
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // GET: api/FinancialReports/dashboard
        [HttpGet("dashboard")]
        public async Task<ActionResult<object>> GetDashboardData([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
            var start = startDate ?? DateTime.UtcNow.AddDays(-30);
            var end = endDate ?? DateTime.UtcNow.Date.AddDays(1); // Bao gồm cả ngày hiện tại

            Console.WriteLine($"🔍 Dashboard - Start: {start}, End: {end}");
            Console.WriteLine($"🔍 Timezone info - UTC Now: {DateTime.UtcNow}, Local Now: {DateTime.Now}");
            Console.WriteLine($"🔍 Khoảng thời gian filter: {start:yyyy-MM-dd HH:mm:ss} đến {end:yyyy-MM-dd HH:mm:ss}");

            // Thu nhập
            var totalIncome = await _context.Incomes
                .Where(i => i.CreatedAt >= start && i.CreatedAt <= end)
                .SumAsync(i => i.Amount);

            Console.WriteLine($"💰 Total Income: {totalIncome}");

            // Kiểm tra tất cả thu nhập
            var allIncomes = await _context.Incomes.ToListAsync();
            Console.WriteLine($"📊 Tất cả thu nhập trong DB: {allIncomes.Count}");
            foreach (var income in allIncomes)
            {
                Console.WriteLine($"  - ID: {income.Id}, Amount: {income.Amount}, CreatedAt: {income.CreatedAt}, OrderId: {income.OrderId}");
            }

            // Chi phí
            var totalExpense = await _context.Expenses
                .Where(e => e.ExpenseDate >= start && e.ExpenseDate <= end)
                .SumAsync(e => e.Amount);

            Console.WriteLine($"💸 Total Expense: {totalExpense}");

            // Đơn hàng - BỎ QUA FILTER THỜI GIAN
            var allOrders = await _context.Orders.ToListAsync();
            Console.WriteLine($"📦 Tất cả đơn hàng trong DB: {allOrders.Count}");
            foreach (var order in allOrders)
            {
                Console.WriteLine($"  - ID: {order.Id}, OrderNumber: {order.OrderNumber}, CreatedAt: {order.CreatedAt:yyyy-MM-dd HH:mm:ss}, Status: {order.OrderStatusString}");
            }

            var totalOrders = allOrders.Count; // TẤT CẢ ĐƠN HÀNG
            Console.WriteLine($"📦 Total Orders (TẤT CẢ): {totalOrders}");

            var completedOrders = allOrders.Count(o => o.OrderStatusString == "Đã giao hàng"); // TẤT CẢ ĐƠN HÀNG HOÀN THÀNH
            Console.WriteLine($"✅ Completed Orders (TẤT CẢ): {completedOrders}");

            var cancelledOrders = await _context.Orders
                .Where(o => o.CreatedAt >= start && o.CreatedAt <= end && o.OrderStatusString == "Đã hủy")
                .CountAsync();

            var averageOrderValue = totalOrders > 0 ? 
                await _context.Orders
                    .Where(o => o.CreatedAt >= start && o.CreatedAt <= end)
                    .AverageAsync(o => o.TotalAmount) : 0;

            // Thu nhập theo ngày (7 ngày gần nhất)
            var dailyIncome = await _context.Incomes
                .Where(i => i.CreatedAt >= DateTime.UtcNow.AddDays(-7))
                .GroupBy(i => i.CreatedAt.Date)
                .Select(g => new { Date = g.Key, Amount = g.Sum(i => i.Amount) })
                .OrderBy(x => x.Date)
                .ToListAsync();

            // Chi phí theo ngày (7 ngày gần nhất)
            var dailyExpense = await _context.Expenses
                .Where(e => e.ExpenseDate >= DateTime.UtcNow.AddDays(-7))
                .GroupBy(e => e.ExpenseDate.Date)
                .Select(g => new { Date = g.Key, Amount = g.Sum(e => e.Amount) })
                .OrderBy(x => x.Date)
                .ToListAsync();

            // Top 5 sản phẩm bán chạy - tạm thời bỏ qua để tránh lỗi GetItems()
            var topProducts = new List<object>();

            return new
            {
                Summary = new
                {
                    TotalIncome = totalIncome,
                    TotalExpense = totalExpense,
                    NetProfit = totalIncome - totalExpense,
                    TotalOrders = totalOrders,
                    CompletedOrders = completedOrders,
                    CancelledOrders = cancelledOrders,
                    AverageOrderValue = averageOrderValue,
                    CompletionRate = totalOrders > 0 ? (double)completedOrders / totalOrders * 100 : 0
                },
                DailyIncome = dailyIncome,
                DailyExpense = dailyExpense,
                TopProducts = topProducts,
                                 Period = new { StartDate = start, EndDate = end }
             };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetDashboardData: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { error = ex.Message });
            }
        }



        // POST: api/FinancialReports/generate
        [HttpPost("generate")]
        public async Task<ActionResult<FinancialReport>> GenerateReport([FromQuery] string period = "daily", [FromQuery] DateTime? reportDate = null)
        {
            var date = reportDate ?? DateTime.UtcNow.Date;
            DateTime startDate, endDate;

            switch (period.ToLower())
            {
                case "daily":
                    startDate = date.Date;
                    endDate = date.Date.AddDays(1).AddSeconds(-1);
                    break;
                case "weekly":
                    startDate = date.Date.AddDays(-(int)date.DayOfWeek);
                    endDate = startDate.AddDays(7).AddSeconds(-1);
                    break;
                case "monthly":
                    startDate = new DateTime(date.Year, date.Month, 1);
                    endDate = startDate.AddMonths(1).AddSeconds(-1);
                    break;
                case "yearly":
                    startDate = new DateTime(date.Year, 1, 1);
                    endDate = startDate.AddYears(1).AddSeconds(-1);
                    break;
                default:
                    return BadRequest("Period phải là daily, weekly, monthly hoặc yearly");
            }

            // Kiểm tra xem đã có báo cáo cho khoảng thời gian này chưa
            var existingReport = await _context.FinancialReports
                .FirstOrDefaultAsync(f => f.Period == period && f.ReportDate.Date == date.Date);

            if (existingReport != null)
                return BadRequest("Đã có báo cáo cho khoảng thời gian này");

            // Tính toán dữ liệu
            var totalIncome = await _context.Incomes
                .Where(i => i.CreatedAt >= startDate && i.CreatedAt <= endDate)
                .SumAsync(i => i.Amount);

            var totalExpense = await _context.Expenses
                .Where(e => e.ExpenseDate >= startDate && e.ExpenseDate <= endDate)
                .SumAsync(e => e.Amount);

            var totalOrders = await _context.Orders
                .Where(o => o.CreatedAt >= startDate && o.CreatedAt <= endDate)
                .CountAsync();

            var completedOrders = await _context.Orders
                .Where(o => o.CreatedAt >= startDate && o.CreatedAt <= endDate && o.OrderStatus == OrderStatus.Completed)
                .CountAsync();

            var cancelledOrders = await _context.Orders
                .Where(o => o.CreatedAt >= startDate && o.CreatedAt <= endDate && o.OrderStatus == OrderStatus.Cancelled)
                .CountAsync();

            var averageOrderValue = totalOrders > 0 ? 
                await _context.Orders
                    .Where(o => o.CreatedAt >= startDate && o.CreatedAt <= endDate)
                    .AverageAsync(o => o.TotalAmount) : 0;

            var report = new FinancialReport
            {
                ReportDate = date,
                Period = period,
                TotalIncome = totalIncome,
                TotalExpense = totalExpense,
                NetProfit = totalIncome - totalExpense,
                TotalOrders = totalOrders,
                CompletedOrders = completedOrders,
                CancelledOrders = cancelledOrders,
                AverageOrderValue = averageOrderValue,
                CreatedAt = DateTime.UtcNow
            };

            _context.FinancialReports.Add(report);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFinancialReport), new { id = report.Id }, report);
        }

        // PUT: api/FinancialReports/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFinancialReport(int id, FinancialReport financialReport)
        {
            if (id != financialReport.Id)
                return BadRequest();

            var existingReport = await _context.FinancialReports.FindAsync(id);
            if (existingReport == null)
                return NotFound();

            existingReport.TotalIncome = financialReport.TotalIncome;
            existingReport.TotalExpense = financialReport.TotalExpense;
            existingReport.NetProfit = financialReport.NetProfit;
            existingReport.TotalOrders = financialReport.TotalOrders;
            existingReport.CompletedOrders = financialReport.CompletedOrders;
            existingReport.CancelledOrders = financialReport.CancelledOrders;
            existingReport.AverageOrderValue = financialReport.AverageOrderValue;
            existingReport.Notes = financialReport.Notes;
            existingReport.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FinancialReportExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/FinancialReports/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFinancialReport(int id)
        {
            var financialReport = await _context.FinancialReports.FindAsync(id);
            if (financialReport == null)
                return NotFound();

            _context.FinancialReports.Remove(financialReport);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/FinancialReports/sync-incomes
        [HttpPost("sync-incomes")]
        public async Task<ActionResult<object>> SyncIncomesFromCompletedOrders()
        {
            try
            {
                // Lấy tất cả đơn hàng đã hoàn thành và đã thanh toán
                var completedOrders = await _context.Orders
                    .Where(o => o.OrderStatusString == "Đã giao hàng" && o.PaymentStatusString == "Đã thanh toán")
                    .ToListAsync();

                var createdIncomes = new List<object>();
                var skippedOrders = 0;

                foreach (var order in completedOrders)
                {
                    // Kiểm tra xem đã có thu nhập cho đơn hàng này chưa
                    var existingIncome = await _context.Incomes.FirstOrDefaultAsync(i => i.OrderId == order.Id);
                    if (existingIncome == null)
                    {
                        var income = new Income
                        {
                            OrderId = order.Id,
                            Amount = order.TotalAmount,
                            Description = $"Thu nhập từ đơn hàng #{order.OrderNumber} - {order.CustomerName}",
                            Type = "order",
                            Status = "completed",
                            CreatedAt = DateTime.UtcNow
                        };

                        _context.Incomes.Add(income);
                        createdIncomes.Add(new
                        {
                            orderId = order.Id,
                            orderNumber = order.OrderNumber,
                            amount = order.TotalAmount,
                            customerName = order.CustomerName
                        });
                    }
                    else
                    {
                        skippedOrders++;
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = $"Đã đồng bộ thu nhập từ đơn hàng hoàn thành",
                    createdCount = createdIncomes.Count,
                    skippedCount = skippedOrders,
                    createdIncomes = createdIncomes
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        private bool FinancialReportExists(int id)
        {
            return _context.FinancialReports.Any(e => e.Id == id);
        }
    }
} 