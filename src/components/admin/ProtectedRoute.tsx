import { Navigate, Outlet, useLocation } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/ui/Logo";

export default function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const { user, loading, isAdmin, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--surface)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          {/* Logo pulse */}
          <div style={{ animation: "af-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}>
            <Logo style={{ width: 40, height: 40 }} hideText />
          </div>
          {/* Progress line */}
          <div
            style={{
              width: 80,
              height: 2,
              background: "var(--border)",
              borderRadius: 999,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: "50%",
                background: "var(--primary-strong)",
                animation: "af-slide 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        <style>{`
          @keyframes af-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes af-slide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" search={{ redirect: location.pathname }} replace />;
  }

  if (!isAdmin) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--bg)",
          padding: 24,
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: 440,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "var(--surface-alt)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <ShieldAlert style={{ width: 32, height: 32, color: "var(--accent)" }} />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-fraunces)",
              fontWeight: 500,
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              color: "var(--text)",
              marginBottom: 12,
            }}
          >
            You don't have access to this area
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--text-muted)",
              marginBottom: 32,
            }}
          >
            This account isn't authorised for the GoRebalance admin panel.
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => signOut()}
              style={{
                background: "transparent",
                border: "1.5px solid var(--border)",
                borderRadius: 999,
                padding: "0 24px",
                height: 48,
                fontSize: 14.5,
                fontWeight: 600,
                color: "var(--text)",
                cursor: "pointer",
              }}
            >
              Sign out
            </button>
            <Link
              to="/"
              style={{
                fontSize: 13.5,
                color: "var(--text-muted)",
                textDecoration: "none",
              }}
            >
              ← Back to gorebalance.in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
}
