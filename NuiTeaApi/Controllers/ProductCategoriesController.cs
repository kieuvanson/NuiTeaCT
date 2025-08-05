using Microsoft.AspNetCore.Mvc;
using NuiTeaApi.Models;
using System.Linq;

namespace NuiTeaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductCategoriesController : ControllerBase
    {
        private readonly NuiTeaContext _context;
        public ProductCategoriesController(NuiTeaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetCategories()
        {
            var categories = _context.Set<ProductCategory>().Select(c => new { c.Id, c.Name }).ToList();
            return Ok(categories);
        }
    }
}