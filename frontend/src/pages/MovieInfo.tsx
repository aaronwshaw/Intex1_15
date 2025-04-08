import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthorizeView from '../components/AuthorizeView';
import { getMovieById } from '../api/MoviesApi';
import { getContentRecs } from '../api/RecomendationsApi';


type Movie = {
  show_id: string;
  title: string;
  description?: string;
  release_year?: string;
  primaryGenre?: string;
  director?: string;
  cast?: string;
  duration?: string;
};

type ContentItem = {
  id: string;
  title: string;
  rank: number;
  // Add other fields if needed
};

function MovieInfo() {
  const navigate = useNavigate();
  const { show_id } = useParams<{ show_id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recommended, setRecommended] = useState<ContentItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieAndRecs = async () => {
      if (!show_id) return;

      const [fetchedMovie, recs] = await Promise.all([
        getMovieById(show_id),
        getContentRecs(show_id),
      ]);

      setMovie(fetchedMovie);
      setRecommended(recs);
      setLoading(false);
    };

    fetchMovieAndRecs();
  }, [show_id]);

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

              {/* Recommended Movies Section */}
              {recommended && recommended.length > 0 && (
                <>
                  <h2 className="streamlite-title streamlite-mt-4">You Might Also Like</h2>
                  <ul className="streamlite-sections streamlite-text-left">
                    {recommended.map((rec) => (
                      <li
                        key={rec.id}
                        className="streamlite-section"
                        onClick={() => navigate(`/movieinfo/${rec.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="streamlite-section-content">
                          {rec.title} (Rank: {rec.rank})
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          ) : (
            <p className="streamlite-text-left">Movie not found.</p>
          )}

          <p
            onClick={() => navigate('/home')}
            style={{ cursor: 'pointer' }}
            className="streamlite-footer streamlite-hover"
          >
            Return
          </p>
        </div>
      </div>
    </AuthorizeView>
  );
}

export default MovieInfo;
