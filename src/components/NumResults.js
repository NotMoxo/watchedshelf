export function NumResults({ count }) {
  return (
    <p className="num-results">
      Found <strong>{count}</strong> {count === 1 ? "result" : "results"}
    </p>
  );
}
