import { NavLink, Outlet } from "react-router-dom";
import { BookMarked, BookPlus, Clock3, LayoutDashboard, Library, Settings, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const member = [
  ["/dashboard", "Overview", LayoutDashboard, true],
  ["/dashboard/loans", "My loans", BookMarked],
  ["/settings", "Settings", Settings],
];
const admin = [
  ["/dashboard/admin/books", "Manage books", Library],
  ["/dashboard/admin/loans", "Loans", Clock3],
  ["/dashboard/admin/users", "Readers", Users],
];

function Item({ to, label, Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${isActive ? "bg-brand-soft text-brand" : "text-muted hover:bg-line/60 hover:text-ink"}`
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );
}

/** Sidebar on large screens, a scrolling tab row on phones. */
export default function DashboardLayout() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="frame grid gap-8 pb-20 pt-8 grid-cols-[minmax(0,1fr)] lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10">
      <aside aria-label="Dashboard navigation" className="lg:sticky lg:top-24 lg:self-start">
        <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
          {member.map(([to, label, Icon, end]) => (
            <Item key={to} to={to} label={label} Icon={Icon} end={end} />
          ))}
          {isAdmin && (
            <>
              <p className="hidden px-3.5 pb-1 pt-5 text-[11px] font-bold uppercase tracking-wider text-muted lg:block">Librarian</p>
              {admin.map(([to, label, Icon]) => (
                <Item key={to} to={to} label={label} Icon={Icon} />
              ))}
              <Item to="/dashboard/admin/books/new" label="Add a book" Icon={BookPlus} />
            </>
          )}
        </nav>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}

/** Heading used at the top of every dashboard page. */
export function PageTitle({ title, accent, children }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <h1 className="display text-[clamp(28px,3.6vw,42px)]">
        {title} {accent && <span className="accent">{accent}</span>}
      </h1>
      {children}
    </div>
  );
}
