import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./util/ProtectedRoute";
import PublicRoute from "./util/PublicRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
 <BrowserRouter basename="/bonhomiee">
  <Routes>
    <Route index element={<Navigate to="/login" replace />} />

    <Route element={<PublicRoute />}>
      <Route path="/login" element={<Login />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Index />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
