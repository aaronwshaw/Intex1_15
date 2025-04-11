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

const mockUserId = 104;

function HomePage() {
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [genreMovies, setGenreMovies] = useState<Record<string, Movie[]>>({});
  const [userLikedCarousels, setUserLikedCarousels] = useState<
    Record<string, Movie[]>
  >({});
  const [visibleCarouselCount, setVisibleCarouselCount] = useState(4);
  const [showGenres, setShowGenres] = useState(false);
  const genreRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const loadAll = async () => {
      const recPage = await fetchPaginatedMovies(1, 200);

      const [top, recs, genreList, ratings] = await Promise.all([
        fetchTopRatedMovies(10),
        getUserRecs(mockUserId),
        fetchGenres(),
        getUserRatings(mockUserId),
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

      if (ratings) {
        const liked = ratings.filter((r) => r.rating >= 3);
        const likedCarousels: Record<string, Movie[]> = {};

        for (const rating of liked) {
          const likedMovie = recPage.movies.find(
            (m: Movie) => m.show_id === rating.show_id
          );
          if (!likedMovie) continue;

          const recs = await getCollabItemRecs(likedMovie.show_id);
          if (!recs) continue;

          const fullRecs = recPage.movies.filter((m: Movie) =>
            recs.includes(m.show_id)
          );

          if (fullRecs.length > 0) {
            likedCarousels[likedMovie.title] = fullRecs.slice(0, 10);
          }
        }

        setUserLikedCarousels(likedCarousels);
      }
    };

    loadAll();
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

  const combinedCarousels = () => {
    const genreEntries = Object.entries(genreMovies);
    const likedEntries = Object.entries(userLikedCarousels);
    const maxLength = Math.max(genreEntries.length, likedEntries.length);
    const combined = [];

    let count = 0;

    for (let i = 0; i < maxLength && count < visibleCarouselCount; i++) {
      if (i < likedEntries.length && count < visibleCarouselCount) {
        const [title, movies] = likedEntries[i];
        combined.push(
          <MovieCarouselSection
            key={`liked-${title}`}
            title={`Because you liked ${title}`}
            movies={movies}
          />
        );
        count++;
      }
      if (i < genreEntries.length && count < visibleCarouselCount) {
        const [genre, movies] = genreEntries[i];
        combined.push(
          <div
            key={`genre-${genre}`}
            ref={(el) => {
              genreRefs.current[genre] = el;
            }}
          >
            <MovieCarouselSection title={genre} movies={movies} />
          </div>
        );
        count++;
      }
    }

    return combined;
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
          {combinedCarousels()}
        </main>
      </div>
    </AuthorizeView>
  );
}

export default HomePage;
