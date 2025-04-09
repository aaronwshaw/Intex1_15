import React, { useState, useEffect } from 'react';
import { fetchTopRatedMovies } from '../api/MoviesApi';
import { Movie } from '../types/Movie';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroCarousel from '../components/landing/HeroCarousel';
import MovieCarouselSection from '../components/MovieCarouselSection';
import PricingPlans from '../components/landing/PricingPlans';
import FloatingTrialButton from '../components/landing/FloatingTrialButton';

import styles from '../styles/LandingPage.module.css'; // ✅ Use CSS module
import TitleBanner from '../components/TitleBanner';

const LandingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);

  const toggleBilling = () => setIsAnnual(!isAnnual);

  const plans = [
    {
      name: 'Essential',
      monthlyPrice: '$7.99/month',
      annualPrice: '$79.99/year',
      features: {
        devices: '1',
        adFree: false,
        downloads: false,
        hd: true,
        ultraHD: false,
      },
    },
    {
      name: 'Premium',
      monthlyPrice: '$12.99/month',
      annualPrice: '$129.99/year',
      mostPopular: true,
      features: {
        devices: '4',
        adFree: true,
        downloads: true,
        hd: true,
        ultraHD: true,
      },
    },
  ];

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const handleScroll = () => {
      revealElements.forEach((el) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 150;
        if (elementTop < windowHeight - revealPoint) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadTopMovies = async () => {
      const movies = await fetchTopRatedMovies(10);
      if (movies) setTopMovies(movies);
    };
    loadTopMovies();
  }, []);

  const scrollToPlans = () => {
    const planSection = document.getElementById('plans');
    if (planSection) {
      planSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.landingContainer}>
      <Header />
      <TitleBanner />
      <HeroCarousel movies={topMovies} />
      <div style={{ marginTop: '100vh' }} />
      <div className={styles.scrollContent}>
        <MovieCarouselSection title="Top Rated" movies={topMovies} />
        <PricingPlans
          isAnnual={isAnnual}
          toggleBilling={toggleBilling}
          plans={plans}
        />
      </div>
      <FloatingTrialButton onClick={scrollToPlans} />
      <Footer />
    </div>
  );
};

export default LandingPage;
