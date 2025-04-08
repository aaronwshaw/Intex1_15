import { createContext, useState, useEffect, ReactNode, JSX } from 'react';
import { fetchMovies } from '../api/MoviesApi';
import { Movie } from '../types/Movie';

type MoviesContextType = {
  data: Movie[];
  renderStars: (rating: number) => JSX.Element[];
};

export const moviesContext = createContext<MoviesContextType | null>(null);

type MoviesProviderProps = {
  children: ReactNode;
};

export default function MoviesProvider({ children }: MoviesProviderProps) {
  const [data, setData] = useState<Movie[]>([]);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const res = await fetchMovies();
        setData(res.movies); // assuming fetchMovies returns { movies: Movie[] }
      } catch (err) {
        console.error('Failed to load movies', err);
      }
    };

    loadMovies();
  }, []);

  const renderStars = (rating: number): JSX.Element[] => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`fa-star ${index < rating ? 'fas text-yellow-400' : 'far text-gray-400'}`}
      ></i>
    ));
  };

  return (
    <moviesContext.Provider value={{ data, renderStars }}>
      {children}
    </moviesContext.Provider>
  );
}
