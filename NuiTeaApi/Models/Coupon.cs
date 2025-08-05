using System;

namespace NuiTeaApi.Models
{
    public class Coupon
    {
        public int Id { get; set; }
        public string Code { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string DiscountType { get; set; } = null!; // "percent" hoặc "amount"
        public double DiscountValue { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public bool IsActive { get; set; }
    }
}