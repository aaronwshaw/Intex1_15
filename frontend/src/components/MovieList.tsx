import { useEffect, useState } from 'react';
import { fetchMovies } from '../api/IntexAPI';
import { Movie } from '../types/Movie';

function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const loadBooks = async () => {
      try {
        console.log('hello')
        setLoading(true);
        const data = await fetchMovies();

        setMovies(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  },[]);

if (loading) return <p>Loading projects...</p>
if (error) return <p>Error: {error}</p>

return(
    <>
    {movies.map((m) => ( 
        <div id='movieCard' className='card' key={m.show_id}>
            <h3 className='card-title'>{m.title}</h3>
            <h2>{m.primaryGenre}</h2>
        </div>
    ))}
    </>
)
}

export default MovieList;
