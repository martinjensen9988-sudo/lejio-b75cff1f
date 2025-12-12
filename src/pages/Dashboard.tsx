import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useVehicles } from '@/hooks/useVehicles';
import { useBookings } from '@/hooks/useBookings';
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
import { Car, Calendar, LogOut, Home, Loader2, Settings, CalendarDays, BarChart3, Repeat } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { vehicles, isLoading: vehiclesLoading, updateVehicle, deleteVehicle } = useVehicles();
  const { bookings, isLoading: bookingsLoading, updateBookingStatus, refetch: refetchBookings } = useBookings();

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
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LejioLogo size="sm" />
              <div className="hidden sm:block h-6 w-px bg-border" />
              <h1 className="hidden sm:block font-display font-bold text-foreground">Dashboard</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border">
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
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <Home className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Trial Status for Professional Users */}
        <div className="mb-6">
          <TrialStatusCard />
        </div>

        {/* Pending Fees for Private Users */}
        <div className="mb-6">
          <PendingFeesCard />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
            label="Aktive udlejninger"
            value={activeBookings}
            loading={bookingsLoading}
          />
          <StatCard
            icon={Calendar}
            label="Total bookinger"
            value={bookings.length}
            loading={bookingsLoading}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="vehicles" className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <TabsList className="flex-wrap">
              <TabsTrigger value="vehicles" className="gap-2">
                <Car className="w-4 h-4" />
                <span className="hidden sm:inline">Mine biler</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-2">
                <CalendarDays className="w-4 h-4" />
                <span className="hidden sm:inline">Kalender</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Bookinger</span>
                {pendingBookings > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-accent text-accent-foreground">
                    {pendingBookings}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="recurring" className="gap-2">
                <Repeat className="w-4 h-4" />
                <span className="hidden sm:inline">Abonnementer</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
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

          <TabsContent value="recurring" className="mt-6">
            <RecurringRentalsTable />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsDashboard />
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
  <div className={`bg-card rounded-2xl p-5 border ${highlight ? 'border-accent shadow-glow-peach' : 'border-border'}`}>
    <div className="flex items-center gap-3 mb-2">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${highlight ? 'bg-accent/20' : 'bg-muted'}`}>
        <Icon className={`w-5 h-5 ${highlight ? 'text-accent' : 'text-muted-foreground'}`} />
      </div>
    </div>
    {loading ? (
      <Skeleton className="h-8 w-12" />
    ) : (
      <p className="font-display text-3xl font-black text-foreground">{value}</p>
    )}
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export default Dashboard;
