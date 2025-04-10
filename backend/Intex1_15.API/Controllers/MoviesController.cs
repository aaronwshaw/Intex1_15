using System.Linq.Expressions;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Intex1_15.API.Data;
using Microsoft.AspNetCore.Authorization;

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
        [Authorize]
        public async Task<ActionResult<IEnumerable<Movie>>> GetTestMovies()
        {
            try
            {
                var movies = await _context.Movies.ToListAsync();
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
        [Authorize]
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
        
        [HttpGet("MoviesByGenre")]
        public IActionResult GetMoviesByGenres([FromQuery] List<string> genres)
        {
            var moviesQuery = _context.Movies.AsQueryable();

            if (genres.Any())
            {
                moviesQuery = moviesQuery.AsEnumerable()
                    .Where(m => genres.Contains(m.PrimaryGenre)).AsQueryable();
            }

            var movies = moviesQuery.ToList();

            return Ok(movies);
        }


        //Search for a movie by title
        // GET: api/movies/Search?query=matrix
        [HttpGet("Search")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Movie>>> SearchMovies([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Search query cannot be empty.");

            var results = await _context.Movies
                .Where(m => EF.Functions.Like(m.title, $"%{query}%"))
                .ToListAsync();

            return Ok(results);
        }


        //get information about a specific movie
        // GET: api/movies/{id}
        [HttpGet("{id}")]
        [Authorize]
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
        public async Task<ActionResult<IEnumerable<object>>> GetTopRatedMovies([FromQuery] int count = 10)
        {
            var topMovies = await _context.MovieRatings
                .GroupBy(r => r.show_id)
                .Select(group => new
                {
                    ShowId = group.Key,
                    AvgRating = group.Average(r => r.rating)
                })
                .OrderByDescending(x => x.AvgRating)
                .Take(count)
                .Join(_context.Movies,
                      rating => rating.ShowId,
                      movie => movie.show_id,
                      (rating, movie) => new
                      {
                          movie.show_id,
                          movie.title,
                          movie.release_year,
                          movie.description,
                          AvgRating = rating.AvgRating
                      })
                .ToListAsync();

            return Ok(topMovies);
        }



        //Recommendation endpoints

        //get recomendations based on a movie they liked
        // GET: api/movies/CollabItems/{showId}
        [HttpGet("CollabItems/{showId}")]
        [Authorize]
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
        [Authorize]
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
        [Authorize]
        public async Task<ActionResult<IEnumerable<CollabUser>>> GetUserBasedRecs(int userId)
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
        [Authorize]
        public async Task<ActionResult> GetPaginatedMovies([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            if (pageNumber <= 0 || pageSize <= 0)
                return BadRequest("Page number and size must be greater than 0.");

            var totalMovies = await _context.Movies.CountAsync();
            var totalPages = (int)Math.Ceiling(totalMovies / (double)pageSize);

            var movies = await _context.Movies // Optional: add sorting
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                totalPages,
                movies
            });
        }
        
        private static readonly Dictionary<string, string> GenreMap = new()
        {
            { "Action", "action" },
            { "Adventure", "adventure" },
            { "Anime Series International TV Shows", "anime" },
            { "British TV Shows Docuseries International TV Shows", "british" },
            { "Children", "children" },
            { "Comedies", "comedies" },
            { "Comedies Dramas International Movies", "comedies_dramas_int" },
            { "Comedies International Movies", "comedies_int" },
            { "Comedies Romantic Movies", "comedies_rom" },
            { "Crime TV Shows Docuseries", "crime_docu" },
            { "Documentaries", "documentaries" },
            { "Documentaries International Movies", "documentaries_int" },
            { "Docuseries", "docuseries" },
            { "Dramas", "dramas" },
            { "Dramas International Movies", "dramas_int" },
            { "Dramas Romantic Movies", "dramas_rom" },
            { "Family Movies", "family" },
            { "Fantasy", "fantasy" },
            { "Horror Movies", "horror" },
            { "International Movies Thrillers", "thrillers_int" },
            { "International TV Shows Romantic TV Shows TV Dramas", "romantic_tv_shows_int" },
            { "Kids' TV", "kids" },
            { "Language TV Shows", "language_tv" },
            { "Musicals", "musicals" },
            { "Nature TV", "nature" },
            { "Reality TV", "reality" },
            { "Spirituality", "spirituality" },
            { "TV Action", "action_tv" },
            { "TV Comedies", "tv_comedies" },
            { "TV Dramas", "tv_dramas" },
            { "Talk Shows TV Comedies", "talk_shows" },
            { "Thrillers", "thrillers" }
        };

        
        [HttpGet("PaginatedByGenre")]
        [Authorize]
        public async Task<ActionResult> GetPaginatedMoviesByGenre(
            [FromQuery] string genre,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 9)
        {
            if (string.IsNullOrWhiteSpace(genre))
                return BadRequest("Genre is required.");

            // Map the display name to actual property name
            var propName = GenreMap.TryGetValue(genre, out var mappedName)
                ? mappedName
                : genre; // fallback to using raw input

            var genreProperty = typeof(Movie).GetProperty(
                propName,
                BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance
            );

            if (genreProperty == null)
                return BadRequest($"Genre '{genre}' is not valid.");

            // Build expression: m => m.<genre> == 1
            var param = Expression.Parameter(typeof(Movie), "m");
            var property = Expression.Property(param, genreProperty);
            var value = Expression.Constant(1, typeof(int?));
            var condition = Expression.Equal(property, value);
            var lambda = Expression.Lambda<Func<Movie, bool>>(condition, param);

            var query = _context.Movies.Where(lambda);

            var totalMovies = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalMovies / (double)pageSize);

            var movies = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new { totalPages, movies });
        }





        //add a new movie
        // POST: api/movies
        [HttpPost("AddMovie")]
        [Authorize(Roles = "Admin")]
        public IActionResult AddMovie([FromBody] Movie newMovie)
        {
            // Safely get max numeric ID from existing show_id values
            var allIds = _context.Movies
                .Where(m => m.show_id.StartsWith("s"))
                .Select(m => m.show_id)
                .ToList();

            var maxId = allIds
                .Select(id => int.TryParse(id.Substring(1), out var num) ? num : 0)
                .DefaultIfEmpty(0)
                .Max();

            // Generate new show_id
            var newId = $"s{maxId + 1}";
            newMovie.show_id = newId;

            // Save to DB
            _context.Movies.Add(newMovie);
            _context.SaveChanges();

            return Ok(newMovie);
        }

        //Update a movie
        // PUT: api/movies/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateMovie(string id, [FromBody] Movie updatedMovie)
        {
            if (id != updatedMovie.show_id)
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
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMovie(string id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
                return NotFound($"Movie with ID {id} not found.");

            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        //Rate a movie
        // POST: api/Movies/AddRating
        [HttpPost("AddRating")]
        [Authorize]
        public async Task<IActionResult> AddRating([FromBody] MovieRating rating)
        {
            if (rating == null || string.IsNullOrEmpty(rating.show_id))
                return BadRequest("Invalid rating");

            // Optional: prevent duplicate ratings by same user
            var existing = await _context.MovieRatings
                .FirstOrDefaultAsync(r => r.user_id == rating.user_id && r.show_id == rating.show_id);

            if (existing != null)
            {
                existing.rating = rating.rating; // update if it already exists
            }
            else
            {
                _context.MovieRatings.Add(rating);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        //Delete a rating
        // DELETE: api/Movies/DeleteRating?userId=1&showId=tt123
        [HttpDelete("DeleteRating")]
        [Authorize]
        public async Task<IActionResult> DeleteRating([FromQuery] int userId, [FromQuery] string showId)
        {
            var rating = await _context.MovieRatings
                .FirstOrDefaultAsync(r => r.user_id == userId && r.show_id == showId);

            if (rating == null)
                return NotFound("Rating not found");

            _context.MovieRatings.Remove(rating);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Movies/UserRatings/4
        [HttpGet("UserRatings/{userId}")]
        public async Task<IActionResult> GetRatingsByUser(int userId)
        {
            var ratings = await _context.MovieRatings
                .Where(r => r.user_id == userId)
                .ToListAsync();

            if (ratings == null || !ratings.Any())
                return NotFound($"No ratings found for user {userId}");

            return Ok(ratings);
        }
        
        [HttpGet("by-ids")]
        public async Task<ActionResult<List<Movie>>> GetMoviesByShowIds([FromQuery] List<string> ids)
        {
            var movies = await _context.Movies
                .Where(m => ids.Contains(m.show_id))
                .ToListAsync();

            return Ok(movies);
        }




    }
}
