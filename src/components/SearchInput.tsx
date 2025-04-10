
import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MovieBasic } from "../services/omdbApi";

interface SearchInputProps {
  onSearch: (term: string) => void;
  suggestions: MovieBasic[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchInput = ({
  onSearch,
  suggestions,
  isLoading,
  searchTerm,
  setSearchTerm,
}: SearchInputProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setShowSuggestions(false);
    }
  };
  
  // Clear search input
  const handleClear = () => {
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Select a suggestion
  const handleSelectSuggestion = (title: string) => {
    setSearchTerm(title);
    onSearch(title);
    setShowSuggestions(false);
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [suggestionsRef]);
  
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
          
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="pl-10 pr-10 h-12 rounded-full shadow-sm border-input"
            autoComplete="off"
          />
          
          {searchTerm && (
            <div className="absolute right-3 flex items-center">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleClear}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </form>
      
      {/* Suggestions dropdown */}
      {showSuggestions && searchTerm && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute mt-1 w-full bg-card rounded-lg shadow-lg border border-border z-10 overflow-hidden animate-fadeIn"
        >
          <ul className="py-1 max-h-64 overflow-auto">
            {suggestions.map((movie) => (
              <li key={movie.imdbID}>
                <button
                  type="button"
                  onClick={() => handleSelectSuggestion(movie.Title)}
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-muted transition-colors"
                >
                  {movie.Poster !== "N/A" ? (
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      className="h-12 w-8 object-cover rounded mr-3"
                    />
                  ) : (
                    <div className="h-12 w-8 bg-muted rounded flex items-center justify-center mr-3">
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium truncate">{movie.Title}</p>
                    <p className="text-sm text-muted-foreground">{movie.Year}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
