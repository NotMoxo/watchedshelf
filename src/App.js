import { useEffect, useState } from "react";
import { NavBar } from "./components/NavBar";
import { Main } from "./components/Main";
import { Box } from "./components/Box";
import { MovieList } from "./components/MovieList";
import { WatchedSummary } from "./components/WatchedSummary";
import { WatchedMoviesList } from "./components/WatchedMoviesList";
import { AddMediaForm } from "./components/AddMediaForm";
import { AuthScreen } from "./components/AuthScreen";
import { movieCatalog } from "./data/movies";
import { seriesCatalog } from "./data/series";
import { fetchMediaPoster, PLACEHOLDER_POSTER } from "./utils/posters";
import { supabase, supabaseConfigured } from "./lib/supabase";
import {
  fromLibraryRecord,
  readLocalLibrary,
  toLibraryRecord,
  writeLocalLibrary,
} from "./lib/library";

const mediaCatalog = [...movieCatalog, ...seriesCatalog];
const themeStorageKey = "usepopcorn-theme";

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
    type: "movie",
    isWatched: true,
    isCustom: false,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
    type: "movie",
    isWatched: true,
    isCustom: false,
  },
];

function getInitialTheme() {
  const savedTheme = window.localStorage.getItem(themeStorageKey);
  return savedTheme === "dark" ? "dark" : "light";
}

function getLocalLibrary() {
  try {
    return readLocalLibrary(tempWatchedData);
  } catch (error) {
    console.error("Could not read the local watchlist.", error);
    return [];
  }
}

export default function App() {
  const [library, setLibrary] = useState(
    () => (supabaseConfigured ? [] : getLocalLibrary()),
  );
  const [posterOverrides, setPosterOverrides] = useState({});
  const [category, setCategory] = useState("movie");
  const [query, setQuery] = useState("");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [user, setUser] = useState(null);
  const [localMode, setLocalMode] = useState(!supabaseConfigured);
  const [authReady, setAuthReady] = useState(!supabaseConfigured);
  const [isLibraryReady, setIsLibraryReady] = useState(!supabaseConfigured);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  useEffect(() => {
    if (!supabaseConfigured || localMode) return undefined;

    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user || null);
    });

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) throw error;
        if (active) {
          setUser(data.session?.user || null);
          setAuthReady(true);
        }
      })
      .catch((error) => {
        if (active) {
          setStorageError(`Could not check your account: ${error.message}`);
          setAuthReady(true);
        }
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [localMode]);

  useEffect(() => {
    if (!authReady) return undefined;
    if (supabaseConfigured && !localMode && !user) {
      setLibrary([]);
      setIsLibraryReady(true);
      return undefined;
    }

    let active = true;
    setIsLibraryReady(false);
    setStorageError("");

    async function loadLibrary() {
      try {
        if (supabaseConfigured && !localMode) {
          const { data, error } = await supabase
            .from("user_media")
            .select("*")
            .eq("user_id", user.id);
          if (error) throw error;
          if (active) setLibrary(data.map(fromLibraryRecord));
        } else if (active) {
          setLibrary(getLocalLibrary());
        }
      } catch (error) {
        if (active) {
          setStorageError(`Could not load your saved list: ${error.message}`);
        }
      } finally {
        if (active) setIsLibraryReady(true);
      }
    }

    loadLibrary();
    return () => {
      active = false;
    };
  }, [authReady, localMode, user]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPosters() {
      const posters = new Map();
      const errors = [];
      let nextIndex = 0;

      async function loadNextPoster() {
        while (nextIndex < mediaCatalog.length && !controller.signal.aborted) {
          const index = nextIndex++;
          const media = mediaCatalog[index];

          try {
            const poster = await fetchMediaPoster(media, controller.signal);
            if (poster) posters.set(media.imdbID, poster);
          } catch (error) {
            if (!controller.signal.aborted) errors.push({ media, error });
          }
        }
      }

      await Promise.all(Array.from({ length: 4 }, () => loadNextPoster()));
      if (controller.signal.aborted) return;

      errors.forEach(({ media, error }) => {
        console.error(`Could not load a poster for ${media.Title}.`, error);
      });

      setPosterOverrides(Object.fromEntries(posters));
    }

    loadPosters();
    return () => controller.abort();
  }, []);

  const customMedia = library
    .filter((media) => media.isCustom)
    .map((media) => ({
      ...media,
      Poster: posterOverrides[media.imdbID] || media.Poster,
    }));
  const movies = [
    ...customMedia,
    ...mediaCatalog
      .filter(
        (media) => !customMedia.some((custom) => custom.imdbID === media.imdbID),
      )
      .map((media) => ({
        ...media,
        Poster: posterOverrides[media.imdbID] || media.Poster,
      })),
  ];
  const watched = library
    .filter((media) => media.isWatched)
    .map((media) => ({
      ...media,
      Poster: posterOverrides[media.imdbID] || media.Poster,
    }));
  const filteredMovies = movies.filter(
    (movie) =>
      movie.type === category &&
      movie.Title.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const categoryWatched = watched.filter((movie) => movie.type === category);

  async function saveLibraryMedia(media, changes = {}) {
    const updatedMedia = { ...media, ...changes };

    if (supabaseConfigured && !localMode) {
      const { data, error } = await supabase
        .from("user_media")
        .upsert(toLibraryRecord(updatedMedia, user.id), {
          onConflict: "user_id,imdb_id",
        })
        .select()
        .single();
      if (error) throw error;
      const savedMedia = fromLibraryRecord(data);
      setLibrary((currentLibrary) => [
        ...currentLibrary.filter((item) => item.imdbID !== savedMedia.imdbID),
        savedMedia,
      ]);
      return savedMedia;
    }

    const savedMedia = {
      ...updatedMedia,
      isCustom: Boolean(updatedMedia.isCustom),
    };
    const nextLibrary = [
      ...library.filter((item) => item.imdbID !== savedMedia.imdbID),
      savedMedia,
    ];
    writeLocalLibrary(nextLibrary);
    setLibrary(nextLibrary);
    return savedMedia;
  }

  async function handleAddMedia(media) {
    const alreadyExists = movies.some(
      (movie) =>
        movie.type === media.type &&
        movie.Title.toLowerCase() === media.Title.toLowerCase() &&
        movie.Year === media.Year,
    );
    if (alreadyExists) return false;

    try {
      const savedMedia = await saveLibraryMedia({ ...media, isCustom: true }, {
        isWatched: false,
      });
      if (!savedMedia.Poster || savedMedia.Poster === PLACEHOLDER_POSTER) {
        fetchMediaPoster(savedMedia)
          .then((poster) => {
            if (poster) {
              setPosterOverrides((current) => ({
                ...current,
                [savedMedia.imdbID]: poster,
              }));
              return saveLibraryMedia(savedMedia, { Poster: poster });
            }
            return undefined;
          })
          .catch((error) => {
            console.error(`Could not load a poster for ${savedMedia.Title}.`, error);
          });
      }
    } catch (error) {
      setStorageError(`Could not save this title: ${error.message}`);
      return false;
    }
    setQuery(media.Title);
    return true;
  }

  async function handleAddWatched(movie) {
    if (watched.some((watchedMovie) => watchedMovie.imdbID === movie.imdbID)) {
      return;
    }

    try {
      await saveLibraryMedia(movie, {
        isWatched: true,
        isCustom: Boolean(movie.isCustom),
        userRating: movie.userRating || null,
      });
    } catch (error) {
      setStorageError(`Could not add this title to your list: ${error.message}`);
    }
  }

  async function handleSetUserRating(imdbID, userRating) {
    const media = library.find((item) => item.imdbID === imdbID);
    if (!media) return;
    try {
      await saveLibraryMedia(media, { userRating });
    } catch (error) {
      setStorageError(`Could not save your rating: ${error.message}`);
    }
  }

  async function handleDeleteWatched(imdbID) {
    const media = library.find((item) => item.imdbID === imdbID);
    if (!media) return;
    try {
      await saveLibraryMedia(media, { isWatched: false });
    } catch (error) {
      setStorageError(`Could not remove this title from your list: ${error.message}`);
    }
  }

  async function handleRemoveCustomMedia(imdbID) {
    const media = library.find(
      (item) => item.imdbID === imdbID && item.isCustom,
    );
    if (!media) return;

    try {
      if (supabaseConfigured && !localMode) {
        const { error } = await supabase
          .from("user_media")
          .delete()
          .eq("user_id", user.id)
          .eq("imdb_id", imdbID);
        if (error) throw error;
        setLibrary((currentLibrary) =>
          currentLibrary.filter((item) => item.imdbID !== imdbID),
        );
      } else {
        const nextLibrary = library.filter((item) => item.imdbID !== imdbID);
        writeLocalLibrary(nextLibrary);
        setLibrary(nextLibrary);
      }
    } catch (error) {
      setStorageError(`Could not remove this title: ${error.message}`);
    }
  }

  if (supabaseConfigured && !localMode && !authReady) {
    return <p className="auth-loading">Checking your account...</p>;
  }

  if (supabaseConfigured && !localMode && !user) {
    return (
      <>
        {storageError && <p className="auth-error" role="alert">{storageError}</p>}
        <AuthScreen
          supabase={supabase}
          onUseLocalMode={() => {
            setLocalMode(true);
            setLibrary(getLocalLibrary());
            setStorageError("");
          }}
        />
      </>
    );
  }

  return (
    <>
      <NavBar
        movieCount={filteredMovies.length}
        category={category}
        onCategoryChange={(nextCategory) => {
          setCategory(nextCategory);
          setQuery("");
        }}
        onOpenAdd={() => setIsAddFormOpen(true)}
        theme={theme}
        onToggleTheme={() =>
          setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark")
        }
        supabaseConfigured={supabaseConfigured}
        userEmail={localMode ? null : user?.email}
        localMode={localMode}
        onSignOut={async () => {
          const { error } = await supabase.auth.signOut();
          if (error) setStorageError(`Could not sign out: ${error.message}`);
        }}
        onSignIn={() => {
          setLocalMode(false);
          setAuthReady(false);
        }}
        query={query}
        onQueryChange={setQuery}
      />
      <Main>
        {storageError && <p className="storage-error" role="alert">{storageError}</p>}
        <Box>
          {isAddFormOpen && (
            <AddMediaForm
              category={category}
              onAdd={handleAddMedia}
              onCancel={() => setIsAddFormOpen(false)}
            />
          )}
          {!isLibraryReady ? (
            <p className="empty-state" role="status">Loading your saved list...</p>
          ) : (
            <MovieList
              movies={filteredMovies}
              watched={watched}
              onAddWatched={handleAddWatched}
              onRemoveCustom={handleRemoveCustomMedia}
              category={category}
            />
          )}
        </Box>
        <Box>
          <WatchedSummary watched={categoryWatched} category={category} />
          <WatchedMoviesList
            watched={categoryWatched}
            onDeleteWatched={handleDeleteWatched}
            onSetUserRating={handleSetUserRating}
            category={category}
          />
        </Box>
      </Main>
    </>
  );
}
