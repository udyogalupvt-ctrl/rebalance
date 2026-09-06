import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { AuthProvider } from "@/context/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import "@/styles/admin-assessments.css";

export const Route = createFileRoute("/admin")({
  component: AdminWrapper,
});

function AdminWrapper() {
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
