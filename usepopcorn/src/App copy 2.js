import { useEffect, useState } from "react";
import StarRating from "./StarRating";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState(tempMovieData);
  // const [watched, setWatched] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState(() => {
    // this is pure function if you pass a argument it won't work
    // because pure fuction cannot recieve arguments
    // this function will be called only once in the initial render
    const data = localStorage.getItem("watched");
    return data ? JSON.parse(data) : [];
  }); 

  console.log("rendering...");
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
    handleCloseMovie();
    fetchMovies();

    return () => {
      console.log("cleanup");
      controller.abort();
    };
  }, [search])

  useEffect(() => {
    function callback (e) {
      if (e.key === "Escape") {
        handleCloseMovie();
      }
    }

    document.addEventListener("keydown", callback);
    
    return () => {
      document.removeEventListener("keydown", callback);
    }
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("watched");

  }, [watched])

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatch(movie) {
    debugger;
    setWatched((watched) => [...watched, movie]);

    localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }
    return (
      <>
        <NavBar movies={movies} >
          <Search search={search} setSearch={setSearch} />
          <NumResults movies={movies} />
        </NavBar>
        <Main> 
          <Box >
            {/* {isLoading ? 
            <Loader /> :  <MovieList movies={movies} /> } */}
            {isLoading && <Loader />}
            {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
            {error && <ErrorMessage message={error} />}
          </Box>
          <Box>            
            { 
              selectedId ? <SelectedMovie watched={watched} selectedId={selectedId} onCloseMovie={handleCloseMovie} onAddWatched={handleAddWatch} /> :
              <>
                <WatchedSummary watched={watched} />
                <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} />
              </>  
            }
          </Box>
        </Main>
      </>
    );
  }

  function ErrorMessage({message}) {
    return (
      <p className="error">
        <span>⏳</span> {message}
      </p>
    )
  }
  
  function Loader() {
    return <p className="loader">Loading...</p>;
  }
  function NavBar ({children}) {
    return (
      <nav className="nav-bar">
        <Logo />
      {children}
    </nav>
  )
}

function NumResults({movies}) {
  return (
    <p className="num-results">
    Found <strong>{movies?.length}</strong> results
  </p>
  )
}

function Logo () {
  return (
    <div className="logo">
    <span role="img">🍿</span>
    <h1>usePopcorn</h1>
  </div>
  )
}

function Search ({ search, setSearch }) {

  return (
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
  );
}


function Main ({children}) {
  
  return (
    <main className="main">
        {children}
    </main>
  )
}

function Box({children}) {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? "–" : "+"}
          </button>
          {isOpen && children}
        </div>
  )
}

// function WatchedBox () {
//   const [isOpen2, setIsOpen2] = useState(true);
//   const [watched, setWatched] = useState(tempWatchedData);
 
//   return (
//     <div className="box">
//           <button
//             className="btn-toggle"
//             onClick={() => setIsOpen2((open) => !open)}
//             >
//             {isOpen2 ? "–" : "+"}
//           </button>
//           {isOpen2 && (
//             <>
//               <WatchedSummary watched={watched} />
//               <WatchedMoviesList watched={watched} />
//             </>
//           )}
//         </div>
//   )
// }

function MovieList ({movies, onSelectMovie}) {
  
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  )
}

function Movie({movie, onSelectMovie}) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)} key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

function SelectedMovie({watched, selectedId, onCloseMovie, onAddWatched}) {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');
  // const isWatched = watched.some((movie) => movie.imdbID === selectedId);
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    imdbRating,
    Runtime: runtime,
    Plot: plot,
    Genre: genre,
    Director: director,
    Actors: actors,
    Released: released,
  } = movie || {};

  useEffect(() => {
    console.log("fetching movie details...");
    async function getMoviewDetails() {
      setIsLoading(true);
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=2f6435d9&i=${selectedId}`
      );
      const data = await response.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMoviewDetails();
  }, [selectedId])

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title || "usePopcorn"}`

    return () => {
      document.title = "usePopcorn";
    }
  }, [title])

  function handleAddWatched(movie) {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split("").at(0)),
      userRating,
    }
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }
  return (
    <div className="details">
      {isLoading ? <Loader /> : 
      (<>
        <header>
        <button className="btn-back" onClick={onCloseMovie}>&larr;</button>

        <img src={poster} alt={`Poster of ${movie} movie`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bulls; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐️</span>
            {imdbRating} IMDb rating
          </p>
        </div>
        </header>
        <section>
          <div className="rating">
            {
              !isWatched ? 
                <>
                  <StarRating 
                  maxRating={10} 
                  size={24} 
                  onSetRating={setUserRating}
                  />
                  {
                    userRating > 0 && (
                      <button className="btn-add" onClick={() => handleAddWatched(movie)}>
                        Add to List
                      </button>
                    )
                  }
                </>
              : <p>You rated with movie {watchedUserRating}<span>:star2:</span></p> 
            }
          </div>
          <p>
            <em>{plot}</em>
          </p>
          <p>Starring {actors}</p>
          <p>Directed by {director}</p>
        </section>
      </>
      )}
    </div>
  )
}

function WatchedSummary({watched}) {

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  )
}

function WatchedMoviesList({watched, onDeleteWatched}) {
  return (
    <ul className="list">
    {watched.map((movie) => (
      <WatchedMovie key={movie.imdbID} movie={movie} onDeleteWatched={onDeleteWatched} />
    ))}
    </ul>
  )
}

function WatchedMovie({movie, onDeleteWatched}) {
  return  <li>
  <img src={movie.poster} alt={`${movie.title} poster`} />
  <h3>{movie.title}</h3>
  <div>
    <p>
      <span>⭐️</span>
      <span>{movie.imdbRating}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{movie.userRating}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{movie.runtime} min</span>
    </p>
    <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>
      X
    </button>
  </div>
</li>
}