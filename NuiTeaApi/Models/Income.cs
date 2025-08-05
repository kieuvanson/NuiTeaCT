using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NuiTeaApi.Models
{
    public class Income
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int OrderId { get; set; }
        
        [ForeignKey("OrderId")]
        public Order Order { get; set; } = null!;
        
        [Required]
        public decimal Amount { get; set; }
        
        [StringLength(100)]
        public string Description { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string Type { get; set; } = "order"; // order, other
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        [StringLength(50)]
        public string Status { get; set; } = "completed"; // completed, pending, cancelled
    }
} 