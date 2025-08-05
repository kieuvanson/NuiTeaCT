using System.ComponentModel.DataAnnotations;

namespace NuiTeaApi.Models
{
    public class Material
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string Category { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string Supplier { get; set; } = string.Empty;
        
        public int Quantity { get; set; }
        
        [StringLength(20)]
        public string Unit { get; set; } = string.Empty;
        
        public decimal ImportPrice { get; set; }
        
        public DateTime ImportDate { get; set; }
        
        public DateTime? ExpiryDate { get; set; }
        
        public int ShelfLifeDays { get; set; } = 30; // Thời hạn sử dụng (ngày)
        
        public int MinQuantity { get; set; } = 10;
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public DateTime? UpdatedAt { get; set; }
    }
} 