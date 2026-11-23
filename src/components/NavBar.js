import { Search } from "./Search";
import { NumResults } from "./NumResults";

export function Logo() {
  return (
    <div className="logo">
      <span role="img" aria-label="camera">📷</span>
      <h1>WatchedShelf</h1>
    </div>
  );
}

export function NavBar({
  movieCount,
  category,
  onCategoryChange,
  onOpenAdd,
  theme,
  onToggleTheme,
  supabaseConfigured,
  userEmail,
  localMode,
  onSignOut,
  onSignIn,
  query,
  onQueryChange,
}) {
  return (
    <nav className="nav-bar" aria-label="Main navigation">
      <Logo />
      <div className="media-tabs" role="group" aria-label="Browse by type">
        <button
          type="button"
          className={category === "movie" ? "media-tab active" : "media-tab"}
          aria-pressed={category === "movie"}
          onClick={() => onCategoryChange("movie")}
        >
          Movies
        </button>
        <button
          type="button"
          className={category === "series" ? "media-tab active" : "media-tab"}
          aria-pressed={category === "series"}
          onClick={() => onCategoryChange("series")}
        >
          Series
        </button>
      </div>
      <Search query={query} onQueryChange={onQueryChange} />
      <button className="btn-add-title" type="button" onClick={onOpenAdd}>
        <span aria-hidden="true">+</span> Add title
      </button>
      <button
        className="btn-theme"
        type="button"
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        aria-pressed={theme === "dark"}
      >
        <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
        {theme === "dark" ? "Light" : "Dark"}
      </button>
      {userEmail ? (
        <button className="account-button" type="button" onClick={onSignOut}>
          <span>{userEmail}</span> Sign out
        </button>
      ) : localMode && supabaseConfigured ? (
        <button className="account-button" type="button" onClick={onSignIn}>
          Local only · Sign in to sync
        </button>
      ) : localMode ? (
        <span
          className="local-mode-badge"
          title="Saved in this browser only. Configure Supabase to sync between devices."
        >
          Saved on this browser
        </span>
      ) : null}
      <NumResults
        count={movieCount}
        label={category === "movie" ? "movies" : "series"}
        singularLabel={category === "movie" ? "movie" : "series"}
      />
    </nav>
  );
}
