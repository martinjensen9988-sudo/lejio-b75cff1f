import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useVehicles } from '@/hooks/useVehicles';
import { useBookings } from '@/hooks/useBookings';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import BookingCalendar from '@/components/dashboard/BookingCalendar';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Loader2, Plus } from 'lucide-react';

const CalendarPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { bookings, isLoading: bookingsLoading } = useBookings();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout activeTab="calendar">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Booking-kalender</h2>
            <p className="text-muted-foreground">Overblik over alle bookinger</p>
          </div>
          <Button onClick={() => navigate('/dashboard/bookings/create')} className="gap-2">
            <Plus className="w-4 h-4" />
            Manuel booking
          </Button>
        </div>
        {bookingsLoading || vehiclesLoading ? (
          <Skeleton className="h-[600px] rounded-2xl" />
        ) : (
          <BookingCalendar bookings={bookings} vehicles={vehicles} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
