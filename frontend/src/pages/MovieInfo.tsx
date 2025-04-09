import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthorizeView from '../components/AuthorizeView';
import { getMovieById } from '../api/MoviesApi';
import { getContentRecs } from '../api/RecomendationsApi';
import Navbar from '../components/Navbar';
import MoviePoster from '../components/MoviePoster';
import MovieCarouselSection from '../components/MovieCarouselSection';

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
  showId: string;
  recommendedShow: string;
};

function MovieInfo() {
  const navigate = useNavigate();
  const { show_id } = useParams<{ show_id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recommended, setRecommended] = useState<ContentItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [recMovies, setRecMovies] = useState<Record<string, Movie>>({});

  useEffect(() => {
    const fetchMovieAndRecs = async () => {
      if (!show_id) return;

      const [fetchedMovie, recs] = await Promise.all([
        getMovieById(show_id),
        getContentRecs(show_id),
      ]);

      setMovie(fetchedMovie);
      setRecommended(recs);

      const resolvedMovies: Record<string, Movie> = {};
      await Promise.all(
        recs.map(async (rec) => {
          if (rec.recommendedShow) {
            const movie = await getMovieById(rec.recommendedShow);
            if (movie) resolvedMovies[rec.recommendedShow] = movie;
          }
        })
      );

      setRecMovies(resolvedMovies);
      setLoading(false);
    };

    fetchMovieAndRecs();
  }, [show_id]);

  return (
    <AuthorizeView>
      <Navbar />
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading movie details...</p>
        ) : movie ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <MoviePoster title={movie.title} width={240} height={360} />
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              {movie.title} ({movie.release_year})
            </h1>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Description:</strong> {movie.description || 'No description available.'}
            </p>
            <p>
              <strong>Genre:</strong> {movie.primaryGenre || 'Unknown'}
            </p>
            <p>
              <strong>Director:</strong> {movie.director || 'Unknown'}
            </p>
            <p>
              <strong>Cast:</strong> {movie.cast || 'Unknown'}
            </p>
            <p style={{ marginBottom: '2rem' }}>
              <strong>Duration:</strong> {movie.duration || 'Unknown'}
            </p>

            {/* Recommended Movies Section */}
            {recommended && recommended.length > 0 && (
              <MovieCarouselSection
                title="You Might Also Like"
                movies={recommended
                  .map((rec) => recMovies[rec.recommendedShow])
                  .filter((movie): movie is Movie => !!movie)}
              />
            )}


            <p
              onClick={() => navigate('/home')}
              style={{
                marginTop: '2rem',
                cursor: 'pointer',
                color: '#3b82f6',
                textDecoration: 'underline',
                textAlign: 'center',
              }}
            >
              Return
            </p>
          </>
        ) : (
          <p style={{ textAlign: 'center' }}>Movie not found.</p>
        )}
      </main>
    </AuthorizeView>
  );
}

export default MovieInfo;
