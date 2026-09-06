import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ClipboardList,
  Receipt,
  Stethoscope,
  Quote,
  Images,
  Mail,
  LogOut,
  Menu,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/ui/Logo";
import { collection, query, where, onSnapshot, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AppSettings } from "@/components/admin/AppSettings";
import { useAdminAlerts } from "@/hooks/use-admin-alerts";

const BASE_ROUTES = [
  { path: "/admin", name: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/assessments", name: "Assessments", icon: ClipboardList, badgeKey: "assessments" },
  { path: "/admin/payments", name: "Payments", icon: Receipt },
  { path: "/admin/treatments", name: "Treatments", icon: Stethoscope },
  { path: "/admin/testimonials", name: "Testimonials", icon: Quote },
  { path: "/admin/gallery", name: "Gallery", icon: Images },
  { path: "/admin/enquiries", name: "Enquiries", icon: Mail, badgeKey: "enquiries" },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [counts, setCounts] = useState({ assessments: 0, enquiries: 0 });

  // Notify on new assessments and enquiries while the panel is open. No-ops
  // until the practice has granted notification permission.
  useAdminAlerts(Boolean(user));

  useEffect(() => {
    // Badge counts. Both are bounded: a badge only needs to distinguish
    // "some" from "none", and an unbounded listener on a growing collection
    // would stream every document to every admin page view.
    const BADGE_CAP = 99;

    const unsubAssessments = onSnapshot(
      query(collection(db, "assessments"), where("status", "==", "new"), limit(BADGE_CAP)),
      (snap) => setCounts((prev) => ({ ...prev, assessments: snap.size })),
      () => setCounts((prev) => ({ ...prev, assessments: 0 })),
    );

    // Enquiries are written with readAt: null so this can be a real query
    // rather than fetching the collection and filtering on the client.
    const unsubEnquiries = onSnapshot(
      query(collection(db, "enquiries"), where("readAt", "==", null), limit(BADGE_CAP)),
      (snap) => setCounts((prev) => ({ ...prev, enquiries: snap.size })),
      () => setCounts((prev) => ({ ...prev, enquiries: 0 })),
    );

    return () => {
      unsubAssessments();
      unsubEnquiries();
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const ROUTES = BASE_ROUTES.map((route) => ({
    ...route,
    badgeCount: route.badgeKey ? counts[route.badgeKey as keyof typeof counts] : undefined,
  }));

  // Lock the page behind the drawer and keep keyboard focus inside it.
  const drawerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const FOCUSABLE =
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const root = drawerRef.current;
      if (!root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Move focus into the drawer so Tab starts inside it.
    requestAnimationFrame(() => {
      drawerRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    });

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [mobileMenuOpen]);

  const handleSignOut = () => {
    if (window.confirm("Sign out of the GoRebalance admin panel?")) {
      void signOut();
    }
  };

  const currentRouteName = ROUTES.find((r) => r.path === location.pathname)?.name || "Admin";

  const SidebarContent = () => (
    <div className="af-admin-sidebar-inner">
      <div className="af-admin-sidebar-header">
        <Logo size={30} hideText />
        <span className="af-admin-logo-text">GoRebalance</span>
        <span className="af-admin-chip">ADMIN</span>
      </div>

      <nav className="af-admin-nav">
        {ROUTES.map((route) => {
          const isActive = location.pathname === route.path;
          return (
            <Link
              key={route.path}
              to={route.path}
              className={`af-admin-nav-item ${isActive ? "af-admin-nav-item--active" : ""}`}
            >
              {isActive && <div className="af-admin-nav-active-bar" />}
              <route.icon size={18} />
              <span className="af-admin-nav-label">{route.name}</span>
              {route.badgeCount && route.badgeCount > 0 ? (
                <span className="af-admin-nav-badge">{route.badgeCount}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="af-admin-sidebar-footer">
        <AppSettings />
        <div className="af-admin-user-info">
          <div className="af-admin-user-avatar">{user?.email?.charAt(0).toUpperCase() || "A"}</div>
          <span className="af-admin-user-email">{user?.email}</span>
          <button className="af-admin-logout-btn" onClick={handleSignOut} aria-label="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="af-admin-layout">
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="af-admin-sidebar-desktop">
        <SidebarContent />
      </aside>

      {/* ─── MOBILE DRAWER & BACKDROP ─── */}
      {mobileMenuOpen && (
        <div
          className="af-admin-backdrop"
          role="presentation"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <aside
        ref={drawerRef}
        id="admin-drawer"
        aria-label="Admin navigation"
        aria-hidden={!mobileMenuOpen}
        {...(mobileMenuOpen ? {} : { inert: true })}
        className={`af-admin-sidebar-mobile ${mobileMenuOpen ? "open" : ""}`}
      >
        <SidebarContent />
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <div className="af-admin-main">
        {/* TOP BAR */}
        <header className="af-admin-topbar">
          <div className="af-admin-topbar-left">
            <button
              className="af-admin-hamburger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation"
              aria-expanded={mobileMenuOpen}
              aria-controls="admin-drawer"
            >
              <Menu size={24} />
            </button>
            <h1 className="af-admin-page-title">{currentRouteName}</h1>
          </div>
          <div className="af-admin-topbar-right">
            {/* Dark mode toggle placeholder for now, as we haven't built global dark mode yet */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="af-admin-external-link"
              title="View site"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="af-admin-content-area">
          <div className="af-admin-content-max">
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        .af-admin-layout {
          min-height: 100vh;
          background: var(--bg);
        }

        /* ─── SIDEBAR DESKTOP ─── */
        .af-admin-sidebar-desktop {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 260px;
          background: var(--surface);
          border-right: 1px solid var(--border);
          z-index: 40;
        }

        @media (min-width: 1024px) {
          .af-admin-sidebar-desktop {
            display: block;
          }
        }

        /* ─── SIDEBAR MOBILE ─── */
        .af-admin-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(var(--dark-surface-rgb), 0.5);
          backdrop-filter: blur(4px);
          z-index: 50;
        }

        .af-admin-sidebar-mobile {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 280px;
          background: var(--surface);
          border-right: 1px solid var(--border);
          z-index: 60;
          transform: translateX(-100%);
          transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .af-admin-sidebar-mobile.open {
          transform: translateX(0);
        }

        /* ─── SIDEBAR CONTENT ─── */
        .af-admin-sidebar-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .af-admin-sidebar-header {
          display: flex;
          align-items: center;
          padding: 24px 20px;
          border-bottom: 1px solid var(--border);
          gap: 12px;
        }

        .af-admin-logo-text {
          font-family: var(--font-fraunces);
          font-weight: 500;
          font-size: 17px;
          color: var(--text);
        }

        .af-admin-chip {
          font-size: 10.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: var(--primary-soft);
          color: var(--primary);
          padding: 3px 8px;
          border-radius: 999px;
          margin-left: auto;
        }

        .af-admin-nav {
          flex: 1;
          padding: 16px 12px;
          overflow-y: auto;
        }

        .af-admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          height: 44px;
          border-radius: 12px;
          padding: 0 14px;
          color: var(--text-muted);
          text-decoration: none;
          position: relative;
          transition: background 150ms ease, color 150ms ease;
          margin-bottom: 4px;
        }

        .af-admin-nav-item:hover {
          background: var(--surface-alt);
          color: var(--text);
        }

        .af-admin-nav-item--active {
          background: var(--primary-soft) !important;
          color: var(--primary) !important;
          font-weight: 600;
        }

        .af-admin-nav-active-bar {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 18px;
          background: var(--primary);
          border-radius: 999px;
        }

        .af-admin-nav-label {
          font-size: 14.5px;
          font-weight: 500;
        }
        
        .af-admin-nav-item--active .af-admin-nav-label {
          font-weight: 600;
        }

        .af-admin-nav-badge {
          font-size: 11px;
          font-weight: 600;
          /* --accent is a decorative fill; carrying text on it measured
             3.27:1 light / 2.43:1 dark. --accent-strong is the text-bearing
             pair and flips correctly with the theme. */
          background: var(--accent-strong);
          color: var(--on-accent);
          padding: 2px 7px;
          border-radius: 999px;
          margin-left: auto;
        }

        .af-admin-sidebar-footer {
          border-top: 1px solid var(--border);
          padding: 16px;
        }

        .af-admin-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .af-admin-user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--primary-soft);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          flex-shrink: 0;
        }

        .af-admin-user-email {
          font-size: 13px;
          color: var(--text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        .af-admin-logout-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .af-admin-logout-btn:hover {
          background: var(--surface-alt);
          color: var(--text);
        }

        /* ─── MAIN CONTENT AREA ─── */
        .af-admin-main {
          margin-left: 0;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        @media (min-width: 1024px) {
          .af-admin-main {
            margin-left: 260px;
          }
        }

        /* ─── TOP BAR ─── */
        .af-admin-topbar {
          height: 64px;
          background: rgba(var(--bg-rgb, 255, 255, 255), 0.88);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
        }

        @media (max-width: 1023px) {
          .af-admin-topbar {
            padding: 0 16px;
          }
        }

        .af-admin-topbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .af-admin-hamburger {
          display: none;
          background: transparent;
          border: none;
          color: var(--text);
          width: 44px;
          height: 44px;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          cursor: pointer;
        }

        @media (max-width: 1023px) {
          .af-admin-hamburger {
            display: flex;
          }
        }

        .af-admin-page-title {
          font-family: var(--font-fraunces);
          font-weight: 500;
          font-size: 18px;
          color: var(--text);
          margin: 0;
        }

        @media (max-width: 1023px) {
          .af-admin-page-title {
            display: none;
          }
        }

        .af-admin-topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .af-admin-external-link {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          border-radius: 8px;
          transition: background 150ms ease;
        }

        .af-admin-external-link:hover {
          background: var(--surface-alt);
          color: var(--text);
        }

        /* ─── CONTENT AREA ─── */
        .af-admin-content-area {
          flex: 1;
          padding: 32px;
        }

        @media (max-width: 767px) {
          .af-admin-content-area {
            padding: 20px;
          }
        }

        .af-admin-content-max {
          max-width: 1440px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}
