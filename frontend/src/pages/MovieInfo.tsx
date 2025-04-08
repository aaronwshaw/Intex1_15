import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AuthorizeView from '../components/AuthorizeView';
import { getMovieById } from '../api/MoviesApi';
import { useNavigate } from 'react-router-dom';

type Movie = {
  id: string;
  title: string;
  description?: string;
  release_year?: string;
  primaryGenre?: string;
  director?: string;
  cast?:string
  duration?: string
  // Add other fields as needed
};

function MovieInfo() {
  const navigate = useNavigate();
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
              <h1 className="streamlite-title">{movie.title} ({movie.release_year})</h1>
              <p className="streamlite-intro">
                <strong>Description:</strong> {movie.description || 'No description available.'}
              </p>
              <p className="streamlite-text-left">
                <strong>Genre:</strong> {movie.primaryGenre || 'Unknown'}
              </p>
              <p className="streamlite-text-left">
                <strong>Director:</strong> {movie.director || 'Unknown'}
              </p>
              <p className="streamlite-text-left">
                <strong>Cast:</strong> {movie.cast || 'Unknown'}
              </p>
              <p className="streamlite-text-left">
                <strong>Duration:</strong> {movie.duration || 'Unknown'}
              </p>
            </>
          ) : (
            <p className="streamlite-text-left">Movie not found.</p>
          )}

          <p onClick={()=> navigate('/home')} className="streamlite-footer">Return</p>
        </div>
      </div>
    </AuthorizeView>
  );
}

export default MovieInfo;
