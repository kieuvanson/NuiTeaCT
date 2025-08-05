using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuiTeaApi.Models;

namespace NuiTeaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpensesController : ControllerBase
    {
        private readonly NuiTeaContext _context;

        public ExpensesController(NuiTeaContext context)
        {
            _context = context;
        }

        // GET: api/Expenses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses()
        {
            return await _context.Expenses
                .Include(e => e.Material)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();
        }

        // GET: api/Expenses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Expense>> GetExpense(int id)
        {
            var expense = await _context.Expenses
                .Include(e => e.Material)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (expense == null)
            {
                return NotFound();
            }

            return expense;
        }

        // GET: api/Expenses/summary
        [HttpGet("summary")]
        public async Task<ActionResult<object>> GetExpenseSummary([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var query = _context.Expenses.AsQueryable();

            if (startDate.HasValue)
                query = query.Where(e => e.ExpenseDate >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(e => e.ExpenseDate <= endDate.Value);

            var totalExpense = await query.SumAsync(e => e.Amount);
            var totalTransactions = await query.CountAsync();
            var averageExpense = totalTransactions > 0 ? totalExpense / totalTransactions : 0;

            // Thống kê theo loại
            var expensesByType = await query
                .GroupBy(e => e.Type)
                .Select(g => new { Type = g.Key, Total = g.Sum(e => e.Amount), Count = g.Count() })
                .ToListAsync();

            return new
            {
                TotalExpense = totalExpense,
                TotalTransactions = totalTransactions,
                AverageExpense = averageExpense,
                ExpensesByType = expensesByType,
                StartDate = startDate,
                EndDate = endDate
            };
        }

        // POST: api/Expenses
        [HttpPost]
        public async Task<ActionResult<Expense>> CreateExpense(Expense expense)
        {
            expense.CreatedAt = DateTime.UtcNow;
            expense.ExpenseDate = DateTime.UtcNow;
            
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExpense), new { id = expense.Id }, expense);
        }

        // POST: api/Expenses/from-material
        [HttpPost("from-material")]
        public async Task<ActionResult<Expense>> CreateExpenseFromMaterial(int materialId, int quantity, decimal unitPrice, string supplier)
        {
            var material = await _context.Materials.FindAsync(materialId);
            if (material == null)
                return NotFound("Nguyên vật liệu không tồn tại");

            var expense = new Expense
            {
                MaterialId = materialId,
                Amount = quantity * unitPrice,
                Quantity = quantity,
                Unit = material.Unit,
                Description = $"Nhập {quantity} {material.Unit} {material.Name}",
                Type = "material",
                Supplier = supplier,
                Status = "completed",
                CreatedAt = DateTime.UtcNow,
                ExpenseDate = DateTime.UtcNow
            };

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExpense), new { id = expense.Id }, expense);
        }

        // PUT: api/Expenses/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, Expense expense)
        {
            if (id != expense.Id)
                return BadRequest();

            var existingExpense = await _context.Expenses.FindAsync(id);
            if (existingExpense == null)
                return NotFound();

            existingExpense.Amount = expense.Amount;
            existingExpense.Quantity = expense.Quantity;
            existingExpense.Unit = expense.Unit;
            existingExpense.Description = expense.Description;
            existingExpense.Type = expense.Type;
            existingExpense.Supplier = expense.Supplier;
            existingExpense.Status = expense.Status;
            existingExpense.ReceiptNumber = expense.ReceiptNumber;
            existingExpense.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExpenseExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/Expenses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
                return NotFound();

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExpenseExists(int id)
        {
            return _context.Expenses.Any(e => e.Id == id);
        }
    }
} 