
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ChevronLeft, Star, Clock, Calendar, Film, User, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import omdbApi, { MovieDetailed } from "../services/omdbApi";
import favoriteUtils from "../utils/favoriteUtils";
import EmptyState from "../components/EmptyState";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [movie, setMovie] = useState<MovieDetailed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);
  
  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await omdbApi.getMovieDetails(id);
        
        if (result.Response === "True") {
          setMovie(result);
          setIsFavorite(favoriteUtils.isFavorite(result.imdbID));
        } else {
          setError(result.Plot || "Movie details not found");
        }
      } catch (err) {
        setError("Failed to fetch movie details");
        toast({
          title: "Error",
          description: "Failed to load movie details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [id, toast]);
  
  const handleFavoriteToggle = () => {
    if (!movie) return;
    
    if (isFavorite) {
      favoriteUtils.removeFavorite(movie.imdbID);
      toast({
        title: "Removed from Favorites",
        description: `${movie.Title} has been removed from your favorites`,
      });
    } else {
      favoriteUtils.addFavorite(movie);
      toast({
        title: "Added to Favorites",
        description: `${movie.Title} has been added to your favorites`,
      });
    }
    
    setIsFavorite(!isFavorite);
  };
  
  if (isLoading) {
    return (
      <div className="container py-8 animate-fadeIn">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="flex items-center gap-1"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <Skeleton className="aspect-[2/3] h-full max-h-[450px] w-full rounded-lg shimmer" />
          
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4 rounded-lg shimmer" />
            <Skeleton className="h-6 w-1/2 rounded-lg shimmer" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-8 w-24 rounded-full shimmer" />
              <Skeleton className="h-8 w-24 rounded-full shimmer" />
            </div>
            <Separator className="my-6" />
            <Skeleton className="h-32 w-full rounded-lg shimmer" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !movie) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="flex items-center gap-1"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="flex justify-center py-12">
          <EmptyState 
            type="error" 
            message={error || "Movie not found"}
            actionLabel="Go Back"
            onAction={() => navigate(-1)}
          />
        </div>
      </div>
    );
  }
  
  const fallbackImage = "https://via.placeholder.com/300x445?text=No+Poster";
  
  return (
    <div className="container py-8 animate-fadeIn">
      {/* Back button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      
      {/* Movie details */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        {/* Movie poster */}
        <div className="relative">
          {!posterLoaded && (
            <div className="absolute inset-0 rounded-lg shimmer" />
          )}
          
          <img
            src={movie.Poster !== "N/A" ? movie.Poster : fallbackImage}
            alt={`${movie.Title} poster`}
            className={`w-full rounded-lg shadow-lg ${posterLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setPosterLoaded(true)}
            onError={() => setPosterLoaded(true)}
          />
          
          <div className="mt-4">
            <Button
              className="w-full flex items-center justify-center gap-2"
              onClick={handleFavoriteToggle}
              variant={isFavorite ? "secondary" : "default"}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          </div>
        </div>
        
        {/* Movie info */}
        <div>
          <h1 className="text-3xl font-bold">{movie.Title}</h1>
          
          <div className="flex flex-wrap items-center gap-2 mt-2 text-muted-foreground">
            {movie.Year && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{movie.Year}</span>
              </div>
            )}
            
            {movie.Runtime && movie.Runtime !== "N/A" && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{movie.Runtime}</span>
              </div>
            )}
            
            {movie.Rated && movie.Rated !== "N/A" && (
              <Badge variant="outline">{movie.Rated}</Badge>
            )}
          </div>
          
          {/* Ratings */}
          {movie.imdbRating && movie.imdbRating !== "N/A" && (
            <div className="mt-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{movie.imdbRating}/10</span>
                <span className="text-sm text-muted-foreground">
                  ({movie.imdbVotes !== "N/A" ? movie.imdbVotes : "N/A"} votes)
                </span>
              </div>
            </div>
          )}
          
          {/* Genre tags */}
          {movie.Genre && movie.Genre !== "N/A" && (
            <div className="flex flex-wrap gap-2 mt-4">
              {movie.Genre.split(", ").map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
          )}
          
          <Separator className="my-6" />
          
          {/* Plot */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Synopsis</h2>
            <p className="text-muted-foreground">
              {movie.Plot !== "N/A" ? movie.Plot : "No synopsis available."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            {/* Director */}
            {movie.Director && movie.Director !== "N/A" && (
              <div>
                <h3 className="text-sm font-medium flex items-center gap-1 mb-1">
                  <User className="h-4 w-4" />
                  Director
                </h3>
                <p>{movie.Director}</p>
              </div>
            )}
            
            {/* Actors */}
            {movie.Actors && movie.Actors !== "N/A" && (
              <div>
                <h3 className="text-sm font-medium flex items-center gap-1 mb-1">
                  <User className="h-4 w-4" />
                  Cast
                </h3>
                <p>{movie.Actors}</p>
              </div>
            )}
            
            {/* Language */}
            {movie.Language && movie.Language !== "N/A" && (
              <div>
                <h3 className="text-sm font-medium flex items-center gap-1 mb-1">
                  <Film className="h-4 w-4" />
                  Language
                </h3>
                <p>{movie.Language}</p>
              </div>
            )}
            
            {/* Awards */}
            {movie.Awards && movie.Awards !== "N/A" && (
              <div>
                <h3 className="text-sm font-medium flex items-center gap-1 mb-1">
                  <Award className="h-4 w-4" />
                  Awards
                </h3>
                <p>{movie.Awards}</p>
              </div>
            )}
          </div>
          
          {/* Additional ratings */}
          {movie.Ratings && movie.Ratings.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-medium mb-2">Other Ratings</h3>
              <div className="flex flex-wrap gap-4">
                {movie.Ratings.map((rating, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <span className="text-muted-foreground">{rating.Source}:</span>
                    <span className="font-medium">{rating.Value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
