using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace NuiTeaApi.Models
{
    public enum OrderStatus
    {
        Pending,
        Confirmed,
        Preparing,
        Delivering,
        Completed,
        Cancelled
    }

    public enum PaymentStatus
    {
        Pending,
        Paid,
        Failed,
        Refunded
    }

    public class Order
    {
        [Key]
        public int Id { get; set; }

        public string? OrderNumber { get; set; }
        public string? CustomerName { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? Note { get; set; }
        public decimal TotalAmount { get; set; }
        public string? PaymentMethod { get; set; }
        
        [Column(TypeName = "varchar(20)")]
        public string? PaymentStatusString { get; set; }
        
        [Column(TypeName = "varchar(20)")]
        public string? OrderStatusString { get; set; }
        
        [NotMapped]
        public PaymentStatus PaymentStatus 
        { 
            get => Enum.TryParse<PaymentStatus>(PaymentStatusString, out var status) ? status : PaymentStatus.Pending;
            set => PaymentStatusString = value.ToString();
        }
        
        [NotMapped]
        public OrderStatus OrderStatus 
        { 
            get => Enum.TryParse<OrderStatus>(OrderStatusString, out var status) ? status : OrderStatus.Pending;
            set => OrderStatusString = value.ToString();
        }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? EstimatedDelivery { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? CouponCode { get; set; }
        public decimal? DiscountAmount { get; set; }

        // JSON field để lưu thông tin items
        public string? OrderItemsJson { get; set; }

        public List<OrderItem> GetItems()
        {
            if (string.IsNullOrEmpty(OrderItemsJson))
                return new List<OrderItem>();
            
            try
            {
                return JsonSerializer.Deserialize<List<OrderItem>>(OrderItemsJson) ?? new List<OrderItem>();
            }
            catch
            {
                return new List<OrderItem>();
            }
        }

        public void SetItems(List<OrderItem> items)
        {
            OrderItemsJson = JsonSerializer.Serialize(items);
        }
    }

    public class OrderItem
    {
        public string? ProductName { get; set; }
        public string? ProductImage { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public object? Options { get; set; }
    }
}
