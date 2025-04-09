import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import {
  fetchTopRatedMovies,
  fetchGenres,
} from '../api/MoviesApi';
import { fetchPaginatedMovies, fetchPaginatedMoviesByGenre } from '../api/IntexAPI';
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
  const [userLikedCarousels, setUserLikedCarousels] = useState<Record<string, Movie[]>>({});
  const [visibleCarouselCount, setVisibleCarouselCount] = useState(4);

  useEffect(() => {
    const loadAll = async () => {
      const [top, recs, genreList, ratings] = await Promise.all([
        fetchTopRatedMovies(10),
        getUserRecs(mockUserId),
        fetchGenres(),
        getUserRatings(mockUserId),
      ]);

      if (top) setTopRated(top);

      if (recs) {
        const recIds = recs.map((r: any) => r.recommendedShow);
        const recPage = await fetchPaginatedMovies(1, 200); // Load enough to match recommended IDs
        const movieById: Record<string, Movie> = {};
        recPage.movies.forEach((m: Movie) => {
          if (recIds.includes(m.show_id)) {
            movieById[m.show_id] = m;
          }
        });

        const sorted = recs
          .map((r: any) => movieById[r.recommendedShow])
          .filter(Boolean)
          .slice(0, 10);

        setRecommended(sorted);
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

        const allMoviePages = await fetchPaginatedMovies(1, 300); // Pull more to cover recs

        for (const rating of liked) {
          const likedMovie = allMoviePages.movies.find(
            (m) => m.show_id === rating.show_id
          );
          if (!likedMovie) continue;

          const recs = await getCollabItemRecs(likedMovie.show_id);
          if (!recs) continue;

          const fullRecs = allMoviePages.movies.filter((m) =>
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

  // Infinite scroll to load more carousels
  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (nearBottom) {
        console.log('📦 Loading more carousels...');
        setVisibleCarouselCount((prev) => prev + 2);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <MovieCarouselSection
            key={`genre-${genre}`}
            title={genre}
            movies={movies}
          />
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
