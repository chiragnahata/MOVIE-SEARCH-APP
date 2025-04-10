
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
  Poster: string;
}

export interface SearchResult {
  Search?: MovieBasic[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

export type SearchType = 'movie' | 'series' | 'episode' | '';
export type PlotLength = 'short' | 'full';

export interface SearchOptions {
  title?: string;
  imdbID?: string;
  type?: SearchType;
  year?: string;
  plot?: PlotLength;
  page?: number;
  callback?: string; // JSONP callback name
}

// API service object with methods for different endpoints
const omdbApi = {
  /**
   * Search for movies by title
   * @param searchTerm - The movie title to search for
   * @param page - Optional page number for pagination (default: 1)
   * @param type - Optional type filter (movie, series, episode)
   * @param year - Optional year filter
   * @returns Promise with search results
   */
  searchMovies: async (
    searchTerm: string, 
    page = 1, 
    type: SearchType = 'movie',
    year?: string
  ): Promise<SearchResult> => {
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
      
      // Build query parameters
      const params = new URLSearchParams({
        apikey: API_KEY,
        s: searchTerm,
        page: page.toString()
      });
      
      // Add optional parameters if provided
      if (type) params.append('type', type);
      if (year) params.append('y', year);
      
      const response = await fetch(`${BASE_URL}?${params.toString()}`);
      
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
   * @param plot - Optional plot length (short or full)
   * @returns Promise with detailed movie information
   */
  getMovieDetails: async (
    imdbID: string, 
    plot: PlotLength = 'full'
  ): Promise<MovieDetailed> => {
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
      
      // Build query parameters
      const params = new URLSearchParams({
        apikey: API_KEY,
        i: imdbID,
        plot: plot
      });
      
      const response = await fetch(`${BASE_URL}?${params.toString()}`);
      
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
  },

  /**
   * Search for movies by various criteria
   * @param options - Search options object
   * @returns Promise with search results or movie details
   */
  advancedSearch: async (options: SearchOptions): Promise<SearchResult | MovieDetailed> => {
    try {
      if (!API_KEY) {
        return {
          Response: "False",
          Error: "No API key provided. Please add your OMDB API key."
        };
      }
      
      // Initialize parameters with API key
      const params = new URLSearchParams({
        apikey: API_KEY
      });
      
      // Add parameters based on provided options
      if (options.title) params.append('s', options.title);
      if (options.imdbID) params.append('i', options.imdbID);
      if (options.type) params.append('type', options.type);
      if (options.year) params.append('y', options.year);
      if (options.plot) params.append('plot', options.plot);
      if (options.page) params.append('page', options.page.toString());
      if (options.callback) params.append('callback', options.callback);
      
      const response = await fetch(`${BASE_URL}?${params.toString()}`);
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in advanced search:", error);
      return {
        Response: "False",
        Error: "Failed to perform search. Please try again later."
      };
    }
  },

  /**
   * Search for a movie by title and year
   * @param title - The movie title
   * @param year - The movie release year
   * @returns Promise with movie details or search results
   */
  searchByTitleAndYear: async (title: string, year?: string): Promise<MovieDetailed | SearchResult> => {
    try {
      if (!API_KEY) {
        return {
          Response: "False",
          Error: "No API key provided. Please add your OMDB API key."
        };
      }
      
      // Build query parameters
      const params = new URLSearchParams({
        apikey: API_KEY,
        t: title
      });
      
      // Add year if provided
      if (year) params.append('y', year);
      
      const response = await fetch(`${BASE_URL}?${params.toString()}`);
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error searching by title and year:", error);
      return {
        Response: "False",
        Error: "Failed to fetch movie. Please try again later."
      };
    }
  },

  /**
   * Check if API key is valid by making a test request
   * @returns Promise resolving to boolean indicating if key is valid
   */
  validateApiKey: async (): Promise<boolean> => {
    try {
      if (!API_KEY) return false;
      
      const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=test`);
      const data = await response.json();
      
      return data.Response === "True" || (data.Response === "False" && data.Error !== "Invalid API key!");
    } catch (error) {
      console.error("Error validating API key:", error);
      return false;
    }
  }
};

export default omdbApi;
