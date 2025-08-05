using System.ComponentModel.DataAnnotations;

namespace NuiTeaApi.Models
{
    public class FinancialReport
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public DateTime ReportDate { get; set; }
        
        [StringLength(20)]
        public string Period { get; set; } = "daily"; // daily, weekly, monthly, yearly
        
        public decimal TotalIncome { get; set; }
        
        public decimal TotalExpense { get; set; }
        
        public decimal NetProfit { get; set; }
        
        public int TotalOrders { get; set; }
        
        public int CompletedOrders { get; set; }
        
        public int CancelledOrders { get; set; }
        
        public decimal AverageOrderValue { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        [StringLength(500)]
        public string? Notes { get; set; }
    }
} 