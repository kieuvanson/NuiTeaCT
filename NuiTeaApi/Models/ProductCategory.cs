namespace NuiTeaApi.Models
{
    public class ProductCategory
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}