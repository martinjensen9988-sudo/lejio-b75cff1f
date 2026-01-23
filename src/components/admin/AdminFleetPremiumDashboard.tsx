import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useAdminFleetPremiumVehicles, FleetCustomerWithVehicles } from '@/hooks/useAdminFleetPremiumVehicles';
import { FleetExportButton } from '@/components/fleet/FleetExportButton';
import {
  TrendingUp,
  TrendingDown,
  Car,
  Building2,
  Wallet,
  Target,
  Loader2,
  ChevronDown,
  ChevronRight,
  User,
  Search,
  Calendar,
  CircleDot,
  Wrench,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

const FLEET_PLAN_LABELS: Record<string, string> = {
  fleet_private: 'Fleet Privat',
  fleet_basic: 'Fleet Basic',
  fleet_premium: 'Fleet Premium',
};

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    rented: { label: 'Udlejet', className: 'bg-green-500/10 text-green-600' },
    available: { label: 'Ledig', className: 'bg-blue-500/10 text-blue-600' },
    maintenance: { label: 'Værksted', className: 'bg-orange-500/10 text-orange-600' },
    cleaning: { label: 'Klargøring', className: 'bg-purple-500/10 text-purple-600' },
  };
  const config = statusConfig[status] || statusConfig.available;
  return <Badge className={config.className}>{config.label}</Badge>;
};

export const AdminFleetPremiumDashboard = () => {
  const {
    customers,
    allVehicles,
    globalSummary,
    isLoading,
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,
  } = useAdminFleetPremiumVehicles();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set());
  const [selectedTab, setSelectedTab] = useState('overview');

  const toggleCustomer = (customerId: string) => {
    setExpandedCustomers(prev => {
      const next = new Set(prev);
      if (next.has(customerId)) {
        next.delete(customerId);
      } else {
        next.add(customerId);
      }
      return next;
    });
  };

  const filteredCustomers = customers.filter(c =>
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.vehicles.some(v => 
      v.registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${v.make} ${v.model}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: 'Januar' },
    { value: 2, label: 'Februar' },
    { value: 3, label: 'Marts' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Maj' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector & Search */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map(m => (
                <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map(y => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Søg kunde, bil eller nummerplade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {globalSummary && (
          <FleetExportButton 
            vehicles={allVehicles} 
            summary={globalSummary} 
            month={selectedMonth}
            year={selectedYear}
          />
        )}
      </div>

      {/* Global Summary Cards */}
      {globalSummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Building2 className="w-4 h-4" />
                Fleet Kunder
              </div>
              <p className="text-2xl font-bold">{customers.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Car className="w-4 h-4" />
                Biler i alt
              </div>
              <p className="text-2xl font-bold">{globalSummary.totalVehicles}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <TrendingUp className="w-4 h-4" />
                Brutto Indtægt
              </div>
              <p className="text-2xl font-bold">{globalSummary.totalMonthlyGrossRevenue.toLocaleString('da-DK')} kr</p>
              <p className="text-xs text-muted-foreground">denne måned</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Wallet className="w-4 h-4" />
                LEJIO Kommission
              </div>
              <p className="text-2xl font-bold">{globalSummary.totalCommission.toLocaleString('da-DK')} kr</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <CreditCard className="w-4 h-4" />
                Afdrag
              </div>
              <p className="text-2xl font-bold">{globalSummary.totalMonthlyInstallments.toLocaleString('da-DK')} kr</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-mint/10 to-mint/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Target className="w-4 h-4" />
                Garanti opfyldt
              </div>
              <p className="text-2xl font-bold">{globalSummary.vehiclesMeetingGuarantee}/{globalSummary.totalVehicles}</p>
              <p className="text-xs text-muted-foreground">{globalSummary.averageUtilization.toFixed(0)}% gns.</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Oversigt</TabsTrigger>
          <TabsTrigger value="customers">Kunder ({customers.length})</TabsTrigger>
          <TabsTrigger value="vehicles">Alle biler ({allVehicles.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          {filteredCustomers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Ingen fleet-kunder fundet</p>
              </CardContent>
            </Card>
          ) : (
            filteredCustomers.map(customer => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                isExpanded={expandedCustomers.has(customer.id)}
                onToggle={() => toggleCustomer(customer.id)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="customers" className="space-y-4 mt-4">
          {filteredCustomers.map(customer => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              isExpanded={expandedCustomers.has(customer.id)}
              onToggle={() => toggleCustomer(customer.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4 mt-4">
          <div className="grid gap-4">
            {allVehicles.map(vehicle => (
              <VehicleRow key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CustomerCard = ({ 
  customer, 
  isExpanded, 
  onToggle 
}: { 
  customer: FleetCustomerWithVehicles; 
  isExpanded: boolean; 
  onToggle: () => void;
}) => {
  return (
    <Card>
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                <div className="text-left">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {customer.company_name || customer.full_name || customer.email}
                    <Badge variant="outline" className="ml-2">
                      {FLEET_PLAN_LABELS[customer.fleet_plan || ''] || customer.fleet_plan}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{customer.email}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-6 text-right">
                <div>
                  <p className="text-sm text-muted-foreground">Biler</p>
                  <p className="font-semibold">{customer.vehicles.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Brutto</p>
                  <p className="font-semibold text-green-600">
                    {customer.summary.totalMonthlyGrossRevenue.toLocaleString('da-DK')} kr
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kommission</p>
                  <p className="font-semibold text-primary">
                    {customer.summary.totalCommission.toLocaleString('da-DK')} kr
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Netto til kunde</p>
                  <p className="font-semibold">
                    {customer.summary.finalNetPayout.toLocaleString('da-DK')} kr
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="border-t pt-4 space-y-3">
              {customer.vehicles.map(vehicle => (
                <VehicleRow key={vehicle.id} vehicle={vehicle} compact />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

const VehicleRow = ({ vehicle, compact = false }: { vehicle: any; compact?: boolean }) => {
  return (
    <div className={`flex items-center justify-between ${compact ? 'p-3 bg-muted/30 rounded-lg' : 'p-4 border rounded-lg'}`}>
      <div className="flex items-center gap-4">
        {vehicle.image_url && (
          <img
            src={vehicle.image_url}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-16 h-12 object-cover rounded"
          />
        )}
        <div>
          <p className="font-medium">
            {vehicle.make} {vehicle.model} {vehicle.variant || ''}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{vehicle.registration}</span>
            {vehicle.year && <span>• {vehicle.year}</span>}
            {vehicle.current_odometer && <span>• {vehicle.current_odometer.toLocaleString('da-DK')} km</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {getStatusBadge(vehicle.currentStatus)}

        <div className="text-right">
          <p className="text-sm text-muted-foreground">Garanti</p>
          <div className="flex items-center gap-2">
            <Progress value={vehicle.guaranteePercentage} className="w-16 h-2" />
            <span className="text-sm font-medium">{vehicle.guaranteePercentage.toFixed(0)}%</span>
          </div>
        </div>

        <div className="text-right min-w-[100px]">
          <p className="text-sm text-muted-foreground">Brutto</p>
          <p className="font-semibold text-green-600">
            {vehicle.monthlyGrossRevenue.toLocaleString('da-DK')} kr
          </p>
        </div>

        <div className="text-right min-w-[100px]">
          <p className="text-sm text-muted-foreground">Kommission ({(vehicle.commissionRate * 100).toFixed(0)}%)</p>
          <p className="font-semibold text-primary">
            {vehicle.lejioCommissionAmount.toLocaleString('da-DK')} kr
          </p>
        </div>

        <div className="text-right min-w-[100px]">
          <p className="text-sm text-muted-foreground">Netto</p>
          <p className="font-semibold">
            {vehicle.netPayout.toLocaleString('da-DK')} kr
          </p>
        </div>
      </div>
    </div>
  );
};
