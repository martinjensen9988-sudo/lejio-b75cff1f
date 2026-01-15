import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Search from "./pages/Search";
import Booking from "./pages/Booking";
import MyRentals from "./pages/MyRentals";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import Messages from "./pages/Messages";
import Install from "./pages/Install";
import GpsTracking from "./pages/GpsTracking";
import Features from "./pages/Features";
import CorporateDashboard from "./pages/CorporateDashboard";
import PrivateFleet from "./pages/PrivateFleet";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/search" element={<Search />} />
            <Route path="/booking/:vehicleId" element={<Booking />} />
            <Route path="/my-rentals" element={<MyRentals />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/privatlivspolitik" element={<PrivacyPolicy />} />
            <Route path="/handelsbetingelser" element={<Terms />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/beskeder" element={<Messages />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/install" element={<Install />} />
            <Route path="/gps" element={<GpsTracking />} />
            <Route path="/funktioner" element={<Features />} />
            <Route path="/corporate" element={<CorporateDashboard />} />
            <Route path="/privat-fleet" element={<PrivateFleet />} />
            <Route path="/om-os" element={<About />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
