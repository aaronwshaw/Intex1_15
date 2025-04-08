import { useState } from 'react';
import AuthorizeView from '../components/AuthorizeView';
import { Movie } from '../types/Movie';
import { deleteMovie } from '../api/AdminApi';

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

  return (
    <AuthorizeView>
      <h1>Welcome, Admin!</h1>
    </AuthorizeView>
  );
}

export default AdminPage;
