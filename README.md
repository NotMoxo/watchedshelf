# WatchedShelf 🎬

A simple, responsive movie and series watchlist built with **React**. WatchedShelf lets you browse a bundled catalog of movies and series, search titles, add your own entries, and keep track of what you've watched with your own ratings.

## Features

- **Movie & Series Catalog** – Browse 26 movies and 20 series with search and separate category tabs.
- **Watched List** – Mark titles as watched, give them a personal rating, and see a summary of your watched list.
- **Custom Titles** – Add your own movies or series with year, IMDb rating, runtime, and an optional poster URL.
- **Library Management** – Remove titles from your watched list or delete custom entries from your library.
- **Poster Fallbacks** – Poster images are fetched automatically, with a local placeholder when one isn't available.
- **Light & Dark Theme** – Theme preference is saved in the browser.
- **Local Persistence** – Your watchlist is saved with the browser's `localStorage` and survives refreshes.
- **Responsive Design** – Layout adapts to different screen sizes, with reduced-motion-aware animations.

## Built With

- **React 19** – UI and application state (Create React App / react-scripts).
- **JavaScript & CSS** – Component logic and styling.
- **localStorage** – Local watchlist persistence.

## Getting Started

You'll need [Node.js](https://nodejs.org/) and npm installed.

1. Clone the repository:

   ```bash
   git clone https://github.com/NotMoxo/watchedshelf.git
   ```

2. Navigate to the project directory:

   ```bash
   cd watchedshelf
   ```

3. Install dependencies and start the development server:

   ```bash
   npm install
   npm start
   ```

4. The app opens at [http://localhost:3000](http://localhost:3000).

Run the test suite with `npm test`, or create a production build with `npm run build`.

## Project Structure

```text
watchedshelf/
├── public/
├── src/
│   ├── components/   # Navigation, lists, forms, and other UI components
│   ├── data/         # Bundled movie and series catalogs
│   ├── lib/          # Local storage and optional Supabase client
│   ├── utils/        # Poster lookup and fallback behavior
│   └── App.js        # App state, catalog filtering, and library operations
└── package.json
```

## Current Limitations

WatchedShelf is currently a **front-end project**.

- The watchlist is saved in the current browser only and does not sync across browsers or devices.
- The code includes optional Supabase wiring, but no Supabase project is set up, so account sign-in and cloud sync are not active.
- The movie and series catalog is bundled with the app rather than fetched from a live API.

## Future Improvements

- Set up a backend and database so lists sync across devices.
- Add user accounts with per-account watchlists.
- Fetch live movie and series data from an external API.
- Expand the bundled catalog and improve filtering options.

## Author

**Mahmoud Mosad**

- GitHub: [@NotMoxo](https://github.com/NotMoxo)
- Repository: [WatchedShelf](https://github.com/NotMoxo/watchedshelf)

---

*Built as a personal web development project to practice React and front-end application logic.*
