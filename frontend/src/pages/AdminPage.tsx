  import { useEffect, useState } from 'react';
  import AuthorizeView from '../components/AuthorizeView';
  import { Movie } from '../types/Movie';
  import { deleteMovie, updateMovie } from '../api/AdminApi';
  import { fetchPaginatedMovies } from '../api/IntexAPI';
  import { searchMovies } from '../api/MoviesApi';
  import { toast } from 'react-toastify';
  import NewMovieForm from '../components/NewMovieForm';
  import Navbar from '../components/Navbar';
  import RequireRole from '../components/RequireRole';
import Footer from '../components/Footer';

  function AdminPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
    const [editedMovie, setEditedMovie] = useState<Partial<Movie>>({});
    const [showForm, setShowForm] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const [failedPosters, setFailedPosters] = useState<Record<string, boolean>>({});

    useEffect(() => {
      if (isSearching) return;

      const loadMovies = async () => {
        try {
          setLoading(true);
          const data = await fetchPaginatedMovies(currentPage, pageSize);
          if (data) {
            setMovies(data.movies);
            setTotalPages(data.totalPages);
          }
        } catch (error) {
          setError((error as Error).message);
        } finally {
          setLoading(false);
        }
      };

      loadMovies();
    }, [currentPage, pageSize, isSearching]);

    const getPosterUrl = (title: string) => {
      const encoded = encodeURIComponent(`${title}.jpg`);
      return `https://posterstorage115.blob.core.windows.net/posters/Movie%20Posters/${encoded}`;
    };

    const handleEditClick = (movie: Movie) => {
      setEditingMovie(movie);
      setEditedMovie({ ...movie });
    };

    const handleCancelEdit = () => {
      setEditingMovie(null);
      setEditedMovie({});
    };

    const handleSaveEdit = async (show_id: string) => {
      try {
        const success = await updateMovie(show_id, editedMovie as Movie);
        if (success) {
          setMovies(movies.map((m) => (m.show_id === show_id ? { ...m, ...editedMovie } : m)));
          setEditingMovie(null);
          setEditedMovie({});
        } else {
          toast.error('Failed to update movie. Please try again.');
        }
      } catch {
        toast.error('Unexpected error while updating the movie.');
      }
    };

    const handleDelete = async (show_id: string) => {
      if (!window.confirm('Are you sure you want to delete this movie?')) return;

      try {
        await deleteMovie(show_id);
        const data = await fetchPaginatedMovies(currentPage, pageSize);
        if (data) {
          setMovies(data.movies);
          setTotalPages(data.totalPages);
        }
      } catch {
        toast.error('Failed to delete movie. Please try again.');
      }
    };

    const handleChange = (field: keyof Movie, value: string) => {
      setEditedMovie((prev) => ({ ...prev, [field]: value }));
    };

    const getPaginationRange = () => {
      const range: (number | string)[] = [];
      const delta = 2;

      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) range.push(i);
        return range;
      }

      range.push(1);
      if (currentPage > 3) range.push('...');

      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);

      for (let i = start; i <= end; i++) range.push(i);
      if (currentPage < totalPages - 2) range.push('...');

      range.push(totalPages);
      return range;
    };

    if (loading) return <p>Loading movies...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
      <AuthorizeView>
        <RequireRole role="Admin">
          {/* ✅ Add horizontal padding wrapper */}
          
            <Navbar />
            <div style={{ padding: '0 15rem' }}>
            <br /><br />
            <h1>Welcome, Admin!</h1>

            {/* 🔍 Search */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (searchQuery.trim() === '') {
                    setIsSearching(false);
                    const data = await fetchPaginatedMovies(1, pageSize);
                    if (data) {
                      setMovies(data.movies);
                      setTotalPages(data.totalPages);
                      setCurrentPage(1);
                    }
                    return;
                  }
                  setIsSearching(true);
                  const results = await searchMovies(searchQuery);
                  if (results) {
                    setMovies(results);
                    setTotalPages(1);
                    setCurrentPage(1);
                  }
                }}
                style={{ display: 'flex', gap: '0.5rem', maxWidth: '600px', width: '100%' }}
              >
                <input
                  type="text"
                  placeholder="Search movies by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #ccc',
                    backgroundColor: '#f8f9fa',
                    color: '#333',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setSearchQuery('');
                    setIsSearching(false);
                    const data = await fetchPaginatedMovies(1, pageSize);
                    if (data) {
                      setMovies(data.movies);
                      setTotalPages(data.totalPages);
                      setCurrentPage(1);
                    }
                  }}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  Clear
                </button>
              </form>
            </div>

            {!showForm && (
              <button className="btn btn-success mb-3" onClick={() => setShowForm(true)}>
                Add Projects
              </button>
            )}

            {showForm && (
              <NewMovieForm
                onSuccess={async () => {
                  setShowForm(false);
                  const data = await fetchPaginatedMovies(currentPage, pageSize);
                  if (data) {
                    setMovies(data.movies);
                    setTotalPages(data.totalPages);
                  }
                }}
                onCancel={() => setShowForm(false)}
              />
            )}

<div className="d-flex justify-content-end align-items-center mb-3" style={{ position: 'relative' }}>
  <label htmlFor="pageSizeSelect" className="me-2 mb-0 text-white">
    Movies per page:
  </label>
  <div style={{ position: 'relative' }}>
    <select
      id="pageSizeSelect"
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
      }}
      className="form-select w-auto"
      style={{
        backgroundColor: '#343a40', // dark gray
        color: '#ffffff',
        border: '1px solid #495057',
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        paddingRight: '2rem',
      }}
    >
      {[5, 10, 20, 50, 100].map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
    <div
      style={{
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        color: 'white',
        fontSize: '0.7rem',
      }}
    >
      ▼
    </div>
  </div>
</div>


            {editingMovie ? (
              <div className="card p-3 mb-4">
                <h3>Editing: {editingMovie.title}</h3>
                {[
                  'title',
                  'type',
                  'director',
                  'country',
                  'release_year',
                  'rating',
                  'duration',
                  'primaryGenre',
                ].map((field) => (
                  <div className="mb-2" key={field}>
                    <label>{field.replace('_', ' ').toUpperCase()}</label>
                    <input
                      value={editedMovie[field as keyof Movie] || ''}
                      onChange={(e) => handleChange(field as keyof Movie, e.target.value)}
                      className="form-control mb-2"
                    />
                  </div>
                ))}
                <button className="btn btn-success me-2" onClick={() => handleSaveEdit(editingMovie.show_id)}>
                  Save
                </button>
                <button className="btn btn-secondary" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th className="text-center align-middle">Poster</th>
                    <th className="text-center align-middle">Title</th>
                    <th className="text-center align-middle">Type</th>
                    <th className="text-center align-middle">Director</th>
                    <th className="text-center align-middle">Country</th>
                    <th className="text-center align-middle">Release Year</th>
                    <th className="text-center align-middle">Rating</th>
                    <th className="text-center align-middle">Duration</th>
                    <th className="text-center align-middle">Genre</th>
                    <th className="text-center align-middle">Actions</th>
                  </tr>
                </thead>


                  <tbody>
                    {movies.map((m) => (
                      <tr key={m.show_id}>
                        <td style={{ width: '100px' }}>
                          {!failedPosters[m.title] ? (
                            <img
                              src={getPosterUrl(m.title)}
                              alt={`${m.title} poster`}
                              style={{ width: '80px', height: '120px', objectFit: 'cover' }}
                              onError={() =>
                                setFailedPosters((prev) => ({ ...prev, [m.title]: true }))
                              }
                            />
                          ) : (
                            <div
                              style={{
                                width: '80px',
                                height: '120px',
                                backgroundColor: '#ccc',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                color: '#666',
                              }}
                            >
                              No Image
                            </div>
                          )}
                        </td>
                        <td className="align-middle">{m.title}</td>
                        <td className="align-middle">{m.type}</td>
                        <td className="align-middle">{m.director}</td>
                        <td className="align-middle">{m.country}</td>
                        <td className="align-middle">{m.release_year}</td>
                        <td className="align-middle">{m.rating}</td>
                        <td className="align-middle">{m.duration}</td>
                        <td className="align-middle">{m.primaryGenre}</td>
                        <td className="align-middle">
                          <button className="btn btn-primary btn-sm w-100 mb-1" onClick={() => handleEditClick(m)}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm w-100" onClick={() => handleDelete(m.show_id)}>
                            Delete
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>

                {!isSearching && (
                  <div className="d-flex justify-content-center mt-4">
                    <nav>
                      <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                            Previous
                          </button>
                        </li>

                        {getPaginationRange().map((page, idx) => (
                          <li
                            key={idx}
                            className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
                          >
                            {page === '...' ? (
                              <span className="page-link">…</span>
                            ) : (
                              <button className="page-link" onClick={() => setCurrentPage(Number(page))}>
                                {page}
                              </button>
                            )}
                          </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        <Footer />  
        </RequireRole>
      </AuthorizeView>
    );
  }

  export default AdminPage;
