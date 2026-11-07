import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { GENRE_LABELS } from "../lib/format";
import { AvailabilityChip, Cover } from "../components/BookCard";
import NotFound from "./NotFound";

const isoDay = (days) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [book, setBook] = useState(null);
  const [missing, setMissing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [dueDate, setDueDate] = useState(isoDay(14));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/books/${id}`)
      .then((res) => setBook(res.data.data))
      .catch((err) => (err.response?.status === 404 || err.response?.status === 400 ? setMissing(true) : setError(getErrorMessage(err))));
  }, [id]);

  if (missing) return <NotFound />;
  if (error) return <p role="alert" className="frame py-16 text-danger">{error}</p>;
  if (!book) {
    return (
      <div className="frame grid gap-10 py-12 md:grid-cols-[320px_1fr]" role="status" aria-label="Loading book">
        <div className="skeleton aspect-[3/4]" />
        <div className="grid content-start gap-4"><div className="skeleton h-10 w-3/4" /><div className="skeleton h-5 w-1/3" /><div className="skeleton h-40" /></div>
      </div>
    );
  }

  const borrow = async (e) => {
    e.preventDefault();
    if (!user) return navigate(`/login?from=${encodeURIComponent(location.pathname)}`);
    setBusy(true);
    setError("");
    try {
      await api.post("/borrow", { book: book._id, quantity: Number(quantity), dueDate: new Date(`${dueDate}T23:59:00`).toISOString() });
      toast.success(`"${book.title}" is yours until ${dueDate}`);
      navigate("/dashboard/loans");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not borrow this book."));
      setBusy(false);
    }
  };

  return (
    <div className="frame pb-20 pt-8">
      <Link to="/books" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> All books
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-16">
        <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-3xl border border-line bg-surface shadow-[var(--shadow)] aspect-[3/4]">
          <Cover book={book} />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyeline">{GENRE_LABELS[book.genre]}</span>
            <AvailabilityChip book={book} />
          </div>
          <h1 className="display mt-4 text-[clamp(32px,4.4vw,56px)]">{book.title}</h1>
          <p className="mt-2 text-lg text-muted">
            by <span className="font-semibold text-ink">{book.author}</span>
            {book.publishedYear ? <> · {book.publishedYear < 0 ? `${-book.publishedYear} BC` : book.publishedYear}</> : null}
          </p>
          <p className="mt-1 font-mono text-xs text-muted">ISBN {book.isbn}</p>

          {book.description && <div className="mt-6 max-w-2xl space-y-4 leading-relaxed text-ink/90">{book.description.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}</div>}

          <form onSubmit={borrow} className="card mt-9 max-w-xl p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold"><BookOpen className="h-5 w-5 text-brand" /> Borrow this book</h2>
            {book.available ? (
              <>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-semibold">
                    Copies (up to {Math.min(book.copies, 20)})
                    <input type="number" min={1} max={Math.min(book.copies, 20)} value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="input" />
                  </label>
                  <label className="grid gap-1.5 text-sm font-semibold">
                    Due date
                    <input type="date" min={isoDay(1)} value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="input" />
                  </label>
                </div>
                <button type="submit" disabled={busy} className="btn btn-primary mt-5 w-full">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {user ? "Borrow" : "Log in to borrow"}
                </button>
              </>
            ) : (
              <p className="mt-3 text-sm text-muted">Every copy is on loan right now. Check back soon.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
