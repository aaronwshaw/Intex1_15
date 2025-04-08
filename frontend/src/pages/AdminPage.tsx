import { useEffect, useState } from 'react';
import AuthorizeView from '../components/AuthorizeView';
import { Movie } from '../types/Movie';
import { deleteMovie, updateMovie } from '../api/AdminApi';
import { fetchMovies } from '../api/MoviesApi';
import { toast } from 'react-toastify';
import NewMovieForm from '../components/NewMovieForm';
import { fetchPaginatedMovies } from '../api/IntexAPI';

function AdminPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [editedMovie, setEditedMovie] = useState<Partial<Movie>>({});
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // or any number you want per page
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchPaginatedMovies(currentPage, pageSize);
        if (data) {
          setMovies(data.movies); // Adjust based on your API's actual structure
          setTotalPages(data.totalPages); // Make sure your API returns this
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [currentPage, pageSize]); // <-- refetch when page or size changes
  
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
      // Log the movie data before sending
      console.log('Attempting to update movie:', { show_id, editedMovie });

      // Call the updateMovie function and log the result
      const success = await updateMovie(show_id, editedMovie as Movie);
      console.log('Update result:', success);

      if (success) {
        // Update the local state with the edited movie data
        setMovies(movies.map((m) => (m.show_id === show_id ? { ...m, ...editedMovie } : m)));
        setEditingMovie(null);
        setEditedMovie({});
      } else {
        toast.error('Failed to update movie. Please try again.');
      }
    } catch (error) {
      console.error(`Error during update attempt for movie (${show_id}):`, error);
      toast.error('Unexpected error while updating the movie.');
    }
  };

  const handleDelete = async (show_id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this movie?");
    if (!confirmDelete) return;

    try {
      await deleteMovie(show_id);
      setMovies(movies.filter((m) => m.show_id !== show_id));
    } catch (error) {
      toast.error('Failed to delete movie. Please try again.');
    }
  };

  const handleChange = (field: keyof Movie, value: string) => {
    setEditedMovie((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <AuthorizeView>
      <h1>Welcome, Admin!</h1>
      {!showForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          Add Projects
        </button>
      )}

{showForm && (
        <NewMovieForm
          onSuccess={() => {
            setShowForm(false);
            fetchMovies().then((data) =>
              setMovies(data.movies)
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingMovie ? (
        <div className="card p-3 mb-4">
          <h3>Editing: {editingMovie.title}</h3>
          {['title', 'type', 'director', 'country', 'release_year', 'rating', 'duration', 'primaryGenre'].map((field) => (
            <div className="mb-2" key={field}>
              <label>{field.replace('_', ' ').toUpperCase()}</label>
              <input
                value={editedMovie[field as keyof Movie] || ''}
                onChange={(e) => handleChange(field as keyof Movie, e.target.value)}
                className="form-control mb-2"
              />
            </div>
          ))}
          <button
            className="btn btn-success me-2"
            onClick={() => handleSaveEdit(editingMovie.show_id)}
          >
            Save
          </button>
          <button className="btn btn-secondary" onClick={handleCancelEdit}>
            Cancel
          </button>
        </div>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Director</th>
              <th>Country</th>
              <th>Release Year</th>
              <th>Rating</th>
              <th>Duration</th>
              <th>Genre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.show_id}>
                <td>{m.title}</td>
                <td>{m.type}</td>
                <td>{m.director}</td>
                <td>{m.country}</td>
                <td>{m.release_year}</td>
                <td>{m.rating}</td>
                <td>{m.duration}</td>
                <td>{m.primaryGenre}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm w-100 mb-1"
                    onClick={() => handleEditClick(m)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm w-100"
                    onClick={() => handleDelete(m.show_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="d-flex justify-content-center mt-4">
  <nav>
    <ul className="pagination">
      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
          Previous
        </button>
      </li>
      {[...Array(totalPages)].map((_, idx) => (
        <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
          <button className="page-link" onClick={() => setCurrentPage(idx + 1)}>
            {idx + 1}
          </button>
        </li>
      ))}
      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </button>
      </li>
    </ul>
  </nav>
</div>

    </AuthorizeView>
  );
}

export default AdminPage;
