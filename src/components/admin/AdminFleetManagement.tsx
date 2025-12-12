import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, startOfMonth, subMonths } from 'date-fns';
import { da } from 'date-fns/locale';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Truck, Search, MoreHorizontal, Plus, 
  Loader2, CheckCircle, DollarSign, TrendingUp,
  Building2, Calendar, Car, UserPlus
} from 'lucide-react';
import { LessorStatusBadge } from '@/components/ratings/LessorStatusBadge';
import { RatingStars } from '@/components/ratings/RatingStars';

interface FleetCustomer {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  fleet_plan: 'fleet_basic' | 'fleet_premium' | null;
  fleet_commission_rate: number | null;
  average_rating: number;
  total_rating_count: number;
  lessor_status: 'bronze' | 'silver' | 'gold' | 'platinum';
  created_at: string;
}

interface FleetSettlement {
  id: string;
  lessor_id: string;
  settlement_month: string;
  total_revenue: number;
  commission_rate: number;
  commission_amount: number;
  net_payout: number;
  bookings_count: number;
  status: string;
  paid_at: string | null;
  lessor?: FleetCustomer;
}

interface FleetVehicle {
  id: string;
  make: string;
  model: string;
  registration: string;
  year: number | null;
  daily_price: number | null;
  weekly_price: number | null;
  monthly_price: number | null;
  owner_id: string;
}

const FLEET_PLAN_LABELS: Record<string, string> = {
  fleet_basic: 'LEJIO Varetager',
  fleet_premium: 'LEJIO Varetager Pro',
};

const AdminFleetManagement = () => {
  const [customers, setCustomers] = useState<FleetCustomer[]>([]);
  const [settlements, setSettlements] = useState<FleetSettlement[]>([]);
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateSettlement, setShowCreateSettlement] = useState(false);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [showCreateVehicle, setShowCreateVehicle] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<FleetCustomer | null>(null);
  const [settlementData, setSettlementData] = useState({
    settlement_month: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    total_revenue: 0,
    bookings_count: 0,
  });
  const [isCreating, setIsCreating] = useState(false);
  
  // New customer form
  const [newCustomerForm, setNewCustomerForm] = useState({
    email: '',
    company_name: '',
    full_name: '',
    fleet_plan: 'fleet_basic' as 'fleet_basic' | 'fleet_premium',
    fleet_commission_rate: 15,
  });
  
  // New vehicle form
  const [newVehicleForm, setNewVehicleForm] = useState({
    owner_id: '',
    registration: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    daily_price: 0,
    weekly_price: 0,
    monthly_price: 0,
    description: '',
  });

  const fetchData = async () => {
    setIsLoading(true);

    // Fetch fleet customers
    const { data: customersData, error: customersError } = await supabase
      .from('profiles')
      .select('id, email, full_name, company_name, fleet_plan, fleet_commission_rate, average_rating, total_rating_count, lessor_status, created_at')
      .not('fleet_plan', 'is', null)
      .order('created_at', { ascending: false });

    if (customersError) {
      console.error('Error fetching fleet customers:', customersError);
    } else {
      setCustomers((customersData || []) as FleetCustomer[]);
    }

    // Fetch all settlements
    const { data: settlementsData, error: settlementsError } = await supabase
      .from('fleet_settlements')
      .select('*')
      .order('settlement_month', { ascending: false });

    if (settlementsError) {
      console.error('Error fetching settlements:', settlementsError);
    } else {
      setSettlements(settlementsData || []);
    }

    // Fetch fleet vehicles
    const { data: vehiclesData, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('id, make, model, registration, year, daily_price, weekly_price, monthly_price, owner_id')
      .in('owner_id', (customersData || []).map(c => c.id));

    if (vehiclesError) {
      console.error('Error fetching fleet vehicles:', vehiclesError);
    } else {
      setVehicles(vehiclesData || []);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCustomer = async () => {
    if (!newCustomerForm.email || !newCustomerForm.company_name) {
      toast.error('Udfyld venligst email og firmanavn');
      return;
    }

    setIsCreating(true);

    // First check if user exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', newCustomerForm.email)
      .single();

    if (existingProfile) {
      // Update existing profile to fleet customer
      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: newCustomerForm.company_name,
          full_name: newCustomerForm.full_name || null,
          fleet_plan: newCustomerForm.fleet_plan,
          fleet_commission_rate: newCustomerForm.fleet_commission_rate,
          user_type: 'professionel',
        })
        .eq('id', existingProfile.id);

      if (error) {
        toast.error('Kunne ikke opdatere bruger til fleet-kunde');
      } else {
        toast.success('Bruger opdateret til fleet-kunde!');
        setShowCreateCustomer(false);
        setNewCustomerForm({
          email: '',
          company_name: '',
          full_name: '',
          fleet_plan: 'fleet_basic',
          fleet_commission_rate: 15,
        });
        fetchData();
      }
    } else {
      toast.error('Bruger med denne email findes ikke. Bed kunden oprette en konto først.');
    }

    setIsCreating(false);
  };

  const handleCreateVehicle = async () => {
    if (!newVehicleForm.owner_id || !newVehicleForm.registration || !newVehicleForm.make || !newVehicleForm.model) {
      toast.error('Udfyld venligst alle påkrævede felter');
      return;
    }

    setIsCreating(true);

    const { error } = await supabase
      .from('vehicles')
      .insert({
        owner_id: newVehicleForm.owner_id,
        registration: newVehicleForm.registration.toUpperCase(),
        make: newVehicleForm.make,
        model: newVehicleForm.model,
        year: newVehicleForm.year,
        daily_price: newVehicleForm.daily_price || null,
        weekly_price: newVehicleForm.weekly_price || null,
        monthly_price: newVehicleForm.monthly_price || null,
        description: newVehicleForm.description || null,
        is_available: true,
      });

    if (error) {
      console.error('Error creating vehicle:', error);
      toast.error('Kunne ikke oprette køretøj');
    } else {
      toast.success('Køretøj oprettet!');
      setShowCreateVehicle(false);
      setNewVehicleForm({
        owner_id: '',
        registration: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        daily_price: 0,
        weekly_price: 0,
        monthly_price: 0,
        description: '',
      });
      fetchData();
    }

    setIsCreating(false);
  };

  const handleCreateSettlement = async () => {
    if (!selectedCustomer) return;

    setIsCreating(true);

    const commissionRate = selectedCustomer.fleet_commission_rate || 0;
    const commissionAmount = (settlementData.total_revenue * commissionRate) / 100;
    const netPayout = settlementData.total_revenue - commissionAmount;

    const { error } = await supabase
      .from('fleet_settlements')
      .insert({
        lessor_id: selectedCustomer.id,
        settlement_month: settlementData.settlement_month,
        total_revenue: settlementData.total_revenue,
        commission_rate: commissionRate,
        commission_amount: commissionAmount,
        net_payout: netPayout,
        bookings_count: settlementData.bookings_count,
        status: 'pending',
      });

    if (error) {
      if (error.code === '23505') {
        toast.error('Opgørelse for denne måned findes allerede');
      } else {
        console.error('Error creating settlement:', error);
        toast.error('Kunne ikke oprette opgørelse');
      }
    } else {
      toast.success('Opgørelse oprettet!');
      setShowCreateSettlement(false);
      setSelectedCustomer(null);
      setSettlementData({
        settlement_month: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
        total_revenue: 0,
        bookings_count: 0,
      });
      fetchData();
    }

    setIsCreating(false);
  };

  const handleMarkAsPaid = async (settlementId: string) => {
    const { error } = await supabase
      .from('fleet_settlements')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('id', settlementId);

    if (error) {
      toast.error('Kunne ikke markere som betalt');
    } else {
      toast.success('Opgørelse markeret som betalt');
      fetchData();
    }
  };

  const getCustomerById = (id: string) => customers.find(c => c.id === id);

  const stats = {
    totalFleetCustomers: customers.length,
    basicCustomers: customers.filter(c => c.fleet_plan === 'fleet_basic').length,
    premiumCustomers: customers.filter(c => c.fleet_plan === 'fleet_premium').length,
    pendingSettlements: settlements.filter(s => s.status === 'pending').length,
    totalPendingPayout: settlements
      .filter(s => s.status === 'pending')
      .reduce((sum, s) => sum + s.net_payout, 0),
    totalVehicles: vehicles.length,
  };

  const getVehiclesForCustomer = (customerId: string) => 
    vehicles.filter(v => v.owner_id === customerId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Fleet Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalFleetCustomers}</p>
                <p className="text-xs text-muted-foreground">Fleet kunder</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.basicCustomers} / {stats.premiumCustomers}</p>
                <p className="text-xs text-muted-foreground">Basic / Premium</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingSettlements}</p>
                <p className="text-xs text-muted-foreground">Afventende opgørelser</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalPendingPayout.toLocaleString('da-DK')} kr</p>
                <p className="text-xs text-muted-foreground">Afventer udbetaling</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Management Tabs */}
      <Tabs defaultValue="customers">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="customers">
              <Building2 className="w-4 h-4 mr-2" />
              Kunder ({customers.length})
            </TabsTrigger>
            <TabsTrigger value="vehicles">
              <Car className="w-4 h-4 mr-2" />
              Køretøjer ({vehicles.length})
            </TabsTrigger>
            <TabsTrigger value="settlements">
              <TrendingUp className="w-4 h-4 mr-2" />
              Opgørelser ({settlements.length})
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCreateCustomer(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Tilføj kunde
            </Button>
            <Button onClick={() => setShowCreateVehicle(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tilføj køretøj
            </Button>
          </div>
        </div>

        {/* Customers Tab */}
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Fleet Kunder
                  </CardTitle>
                  <CardDescription>Virksomheder med LEJIO Varetager-planer</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Søg fleet kunder..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Truck className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Ingen fleet kunder endnu</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Virksomhed</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Kommission</TableHead>
                  <TableHead>Køretøjer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.company_name || customer.full_name || 'Ukendt'}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.fleet_plan === 'fleet_premium' ? 'default' : 'secondary'}>
                        {customer.fleet_plan ? FLEET_PLAN_LABELS[customer.fleet_plan] : '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {customer.fleet_commission_rate}%
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {getVehiclesForCustomer(customer.id).length} biler
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <LessorStatusBadge 
                        status={customer.lessor_status || 'bronze'} 
                        size="sm" 
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedCustomer(customer);
                            setShowCreateSettlement(true);
                          }}>
                            <Plus className="w-4 h-4 mr-2" />
                            Opret opgørelse
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setNewVehicleForm(prev => ({ ...prev, owner_id: customer.id }));
                            setShowCreateVehicle(true);
                          }}>
                            <Car className="w-4 h-4 mr-2" />
                            Tilføj køretøj
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </TabsContent>

    {/* Vehicles Tab */}
    <TabsContent value="vehicles">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Fleet Køretøjer
          </CardTitle>
          <CardDescription>Køretøjer tilhørende Fleet-kunder</CardDescription>
        </CardHeader>
        <CardContent>
          {vehicles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Car className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Ingen køretøjer endnu</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Køretøj</TableHead>
                  <TableHead>Registrering</TableHead>
                  <TableHead>Ejer</TableHead>
                  <TableHead>Dagspris</TableHead>
                  <TableHead>Ugepris</TableHead>
                  <TableHead>Månedspris</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => {
                  const owner = getCustomerById(vehicle.owner_id);
                  return (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                        {vehicle.year && <p className="text-sm text-muted-foreground">{vehicle.year}</p>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{vehicle.registration}</Badge>
                      </TableCell>
                      <TableCell>
                        {owner?.company_name || owner?.full_name || 'Ukendt'}
                      </TableCell>
                      <TableCell>{vehicle.daily_price?.toLocaleString('da-DK') || '-'} kr</TableCell>
                      <TableCell>{vehicle.weekly_price?.toLocaleString('da-DK') || '-'} kr</TableCell>
                      <TableCell>{vehicle.monthly_price?.toLocaleString('da-DK') || '-'} kr</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </TabsContent>

    {/* Settlements Tab */}
    <TabsContent value="settlements">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Månedlige Opgørelser
          </CardTitle>
          <CardDescription>Oversigt over alle fleet-opgørelser</CardDescription>
        </CardHeader>
        <CardContent>
          {settlements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Ingen opgørelser endnu</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Måned</TableHead>
                  <TableHead>Omsætning</TableHead>
                  <TableHead>Kommission</TableHead>
                  <TableHead>Udbetaling</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settlements.map((settlement) => {
                  const customer = getCustomerById(settlement.lessor_id);
                  return (
                    <TableRow key={settlement.id}>
                      <TableCell>
                        <p className="font-medium">
                          {customer?.company_name || customer?.full_name || 'Ukendt'}
                        </p>
                      </TableCell>
                      <TableCell>
                        {format(new Date(settlement.settlement_month), 'MMMM yyyy', { locale: da })}
                      </TableCell>
                      <TableCell>
                        {settlement.total_revenue.toLocaleString('da-DK')} kr
                      </TableCell>
                      <TableCell>
                        {settlement.commission_amount.toLocaleString('da-DK')} kr ({settlement.commission_rate}%)
                      </TableCell>
                      <TableCell className="font-semibold">
                        {settlement.net_payout.toLocaleString('da-DK')} kr
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={settlement.status === 'paid' ? 'default' : 'secondary'}
                          className={settlement.status === 'paid' ? 'bg-green-500' : ''}
                        >
                          {settlement.status === 'paid' ? 'Betalt' : 'Afventer'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {settlement.status !== 'paid' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsPaid(settlement.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Marker betalt
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>

      {/* Create Settlement Dialog */}
      <Dialog open={showCreateSettlement} onOpenChange={setShowCreateSettlement}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Opret Månedlig Opgørelse</DialogTitle>
            <DialogDescription>
              {selectedCustomer && (
                <>
                  Opgørelse for {selectedCustomer.company_name || selectedCustomer.full_name} 
                  ({selectedCustomer.fleet_commission_rate}% kommission)
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Opgørelsesmåned</Label>
              <Input
                type="month"
                value={settlementData.settlement_month.slice(0, 7)}
                onChange={(e) => setSettlementData(s => ({
                  ...s,
                  settlement_month: `${e.target.value}-01`,
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Total omsætning (kr)</Label>
              <Input
                type="number"
                min="0"
                value={settlementData.total_revenue || ''}
                onChange={(e) => setSettlementData(s => ({
                  ...s,
                  total_revenue: parseFloat(e.target.value) || 0,
                }))}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Antal bookinger</Label>
              <Input
                type="number"
                min="0"
                value={settlementData.bookings_count || ''}
                onChange={(e) => setSettlementData(s => ({
                  ...s,
                  bookings_count: parseInt(e.target.value) || 0,
                }))}
                placeholder="0"
              />
            </div>

            {selectedCustomer && settlementData.total_revenue > 0 && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Omsætning:</span>
                  <span>{settlementData.total_revenue.toLocaleString('da-DK')} kr</span>
                </div>
                <div className="flex justify-between text-sm text-destructive">
                  <span>Kommission ({selectedCustomer.fleet_commission_rate}%):</span>
                  <span>-{((settlementData.total_revenue * (selectedCustomer.fleet_commission_rate || 0)) / 100).toLocaleString('da-DK')} kr</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold">
                  <span>Udbetaling:</span>
                  <span className="text-green-600">
                    {(settlementData.total_revenue - (settlementData.total_revenue * (selectedCustomer.fleet_commission_rate || 0)) / 100).toLocaleString('da-DK')} kr
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowCreateSettlement(false)}>
              Annuller
            </Button>
            <Button 
              onClick={handleCreateSettlement}
              disabled={isCreating || !settlementData.total_revenue}
            >
              {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Opret opgørelse
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Customer Dialog */}
      <Dialog open={showCreateCustomer} onOpenChange={setShowCreateCustomer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tilføj Fleet-kunde</DialogTitle>
            <DialogDescription>
              Opgrader en eksisterende bruger til Fleet-kunde
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Brugerens email *</Label>
              <Input
                type="email"
                value={newCustomerForm.email}
                onChange={(e) => setNewCustomerForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="bruger@firma.dk"
              />
              <p className="text-xs text-muted-foreground">Brugeren skal allerede have en konto</p>
            </div>

            <div className="space-y-2">
              <Label>Firmanavn *</Label>
              <Input
                value={newCustomerForm.company_name}
                onChange={(e) => setNewCustomerForm(prev => ({ ...prev, company_name: e.target.value }))}
                placeholder="Firma ApS"
              />
            </div>

            <div className="space-y-2">
              <Label>Kontaktperson</Label>
              <Input
                value={newCustomerForm.full_name}
                onChange={(e) => setNewCustomerForm(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Fulde navn"
              />
            </div>

            <div className="space-y-2">
              <Label>Fleet Plan</Label>
              <Select
                value={newCustomerForm.fleet_plan}
                onValueChange={(value: 'fleet_basic' | 'fleet_premium') => 
                  setNewCustomerForm(prev => ({ ...prev, fleet_plan: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fleet_basic">LEJIO Varetager (Basis)</SelectItem>
                  <SelectItem value="fleet_premium">LEJIO Varetager Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Kommissionssats (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={newCustomerForm.fleet_commission_rate}
                onChange={(e) => setNewCustomerForm(prev => ({ 
                  ...prev, 
                  fleet_commission_rate: parseInt(e.target.value) || 0 
                }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateCustomer(false)}>
              Annuller
            </Button>
            <Button 
              onClick={handleCreateCustomer}
              disabled={isCreating || !newCustomerForm.email || !newCustomerForm.company_name}
            >
              {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Tilføj kunde
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Vehicle Dialog */}
      <Dialog open={showCreateVehicle} onOpenChange={setShowCreateVehicle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tilføj køretøj</DialogTitle>
            <DialogDescription>
              Opret et nyt køretøj til en Fleet-kunde
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Fleet-kunde *</Label>
              <Select
                value={newVehicleForm.owner_id}
                onValueChange={(value) => setNewVehicleForm(prev => ({ ...prev, owner_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vælg kunde" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.company_name || c.full_name || c.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nummerplade *</Label>
                <Input
                  value={newVehicleForm.registration}
                  onChange={(e) => setNewVehicleForm(prev => ({ ...prev, registration: e.target.value.toUpperCase() }))}
                  placeholder="AB12345"
                />
              </div>
              <div className="space-y-2">
                <Label>Årgang</Label>
                <Input
                  type="number"
                  value={newVehicleForm.year}
                  onChange={(e) => setNewVehicleForm(prev => ({ ...prev, year: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mærke *</Label>
                <Input
                  value={newVehicleForm.make}
                  onChange={(e) => setNewVehicleForm(prev => ({ ...prev, make: e.target.value }))}
                  placeholder="Toyota"
                />
              </div>
              <div className="space-y-2">
                <Label>Model *</Label>
                <Input
                  value={newVehicleForm.model}
                  onChange={(e) => setNewVehicleForm(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="Corolla"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Dagspris (kr)</Label>
                <Input
                  type="number"
                  min="0"
                  value={newVehicleForm.daily_price || ''}
                  onChange={(e) => setNewVehicleForm(prev => ({ ...prev, daily_price: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Ugepris (kr)</Label>
                <Input
                  type="number"
                  min="0"
                  value={newVehicleForm.weekly_price || ''}
                  onChange={(e) => setNewVehicleForm(prev => ({ ...prev, weekly_price: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Månedspris (kr)</Label>
                <Input
                  type="number"
                  min="0"
                  value={newVehicleForm.monthly_price || ''}
                  onChange={(e) => setNewVehicleForm(prev => ({ ...prev, monthly_price: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Beskrivelse</Label>
              <Textarea
                value={newVehicleForm.description}
                onChange={(e) => setNewVehicleForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Beskriv køretøjet..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateVehicle(false)}>
              Annuller
            </Button>
            <Button 
              onClick={handleCreateVehicle}
              disabled={isCreating || !newVehicleForm.owner_id || !newVehicleForm.registration || !newVehicleForm.make || !newVehicleForm.model}
            >
              {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Opret køretøj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFleetManagement;
