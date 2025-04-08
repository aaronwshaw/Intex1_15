import React, { useEffect, useState, useRef } from 'react';
import { fetchTopRatedMovies } from '../api/MoviesApi';
import { Movie } from '../types/Movie';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  title?: string;
  count?: number;
}

const TopRatedMovieRow: React.FC<Props> = ({
  title = 'Top Rated',
  count = 10,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // ✅ Router navigation

  useEffect(() => {
    const loadMovies = async () => {
      const data = await fetchTopRatedMovies(count);
      if (data) setMovies(data);
    };
    loadMovies();
  }, [count]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 320;
    const newPosition =
      direction === 'left'
        ? Math.max(scrollPosition - scrollAmount, 0)
        : Math.min(
            scrollPosition + scrollAmount,
            container.scrollWidth - container.clientWidth
          );

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });
    setScrollPosition(newPosition);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  const showLeftControl = scrollPosition > 0;
  const showRightControl = scrollContainerRef.current
    ? scrollPosition <
      scrollContainerRef.current.scrollWidth -
        scrollContainerRef.current.clientWidth -
        10
    : true;

  return (
    <div className="mb-8 relative">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>

      {showLeftControl && (
        <button
          className="absolute left-0 top-1/2 transform -translate-y-4 z-10 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition-all duration-200"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie) => (
          <div
            key={movie.show_id}
            onClick={() => navigate(`/movieinfo/${movie.show_id}`)} // ✅ Navigate on click
            className="flex-shrink-0 bg-gray-800 text-white rounded-lg shadow-lg mx-2 w-40 overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <div className="relative h-56 w-full bg-gray-700">
              {movie.imageUrl ? (
                <img
                  src={movie.imageUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  {movie.title.charAt(0)}
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
              <p className="text-xs text-gray-400 mt-1 truncate">
                {movie.primaryGenre || 'Unknown genre'}
              </p>
            </div>
          </div>
        ))}

        {movies.length === 0 && (
          <div className="flex-shrink-0 bg-gray-800 text-gray-400 rounded-lg shadow-lg mx-2 w-40 h-56 flex items-center justify-center">
            Loading...
          </div>
        )}
      </div>

      {showRightControl && (
        <button
          className="absolute right-0 top-1/2 transform -translate-y-4 z-10 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition-all duration-200"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default TopRatedMovieRow;
