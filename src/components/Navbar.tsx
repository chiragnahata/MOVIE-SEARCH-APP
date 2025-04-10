
import { Link, useLocation } from "react-router-dom";
import { Film, Sun, Moon, Heart } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  
  return (
    <nav className="border-b border-border sticky top-0 z-10 bg-background/80 backdrop-blur-md transition-colors duration-200">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and App Name */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground hover:opacity-80">
          <Film className="h-5 w-5 text-primary" />
          <span className="text-lg animate-fadeIn">CineSearch</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-4">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Search
            </Link>
            <Link 
              to="/favorites" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/favorites" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Favorites
            </Link>
          </div>

          {/* Mobile Nav Icons */}
          <div className="sm:hidden flex items-center gap-4">
            <Link 
              to="/favorites"
              aria-label="Favorites"
              className={`hover:text-primary ${
                location.pathname === "/favorites" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Heart className="h-5 w-5" />
            </Link>
          </div>
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="rounded-full"
          >
            {theme === "light" ? (
              <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 transition-all dark:rotate-0" />
            ) : (
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all dark:rotate-90" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
