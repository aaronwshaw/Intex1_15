import { useEffect, useState, useCallback } from 'react';
import { fetchPaginatedMovies } from '../api/IntexAPI';
import { fetchMoviesByGenres } from '../api/MoviesApi';
import { Movie } from '../types/Movie';
import GenreFilter from '../components/GenreFilter';
import MoviePoster from '../components/MoviePoster';
import { Link } from 'react-router-dom';

const PAGE_SIZE = 12;

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

  useEffect(() => {
    if (!overrideMovies && selectedGenres.length === 0) {
      loadMore();
    }
  }, [overrideMovies, selectedGenres]);

  useEffect(() => {
    const fetchFiltered = async () => {
      if (selectedGenres.length === 0) {
        setFilteredMovies(null);
        return;
      }

      setLoading(true);
      const result = await fetchMoviesByGenres(selectedGenres);
      if (result) {
        setFilteredMovies(result);
      } else {
        setError('Failed to load filtered movies');
      }
      setLoading(false);
    };

    fetchFiltered();
  }, [selectedGenres]);

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
        <h3
          style={{
            color: '#f2f2f2',
            marginBottom: '1rem',
            fontSize: '1.5rem',
            fontWeight: 600,
            borderLeft: '4px solid #e92424',
            paddingLeft: '0.75rem',
          }}
        >
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
            gridTemplateColumns: 'repeat(6, 1fr)',
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
                  textAlign: 'center',
                  backgroundColor: '#2a2a2a',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingBottom: '0.75rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
                }}
              >
                <div style={{ width: '100%' }}>
                  <MoviePoster title={m.title} />
                </div>
                <div
                style={{
                  marginTop: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'white',
                  maxWidth: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  height: '24px',
                  padding: '0 0.5rem', // <-- Add left & right padding
                  boxSizing: 'border-box',
                }}
              >
                {m.title}
              </div>

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
