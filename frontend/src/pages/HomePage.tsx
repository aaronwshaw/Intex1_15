import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import {
  fetchTopRatedMovies,
  fetchMovies,
  fetchGenres,
} from '../api/MoviesApi';
import { Movie } from '../types/Movie';
import styles from './AppWrapper.module.css';
import {
  getUserRecs,
  getUserRatings,
  getCollabItemRecs,
} from '../api/RecomendationsApi';
import MovieCarouselSection from '../components/MovieCarouselSection';
import AuthorizeView from '../components/AuthorizeView';

// TODO: Replace this with real user ID from context/auth
const mockUserId = 104;

function HomePage() {
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [genreMovies, setGenreMovies] = useState<Record<string, Movie[]>>({});
  const [userLikedCarousels, setUserLikedCarousels] = useState<
    Record<string, Movie[]>
  >({});

  useEffect(() => {
    const loadAll = async () => {
      const [top, recs, allMovies, genres, ratings] = await Promise.all([
        fetchTopRatedMovies(10),
        getUserRecs(mockUserId),
        fetchMovies(),
        fetchGenres(),
        getUserRatings(mockUserId),
      ]);

      if (top) setTopRated(top);

      if (recs && allMovies?.movies) {
        const recIds = recs.map((r: any) => r.recommendedShow);
        const fullMovies = allMovies.movies.filter((movie: Movie) =>
          recIds.includes(movie.show_id)
        );

        const movieById: Record<string, Movie> = {};
        fullMovies.forEach((m) => (movieById[m.show_id] = m));

        const sorted = recs
          .map((r: any) => movieById[r.recommendedShow])
          .filter(Boolean)
          .slice(0, 10);

        setRecommended(sorted);
      }

      if (genres && allMovies?.movies) {
        const genreSections: Record<string, Movie[]> = {};
        for (const genre of genres) {
          const filtered = allMovies.movies.filter(
            (movie: Movie) => movie.primaryGenre === genre
          );
          if (filtered.length > 0) {
            genreSections[genre] = filtered.slice(0, 10);
          }
        }
        setGenreMovies(genreSections);
      }

      // Create "Because you liked..." carousels using item-based recommendations
      if (ratings && allMovies?.movies) {
        const liked = ratings.filter((r) => r.rating >= 3);
        const likedCarousels: Record<string, Movie[]> = {};

        for (const rating of liked) {
          const likedMovie = allMovies.movies.find(
            (m) => m.show_id === rating.show_id
          );
          if (!likedMovie) continue;

          const recs = await getCollabItemRecs(likedMovie.show_id);
          if (!recs) continue;

          const fullRecs = allMovies.movies.filter((m) =>
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

  const combinedCarousels = () => {
    const genreEntries = Object.entries(genreMovies);
    const likedEntries = Object.entries(userLikedCarousels);
    const maxLength = Math.max(genreEntries.length, likedEntries.length);
    const combined = [];

    for (let i = 0; i < maxLength; i++) {
      if (i < likedEntries.length) {
        const [title, movies] = likedEntries[i];
        combined.push(
          <MovieCarouselSection
            key={`liked-${title}`}
            title={`Because you liked ${title}`}
            movies={movies}
          />
        );
      }
      if (i < genreEntries.length) {
        const [genre, movies] = genreEntries[i];
        combined.push(
          <MovieCarouselSection
            key={`genre-${genre}`}
            title={genre}
            movies={movies}
          />
        );
      }
    }

    return combined;
  };

  return (
    <AuthorizeView>
      <div className={styles.pageWrapper}>
        <Navbar />
        <main>
          <MovieCarouselSection title="Top Rated" movies={topRated} />
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
