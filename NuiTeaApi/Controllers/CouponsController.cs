using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuiTeaApi.Models;

namespace NuiTeaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CouponsController : ControllerBase
    {
        private readonly NuiTeaContext _context;
        public CouponsController(NuiTeaContext context)
        {
            _context = context;
        }

        // GET: api/coupons
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var coupons = await _context.Coupons.ToListAsync();
                return Ok(coupons);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }

        // GET: api/coupons/active
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveCoupons()
        {
            var now = DateTime.Now;
            var coupons = await _context.Coupons
                .Where(c => c.IsActive && (c.ExpiryDate == null || c.ExpiryDate > now))
                .ToListAsync();
            return Ok(coupons);
        }

        // GET: api/coupons/validate?code=CODE
        [HttpGet("validate")]
        public async Task<IActionResult> ValidateCoupon([FromQuery] string code)
        {
            var now = DateTime.Now;
            var coupon = await _context.Coupons
                .FirstOrDefaultAsync(c => c.Code == code && c.IsActive && (c.ExpiryDate == null || c.ExpiryDate > now));
            if (coupon == null)
                return NotFound(new { message = "Mã giảm giá không hợp lệ hoặc đã hết hạn." });
            return Ok(coupon);
        }

        // POST: api/coupons
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCouponRequest request)
        {
            try
            {
                if (await _context.Coupons.AnyAsync(c => c.Code == request.Code))
                {
                    return BadRequest(new { message = "Mã voucher đã tồn tại!" });
                }

                var coupon = new Coupon
                {
                    Code = request.Code,
                    Description = request.Description,
                    DiscountType = request.DiscountType,
                    DiscountValue = request.DiscountValue,
                    ExpiryDate = request.ExpiryDate,
                    IsActive = request.IsActive
                };

                _context.Coupons.Add(coupon);
                await _context.SaveChangesAsync();

                return Ok(coupon);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }

        // PUT: api/coupons/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCouponRequest request)
        {
            try
            {
                var coupon = await _context.Coupons.FindAsync(id);
                if (coupon == null)
                {
                    return NotFound(new { message = "Voucher không tồn tại!" });
                }

                if (await _context.Coupons.AnyAsync(c => c.Code == request.Code && c.Id != id))
                {
                    return BadRequest(new { message = "Mã voucher đã tồn tại!" });
                }

                coupon.Code = request.Code;
                coupon.Description = request.Description;
                coupon.DiscountType = request.DiscountType;
                coupon.DiscountValue = request.DiscountValue;
                coupon.ExpiryDate = request.ExpiryDate;
                coupon.IsActive = request.IsActive;

                await _context.SaveChangesAsync();

                return Ok(coupon);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }

        // DELETE: api/coupons/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var coupon = await _context.Coupons.FindAsync(id);
                if (coupon == null)
                {
                    return NotFound(new { message = "Voucher không tồn tại!" });
                }

                _context.Coupons.Remove(coupon);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa voucher thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }
    }

    public class CreateCouponRequest
    {
        public string Code { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string DiscountType { get; set; } = null!;
        public double DiscountValue { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public bool IsActive { get; set; }
    }

    public class UpdateCouponRequest
    {
        public string Code { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string DiscountType { get; set; } = null!;
        public double DiscountValue { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public bool IsActive { get; set; }
    }
}