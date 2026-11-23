import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import App from "./App";

async function submitAddForm() {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Add to list" }));
  });
}

const originalFetch = global.fetch;

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.dataset.theme = "light";
  global.fetch = jest.fn(() => new Promise(() => {}));
});

afterEach(() => {
  if (originalFetch) {
    global.fetch = originalFetch;
  } else {
    delete global.fetch;
  }
});

test("search filters the movie list and updates the result count", () => {
  render(<App />);

  fireEvent.change(screen.getByRole("textbox", { name: /search movies/i }), {
    target: { value: "matrix" },
  });

  const movieList = document.querySelector(".list-movies");
  expect(within(movieList).getByText("The Matrix")).toBeInTheDocument();
  expect(within(movieList).queryByText("Inception")).not.toBeInTheDocument();
  expect(screen.getByRole("navigation").textContent).toContain("Found 1 movie");
});

test("a collapsed panel remains visible and can be reopened", () => {
  render(<App />);

  fireEvent.click(screen.getAllByRole("button", { name: "Collapse panel" })[0]);

  const expandButton = screen.getAllByRole("button", { name: "Expand panel" })[0];
  expect(expandButton).toHaveAttribute("aria-expanded", "false");
  expect(expandButton.closest(".box")).toHaveClass("box-collapsed");
  expect(screen.queryByText("The Matrix")).not.toBeInTheDocument();

  fireEvent.click(expandButton);

  expect(screen.getAllByRole("button", { name: "Collapse panel" })[0]).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  expect(screen.getByText("The Matrix")).toBeInTheDocument();
});

test("dark mode toggles the interface and is remembered after remount", () => {
  const { unmount } = render(<App />);

  fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
  expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  expect(window.localStorage.getItem("usepopcorn-theme")).toBe("dark");

  unmount();
  render(<App />);

  expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  expect(
    screen.getByRole("button", { name: "Switch to light mode" }),
  ).toBeInTheDocument();
});

test("the starting catalog contains more than the original three movies", () => {
  render(<App />);

  expect(screen.getByRole("navigation").textContent).toContain(
    "Found 30 movies",
  );

  fireEvent.change(screen.getByRole("textbox", { name: /search movies/i }), {
    target: { value: "titanic" },
  });
  expect(screen.getByText("Titanic")).toBeInTheDocument();
});

test("movies can be added to and removed from the watched list", () => {
  render(<App />);
  fireEvent.change(screen.getByRole("textbox", { name: /search movies/i }), {
    target: { value: "matrix" },
  });

  fireEvent.click(
    screen.getByRole("button", { name: "Add The Matrix to watched" }),
  );

  expect(screen.getByText("3 movies")).toBeInTheDocument();
  expect(
    screen.getByRole("button", {
      name: "Remove The Matrix from watched movies",
    }),
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", {
      name: "Remove The Matrix from watched movies",
    }),
  );

  expect(screen.getByText("2 movies")).toBeInTheDocument();
});

test("a movie missing from the catalog can be added with the plus control", async () => {
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: /add title/i }));
  fireEvent.change(screen.getByLabelText("Title"), {
    target: { value: "Arrival" },
  });
  fireEvent.change(screen.getByLabelText("Year"), {
    target: { value: "2016" },
  });
  fireEvent.change(screen.getByLabelText("IMDb rating"), {
    target: { value: "7.9" },
  });
  fireEvent.change(screen.getByLabelText("Runtime (minutes)"), {
    target: { value: "116" },
  });
  await submitAddForm();

  const movieList = document.querySelector(".list-movies");
  const arrivalRow = (await within(movieList).findByText("Arrival")).closest(
    "li",
  );
  expect(within(arrivalRow).getByText("7.9 IMDb")).toBeInTheDocument();
  expect(within(arrivalRow).getByText("116 min")).toBeInTheDocument();
});

test("user-added titles can be removed from the library", async () => {
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: /add title/i }));
  fireEvent.change(screen.getByLabelText("Title"), {
    target: { value: "Arrival" },
  });
  fireEvent.change(screen.getByLabelText("Year"), {
    target: { value: "2016" },
  });
  await submitAddForm();

  const removeButton = await screen.findByRole("button", {
    name: "Remove Arrival from library",
  });
  expect(window.localStorage.getItem("usepopcorn-library")).toContain(
    "Arrival",
  );
  fireEvent.click(removeButton);

  await waitFor(() => {
    expect(
      screen.queryByRole("button", { name: "Remove Arrival from library" }),
    ).not.toBeInTheDocument();
    expect(window.localStorage.getItem("usepopcorn-library")).not.toContain(
      "Arrival",
    );
  });
});

test("custom titles and personal ratings survive a page refresh", async () => {
  const { unmount } = render(<App />);

  fireEvent.click(screen.getByRole("button", { name: /add title/i }));
  fireEvent.change(screen.getByLabelText("Title"), {
    target: { value: "Arrival" },
  });
  fireEvent.change(screen.getByLabelText("Year"), {
    target: { value: "2016" },
  });
  fireEvent.change(screen.getByLabelText("IMDb rating"), {
    target: { value: "7.9" },
  });
  fireEvent.change(screen.getByLabelText("Runtime (minutes)"), {
    target: { value: "116" },
  });
  await submitAddForm();
  await screen.findByRole("button", { name: "Add Arrival to watched" });
  fireEvent.click(
    screen.getByRole("button", { name: "Add Arrival to watched" }),
  );
  const watchedList = document.querySelector(".list-watched");
  const watchedArrivalRow = within(watchedList)
    .getByText("Arrival")
    .closest("li");
  fireEvent.click(
    within(watchedArrivalRow).getByRole("button", {
      name: "3 out of 10 stars",
    }),
  );

  await waitFor(() => {
    expect(window.localStorage.getItem("usepopcorn-library")).toContain(
      '"userRating":3',
    );
  });
  expect(window.localStorage.getItem("usepopcorn-library")).toContain("Arrival");
  unmount();
  render(<App />);

  expect(screen.getAllByText("Arrival")).toHaveLength(2);
  expect(screen.getByText("3/10")).toBeInTheDocument();
});

test("the add title form adds to the selected series section", async () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Series" }));
  fireEvent.click(screen.getByRole("button", { name: /add title/i }));
  fireEvent.change(screen.getByLabelText("Title"), {
    target: { value: "The Bear" },
  });
  fireEvent.change(screen.getByLabelText("Year"), {
    target: { value: "2022" },
  });
  await submitAddForm();

  expect(await screen.findByText("The Bear")).toBeInTheDocument();
  expect(screen.getByRole("navigation").textContent).toContain(
    "Found 1 series",
  );
});

test("duplicate title and year are rejected", async () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /add title/i }));
  fireEvent.change(screen.getByLabelText("Title"), {
    target: { value: "Inception" },
  });
  fireEvent.change(screen.getByLabelText("Year"), {
    target: { value: "2010" },
  });
  await submitAddForm();

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "That title and year are already in your list.",
  );
});

test("movie results show IMDb ratings and runtimes", () => {
  render(<App />);
  fireEvent.change(screen.getByRole("textbox", { name: /search movies/i }), {
    target: { value: "matrix" },
  });

  const movieList = document.querySelector(".list-movies");
  expect(within(movieList).getByText("8.7 IMDb")).toBeInTheDocument();
  expect(within(movieList).getByText("136 min")).toBeInTheDocument();
});

test("a broken poster URL falls back to the local placeholder image", () => {
  render(<App />);
  fireEvent.change(screen.getByRole("textbox", { name: /search movies/i }), {
    target: { value: "matrix" },
  });

  const poster = screen.getByAltText("The Matrix poster");
  fireEvent.error(poster);

  expect(poster).toHaveAttribute("src", "/movie-placeholder.svg");
});

test("a personal rating can be added to a watched movie", () => {
  render(<App />);
  fireEvent.change(screen.getByRole("textbox", { name: /search movies/i }), {
    target: { value: "matrix" },
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Add The Matrix to watched" }),
  );

  const watchedList = document.querySelector(".list-watched");
  const matrixRow = within(watchedList).getByText("The Matrix").closest("li");
  fireEvent.click(
    within(matrixRow).getByRole("button", { name: "4 out of 10 stars" }),
  );

  expect(screen.getByText("4/10")).toBeInTheDocument();
  expect(screen.getByText("7.7 your rating")).toBeInTheDocument();
});

test("series have a separate section and can be added to their watched list", () => {
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: "Series" }));

  expect(screen.getByRole("navigation").textContent).toContain(
    "Found 20 series",
  );
  expect(screen.getByText("Breaking Bad")).toBeInTheDocument();
  expect(screen.queryByText("Inception")).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: "Add Breaking Bad to watched" }),
  );

  expect(screen.getByText("1 series")).toBeInTheDocument();
  const watchedList = document.querySelector(".list-watched");
  expect(within(watchedList).getByText("47 min/episode")).toBeInTheDocument();
});

test("series search shows a series-specific empty state", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Series" }));
  fireEvent.change(screen.getByRole("textbox", { name: /search movies/i }), {
    target: { value: "no matching title" },
  });

  expect(screen.getAllByRole("status")[0]).toHaveTextContent(
    "No series found. Try another title.",
  );
});

test("search displays an empty state when no titles match", () => {
  render(<App />);

  fireEvent.change(screen.getByRole("textbox", { name: /search movies/i }), {
    target: { value: "no matching title" },
  });

  expect(screen.getByRole("status")).toHaveTextContent(
    "No movies found. Try another title.",
  );
  expect(screen.getByRole("navigation").textContent).toContain(
    "Found 0 movies",
  );
});
