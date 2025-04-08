import { Movie } from '../types/Movie';
import { toast } from 'react-toastify';
import { API_url } from './config'; // adjust path if needed

/**
 * General Movie API Calls
 *
 * Included in this file:
 * - fetchMovies(): Fetch the first 10 movies (for test/demo purposes)
 * - searchMovies(query): Search for movies by title (case-insensitive)
 * - getMovieById(id): Get details about a specific movie by its ID
 * - fetchGenres(): Get distinct movie genres (excluding "Unknown")
 * - fetchTopRatedMovies(count): Get top N movies sorted by average rating
 */

export const fetchMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${API_url}/api/Movies/AllMovies`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    // Cast the response to the Movie type
    const data: Movie[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

// Search for a movie by title
export async function searchMovies(query: string): Promise<Movie[] | null> {
  try {
    const res = await fetch(
      `${API_url}/api/Movies/Search?query=${encodeURIComponent(query)}`,
      {
        credentials: 'include',
      }
    );

    if (!res.ok) throw new Error('Failed to search movies');
    return await res.json();
  } catch (error) {
    console.error('Error searching movies:', error);
    toast.error('Error searching movies');
    return null;
  }
}

// Get info about a specific movie by ID
export async function getMovieById(id: string): Promise<Movie | null> {
  try {
    const res = await fetch(`${API_url}/api/Movies/${id}`, {
      credentials: 'include',
    });

    if (!res.ok) throw new Error(`Movie with ID ${id} not found`);
    return await res.json();
  } catch (error) {
    console.error(`Error fetching movie by ID (${id}):`, error);
    toast.error('Failed to load movie details');
    return null;
  }
}

// Get all unique genres (excluding "Unknown")
export async function fetchGenres(): Promise<string[] | null> {
  try {
    const res = await fetch(`${API_url}/api/Movies/GetGenres`, {
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to fetch genres');
    return await res.json();
  } catch (error) {
    console.error('Error fetching genres:', error);
    toast.error('Error loading genres');
    return null;
  }
}

// Get top-rated movies by average rating
export async function fetchTopRatedMovies(
  count: number = 10
): Promise<Movie[] | null> {
  try {
    const res = await fetch(`${API_url}/api/Movies/TopRated?count=${count}`, {
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to fetch top-rated movies');
    return await res.json();
  } catch (error) {
    console.error('Error fetching top-rated movies:', error);
    toast.error('Error loading top-rated movies');
    return null;
  }
}
