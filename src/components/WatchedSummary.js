const average = (arr) => {
  const values = arr.filter((value) => Number.isFinite(value) && value > 0);
  return values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : null;
};

export function WatchedSummary({ watched, category = "movie" }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>{category === "movie" ? "Movies you watched" : "Series you watched"}</h2>
      <div>
        <p><span>#️⃣</span><span>{watched.length} {category === "movie" ? "movies" : "series"}</span></p>
        <p><span>⭐</span><span>{avgImdbRating?.toFixed(1) || "—"} IMDb</span></p>
        <p><span>🌟</span><span>{avgUserRating?.toFixed(1) || "—"} your rating</span></p>
        <p><span>⏱</span><span>{avgRuntime ? `${avgRuntime.toFixed(0)} min${category === "series" ? "/episode" : ""}` : "—"}</span></p>
      </div>
    </div>
  );
}
