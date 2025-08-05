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
    public class AdminNotificationsController : ControllerBase
    {
        private readonly NuiTeaContext _context;

        public AdminNotificationsController(NuiTeaContext context)
        {
            _context = context;
        }

        [HttpGet("materials")]
        public async Task<IActionResult> GetMaterialNotifications()
        {
            try
            {
                var today = DateTime.Today;
                var lowStockThreshold = 10;
                var expiryWarningDays = 7;

                var notifications = await _context.Materials
                    .Where(m => m.IsActive)
                    .Select(m => new
                    {
                        m.Id,
                        m.Name,
                        m.Quantity,
                        m.Unit,
                        m.MinQuantity,
                        m.ExpiryDate,
                        m.ImportDate,
                        Notifications = new List<object>()
                    })
                    .ToListAsync();

                var result = new List<object>();

                foreach (var material in notifications)
                {
                    var materialNotifications = new List<object>();

                    // Kiểm tra số lượng thấp
                    var minQuantity = material.MinQuantity > 0 ? material.MinQuantity : lowStockThreshold;
                    if (material.Quantity <= minQuantity)
                    {
                        materialNotifications.Add(new
                        {
                            Type = "low_stock",
                            Title = "Số lượng thấp",
                            Message = $"Nguyên vật liệu '{material.Name}' chỉ còn {material.Quantity} {material.Unit}. Cần nhập thêm!",
                            Severity = material.Quantity == 0 ? "critical" : "warning",
                            Priority = material.Quantity == 0 ? 1 : 2
                        });
                    }

                    // Kiểm tra ngày hết hạn
                    if (material.ExpiryDate.HasValue)
                    {
                        var daysUntilExpiry = (material.ExpiryDate.Value - today).Days;
                        
                        if (daysUntilExpiry <= 0)
                        {
                            materialNotifications.Add(new
                            {
                                Type = "expired",
                                Title = "Đã hết hạn",
                                Message = $"Nguyên vật liệu '{material.Name}' đã hết hạn từ {Math.Abs(daysUntilExpiry)} ngày trước!",
                                Severity = "critical",
                                Priority = 1
                            });
                        }
                        else if (daysUntilExpiry <= expiryWarningDays)
                        {
                            materialNotifications.Add(new
                            {
                                Type = "expiring_soon",
                                Title = "Sắp hết hạn",
                                Message = $"Nguyên vật liệu '{material.Name}' sẽ hết hạn trong {daysUntilExpiry} ngày!",
                                Severity = "warning",
                                Priority = 2
                            });
                        }
                    }

                    if (materialNotifications.Any())
                    {
                        result.Add(new
                        {
                            materialId = material.Id,
                            materialName = material.Name,
                            materialQuantity = material.Quantity,
                            materialUnit = material.Unit,
                            notifications = materialNotifications
                        });
                    }
                }

                // Sắp xếp theo độ ưu tiên (critical trước, warning sau)
                result = result.OrderByDescending(r => 
                {
                    var notifications = r.GetType().GetProperty("notifications")?.GetValue(r) as List<object>;
                    return notifications?.Min(n => (int)(n.GetType().GetProperty("Priority")?.GetValue(n) ?? 0)) ?? 0;
                }).ToList();

                var response = new
                {
                    totalNotifications = result.Count,
                    notifications = result
                };
                
                Console.WriteLine($"AdminNotifications: Returning {result.Count} notifications");
                foreach (var item in result)
                {
                    var materialName = item.GetType().GetProperty("materialName")?.GetValue(item)?.ToString() ?? "Unknown";
                    var itemNotifications = item.GetType().GetProperty("notifications")?.GetValue(item) as List<object>;
                    var notificationCount = itemNotifications?.Count ?? 0;
                    Console.WriteLine($"- Material: {materialName}, Notifications: {notificationCount}");
                }
                
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }

        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var today = DateTime.Today;
                var lowStockThreshold = 10;
                var expiryWarningDays = 7;

                var materials = await _context.Materials
                    .Where(m => m.IsActive)
                    .ToListAsync();

                var stats = new
                {
                    totalMaterials = materials.Count,
                    lowStockCount = materials.Count(m => m.Quantity <= (m.MinQuantity > 0 ? m.MinQuantity : lowStockThreshold)),
                    outOfStockCount = materials.Count(m => m.Quantity == 0),
                    expiringSoonCount = materials.Count(m => 
                        m.ExpiryDate.HasValue && 
                        (m.ExpiryDate.Value - today).Days <= expiryWarningDays && 
                        (m.ExpiryDate.Value - today).Days > 0),
                    expiredCount = materials.Count(m => 
                        m.ExpiryDate.HasValue && 
                        (m.ExpiryDate.Value - today).Days <= 0)
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }
    }
} 