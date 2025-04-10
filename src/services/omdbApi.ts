
// OMDB API Service
// This service handles all interactions with the OMDB API

/**
 * To use this app, you need to get an API key from OMDB:
 * 1. Visit http://www.omdbapi.com/apikey.aspx
 * 2. Fill out the form to request a free key (1,000 daily requests)
 * 3. Activate your key via the email you receive
 * 4. Add your key below or in your environment variables
 */

// Use environment variable or fallback to empty string
// In production, always use environment variables for API keys
const API_KEY = import.meta.env.VITE_OMDB_API_KEY || '';

// Base URL for the OMDB API
const BASE_URL = 'https://www.omdbapi.com/';

// Type definitions for Movie objects
export interface MovieBasic {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface MovieDetailed extends MovieBasic {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface SearchResult {
  Search?: MovieBasic[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

// API service object with methods for different endpoints
const omdbApi = {
  /**
   * Search for movies by title
   * @param searchTerm - The movie title to search for
   * @param page - Optional page number for pagination (default: 1)
   * @returns Promise with search results
   */
  searchMovies: async (searchTerm: string, page = 1): Promise<SearchResult> => {
    try {
      if (!API_KEY) {
        return {
          Response: "False",
          Error: "No API key provided. Please add your OMDB API key."
        };
      }
      
      if (!searchTerm.trim()) {
        return {
          Response: "False",
          Error: "Please enter a search term"
        };
      }
      
      const response = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&page=${page}&type=movie`
      );
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error searching movies:", error);
      return {
        Response: "False",
        Error: "Failed to fetch movies. Please try again later."
      };
    }
  },

  /**
   * Get detailed information about a specific movie by ID
   * @param imdbID - The IMDB ID of the movie
   * @returns Promise with detailed movie information
   */
  getMovieDetails: async (imdbID: string): Promise<MovieDetailed> => {
    try {
      if (!API_KEY) {
        return {
          imdbID: "",
          Title: "",
          Year: "",
          Type: "",
          Poster: "",
          Response: "False",
          Rated: "",
          Released: "",
          Runtime: "",
          Genre: "",
          Director: "",
          Writer: "",
          Actors: "",
          Plot: "No API key provided. Please add your OMDB API key.",
          Language: "",
          Country: "",
          Awards: "",
          Ratings: [],
          Metascore: "",
          imdbRating: "",
          imdbVotes: "",
          DVD: "",
          BoxOffice: "",
          Production: "",
          Website: ""
        };
      }
      
      const response = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`
      );
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return {
        imdbID: "",
        Title: "",
        Year: "",
        Type: "",
        Poster: "",
        Response: "False",
        Rated: "",
        Released: "",
        Runtime: "",
        Genre: "",
        Director: "",
        Writer: "",
        Actors: "",
        Plot: "Failed to fetch movie details. Please try again later.",
        Language: "",
        Country: "",
        Awards: "",
        Ratings: [],
        Metascore: "",
        imdbRating: "",
        imdbVotes: "",
        DVD: "",
        BoxOffice: "",
        Production: "",
        Website: ""
      };
    }
  }
};

export default omdbApi;
