import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import api, { getErrorMessage } from "../lib/api";
import { GENRES, GENRE_LABELS } from "../lib/format";
import BookCard, { BookCardSkeleton } from "../components/BookCard";

const PAGE = 12;
const SORTS = [
  ["createdAt:desc", "Newest added"],
  ["title:asc", "Title A–Z"],
  ["author:asc", "Author A–Z"],
  ["publishedYear:asc", "Oldest first"],
  ["publishedYear:desc", "Newest first"],
];

export default function Books() {
  const [search, setSearch] = useSearchParams();
  const genre = search.get("genre") ?? "";
  const q = search.get("q") ?? "";
  const sort = search.get("sort") ?? "title:asc";
  const onlyAvailable = search.get("available") === "1";
  const page = Math.max(1, Number(search.get("page")) || 1);

  const [text, setText] = useState(q);
  const [data, setData] = useState({ books: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const set = (patch) => {
    const next = new URLSearchParams(search);
    Object.entries({ page: "", ...patch }).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setSearch(next, { replace: true });
  };

  // Search as you type, a moment after the last keystroke
  useEffect(() => {
    const t = setTimeout(() => text !== q && set({ q: text.trim() }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    const controller = new AbortController();
    const [sortBy, order] = sort.split(":");
    setLoading(true);
    api
      .get("/books", { params: { filter: genre || undefined, q: q || undefined, sortBy, sort: order, limit: PAGE, page, available: onlyAvailable ? "true" : undefined }, signal: controller.signal })
      .then((res) => {
        setError("");
        setData({ books: res.data.data, total: res.data.meta.total, pages: res.data.meta.pages });
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(err, "Could not load the books."));
        setLoading(false);
      });
    return () => controller.abort();
  }, [genre, q, sort, onlyAvailable, page]);

  return (
    <div className="frame pb-20 pt-10">
      <p className="eyeline">The catalogue</p>
      <h1 className="display mt-4 text-[clamp(38px,5vw,64px)]">
        Find your next <span className="accent">read</span>
      </h1>

      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Search books</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
          <input type="search" value={text} onChange={(e) => setText(e.target.value)} placeholder="Search by title, author or ISBN" className="input pl-11" />
        </label>
        <select aria-label="Sort books" value={sort} onChange={(e) => set({ sort: e.target.value })} className="input lg:w-52">
          {SORTS.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 px-1 text-sm font-semibold">
          <input type="checkbox" checked={onlyAvailable} onChange={(e) => set({ available: e.target.checked ? "1" : "" })} className="h-4 w-4 accent-[var(--brand)]" />
          Available now
        </label>
      </div>

      <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Genres">
        {[["", "All"], ...GENRES.map((g) => [g, GENRE_LABELS[g]])].map(([value, label]) => (
          <button
            key={value || "all"}
            type="button"
            onClick={() => set({ genre: value })}
            aria-pressed={genre === value}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${genre === value ? "bg-brand text-on-brand" : "border border-line text-muted hover:text-ink"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {error ? (
        <p role="alert" className="card mt-8 p-8 text-center text-danger">{error}</p>
      ) : loading ? (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 lg:grid-cols-4" role="status" aria-label="Loading books">
          {Array.from({ length: 8 }, (_, i) => <BookCardSkeleton key={i} />)}
        </div>
      ) : data.books.length === 0 ? (
        <div className="card mt-8 p-10 text-center">
          <p className="text-lg font-bold">No books match</p>
          <p className="mt-1 text-muted">Try another word, or clear the genre filter.</p>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted">{data.total} {data.total === 1 ? "book" : "books"}</p>
          <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
            {data.books.map((b) => <BookCard key={b._id} book={b} />)}
          </div>
          {data.pages > 1 && (
            <nav aria-label="Pages" className="mt-12 flex items-center justify-center gap-3">
              <button type="button" disabled={page <= 1} onClick={() => set({ page: String(page - 1) })} className="btn btn-ghost btn-sm">Previous</button>
              <span className="text-sm text-muted">Page {page} of {data.pages}</span>
              <button type="button" disabled={page >= data.pages} onClick={() => set({ page: String(page + 1) })} className="btn btn-ghost btn-sm">Next</button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
