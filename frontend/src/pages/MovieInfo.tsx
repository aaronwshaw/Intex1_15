import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AuthorizeView from '../components/AuthorizeView';
import { getMovieById } from '../api/MoviesApi';

type Movie = {
  id: string;
  title: string;
  description?: string;
  releaseYear?: number;
  genre?: string;
  director?: string;
  // Add other fields as needed
};

function MovieInfo() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      const fetched = await getMovieById(id);
      setMovie(fetched);
      setLoading(false);
    };

    fetchMovie();
  }, [id]);

  return (
    <AuthorizeView>
      <div className="streamlite-page">
        <div className="streamlite-container">
          {loading ? (
            <p className="streamlite-text-left">Loading movie details...</p>
          ) : movie ? (
            <>
              <h1 className="streamlite-title">{movie.title}</h1>
              <p className="streamlite-intro">
                <strong>Description:</strong> {movie.description || 'No description available.'}
              </p>
              <p className="streamlite-text-left">
                <strong>Genre:</strong> {movie.genre || 'Unknown'}
              </p>
              <p className="streamlite-text-left">
                <strong>Director:</strong> {movie.director || 'Unknown'}
              </p>
              <p className="streamlite-text-left">
                <strong>Release Year:</strong> {movie.releaseYear || 'Unknown'}
              </p>
            </>
          ) : (
            <p className="streamlite-text-left">Movie not found.</p>
          )}
        </div>
      </div>
    </AuthorizeView>
  );
}

export default MovieInfo;
