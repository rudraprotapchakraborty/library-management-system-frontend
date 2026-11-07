import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, BookMarked, CheckCircle2, Library } from "lucide-react";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { shortDate } from "../../lib/format";
import { PageTitle } from "./DashboardLayout";

function Stat({ icon: Icon, label, value, tone = "text-brand" }) {
  return (
    <div className="card p-6" data-reveal>
      <Icon className={`h-5 w-5 ${tone}`} />
      <p className="display mt-4 text-4xl">{value ?? <span className="skeleton inline-block h-9 w-14 align-middle" />}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

export default function Overview() {
  const { user } = useAuth();
  const isAdmin = user.role === "ADMIN";
  const [mine, setMine] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    api.get("/dashboard/summary").then((r) => setMine(r.data.data)).catch(() => setMine({}));
    if (isAdmin) api.get("/admin/stats").then((r) => setAdmin(r.data.data)).catch(() => setAdmin({}));
  }, [isAdmin]);

  return (
    <>
      <PageTitle title="Hello," accent={user.fullName.split(" ")[0]} />

      <h2 className="eyeline mb-3">Your reading</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={BookMarked} label="Copies on loan" value={mine?.copiesOnLoan} />
        <Stat icon={AlertTriangle} label="Overdue" value={mine?.overdue} tone={mine?.overdue ? "text-danger" : "text-muted"} />
        <Stat icon={CheckCircle2} label="Returned so far" value={mine?.returned} />
      </div>
      {mine?.nextDue && (
        <p className="mt-4 text-sm text-muted">Next due: <b className="text-ink">{shortDate(mine.nextDue)}</b></p>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/books" className="btn btn-primary">Browse books</Link>
        <Link to="/dashboard/loans" className="btn btn-ghost">My loans</Link>
      </div>

      {isAdmin && (
        <>
          <h2 className="eyeline mb-3 mt-12">The library</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={Library} label="Titles" value={admin?.titles} />
            <Stat icon={Library} label="Copies on the shelf" value={admin?.copiesOnShelf} />
            <Stat icon={BookMarked} label="Copies on loan" value={admin?.copiesOnLoan} />
            <Stat icon={AlertTriangle} label="Overdue loans" value={admin?.overdue} tone={admin?.overdue ? "text-danger" : "text-muted"} />
          </div>
        </>
      )}
    </>
  );
}
