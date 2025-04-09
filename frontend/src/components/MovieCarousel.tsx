import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  isNew?: boolean;
}

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  seeAllLink?: string;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({
  title,
  movies,
  seeAllLink,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.8; // Scroll by 80% of the visible width

      const newPosition =
        direction === 'left'
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;

      carouselRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth',
      });
    }
  };

  // Classes for the item hover effect
  const itemBaseClasses =
    'relative flex-shrink-0 transition-all duration-300 rounded overflow-hidden';
  const itemHoverClasses = isHovering
    ? 'scale-100'
    : 'hover:scale-110 hover:z-10';

  return (
    <div
      className="mt-8 mb-12 px-4 md:px-12"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Row header with title and see all link */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
        {seeAllLink && (
          <a
            href={seeAllLink}
            className="text-sm text-blue-400 hover:text-blue-300 hidden md:block"
          >
            Explore All
          </a>
        )}
      </div>

      {/* Carousel container */}
      <div className="relative group">
        {/* Left control */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/70 text-white w-12 h-12 rounded-full z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll left"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Movies row */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto space-x-2 md:space-x-4 pb-4 scrollbar-hide"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className={`${itemBaseClasses} ${itemHoverClasses} w-36 md:w-48`}
            >
              <img
                src={movie.imageUrl || '/api/placeholder/320/180'}
                alt={movie.title}
                className="w-full aspect-video object-cover"
              />
              {movie.isNew && (
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  Recently Added
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right control */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/70 text-white w-12 h-12 rounded-full z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCarousel;
