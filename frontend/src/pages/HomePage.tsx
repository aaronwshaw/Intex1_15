// HomePage.tsx
import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import {
  fetchTopRatedMovies,
  fetchGenres,
  fetchMoviesByIds,
} from '../api/MoviesApi';
import {
  fetchPaginatedMovies,
  fetchPaginatedMoviesByGenre,
} from '../api/IntexAPI';
import { Movie } from '../types/Movie';
import styles from './AppWrapper.module.css';
import {
  getUserRecs,
  getUserRatings,
  getCollabItemRecs,
} from '../api/RecomendationsApi';
import MovieCarouselSection from '../components/MovieCarouselSection';
import AuthorizeView from '../components/AuthorizeView';

const mockUserId = 1;

function HomePage() {
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [genreMovies, setGenreMovies] = useState<Record<string, Movie[]>>({});
  const [visibleCarouselCount, setVisibleCarouselCount] = useState(4);
  const [showGenres, setShowGenres] = useState(false);
  const genreRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [likedCarousels, setLikedCarousels] = useState<Record<string, Movie[]>>(
    {}
  );

  useEffect(() => {
    const loadAll = async () => {
      const [top, recs, genreList] = await Promise.all([
        fetchTopRatedMovies(10),
        getUserRecs(mockUserId),
        fetchGenres(),
      ]);

      if (top) setTopRated(top);

      if (recs) {
        const recIds = recs.map((r: any) => r.recommendedShow.trim());
        const recommendedMovies = await fetchMoviesByIds(recIds);
        setRecommended(recommendedMovies.slice(0, 10));
      }

      if (genreList) {
        const genreSections: Record<string, Movie[]> = {};

        for (const genre of genreList) {
          const result = await fetchPaginatedMoviesByGenre(genre, 1, 9);
          if (result && result.movies.length === 9) {
            genreSections[genre] = result.movies;
          }
        }

        setGenreMovies(genreSections);
      }
    };

    loadAll();
  }, []);

  useEffect(() => {
    const loadLikedCarousels = async () => {
      try {
        const ratings = await getUserRatings(mockUserId);
        console.log('📊 User ratings:', ratings);
        if (!ratings) return;

        const liked = ratings
          .filter((r) => r.rating >= 3)
          .sort((a, b) => b.rating - a.rating) // sort by highest rating
          .slice(0, 3); // limit to top 3 liked movies

        console.log('👍 Liked ratings (rating >= 3):', liked);

        const likedCarouselsMap: Record<string, Movie[]> = {};

        for (const r of liked) {
          const showId = r.show_id;
          console.log(`➡️ Processing liked showId: ${showId}`);

          // Get recommendations specifically for this movie
          const rawRecs = await getCollabItemRecs(showId);
          const recIds = rawRecs
            .map((rec: any) => rec.recommendedShowId?.trim())
            .filter(Boolean);

          console.log(`🎯 Recommendations for ${showId}:`, recIds);
          if (!recIds || recIds.length === 0) continue;

          // Get full movie data for those recommended IDs
          const movieData = await fetchMoviesByIds(recIds);
          console.log(`🎬 Movie data for showId ${showId}:`, movieData);
          if (movieData.length === 0) continue;

          // Get the liked movie title
          const likedMovie = (await fetchMoviesByIds([showId]))[0];
          if (!likedMovie) continue;

          // Store it under the correct movie title
          likedCarouselsMap[likedMovie.title] = movieData.slice(0, 10);
        }

        console.log('✅ Final likedCarouselsMap:', likedCarouselsMap);
        setLikedCarousels(likedCarouselsMap);
      } catch (err) {
        console.error("❌ Failed to load 'Because you liked' carousels:", err);
      }
    };

    loadLikedCarousels();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (nearBottom) {
        setVisibleCarouselCount((prev) => prev + 2);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGenreClick = (genre: string) => {
    const genreIndex = Object.keys(genreMovies).indexOf(genre);
    const requiredVisible = genreIndex * 2 + 2;

    if (requiredVisible > visibleCarouselCount) {
      setVisibleCarouselCount(requiredVisible);

      setTimeout(() => {
        genreRefs.current[genre]?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      genreRefs.current[genre]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AuthorizeView>
      <div className={styles.pageWrapper}>
        <Navbar />

        {Object.keys(genreMovies).length > 0 && (
          <section className={styles.genreSection}>
            <div className={styles.genreToggleWrapper}>
              <button
                onClick={() => setShowGenres((prev) => !prev)}
                className={styles.toggleGenresButton}
              >
                {showGenres ? 'Hide Genres' : 'Browse by Genre'}
              </button>
            </div>

            {showGenres && (
              <>
                <h2 className={styles.genreHeader}>Choose a Genre</h2>
                <div className={styles.genreNav}>
                  {Object.keys(genreMovies).map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleGenreClick(genre)}
                      className={styles.genreButton}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        <main>
          <MovieCarouselSection title="Top Rated Movies" movies={topRated} />
          <MovieCarouselSection
            title="Recommended For You"
            movies={recommended}
          />
          {Object.entries(likedCarousels).map(([title, movies]) => (
            <MovieCarouselSection
              key={`liked-${title}`}
              title={`Because you liked ${title}`}
              movies={movies}
            />
          ))}
          {Object.entries(genreMovies)
            .slice(0, visibleCarouselCount)
            .map(([genre, movies]) => (
              <div
                key={`genre-${genre}`}
                ref={(el) => {
                  genreRefs.current[genre] = el;
                }}
              >
                <MovieCarouselSection title={genre} movies={movies} />
              </div>
            ))}
        </main>
      </div>
    </AuthorizeView>
  );
}

export default HomePage;
