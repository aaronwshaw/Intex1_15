import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthorizeView from '../components/AuthorizeView';
import { searchMovies } from '../api/MoviesApi';
import MovieList from '../components/MovieList';
import Navbar from '../components/Navbar';

type Movie = {
  show_id: string;
  title: string;
  // Add other fields if needed
};

function SearchPage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    const movies = await searchMovies(query);
    setResults(movies);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <AuthorizeView>
      <Navbar />
      <div className="streamlite-page">
        <div className="streamlite-container">
          <h1 className="streamlite-title">Search Movies</h1>

          <p className="streamlite-intro">
            Find movies by title in our StreamLite catalog.
          </p>

          {/* Form for Enter key support */}
          <form
            onSubmit={handleSubmit}
            className="streamlite-full-width streamlite-mb-4"
            style={{ display: 'flex', gap: '0.5rem' }}
          >
            <input
              type="text"
              placeholder="Enter movie title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="streamlite-full-width"
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                flex: 1,
              }}
            />
            <button
              type="submit"
              className="streamlite-section-search-button"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.5rem',
                fontWeight: 600,
              }}
            >
              Search
            </button>
          </form>

          {loading && <p className="streamlite-text-left">Loading...</p>}

          {results && results.length > 0 ? (
            <ul className="streamlite-sections streamlite-text-left">
              {results.map((movie) => (
                <li
                  key={movie.show_id}
                  className="streamlite-section streamlite-hover"
                  onClick={() => navigate(`/movieinfo/${movie.show_id}`)}
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  <div className="streamlite-section-content streamlite-hover">
                    {movie.title}
                  </div>
                </li>
              ))}
            </ul>
          ) : results && results.length === 0 ? (
            <p className="streamlite-text-left">No movies found.</p>
          ) : null}
        </div>
      </div>
      <MovieList selectedGenres={selectedGenres} />
    </AuthorizeView>
  );
}

export default SearchPage;
