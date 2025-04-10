
import { FilmIcon, SearchX, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface EmptyStateProps {
  type: "search" | "favorites" | "error" | "api-key";
  message?: string | ReactNode;
  onAction?: () => void;
  actionLabel?: string;
}

const EmptyState = ({ 
  type, 
  message, 
  onAction, 
  actionLabel 
}: EmptyStateProps) => {
  // Define content based on type
  let icon;
  let title;
  let description = message;
  
  switch (type) {
    case "search":
      icon = <SearchX className="h-16 w-16 text-muted-foreground" />;
      title = "No movies found";
      description = description || "Try adjusting your search terms or search for a different movie.";
      break;
    case "favorites":
      icon = <Heart className="h-16 w-16 text-muted-foreground" />;
      title = "No favorites yet";
      description = description || "Movies you save will appear here. Start searching and save your favorites!";
      break;
    case "error":
      icon = <SearchX className="h-16 w-16 text-destructive" />;
      title = "Something went wrong";
      description = description || "An error occurred while fetching data. Please try again later.";
      break;
    case "api-key":
      icon = <FilmIcon className="h-16 w-16 text-primary" />;
      title = "API Key Required";
      description = description || (
        <>
          <p className="mb-4">To use this app, you need an OMDB API key:</p>
          <ol className="text-left list-decimal pl-6 mb-4 space-y-2">
            <li>Visit <a href="http://www.omdbapi.com/apikey.aspx" target="_blank" rel="noopener noreferrer" className="text-primary underline">www.omdbapi.com/apikey.aspx</a></li>
            <li>Fill out the form to request a free key (1,000 daily requests)</li>
            <li>Activate your key via the email you receive</li>
            <li>Create a <code className="bg-muted px-2 py-1 rounded text-sm">.env</code> file in the project root</li>
            <li>Add your key: <code className="bg-muted px-2 py-1 rounded text-sm">VITE_OMDB_API_KEY=yourKeyHere</code></li>
          </ol>
        </>
      );
      break;
  }
  
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg border border-border bg-card animate-fadeIn">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="text-muted-foreground max-w-md mb-6">{description}</div>
      
      {onAction && actionLabel && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
