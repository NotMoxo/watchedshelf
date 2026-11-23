export function NumResults({ count, label = "results", singularLabel }) {
  const resultLabel =
    count === 1 ? singularLabel || label.slice(0, -1) : label;

  return (
    <p className="num-results">
      Found <strong>{count}</strong> {resultLabel}
    </p>
  );
}
