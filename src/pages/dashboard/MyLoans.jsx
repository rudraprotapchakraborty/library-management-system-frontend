import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Undo2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../../lib/api";
import { daysUntil, shortDate } from "../../lib/format";
import ConfirmDialog from "../../components/ConfirmDialog";
import { Cover } from "../../components/BookCard";
import { PageTitle } from "./DashboardLayout";

export default function MyLoans() {
  const [loans, setLoans] = useState(null);
  const [error, setError] = useState("");
  const [returning, setReturning] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api.get("/borrow/mine").then((r) => setLoans(r.data.data)).catch((e) => setError(getErrorMessage(e, "Could not load your loans.")));
  }, []);
  useEffect(load, [load]);

  const giveBack = async () => {
    setBusy(true);
    try {
      await api.post(`/borrow/${returning.id}/return`);
      toast.success(`"${returning.book?.title}" returned. Thank you!`);
      setReturning(null);
      load();
    } catch (e) {
      toast.error(getErrorMessage(e, "Could not return the book."));
    }
    setBusy(false);
  };

  const open = loans?.filter((l) => !l.returnedAt) ?? [];
  const done = loans?.filter((l) => l.returnedAt) ?? [];

  const Row = ({ loan }) => {
    const left = daysUntil(loan.dueDate);
    return (
      <li className="card flex items-center gap-4 p-4">
        <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-line"><Cover book={loan.book ?? { title: "Removed" }} /></div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{loan.book?.title ?? "Book removed"}</p>
          <p className="truncate text-sm text-muted">{loan.book?.author} · {loan.quantity} {loan.quantity === 1 ? "copy" : "copies"}</p>
          <p className="mt-1 text-xs text-muted">Borrowed {shortDate(loan.borrowedAt)}</p>
        </div>
        {loan.returnedAt ? (
          <span className="chip bg-line/60 text-muted">Returned {shortDate(loan.returnedAt)}</span>
        ) : (
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className={`chip ${loan.overdue ? "bg-[var(--danger-soft)] text-danger" : "bg-brand-soft text-brand"}`}>
              {loan.overdue ? `Overdue ${-left}d` : left === 0 ? "Due today" : `Due in ${left}d`}
            </span>
            <button type="button" onClick={() => setReturning(loan)} className="btn btn-ghost btn-sm"><Undo2 className="h-3.5 w-3.5" /> Return</button>
          </div>
        )}
      </li>
    );
  };

  return (
    <>
      <PageTitle title="My" accent="loans" />
      {error ? (
        <p role="alert" className="card p-8 text-center text-danger">{error}</p>
      ) : !loans ? (
        <div className="space-y-3" role="status" aria-label="Loading loans">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-[112px]" />)}</div>
      ) : loans.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-lg font-bold">Nothing borrowed yet</p>
          <p className="mt-1 text-muted">Find a book you like and borrow it in a few taps.</p>
          <Link to="/books" className="btn btn-primary mt-5">Browse books</Link>
        </div>
      ) : (
        <>
          {open.length > 0 && (<><h2 className="eyeline mb-3">On loan</h2><ul className="space-y-3">{open.map((l) => <Row key={l.id} loan={l} />)}</ul></>)}
          {done.length > 0 && (<><h2 className="eyeline mb-3 mt-10">History</h2><ul className="space-y-3">{done.map((l) => <Row key={l.id} loan={l} />)}</ul></>)}
        </>
      )}
      {returning && (
        <ConfirmDialog
          title="Return this book?"
          message={`"${returning.book?.title}" goes back on the shelf and becomes available to other readers.`}
          confirmLabel="Return"
          busy={busy}
          onConfirm={giveBack}
          onCancel={() => setReturning(null)}
        />
      )}
    </>
  );
}
