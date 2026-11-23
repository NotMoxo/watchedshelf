import { useState } from "react";

export function AddMediaForm({ category, onAdd, onCancel }) {
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title").trim();

    const newId =
      window.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const added = await onAdd({
      imdbID: `custom-${newId}`,
      Title: title,
      Year: formData.get("year"),
      imdbRating: Number(formData.get("imdbRating")) || 0,
      runtime: Number(formData.get("runtime")) || 0,
      Poster: formData.get("poster") || "/movie-placeholder.svg",
      posterPage: title,
      type: category,
    });

    if (added) {
      form.reset();
      onCancel();
    } else {
      setError("That title and year are already in your list.");
    }
  }

  const typeLabel = category === "movie" ? "movie" : "series";

  return (
    <form className="add-media-form" onSubmit={handleSubmit}>
      <div className="add-media-heading">
        <h2>Add a {typeLabel}</h2>
        <button
          className="add-media-close"
          type="button"
          aria-label="Close add title form"
          onClick={onCancel}
        >
          ×
        </button>
      </div>
      <label>
        Title
        <input name="title" type="text" required maxLength="120" autoFocus />
      </label>
      <label>
        Year
        <input
          name="year"
          type="number"
          required
          min="1888"
          max={new Date().getFullYear() + 10}
        />
      </label>
      <div className="add-media-details">
        <label>
          IMDb rating
          <input name="imdbRating" type="number" min="0" max="10" step="0.1" />
        </label>
        <label>
          {category === "movie" ? "Runtime (minutes)" : "Minutes per episode"}
          <input name="runtime" type="number" min="1" max="1000" />
        </label>
      </div>
      <label>
        Poster image URL (optional)
        <input name="poster" type="url" placeholder="https://..." />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="add-media-actions">
        <button className="btn-add" type="submit">
          Add to list
        </button>
        <button className="btn-cancel" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
