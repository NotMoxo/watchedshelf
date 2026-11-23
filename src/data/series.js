import { PLACEHOLDER_POSTER } from "../utils/posters";

function series(imdbID, Title, Year, imdbRating, runtime, posterPage = Title) {
  return {
    imdbID,
    Title,
    Year,
    imdbRating,
    runtime,
    posterPage,
    Poster: PLACEHOLDER_POSTER,
    type: "series",
  };
}

export const seriesCatalog = [
  series("tt0903747", "Breaking Bad", "2008", 9.5, 47),
  series("tt0944947", "Game of Thrones", "2011", 9.2, 57),
  series("tt1475582", "Sherlock", "2010", 9.1, 90),
  series("tt2861424", "Rick and Morty", "2013", 8.9, 23),
  series("tt0306414", "The Wire", "2002", 9.3, 59),
  series("tt0108778", "Friends", "1994", 8.9, 22),
  series("tt0460649", "How I Met Your Mother", "2005", 8.3, 22),
  series("tt4574334", "Stranger Things", "2016", 8.7, 51),
  series("tt2442560", "Peaky Blinders", "2013", 8.7, 60),
  series("tt0141842", "The Sopranos", "1999", 9.2, 55),
  series("tt7366338", "Chernobyl", "2019", 9.3, 60),
  series("tt0303461", "Firefly", "2002", 8.9, 44),
  series("tt0898266", "The Big Bang Theory", "2007", 8.1, 22),
  series("tt0386676", "The Office", "2005", 9.0, 22),
  series("tt0411008", "Lost", "2004", 8.3, 44),
  series("tt2440598", "House of Cards", "2013", 8.6, 55),
  series("tt5753856", "Dark", "2017", 8.7, 60),
  series("tt0096697", "The Simpsons", "1989", 8.6, 22),
  series("tt0302154", "The Walking Dead", "2010", 8.1, 45),
  series("tt2085059", "Black Mirror", "2011", 8.7, 60),
];
