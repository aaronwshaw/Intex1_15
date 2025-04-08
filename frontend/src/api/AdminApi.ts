import { Movie } from '../types/Movie';
import { toast } from 'react-toastify';
import { API_url } from './config'; // adjust path if needed

/**
 * Admin Movie Management API Calls
 *
 * Included in this file:
 * - addMovie(movie): Add a new movie to the database
 * - updateMovie(id, movie): Update an existing movie by ID
 * - deleteMovie(id): Delete a movie by ID
 */

// Admin: Add a new movie
export async function addMovie(movie: Movie): Promise<Movie | null> {
  try {
    const res = await fetch(`${API_url}/api/Movies/AddMovie`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to add movie');
    toast.success('Movie added successfully!');
    return await res.json();
  } catch (error) {
    console.error('Error adding movie:', error);
    toast.error('Failed to add movie');
    return null;
  }
}

// Admin: Update an existing movie
export async function updateMovie(id: string, movie: Movie): Promise<boolean> {
  try {
    const res = await fetch(`${API_url}/api/Movies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to update movie');
    toast.success('Movie updated successfully!');
    return true;
  } catch (error) {
    console.error(`Error updating movie (${id}):`, error);
    toast.error('Failed to update movie');
    return false;
  }
}

// Admin: Delete a movie
export async function deleteMovie(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_url}/api/Movies/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to delete movie');
    toast.success('Movie deleted successfully!');
    return true;
  } catch (error) {
    console.error(`Error deleting movie (${id}):`, error);
    toast.error('Failed to delete movie');
    return false;
  }
}
