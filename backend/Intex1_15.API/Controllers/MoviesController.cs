using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex1_15.API.Data;

namespace Intex1_15.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly IntexDbContext _context;

        public MoviesController(IntexDbContext context)
        {
            _context = context;
        }

        // GET: api/movies/test
        [HttpGet("AllMovies")]
        public async Task<ActionResult<IEnumerable<Movie>>> GetTestMovies()
        {
            try
            {
                // Fetch the first 5 records from the movies_titles table
                var movies = await _context.Movies.ToListAsync();
                return Ok(movies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}