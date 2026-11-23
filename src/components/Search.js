export function Search({ query, onQueryChange }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
    />
  );
}
