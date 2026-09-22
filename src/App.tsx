

import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import { EnquiryList } from "./components/Admin/Enquiries/EnquiryList";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AdminLogin } from "./components/Admin/admin-login";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PublicRoute from "./util/PublicRoute";
import { SessionExpiredDialog } from "./util/SessionExpiredDialog";
import AppLayout from "./components/layouts/AppLayout";
import Itineraries from "./pages/Itineraries";

const queryClient = new QueryClient();

const SessionHandler = ({ children }: { children: React.ReactNode }) => {
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const handler = (e: any) => {
      if (e.detail?.status === 401) {
        setSessionExpired(true);

        timeoutId = setTimeout(() => {
          setSessionExpired(false);

          const isAdminRoute = location.pathname
            .toLowerCase()
            .startsWith("/admin");

          navigate(
            isAdminRoute ? "/Admin/login" : "/dashboard",
            { replace: true }
          );
        }, 2000);
      }
    };

    window.addEventListener("session-expired", handler);

    return () => {
      window.removeEventListener("session-expired", handler);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [navigate, location.pathname]);

  return (
    <>
      {children}
      <SessionExpiredDialog open={sessionExpired} />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <SonnerToaster position="top-right" />
      <BrowserRouter basename="/lead-flow-manager">
        <SessionHandler>
          <Routes>

            {/* For Admin Login */}
          {/* Admin Login */}
          <Route path="/Admin/login" element={<AdminLogin />} />

          {/* Admin Sidebar Navigation */}
              <Route element={<AdminLayout />}>
                <Route path="/Admin" element={<AdminDashboard />} />
                <Route path="/Admin/Itineraries" element={<Itineraries />} />
                 <Route path="/Admin/Enquiries" element={<EnquiryList />} />
              </Route>
            <Route index element={<Navigate to="/dashboard" replace />} />

            <Route element={<PublicRoute />}>
              <Route
                path="/login"
                element={<Navigate to="/dashboard" replace />}
              />
            </Route>

            {/* Direct layout (NO ProtectedRoute) */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Index />} />
              <Route path="/itineraries" element={<Itineraries />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </SessionHandler>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;