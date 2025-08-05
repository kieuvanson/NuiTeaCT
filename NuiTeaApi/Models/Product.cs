using NuiTeaApi.Models;

namespace NuiTeaApi.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public string Image { get; set; }
        public int CategoryId { get; set; }
        public string Description { get; set; } = null!;
        public bool IsActive { get; set; }
        public bool IsSoldOut { get; set; }
        public DateTime CreatedAt { get; set; }

        public ProductCategory? Category { get; set; }
    }
}