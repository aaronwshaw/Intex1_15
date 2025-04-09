import { useEffect, useState } from 'react';
import { fetchMovies } from '../api/MoviesApi';
import { Movie } from '../types/Movie';
import MoviePoster from '../components/MoviePoster';
import { Link } from 'react-router-dom';

const BATCH_SIZE = 10;

function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchMovies();
        setMovies(data.movies);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (nearBottom && !isLoadingMore && visibleCount < movies.length) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, movies.length));
          setIsLoadingMore(false);
        }, 500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCount, isLoadingMore, movies.length]);

  const visibleMovies = movies.slice(0, visibleCount);

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    width: '100vw',
    padding: '20px',
    boxSizing: 'border-box' as const,
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '1200px',
  };

  const cardStyle = {
    flex: '0 0 auto',
    width: '200px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  const cardHoverStyle = {
    transform: 'translateY(-5px)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  };

  return (
    <main style={{ width: '100vw', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      <h1 style={{ textAlign: 'center', paddingTop: '1rem', fontSize: '24px' }}>
        Movie List
      </h1>

      {loading && <p style={{ textAlign: 'center' }}>Loading movies...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>}

      <div style={containerStyle}>
        {visibleMovies.map((m) => (
          <Link
            key={m.show_id}
            to={`/movieinfo/${m.show_id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={cardStyle}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyle);
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

      {isLoadingMore && (
        <p style={{ textAlign: 'center', paddingBottom: '1rem' }}>Loading more...</p>
      )}
    </main>
  );
}

export default MovieList;
