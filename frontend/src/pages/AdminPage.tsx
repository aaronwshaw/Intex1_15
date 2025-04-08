import { useEffect, useState } from 'react';
import AuthorizeView from '../components/AuthorizeView';
import { Movie } from '../types/Movie';
import { deleteMovie } from '../api/AdminApi';
import { fetchMovies } from '../api/MoviesApi';

function AdminPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [showForm, setShowForm] = useState(false);

  const [editingMovie, setEditingMovie] = useState <Movie | null>(null);

  const handleDelete = async (show_id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this movie?");
    if (!confirmDelete) return;

    try{
      await deleteMovie(show_id);
      setMovies(movies.filter((m) => m.show_id != show_id))
    } catch (error) {
      alert("Failed to delete project. Please try again.")
    }
  }
  useEffect(() => {
    const loadMovies = async () => {
      try{
        setLoading(true)
        const data = await fetchMovies();
        setMovies(data.movies)
      }
      catch(error) {
        setError((error as Error).message)
      }
      finally {
        setLoading(false)
      }
    };
    loadMovies();
  },[])

  if (loading) return <p>Loading movies...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <AuthorizeView>
      <h1>Welcome, Admin!</h1>
      <table className='table table-bordered table-striped'>
        <thead className='table-dark'>
          <tr>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((m) => (
            <tr key={m.show_id}>
              <td>{m.title}</td>
              <td>
                <button className='btn btn-primary btn-sm w-100 mb-1'>Edit</button>
                <button className='btn btn-danger btn-sm w-100 mb-1'>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AuthorizeView>
  );
}

export default AdminPage;
