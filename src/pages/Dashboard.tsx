import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useVehicles } from '@/hooks/useVehicles';
import { useBookings } from '@/hooks/useBookings';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import LejioLogo from '@/components/LejioLogo';
import AddVehicleDialog from '@/components/dashboard/AddVehicleDialog';
import VehicleCard from '@/components/dashboard/VehicleCard';
import BookingsTable from '@/components/dashboard/BookingsTable';
import BookingCalendar from '@/components/dashboard/BookingCalendar';
import CreateBookingDialog from '@/components/dashboard/CreateBookingDialog';
import PendingFeesCard from '@/components/dashboard/PendingFeesCard';
import TrialStatusCard from '@/components/dashboard/TrialStatusCard';
import AnalyticsDashboard from '@/components/dashboard/AnalyticsDashboard';
import RecurringRentalsTable from '@/components/dashboard/RecurringRentalsTable';
import ServiceTab from '@/components/dashboard/ServiceTab';
import InvoicesTab from '@/components/dashboard/InvoicesTab';
import CustomerSegmentsTab from '@/components/dashboard/CustomerSegmentsTab';
import FavoritesTab from '@/components/dashboard/FavoritesTab';
import ServiceRemindersCard from '@/components/dashboard/ServiceRemindersCard';
import TireManagementTab from '@/components/dashboard/TireManagementTab';
import InspectionRemindersTab from '@/components/dashboard/InspectionRemindersTab';
import FinesTab from '@/components/dashboard/FinesTab';
import { ServiceBookingCard } from '@/components/dashboard/ServiceBookingCard';
import { MCMaintenanceCard } from '@/components/dashboard/MCMaintenanceCard';
import { AutoDispatchCard } from '@/components/dashboard/AutoDispatchCard';
import { ServiceTasksCard } from '@/components/dashboard/ServiceTasksCard';
import { DeductibleProfilesCard } from '@/components/dashboard/DeductibleProfilesCard';
import { RevenueLossCard } from '@/components/dashboard/RevenueLossCard';
import { AIPriceSuggestions } from '@/components/dashboard/AIPriceSuggestions';
import { 
  Car, 
  Calendar, 
  Loader2, 
  Menu,
  X,
  MessageCircle,
  Settings,
  LogOut,
  Search,
  MapPin,
  FileText
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { vehicles, isLoading: vehiclesLoading, updateVehicle, deleteVehicle } = useVehicles();
  const { bookings, isLoading: bookingsLoading, updateBookingStatus, refetch: refetchBookings } = useBookings();
  const { unreadCount } = useUnreadMessages();
  const [activeTab, setActiveTab] = useState('vehicles');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleToggleAvailability = async (id: string, available: boolean) => {
    await updateVehicle(id, { is_available: available } as any);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const activeBookings = bookings.filter(b => b.status === 'active').length;

  const renderContent = () => {
    switch (activeTab) {
      case 'vehicles':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Mine biler</h2>
                <p className="text-muted-foreground">Administrer dine køretøjer</p>
              </div>
              <AddVehicleDialog />
            </div>
            {vehiclesLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-48 rounded-2xl" />
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  Ingen biler endnu
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Tilføj din første bil ved at indtaste nummerpladen.
                </p>
                <AddVehicleDialog />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {vehicles.map(vehicle => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onToggleAvailability={handleToggleAvailability}
                    onUpdate={updateVehicle}
                    onDelete={deleteVehicle}
                  />
                ))}
              </div>
            )}
          </div>
        );
      case 'calendar':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Booking-kalender</h2>
                <p className="text-muted-foreground">Overblik over alle bookinger</p>
              </div>
              <CreateBookingDialog vehicles={vehicles} onBookingCreated={refetchBookings} />
            </div>
            {bookingsLoading || vehiclesLoading ? (
              <Skeleton className="h-[600px] rounded-2xl" />
            ) : (
              <BookingCalendar bookings={bookings} vehicles={vehicles} />
            )}
          </div>
        );
      case 'bookings':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Bookinger</h2>
                <p className="text-muted-foreground">{pendingBookings} afventer godkendelse</p>
              </div>
              <CreateBookingDialog vehicles={vehicles} onBookingCreated={refetchBookings} />
            </div>
            {bookingsLoading ? (
              <Skeleton className="h-64 rounded-2xl" />
            ) : (
              <BookingsTable bookings={bookings} onUpdateStatus={updateBookingStatus} />
            )}
          </div>
        );
      case 'invoices':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Fakturaer</h2>
            <p className="text-muted-foreground mb-6">Opret og administrer fakturaer</p>
            <InvoicesTab />
          </div>
        );
      case 'customers':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Kundesegmenter</h2>
            <p className="text-muted-foreground mb-6">Opdel dine kunder i segmenter</p>
            <CustomerSegmentsTab />
          </div>
        );
      case 'favorites':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Favoritter</h2>
            <p className="text-muted-foreground mb-6">Dine favoritlejere</p>
            <FavoritesTab />
          </div>
        );
      case 'recurring':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Abonnementer</h2>
            <p className="text-muted-foreground mb-6">Månedlige lejeaftaler</p>
            <RecurringRentalsTable />
          </div>
        );
      case 'service':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Værksted & Service</h2>
            <p className="text-muted-foreground mb-6">Administrer service og vedligeholdelse</p>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <ServiceTab vehicles={vehicles} onUpdate={updateVehicle} />
                <ServiceRemindersCard vehicles={vehicles.map(v => ({
                  id: v.id,
                  make: v.make,
                  model: v.model,
                  registration: v.registration
                }))} />
                <MCMaintenanceCard vehicles={vehicles} />
              </div>
              <div className="space-y-6">
                <ServiceBookingCard />
                <ServiceTasksCard />
              </div>
            </div>
          </div>
        );
      case 'tires':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Dækstyring</h2>
            <p className="text-muted-foreground mb-6">Administrer sommer/vinterdæk</p>
            <TireManagementTab vehicles={vehicles} />
          </div>
        );
      case 'inspections':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Syn</h2>
            <p className="text-muted-foreground mb-6">Hold styr på synstidspunkter</p>
            <InspectionRemindersTab vehicles={vehicles} />
          </div>
        );
      case 'fines':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Bøder & Afgifter</h2>
            <p className="text-muted-foreground mb-6">Håndter bøder fra lejere</p>
            <FinesTab />
          </div>
        );
      case 'analytics':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Analytics</h2>
            <p className="text-muted-foreground mb-6">Indsigt i din forretning</p>
            <AnalyticsDashboard />
          </div>
        );
      case 'ai-pricing':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">AI Prissætning</h2>
            <p className="text-muted-foreground mb-6">Intelligente prisanbefalinger</p>
            <AIPriceSuggestions vehicles={vehicles} onApplyPrice={async (id, updates) => updateVehicle(id, updates)} />
          </div>
        );
      case 'fleet-ai':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Flåde AI</h2>
            <p className="text-muted-foreground mb-6">AI-drevet flådestyring og anbefalinger</p>
            <div className="grid lg:grid-cols-2 gap-6">
              <AutoDispatchCard />
              <ServiceTasksCard />
            </div>
          </div>
        );
      case 'deductibles':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Dynamisk Selvrisiko</h2>
            <p className="text-muted-foreground mb-6">Opret selvrisko-profiler for forskellige lejere</p>
            <DeductibleProfilesCard />
          </div>
        );
      case 'revenue-loss':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Tab af Indtægt</h2>
            <p className="text-muted-foreground mb-6">Beregn tabt indtægt ved skader</p>
            <RevenueLossCard />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          unreadCount={unreadCount}
          pendingBookings={pendingBookings}
          onSignOut={handleSignOut}
        />
      </div>

      {/* Mobile Header & Sidebar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <DashboardSidebar
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  unreadCount={unreadCount}
                  pendingBookings={pendingBookings}
                  onSignOut={handleSignOut}
                />
              </SheetContent>
            </Sheet>
            <LejioLogo size="sm" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/messages')} className="relative">
              <MessageCircle className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 flex items-center justify-center text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full px-0.5">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:h-screen lg:overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          {/* Stats Cards with gradient styling */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <StatCard
              icon={Car}
              label="Dine biler"
              value={vehicles.length}
              loading={vehiclesLoading}
              gradient="from-primary to-primary/60"
            />
            <StatCard
              icon={Calendar}
              label="Afventende"
              value={pendingBookings}
              loading={bookingsLoading}
              highlight={pendingBookings > 0}
              gradient="from-accent to-accent/60"
            />
            <StatCard
              icon={Calendar}
              label="Aktive"
              value={activeBookings}
              loading={bookingsLoading}
              gradient="from-mint to-mint/60"
            />
            <StatCard
              icon={Calendar}
              label="Total"
              value={bookings.length}
              loading={bookingsLoading}
              gradient="from-lavender to-lavender/60"
            />
          </div>

          {/* Trial/Pending Fees */}
          <div className="space-y-4 mb-6">
            <TrialStatusCard />
            <PendingFeesCard />
          </div>

          {/* Active Content */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  loading?: boolean;
  highlight?: boolean;
  gradient?: string;
}

const StatCard = ({ icon: Icon, label, value, loading, highlight, gradient = "from-primary to-primary/60" }: StatCardProps) => (
  <div className={`bg-card/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 border-2 transition-all hover:shadow-lg ${highlight ? 'border-accent shadow-lg shadow-accent/10' : 'border-border/50 hover:border-border'}`}>
    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
    </div>
    {loading ? (
      <Skeleton className="h-7 sm:h-9 w-12 sm:w-14" />
    ) : (
      <p className="font-display text-2xl sm:text-4xl font-black text-foreground">{value}</p>
    )}
    <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate">{label}</p>
  </div>
);

export default Dashboard;
