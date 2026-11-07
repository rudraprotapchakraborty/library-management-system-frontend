import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../../lib/api";
import { GENRES, GENRE_LABELS } from "../../lib/format";
import { PageTitle } from "./DashboardLayout";

const EMPTY = { title: "", author: "", genre: "FICTION", isbn: "", description: "", coverImageUrl: "", publishedYear: "", copies: 1 };

/** Add a book, or edit one when the address has an id. */
export default function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    api
      .get(`/books/${id}`)
      .then((r) => {
        const b = r.data.data;
        setForm({ ...EMPTY, ...b, publishedYear: b.publishedYear ?? "", description: b.description ?? "", coverImageUrl: b.coverImageUrl ?? "" });
        setLoading(false);
      })
      .catch((e) => { setError(getErrorMessage(e, "Could not load the book.")); setLoading(false); });
  }, [id]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const body = {
      title: form.title,
      author: form.author,
      genre: form.genre,
      isbn: form.isbn,
      description: form.description,
      coverImageUrl: form.coverImageUrl,
      copies: Number(form.copies),
      ...(form.publishedYear !== "" ? { publishedYear: Number(form.publishedYear) } : {}),
    };
    try {
      await (id ? api.put(`/books/${id}`, body) : api.post("/books", body));
      toast.success(id ? "Book updated" : "Book added");
      navigate("/dashboard/admin/books");
    } catch (err) {
      setError(getErrorMessage(err, "Could not save the book."));
      setSaving(false);
    }
  };

  if (loading) return <div className="skeleton h-96" role="status" aria-label="Loading book" />;

  const field = "grid gap-1.5 text-sm font-semibold";
  return (
    <>
      <PageTitle title={id ? "Edit" : "Add a"} accent="book" />
      <form onSubmit={submit} className="card grid max-w-3xl gap-5 p-6 sm:p-8">
        {error && <p role="alert" className="rounded-xl border border-danger/30 bg-[var(--danger-soft)] p-3.5 text-sm text-danger">{error}</p>}
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={field}>Title<input className="input" required maxLength={200} value={form.title} onChange={set("title")} /></label>
          <label className={field}>Author<input className="input" required maxLength={120} value={form.author} onChange={set("author")} /></label>
          <label className={field}>Genre
            <select className="input" value={form.genre} onChange={set("genre")}>{GENRES.map((g) => <option key={g} value={g}>{GENRE_LABELS[g]}</option>)}</select>
          </label>
          <label className={field}>ISBN<input className="input" required minLength={5} maxLength={30} value={form.isbn} onChange={set("isbn")} /></label>
          <label className={field}>Copies<input className="input" type="number" required min={0} value={form.copies} onChange={set("copies")} /></label>
          <label className={field}>Published year<input className="input" type="number" value={form.publishedYear} onChange={set("publishedYear")} placeholder="Optional" /></label>
        </div>
        <label className={field}>Cover image address<input className="input" type="url" value={form.coverImageUrl} onChange={set("coverImageUrl")} placeholder="https://… (optional)" /></label>
        <label className={field}>Description<textarea className="input min-h-32" maxLength={4000} value={form.description} onChange={set("description")} /></label>
        <p className="text-xs text-muted">A book with no copies left is marked unavailable automatically.</p>
        <div className="flex flex-wrap justify-end gap-3">
          <Link to="/dashboard/admin/books" className="btn btn-ghost">Cancel</Link>
          <button type="submit" disabled={saving} className="btn btn-primary">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{id ? "Save changes" : "Add book"}</button>
        </div>
      </form>
    </>
  );
}
