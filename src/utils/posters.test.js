import { fetchMediaPoster } from "./posters";

function jsonResponse(data, ok = true) {
  return {
    ok,
    json: async () => data,
  };
}

test("series use artwork from an exact TVMaze title match", async () => {
  const fetcher = jest.fn().mockResolvedValue(
    jsonResponse([
      {
        show: {
          name: "Breaking Bad: Minisodes",
          image: { original: "https://images.example/minisodes.jpg" },
        },
      },
      {
        show: {
          name: "Breaking Bad",
          image: { original: "https://images.example/breaking-bad.jpg" },
        },
      },
    ]),
  );

  await expect(
    fetchMediaPoster({ Title: "Breaking Bad", type: "series" }, undefined, fetcher),
  ).resolves.toBe("https://images.example/breaking-bad.jpg");
  expect(fetcher).toHaveBeenCalledTimes(1);
});

test("series fall back to a portrait Wikipedia thumbnail when no exact TVMaze match exists", async () => {
  const fetcher = jest
    .fn()
    .mockResolvedValueOnce(jsonResponse([]))
    .mockResolvedValueOnce(
      jsonResponse({
        thumbnail: {
          source: "https://images.example/fallback.jpg",
          width: 200,
          height: 300,
        },
      }),
    );

  await expect(
    fetchMediaPoster({ Title: "Unknown Show", type: "series" }, undefined, fetcher),
  ).resolves.toBe("https://images.example/fallback.jpg");
  expect(fetcher).toHaveBeenCalledTimes(2);
});

test("movies reject landscape thumbnails instead of showing unrelated imagery", async () => {
  const fetcher = jest.fn().mockResolvedValue(
    jsonResponse({
      thumbnail: {
        source: "https://images.example/landscape.jpg",
        width: 640,
        height: 360,
      },
    }),
  );

  await expect(
    fetchMediaPoster({ Title: "Example Movie", type: "movie" }, undefined, fetcher),
  ).resolves.toBeUndefined();
});

test("movies use the configured disambiguated poster page", async () => {
  const fetcher = jest.fn().mockResolvedValue(
    jsonResponse({
      thumbnail: {
        source: "https://images.example/interstellar-poster.jpg",
        width: 220,
        height: 326,
      },
    }),
  );

  await expect(
    fetchMediaPoster(
      {
        Title: "Interstellar",
        posterPage: "Interstellar (film)",
        type: "movie",
      },
      undefined,
      fetcher,
    ),
  ).resolves.toBe("https://images.example/interstellar-poster.jpg");
  expect(fetcher.mock.calls[0][0]).toContain("Interstellar%20(film)");
});

test("poster lookup errors are surfaced when the image service is unavailable", async () => {
  const fetcher = jest.fn().mockResolvedValue(jsonResponse({}, false));

  await expect(
    fetchMediaPoster({ Title: "Example Movie", type: "movie" }, undefined, fetcher),
  ).rejects.toThrow("Poster lookup failed with status");
});
