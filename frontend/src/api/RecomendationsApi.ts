import { toast } from 'react-toastify';
import { API_url } from './config'; // adjust path if needed

/**
 * Recommendation API Calls
 * 
 * Included in this file:
 * - getContentRecs(showId): Get content-based recommendations for a show
 * - getCollabItemRecs(showId): Get collaborative recommendations based on a show
 * - getUserRecs(userId): Get collaborative recommendations based on a user
 */


// Get content-based recommendations based on a movie
export async function getContentRecs(showId: string) {
  try {
    const res = await fetch(`${API_url}/api/Movies/ContentItems/${showId}`, {
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to fetch content recommendations');
    return await res.json();
  } catch (error) {
    console.error(`Error fetching content recs for showId ${showId}:`, error);
    toast.error('Error loading content-based recommendations');
    return null;
  }
}

// Get collaborative filtering recommendations based on a movie
export async function getCollabItemRecs(showId: string) {
  try {
    const res = await fetch(`${API_url}/api/Movies/CollabItems/${showId}`, {
      credentials: 'include',
    });

    if (!res.ok)
      throw new Error('Failed to fetch collaborative recommendations');
    return await res.json();
  } catch (error) {
    console.error(
      `Error fetching collab item recs for showId ${showId}:`,
      error
    );
    toast.error('Error loading item-based recommendations');
    return null;
  }
}

// Get collaborative filtering recommendations based on a user
export async function getUserRecs(userId: string) {
  try {
    const res = await fetch(`${API_url}/api/Movies/CollabUsers/${userId}`, {
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to fetch user-based recommendations');
    return await res.json();
  } catch (error) {
    console.error(`Error fetching user recs for userId ${userId}:`, error);
    toast.error('Error loading user-based recommendations');
    return null;
  }
}
