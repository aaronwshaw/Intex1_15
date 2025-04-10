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
 * - likeMovie(userId, showId, rating): Allow the user to rate a movie
 * - unlikeMovie(userId, showId): Remove the movie rating
 */

interface FetchMoviesResponse {
  movies: Movie[];
}

export const fetchMovies = async (): Promise<FetchMoviesResponse> => {
  try {
    const response = await fetch(`${API_url}/api/Movies/AllMovies`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    // Log the raw response
    const result = await response.json();
    console.log('Fetched movies:', result); // Log to see the structure
    return { movies: result.movies || result }; // Handle both possible structures
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

// Like or rate a movie (adds or updates a rating)
export async function likeMovie(
  userId: number,
  showId: string,
  rating: number
): Promise<boolean> {
  try {
    const response = await fetch(`${API_url}/api/Movies/AddRating`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        show_id: showId,
        rating: rating,
      }),
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to like movie');
    toast.success('Movie liked!');
    return true;
  } catch (error) {
    console.error('Error liking movie:', error);
    toast.error('Could not like movie');
    return false;
  }
}

// Unlike a movie (removes the rating)
export async function unlikeMovie(
  userId: number,
  showId: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_url}/api/Movies/DeleteRating?userId=${userId}&showId=${encodeURIComponent(showId)}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );

    if (!response.ok) throw new Error('Failed to remove rating');
    toast.success('Rating removed!');
    return true;
  } catch (error) {
    console.error('Error removing rating:', error);
    toast.error('Could not remove rating');
    return false;
  }
}


// Get rating for a specific movie and user
export async function getUserRatingForMovie(userId: number, showId: string): Promise<number | null> {
  try {
    const response = await fetch(`${API_url}/api/Movies/UserRatings/${userId}`, {
      credentials: 'include',
    });

    if (!response.ok) return null;

    const ratings = await response.json();
    const rating = ratings.find((r: any) => r.show_id === showId);
    return rating ? rating.rating : null;
  } catch (error) {
    console.error('Error fetching user rating:', error);
    return null;
  }
}

export async function fetchMoviesByGenres(selectedGenres: string[]) {
  const params = selectedGenres.map(g => `genres=${encodeURIComponent(g)}`).join('&');
  const response = await fetch(`${API_url}/api/Movies/MoviesByGenre?${params}`);

  if (!response.ok) {
    console.error("Failed to fetch movies");
    return [];
  }

  return response.json();
}

export async function fetchMoviesByIds(showIds: string[]): Promise<Movie[]> {
  const queryParams = showIds.map(id => `ids=${encodeURIComponent(id)}`).join('&');

  const response = await fetch(`${API_url}/api/Movies/by-ids?${queryParams}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }

  return await response.json(); // This will be your list of movies
}

