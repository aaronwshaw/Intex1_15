import React, { useState, useEffect } from 'react';
import { fetchMoviesByIds } from '../api/MoviesApi';
import { fetchTopRatedMovies } from '../api/MoviesApi'; // ✅ Import the function
import { Movie } from '../types/Movie';
import Footer from '../components/Footer';
import HeroCarousel from '../components/landing/HeroCarousel';
import MovieCarouselSection from '../components/MovieCarouselSection';
import PricingPlans from '../components/landing/PricingPlans';
import FloatingTrialButton from '../components/landing/FloatingTrialButton';
import Header from '../components/landing/Header';
import TitleBanner from '../components/landing/TitleBanner';
import styles from '../styles/LandingPage.module.css';
import CookieConsent from '../components/landing/CookieConsent';
import AboutUs from "../components/landing/AboutUs";

const LandingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]); // ✅ New state

  const toggleBilling = () => setIsAnnual(!isAnnual);

  const plans = [
    {
      name: 'Basic',
      monthlyPrice: '$6.99/month',
      annualPrice: '$69.99/year',
      summary: 'Ads, 1 device, no downloads',
      features: {
        devices: '1',
        adFree: false,
        downloads: false,
        hd: false,
        ultraHD: false,
      },
    },
    {
      name: 'Standard',
      monthlyPrice: '$12.99/month',
      annualPrice: '$129.99/year',
      summary: 'No ads, 2 devices, HD',
      features: {
        devices: '2',
        adFree: true,
        downloads: true,
        hd: true,
        ultraHD: false,
      },
    },
    {
      name: 'Premium',
      monthlyPrice: '$17.99/month',
      annualPrice: '$179.99/year',
      summary: '4 devices, HD + 4K, downloads',
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
    const loadSelectedMovies = async () => {
      const ids = [
        's6201',
        's1',
        's392',
        's821',
        's6617',
        's491',
        's334',
        's343',
        's5264',
        's76',
      ];
      const movies = await fetchMoviesByIds(ids);
      if (movies) setSelectedMovies(movies);
    };

    const loadTopRatedMovies = async () => {
      const topMovies = await fetchTopRatedMovies(10);
      if (topMovies) setTopRatedMovies(topMovies);
    };

    loadSelectedMovies();
    loadTopRatedMovies();
  }, []);

  return (
    <div className={styles.landingContainer}>
      <Header />
      <CookieConsent />
      <TitleBanner />
      <MovieCarouselSection
        title="Top Rated Movies"
        movies={topRatedMovies}
      />{' '}
      <div style={{ marginTop: '5vh' }} />
      <div className={styles.scrollContent}>
        <PricingPlans
          isAnnual={isAnnual}
          toggleBilling={toggleBilling}
          plans={plans}
        />
      </div>
      {/* <div style={{ marginTop: '2vh' }} /> */}
      <HeroCarousel movies={selectedMovies} />
      <FloatingTrialButton />
      <Footer />
    </div>
  );
};

export default LandingPage;
