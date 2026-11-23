export function StarRating({ value, onChange, label }) {
  return (
    <div className="star-rating" role="group" aria-label={label}>
      {Array.from({ length: 10 }, (_, index) => {
        const rating = index + 1;
        return (
          <button
            key={rating}
            type="button"
            className={rating <= value ? "star star-active" : "star"}
            aria-label={`${rating} out of 10 stars`}
            aria-pressed={rating === value}
            onClick={() => onChange(rating)}
          >
            ★
          </button>
        );
      })}
      <span className="rating-value" aria-live="polite">
        {value ? `${value}/10` : "Rate"}
      </span>
    </div>
  );
}
