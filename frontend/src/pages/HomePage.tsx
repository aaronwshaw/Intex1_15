// HomePage.tsx
import React from 'react';
import Navbar from '../components/navbar';
import MovieCarousel from '../components/MovieCarousel';
import styles from './AppWrapper.module.css';

function HomePage() {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main>
        <h1>Welcome to the Movie App</h1>
        <MovieCarousel />
      </main>
    </div>
  );
}

export default HomePage;
