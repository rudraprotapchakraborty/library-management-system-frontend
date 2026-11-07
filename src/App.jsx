import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { GuestOnly, Protected } from "./components/RouteGuards";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const Books = lazy(() => import("./pages/Books"));
const BookDetails = lazy(() => import("./pages/BookDetails"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Settings = lazy(() => import("./pages/Settings"));
const Legal = lazy(() => import("./pages/Legal"));
const DashboardLayout = lazy(() => import("./pages/dashboard/DashboardLayout"));
const Overview = lazy(() => import("./pages/dashboard/Overview"));
const MyLoans = lazy(() => import("./pages/dashboard/MyLoans"));
const AdminBooks = lazy(() => import("./pages/dashboard/AdminBooks"));
const BookForm = lazy(() => import("./pages/dashboard/BookForm"));
const AdminLoans = lazy(() => import("./pages/dashboard/AdminLoans"));
const AdminUsers = lazy(() => import("./pages/dashboard/AdminUsers"));

const AUTH_PATHS = /^\/(login|register|verify-email|forgot-password)$/;

const Loading = () => (
  <div role="status" className="frame grid gap-4 py-12">
    <span className="sr-only">Loading…</span>
    <div className="skeleton" style={{ height: 38, width: "38%" }} />
    <div className="skeleton" style={{ height: 150 }} />
    <div className="skeleton" style={{ height: 90, width: "70%" }} />
  </div>
);

/** Admin-only pages inside the dashboard. */
const AdminOnly = ({ children }) => <Protected role="ADMIN">{children}</Protected>;

export default function App() {
  const { pathname, hash } = useLocation();
  const bare = AUTH_PATHS.test(pathname); // auth screens bring their own header
  // The dashboard keeps its sidebar while pages change, so only its content fades in
  const pageKey = pathname.startsWith("/dashboard") ? "dashboard" : pathname;

  // Fade sections in as they scroll into view. Sections that only appear once their
  // data has loaded are picked up as they are added to the page.
  useEffect(() => {
    document.documentElement.classList.add("js");
    const pending = () => document.querySelectorAll("[data-reveal]:not(.in-view)");
    if (!("IntersectionObserver" in window)) {
      pending().forEach((el) => el.classList.add("in-view"));
      return;
    }
    const seen = new WeakSet();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    const watch = () =>
      pending().forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el);
          io.observe(el);
        }
      });
    watch();
    const mo = new MutationObserver(watch);
    mo.observe(document.getElementById("root"), { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);

  // New pages start at the top; "/#how" style links scroll to their section
  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col">
      {!bare && <Navbar />}
      <main className="flex-1">
        <Suspense fallback={<Loading />}>
          <div key={pageKey} className="page-enter">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
              <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
              <Route path="/verify-email" element={<GuestOnly><VerifyEmail /></GuestOnly>} />
              <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
              <Route path="/settings" element={<Protected><Settings /></Protected>} />
              <Route path="/dashboard" element={<Protected><DashboardLayout /></Protected>}>
                <Route index element={<Overview />} />
                <Route path="loans" element={<MyLoans />} />
                <Route path="admin/books" element={<AdminOnly><AdminBooks /></AdminOnly>} />
                <Route path="admin/books/new" element={<AdminOnly><BookForm /></AdminOnly>} />
                <Route path="admin/books/:id/edit" element={<AdminOnly><BookForm /></AdminOnly>} />
                <Route path="admin/loans" element={<AdminOnly><AdminLoans /></AdminOnly>} />
                <Route path="admin/users" element={<AdminOnly><AdminUsers /></AdminOnly>} />
              </Route>
              <Route path="/privacy" element={<Legal page="privacy" />} />
              <Route path="/terms" element={<Legal page="terms" />} />
              <Route path="/signup" element={<Navigate to="/register" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
      </main>
      {!bare && <Footer />}
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: 14, fontSize: 14 },
        }}
      />
    </div>
  );
}
