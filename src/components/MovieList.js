export function Movie({ movie, isWatched, onAddWatched, onRemoveCustom }) {
  const duration =
    movie.type === "series"
      ? `${movie.runtime} min/episode`
      : `${movie.runtime} min`;

  return (
    <li>
      <img
        src={movie.Poster}
        alt={`${movie.Title} poster`}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = "/movie-placeholder.svg";
        }}
      />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
        <p>
          <span>⭐</span>
          <span>{movie.imdbRating.toFixed(1)} IMDb</span>
        </p>
        <p>
          <span>⏱</span>
          <span>{duration}</span>
        </p>
        <button
          className="btn-add btn-add-plus"
          type="button"
          disabled={isWatched}
          onClick={() => onAddWatched(movie)}
          aria-label={isWatched ? `${movie.Title} is in your watched list` : `Add ${movie.Title} to watched`}
        >
          {isWatched ? "✓" : "+"}
        </button>
        {movie.isCustom && (
          <button
            className="btn-delete btn-remove-custom"
            type="button"
            aria-label={`Remove ${movie.Title} from library`}
            onClick={() => onRemoveCustom(movie.imdbID)}
          >
            ×
          </button>
        )}
      </div>
    </li>
  );
}

export function MovieList({
  movies,
  watched,
  onAddWatched,
  onRemoveCustom,
  category = "movie",
}) {
  if (movies.length === 0) {
    return (
      <p className="empty-state" role="status">
        No {category === "movie" ? "movies" : "series"} found. Try another title.
      </p>
    );
  }

  return (
    <ul className="list list-movies">
      {movies.map((movie) => (
        <Movie
          key={movie.imdbID}
          movie={movie}
          isWatched={watched.some(
            (watchedMovie) => watchedMovie.imdbID === movie.imdbID,
          )}
          onAddWatched={onAddWatched}
          onRemoveCustom={onRemoveCustom}
        />
      ))}
    </ul>
  );
}
