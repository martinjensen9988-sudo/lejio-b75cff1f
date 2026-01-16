import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Users, Car, Calendar, CreditCard, Tag, 
  LogOut, Loader2, CheckCircle, XCircle, Clock,
  Plus, Search, MoreHorizontal, Eye, Receipt, Truck, AlertTriangle, Flag, UserCog, MessageCircle, Headphones, ShieldCheck, MapPin, BarChart3, Menu, Camera, Building2, Facebook, UsersRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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
import { AdminCheckInOutSettings } from '@/components/admin/AdminCheckInOutSettings';
import AdminCorporateAccounts from '@/components/admin/AdminCorporateAccounts';
import AdminFacebookPosts from '@/components/admin/AdminFacebookPosts';
import { AdminStaffManagement } from '@/components/admin/AdminStaffManagement';
import AdminDealerLocations from '@/components/admin/AdminDealerLocations';

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
  const { user, hasAccess, isSuperAdmin, isLoading, signOut } = useAdminAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [showCreateBooking, setShowCreateBooking] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !hasAccess)) {
      navigate('/admin');
    }
  }, [user, hasAccess, isLoading, navigate]);

  useEffect(() => {
    if (hasAccess) {
      fetchData();
    }
  }, [hasAccess]);

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
    try {
      await signOut();
      navigate('/admin');
    } catch (error) {
      console.error('Sign out error:', error);
      // Force navigate even if signOut fails
      navigate('/admin');
    }
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

  const menuItems = [
    { value: 'users', icon: UserCog, label: 'Brugerstyring' },
    { value: 'staff', icon: UsersRound, label: 'Medarbejdere' },
    { value: 'bookings', icon: Calendar, label: 'Bookinger' },
    { value: 'locations', icon: MapPin, label: 'Lokationer' },
    { value: 'fees', icon: Receipt, label: 'Gebyrer' },
    { value: 'discounts', icon: Tag, label: 'Rabatkoder' },
    { value: 'fleet', icon: Truck, label: 'Fleet' },
    { value: 'warnings', icon: AlertTriangle, label: 'Advarsler' },
    { value: 'lessor-reports', icon: Flag, label: 'Rapporter' },
    { value: 'messages', icon: MessageCircle, label: 'Beskeder' },
    { value: 'live-chat', icon: Headphones, label: 'Live Chat' },
    { value: 'vehicle-values', icon: ShieldCheck, label: 'Bilværdier' },
    { value: 'gps', icon: MapPin, label: 'GPS' },
    { value: 'checkinout', icon: Camera, label: 'Check-in/out' },
    { value: 'corporate', icon: Building2, label: 'Virksomheder' },
    { value: 'facebook', icon: Facebook, label: 'Facebook' },
    { value: 'stats', icon: BarChart3, label: 'Statistik' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-display font-bold">LEJIO Admin</span>
                </div>
                <nav className="p-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        setActiveTab(item.value);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                        activeTab === item.value 
                          ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-display font-bold">LEJIO Admin</h1>
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="font-medium">
            <LogOut className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Log ud</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-2 sm:px-4 py-4 md:py-8 relative z-10">
        {/* Stats - gradient styled */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card className="p-4 md:p-6 bg-card/50 backdrop-blur-sm border-2 border-border/50 hover:border-primary/30 transition-all hover:shadow-lg">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-2xl md:text-3xl font-black">{stats.totalCustomers}</p>
                <p className="text-xs md:text-sm text-muted-foreground font-medium truncate">Kunder</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 md:p-6 bg-card/50 backdrop-blur-sm border-2 border-border/50 hover:border-accent/30 transition-all hover:shadow-lg">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-2xl md:text-3xl font-black">{stats.activeCustomers}</p>
                <p className="text-xs md:text-sm text-muted-foreground font-medium truncate">Aktive</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 md:p-6 bg-card/50 backdrop-blur-sm border-2 border-border/50 hover:border-mint/30 transition-all hover:shadow-lg">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-mint to-mint/60 flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-2xl md:text-3xl font-black">{stats.trialCustomers}</p>
                <p className="text-xs md:text-sm text-muted-foreground font-medium truncate">Prøve</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 md:p-6 bg-card/50 backdrop-blur-sm border-2 border-border/50 hover:border-lavender/30 transition-all hover:shadow-lg">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-lavender to-lavender/60 flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-2xl md:text-3xl font-black">{stats.totalBookings}</p>
                <p className="text-xs md:text-sm text-muted-foreground font-medium truncate">Bookinger</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            console.log('AdminDashboard tab change:', v);
            setActiveTab(v);
          }}
          className="space-y-4 md:space-y-6"
        >
          {/* Always visible (mobile + desktop). On mobile it scrolls horizontally */}
          <div className="-mx-2 px-2 md:mx-0 md:px-0 overflow-x-auto">
            <TabsList className="flex w-max md:w-full flex-nowrap md:flex-wrap h-auto gap-1 p-1">
              {menuItems.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="text-xs lg:text-sm"
                  onClick={() => setActiveTab(item.value)}
                >
                  <item.icon className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Mobile current tab indicator */}
          <div className="md:hidden flex items-center gap-2 px-1">
            <span className="text-sm text-muted-foreground">Sektion:</span>
            <Badge variant="secondary" className="font-medium">
              {menuItems.find(m => m.value === activeTab)?.label}
            </Badge>
          </div>

          {/* User Management Tab */}
          <TabsContent value="users">
            <AdminUserManagement />
          </TabsContent>

          {/* Staff Management Tab */}
          <TabsContent value="staff">
            <AdminStaffManagement />
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">Bookinger</CardTitle>
                    <CardDescription className="text-xs">Se og opret bookinger</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setShowCreateBooking(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Opret
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Lejer</TableHead>
                        <TableHead className="hidden sm:table-cell">Periode</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">Pris</TableHead>
                        <TableHead className="hidden lg:table-cell">Oprettet</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{booking.renter_name || 'Ukendt'}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[150px]">{booking.renter_email}</p>
                              <p className="text-xs text-muted-foreground sm:hidden mt-1">
                                {format(new Date(booking.start_date), 'dd/MM', { locale: da })} - {format(new Date(booking.end_date), 'dd/MM', { locale: da })}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">
                            {format(new Date(booking.start_date), 'dd. MMM', { locale: da })} - {format(new Date(booking.end_date), 'dd. MMM', { locale: da })}
                          </TableCell>
                          <TableCell>
                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm">{booking.total_price.toLocaleString('da-DK')} kr</TableCell>
                          <TableCell className="hidden lg:table-cell text-sm">
                            {format(new Date(booking.created_at), 'dd. MMM', { locale: da })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dealer Locations Tab */}
          <TabsContent value="locations">
            <AdminDealerLocations />
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

          {/* Check-in/out Settings Tab */}
          <TabsContent value="checkinout">
            <AdminCheckInOutSettings />
          </TabsContent>

          {/* Corporate Accounts Tab */}
          <TabsContent value="corporate">
            <AdminCorporateAccounts />
          </TabsContent>

          {/* Facebook Posts Tab */}
          <TabsContent value="facebook">
            <AdminFacebookPosts />
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
