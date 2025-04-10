
import { MovieBasic } from '../services/omdbApi';

// Local Storage key for favorites
const FAVORITES_STORAGE_KEY = 'movieSearchApp_favorites';

/**
 * Utility functions for managing favorite movies in localStorage
 */
const favoriteUtils = {
  /**
   * Get all favorite movies from localStorage
   * @returns Array of favorite movies
   */
  getFavorites: (): MovieBasic[] => {
    const favorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return favorites ? JSON.parse(favorites) : [];
  },

  /**
   * Add a movie to favorites
   * @param movie - Movie to add to favorites
   */
  addFavorite: (movie: MovieBasic): void => {
    const favorites = favoriteUtils.getFavorites();
    
    // Only add if not already in favorites
    if (!favorites.some(fav => fav.imdbID === movie.imdbID)) {
      const updatedFavorites = [...favorites, movie];
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
    }
  },

  /**
   * Remove a movie from favorites
   * @param imdbID - IMDB ID of movie to remove
   */
  removeFavorite: (imdbID: string): void => {
    const favorites = favoriteUtils.getFavorites();
    const updatedFavorites = favorites.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
  },

  /**
   * Check if a movie is in favorites
   * @param imdbID - IMDB ID to check
   * @returns Boolean indicating if movie is in favorites
   */
  isFavorite: (imdbID: string): boolean => {
    const favorites = favoriteUtils.getFavorites();
    return favorites.some(movie => movie.imdbID === imdbID);
  }
};

export default favoriteUtils;
