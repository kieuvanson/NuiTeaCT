using NuiTeaApi.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Lấy connection string từ environment variable
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") ?? 
                      builder.Configuration.GetConnectionString("DefaultConnection");

// Đăng ký DbContext với MySQL
builder.Services.AddDbContext<NuiTeaContext>(options =>
{
    if (!string.IsNullOrEmpty(connectionString))
    {
        options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
    }
    else
    {
        // Fallback connection string cho development
        options.UseMySql("Server=localhost;Database=nui_tea_db;Uid=root;Pwd=;",
                        ServerVersion.AutoDetect("Server=localhost;Database=nui_tea_db;Uid=root;Pwd=;"));
    }
});

// Bật CORS cho tất cả nguồn
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

// Chạy migration khi khởi động với error handling
try
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<NuiTeaContext>();
        context.Database.Migrate();
    }
}
catch (Exception ex)
{
    Console.WriteLine($"Migration error: {ex.Message}");
    // Không crash app nếu migration fail
}

// Cấu hình port cho Railway
var port = Environment.GetEnvironmentVariable("PORT") ?? "3000";
app.Urls.Add($"http://0.0.0.0:{port}");

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

// Thêm health check endpoint
app.MapGet("/", () => "NuiTea API is running!");
app.MapGet("/health", () => "OK");

app.Run();
