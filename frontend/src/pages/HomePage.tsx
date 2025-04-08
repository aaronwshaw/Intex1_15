import { useState } from 'react';
import AuthorizeView from '../components/AuthorizeView';
import SidebarNav from '../components/SidebarNav';
import MovieList from '../components/MovieList';
import TopRatedMovieRow from '../components/TopRatedMovieRow';

function HomePage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  return (
    <AuthorizeView>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <SidebarNav />
        <TopRatedMovieRow />

        {/* Main content — shifted to the right of the fixed sidebar on desktop */}
        <main className="flex-1 p-6 md:ml-64 bg-gradient-to-r from-blue-600 to-blue-300 text-black">
          <MovieList selectedGenres={selectedGenres} />
        </main>
      </div>
    </AuthorizeView>
  );
}

export default HomePage;
