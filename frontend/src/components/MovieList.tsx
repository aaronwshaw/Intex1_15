import { useEffect, useState, useCallback } from 'react';
import { fetchPaginatedMovies } from '../api/IntexAPI';
import { fetchMoviesByGenres } from '../api/MoviesApi';
import { Movie } from '../types/Movie';
import MoviePoster from '../components/MoviePoster';
import GenreFilter from '../components/GenreFilter';
import { Link } from 'react-router-dom';

const PAGE_SIZE = 14;

function MovieList({
  overrideMovies,
}: {
  overrideMovies?: Movie[];
}) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const loadMore = useCallback(async () => {
    if (loading || (totalPages && page > totalPages)) return;

    setLoading(true);
    const result = await fetchPaginatedMovies(page, PAGE_SIZE);

    if (result) {
      setMovies((prev) => {
        const existingIds = new Set(prev.map((m) => m.show_id));
        const newMovies = result.movies.filter(
          (m: Movie) => !existingIds.has(m.show_id)
        );
        return [...prev, ...newMovies];
      });
      setTotalPages(result.totalPages);
      setPage((prev) => prev + 1);
    } else {
      setError('Failed to load movies');
    }

    setLoading(false);
  }, [page, loading, totalPages]);

  // 🔁 Initial load for infinite scroll
  useEffect(() => {
    if (!overrideMovies && selectedGenres.length === 0) {
      loadMore();
    }
  }, [overrideMovies, selectedGenres]);

  // 🔁 Load genre-filtered movies when checkboxes change
  useEffect(() => {
    const fetchFiltered = async () => {
      if (selectedGenres.length === 0) {
        setFilteredMovies(null);
        return;
      }

      setLoading(true);
      const result = await fetchMoviesByGenres(selectedGenres);
      if (result) {
        setFilteredMovies(result); // expects array of movies
      } else {
        setError('Failed to load filtered movies');
      }
      setLoading(false);
    };

    fetchFiltered();
  }, [selectedGenres]);

  // 🔁 Scroll listener for infinite scroll (only when no filter)
  useEffect(() => {
    if (overrideMovies || selectedGenres.length > 0) return;

    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (nearBottom && !loading && (!totalPages || page <= totalPages)) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, loading, page, totalPages, overrideMovies, selectedGenres]);

  // 🔁 Decide what to show
  const moviesToRender = filteredMovies ?? overrideMovies ?? movies;

  return (
    <main
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#141414',
        display: 'flex',
        padding: '2rem',
        boxSizing: 'border-box',
        gap: '2rem',
      }}
    >
      <aside style={{ width: '200px', color: 'white' }}>
        <h3 style={{ color: 'white', marginBottom: '1rem', textDecoration: 'underline' }}>
          Filter by Genre
        </h3>
        <GenreFilter
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
        />
      </aside>

      <section style={{ flex: 1 }}>
        {error && (
          <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>
        )}

        {!loading && moviesToRender.length === 0 && (
          <p style={{ textAlign: 'center', color: 'white' }}>No movies found.</p>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '20px',
            padding: '20px',
            boxSizing: 'border-box',
          }}
        >
          {moviesToRender.map((m) => (
            <Link
              key={m.show_id}
              to={`/movieinfo/${m.show_id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  width: '200px',
                  height: '330px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '240px',
                    marginBottom: '10px',
                    overflow: 'hidden',
                    borderRadius: '4px',
                  }}
                >
                  <MoviePoster title={m.title} />
                </div>

                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: 'black',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                  }}
                >
                  {m.title}
                </h3>

                <p style={{ fontSize: '14px', color: '#666' }}>{m.primaryGenre}</p>
              </div>
            </Link>
          ))}
        </div>

        {loading && !overrideMovies && (
          <p style={{ textAlign: 'center', paddingBottom: '1rem', color: 'white' }}>
            Loading...
          </p>
        )}
      </section>
    </main>
  );
}

export default MovieList;
