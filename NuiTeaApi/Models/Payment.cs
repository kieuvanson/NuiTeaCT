using System.ComponentModel.DataAnnotations;

namespace NuiTeaApi.Models
{
    public class Payment
    {
        public int Id { get; set; }
        
        [Required]
        public string PaymentId { get; set; } = null!;
        
        [Required]
        public string Method { get; set; } = null!; // cod, bank, momo, vnpay
        
        public decimal Amount { get; set; }
        
        public string? OrderInfo { get; set; }
        
        public string Status { get; set; } = "pending"; // pending, success, failed, expired
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime? CompletedAt { get; set; }
        
        public string? TransactionId { get; set; }
        
        public string? QrCode { get; set; }
        
        public string? BankAccount { get; set; }
        
        public string? BankName { get; set; }
        
        public string? AccountHolder { get; set; }
        
        public string? Content { get; set; }
        
        public int? OrderId { get; set; }
        
        public Order? Order { get; set; }
    }
} 