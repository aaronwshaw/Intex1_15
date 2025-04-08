import { useState } from 'react';
import AuthorizeView from '../components/AuthorizeView';
import { searchMovies } from '../api/MoviesApi';

type Movie = {
  id: number;
  title: string;
  // Add other properties as needed
};

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    const movies = await searchMovies(query);
    setResults(movies);
    setLoading(false);
  };

  return (
    <AuthorizeView>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Search Movies</h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter movie title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {results && results.length > 0 ? (
          <ul className="space-y-2">
            {results.map((movie) => (
              <li key={movie.id} className="p-3 border rounded-md shadow-sm">
                {movie.title}
              </li>
            ))}
          </ul>
        ) : results && results.length === 0 ? (
          <p>No movies found.</p>
        ) : null}
      </div>
    </AuthorizeView>
  );
}

export default SearchPage;
