import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthorizeView from '../components/AuthorizeView';
import { getMovieById } from '../api/MoviesApi';
import { getContentRecs } from '../api/RecomendationsApi';
import Navbar from '../components/Navbar';
import MoviePoster from '../components/MoviePoster';
import MovieCarouselSection from '../components/MovieCarouselSection';
import {
  likeMovie,
  unlikeMovie,
  getUserRatingForMovie,
} from '../api/MoviesApi';
import { Movie } from '../types/Movie';

//import { API_url } from '../api/config';

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
  const [userRating, setUserRating] = useState<number | null>(null);
  const [userId] = useState<number>(1); // Replace 4 with actual logged-in user ID if dynamic

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
        recs.map(async (rec: ContentItem) => {
          if (rec.recommendedShow) {
            const movie: Movie | null = await getMovieById(rec.recommendedShow);
            if (movie) resolvedMovies[rec.recommendedShow] = movie;
          }
        })
      );

      // Fetch current user rating if movie and userId exist
      if (fetchedMovie && userId) {
        const rating = await getUserRatingForMovie(
          userId,
          fetchedMovie.show_id
        );
        setUserRating(rating); // could be null
      }

      setRecMovies(resolvedMovies);
      setLoading(false);
    };

    fetchMovieAndRecs();
  }, [show_id]);

  return (
    <AuthorizeView>
      <Navbar />
      <main style={{ padding: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading movie details...</p>
        ) : movie ? (
          <>
            <div className="row">
              {/* Poster on the left */}
              <div className="col-md-4 d-flex justify-content-center mb-3">
                <MoviePoster title={movie.title} width={240} height={360} />
              </div>

              {/* Movie info on the right */}
              <div className="col-md-8" style={{ textAlign: 'left' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  {movie.title} ({movie.release_year})
                </h1>
                <p style={{ marginBottom: '1rem' }}>
                  {movie.description || 'No description available.'}
                </p>
                <p>
                  {movie.primaryGenre || 'Unknown'} – {movie.duration || 'Unknown'}
                </p>
                <p>
                  <strong>Director:</strong> {movie.director || 'Unknown'}
                </p>
                <p>
                  <strong>Cast:</strong> {movie.cast || 'Unknown'}
                </p>

                <div
                    style={{
                      display:'inline-block',
                      marginTop: '0rem',
                      padding: '1rem',
                      backgroundColor: '#141414', // Tailwind gray-100
                      borderRadius: '0.5rem',
                      border: '1px solid ',
                    }}
                  >
                    <span style={{ marginRight: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      Rate This Movie:
                    </span>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = userRating !== null && star <= userRating;

                      return (
                        <span
                          key={star}
                          onClick={async () => {
                            if (loading || !movie) return;

                            if (userRating === star) {
                              const success = await unlikeMovie(userId, movie.show_id);
                              if (success) setUserRating(null);
                            } else {
                              const success = await likeMovie(userId, movie.show_id, star);
                              if (success) setUserRating(star);
                            }
                          }}
                          style={{
                            cursor: loading ? 'default' : 'pointer',
                            fontSize: '1.75rem',
                            color: isFilled ? '#facc15' : '#d1d5db',
                            transition: 'color 0.2s ease',
                            marginRight: '0.25rem',
                            opacity: loading ? 0.5 : 1,
                          }}
                          title={
                            loading ? 'Loading...' : `Rate ${star} star${star > 1 ? 's' : ''}`
                          }
                        >
                          ★
                        </span>
                      );
                    })}
                  </div>

              </div>
            </div>


            {/* <p style={{ marginBottom: '2rem' }}>
              <strong>Duration:</strong> {movie.duration || 'Unknown'}
            </p> */}

            

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
              onClick={() => navigate(-1)}
              style={{
                marginTop: '2rem',
                cursor: 'pointer',
                // color: '#ffffff',
                // textDecoration: 'underline',
                textAlign: 'center',
                borderRadius: '8px'
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
