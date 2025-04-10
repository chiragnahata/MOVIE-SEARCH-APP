
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import MovieCard from "../components/MovieCard";
import EmptyState from "../components/EmptyState";
import favoriteUtils from "../utils/favoriteUtils";
import { MovieBasic } from "../services/omdbApi";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Favorites = () => {
  const [favorites, setFavorites] = useState<MovieBasic[]>([]);
  const { toast } = useToast();
  
  // Load favorites from localStorage
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const storedFavorites = favoriteUtils.getFavorites();
        setFavorites(storedFavorites);
      } catch (error) {
        console.error("Error loading favorites:", error);
        toast({
          title: "Error",
          description: "Failed to load favorites. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    loadFavorites();
    
    // Add event listener for storage changes
    window.addEventListener("storage", loadFavorites);
    
    return () => {
      window.removeEventListener("storage", loadFavorites);
    };
  }, [toast]);
  
  // When a movie is removed from favorites, refresh the list
  const handleFavoriteRemoved = (imdbID: string) => {
    setFavorites(prev => prev.filter(movie => movie.imdbID !== imdbID));
  };
  
  return (
    <div className="container py-8 flex-1">
      {/* Header */}
      <div className="mb-8 text-center animate-fadeIn">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
          <Heart className="h-8 w-8 text-primary" />
          <span>Your Favorites</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Your saved movies collection. All your favorites in one place.
        </p>
      </div>
      
      {/* Favorites content */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 animate-fadeIn">
          {favorites.map((movie) => (
            <div key={movie.imdbID} className="relative">
              <MovieCard movie={movie} />
              
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  favoriteUtils.removeFavorite(movie.imdbID);
                  handleFavoriteRemoved(movie.imdbID);
                  toast({
                    title: "Removed from Favorites",
                    description: `${movie.Title} has been removed from your favorites`,
                  });
                }}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center py-12">
          <EmptyState 
            type="favorites"
            actionLabel="Browse Movies"
            onAction={() => window.location.href = "/"}
          />
        </div>
      )}
    </div>
  );
};

export default Favorites;
