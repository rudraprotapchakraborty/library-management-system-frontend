import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../../lib/api";
import { daysUntil, shortDate } from "../../lib/format";
import { PageTitle } from "./DashboardLayout";

/** The borrowed-books summary (copies borrowed per book) and every loan that is still out. */
export default function AdminLoans() {
  const [summary, setSummary] = useState(null);
  const [active, setActive] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/borrow").then((r) => setSummary(r.data.data)).catch((e) => setError(getErrorMessage(e, "Could not load the summary.")));
    api.get("/borrow/active").then((r) => setActive(r.data.data)).catch((e) => setError(getErrorMessage(e, "Could not load the loans.")));
  }, []);

  const max = Math.max(1, ...(summary ?? []).map((s) => s.totalQuantity));

  return (
    <>
      <PageTitle title="Library" accent="loans" />
      {error && <p role="alert" className="card mb-6 p-5 text-danger">{error}</p>}

      <h2 className="eyeline mb-3">Borrowed books summary</h2>
      {!summary ? (
        <div className="skeleton h-48" role="status" aria-label="Loading summary" />
      ) : summary.length === 0 ? (
        <p className="card p-8 text-center text-muted">Nothing has been borrowed yet.</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
              <tr><th className="p-4">Book title</th><th className="p-4">ISBN</th><th className="p-4">Total borrowed</th></tr>
            </thead>
            <tbody>
              {summary.map((s) => (
                <tr key={s.book.isbn} className="border-b border-line last:border-0">
                  <td className="p-4 font-semibold">{s.book.title}</td>
                  <td className="p-4 font-mono text-xs text-muted">{s.book.isbn}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3"><span className="w-6 font-bold">{s.totalQuantity}</span><span className="h-2 rounded-full bg-brand" style={{ width: `${(s.totalQuantity / max) * 120}px` }} /></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="eyeline mb-3 mt-10">Out on loan now</h2>
      {!active ? (
        <div className="skeleton h-40" role="status" aria-label="Loading loans" />
      ) : active.length === 0 ? (
        <p className="card p-8 text-center text-muted">Every copy is on the shelf.</p>
      ) : (
        <ul className="space-y-3">
          {active.map((l) => {
            const left = daysUntil(l.dueDate);
            return (
              <li key={l.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-bold">{l.book?.title} <span className="font-normal text-muted">× {l.quantity}</span></p>
                  <p className="truncate text-sm text-muted">{l.reader?.fullName ?? "Removed reader"} · {l.reader?.email}</p>
                </div>
                <span className={`chip ${l.overdue ? "bg-[var(--danger-soft)] text-danger" : "bg-brand-soft text-brand"}`}>
                  {l.overdue ? `Overdue ${-left}d` : `Due ${shortDate(l.dueDate)}`}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
