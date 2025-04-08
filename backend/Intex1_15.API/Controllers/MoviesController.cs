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
                var movies = await _context.Movies.Take(10).ToListAsync();
                return Ok(movies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("GetGenres")]
        public IActionResult GetGenres()
        {
            try
            {
                // Load movies into memory and then filter genres
                var genres = _context.Movies
                    .AsEnumerable()  // Switch to LINQ-to-Objects for in-memory processing
                    .Select(g => g.PrimaryGenre)
                    .Where(genre => genre != "Unknown" && genre != null)  // Exclude unknown and null genres
                    .Distinct()  // Get unique genres
                    .ToList();

                return Ok(genres);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving genres: {ex.Message}");
            }
        }


    }
}