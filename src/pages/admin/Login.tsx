import { useEffect, useState } from "react";
import { safeRedirect } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { TextInput } from "@/components/assessment/fields";
import { Logo } from "@/components/ui/Logo";
import { errorCode } from "@/lib/runtime";

export default function AdminLogin() {
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  // Search params are validated by the route's validateSearch, so this is a
  // plain unconditional hook call. It used to sit inside a try/catch, which
  // made it a conditional hook.
  const searchParams = useSearch({ from: "/admin/login" });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submit is unavailable while in flight or before both fields are filled.
  const isIdle = loading || !email || !password;

  // Redirect once authorised. This has to run in an effect: navigating during
  // render updates the router while this component is rendering, which React
  // flags as a setState-in-render and which drove an update loop.
  const redirectTo = safeRedirect(searchParams.redirect);
  const authorised = Boolean(user && isAdmin);
  useEffect(() => {
    if (authorised) navigate({ to: redirectTo, replace: true });
  }, [authorised, redirectTo, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      // Let the AuthContext redirect or we'll trigger the redirect in the next render cycle due to user/isAdmin state update
    } catch (err: unknown) {
      setLoading(false);
      const code = errorCode(err);

      if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password" ||
        code === "auth/user-not-found"
      ) {
        setError("Email or password is incorrect.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a few minutes and try again.");
      } else if (code === "auth/network-request-failed") {
        setError("Couldn't connect. Check your internet and try again.");
      } else {
        setError("Something went wrong signing in. Please try again.");
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface-alt)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        overflow: "hidden",
      }}
    >
      {/* Glow and Grain */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(700px, 100%)",
          height: 700,
          background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
          opacity: 0.05,
          filter: "blur(160px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 440,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 26,
          padding: "44px 40px",
          boxShadow: "0 24px 60px rgba(var(--shadow-rgb), 0.10)",
        }}
        className="af-admin-login-card"
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <Logo size={44} hideText />
        </div>

        <h1
          style={{
            fontFamily: "var(--font-fraunces)",
            fontWeight: 500,
            fontSize: "clamp(1.375rem, 2.4vw, 1.75rem)",
            color: "var(--text)",
            textAlign: "center",
            margin: 0,
          }}
        >
          GoRebalance Admin
        </h1>

        <p
          style={{
            fontSize: 14,
            color: "var(--text-muted)",
            textAlign: "center",
            marginTop: 8,
            marginBottom: 32,
          }}
        >
          Sign in to manage assessments and content.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div
              style={{
                background: "rgba(var(--danger-rgb), 0.08)",
                border: "1px solid rgba(var(--danger-rgb), 0.32)",
                borderRadius: 14,
                padding: "14px 16px",
                marginBottom: 20,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                color: "var(--danger)",
              }}
            >
              <AlertCircle style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
              <div style={{ fontSize: 14, lineHeight: 1.5, flex: 1 }}>{error}</div>
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-muted)",
                marginBottom: 6,
              }}
            >
              Email address
            </label>
            <TextInput
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@gorebalance.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 20, position: "relative" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-muted)",
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <TextInput
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isIdle}
            style={{
              width: "100%",
              height: 54,
              borderRadius: 999,
              // Primary pill. While the fields are empty it stays recognisably
              // the primary action but reads as unavailable — a flat
              // --surface-alt fill was almost invisible against the card.
              background: isIdle ? "var(--surface-alt)" : "var(--primary-strong)",
              color: isIdle ? "var(--text-muted)" : "var(--on-primary)",
              border: isIdle ? "1.5px solid var(--border-input)" : "1.5px solid transparent",
              fontSize: 15.5,
              fontWeight: 600,
              cursor: isIdle ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 28,
              transition: "background 200ms ease, color 200ms ease",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="af-autosave-anim-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>

      <a
        href="/"
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: 24,
          minHeight: 44,
          display: "inline-flex",
          alignItems: "center",
          fontSize: 13,
          color: "var(--text-muted)",
          textDecoration: "none",
        }}
      >
        ← Back to gorebalance.in
      </a>

      <style>{`
        @media (max-width: 480px) {
          .af-admin-login-card {
            padding: 32px 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
