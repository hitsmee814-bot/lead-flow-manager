import { Navigate, Outlet } from "react-router-dom";
import { getSessionCookie } from "./authCookies";

const ProtectedRoute = () => {
  const token = getSessionCookie("auth_token");

  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
