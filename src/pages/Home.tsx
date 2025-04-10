
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import SearchInput from "../components/SearchInput";
import MovieCard, { MovieCardSkeleton } from "../components/MovieCard";
import EmptyState from "../components/EmptyState";
import omdbApi, { MovieBasic, SearchResult } from "../services/omdbApi";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState<MovieBasic[]>([]);
  const [suggestions, setSuggestions] = useState<MovieBasic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialState, setIsInitialState] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  // Function to search movies
  const searchMovies = async (term: string, page = 1) => {
    if (!term) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results: SearchResult = await omdbApi.searchMovies(term, page);
      
      if (results.Response === "True" && results.Search) {
        if (page === 1) {
          setMovies(results.Search);
        } else {
          setMovies(prev => [...prev, ...results.Search!]);
        }
        
        setTotalResults(parseInt(results.totalResults || "0"));
        setIsInitialState(false);
      } else {
        if (page === 1) {
          setMovies([]);
        }
        setError(results.Error || "No results found");
        setIsInitialState(false);
      }
    } catch (err) {
      setError("An error occurred while fetching data");
      toast({
        title: "Error",
        description: "Failed to fetch movies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get suggestions as user types
  useEffect(() => {
    const getSuggestions = async () => {
      if (searchTerm.length > 2) {
        try {
          const results = await omdbApi.searchMovies(searchTerm);
          if (results.Response === "True" && results.Search) {
            setSuggestions(results.Search.slice(0, 5));
          } else {
            setSuggestions([]);
          }
        } catch (error) {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };
    
    const timeoutId = setTimeout(() => {
      getSuggestions();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  
  // Handle search form submission
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    searchMovies(term, 1);
  };
  
  // Load more results
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    searchMovies(searchTerm, nextPage);
  };

  // Load trending movies on initial render
  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        setIsLoading(true);
        // Using a popular search term to get some initial movies
        const results = await omdbApi.searchMovies("marvel");
        
        if (results.Response === "True" && results.Search) {
          setMovies(results.Search);
          setTotalResults(parseInt(results.totalResults || "0"));
        }
      } catch (error) {
        console.error("Failed to load trending movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTrendingMovies();
  }, []);
  
  return (
    <div className="container py-8 flex-1">
      {/* Hero section */}
      <div className="mb-8 text-center animate-fadeIn">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
          <Film className="h-8 w-8 text-primary" />
          <span>CineSearch</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          Search for your favorite movies, explore details, and save them to your personal collection.
        </p>
        
        {/* Search input */}
        <SearchInput 
          onSearch={handleSearch}
          suggestions={suggestions}
          isLoading={isLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      
      {/* Results section */}
      <div className="space-y-8">
        {isLoading && movies.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(10)].map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="flex justify-center py-12">
            <EmptyState 
              type="search"
              message={error}
              actionLabel="Clear Search"
              onAction={() => {
                setSearchTerm("");
                setIsInitialState(true);
              }}
            />
          </div>
        ) : (
          <>
            {movies.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {movies.map((movie) => (
                    <MovieCard key={movie.imdbID} movie={movie} />
                  ))}
                </div>
                
                {/* Load more button */}
                {movies.length < totalResults && (
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="min-w-[150px]"
                    >
                      {isLoading ? "Loading..." : "Load More"}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center py-12">
                <EmptyState type="search" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
