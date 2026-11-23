export const PLACEHOLDER_POSTER = "/movie-placeholder.svg";

function normalizeTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function fetchJson(url, signal, fetcher) {
  const response = await fetcher(url, { signal });
  if (!response.ok) {
    throw new Error(`Poster lookup failed with status ${response.status}`);
  }
  return response.json();
}

async function getWikipediaPoster(media, signal, fetcher) {
  const page = media.posterPage || media.Title;
  const summary = await fetchJson(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page)}`,
    signal,
    fetcher,
  );
  const thumbnail = summary.thumbnail;

  if (
    thumbnail?.source &&
    (!thumbnail.width ||
      !thumbnail.height ||
      thumbnail.width / thumbnail.height <= 1.08)
  ) {
    return thumbnail.source;
  }

  return undefined;
}

export async function fetchMediaPoster(media, signal, fetcher = fetch) {
  let tvMazeError;

  if (media.type === "series") {
    try {
      const shows = await fetchJson(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(media.Title)}`,
        signal,
        fetcher,
      );
      const matchingShow = shows.find(
        (result) =>
          normalizeTitle(result.show?.name || "") ===
          normalizeTitle(media.Title),
      );
      const image = matchingShow?.show?.image;

      if (image?.original || image?.medium) {
        return image.original || image.medium;
      }
    } catch (error) {
      if (signal?.aborted) throw error;
      tvMazeError = error;
    }
  }

  try {
    return await getWikipediaPoster(media, signal, fetcher);
  } catch (error) {
    if (signal?.aborted) throw error;
    if (tvMazeError) {
      throw new Error(
        `TVMaze and Wikipedia poster lookups failed for ${media.Title}: ${tvMazeError.message}; ${error.message}`,
      );
    }
    throw error;
  }
}
