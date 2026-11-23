# WatchedShelf

A React movie and series watchlist. Browse and search the included catalogs, add
custom titles, mark titles as watched, rate them, and switch between light and
dark themes.

## What to do next

1. **Run it locally** using the setup steps below and try the main features.
2. **Choose how you want to save data.**
   - Without Supabase, your list is saved in this browser only. It survives
     refreshes but is not shared with another browser or device.
   - To sync each person's list across devices, set up Supabase by following
     [Enable account sync](#enable-account-sync).
3. **Run the checks** before sharing or deploying the app.
4. **Deploy the production build** to a static web host and set the same
   Supabase environment variables in the host if using account sync.

> **Important:** Local browser data and Supabase account data are separate.
> Switching to account sync does not automatically transfer titles from
> `localStorage` into an account. Keep the original browser data until you have
> confirmed the account has the titles you need.

## Run locally

Install [Node.js](https://nodejs.org/) and npm, then open a terminal in this
project directory:

```bash
npm install
npm start
```

The app opens at [http://localhost:3000](http://localhost:3000). Without
Supabase configuration, it runs in local-only mode and displays a
“Saved on this browser” indicator.

## Enable account sync

Supabase provides sign-up/sign-in and a private media table for each account.
Set it up before relying on cloud storage:

1. Create a project at [Supabase](https://supabase.com/).
2. In the project's SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql)
   once. The table uses row-level security so authenticated users can only
   access their own rows.
3. Copy [`.env.example`](./.env.example) to `.env` in the project root.
4. Replace the example values with the project's **Project URL** and
   **anon/publishable key**:

   ```env
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. Restart `npm start`, create an account in the app, and verify that adding a
   custom title, marking it watched, changing its rating, and removing it all
   persist after signing out and back in.
6. For production, add these environment variables in your hosting provider
   and configure the app's public site URL and allowed redirect URLs in
   Supabase's authentication settings.

Only the anon/publishable key belongs in this browser app. **Never use or expose
the Supabase service-role key.** Treat `.env` as private and do not commit it.

## Features

- Search a catalog of movies and series with separate category tabs.
- Add custom movies or series, including year, IMDb rating, runtime, and an
  optional poster URL.
- Add catalog or custom titles to the watched list, give personal ratings, and
  remove titles from the watched list.
- Remove custom titles from the library; catalog entries themselves are not
  deleted.
- Light/dark theme preference saved in the current browser.
- Responsive interface, poster fallbacks, and reduced-motion-aware animations.
- Local browser storage by default, or per-account Supabase storage when
  configured.

## Checks

Run the test suite:

```bash
npm test -- --watchAll=false --runInBand
```

Create and verify a production build:

```bash
npm run build
```

## Project map

- [`src/App.js`](./src/App.js) — app state, catalog filtering, and local/cloud
  library operations.
- [`src/components/`](./src/components) — navigation, lists, forms, and other
  UI components.
- [`src/data/`](./src/data) — bundled movie and series catalogs.
- [`src/lib/`](./src/lib) — Supabase client and library storage conversions.
- [`src/utils/posters.js`](./src/utils/posters.js) — poster lookup and fallback
  behavior.
- [`supabase/schema.sql`](./supabase/schema.sql) — database table and security
  policies for account sync.

## Troubleshooting

- **It says “Saved on this browser”:** Supabase is not configured. This list
  will not sync to another device.
- **Sign-in or saving fails:** Check the Supabase URL/key, confirm the SQL
  schema was applied, and review the browser console and Supabase logs.
- **Changes to `.env` have no effect:** Restart the development server after
  editing environment variables.
- **A poster is missing:** Some external poster sources may not have an image;
  the app uses a local placeholder as a fallback.
