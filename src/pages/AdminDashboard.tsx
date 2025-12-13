import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Users, Car, Calendar, CreditCard, Tag, 
  LogOut, Loader2, CheckCircle, XCircle, Clock,
  Plus, Search, MoreHorizontal, Eye, Receipt, Truck, AlertTriangle, Flag, UserCog, MessageCircle, Headphones, ShieldCheck, MapPin, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import AdminDiscountCodes from '@/components/admin/AdminDiscountCodes';
import AdminCreateBooking from '@/components/admin/AdminCreateBooking';
import AdminPlatformFees from '@/components/admin/AdminPlatformFees';
import AdminFleetManagement from '@/components/admin/AdminFleetManagement';
import AdminWarnings from '@/components/admin/AdminWarnings';
import AdminUserManagement from '@/components/admin/AdminUserManagement';
import AdminLessorReports from '@/components/admin/AdminLessorReports';
import AdminMessages from '@/components/admin/AdminMessages';
import { AdminLiveChat } from '@/components/admin/AdminLiveChat';
import AdminVehicleValueVerification from '@/components/admin/AdminVehicleValueVerification';
import AdminGpsDevices from '@/components/admin/AdminGpsDevices';
import AdminBookingStats from '@/components/admin/AdminBookingStats';

interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  user_type: string;
  subscription_status: string;
  trial_ends_at: string | null;
  manual_activation: boolean;
  created_at: string;
}

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isSuperAdmin, isLoading, signOut } = useAdminAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [showCreateBooking, setShowCreateBooking] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isSuperAdmin)) {
      navigate('/admin');
    }
  }, [user, isSuperAdmin, isLoading, navigate]);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchData();
    }
  }, [isSuperAdmin]);

  const fetchData = async () => {
    setLoadingData(true);
    
    // Fetch customers
    const { data: customersData, error: customersError } = await supabase
      .from('profiles')
      .select('id, email, full_name, company_name, user_type, subscription_status, trial_ends_at, manual_activation, created_at')
      .order('created_at', { ascending: false });

    if (customersError) {
      console.error('Error fetching customers:', customersError);
    } else {
      setCustomers(customersData || []);
    }

    // Fetch bookings
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, vehicle_id, start_date, end_date, status, total_price, renter_name, renter_email, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
    } else {
      setBookings(bookingsData || []);
    }

    setLoadingData(false);
  };

  const handleActivateCustomer = async (customerId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        manual_activation: true,
        subscription_status: 'active'
      })
      .eq('id', customerId);

    if (error) {
      toast.error('Kunne ikke aktivere kunden');
      return;
    }

    toast.success('Kunde aktiveret!');
    fetchData();
  };

  const handleDeactivateCustomer = async (customerId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        manual_activation: false,
        subscription_status: 'inactive'
      })
      .eq('id', customerId);

    if (error) {
      toast.error('Kunne ikke deaktivere kunden');
      return;
    }

    toast.success('Kunde deaktiveret');
    fetchData();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  const filteredCustomers = customers.filter(c => 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string, manualActivation: boolean) => {
    if (manualActivation) {
      return <Badge className="bg-blue-500">Manuel aktivering</Badge>;
    }
    switch (status) {
      case 'active':
        return <Badge className="bg-accent">Aktiv</Badge>;
      case 'trial':
        return <Badge variant="secondary">Prøveperiode</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inaktiv</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.subscription_status === 'active' || c.manual_activation).length,
    trialCustomers: customers.filter(c => c.subscription_status === 'trial').length,
    totalBookings: bookings.length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">LEJIO Admin</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Log ud
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                  <p className="text-sm text-muted-foreground">Kunder i alt</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeCustomers}</p>
                  <p className="text-sm text-muted-foreground">Aktive</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.trialCustomers}</p>
                  <p className="text-sm text-muted-foreground">Prøveperiode</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warm/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-warm" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                  <p className="text-sm text-muted-foreground">Bookinger</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="users">
              <UserCog className="w-4 h-4 mr-2" />
              Brugerstyring
            </TabsTrigger>
            <TabsTrigger value="bookings">
              <Calendar className="w-4 h-4 mr-2" />
              Bookinger
            </TabsTrigger>
            <TabsTrigger value="fees">
              <Receipt className="w-4 h-4 mr-2" />
              Gebyrer
            </TabsTrigger>
            <TabsTrigger value="discounts">
              <Tag className="w-4 h-4 mr-2" />
              Rabatkoder
            </TabsTrigger>
            <TabsTrigger value="fleet">
              <Truck className="w-4 h-4 mr-2" />
              Fleet
            </TabsTrigger>
            <TabsTrigger value="warnings">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Advarsler (Lejere)
            </TabsTrigger>
            <TabsTrigger value="lessor-reports">
              <Flag className="w-4 h-4 mr-2" />
              Rapporter (Udlejere)
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageCircle className="w-4 h-4 mr-2" />
              Beskeder
            </TabsTrigger>
            <TabsTrigger value="live-chat">
              <Headphones className="w-4 h-4 mr-2" />
              Live Chat
            </TabsTrigger>
            <TabsTrigger value="vehicle-values">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Bilværdier
            </TabsTrigger>
            <TabsTrigger value="gps">
              <MapPin className="w-4 h-4 mr-2" />
              GPS-enheder
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="w-4 h-4 mr-2" />
              Booking-statistik
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users">
            <AdminUserManagement />
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Bookinger</CardTitle>
                    <CardDescription>Se og opret bookinger</CardDescription>
                  </div>
                  <Button onClick={() => setShowCreateBooking(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Opret booking
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
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
                            <p className="font-medium">{booking.renter_name || 'Ukendt'}</p>
                            <p className="text-sm text-muted-foreground">{booking.renter_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(booking.start_date), 'dd. MMM', { locale: da })} - {format(new Date(booking.end_date), 'dd. MMM yyyy', { locale: da })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{booking.total_price.toLocaleString('da-DK')} kr</TableCell>
                        <TableCell>
                          {format(new Date(booking.created_at), 'dd. MMM yyyy', { locale: da })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Platform Fees Tab */}
          <TabsContent value="fees">
            <AdminPlatformFees />
          </TabsContent>

          {/* Discount Codes Tab */}
          <TabsContent value="discounts">
            <AdminDiscountCodes />
          </TabsContent>

          {/* Fleet Management Tab */}
          <TabsContent value="fleet">
            <AdminFleetManagement />
          </TabsContent>

          {/* Warnings Tab */}
          <TabsContent value="warnings">
            <AdminWarnings />
          </TabsContent>

          {/* Lessor Reports Tab */}
          <TabsContent value="lessor-reports">
            <AdminLessorReports />
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <AdminMessages />
          </TabsContent>

          {/* Live Chat Tab */}
          <TabsContent value="live-chat">
            <AdminLiveChat />
          </TabsContent>

          {/* Vehicle Value Verification Tab */}
          <TabsContent value="vehicle-values">
            <AdminVehicleValueVerification />
          </TabsContent>

          {/* GPS Devices Tab */}
          <TabsContent value="gps">
            <AdminGpsDevices />
          </TabsContent>

          {/* Booking Stats Tab */}
          <TabsContent value="stats">
            <AdminBookingStats />
          </TabsContent>
        </Tabs>

        {/* Create Booking Dialog */}
        <AdminCreateBooking 
          open={showCreateBooking} 
          onClose={() => setShowCreateBooking(false)}
          onSuccess={() => {
            setShowCreateBooking(false);
            fetchData();
          }}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
