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

        // GET: api/movies/AllMovies
        [HttpGet("AllMovies")]
        public async Task<ActionResult<IEnumerable<Movie>>> GetTestMovies()
        {
            try
            {
                var movies = await _context.Movies.Take(10).ToListAsync();
                return Ok(movies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        //fetch all genres
        // GET: api/movies/GetGenres
        [HttpGet("GetGenres")]
        public IActionResult GetGenres()
        {
            try
            {
                var genres = _context.Movies
                    .AsEnumerable()
                    .Select(g => g.PrimaryGenre)
                    .Where(genre => genre != "Unknown" && genre != null)
                    .Distinct()
                    .ToList();

                return Ok(genres);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving genres: {ex.Message}");
            }
        }

        //Search for a movie by title
        // GET: api/movies/Search?query=matrix
        [HttpGet("Search")]
        public async Task<ActionResult<IEnumerable<Movie>>> SearchMovies([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Search query cannot be empty.");

            var results = await _context.Movies
                .Where(m => EF.Functions.Like(m.Title, $"%{query}%"))
                .ToListAsync();

            return Ok(results);
        }


        //get information about a specific movie
        // GET: api/movies/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovieById(string id)
        {
            var movie = await _context.Movies.FindAsync(id);

            if (movie == null)
            {
                return NotFound($"Movie with ID {id} not found.");
            }

            return Ok(movie);
        }

        //Get top rated Movies
        // GET: api/movies/TopRated?count=10
        [HttpGet("TopRated")]
        public async Task<ActionResult<IEnumerable<Movie>>> GetTopRatedMovies([FromQuery] int count = 10)
        {
            var topMovies = await _context.Movies
                .OrderByDescending(m => m.AvgRating)
                .Take(count)
                .ToListAsync();

            return Ok(topMovies);
        }


        //Recommendation endpoints

        //get recomendations based on a movie they liked
        // GET: api/movies/CollabItems/{showId}
        [HttpGet("CollabItems/{showId}")]
        public async Task<ActionResult<IEnumerable<CollabItem>>> GetCollabItemRecs(string showId)
        {
            var results = await _context.CollabItems
                .Where(x => x.WatchedShowId == showId)
                .OrderBy(x => x.Rank)
                .ToListAsync();

            return Ok(results);
        }

        //get recomendations based on similiar movie descriptions
        // GET: api/movies/ContentItems/{showId}
        [HttpGet("ContentItems/{showId}")]
        public async Task<ActionResult<IEnumerable<ContentItem>>> GetContentRecs(string showId)
        {
            var results = await _context.ContentItems
                .Where(x => x.ShowId == showId)
                .OrderBy(x => x.Rank)
                .ToListAsync();

            return Ok(results);
        }

        //Get recomendations based on the specific user
        // GET: api/movies/CollabUsers/{userId}
        [HttpGet("CollabUsers/{userId}")]
        public async Task<ActionResult<IEnumerable<CollabUser>>> GetUserBasedRecs(string userId)
        {
            var results = await _context.CollabUsers
                .Where(x => x.UserId == userId)
                .OrderBy(x => x.Rank)
                .ToListAsync();

            return Ok(results);
        }


        //Admin CRUD endpoints

        //Pagination
        // GET: api/movies/Paginated?pageNumber=1&pageSize=10
        // GET: api/movies/Paginated?pageNumber=1&pageSize=10
        [HttpGet("Paginated")]
        public async Task<ActionResult> GetPaginatedMovies([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            if (pageNumber <= 0 || pageSize <= 0)
                return BadRequest("Page number and size must be greater than 0.");

            var totalMovies = await _context.Movies.CountAsync();

            var movies = await _context.Movies
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                TotalCount = totalMovies,
                Movies = movies
            });
        }



        //add a new movie
        // POST: api/movies
        [HttpPost]
        public async Task<ActionResult<Movie>> AddMovie([FromBody] Movie movie)
        {
            if (movie == null)
                return BadRequest("Movie data is required.");

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMovieById), new { id = movie.ShowId }, movie);
        }

        //Update a movie
        // PUT: api/movies/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMovie(string id, [FromBody] Movie updatedMovie)
        {
            if (id != updatedMovie.ShowId)
                return BadRequest("Movie ID mismatch.");

            var existingMovie = await _context.Movies.FindAsync(id);
            if (existingMovie == null)
                return NotFound($"Movie with ID {id} not found.");

            _context.Entry(existingMovie).CurrentValues.SetValues(updatedMovie);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //Delete a movie
        // DELETE: api/movies/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovie(string id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
                return NotFound($"Movie with ID {id} not found.");

            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
