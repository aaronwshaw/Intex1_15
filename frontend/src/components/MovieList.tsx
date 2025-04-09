import { useEffect, useState, useCallback } from 'react';
import { fetchPaginatedMovies } from '../api/IntexAPI';
import { Movie } from '../types/Movie';
import MoviePoster from '../components/MoviePoster';
import { Link } from 'react-router-dom';

const PAGE_SIZE = 10;

function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || (totalPages && page > totalPages)) return;

    setLoading(true);
    console.log(`🔄 Loading next batch... (page ${page})`);

    const result = await fetchPaginatedMovies(page, PAGE_SIZE);

    if (result) {
      setMovies((prev) => {
        const existingIds = new Set(prev.map((m) => m.show_id));
        const newMovies = result.movies.filter((m) => !existingIds.has(m.show_id));
        return [...prev, ...newMovies];
      });
      setTotalPages(result.totalPages);
      setPage((prev) => prev + 1);
      console.log(`✅ Loaded page ${page}, total pages: ${result.totalPages}`);
    } else {
      setError('Failed to load movies');
    }

    setLoading(false);
  }, [page, loading, totalPages]);

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (nearBottom && !loading && (!totalPages || page <= totalPages)) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, loading, page, totalPages]);

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'block',
        padding: '1rem',
      }}
    >
      <h1 style={{ textAlign: 'center', fontSize: '24px' }}>Movie List</h1>

      {error && <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>}
      {!loading && movies.length === 0 && (
        <p style={{ textAlign: 'center' }}>No movies found.</p>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
          width: '100%',
          padding: '20px',
          boxSizing: 'border-box',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {movies.map((m) => (
          <Link
            key={m.show_id}
            to={`/movieinfo/${m.show_id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                width: '200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
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
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                {m.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#666' }}>{m.primaryGenre}</p>
            </div>
          </Link>
        ))}
      </div>

      {loading && (
        <p style={{ textAlign: 'center', paddingBottom: '1rem' }}>Loading more...</p>
      )}
    </div>
  );
}

export default MovieList;
