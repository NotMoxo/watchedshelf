export const LOCAL_LIBRARY_KEY = "usepopcorn-library";

export function readLocalLibrary(defaultRecords) {
  const savedRecords = window.localStorage.getItem(LOCAL_LIBRARY_KEY);
  if (savedRecords === null) return defaultRecords;

  const records = JSON.parse(savedRecords);
  if (!Array.isArray(records)) {
    throw new Error("Saved watchlist data is invalid.");
  }
  return records;
}

export function writeLocalLibrary(records) {
  window.localStorage.setItem(LOCAL_LIBRARY_KEY, JSON.stringify(records));
}

export function toLibraryRecord(media, userId, changes = {}) {
  return {
    user_id: userId,
    imdb_id: media.imdbID,
    media_type: media.type,
    title: media.Title,
    year: Number(media.Year),
    poster: media.Poster || null,
    poster_page: media.posterPage || media.Title,
    imdb_rating: Number(media.imdbRating) || 0,
    runtime: Number(media.runtime) || 0,
    user_rating: media.userRating ?? null,
    is_watched: Boolean(media.isWatched),
    is_custom: Boolean(media.isCustom),
    ...changes,
  };
}

export function fromLibraryRecord(record) {
  return {
    imdbID: record.imdb_id,
    type: record.media_type,
    Title: record.title,
    Year: String(record.year),
    Poster: record.poster || "/movie-placeholder.svg",
    posterPage: record.poster_page || record.title,
    imdbRating: Number(record.imdb_rating) || 0,
    runtime: Number(record.runtime) || 0,
    userRating: record.user_rating === null ? null : Number(record.user_rating),
    isWatched: record.is_watched,
    isCustom: Boolean(record.is_custom),
  };
}
