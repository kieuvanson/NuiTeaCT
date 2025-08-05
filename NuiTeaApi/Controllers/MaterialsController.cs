using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuiTeaApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NuiTeaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaterialsController : ControllerBase
    {
        private readonly NuiTeaContext _context;

        public MaterialsController(NuiTeaContext context)
        {
            _context = context;
        }

        // GET: api/materials
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                Console.WriteLine("Bắt đầu lấy danh sách nguyên vật liệu...");
                
                // Test với database
                var count = await _context.Materials.CountAsync();
                Console.WriteLine($"Tổng số nguyên vật liệu: {count}");
                
                var materials = await _context.Materials
                    .Where(m => m.IsActive)
                    .Select(m => new
                    {
                        m.Id,
                        m.Name,
                        m.Category,
                        m.Supplier,
                        m.Quantity,
                        m.Unit,
                        m.ImportPrice,
                        m.ImportDate,
                        m.ExpiryDate,
                        m.ShelfLifeDays,
                        m.MinQuantity,
                        m.IsActive,
                        m.CreatedAt,
                        m.UpdatedAt,
                        // Tính toán trạng thái hạn sử dụng
                        ExpiryStatus = m.ExpiryDate.HasValue ? 
                            (m.ExpiryDate.Value.Date <= DateTime.Now.Date ? "expired" : 
                             m.ExpiryDate.Value.Date <= DateTime.Now.Date.AddDays(3) ? "warning" : "normal") : "normal"
                        // DaysUntilExpiry = m.ExpiryDate.HasValue ? 
                        //     (int?)((m.ExpiryDate.Value.Date - DateTime.Now.Date).TotalDays) : null
                    })
                    .ToListAsync();

                Console.WriteLine($"Lấy được {materials.Count} nguyên vật liệu");
                return Ok(materials);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi trong GetAll: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }

        // POST: api/materials
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateMaterialRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Name))
                    return BadRequest(new { message = "Tên nguyên vật liệu không được để trống." });

                var material = new Material
                {
                    Name = request.Name,
                    Category = request.Category ?? "",
                    Supplier = request.Supplier ?? "",
                    Quantity = request.Quantity ?? 0,
                    Unit = request.Unit ?? "",
                    ImportPrice = request.ImportPrice ?? 0,
                    ImportDate = request.ImportDate ?? DateTime.Now,
                                         ExpiryDate = request.ExpiryDate,
                     ShelfLifeDays = request.ShelfLifeDays ?? 30, // Mặc định 30 ngày
                     MinQuantity = request.MinQuantity ?? 10,
                    IsActive = true,
                    CreatedAt = DateTime.Now
                };

                                 // Tự động tính hạn sử dụng nếu không được cung cấp
                 if (!material.ExpiryDate.HasValue && material.ShelfLifeDays > 0)
                 {
                     material.ExpiryDate = DateTime.Now.AddDays(material.ShelfLifeDays);
                 }

                _context.Materials.Add(material);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Thêm nguyên vật liệu thành công.", material });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }

        // PUT: api/materials/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateMaterialRequest req)
        {
            try
            {
                var material = await _context.Materials.FindAsync(id);
                if (material == null)
                    return NotFound(new { message = "Không tìm thấy nguyên vật liệu." });

                // Cập nhật thông tin
                material.Name = req.Name ?? material.Name;
                material.Category = req.Category ?? material.Category;
                material.Supplier = req.Supplier ?? material.Supplier;
                material.Quantity = req.Quantity ?? material.Quantity;
                material.Unit = req.Unit ?? material.Unit;
                material.ImportPrice = req.ImportPrice ?? material.ImportPrice;
                material.ImportDate = req.ImportDate ?? material.ImportDate;
                material.ExpiryDate = req.ExpiryDate ?? material.ExpiryDate;
                material.MinQuantity = req.MinQuantity ?? material.MinQuantity;
                material.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new {
                    message = "Cập nhật nguyên vật liệu thành công.",
                    material
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }

        // PUT: api/materials/{id}/import
        [HttpPut("{id}/import")]
        public async Task<IActionResult> Import(int id, [FromBody] ImportMaterialRequest request)
        {
            try
            {
                var material = await _context.Materials.FindAsync(id);
                if (material == null)
                    return NotFound(new { message = "Không tìm thấy nguyên vật liệu." });

                // Cập nhật số lượng
                material.Quantity += request.Quantity;
                material.ImportDate = DateTime.Now;
                material.UpdatedAt = DateTime.Now;
                
                                 // Tự động tính hạn sử dụng dựa trên ShelfLifeDays
                 if (material.ShelfLifeDays > 0)
                 {
                     material.ExpiryDate = DateTime.Now.AddDays(material.ShelfLifeDays);
                 }

                // Tạo chi phí từ việc nhập nguyên liệu
                var expense = new Expense
                {
                    MaterialId = id,
                    Amount = request.Quantity * material.ImportPrice,
                    Quantity = request.Quantity,
                    Unit = material.Unit,
                    Description = $"Nhập kho {request.Quantity} {material.Unit} {material.Name}",
                    Type = "material",
                    Supplier = material.Supplier,
                    Status = "completed",
                    CreatedAt = DateTime.UtcNow,
                    ExpenseDate = DateTime.UtcNow
                };

                _context.Expenses.Add(expense);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = $"Nhập kho thành công. Số lượng hiện tại: {material.Quantity} {material.Unit}",
                    material,
                    expense = new { 
                        amount = expense.Amount,
                        description = expense.Description
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }

        // PUT: api/materials/{id}/export
        [HttpPut("{id}/export")]
        public async Task<IActionResult> Export(int id, [FromBody] ExportMaterialRequest request)
        {
            try
            {
                var material = await _context.Materials.FindAsync(id);
                if (material == null)
                    return NotFound(new { message = "Không tìm thấy nguyên vật liệu." });

                if (material.Quantity < request.Quantity)
                    return BadRequest(new { message = "Số lượng xuất kho vượt quá số lượng hiện có." });

                // Cập nhật số lượng
                material.Quantity -= request.Quantity;
                material.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = $"Xuất kho thành công. Số lượng còn lại: {material.Quantity} {material.Unit}",
                    material 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }

        // GET: api/materials/expiry-warnings
        [HttpGet("expiry-warnings")]
        public async Task<IActionResult> GetExpiryWarnings()
        {
            try
            {
                var today = DateTime.Now.Date;
                var warningDate = today.AddDays(3);

                var warnings = await _context.Materials
                    .Where(m => m.IsActive && m.ExpiryDate.HasValue && m.ExpiryDate.Value.Date <= warningDate)
                    .Select(m => new
                    {
                        m.Id,
                        m.Name,
                        m.Category,
                        m.Quantity,
                        m.Unit,
                        m.ExpiryDate,
                        DaysUntilExpiry = m.ExpiryDate.HasValue ? (int?)(m.ExpiryDate.Value.Date - today).TotalDays : null,
                        Status = m.ExpiryDate.Value.Date <= today ? "expired" : "warning"
                    })
                    .OrderBy(m => m.ExpiryDate)
                    .ToListAsync();

                return Ok(new
                {
                    warnings,
                    totalWarnings = warnings.Count,
                    expiredCount = warnings.Count(w => w.Status == "expired"),
                    warningCount = warnings.Count(w => w.Status == "warning")
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }

        // DELETE: api/materials/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var material = await _context.Materials.FindAsync(id);
                if (material == null)
                    return NotFound(new { message = "Không tìm thấy nguyên vật liệu." });

                material.IsActive = false;
                material.UpdatedAt = DateTime.Now;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa nguyên vật liệu thành công." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }
    }

    public class CreateMaterialRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string? Supplier { get; set; }
        public int? Quantity { get; set; }
        public string? Unit { get; set; }
        public decimal? ImportPrice { get; set; }
        public DateTime? ImportDate { get; set; }
                 public DateTime? ExpiryDate { get; set; }
         public int? ShelfLifeDays { get; set; }
         public int? MinQuantity { get; set; }
     }

     public class UpdateMaterialRequest
     {
         public string? Name { get; set; }
         public string? Category { get; set; }
         public string? Supplier { get; set; }
         public int? Quantity { get; set; }
         public string? Unit { get; set; }
         public decimal? ImportPrice { get; set; }
         public DateTime? ImportDate { get; set; }
         public DateTime? ExpiryDate { get; set; }
         public int? ShelfLifeDays { get; set; }
        public int? MinQuantity { get; set; }
    }

    public class ImportMaterialRequest
    {
        public int Quantity { get; set; }
    }

    public class ExportMaterialRequest
    {
        public int Quantity { get; set; }
    }
} 