// import { useEffect, useState } from "react";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import Index from "./pages/Index";
// import Login from "./pages/Login";
// import NotFound from "./pages/NotFound";
// import ProtectedRoute from "./util/ProtectedRoute";
// import PublicRoute from "./util/PublicRoute";
// import { SessionExpiredDialog } from "./util/SessionExpiredDialog";
// import AppLayout from "./components/layouts/AppLayout";
// import Itineraries from "./pages/Itineraries";

// const queryClient = new QueryClient();

// const SessionHandler = ({ children }: { children: React.ReactNode }) => {
//     const [sessionExpired, setSessionExpired] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const handler = (e: any) => {
//             if (e.detail?.status === 401) {
//                 setSessionExpired(true);

//                 setTimeout(() => {
//                     setSessionExpired(false);
//                     navigate("/login", { replace: true });
//                 }, 2000);
//             }
//         };

//         window.addEventListener("session-expired", handler);
//         return () => window.removeEventListener("session-expired", handler);
//     }, [navigate]);

//     return (
//         <>
//             {children}
//             <SessionExpiredDialog open={sessionExpired} />
//         </>
//     );
// };

// const App = () => (
//     <QueryClientProvider client={queryClient}>
//         <TooltipProvider>
//             <Toaster />

//             <BrowserRouter basename="/bonhomiee">
//                 <SessionHandler>
//                     <Routes>
//                         <Route index element={<Navigate to="/login" replace />} />

//                         <Route element={<PublicRoute />}>
//                             <Route path="/login" element={<Login />} />
//                         </Route>

//                         <Route element={<ProtectedRoute />}>
//                             <Route element={<AppLayout />}>
//                                 <Route path="/dashboard" element={<Index />} />
//                                 <Route path="/itineraries" element={<Itineraries />} />
//                             </Route>
//                         </Route>

//                         <Route path="*" element={<NotFound />} />
//                     </Routes>
//                 </SessionHandler>
//             </BrowserRouter>

//         </TooltipProvider>
//     </QueryClientProvider>
// );

// export default App;

import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

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

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail?.status === 401) {
        setSessionExpired(true);

        setTimeout(() => {
          setSessionExpired(false);
          navigate("/dashboard", { replace: true }); // stay inside app
        }, 2000);
      }
    };

    window.addEventListener("session-expired", handler);
    return () => window.removeEventListener("session-expired", handler);
  }, [navigate]);

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

      <BrowserRouter basename="/bonhomiee">
        <SessionHandler>
          <Routes>
            <Route index element={<Navigate to="/dashboard" replace />} />

            <Route element={<PublicRoute />}>
              <Route
                path="/login"
                element={<Navigate to="/dashboard" replace />}
              />
            </Route>

            {/* 🔥 Direct layout (NO ProtectedRoute) */}
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