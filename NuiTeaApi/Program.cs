using NuiTeaApi.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Đăng ký DbContext với MySQL
builder.Services.AddDbContext<NuiTeaContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))));

// Bật CORS cho tất cả nguồn (fix lỗi CORS cho local dev)
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

// Cấu hình port cho Render/Docker
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Urls.Add($"http://0.0.0.0:{port}");

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

// Thêm health check endpoint
app.MapGet("/", () => "NuiTea API is running!");
app.MapGet("/health", () => "OK");

app.Run();
