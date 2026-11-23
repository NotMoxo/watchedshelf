export function Search({ query, onQueryChange }) {
  return (
    <input
      className="search"
      type="text"
      aria-label="Search movies by title"
      placeholder="Search movies..."
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
    />
  );
}
