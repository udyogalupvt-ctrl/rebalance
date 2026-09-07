import { Outlet, useLocation } from "@tanstack/react-router";
import { AuthProvider } from "@/context/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

/*
 * Both stylesheets are imported here, statically, rather than in the route.
 *
 * The console is built almost entirely from the `af-*` classes, and those live
 * across two files: the form controls in assessment.css (the admin reuses the
 * assessment's field components) and the console chrome in
 * admin-assessments.css. Importing them from THIS module — which the route
 * loads dynamically — means Vite injects both <link> tags as part of loading
 * the admin chunk, so they are in place before React renders a single admin
 * pixel. Importing them from a useEffect instead would paint the login form
 * unstyled for a frame first.
 *
 * And because this module is only ever reached through a dynamic import, none
 * of it lands on the marketing site's critical path.
 */
import "@/styles/assessment.css";
import "@/styles/admin-assessments.css";

export default function AdminShell() {
  const location = useLocation();
  const isLogin = location.pathname === "/admin/login";

  return (
    <AuthProvider>
      {isLogin ? (
        <Outlet />
      ) : (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}
