// MovieCarousel.tsx
import React, { useEffect, useState } from 'react';
import { fetchTopRatedMovies } from '../api/MoviesApi';
import MoviePoster from './MoviePoster';
import { Link } from 'react-router-dom';
import { Movie } from '../types/Movie';
import styles from './MovieCarousel.module.css';

function MovieCarousel() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    async function loadMovies() {
      const topMovies = await fetchTopRatedMovies(10);
      if (topMovies) {
        setMovies(topMovies);
      }
    }

    loadMovies();
  }, []);

  return (
    <div className={styles.carouselContainer}>
      <h2 className={styles.carouselTitle}>Top Rated Movies</h2>
      <div className={styles.scrollRow}>
        {movies.map((movie) => (
          <Link
            key={movie.show_id}
            to={`/movieinfo/${movie.show_id}`}
            className={styles.movieCard}
          >
            <MoviePoster title={movie.title} />
            <div className={styles.movieTitle}>{movie.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MovieCarousel;
