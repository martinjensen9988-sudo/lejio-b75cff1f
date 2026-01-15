import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useVehicles } from '@/hooks/useVehicles';
import { useBookings } from '@/hooks/useBookings';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
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
import { Car, Calendar, LogOut, Home, Loader2, Settings, CalendarDays, BarChart3, Repeat, MessageCircle, FileText, Search, MapPin, Wrench, Receipt, Users, Heart, Sparkles, CircleDot, Shield } from 'lucide-react';
import { AIPriceSuggestions } from '@/components/dashboard/AIPriceSuggestions';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { vehicles, isLoading: vehiclesLoading, updateVehicle, deleteVehicle } = useVehicles();
  const { bookings, isLoading: bookingsLoading, updateBookingStatus, refetch: refetchBookings } = useBookings();
  const { unreadCount } = useUnreadMessages();

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <LejioLogo size="sm" />
              <div className="hidden sm:block h-6 w-px bg-border" />
              <h1 className="hidden sm:block font-display font-bold text-foreground">Dashboard</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => navigate('/search')}>
                <Search className="w-4 h-4 mr-2" />
                Find bil
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/my-rentals')}>
                <FileText className="w-4 h-4 mr-2" />
                Mine lejeaftaler
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/messages')} className="relative">
                <MessageCircle className="w-4 h-4 mr-2" />
                Beskeder
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 flex items-center justify-center text-xs font-bold bg-destructive text-destructive-foreground rounded-full px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border">
                <div className={`w-2 h-2 rounded-full ${profile?.user_type === 'professionel' ? 'bg-primary' : 'bg-accent'}`} />
                <span className="text-sm font-medium text-foreground">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
                {profile?.user_type === 'professionel' && (
                  <span className="text-xs px-1.5 py-0.5 rounded-md bg-primary/20 text-primary font-medium">Pro</span>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <LogOut className="w-4 h-4 mr-2" />
                Log ud
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center gap-2">
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
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Quick Navigation */}
      <div className="md:hidden bg-card border-b border-border overflow-x-auto">
        <div className="flex gap-2 px-4 py-2">
          <Button variant="outline" size="sm" className="shrink-0" onClick={() => navigate('/search')}>
            <Search className="w-4 h-4 mr-1" />
            Find bil
          </Button>
          <Button variant="outline" size="sm" className="shrink-0" onClick={() => navigate('/my-rentals')}>
            <FileText className="w-4 h-4 mr-1" />
            Mine lejeaftaler
          </Button>
          <Button variant="outline" size="sm" className="shrink-0" onClick={() => navigate('/gps')}>
            <MapPin className="w-4 h-4 mr-1" />
            GPS
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Trial Status for Professional Users */}
        <div className="mb-6">
          <TrialStatusCard />
        </div>

        {/* Pending Fees for Private Users */}
        <div className="mb-6">
          <PendingFeesCard />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8">
          <StatCard
            icon={Car}
            label="Dine biler"
            value={vehicles.length}
            loading={vehiclesLoading}
          />
          <StatCard
            icon={Calendar}
            label="Afventende"
            value={pendingBookings}
            loading={bookingsLoading}
            highlight={pendingBookings > 0}
          />
          <StatCard
            icon={Calendar}
            label="Aktive"
            value={activeBookings}
            loading={bookingsLoading}
          />
          <StatCard
            icon={Calendar}
            label="Total"
            value={bookings.length}
            loading={bookingsLoading}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="vehicles" className="space-y-4 sm:space-y-6">
          {/* Mobile: Scrollable tabs */}
          <div className="flex flex-col gap-3">
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <TabsList className="w-max sm:w-auto inline-flex">
                <TabsTrigger value="vehicles" className="gap-1.5 px-2 sm:px-3 text-xs sm:text-sm">
                  <Car className="w-4 h-4" />
                  <span>Biler</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-1.5 px-2 sm:px-3 text-xs sm:text-sm">
                  <CalendarDays className="w-4 h-4" />
                  <span className="hidden xs:inline">Kalender</span>
                </TabsTrigger>
                <TabsTrigger value="bookings" className="gap-1.5 px-2 sm:px-3 text-xs sm:text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Bookinger</span>
                  {pendingBookings > 0 && (
                    <span className="ml-0.5 px-1 py-0.5 text-[10px] rounded-full bg-accent text-accent-foreground">
                      {pendingBookings}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="invoices" className="gap-1.5 px-2 sm:px-3 text-xs sm:text-sm">
                  <Receipt className="w-4 h-4" />
                  <span className="hidden sm:inline">Fakturaer</span>
                </TabsTrigger>
                <TabsTrigger value="customers" className="gap-1.5 px-2 sm:px-3 text-xs sm:text-sm">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Kunder</span>
                </TabsTrigger>
                <TabsTrigger value="favorites" className="gap-1.5 px-2 sm:px-3 text-xs sm:text-sm">
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Favoritter</span>
                </TabsTrigger>
                <TabsTrigger value="recurring" className="gap-1.5 px-2 sm:px-3 text-xs sm:text-sm">
                  <Repeat className="w-4 h-4" />
                  <span className="hidden sm:inline">Abonnementer</span>
                </TabsTrigger>
                <TabsTrigger value="service" className="gap-1.5 px-2 sm:px-3 text-xs sm:text-sm">
                  <Wrench className="w-4 h-4" />
                  <span className="hidden sm:inline">Værksted</span>
                </TabsTrigger>
                <TabsTrigger value="tires" className="gap-1.5 px-2 sm:px-3 text-xs sm:text-sm">
                  <CircleDot className="w-4 h-4" />
                  <span className="hidden sm:inline">Dæk</span>
                </TabsTrigger>
                <TabsTrigger value="inspections" className="gap-1.5 px-2 sm:px-3 text-xs sm:text-sm">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Syn</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="gap-1.5 px-2 sm:px-3 text-xs sm:text-sm">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="ai-pricing" className="gap-1.5 px-2 sm:px-3 text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">AI Priser</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex gap-2 flex-wrap">
              <CreateBookingDialog vehicles={vehicles} onBookingCreated={refetchBookings} />
              <AddVehicleDialog />
            </div>
          </div>

          <TabsContent value="vehicles" className="mt-6">
            {vehiclesLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  Tilføj din første bil ved at indtaste nummerpladen. Vi henter automatisk bildata fra Motorregisteret.
                </p>
                <AddVehicleDialog />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            {bookingsLoading || vehiclesLoading ? (
              <Skeleton className="h-[600px] rounded-2xl" />
            ) : (
              <BookingCalendar bookings={bookings} vehicles={vehicles} />
            )}
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            {bookingsLoading ? (
              <Skeleton className="h-64 rounded-2xl" />
            ) : (
              <BookingsTable bookings={bookings} onUpdateStatus={updateBookingStatus} />
            )}
          </TabsContent>

          <TabsContent value="invoices" className="mt-6">
            <InvoicesTab />
          </TabsContent>

          <TabsContent value="customers" className="mt-6">
            <CustomerSegmentsTab />
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <FavoritesTab />
          </TabsContent>

          <TabsContent value="recurring" className="mt-6">
            <RecurringRentalsTable />
          </TabsContent>

          <TabsContent value="service" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <ServiceTab vehicles={vehicles} onUpdate={updateVehicle} />
              <ServiceRemindersCard vehicles={vehicles.map(v => ({
                id: v.id,
                make: v.make,
                model: v.model,
                registration: v.registration
              }))} />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="tires" className="mt-6">
            <TireManagementTab vehicles={vehicles} />
          </TabsContent>

          <TabsContent value="inspections" className="mt-6">
            <InspectionRemindersTab vehicles={vehicles} />
          </TabsContent>

          <TabsContent value="ai-pricing" className="mt-6">
            <AIPriceSuggestions vehicles={vehicles} onApplyPrice={async (id, updates) => updateVehicle(id, updates)} />
          </TabsContent>
        </Tabs>
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
}

const StatCard = ({ icon: Icon, label, value, loading, highlight }: StatCardProps) => (
  <div className={`bg-card rounded-xl sm:rounded-2xl p-3 sm:p-5 border ${highlight ? 'border-accent shadow-glow-peach' : 'border-border'}`}>
    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center ${highlight ? 'bg-accent/20' : 'bg-muted'}`}>
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${highlight ? 'text-accent' : 'text-muted-foreground'}`} />
      </div>
    </div>
    {loading ? (
      <Skeleton className="h-6 sm:h-8 w-10 sm:w-12" />
    ) : (
      <p className="font-display text-2xl sm:text-3xl font-black text-foreground">{value}</p>
    )}
    <p className="text-xs sm:text-sm text-muted-foreground truncate">{label}</p>
  </div>
);

export default Dashboard;
