//import React from 'react';
import Navbar from '../components/navbar';
import MovieCarousel from '../components/MovieCarousel';
import { Play, Info } from 'lucide-react';

// Mock data
const trendingMovies = [
  {
    id: '1',
    title: 'Designated Survivor',
    imageUrl: '/api/placeholder/320/180',
  },
  { id: '2', title: 'White Collar', imageUrl: '/api/placeholder/320/180' },
  {
    id: '3',
    title: 'The Residence',
    imageUrl: '/api/placeholder/320/180',
    isNew: true,
  },
  { id: '4', title: 'Fool Me Once', imageUrl: '/api/placeholder/320/180' },
  {
    id: '5',
    title: 'Pulse',
    imageUrl: '/api/placeholder/320/180',
    isNew: true,
  },
  { id: '6', title: 'Madam Secretary', imageUrl: '/api/placeholder/320/180' },
  { id: '7', title: 'The Good Place', imageUrl: '/api/placeholder/320/180' },
  { id: '8', title: 'Breaking Bad', imageUrl: '/api/placeholder/320/180' },
];

const continueWatching = [
  {
    id: '9',
    title: 'The Lincoln Lawyer',
    imageUrl: '/api/placeholder/320/180',
  },
  { id: '10', title: 'Prison Break', imageUrl: '/api/placeholder/320/180' },
  { id: '11', title: 'Younger', imageUrl: '/api/placeholder/320/180' },
  { id: '12', title: 'The Night Agent', imageUrl: '/api/placeholder/320/180' },
  { id: '13', title: 'Suits', imageUrl: '/api/placeholder/320/180' },
  { id: '14', title: 'The Crown', imageUrl: '/api/placeholder/320/180' },
];

const games = [
  { id: '15', title: 'Centipede', imageUrl: '/api/placeholder/320/180' },
  { id: '16', title: 'Almost Gone', imageUrl: '/api/placeholder/320/180' },
  { id: '17', title: 'Caverns of Mars', imageUrl: '/api/placeholder/320/180' },
  {
    id: '18',
    title: 'Underwater Friends',
    imageUrl: '/api/placeholder/320/180',
  },
  {
    id: '19',
    title: 'Too Hot To Handle',
    imageUrl: '/api/placeholder/320/180',
  },
  { id: '20', title: 'Rocket', imageUrl: '/api/placeholder/320/180' },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Banner */}
      <div className="relative w-full h-[80vh] bg-gradient-to-r from-black via-black/50">
        {/* Hero image background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
          <img
            src="/api/placeholder/1200/800"
            alt="Featured title"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Hero content */}
        <div className="relative z-20 flex flex-col justify-end h-full pb-20 px-4 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold max-w-md md:max-w-2xl mb-4">
            Stranger Things
          </h1>
          <p className="text-lg max-w-md md:max-w-xl mb-6">
            When a young boy vanishes, a small town uncovers a mystery involving
            secret experiments, terrifying supernatural forces and one strange
            little girl.
          </p>
          <div className="flex space-x-4">
            <button className="flex items-center justify-center bg-white text-black px-6 py-2 rounded font-medium hover:bg-gray-200 transition">
              <Play size={20} className="mr-2" />
              Play
            </button>
            <button className="flex items-center justify-center bg-gray-600/80 text-white px-6 py-2 rounded font-medium hover:bg-gray-700/80 transition">
              <Info size={20} className="mr-2" />
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Movie Rows */}
      <div className="mt-2">
        <MovieCarousel
          title="Trending Now"
          movies={trendingMovies}
          seeAllLink="#trending"
        />
        <MovieCarousel
          title="Continue Watching for You"
          movies={continueWatching}
        />
        <div className="relative px-4 md:px-12 mb-2">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
            Games
            <span className="ml-2 bg-gray-700 text-white text-xs px-2 py-1 rounded">
              BETA
            </span>
          </h2>
        </div>
        <MovieCarousel title="" movies={games} seeAllLink="#games" />
      </div>

      {/* Footer Space */}
      <div className="h-20"></div>
    </div>
  );
};

export default HomePage;
