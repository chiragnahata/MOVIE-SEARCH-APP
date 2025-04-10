
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Info } from "lucide-react";
import { MovieBasic } from "../services/omdbApi";
import favoriteUtils from "../utils/favoriteUtils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface MovieCardProps {
  movie: MovieBasic;
  hideActions?: boolean;
}

const MovieCard = ({ movie, hideActions = false }: MovieCardProps) => {
  const [isFavorite, setIsFavorite] = useState(favoriteUtils.isFavorite(movie.imdbID));
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const fallbackImage = "https://via.placeholder.com/300x445?text=No+Poster";
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Don't navigate on button click
    
    if (isFavorite) {
      favoriteUtils.removeFavorite(movie.imdbID);
      toast.success("Removed from favorites");
    } else {
      favoriteUtils.addFavorite(movie);
      toast.success("Added to favorites");
    }
    
    setIsFavorite(!isFavorite);
  };
  
  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => {
    setImageLoaded(true);
    setImageError(true);
  };
  
  return (
    <Link to={`/movie/${movie.imdbID}`} className="group animate-scaleIn">
      <div className="movie-card aspect-[2/3] h-full">
        {/* Image skeleton loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted rounded-lg shimmer" />
        )}
        
        {/* Movie poster */}
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : fallbackImage}
          alt={`${movie.Title} poster`}
          className={`h-full w-full object-cover rounded-lg transition-all duration-300 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Hover overlay with movie info */}
        <div className="movie-card-hover">
          <h3 className="text-white font-semibold truncate text-lg mt-auto">
            {movie.Title}
          </h3>
          <p className="text-gray-300 text-sm">{movie.Year}</p>
          
          {!hideActions && (
            <div className="flex gap-2 mt-3 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1 bg-black/40 border-white/20 text-white hover:bg-black/60 hover:text-white"
                onClick={handleFavoriteToggle}
              >
                <Heart 
                  className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} 
                />
                {isFavorite ? "Saved" : "Save"}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1 bg-black/40 border-white/20 text-white hover:bg-black/60 hover:text-white w-full sm:w-auto"
              >
                <Info className="h-4 w-4" />
                Details
              </Button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export function MovieCardSkeleton() {
  return (
    <div className="movie-card aspect-[2/3] animate-pulse">
      <Skeleton className="h-full w-full rounded-lg shimmer" />
    </div>
  );
}

export default MovieCard;
