import { fromLibraryRecord, toLibraryRecord } from "./library";

test("custom media status survives a Supabase record round trip", () => {
  const media = {
    imdbID: "custom-example",
    type: "series",
    Title: "Example series",
    Year: "2024",
    Poster: "/movie-placeholder.svg",
    imdbRating: 8.2,
    runtime: 45,
    isWatched: false,
    isCustom: true,
  };

  const record = toLibraryRecord(media, "user-id");

  expect(record.is_custom).toBe(true);
  expect(fromLibraryRecord(record)).toMatchObject({
    imdbID: "custom-example",
    type: "series",
    Title: "Example series",
    isCustom: true,
  });
});
