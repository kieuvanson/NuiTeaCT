using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuiTeaApi.Models;

namespace NuiTeaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncomesController : ControllerBase
    {
        private readonly NuiTeaContext _context;

        public IncomesController(NuiTeaContext context)
        {
            _context = context;
        }

        // GET: api/Incomes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Income>>> GetIncomes()
        {
            return await _context.Incomes
                .Include(i => i.Order)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        // GET: api/Incomes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Income>> GetIncome(int id)
        {
            var income = await _context.Incomes
                .Include(i => i.Order)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (income == null)
            {
                return NotFound();
            }

            return income;
        }

        // GET: api/Incomes/summary
        [HttpGet("summary")]
        public async Task<ActionResult<object>> GetIncomeSummary([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var query = _context.Incomes.AsQueryable();

            if (startDate.HasValue)
                query = query.Where(i => i.CreatedAt >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(i => i.CreatedAt <= endDate.Value);

            var totalIncome = await query.SumAsync(i => i.Amount);
            var totalOrders = await query.CountAsync();
            var averageIncome = totalOrders > 0 ? totalIncome / totalOrders : 0;

            return new
            {
                TotalIncome = totalIncome,
                TotalOrders = totalOrders,
                AverageIncome = averageIncome,
                StartDate = startDate,
                EndDate = endDate
            };
        }

        // POST: api/Incomes
        [HttpPost]
        public async Task<ActionResult<Income>> CreateIncome(Income income)
        {
            income.CreatedAt = DateTime.UtcNow;
            _context.Incomes.Add(income);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetIncome), new { id = income.Id }, income);
        }

        // POST: api/Incomes/from-order
        [HttpPost("from-order")]
        public async Task<ActionResult<Income>> CreateIncomeFromOrder(int orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
                return NotFound("Đơn hàng không tồn tại");

            if (order.OrderStatus != OrderStatus.Completed)
                return BadRequest("Chỉ có thể tạo thu nhập từ đơn hàng đã hoàn thành");

            // Kiểm tra xem đã có thu nhập cho đơn hàng này chưa
            var existingIncome = await _context.Incomes.FirstOrDefaultAsync(i => i.OrderId == orderId);
            if (existingIncome != null)
                return BadRequest("Đã có thu nhập cho đơn hàng này");

            var income = new Income
            {
                OrderId = orderId,
                Amount = order.TotalAmount,
                Description = $"Thu nhập từ đơn hàng #{order.OrderNumber}",
                Type = "order",
                Status = "completed",
                CreatedAt = DateTime.UtcNow
            };

            _context.Incomes.Add(income);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetIncome), new { id = income.Id }, income);
        }

        // PUT: api/Incomes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateIncome(int id, Income income)
        {
            if (id != income.Id)
                return BadRequest();

            var existingIncome = await _context.Incomes.FindAsync(id);
            if (existingIncome == null)
                return NotFound();

            existingIncome.Amount = income.Amount;
            existingIncome.Description = income.Description;
            existingIncome.Type = income.Type;
            existingIncome.Status = income.Status;
            existingIncome.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IncomeExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/Incomes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIncome(int id)
        {
            var income = await _context.Incomes.FindAsync(id);
            if (income == null)
                return NotFound();

            _context.Incomes.Remove(income);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool IncomeExists(int id)
        {
            return _context.Incomes.Any(e => e.Id == id);
        }
    }
} 