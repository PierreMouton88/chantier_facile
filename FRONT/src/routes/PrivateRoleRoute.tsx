import { Navigate, Outlet } from "react-router-dom";
import { useAuthCtx } from "../authContext/AuthContext";
import type { Role } from "../types/user.type";
import type { PrivateRouteProps } from "../types/route.type";



const isValidRole = (role: unknown): role is Role =>
  ["admin", "customer", "entreprise"].includes(role as Role)

const ROLE_FALLBACK: Record<Role | "default", string> = {
  admin: "/admin",
  entreprise: "/dashboard",
  customer: "/dashboard",
  default: "/login",
}

const getDefaultRedirect = (role: Role | null): string =>
  role && isValidRole(role) ? ROLE_FALLBACK[role] : ROLE_FALLBACK.default


export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowed, redirectTo }) => {
  const { isAuthenticated, role, isAuthLoading } = useAuthCtx();

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  if (allowed && role && !allowed.includes(role)) {
    return <Navigate to={redirectTo ?? getDefaultRedirect(role)} replace />;
  }

  return <Outlet />;
};

export const PrivateAdminRoute = () => <PrivateRoute allowed={["admin"]} />;
export const PrivateUserRoute = () => <PrivateRoute allowed={["customer"]} />;
export const PrivateEntrepriseRoute = () => <PrivateRoute allowed={["entreprise"]} />;


export const PublicRoute = () => {
  const { isAuthenticated, role, isAuthLoading } = useAuthCtx();

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getDefaultRedirect(role as Role | null)} replace />;
  }

  return <Outlet />;
}
