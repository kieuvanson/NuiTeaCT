using Microsoft.AspNetCore.Mvc;
using NuiTeaApi.Models;
using System.Text.Json;

namespace NuiTeaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly NuiTeaContext _context;

        public PaymentsController(NuiTeaContext context)
        {
            _context = context;
        }

        [HttpPost("create")]
        public IActionResult CreatePayment([FromBody] CreatePaymentRequest request)
        {
            try
            {
                var paymentId = "PAY" + DateTime.Now.Ticks;
                var qrData = $"MB|0867859033|KIEU VAN SON|{request.Amount}|{request.OrderInfo}";

                var payment = new Payment
                {
                    PaymentId = paymentId,
                    Method = request.Method,
                    Amount = request.Amount,
                    Status = "Pending",
                    QrCode = qrData,
                    BankAccount = "0867859033",
                    BankName = "MB Bank",
                    AccountHolder = "KIEU VAN SON",
                    OrderInfo = request.OrderInfo,
                    CreatedAt = DateTime.Now
                };

                _context.Payments.Add(payment);
                _context.SaveChanges();

                return Ok(new
                {
                    paymentId = paymentId,
                    method = payment.Method,
                    amount = payment.Amount,
                    qrCode = payment.QrCode,
                    bankAccount = payment.BankAccount,
                    bankName = payment.BankName,
                    accountHolder = payment.AccountHolder,
                    orderInfo = payment.OrderInfo
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("{paymentId}/status")]
        public IActionResult GetPaymentStatus(string paymentId)
        {
            var payment = _context.Payments.FirstOrDefault(p => p.PaymentId == paymentId);
            if (payment == null)
                return NotFound(new { error = "Payment not found" });

            return Ok(new { status = payment.Status });
        }

        [HttpPost("{paymentId}/verify")]
        public IActionResult VerifyPayment(string paymentId)
        {
            var payment = _context.Payments.FirstOrDefault(p => p.PaymentId == paymentId);
            if (payment == null)
                return NotFound(new { error = "Payment not found" });

            payment.Status = "Completed";
            payment.CompletedAt = DateTime.Now;
            _context.SaveChanges();

            return Ok(new { status = "Payment verified successfully" });
        }

        [HttpGet]
        public IActionResult GetAllPayments()
        {
            var payments = _context.Payments.OrderByDescending(p => p.CreatedAt).ToList();
            return Ok(payments);
        }
    }

    public class CreatePaymentRequest
    {
        public string Method { get; set; }
        public decimal Amount { get; set; }
        public string OrderInfo { get; set; }
    }
} 