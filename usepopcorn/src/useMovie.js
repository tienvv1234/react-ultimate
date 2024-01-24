import { useEffect, useState } from "react";

export function useMovie (search) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        console.log("fetching movies111...");
        const controller = new AbortController();
        const fetchMovies = async () => {
          try {
            setError('');
            setIsLoading(true);
            const response = await fetch(
              `https://www.omdbapi.com/?apikey=2f6435d9&s=${search}`,
              { signal: controller.signal }
            );
    
            if (!response.ok) {
              throw new Error(
                `Something went wrong, server responded with ${response.status}`
              );
            }
    
            const data = await response.json();
            if (data.Response === "False") {
              throw new Error(data.Error);
            }
            setMovies(data?.Search);
            setError('');
          } catch (error) {
            console.error(error);
    
            if (error.name === "AbortError") {
              console.log("fetch aborted");
              return;
            }
            setError(error.message);
          }
          finally {
            setIsLoading(false);
          }
        }
    
        if(!search && search.length < 3) {
          setMovies([]);
          setError('');
          return;
        }
        // handleCloseMovie();
        // callback?.();
        fetchMovies();
    
        return () => {
          console.log("cleanup");
          controller.abort();
        };
    }, [search])

    

    return {
        movies,
        isLoading,
        error,
    }
}