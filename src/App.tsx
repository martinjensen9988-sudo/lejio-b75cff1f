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
import WhatIsLejio from "./pages/WhatIsLejio";
import BecomeLessor from "./pages/BecomeLessor";
import NotFound from "./pages/NotFound";

// Dashboard sub-pages
import VehiclesPage from "./pages/dashboard/Vehicles";
import CalendarPage from "./pages/dashboard/Calendar";
import BookingsPage from "./pages/dashboard/Bookings";
import CreateBookingPage from "./pages/dashboard/CreateBooking";
import AddVehiclePage from "./pages/dashboard/AddVehicle";
import InvoicesPage from "./pages/dashboard/Invoices";
import FinesPage from "./pages/dashboard/Fines";
import RevenueLossPage from "./pages/dashboard/RevenueLoss";
import CustomersPage from "./pages/dashboard/Customers";
import FavoritesPage from "./pages/dashboard/Favorites";
import RecurringPage from "./pages/dashboard/Recurring";
import ServicePage from "./pages/dashboard/Service";
import TiresPage from "./pages/dashboard/Tires";
import InspectionsPage from "./pages/dashboard/Inspections";
import AnalyticsPage from "./pages/dashboard/Analytics";
import AIPricingPage from "./pages/dashboard/AIPricing";
import FleetAIPage from "./pages/dashboard/FleetAI";
import DeductiblesPage from "./pages/dashboard/Deductibles";
import EditVehiclePage from "./pages/dashboard/EditVehicle";
import ContractSignPage from "./pages/dashboard/ContractSign";
import DamageReportPage from "./pages/dashboard/DamageReport";
import RateLessorPage from "./pages/dashboard/RateLessor";
import RateRenterPage from "./pages/dashboard/RateRenter";
import CreateWarningPage from "./pages/dashboard/CreateWarning";
import AddGeofencePage from "./pages/gps/AddGeofence";
import AddGpsDevicePage from "./pages/gps/AddGpsDevice";
import VehicleDetailPage from "./pages/search/VehicleDetail";
import SearchCreateBookingPage from "./pages/search/CreateBooking";
// Admin sub-pages
import AdminUsersPage from "./pages/admin/Users";
import AdminStaffPage from "./pages/admin/Staff";
import AdminBookingsPage from "./pages/admin/Bookings";
import AdminLocationsPage from "./pages/admin/Locations";
import AdminFeesPage from "./pages/admin/Fees";
import AdminDiscountsPage from "./pages/admin/Discounts";
import AdminFleetPage from "./pages/admin/Fleet";
import AdminWarningsPage from "./pages/admin/Warnings";
import AdminReportsPage from "./pages/admin/Reports";
import AdminMessagesPage from "./pages/admin/Messages";
import AdminLiveChatPage from "./pages/admin/LiveChat";
import AdminVehicleValuesPage from "./pages/admin/VehicleValues";
import AdminGpsPage from "./pages/admin/Gps";
import AdminCheckInOutPage from "./pages/admin/CheckInOut";
import AdminCorporatePage from "./pages/admin/Corporate";
import AdminFacebookPage from "./pages/admin/Facebook";
import AdminStatsPage from "./pages/admin/Stats";
import AdminSalesAIPage from "./pages/admin/SalesAI";
import SalesAIAddLeadPage from "./pages/admin/SalesAIAddLead";
import SalesAIImportPage from "./pages/admin/SalesAIImport";
import SalesAIEmailPage from "./pages/admin/SalesAIEmail";
import SalesAICarAdPage from "./pages/admin/SalesAICarAd";
import SalesAICompanySearchPage from "./pages/admin/SalesAICompanySearch";

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
            {/* Dashboard sub-routes */}
            <Route path="/dashboard/vehicles" element={<VehiclesPage />} />
            <Route path="/dashboard/vehicles/add" element={<AddVehiclePage />} />
            <Route path="/dashboard/calendar" element={<CalendarPage />} />
            <Route path="/dashboard/bookings" element={<BookingsPage />} />
            <Route path="/dashboard/bookings/create" element={<CreateBookingPage />} />
            <Route path="/dashboard/invoices" element={<InvoicesPage />} />
            <Route path="/dashboard/fines" element={<FinesPage />} />
            <Route path="/dashboard/revenue-loss" element={<RevenueLossPage />} />
            <Route path="/dashboard/customers" element={<CustomersPage />} />
            <Route path="/dashboard/favorites" element={<FavoritesPage />} />
            <Route path="/dashboard/recurring" element={<RecurringPage />} />
            <Route path="/dashboard/service" element={<ServicePage />} />
            <Route path="/dashboard/tires" element={<TiresPage />} />
            <Route path="/dashboard/inspections" element={<InspectionsPage />} />
            <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
            <Route path="/dashboard/ai-pricing" element={<AIPricingPage />} />
            <Route path="/dashboard/fleet-ai" element={<FleetAIPage />} />
            <Route path="/dashboard/deductibles" element={<DeductiblesPage />} />
            <Route path="/dashboard/vehicles/edit/:id" element={<EditVehiclePage />} />
            <Route path="/dashboard/contract/sign/:id" element={<ContractSignPage />} />
            <Route path="/dashboard/damage-report/:bookingId" element={<DamageReportPage />} />
            <Route path="/dashboard/rate-lessor/:bookingId" element={<RateLessorPage />} />
            <Route path="/dashboard/rate-renter/:bookingId" element={<RateRenterPage />} />
            <Route path="/dashboard/warnings/create" element={<CreateWarningPage />} />
            <Route path="/gps/add-device" element={<AddGpsDevicePage />} />
            <Route path="/gps/add-geofence" element={<AddGeofencePage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/search" element={<Search />} />
            <Route path="/search/vehicle/:vehicleId" element={<VehicleDetailPage />} />
            <Route path="/search/booking/:vehicleId" element={<SearchCreateBookingPage />} />
            <Route path="/booking/:vehicleId" element={<Booking />} />
            <Route path="/my-rentals" element={<MyRentals />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* Admin sub-routes */}
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/staff" element={<AdminStaffPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
            <Route path="/admin/locations" element={<AdminLocationsPage />} />
            <Route path="/admin/fees" element={<AdminFeesPage />} />
            <Route path="/admin/discounts" element={<AdminDiscountsPage />} />
            <Route path="/admin/fleet" element={<AdminFleetPage />} />
            <Route path="/admin/warnings" element={<AdminWarningsPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/messages" element={<AdminMessagesPage />} />
            <Route path="/admin/live-chat" element={<AdminLiveChatPage />} />
            <Route path="/admin/vehicle-values" element={<AdminVehicleValuesPage />} />
            <Route path="/admin/gps" element={<AdminGpsPage />} />
            <Route path="/admin/checkinout" element={<AdminCheckInOutPage />} />
            <Route path="/admin/corporate" element={<AdminCorporatePage />} />
            <Route path="/admin/facebook" element={<AdminFacebookPage />} />
            <Route path="/admin/sales-ai" element={<AdminSalesAIPage />} />
            <Route path="/admin/sales-ai/add" element={<SalesAIAddLeadPage />} />
            <Route path="/admin/sales-ai/import" element={<SalesAIImportPage />} />
            <Route path="/admin/sales-ai/email/:id" element={<SalesAIEmailPage />} />
            <Route path="/admin/sales-ai/car-ad" element={<SalesAICarAdPage />} />
            <Route path="/admin/sales-ai/company-search" element={<SalesAICompanySearchPage />} />
            <Route path="/admin/stats" element={<AdminStatsPage />} />
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
            <Route path="/hvad-er-lejio" element={<WhatIsLejio />} />
            <Route path="/bliv-udlejer" element={<BecomeLessor />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
