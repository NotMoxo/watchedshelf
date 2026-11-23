import { StarRating } from "./StarRating";

export function WatchedMoviesList({
  watched,
  onDeleteWatched,
  onSetUserRating,
  category = "movie",
}) {
  if (watched.length === 0) {
    return (
      <p className="empty-state" role="status">
        You have not added any {category === "movie" ? "movies" : "series"} yet.
      </p>
    );
  }

  return (
    <ul className="list list-watched">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
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
            <p><span>⭐</span><span>{movie.imdbRating.toFixed(1)} IMDb</span></p>
            <p>
              <span>⏱</span>
              <span>
                {movie.runtime} min{category === "series" ? "/episode" : ""}
              </span>
            </p>
            <StarRating
              value={movie.userRating || 0}
              label={`Your rating for ${movie.Title}`}
              onChange={(rating) => onSetUserRating(movie.imdbID, rating)}
            />
          </div>
          <button
            className="btn-delete"
            type="button"
            aria-label={`Remove ${movie.Title} from watched movies`}
            onClick={() => onDeleteWatched(movie.imdbID)}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}
