import { Link } from "react-router-dom";
import { GENRE_LABELS } from "../lib/format";

/** A book's cover, or its title on a tinted panel when there is no picture. */
export function Cover({ book, className = "" }) {
  return book.coverImageUrl ? (
    <img src={book.coverImageUrl} alt="" loading="lazy" className={`h-full w-full object-cover ${className}`} />
  ) : (
    <span className={`grid h-full w-full place-items-center bg-brand-soft p-4 text-center font-serif text-xl italic text-brand ${className}`}>
      {book.title}
    </span>
  );
}

export function AvailabilityChip({ book }) {
  return book.available ? (
    <span className="chip bg-brand-soft text-brand">{book.copies} {book.copies === 1 ? "copy" : "copies"} in</span>
  ) : (
    <span className="chip bg-[var(--danger-soft)] text-danger">All on loan</span>
  );
}

export default function BookCard({ book }) {
  return (
    <article data-reveal className="group flex flex-col">
      <Link to={`/books/${book._id}`} className="block aspect-[3/4] overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow)]">
        <Cover book={book} className="transition-transform duration-500 group-hover:scale-[1.03]" />
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="eyeline">{GENRE_LABELS[book.genre]}</span>
        <AvailabilityChip book={book} />
      </div>
      <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug tracking-tight">
        <Link to={`/books/${book._id}`} className="hover:text-brand">{book.title}</Link>
      </h3>
      <p className="mt-0.5 text-sm text-muted">{book.author}</p>
    </article>
  );
}

export function BookCardSkeleton() {
  return (
    <div aria-hidden>
      <div className="skeleton aspect-[3/4] w-full" />
      <div className="skeleton mt-4 h-3 w-1/3" />
      <div className="skeleton mt-3 h-5 w-4/5" />
      <div className="skeleton mt-2 h-4 w-1/2" />
    </div>
  );
}
