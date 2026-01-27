import { Suspense, lazy, forwardRef } from "react";

const SubscriptionRental = lazy(() => import("./pages/subscription-rental"));
const DealerWebsiteSettings = lazy(() => import("./pages/dealer/WebsiteSettings"));
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AdminAuthProvider } from "@/hooks/useAdminAuth";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy loaded pages - only loaded when needed
const AdminInvoicesPage = lazy(() => import("./pages/admin/Invoices"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));

// Lazy load LiveChatWidget to reduce initial bundle size
const LiveChatWidget = lazy(() => import("@/components/chat/LiveChatWidget").then(m => ({ default: m.LiveChatWidget })));

// Lazy load VisitorPresenceTracker
const VisitorPresenceTracker = lazy(() => import("@/components/chat/VisitorPresenceTracker").then(m => ({ default: m.VisitorPresenceTracker })));

// Component to conditionally render LiveChatWidget and presence tracker (hide on admin pages)
const ConditionalLiveChat = () => {
  const location = useLocation();
  // Hide chat and presence tracking on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  return (
    <>
      <VisitorPresenceTracker />
      <LiveChatWidget />
    </>
  );
};

// Critical path - loaded immediately for homepage
import Index from "./pages/Index";
import GlobalPage from "./pages/GlobalPage";
import DealerProfile from "./pages/DealerProfile";
const AdminGlobalPages = lazy(() => import("./pages/admin/GlobalPages"));
import NotFound from "./pages/NotFound";
const Search = lazy(() => import("./pages/Search"));
const Booking = lazy(() => import("./pages/Booking"));
const MyRentals = lazy(() => import("./pages/MyRentals"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Messages = lazy(() => import("./pages/Messages"));
const Install = lazy(() => import("./pages/Install"));
const GpsTracking = lazy(() => import("./pages/GpsTracking"));
const Features = lazy(() => import("./pages/Features"));
const CorporateDashboard = lazy(() => import("./pages/CorporateDashboard"));
const PrivateFleet = lazy(() => import("./pages/PrivateFleet"));

// QR check-in page
const CheckinPage = lazy(() => import("./pages/checkin/[contractId]"));
const About = lazy(() => import("./pages/About"));
const WhatIsLejio = lazy(() => import("./pages/WhatIsLejio"));
const BecomeLessor = lazy(() => import("./pages/BecomeLessor"));
const LessorTerms = lazy(() => import("./pages/LessorTerms"));
const Forhandler = lazy(() => import("./pages/Forhandler"));
const DealerRegistration = lazy(() => import("./pages/DealerRegistration"));
const Contact = lazy(() => import("./pages/Contact"));
const FleetDemo = lazy(() => import("./pages/FleetDemo"));
const FleetWidgetDemo = lazy(() => import("./pages/FleetWidgetDemo"));

// Dashboard sub-pages - lazy loaded
const VehiclesPage = lazy(() => import("./pages/dashboard/Vehicles"));
const CalendarPage = lazy(() => import("./pages/dashboard/Calendar"));
const BookingsPage = lazy(() => import("./pages/dashboard/Bookings"));
const CreateBookingPage = lazy(() => import("./pages/dashboard/CreateBooking"));
const AddVehiclePage = lazy(() => import("./pages/dashboard/AddVehicle"));
const InvoicesPage = lazy(() => import("./pages/dashboard/Invoices"));
const FinesPage = lazy(() => import("./pages/dashboard/Fines"));
const RevenueLossPage = lazy(() => import("./pages/dashboard/RevenueLoss"));
const CustomersPage = lazy(() => import("./pages/dashboard/Customers"));
const FavoritesPage = lazy(() => import("./pages/dashboard/Favorites"));
const RecurringPage = lazy(() => import("./pages/dashboard/Recurring"));
const ServicePage = lazy(() => import("./pages/dashboard/Service"));
const TiresPage = lazy(() => import("./pages/dashboard/Tires"));
const InspectionsPage = lazy(() => import("./pages/dashboard/Inspections"));
const AnalyticsPage = lazy(() => import("./pages/dashboard/Analytics"));
const FinesAddPage = lazy(() => import("./pages/dashboard/FinesAdd"));
const ServiceTaskAddPage = lazy(() => import("./pages/dashboard/ServiceTaskAdd"));
const AIPricingPage = lazy(() => import("./pages/dashboard/AIPricing"));
const FleetAIPage = lazy(() => import("./pages/dashboard/FleetAI"));
const FleetPage = lazy(() => import("./pages/dashboard/Fleet"));
const DeductiblesPage = lazy(() => import("./pages/dashboard/Deductibles"));
const DeductiblesAddPage = lazy(() => import("./pages/dashboard/DeductiblesAdd"));
const EditVehiclePage = lazy(() => import("./pages/dashboard/EditVehicle"));
const ContractSignPage = lazy(() => import("./pages/dashboard/ContractSign"));
const DamageReportPage = lazy(() => import("./pages/dashboard/DamageReport"));
const RateLessorPage = lazy(() => import("./pages/dashboard/RateLessor"));
const RateRenterPage = lazy(() => import("./pages/dashboard/RateRenter"));
const CreateWarningPage = lazy(() => import("./pages/dashboard/CreateWarning"));
const WarningsPage = lazy(() => import("./pages/dashboard/Warnings"));
const ServiceBookingPage = lazy(() => import("./pages/dashboard/ServiceBooking"));
const MCMaintenancePage = lazy(() => import("./pages/dashboard/MCMaintenance"));
const RevenueLossCalculatePage = lazy(() => import("./pages/dashboard/RevenueLossCalculate"));
const VehicleSwapPage = lazy(() => import("./pages/dashboard/VehicleSwap"));
const ServiceRemindersAddPage = lazy(() => import("./pages/dashboard/ServiceRemindersAdd"));
const LocationsPage = lazy(() => import("./pages/dashboard/Locations"));
const LocationAddPage = lazy(() => import("./pages/dashboard/LocationAdd"));
const LocationEditPage = lazy(() => import("./pages/dashboard/LocationEdit"));
const SettlementPage = lazy(() => import("./pages/dashboard/Settlement"));
const CheckInOutPage = lazy(() => import("./pages/dashboard/CheckInOut"));
const ScanHistoryPage = lazy(() => import("./pages/dashboard/ScanHistory"));
const ApiKeysPage = lazy(() => import("./pages/dashboard/ApiKeys"));
const AddGeofencePage = lazy(() => import("./pages/gps/AddGeofence"));
const AddGpsDevicePage = lazy(() => import("./pages/gps/AddGpsDevice"));
const VehicleDetailPage = lazy(() => import("./pages/search/VehicleDetail"));

// Corporate pages - lazy loaded
const CorporateAddFleetVehiclePage = lazy(() => import("./pages/corporate/AddFleetVehicle"));
const CorporateCreateBookingPage = lazy(() => import("./pages/corporate/CreateBooking"));

// Admin sub-pages - lazy loaded
const AdminUsersPage = lazy(() => import("./pages/admin/Users"));
const AdminStaffPage = lazy(() => import("./pages/admin/Staff"));
const AdminBookingsPage = lazy(() => import("./pages/admin/Bookings"));
const AdminLocationsPage = lazy(() => import("./pages/admin/Locations"));
const AdminFeesPage = lazy(() => import("./pages/admin/Fees"));
const AdminDiscountsPage = lazy(() => import("./pages/admin/Discounts"));
const AdminFleetPage = lazy(() => import("./pages/admin/Fleet"));
const AdminWarningsPage = lazy(() => import("./pages/admin/Warnings"));
const AdminReportsPage = lazy(() => import("./pages/admin/Reports"));
const AdminMessagesPage = lazy(() => import("./pages/admin/Messages"));
const AdminLiveChatPage = lazy(() => import("./pages/admin/LiveChat"));
const AdminCustomerServicePage = lazy(() => import("./pages/admin/CustomerService"));
const AdminVehicleValuesPage = lazy(() => import("./pages/admin/VehicleValues"));
const AdminGpsPage = lazy(() => import("./pages/admin/Gps"));
const AdminCheckInOutPage = lazy(() => import("./pages/admin/CheckInOut"));
const AdminCorporatePage = lazy(() => import("./pages/admin/Corporate"));
const AdminFacebookPage = lazy(() => import("./pages/admin/Facebook"));
const AdminStatsPage = lazy(() => import("./pages/admin/Stats"));
// AdminSalesAIPage removed - functionality merged into CRM
const SalesAIAddLeadPage = lazy(() => import("./pages/admin/SalesAIAddLead"));
const SalesAIImportPage = lazy(() => import("./pages/admin/SalesAIImport"));
const SalesAIEmailPage = lazy(() => import("./pages/admin/SalesAIEmail"));
const SalesAICarAdPage = lazy(() => import("./pages/admin/SalesAICarAd"));
const SalesAICompanySearchPage = lazy(() => import("./pages/admin/SalesAICompanySearch"));
const SalesAIOutreachPage = lazy(() => import("./pages/admin/SalesAIOutreach"));
const DiscountsAddPage = lazy(() => import("./pages/admin/DiscountsAdd"));
const AdminApiKeysPage = lazy(() => import("./pages/admin/ApiKeys"));
const StaffAddPage = lazy(() => import("./pages/admin/StaffAdd"));
const CorporateAddPage = lazy(() => import("./pages/admin/CorporateAdd"));
const CorporateDetailPage = lazy(() => import("./pages/admin/CorporateDetail"));
const GpsAddPage = lazy(() => import("./pages/admin/GpsAdd"));
const BookingsAddPage = lazy(() => import("./pages/admin/BookingsAdd"));
const UserEditPage = lazy(() => import("./pages/admin/UserEdit"));
const FleetVehicleEditPage = lazy(() => import("./pages/admin/FleetVehicleEdit"));
const DriverLicenseReviewPage = lazy(() => import("./pages/admin/DriverLicenseReview"));
const AdminAuditLogPage = lazy(() => import("./pages/admin/AuditLog"));
const AdminCRMPage = lazy(() => import("./pages/admin/CRM"));
const AdminFeatureFlagsPage = lazy(() => import("./pages/admin/FeatureFlags"));
const CorporateEmployeeAdmin = lazy(() => import("./pages/admin/CorporateEmployeeAdmin"));
const CorporateBudgetDashboard = lazy(() => import("./pages/admin/CorporateBudgetDashboard"));
const CorporateSettlementReports = lazy(() => import("./pages/admin/CorporateSettlementReports"));

// Redirect component for /search/booking/:vehicleId → /booking/:vehicleId
const SearchBookingRedirect = () => {
  const { vehicleId } = useParams();
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  return <Navigate to={`/booking/${vehicleId}${queryString ? `?${queryString}` : ''}`} replace />;
};

// Optimized QueryClient configuration for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache for reuse
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false, // Don't refetch when user returns to tab
      refetchOnReconnect: true, // Refetch if connection lost
      refetchOnMount: true, // Refetch if component remounts
      networkMode: 'always', // Try offline queries
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
      networkMode: 'always',
    }
  }
});

// Minimal loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = forwardRef((props, ref) => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
                {/* QR check-in route for scanned QR codes */}
                <Route path="/checkin/:contractId" element={<CheckinPage />} />
              {/* Dashboard sub-routes */}
              <Route path="/dashboard/vehicles" element={<VehiclesPage />} />
              <Route path="/dashboard/vehicles/add" element={<AddVehiclePage />} />
              <Route path="/dashboard/calendar" element={<CalendarPage />} />
              <Route path="/dashboard/bookings" element={<BookingsPage />} />
              <Route path="/dashboard/bookings/create" element={<CreateBookingPage />} />
              <Route path="/dashboard/locations" element={<LocationsPage />} />
              <Route path="/dashboard/locations/add" element={<LocationAddPage />} />
              <Route path="/dashboard/locations/edit/:id" element={<LocationEditPage />} />
              <Route path="/dashboard/invoices" element={<InvoicesPage />} />
              <Route path="/dashboard/fines" element={<FinesPage />} />
              <Route path="/dashboard/fines/add" element={<FinesAddPage />} />
              <Route path="/dashboard/revenue-loss" element={<RevenueLossPage />} />
              <Route path="/dashboard/customers" element={<CustomersPage />} />
              <Route path="/dashboard/favorites" element={<FavoritesPage />} />
              <Route path="/dashboard/recurring" element={<RecurringPage />} />
              <Route path="/dashboard/service" element={<ServicePage />} />
              <Route path="/dashboard/service/add" element={<ServiceTaskAddPage />} />
              <Route path="/dashboard/tires" element={<TiresPage />} />
              <Route path="/dashboard/inspections" element={<InspectionsPage />} />
              <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
              <Route path="/dashboard/ai-pricing" element={<AIPricingPage />} />
              <Route path="/dashboard/fleet-ai" element={<FleetAIPage />} />
              <Route path="/dashboard/fleet" element={<FleetPage />} />
              <Route path="/dashboard/deductibles" element={<DeductiblesPage />} />
              <Route path="/dashboard/vehicles/edit/:id" element={<EditVehiclePage />} />
              <Route path="/dashboard/contract/sign/:id" element={<ContractSignPage />} />
              <Route path="/dashboard/damage-report/:bookingId" element={<DamageReportPage />} />
              <Route path="/dashboard/rate-lessor/:bookingId" element={<RateLessorPage />} />
              <Route path="/dashboard/rate-renter/:bookingId" element={<RateRenterPage />} />
              <Route path="/dashboard/settlement/:bookingId" element={<SettlementPage />} />
              <Route path="/dashboard/checkinout/:bookingId" element={<CheckInOutPage />} />
              <Route path="/dashboard/scan-history/:bookingId" element={<ScanHistoryPage />} />
              <Route path="/dashboard/vehicle-swap/:bookingId" element={<VehicleSwapPage />} />
              <Route path="/dashboard/warnings" element={<WarningsPage />} />
              <Route path="/dashboard/warnings/create" element={<CreateWarningPage />} />
              <Route path="/dashboard/api-keys" element={<ApiKeysPage />} />
              <Route path="/gps/add-device" element={<AddGpsDevicePage />} />
              <Route path="/gps/add-geofence" element={<AddGeofencePage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/search" element={<Search />} />
              <Route path="/search/vehicle/:vehicleId" element={<VehicleDetailPage />} />
              <Route path="/search/booking/:vehicleId" element={<SearchBookingRedirect />} />
              <Route path="/booking/:vehicleId" element={<Booking />} />
              <Route path="/fleet-demo" element={<FleetDemo />} />
              <Route path="/fleet-widget" element={<FleetWidgetDemo />} />
              <Route path="/my-rentals" element={<MyRentals />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminAuthProvider><AdminDashboard /></AdminAuthProvider>} />
              {/* Admin sub-routes - wrapped in AdminAuthProvider */}
              <Route path="/admin/users" element={<AdminAuthProvider><AdminUsersPage /></AdminAuthProvider>} />
              <Route path="/admin/staff" element={<AdminAuthProvider><AdminStaffPage /></AdminAuthProvider>} />
              <Route path="/admin/bookings" element={<AdminAuthProvider><AdminBookingsPage /></AdminAuthProvider>} />
              <Route path="/admin/bookings/add" element={<AdminAuthProvider><BookingsAddPage /></AdminAuthProvider>} />
              <Route path="/admin/locations" element={<AdminAuthProvider><AdminLocationsPage /></AdminAuthProvider>} />
              <Route path="/admin/fees" element={<AdminAuthProvider><AdminFeesPage /></AdminAuthProvider>} />
              <Route path="/admin/feature-flags" element={<AdminAuthProvider><AdminFeatureFlagsPage /></AdminAuthProvider>} />
              <Route path="/admin/discounts" element={<AdminAuthProvider><AdminDiscountsPage /></AdminAuthProvider>} />
              <Route path="/admin/discounts/add" element={<AdminAuthProvider><DiscountsAddPage /></AdminAuthProvider>} />
              <Route path="/admin/fleet" element={<AdminAuthProvider><AdminFleetPage /></AdminAuthProvider>} />
              <Route path="/admin/fleet/edit/:id" element={<AdminAuthProvider><FleetVehicleEditPage /></AdminAuthProvider>} />
              <Route path="/admin/staff/add" element={<AdminAuthProvider><StaffAddPage /></AdminAuthProvider>} />
              <Route path="/admin/corporate/add" element={<AdminAuthProvider><CorporateAddPage /></AdminAuthProvider>} />
              <Route path="/admin/corporate/:id" element={<AdminAuthProvider><CorporateDetailPage /></AdminAuthProvider>} />
              <Route path="/admin/warnings" element={<AdminAuthProvider><AdminWarningsPage /></AdminAuthProvider>} />
              <Route path="/admin/reports" element={<AdminAuthProvider><AdminReportsPage /></AdminAuthProvider>} />
              <Route path="/admin/messages" element={<AdminAuthProvider><AdminMessagesPage /></AdminAuthProvider>} />
              <Route path="/admin/invoices" element={<AdminAuthProvider><AdminInvoicesPage /></AdminAuthProvider>} />
              <Route path="/admin/live-chat" element={<AdminAuthProvider><AdminLiveChatPage /></AdminAuthProvider>} />
              <Route path="/admin/customer-service" element={<AdminAuthProvider><AdminCustomerServicePage /></AdminAuthProvider>} />
              <Route path="/admin/vehicle-values" element={<AdminAuthProvider><AdminVehicleValuesPage /></AdminAuthProvider>} />
              <Route path="/admin/gps" element={<AdminAuthProvider><AdminGpsPage /></AdminAuthProvider>} />
              <Route path="/admin/gps/add" element={<AdminAuthProvider><GpsAddPage /></AdminAuthProvider>} />
              <Route path="/admin/users/edit/:id" element={<AdminAuthProvider><UserEditPage /></AdminAuthProvider>} />
              <Route path="/admin/checkinout" element={<AdminAuthProvider><AdminCheckInOutPage /></AdminAuthProvider>} />
              <Route path="/admin/corporate" element={<AdminAuthProvider><AdminCorporatePage /></AdminAuthProvider>} />
              <Route path="/admin/corporate/employees" element={<AdminAuthProvider><CorporateEmployeeAdmin /></AdminAuthProvider>} />
              <Route path="/admin/corporate/budget" element={<AdminAuthProvider><CorporateBudgetDashboard /></AdminAuthProvider>} />
              <Route path="/admin/corporate/settlement" element={<AdminAuthProvider><CorporateSettlementReports /></AdminAuthProvider>} />
              <Route path="/admin/facebook" element={<AdminAuthProvider><AdminFacebookPage /></AdminAuthProvider>} />
              <Route path="/admin/api-keys" element={<AdminAuthProvider><AdminApiKeysPage /></AdminAuthProvider>} />
              <Route path="/admin/sales-ai" element={<Navigate to="/admin/crm" replace />} />
              <Route path="/admin/sales-ai/add" element={<AdminAuthProvider><SalesAIAddLeadPage /></AdminAuthProvider>} />
              <Route path="/admin/sales-ai/import" element={<AdminAuthProvider><SalesAIImportPage /></AdminAuthProvider>} />
              <Route path="/admin/sales-ai/email/:id" element={<AdminAuthProvider><SalesAIEmailPage /></AdminAuthProvider>} />
              <Route path="/admin/sales-ai/outreach/:id" element={<AdminAuthProvider><SalesAIOutreachPage /></AdminAuthProvider>} />
              <Route path="/admin/sales-ai/car-ad" element={<AdminAuthProvider><SalesAICarAdPage /></AdminAuthProvider>} />
              <Route path="/admin/sales-ai/company-search" element={<AdminAuthProvider><SalesAICompanySearchPage /></AdminAuthProvider>} />
              <Route path="/admin/stats" element={<AdminAuthProvider><AdminStatsPage /></AdminAuthProvider>} />
              <Route path="/admin/driver-licenses" element={<AdminAuthProvider><DriverLicenseReviewPage /></AdminAuthProvider>} />
              <Route path="/admin/global-pages" element={<AdminAuthProvider><AdminGlobalPages /></AdminAuthProvider>} />
              <Route path="/admin/audit-log" element={<AdminAuthProvider><AdminAuditLogPage /></AdminAuthProvider>} />
              <Route path="/admin/crm" element={<AdminAuthProvider><AdminCRMPage /></AdminAuthProvider>} />
              <Route path="/privatlivspolitik" element={<PrivacyPolicy />} />
              <Route path="/handelsbetingelser" element={<Terms />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/beskeder" element={<Messages />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/install" element={<Install />} />
              <Route path="/gps" element={<GpsTracking />} />
              <Route path="/funktioner" element={<Features />} />
              <Route path="/corporate" element={<CorporateDashboard />} />
              <Route path="/corporate/add-vehicle" element={<CorporateAddFleetVehiclePage />} />
              <Route path="/corporate/booking" element={<CorporateCreateBookingPage />} />
              <Route path="/privat-fleet" element={<PrivateFleet />} />
              <Route path="/fleet-loesning" element={<PrivateFleet />} />
              <Route path="/om-os" element={<About />} />
              <Route path="/hvad-er-lejio" element={<WhatIsLejio />} />
              <Route path="/bliv-udlejer" element={<BecomeLessor />} />
              <Route path="/udlejervilkaar" element={<LessorTerms />} />
              <Route path="/forhandler" element={<Forhandler />} />
              <Route path="/forhandler-opret" element={<DealerRegistration />} />
              <Route path="/kontakt" element={<Contact />} />
              <Route path="/side/:slug" element={<GlobalPage />} />
              <Route path="/forhandler/:id" element={<DealerProfile />} />
              <Route path="/dealer/website-settings" element={<DealerWebsiteSettings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="/abonnementsudlejning" element={<SubscriptionRental />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ConditionalLiveChat />
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
));

App.displayName = 'App';

export default App;
