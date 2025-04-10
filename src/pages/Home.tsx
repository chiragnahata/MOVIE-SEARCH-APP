
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import SearchInput from "../components/SearchInput";
import MovieCard, { MovieCardSkeleton } from "../components/MovieCard";
import EmptyState from "../components/EmptyState";
import omdbApi, { MovieBasic, SearchResult, SearchType } from "../services/omdbApi";
import { Film, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";

// Define filter form values interface
interface FilterValues {
  type: SearchType;
  year: string;
  sort: string;
}

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState<MovieBasic[]>([]);
  const [suggestions, setSuggestions] = useState<MovieBasic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialState, setIsInitialState] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const { toast } = useToast();

  // Filter states
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Setup form for filters
  const form = useForm<FilterValues>({
    defaultValues: {
      type: "movie",
      year: "",
      sort: "default"
    }
  });
  
  // Get current filter values
  const filterValues = form.watch();
  
  // Function to search movies with filters
  const searchMovies = async (term: string, page = 1) => {
    if (!term) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results: SearchResult = await omdbApi.searchMovies(
        term, 
        page, 
        filterValues.type,
        filterValues.year ? filterValues.year : undefined
      );
      
      if (results.Response === "True" && results.Search) {
        let filteredResults = [...results.Search];
        
        // Apply client-side sorting if needed
        if (filterValues.sort === "year-asc") {
          filteredResults.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
        } else if (filterValues.sort === "year-desc") {
          filteredResults.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
        } else if (filterValues.sort === "title-asc") {
          filteredResults.sort((a, b) => a.Title.localeCompare(b.Title));
        } else if (filterValues.sort === "title-desc") {
          filteredResults.sort((a, b) => b.Title.localeCompare(a.Title));
        }
        
        setMovies(filteredResults);
        setTotalResults(parseInt(results.totalResults || "0"));
        setIsInitialState(false);
      } else {
        setMovies([]);
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
    searchMovies(term, 1);
  };
  
  // Apply filters
  const handleApplyFilters = () => {
    if (searchTerm) {
      searchMovies(searchTerm, 1);
    } else {
      loadTrendingMovies();
    }
    setFiltersOpen(false);
  };
  
  // Reset filters
  const handleResetFilters = () => {
    form.reset({
      type: "movie",
      year: "",
      sort: "default"
    });
    
    if (searchTerm) {
      searchMovies(searchTerm, 1);
    } else {
      loadTrendingMovies();
    }
    setFiltersOpen(false);
  };

  // Load trending movies function
  const loadTrendingMovies = async () => {
    try {
      setIsLoading(true);
      // Using a popular search term to get some initial movies
      const results = await omdbApi.searchMovies(
        "marvel", 
        1, 
        filterValues.type,
        filterValues.year ? filterValues.year : undefined
      );
      
      if (results.Response === "True" && results.Search) {
        let filteredResults = [...results.Search];
        
        // Apply client-side sorting if needed
        if (filterValues.sort === "year-asc") {
          filteredResults.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
        } else if (filterValues.sort === "year-desc") {
          filteredResults.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
        } else if (filterValues.sort === "title-asc") {
          filteredResults.sort((a, b) => a.Title.localeCompare(b.Title));
        } else if (filterValues.sort === "title-desc") {
          filteredResults.sort((a, b) => b.Title.localeCompare(a.Title));
        }
        
        setMovies(filteredResults);
        setTotalResults(parseInt(results.totalResults || "0"));
      }
    } catch (error) {
      console.error("Failed to load trending movies:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load trending movies on initial render
  useEffect(() => {
    loadTrendingMovies();
  }, []);
  
  // Generate years for dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => (currentYear - i).toString());
  
  // Count active filters
  const countActiveFilters = (): number => {
    let count = 0;
    if (filterValues.type !== "movie") count++;
    if (filterValues.year) count++;
    if (filterValues.sort !== "default") count++;
    return count;
  };
  
  const activeFiltersCount = countActiveFilters();
  
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
        
        {/* Search input and filters row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <div className="w-full max-w-2xl">
            <SearchInput 
              onSearch={handleSearch}
              suggestions={suggestions}
              isLoading={isLoading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
          
          {/* Filters dropdown */}
          <DropdownMenu open={filtersOpen} onOpenChange={setFiltersOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="min-w-[120px] relative flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="h-5 w-5 p-0 flex items-center justify-center rounded-full ml-1"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel>Search Filters</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <Form {...form}>
                <div className="p-2 space-y-4">
                  {/* Type filter */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Type</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Content Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="movie">Movies</SelectItem>
                              <SelectItem value="series">TV Series</SelectItem>
                              <SelectItem value="episode">Episodes</SelectItem>
                              <SelectItem value="">All Types</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {/* Year filter */}
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Release Year</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Any Year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Any Year</SelectItem>
                              {years.map(year => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {/* Sort filter */}
                  <FormField
                    control={form.control}
                    name="sort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort By</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Default Sorting" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="year-desc">Newest First</SelectItem>
                              <SelectItem value="year-asc">Oldest First</SelectItem>
                              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {/* Action buttons */}
                  <div className="flex justify-between pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleResetFilters}
                    >
                      Reset
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleApplyFilters}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </Form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Results section */}
      <div className="space-y-8">
        {!searchTerm && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Trending Movies</h2>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        )}
        
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
                loadTrendingMovies();
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
