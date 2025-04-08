import { useEffect, useState } from 'react';
import { fetchMovies } from '../api/IntexAPI';
import { Movie } from '../types/Movie';

function MovieList({ selectedGenres }: { selectedGenres: string[] }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchMovies();
        setMovies(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  // Filter the movies based on selected genres
  const filteredMovies = movies.filter((movie) =>
    selectedGenres.length === 0 || selectedGenres.includes(movie.primaryGenre)
  );

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {filteredMovies.map((m) => (
        <div id='movieCard' className='card' key={m.show_id}>
          <h3 className='card-title'>{m.title}</h3>
          <h2>{m.primaryGenre}</h2>
        </div>
      ))}
    </>
  );
}

export default MovieList;
