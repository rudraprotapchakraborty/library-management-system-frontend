import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookPlus, Pencil, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../../lib/api";
import { GENRE_LABELS } from "../../lib/format";
import ConfirmDialog from "../../components/ConfirmDialog";
import { Cover } from "../../components/BookCard";
import { PageTitle } from "./DashboardLayout";

const PAGE = 15;

export default function AdminBooks() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api
      .get("/books", { params: { q: q || undefined, limit: PAGE, page, sortBy: "title", sort: "asc" } })
      .then((r) => { setError(""); setData({ books: r.data.data, ...r.data.meta }); })
      .catch((e) => setError(getErrorMessage(e, "Could not load the books.")));
  }, [q, page]);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  const remove = async () => {
    setBusy(true);
    try {
      await api.delete(`/books/${removing._id}`);
      toast.success("Book deleted");
      setRemoving(null);
      load();
    } catch (e) {
      toast.error(getErrorMessage(e, "Could not delete the book."));
      setRemoving(null);
    }
    setBusy(false);
  };

  return (
    <>
      <PageTitle title="Manage" accent="books">
        <div className="flex flex-wrap gap-3">
          <label className="relative block">
            <span className="sr-only">Search books</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search books" className="input w-56 pl-10" />
          </label>
          <Link to="/dashboard/admin/books/new" className="btn btn-primary btn-sm"><BookPlus className="h-4 w-4" /> Add a book</Link>
        </div>
      </PageTitle>

      {error ? (
        <p role="alert" className="card p-8 text-center text-danger">{error}</p>
      ) : !data ? (
        <div className="space-y-3" role="status" aria-label="Loading books">{[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-[88px]" />)}</div>
      ) : data.books.length === 0 ? (
        <p className="card p-8 text-center text-muted">No books match your search.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {data.books.map((b) => (
              <li key={b._id} className="card flex items-center gap-4 p-3 sm:p-4">
                <div className="h-[72px] w-[52px] shrink-0 overflow-hidden rounded-lg border border-line"><Cover book={b} /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{b.title}</p>
                  <p className="truncate text-sm text-muted">{b.author} · {GENRE_LABELS[b.genre]}</p>
                  <p className="truncate font-mono text-xs text-muted">{b.isbn}</p>
                </div>
                <span className={`chip hidden sm:inline-flex ${b.available ? "bg-brand-soft text-brand" : "bg-[var(--danger-soft)] text-danger"}`}>{b.available ? `${b.copies} in` : "None left"}</span>
                <div className="flex shrink-0 gap-2">
                  <Link to={`/dashboard/admin/books/${b._id}/edit`} aria-label={`Edit ${b.title}`} className="btn btn-ghost btn-sm"><Pencil className="h-3.5 w-3.5" /></Link>
                  <button type="button" onClick={() => setRemoving(b)} aria-label={`Delete ${b.title}`} className="btn btn-ghost btn-sm text-danger"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </li>
            ))}
          </ul>
          {data.pages > 1 && (
            <nav aria-label="Pages" className="mt-8 flex items-center justify-center gap-3">
              <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn btn-ghost btn-sm">Previous</button>
              <span className="text-sm text-muted">Page {page} of {data.pages}</span>
              <button type="button" disabled={page >= data.pages} onClick={() => setPage(page + 1)} className="btn btn-ghost btn-sm">Next</button>
            </nav>
          )}
        </>
      )}

      {removing && (
        <ConfirmDialog title="Delete this book?" message={`"${removing.title}" will be removed from the catalogue. This cannot be undone.`} busy={busy} onConfirm={remove} onCancel={() => setRemoving(null)} />
      )}
    </>
  );
}
