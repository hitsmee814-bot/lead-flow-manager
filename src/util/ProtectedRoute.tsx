import { Navigate, Outlet } from "react-router-dom";
import { getSessionCookie } from "./authCookies";

const ProtectedRoute = () => {
  const sessionKey = getSessionCookie("sessionKey");

  return sessionKey ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
