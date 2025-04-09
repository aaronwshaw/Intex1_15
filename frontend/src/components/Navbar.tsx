import React, { useState } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll listener to change navbar background
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? 'bg-black'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-12">
        {/* Left side - Logo and navigation */}
        <div className="flex items-center">
          {/* Netflix Logo */}
          <div className="mr-8">
            <svg
              className="w-24 h-8 text-red-600 fill-current"
              viewBox="0 0 111 30"
            >
              <path d="M105.06 14.28L111 0H104.92L103.5 5.5L101.9 0H95.85L98.24 8.91L95.85 14.03H101.9L99.9 8.91L105.06 14.28ZM38.39 0H32.03V14.03H38.39V0ZM38.39 19.29L43.18 18.23V14.03H38.39V19.29ZM32.03 19.29V24.25L35.23 23.5V19.29H32.03ZM17.07 5.3H21.57V0H6.43V5.3H10.93V14.03H17.07V5.3ZM32.03 28.62V33.41L38.39 31.64V26.85L32.03 28.62ZM43.18 25.17L49.69 23.35V18.54L43.18 20.36V25.17ZM49.69 13.34H43.18V0H49.69V13.34ZM60.3 0H50.62V29.67L57.07 27.84V9.25H60.3V0ZM60.3 12.52V27.02L66.76 25.18V10.7L60.3 12.52ZM71.82 8.13L78.29 6.27V0H71.82V8.13ZM71.82 22.46V9.95L78.29 8.11V20.63L71.82 22.46ZM88.9 3.3L82.43 5.14V21.58L88.9 19.74V16.23L85.7 17.09V9.62L88.9 8.76V5.24L85.7 6.11V5.14L88.9 4.27V3.3ZM93.96 18.05V1.61L87.49 3.44V19.88L93.96 18.05Z" />
            </svg>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#"
              className="text-white font-medium text-sm hover:text-gray-300"
            >
              Home
            </a>
            <a href="#" className="text-white text-sm hover:text-gray-300">
              TV Shows
            </a>
            <a href="#" className="text-white text-sm hover:text-gray-300">
              Movies
            </a>
            <a href="#" className="text-white text-sm hover:text-gray-300">
              New & Popular
            </a>
            <a href="#" className="text-white text-sm hover:text-gray-300">
              My List
            </a>
            <a href="#" className="text-white text-sm hover:text-gray-300">
              Browse by Languages
            </a>
          </div>
        </div>

        {/* Right side - Search, notifications and profile */}
        <div className="flex items-center space-x-4">
          <button className="text-white">
            <Search size={20} />
          </button>
          <div className="relative">
            <Bell size={20} className="text-white" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              14
            </span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer group">
            <div className="w-8 h-8 bg-yellow-500 rounded"></div>
            <ChevronDown
              size={16}
              className="text-white transition-transform group-hover:rotate-180"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
