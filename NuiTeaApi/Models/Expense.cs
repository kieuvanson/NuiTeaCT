using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NuiTeaApi.Models
{
    public class Expense
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int MaterialId { get; set; }
        
        [ForeignKey("MaterialId")]
        public Material Material { get; set; } = null!;
        
        [Required]
        public decimal Amount { get; set; }
        
        [Required]
        public int Quantity { get; set; }
        
        [StringLength(20)]
        public string Unit { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string Description { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string Type { get; set; } = "material"; // material, other
        
        [StringLength(100)]
        public string Supplier { get; set; } = string.Empty;
        
        public DateTime ExpenseDate { get; set; } = DateTime.UtcNow;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        [StringLength(50)]
        public string Status { get; set; } = "completed"; // completed, pending, cancelled
        
        [StringLength(100)]
        public string? ReceiptNumber { get; set; }
    }
} 