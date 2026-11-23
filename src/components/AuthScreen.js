import { useState } from "react";

export function AuthScreen({ supabase, onUseLocalMode }) {
  const [mode, setMode] = useState("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const { data, error: authError } =
        mode === "sign-in"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (authError) throw authError;
      if (mode === "sign-up" && !data.session) {
        setMessage("Check your email to confirm your account, then sign in.");
      }
    } catch (authError) {
      setError(authError.message || "Could not authenticate. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="auth-eyebrow">WatchedShelf / your watchlist</p>
        <h1>{mode === "sign-in" ? "Welcome back." : "Create your account."}</h1>
        <p className="auth-description">
          Your movies, shows, and ratings stay with your account on every device.
        </p>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete={
              mode === "sign-in" ? "current-password" : "new-password"
            }
            minLength="6"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        {message && <p className="auth-message" role="status">{message}</p>}
        <button className="btn-add auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Please wait..."
            : mode === "sign-in"
              ? "Sign in"
              : "Create account"}
        </button>
        <button
          className="auth-switch"
          type="button"
          onClick={() => {
            setMode((currentMode) =>
              currentMode === "sign-in" ? "sign-up" : "sign-in",
            );
            setError("");
            setMessage("");
          }}
        >
          {mode === "sign-in"
            ? "New here? Create an account"
            : "Already have an account? Sign in"}
        </button>
        {onUseLocalMode && (
          <button className="auth-local" type="button" onClick={onUseLocalMode}>
            Continue in this browser only
          </button>
        )}
      </form>
    </main>
  );
}
