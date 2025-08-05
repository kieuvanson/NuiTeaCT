using Microsoft.AspNetCore.Mvc;
using NuiTeaApi.Models;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;
using BCrypt.Net;

namespace NuiTeaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly NuiTeaContext _context;
        public CustomersController(NuiTeaContext context)
        {
            _context = context;
        }

        // POST: api/customers/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password) || string.IsNullOrWhiteSpace(req.FullName))
                return BadRequest(new { message = "Vui lòng nhập đầy đủ thông tin." });

            if (await _context.Customers.AnyAsync(c => c.Email == req.Email))
                return BadRequest(new { message = "Email đã được sử dụng." });

            if (!string.IsNullOrEmpty(req.Username) && await _context.Customers.AnyAsync(c => c.Username == req.Username))
                return BadRequest(new { message = "Username đã tồn tại." });

            var customer = new Customer
            {
                Username = string.IsNullOrEmpty(req.Username) ? req.Email.Split('@')[0] : req.Username,
                Email = req.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
                FullName = req.FullName,
                Phone = req.Phone,
                Address = req.Address,
                DateOfBirth = req.DateOfBirth,
                IsActive = true,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                Role = req.Role ?? "user"
            };
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đăng ký thành công!", customer.Id, customer.Email, customer.FullName, customer.Role });
        }

        // POST: api/customers/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                return BadRequest(new { message = "Vui lòng nhập email và mật khẩu." });

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == req.Email && c.IsActive);
            if (customer == null)
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });

            if (!BCrypt.Net.BCrypt.Verify(req.Password, customer.PasswordHash))
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                customer.Id,
                customer.Email,
                customer.FullName,
                customer.Username,
                customer.Role
            });
        }

        // GET: api/customers
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var customers = await _context.Customers
                    .Select(c => new
                    {
                        c.Id,
                        c.Username,
                        c.Email,
                        c.FullName,
                        c.Phone,
                        c.Address,
                        c.Role,
                        c.IsActive,
                        c.CreatedAt,
                        c.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(customers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }

        // PUT: api/customers/{id}/toggle-status
        [HttpPut("{id}/toggle-status")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            try
            {
                var customer = await _context.Customers.FindAsync(id);
                if (customer == null)
                    return NotFound(new { message = "Không tìm thấy tài khoản." });

                customer.IsActive = !customer.IsActive;
                customer.UpdatedAt = DateTime.Now;
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = customer.IsActive ? "Mở khóa tài khoản thành công." : "Khóa tài khoản thành công.",
                    customer 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }

        // DELETE: api/customers/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var customer = await _context.Customers.FindAsync(id);
                if (customer == null)
                    return NotFound(new { message = "Không tìm thấy tài khoản." });

                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa tài khoản thành công." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }

        // PUT: api/customers/update
        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] UpdateRequest req)
        {
            if (req.Id <= 0 || string.IsNullOrWhiteSpace(req.Email))
                return BadRequest(new { message = "Thiếu thông tin tài khoản." });
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Id == req.Id && c.Email == req.Email);
            if (customer == null)
                return NotFound(new { message = "Không tìm thấy tài khoản." });
            customer.FullName = req.FullName ?? customer.FullName;
            customer.Username = req.Username ?? customer.Username;
            customer.Phone = req.Phone ?? customer.Phone;
            customer.Address = req.Address ?? customer.Address;
            customer.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công!", customer });
        }

        public class RegisterRequest
        {
            public string? Username { get; set; }
            public string Email { get; set; } = null!;
            public string Password { get; set; } = null!;
            public string FullName { get; set; } = null!;
            public string? Phone { get; set; }
            public string? Address { get; set; }
            public DateTime? DateOfBirth { get; set; }
            public string? Role { get; set; }
        }

        public class LoginRequest
        {
            public string Email { get; set; } = null!;
            public string Password { get; set; } = null!;
        }

        public class UpdateRequest
        {
            public int Id { get; set; }
            public string Email { get; set; } = null!;
            public string? FullName { get; set; }
            public string? Username { get; set; }
            public string? Phone { get; set; }
            public string? Address { get; set; }
        }
    }
}