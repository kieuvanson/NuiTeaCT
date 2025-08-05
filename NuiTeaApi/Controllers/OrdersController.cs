using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuiTeaApi.Models;
using System.Linq;

namespace NuiTeaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly NuiTeaContext _context;

        public OrdersController(NuiTeaContext context)
        {
            _context = context;
        }

        // Lấy tất cả đơn hàng (cho admin)
        [HttpGet]
        public async Task<IActionResult> GetOrders([FromQuery] string? customerEmail = null)
        {
            try
            {
                var query = _context.Orders.AsQueryable();
                
                // Nếu có customerEmail, chỉ lấy đơn hàng của khách hàng đó
                if (!string.IsNullOrEmpty(customerEmail))
                {
                    query = query.Where(o => o.Email == customerEmail);
                    Console.WriteLine($"Filtering orders by email: {customerEmail}");
                }
                
                var orders = await query
                    .OrderByDescending(o => o.CreatedAt)
                    .ToListAsync();

                var result = orders.Select(order => new
                {
                    id = order.Id,
                    orderNumber = order.OrderNumber ?? "",
                    customerName = order.CustomerName ?? "",
                    phone = order.Phone ?? "",
                    address = order.Address ?? "",
                    totalAmount = order.TotalAmount,
                    paymentMethod = order.PaymentMethod ?? "",
                    paymentStatus = order.PaymentStatusString ?? "Pending",
                    orderStatus = order.OrderStatusString ?? "Pending",
                    createdAt = order.CreatedAt,
                    estimatedDelivery = order.EstimatedDelivery,
                    completedAt = order.CompletedAt,
                    note = order.Note ?? "",
                    couponCode = order.CouponCode ?? "",
                    discountAmount = order.DiscountAmount,
                    items = order.GetItems()
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // Lấy đơn hàng theo ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null)
                    return NotFound(new { error = "Không tìm thấy đơn hàng" });

                var result = new
                {
                    id = order.Id,
                    orderNumber = order.OrderNumber ?? "",
                    customerName = order.CustomerName ?? "",
                    phone = order.Phone ?? "",
                    address = order.Address ?? "",
                    totalAmount = order.TotalAmount,
                    paymentMethod = order.PaymentMethod ?? "",
                    paymentStatus = order.PaymentStatusString ?? "Pending",
                    orderStatus = order.OrderStatusString ?? "Pending",
                    createdAt = order.CreatedAt,
                    estimatedDelivery = order.EstimatedDelivery,
                    completedAt = order.CompletedAt,
                    note = order.Note ?? "",
                    couponCode = order.CouponCode ?? "",
                    discountAmount = order.DiscountAmount,
                    items = order.GetItems()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // Tạo đơn hàng mới
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            try
            {
                Console.WriteLine($"Received order request: {System.Text.Json.JsonSerializer.Serialize(request)}");
                
                // Validation
                if (string.IsNullOrEmpty(request.OrderNumber))
                    return BadRequest(new { error = "OrderNumber is required" });
                
                if (string.IsNullOrEmpty(request.CustomerName))
                    return BadRequest(new { error = "CustomerName is required" });
                
                if (string.IsNullOrEmpty(request.Phone))
                    return BadRequest(new { error = "Phone is required" });
                
                if (string.IsNullOrEmpty(request.Email))
                    return BadRequest(new { error = "Email is required" });
                
                if (string.IsNullOrEmpty(request.Address))
                    return BadRequest(new { error = "Address is required" });
                
                if (request.Items == null || request.Items.Count == 0)
                    return BadRequest(new { error = "Items are required" });

                var order = new Order
                {
                    OrderNumber = request.OrderNumber,
                    CustomerName = request.CustomerName,
                    Phone = request.Phone,
                    Email = request.Email,
                    Address = request.Address,
                    Note = request.Note,
                    TotalAmount = request.TotalAmount,
                    PaymentMethod = request.PaymentMethod,
                    PaymentStatusString = request.PaymentStatus,
                    OrderStatusString = request.OrderStatus,
                    CreatedAt = DateTime.Now,
                    EstimatedDelivery = DateTime.Now.AddMinutes(30),
                    CouponCode = request.CouponCode,
                    DiscountAmount = request.DiscountAmount ?? 0
                };

                order.SetItems(request.Items);

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                Console.WriteLine($"Order created successfully with ID: {order.Id}");

                return Ok(new { 
                    id = order.Id,
                    orderNumber = order.OrderNumber,
                    message = "Đơn hàng đã được tạo thành công"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating order: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return BadRequest(new { error = ex.Message });
            }
        }

        // PUT: api/Orders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, Order order)
        {
            if (id != order.Id)
                return BadRequest();

            var existingOrder = await _context.Orders.FindAsync(id);
            if (existingOrder == null)
                return NotFound();

            // Lưu trạng thái cũ để so sánh
            var oldOrderStatus = existingOrder.OrderStatusString;
            var oldPaymentStatus = existingOrder.PaymentStatusString;

            // Cập nhật thông tin đơn hàng
            existingOrder.CustomerName = order.CustomerName;
            existingOrder.Phone = order.Phone;
            existingOrder.Email = order.Email;
            existingOrder.Address = order.Address;
            existingOrder.Note = order.Note;
            existingOrder.TotalAmount = order.TotalAmount;
            existingOrder.PaymentMethod = order.PaymentMethod;
            existingOrder.OrderStatusString = order.OrderStatusString;
            existingOrder.PaymentStatusString = order.PaymentStatusString;
            existingOrder.EstimatedDelivery = order.EstimatedDelivery;
            existingOrder.CouponCode = order.CouponCode;
            existingOrder.DiscountAmount = order.DiscountAmount;
            existingOrder.OrderItemsJson = order.OrderItemsJson;

            // Nếu đơn hàng được cập nhật thành "Đã giao hàng" và "Đã thanh toán", tạo thu nhập
            if (order.OrderStatusString == "Completed" && order.PaymentStatusString == "Paid" && 
                (oldOrderStatus != "Completed" || oldPaymentStatus != "Paid"))
            {
                // Kiểm tra xem đã có thu nhập cho đơn hàng này chưa
                var existingIncome = await _context.Incomes.FirstOrDefaultAsync(i => i.OrderId == id);
                if (existingIncome == null)
                {
                    var income = new Income
                    {
                        OrderId = id,
                        Amount = order.TotalAmount,
                        Description = $"Thu nhập từ đơn hàng #{order.OrderNumber} - {order.CustomerName}",
                        Type = "order",
                        Status = "completed",
                        CreatedAt = DateTime.UtcNow
                    };

                    _context.Incomes.Add(income);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // Cập nhật trạng thái đơn hàng
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusRequest request)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null)
                    return NotFound(new { error = "Không tìm thấy đơn hàng" });

                var oldOrderStatus = order.OrderStatusString;
                order.OrderStatusString = request.OrderStatus;
                
                if (request.OrderStatus == "Completed")
                {
                    order.CompletedAt = DateTime.Now;
                }

                // Nếu đơn hàng được cập nhật thành "Đã giao hàng" và "Đã thanh toán", tạo thu nhập
                if (order.OrderStatusString == "Completed" && order.PaymentStatusString == "Paid" && 
                    oldOrderStatus != "Completed")
                {
                    // Kiểm tra xem đã có thu nhập cho đơn hàng này chưa
                    var existingIncome = await _context.Incomes.FirstOrDefaultAsync(i => i.OrderId == id);
                    if (existingIncome == null)
                    {
                        var income = new Income
                        {
                            OrderId = id,
                            Amount = order.TotalAmount,
                            Description = $"Thu nhập từ đơn hàng #{order.OrderNumber} - {order.CustomerName}",
                            Type = "order",
                            Status = "completed",
                            CreatedAt = DateTime.UtcNow
                        };

                        _context.Incomes.Add(income);
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Cập nhật trạng thái đơn hàng thành công",
                    orderStatus = order.OrderStatusString
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // Cập nhật trạng thái thanh toán
        [HttpPut("{id}/payment-status")]
        public async Task<IActionResult> UpdatePaymentStatus(int id, [FromBody] UpdatePaymentStatusRequest request)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null)
                    return NotFound(new { error = "Không tìm thấy đơn hàng" });

                var oldPaymentStatus = order.PaymentStatusString;
                order.PaymentStatusString = request.PaymentStatus;

                // Nếu đơn hàng được cập nhật thành "Đã giao hàng" và "Đã thanh toán", tạo thu nhập
                if (order.OrderStatusString == "Completed" && order.PaymentStatusString == "Paid" && 
                    oldPaymentStatus != "Paid")
                {
                    // Kiểm tra xem đã có thu nhập cho đơn hàng này chưa
                    var existingIncome = await _context.Incomes.FirstOrDefaultAsync(i => i.OrderId == id);
                    if (existingIncome == null)
                    {
                        var income = new Income
                        {
                            OrderId = id,
                            Amount = order.TotalAmount,
                            Description = $"Thu nhập từ đơn hàng #{order.OrderNumber} - {order.CustomerName}",
                            Type = "order",
                            Status = "completed",
                            CreatedAt = DateTime.UtcNow
                        };

                        _context.Incomes.Add(income);
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Cập nhật trạng thái thanh toán thành công",
                    paymentStatus = order.PaymentStatusString
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // Xóa đơn hàng
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null)
                    return NotFound(new { error = "Không tìm thấy đơn hàng" });

                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa đơn hàng thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }

    public class CreateOrderRequest
    {
        public string OrderNumber { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Note { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public string OrderStatus { get; set; } = string.Empty;
        public string CouponCode { get; set; } = string.Empty;
        public decimal? DiscountAmount { get; set; }
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();
    }

    public class UpdateOrderStatusRequest
    {
        public string OrderStatus { get; set; } = string.Empty;
    }

    public class UpdatePaymentStatusRequest
    {
        public string PaymentStatus { get; set; } = string.Empty;
    }
} 