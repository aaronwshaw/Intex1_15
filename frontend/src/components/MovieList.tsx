import { useEffect, useState } from 'react';
import { fetchMovies } from '../api/MoviesApi';
import { Movie } from '../types/Movie';
import MoviePoster from '../components/MoviePoster';

function MovieList({ selectedGenres }: { selectedGenres: string[] }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  const filteredMovies = movies.filter((movie) =>
    selectedGenres.length === 0 || selectedGenres.includes(movie.primaryGenre)
  );

  if (loading) return <p className="text-center w-full p-4">Loading movies...</p>;
  if (error) return <p className="text-center text-red-500 w-full p-4">Error: {error}</p>;

  // Define inline styles to override any parent styling
  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: '20px',
    width: '100%',
    padding: '20px',
    boxSizing: 'border-box' as const,
  };

  const cardStyle = {
    flex: '0 0 auto',
    width: '200px',
    margin: '0',
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
    <div style={containerStyle}>
      {filteredMovies.map((m) => (
        <div 
          id='movieCard' 
          className='card'
          key={m.show_id}
          style={cardStyle}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, cardHoverStyle);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          }}
        >
          <div style={{ width: '100%', height: '240px', marginBottom: '10px', overflow: 'hidden', borderRadius: '4px' }}>
            <MoviePoster title={m.title} />
          </div>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: 'bold',
            margin: '0 0 5px 0',
            textAlign: 'center',
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {m.title}
          </h3>
          <p style={{ 
            fontSize: '14px', 
            color: '#666',
            margin: '0',
            textAlign: 'center' 
          }}>
            {m.primaryGenre}
          </p>
        </div>
      ))}
    </div>
  );
}

export default MovieList;