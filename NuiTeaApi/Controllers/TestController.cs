using Microsoft.AspNetCore.Mvc;

namespace NuiTeaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { message = "Test API hoạt động!", timestamp = DateTime.Now });
        }
    }
} 