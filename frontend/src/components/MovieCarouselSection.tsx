// MovieCarouselSection.tsx
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types/Movie';
import MoviePoster from './MoviePoster';
import styles from './MovieCarousel.module.css';

interface Props {
  title: string;
  movies: Movie[];
}

function MovieCarouselSection({ title, movies }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollBy({ left: -250, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = 250;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    if (container.scrollLeft + scrollAmount >= maxScrollLeft - 1) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.carouselContainer}>
      <h2 className={styles.carouselTitle}>{title}</h2>

      <button
        className={`${styles.scrollButton} ${styles.leftButton}`}
        onClick={scrollLeft}
      >
        ❮
      </button>
      <button
        className={`${styles.scrollButton} ${styles.rightButton}`}
        onClick={scrollRight}
      >
        ❯
      </button>

      <div className={styles.scrollRow} ref={scrollRef}>
        {movies.map((movie, index) =>
          movie.title ? (
            <Link
              key={`${movie.show_id}-${index}`}
              to={`/movieinfo/${movie.show_id}`}
              className={styles.movieCard}
            >
              <MoviePoster title={movie.title} />
              <div className={styles.movieTitle}>{movie.title}</div>
            </Link>
          ) : null
        )}
      </div>
    </div>
  );
}

export default MovieCarouselSection;

