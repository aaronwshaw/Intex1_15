import { useState, useEffect } from 'react';
import AuthorizeView from '../components/AuthorizeView';
import { searchMovies, fetchMoviesByGenres } from '../api/MoviesApi';
import MovieList from '../components/MovieList';
import Navbar from '../components/Navbar';
import GenreFilter from '../components/GenreFilter';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  // const [showGenreFilter, setShowGenreFilter] = useState(false);


  const handleSearch = async () => {
    if (!query.trim()) {
      setResults(null);
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

  useEffect(() => {
    const fetchFilteredMovies = async () => {
      if (selectedGenres.length === 0) {
        setResults(null);
        return;
      }
      setLoading(true);
      const movies = await fetchMoviesByGenres(selectedGenres);
      setResults(movies);
      setLoading(false);
    };

    fetchFilteredMovies();
  }, [selectedGenres]);

  return (
    <AuthorizeView>
      <Navbar />
      <div className="">
        <div className="">
          <h1 className="">Search Movies</h1>

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
                backgroundColor: '#6b7280',
                color: 'white',
                borderRadius: '0.5rem',
                fontWeight: 600,
              }}
            >
              Search
            </button>
          </form>

          {/* <button
            onClick={() => setShowGenreFilter(!showGenreFilter)}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#6b7280',
              color: 'white',
              borderRadius: '0.5rem',
              fontWeight: 600,
            }}
          >
            {showGenreFilter ? 'Hide Genre Filter' : 'Filter by Genre'}
          </button> */}

          {/* {showGenreFilter && ( */}

            {/* <GenreFilter
              selectedGenres={selectedGenres}
              setSelectedGenres={setSelectedGenres}
            /> */}
          {/* )} */}

          {loading && <p >Loading...</p>}
        </div>
      </div>


      <div className='search-page-wrapper'>
        <div   className='row'>
          <div className='col-md-1'  >
          <GenreFilter
                selectedGenres={selectedGenres}
                setSelectedGenres={setSelectedGenres}
              />
          </div>
        
          <div className='col-md-10'>
          <MovieList overrideMovies={results ?? undefined} />
          </div>
        </div> 
      </div>

      

    </AuthorizeView>
  );
}

export default SearchPage;
