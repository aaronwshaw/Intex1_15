import { useState } from 'react';
import AuthorizeView from '../components/AuthorizeView';
import { searchMovies } from '../api/MoviesApi';
import MovieList from '../components/MovieList';
import Navbar from '../components/Navbar';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults(null); // Show regular movie list
      return;
    }

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

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Enter movie title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #ccc',
              }}
            />
            <button
              type="submit"
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

          {loading && <p>Loading...</p>}
        </div>
      </div>

      <MovieList overrideMovies={results ?? undefined} />
    </AuthorizeView>
  );
}

export default SearchPage;
