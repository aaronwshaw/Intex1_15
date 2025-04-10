import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import MoviePoster from '../MoviePoster';
import { Movie } from '../../types/Movie';
import { Link } from 'react-router-dom';
import styles from '../../styles/HeroCarousel.module.css';

interface HeroCarouselProps {
  movies: Movie[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ movies }) => {
  return (
    <div className={styles.carouselWrapper}>
      <Carousel controls={false} indicators={false} fade interval={4000} pause="hover">
        {movies.map((movie) => (
          <Carousel.Item key={movie.show_id}>
            <div className={styles.carouselBg} style={{ overflow: 'hidden' }}>
              <MoviePoster title={movie.title} width={1000} height={1000} />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Unlimited Movies, TV Shows, and More.</h1>
        <p className={styles.heroSubtitle}>Personalized entertainment at your fingertips.</p>
        <div className={styles.emailForm}>
          <Link to="/login" className="btn btn-danger">Get Started</Link>
        </div>
      </div>

      <div className={styles.overlay} />
    </div>
  );
};

export default HeroCarousel;

