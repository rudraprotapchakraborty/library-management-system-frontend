import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookMarked, Clock3, Library, Search, Users } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import BookCard, { BookCardSkeleton } from "../components/BookCard";

const STEPS = [
  { icon: Search, title: "Find a book", text: "Search the catalogue by title, author or ISBN and filter by genre." },
  { icon: BookMarked, title: "Borrow it", text: "Pick how many copies and a due date. The shelf count updates straight away." },
  { icon: Clock3, title: "Return on time", text: "See what is due, spot overdue loans and return copies in one tap." },
];

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState(null);

  useEffect(() => {
    api.get("/public/stats").then((r) => setStats(r.data.data)).catch(() => setStats(false));
    api.get("/books", { params: { limit: 4, sortBy: "createdAt", sort: "desc", available: "true" } }).then((r) => setBooks(r.data.data)).catch(() => setBooks([]));
  }, []);

  return (
    <>
      <section className="frame grid items-center gap-12 pb-16 pt-12 lg:grid-cols-12 lg:pt-20">
        <div className="hero-stagger lg:col-span-7">
          <p className="eyeline">Library management system</p>
          <h1 className="display mt-5 text-[clamp(2.8rem,7vw,5.6rem)]">
            Every book, <span className="accent text-[clamp(3.2rem,8vw,6.4rem)]">on the shelf</span> or on loan.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Shelfwise lets readers browse the catalogue and borrow books, and gives librarians one place to add titles, watch the shelves and see who has what.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/books" className="btn btn-primary">Browse books <ArrowRight className="h-4 w-4" /></Link>
            {!user && <Link to="/login" className="btn btn-ghost">Try a test account</Link>}
          </div>
        </div>
        <div className="lg:col-span-5" aria-hidden>
          <div className="grid-panel rounded-[28px] border border-line p-6 sm:p-8">
            <div className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow)]">
              <p className="eyeline">Due this week</p>
              {["Pride and Prejudice", "Walden"].map((t, i) => (
                <div key={t} className="mt-4 flex items-center gap-3 border-t border-line pt-4 first:border-0 first:pt-0">
                  <span className="grid h-12 w-9 shrink-0 place-items-center rounded-md bg-brand-soft text-brand"><Library className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1"><p className="truncate font-bold">{t}</p><p className="text-xs text-muted">{i ? "Overdue by 4 days" : "Due in 5 days"}</p></div>
                  <span className={`chip ${i ? "bg-[var(--danger-soft)] text-danger" : "bg-brand-soft text-brand"}`}>{i ? "Overdue" : "On loan"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="frame" data-reveal>
        <dl className="grid grid-cols-2 gap-4 rounded-3xl border border-line bg-surface p-6 sm:grid-cols-4 sm:p-8">
          {[
            ["Titles", stats?.titles],
            ["Copies", stats?.copies],
            ["Readers", stats?.readers],
            ["Loans so far", stats?.borrowed],
          ].map(([label, value]) => (
            <div key={label}>
              <dd className="display text-4xl">{stats === null ? <span className="skeleton inline-block h-9 w-16 align-middle" /> : (value ?? "–")}</dd>
              <dt className="mt-1 text-sm text-muted">{label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="frame py-16">
        <div className="flex items-end justify-between gap-4" data-reveal>
          <h2 className="display text-[clamp(30px,4vw,48px)]">Just <span className="accent">added</span></h2>
          <Link to="/books" className="hidden items-center gap-1.5 text-sm font-semibold text-brand sm:inline-flex">All books <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-4">
          {books === null ? Array.from({ length: 4 }, (_, i) => <BookCardSkeleton key={i} />) : books.map((b) => <BookCard key={b._id} book={b} />)}
        </div>
      </section>

      <section className="frame pb-20">
        <h2 className="display text-[clamp(30px,4vw,48px)]" data-reveal>How it <span className="accent">works</span></h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="card p-7" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand"><s.icon className="h-5 w-5" /></span>
              <h3 className="mt-5 text-xl font-bold tracking-tight">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-3xl bg-ink p-8 text-paper sm:flex-row sm:items-center" data-reveal>
          <div className="flex items-center gap-4"><Users className="h-8 w-8 text-brand" /><p className="text-xl font-bold">Run the library? Sign in with the librarian test account.</p></div>
          <Link to="/login" className="btn btn-primary">Open the dashboard</Link>
        </div>
      </section>
    </>
  );
}
