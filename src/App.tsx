import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import Partner from "./pages/Partner";
import PartnerDashboard from "./pages/PartnerDashboard";
import Gallows from "./pages/Gallows";
import Architecture from "./pages/Architecture";
import SDK from "./pages/SDK";
import Compare from "./pages/Compare";
import Verify from "./pages/Verify";
import BadgePage from "./pages/Badge";
import FreeAssessment from "./pages/FreeAssessment";
import Regulations from "./pages/Regulations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/gallows" element={<Gallows />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/sdk" element={<SDK />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/badge" element={<BadgePage />} />
            <Route path="/assess" element={<FreeAssessment />} />
            <Route path="/regulations" element={<Regulations />} />
            <Route path="/partner" element={<Partner />} />
            <Route
              path="/partner/dashboard"
              element={
                <ProtectedRoute>
                  <PartnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
