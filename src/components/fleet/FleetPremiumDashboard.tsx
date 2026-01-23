import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useFleetPremiumVehicles, getCommissionRate } from '@/hooks/useFleetPremiumVehicles';
import { FleetPremiumVehicleCard } from './FleetPremiumVehicleCard';
import { FleetExportButton } from './FleetExportButton';
import { 
  Car, TrendingUp, Wallet, Calendar, Target, 
  CheckCircle2, Loader2, DollarSign, CreditCard, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const FleetPremiumDashboard = () => {
  const { 
    vehicles, 
    summary, 
    isLoading, 
    selectedYear, 
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,
    GUARANTEE_DAYS,
  } = useFleetPremiumVehicles();

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

  const years = [2024, 2025, 2026, 2027].filter(y => y <= new Date().getFullYear() + 1);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('da-DK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const currentCommissionRate = summary ? getCommissionRate(summary.totalVehicles) : 0.35;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  if (!summary || vehicles.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Car className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-lg font-medium mb-2">Ingen køretøjer endnu</h3>
          <p className="text-muted-foreground">
            Dine Fleet Premium køretøjer vises her, når de er registreret i systemet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with period selector and export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Fleet Premium Overblik</h2>
          <p className="text-muted-foreground">
            Real-time status • Kommission: {Math.round(currentCommissionRate * 100)}% ({summary.totalVehicles} biler)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map(m => (
                <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map(y => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FleetExportButton 
            vehicles={vehicles} 
            summary={summary} 
            month={selectedMonth} 
            year={selectedYear} 
          />
        </div>
      </div>

      {/* Summary cards - Økonomi oversigt */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Brutto-indtjening */}
        <SummaryCard
          icon={TrendingUp}
          label="Brutto lejeindtægt"
          value={`${formatCurrency(summary.totalMonthlyGrossRevenue)} kr`}
          subtext={`${formatCurrency(summary.totalYearlyGrossRevenue)} kr i år`}
        />

        {/* LEJIO Kommission */}
        <SummaryCard
          icon={DollarSign}
          label={`LEJIO Salær (${Math.round(currentCommissionRate * 100)}%)`}
          value={`-${formatCurrency(summary.totalCommission)} kr`}
          subtext="Denne måned"
          negative
        />

        {/* Afdrag */}
        <SummaryCard
          icon={CreditCard}
          label="Månedlige afdrag"
          value={summary.totalMonthlyInstallments > 0 ? `-${formatCurrency(summary.totalMonthlyInstallments)} kr` : '0 kr'}
          subtext={summary.totalLoanBalance > 0 ? `Restgæld: ${formatCurrency(summary.totalLoanBalance)} kr` : 'Ingen aktive lån'}
          negative={summary.totalMonthlyInstallments > 0}
        />

        {/* Rengøring */}
        <SummaryCard
          icon={FileText}
          label="Rengøringsgebyrer"
          value={`+${formatCurrency(summary.totalCleaningFees)} kr`}
          subtext="Betalt af lejere"
        />

        {/* Netto-udbetaling */}
        <SummaryCard
          icon={Wallet}
          label="Netto-udbetaling"
          value={`${formatCurrency(summary.finalNetPayout)} kr`}
          subtext="Til din konto"
          highlight
        />
      </div>

      {/* Guarantee overview - 10-måneders garanti */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            10-måneders Garanti (300 dage)
          </CardTitle>
          <CardDescription>
            LEJIO garanterer minimum {GUARANTEE_DAYS} udlejningsdage om året
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Gennemsnitlig udnyttelse</p>
              <p className="text-2xl font-bold">{Math.round(summary.averageUtilization)}%</p>
              <Progress value={summary.averageUtilization} className="h-2 mt-2" />
            </div>
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-muted-foreground mb-1">Opfylder garanti</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <p className="text-2xl font-bold text-green-600">
                  {summary.vehiclesMeetingGuarantee} / {summary.totalVehicles}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Køretøjer i alt</p>
              <div className="flex items-center gap-2">
                <Car className="w-6 h-6 text-primary" />
                <p className="text-2xl font-bold">{summary.totalVehicles}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle cards grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Dine køretøjer</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(vehicle => (
            <FleetPremiumVehicleCard 
              key={vehicle.id} 
              vehicle={vehicle} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface SummaryCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext: string;
  negative?: boolean;
  highlight?: boolean;
}

const SummaryCard = ({ icon: Icon, label, value, subtext, negative, highlight }: SummaryCardProps) => (
  <Card className={cn(
    'relative overflow-hidden',
    highlight && 'border-primary/50 shadow-lg shadow-primary/10'
  )}>
    <CardContent className="p-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-primary">
        <Icon className="w-5 h-5 text-primary-foreground" />
      </div>
      <p className="text-xs text-muted-foreground mb-1 truncate">{label}</p>
      <p className={cn(
        'text-xl font-bold text-foreground',
        negative && 'text-destructive',
        highlight && 'text-primary'
      )}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{subtext}</p>
    </CardContent>
  </Card>
);

export default FleetPremiumDashboard;
