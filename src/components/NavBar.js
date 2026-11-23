import { useState } from "react";
import { Search } from "./Search";
import { NumResults } from "./NumResults";

export function Logo() {
  return (
    <div className="logo">
      <span role="img" aria-label="popcorn">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

export function NavBar({ movieCount }) {
  const [query, setQuery] = useState("");

  return (
    <nav className="nav-bar">
      <Logo />
      <Search query={query} onQueryChange={setQuery} />
      <NumResults count={movieCount} />
    </nav>
  );
}
