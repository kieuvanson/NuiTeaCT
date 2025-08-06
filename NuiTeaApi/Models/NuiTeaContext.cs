using Microsoft.EntityFrameworkCore;

namespace NuiTeaApi.Models
{
    public class NuiTeaContext : DbContext
    {
        public NuiTeaContext(DbContextOptions<NuiTeaContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<Coupon> Coupons { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Material> Materials { get; set; }
        public DbSet<Income> Incomes { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<FinancialReport> FinancialReports { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Map DbSet Products về bảng "products" (chữ thường)
            modelBuilder.Entity<Product>().ToTable("products");
            
            // Cấu hình relationship giữa Product và ProductCategory
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId);
            
            modelBuilder.Entity<Coupon>().HasData(
                new Coupon
                {
                    Id = 1,
                    Code = "SUMMER10",
                    Description = "Giảm 10% cho đơn từ 100K",
                    DiscountType = "percent",
                    DiscountValue = 10,
                    ExpiryDate = DateTime.Now.AddDays(10),
                    IsActive = true
                },
                new Coupon
                {
                    Id = 2,
                    Code = "MATCHA3",
                    Description = "Mua 2 tặng 1 cho matcha",
                    DiscountType = "amount",
                    DiscountValue = 20000,
                    ExpiryDate = DateTime.Now.AddDays(5),
                    IsActive = true
                }
            );
        }
    }
}