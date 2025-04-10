// MovieCarousel.tsx
import { useEffect, useRef, useState } from 'react';
import { fetchTopRatedMovies } from '../api/MoviesApi';
import MoviePoster from './MoviePoster';
import { Link } from 'react-router-dom';
import { Movie } from '../types/Movie';
import styles from './MovieCarousel.module.css';

function MovieCarousel() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [baseMovies, setBaseMovies] = useState<Movie[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadMovies() {
      const topMovies = await fetchTopRatedMovies(10);
      if (topMovies) {
        setBaseMovies(topMovies);
        setMovies([...topMovies, ...topMovies.slice(0, 5)]);
      }
    }

    loadMovies();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || baseMovies.length <= 5) return;

    const handleScroll = () => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScrollLeft - 5) {
        container.scrollTo({ left: 0, behavior: 'auto' });
      }
    };

    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [movies, baseMovies]);

  const scrollLeft = () => {
    const container = scrollRef.current;
    if (container) {
      container.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = scrollRef.current;
    if (container) {
      container.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.carouselContainer}>
      <h2 className={styles.carouselTitle}>Top Rated Movies</h2>

      <button
        className={`${styles.scrollButton} ${styles.leftButton}`}
        onClick={scrollLeft}
      >
        &#8249;
      </button>
      <button
        className={`${styles.scrollButton} ${styles.rightButton}`}
        onClick={scrollRight}
      >
        &#8250;
      </button>

      <div className={styles.scrollRow} ref={scrollRef}>
        {movies.map((movie, index) => (
          <Link
            key={`${movie.show_id}-${index}`}
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
