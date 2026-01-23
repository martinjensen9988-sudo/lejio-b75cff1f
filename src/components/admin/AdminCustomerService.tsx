import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Search, User, Car, Calendar, Receipt, Phone, Mail, 
  ExternalLink, Loader2, AlertCircle, CheckCircle2, Clock,
  MessageCircle, FileText, Eye, History, CreditCard
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

interface UserResult {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  user_type: string;
  subscription_status: string | null;
  created_at: string;
}

interface BookingResult {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  total_price: number;
  renter_name: string | null;
  renter_email: string | null;
  vehicle: {
    make: string;
    model: string;
    registration: string;
  } | null;
  lessor: {
    full_name: string | null;
    email: string;
  } | null;
}

interface VehicleResult {
  id: string;
  make: string;
  model: string;
  registration: string;
  year: number | null;
  daily_price: number;
  is_available: boolean;
  owner: {
    id: string;
    full_name: string | null;
    email: string;
  } | null;
}

interface InvoiceResult {
  id: string;
  invoice_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  booking_id: string | null;
  lessor: {
    full_name: string | null;
    email: string;
  } | null;
}

export const AdminCustomerService = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Search results
  const [users, setUsers] = useState<UserResult[]>([]);
  const [bookings, setBookings] = useState<BookingResult[]>([]);
  const [vehicles, setVehicles] = useState<VehicleResult[]>([]);
  const [invoices, setInvoices] = useState<InvoiceResult[]>([]);
  
  // Detail modals
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [userBookings, setUserBookings] = useState<BookingResult[]>([]);
  const [userVehicles, setUserVehicles] = useState<VehicleResult[]>([]);
  const [userInvoices, setUserInvoices] = useState<InvoiceResult[]>([]);
  const [isLoadingUserDetails, setIsLoadingUserDetails] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Indtast en søgeterm');
      return;
    }

    setIsSearching(true);
    const query = searchQuery.trim().toLowerCase();

    try {
      // Search users
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone, user_type, subscription_status, created_at')
        .or(`email.ilike.%${query}%,full_name.ilike.%${query}%,phone.ilike.%${query}%`)
        .limit(20);
      
      setUsers((usersData as UserResult[]) || []);

      // Search bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          id, start_date, end_date, status, total_price, renter_name, renter_email,
          vehicle:vehicles(make, model, registration),
          lessor:profiles!bookings_lessor_id_fkey(full_name, email)
        `)
        .or(`renter_name.ilike.%${query}%,renter_email.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20);
      
      setBookings((bookingsData as unknown as BookingResult[]) || []);

      // Search vehicles
      const { data: vehiclesData } = await supabase
        .from('vehicles')
        .select(`
          id, make, model, registration, year, daily_price, is_available,
          owner:profiles!vehicles_owner_id_fkey(id, full_name, email)
        `)
        .or(`registration.ilike.%${query}%,make.ilike.%${query}%,model.ilike.%${query}%`)
        .limit(20);
      
      setVehicles((vehiclesData as unknown as VehicleResult[]) || []);

      // Search invoices
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select(`
          id, invoice_number, total_amount, status, created_at, booking_id,
          lessor:profiles!invoices_lessor_id_fkey(full_name, email)
        `)
        .or(`invoice_number.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20);
      
      setInvoices((invoicesData as unknown as InvoiceResult[]) || []);

      const totalResults = (usersData?.length || 0) + (bookingsData?.length || 0) + 
                          (vehiclesData?.length || 0) + (invoicesData?.length || 0);
      
      if (totalResults === 0) {
        toast.info('Ingen resultater fundet');
      } else {
        toast.success(`Fundet ${totalResults} resultater`);
      }

    } catch (error) {
      console.error('Search error:', error);
      toast.error('Fejl ved søgning');
    } finally {
      setIsSearching(false);
    }
  };

  const loadUserDetails = async (user: UserResult) => {
    setSelectedUser(user);
    setIsLoadingUserDetails(true);

    try {
      // Load user's bookings (as renter or lessor)
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          id, start_date, end_date, status, total_price, renter_name, renter_email,
          vehicle:vehicles(make, model, registration),
          lessor:profiles!bookings_lessor_id_fkey(full_name, email)
        `)
        .or(`lessor_id.eq.${user.id},renter_email.eq.${user.email}`)
        .order('created_at', { ascending: false })
        .limit(50);
      
      setUserBookings((bookingsData as unknown as BookingResult[]) || []);

      // Load user's vehicles
      const { data: vehiclesData } = await supabase
        .from('vehicles')
        .select(`
          id, make, model, registration, year, daily_price, is_available,
          owner:profiles!vehicles_owner_id_fkey(id, full_name, email)
        `)
        .eq('owner_id', user.id);
      
      setUserVehicles((vehiclesData as unknown as VehicleResult[]) || []);

      // Load user's invoices
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select(`
          id, invoice_number, total_amount, status, created_at, booking_id,
          lessor:profiles!invoices_lessor_id_fkey(full_name, email)
        `)
        .eq('lessor_id', user.id)
        .order('created_at', { ascending: false });
      
      setUserInvoices((invoicesData as unknown as InvoiceResult[]) || []);

    } catch (error) {
      console.error('Error loading user details:', error);
      toast.error('Kunne ikke hente brugerdetaljer');
    } finally {
      setIsLoadingUserDetails(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: { variant: 'secondary', label: 'Afventer' },
      confirmed: { variant: 'default', label: 'Bekræftet' },
      active: { variant: 'default', label: 'Aktiv' },
      completed: { variant: 'outline', label: 'Afsluttet' },
      cancelled: { variant: 'destructive', label: 'Annulleret' },
      paid: { variant: 'default', label: 'Betalt' },
      unpaid: { variant: 'destructive', label: 'Ubetalt' },
      trialing: { variant: 'secondary', label: 'Prøve' },
    };
    
    const config = variants[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const totalResults = users.length + bookings.length + vehicles.length + invoices.length;

  return (
    <div className="space-y-6">
      {/* Search Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Kundeservice Søgning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Søg på email, navn, telefon, nummerplade, booking ID, fakturanummer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="h-12 text-lg"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              size="lg"
              className="px-8"
            >
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Søg
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Søg på tværs af brugere, bookinger, biler og fakturaer
          </p>
        </CardContent>
      </Card>

      {/* Results */}
      {totalResults > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Søgeresultater ({totalResults})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="all" className="gap-2">
                  Alle
                  <Badge variant="secondary" className="ml-1">{totalResults}</Badge>
                </TabsTrigger>
                <TabsTrigger value="users" className="gap-2">
                  <User className="w-4 h-4" />
                  Brugere
                  {users.length > 0 && <Badge variant="secondary">{users.length}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="bookings" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Bookinger
                  {bookings.length > 0 && <Badge variant="secondary">{bookings.length}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="vehicles" className="gap-2">
                  <Car className="w-4 h-4" />
                  Biler
                  {vehicles.length > 0 && <Badge variant="secondary">{vehicles.length}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="invoices" className="gap-2">
                  <Receipt className="w-4 h-4" />
                  Fakturaer
                  {invoices.length > 0 && <Badge variant="secondary">{invoices.length}</Badge>}
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[500px]">
                {/* Users */}
                {(activeTab === 'all' || activeTab === 'users') && users.length > 0 && (
                  <div className="space-y-3">
                    {activeTab === 'all' && <h3 className="font-semibold text-sm text-muted-foreground">Brugere</h3>}
                    {users.map((user) => (
                      <div 
                        key={user.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">{user.full_name || 'Ingen navn'}</p>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {user.email}
                                </span>
                                {user.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {user.phone}
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline">{user.user_type}</Badge>
                                {user.subscription_status && getStatusBadge(user.subscription_status)}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => loadUserDetails(user)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Detaljer
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Rediger
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {activeTab === 'all' && <Separator className="my-4" />}
                  </div>
                )}

                {/* Bookings */}
                {(activeTab === 'all' || activeTab === 'bookings') && bookings.length > 0 && (
                  <div className="space-y-3">
                    {activeTab === 'all' && <h3 className="font-semibold text-sm text-muted-foreground">Bookinger</h3>}
                    {bookings.map((booking) => (
                      <div 
                        key={booking.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <p className="font-semibold">
                                {booking.vehicle?.make} {booking.vehicle?.model}
                                <span className="font-normal text-muted-foreground ml-2">
                                  ({booking.vehicle?.registration})
                                </span>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Lejer: {booking.renter_name || booking.renter_email}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Udlejer: {booking.lessor?.full_name || booking.lessor?.email}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                {getStatusBadge(booking.status)}
                                <span className="text-sm">
                                  {format(new Date(booking.start_date), 'd. MMM', { locale: da })} - {format(new Date(booking.end_date), 'd. MMM yyyy', { locale: da })}
                                </span>
                                <span className="font-semibold">{booking.total_price} kr</span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/admin/bookings`)}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Se booking
                          </Button>
                        </div>
                      </div>
                    ))}
                    {activeTab === 'all' && <Separator className="my-4" />}
                  </div>
                )}

                {/* Vehicles */}
                {(activeTab === 'all' || activeTab === 'vehicles') && vehicles.length > 0 && (
                  <div className="space-y-3">
                    {activeTab === 'all' && <h3 className="font-semibold text-sm text-muted-foreground">Biler</h3>}
                    {vehicles.map((vehicle) => (
                      <div 
                        key={vehicle.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-mint/10 flex items-center justify-center">
                              <Car className="w-5 h-5 text-mint" />
                            </div>
                            <div>
                              <p className="font-semibold">
                                {vehicle.make} {vehicle.model} {vehicle.year && `(${vehicle.year})`}
                              </p>
                              <p className="text-sm font-mono">{vehicle.registration}</p>
                              <p className="text-sm text-muted-foreground">
                                Ejer: {vehicle.owner?.full_name || vehicle.owner?.email}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <Badge variant={vehicle.is_available ? 'default' : 'secondary'}>
                                  {vehicle.is_available ? 'Tilgængelig' : 'Ikke tilgængelig'}
                                </Badge>
                                <span className="font-semibold">{vehicle.daily_price} kr/dag</span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => vehicle.owner && loadUserDetails(vehicle.owner as UserResult)}
                          >
                            <User className="w-4 h-4 mr-1" />
                            Se ejer
                          </Button>
                        </div>
                      </div>
                    ))}
                    {activeTab === 'all' && <Separator className="my-4" />}
                  </div>
                )}

                {/* Invoices */}
                {(activeTab === 'all' || activeTab === 'invoices') && invoices.length > 0 && (
                  <div className="space-y-3">
                    {activeTab === 'all' && <h3 className="font-semibold text-sm text-muted-foreground">Fakturaer</h3>}
                    {invoices.map((invoice) => (
                      <div 
                        key={invoice.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-lavender/10 flex items-center justify-center">
                              <Receipt className="w-5 h-5 text-lavender" />
                            </div>
                            <div>
                              <p className="font-semibold font-mono">{invoice.invoice_number}</p>
                              <p className="text-sm text-muted-foreground">
                                {invoice.lessor?.full_name || invoice.lessor?.email}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                {getStatusBadge(invoice.status)}
                                <span className="font-semibold">{invoice.total_amount} kr</span>
                                <span className="text-sm text-muted-foreground">
                                  {format(new Date(invoice.created_at), 'd. MMM yyyy', { locale: da })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {totalResults === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Ingen resultater endnu. Brug søgefeltet ovenfor.</p>
                  </div>
                )}
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {totalResults === 0 && !isSearching && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">Søg efter kunder, bookinger, biler eller fakturaer</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Brug søgefeltet ovenfor til at finde brugere, slå bookinger op, 
              søge på nummerplader eller finde fakturaer.
            </p>
          </CardContent>
        </Card>
      )}

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p>{selectedUser.full_name || 'Ingen navn'}</p>
                    <p className="text-sm font-normal text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Quick Actions */}
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/admin/users/edit/${selectedUser.id}`)}>
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Rediger bruger
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigate('/admin/messages')}>
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Send besked
                  </Button>
                  {selectedUser.phone && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={`tel:${selectedUser.phone}`}>
                        <Phone className="w-4 h-4 mr-1" />
                        Ring op
                      </a>
                    </Button>
                  )}
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${selectedUser.email}`}>
                      <Mail className="w-4 h-4 mr-1" />
                      Send email
                    </a>
                  </Button>
                </div>

                {/* User Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Brugertype</p>
                    <p className="font-semibold">{selectedUser.user_type}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="mt-1">{selectedUser.subscription_status && getStatusBadge(selectedUser.subscription_status)}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Telefon</p>
                    <p className="font-semibold">{selectedUser.phone || '-'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Oprettet</p>
                    <p className="font-semibold">{format(new Date(selectedUser.created_at), 'd. MMM yyyy', { locale: da })}</p>
                  </div>
                </div>

                {isLoadingUserDetails ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Tabs defaultValue="bookings">
                    <TabsList>
                      <TabsTrigger value="bookings" className="gap-2">
                        <Calendar className="w-4 h-4" />
                        Bookinger ({userBookings.length})
                      </TabsTrigger>
                      <TabsTrigger value="vehicles" className="gap-2">
                        <Car className="w-4 h-4" />
                        Biler ({userVehicles.length})
                      </TabsTrigger>
                      <TabsTrigger value="invoices" className="gap-2">
                        <Receipt className="w-4 h-4" />
                        Fakturaer ({userInvoices.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="bookings" className="mt-4">
                      <ScrollArea className="h-[300px]">
                        {userBookings.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">Ingen bookinger</p>
                        ) : (
                          <div className="space-y-2">
                            {userBookings.map((booking) => (
                              <div key={booking.id} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">
                                      {booking.vehicle?.make} {booking.vehicle?.model}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {format(new Date(booking.start_date), 'd. MMM', { locale: da })} - {format(new Date(booking.end_date), 'd. MMM yyyy', { locale: da })}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getStatusBadge(booking.status)}
                                    <span className="font-semibold">{booking.total_price} kr</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="vehicles" className="mt-4">
                      <ScrollArea className="h-[300px]">
                        {userVehicles.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">Ingen biler</p>
                        ) : (
                          <div className="space-y-2">
                            {userVehicles.map((vehicle) => (
                              <div key={vehicle.id} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">
                                      {vehicle.make} {vehicle.model} {vehicle.year && `(${vehicle.year})`}
                                    </p>
                                    <p className="text-sm font-mono">{vehicle.registration}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={vehicle.is_available ? 'default' : 'secondary'}>
                                      {vehicle.is_available ? 'Tilgængelig' : 'Ikke tilgængelig'}
                                    </Badge>
                                    <span className="font-semibold">{vehicle.daily_price} kr/dag</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="invoices" className="mt-4">
                      <ScrollArea className="h-[300px]">
                        {userInvoices.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">Ingen fakturaer</p>
                        ) : (
                          <div className="space-y-2">
                            {userInvoices.map((invoice) => (
                              <div key={invoice.id} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium font-mono">{invoice.invoice_number}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {format(new Date(invoice.created_at), 'd. MMM yyyy', { locale: da })}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getStatusBadge(invoice.status)}
                                    <span className="font-semibold">{invoice.total_amount} kr</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
