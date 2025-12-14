import { Navigate, Outlet } from "react-router-dom";
import { getSessionCookie } from "./authCookies";

const PublicRoute = () => {
  const sessionKey = getSessionCookie("sessionKey");

  return sessionKey ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
