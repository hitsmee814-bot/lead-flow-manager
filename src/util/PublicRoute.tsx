import { Navigate, Outlet } from "react-router-dom";
import { getSessionCookie } from "./authCookies";

const PublicRoute = () => {
  const token = getSessionCookie("auth_token");

  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;