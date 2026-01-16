import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminCreateBooking from '@/components/admin/AdminCreateBooking';
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

interface AdminBooking {
  id: string;
  vehicle_id: string;
  start_date: string;
  end_date: string;
  status: string;
  total_price: number;
  renter_name: string | null;
  renter_email: string | null;
  created_at: string;
}

const AdminBookingsPage = () => {
  const navigate = useNavigate();
  const { user, hasAccess, isLoading } = useAdminAuth();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showCreateBooking, setShowCreateBooking] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !hasAccess)) {
      navigate('/admin');
    }
  }, [user, hasAccess, isLoading, navigate]);

  useEffect(() => {
    if (hasAccess) {
      fetchBookings();
    }
  }, [hasAccess]);

  const fetchBookings = async () => {
    setLoadingData(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('id, vehicle_id, start_date, end_date, status, total_price, renter_name, renter_email, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (!error) {
      setBookings(data || []);
    }
    setLoadingData(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AdminDashboardLayout activeTab="bookings">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Bookinger</h2>
            <p className="text-muted-foreground">Se og opret bookinger</p>
          </div>
          <Button onClick={() => setShowCreateBooking(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Opret booking
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Alle bookinger</CardTitle>
            <CardDescription>De seneste 100 bookinger</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lejer</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pris</TableHead>
                    <TableHead>Oprettet</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{booking.renter_name || 'Ukendt'}</p>
                          <p className="text-xs text-muted-foreground">{booking.renter_email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(booking.start_date), 'd. MMM', { locale: da })} - {format(new Date(booking.end_date), 'd. MMM', { locale: da })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{booking.total_price.toLocaleString('da-DK')} kr</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(booking.created_at), 'd. MMM yyyy', { locale: da })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <AdminCreateBooking 
          open={showCreateBooking} 
          onClose={() => setShowCreateBooking(false)}
          onSuccess={() => {
            setShowCreateBooking(false);
            fetchBookings();
          }}
        />
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminBookingsPage;
