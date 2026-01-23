import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FleetVehicleStats } from '@/hooks/useFleetPremiumVehicles';
import { 
  Car, TrendingUp, Wallet, MapPin, Wrench, Gauge, Sparkles,
  ChevronDown, ChevronUp, Calendar, CreditCard, CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface FleetPremiumVehicleCardProps {
  vehicle: FleetVehicleStats;
  commissionRate: number;
}

export const FleetPremiumVehicleCard = ({ vehicle, commissionRate }: FleetPremiumVehicleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    rented: { label: 'Udlejet', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
    available: { label: 'Klar til udlejning', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    maintenance: { label: 'Værksted', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
    cleaning: { label: 'Klargøring', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  };

  const status = statusConfig[vehicle.currentStatus];
  const guaranteeProgress = Math.min((vehicle.daysRentedThisYear / vehicle.guaranteeDays) * 100, 100);
  const isMeetingGuarantee = vehicle.daysRentedThisYear >= vehicle.guaranteeDays;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('da-DK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <Card className="overflow-hidden border-border/50 hover:shadow-lg transition-all">
      {/* Header with image and status */}
      <div className="relative">
        {vehicle.image_url ? (
          <img 
            src={vehicle.image_url} 
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-32 object-cover"
          />
        ) : (
          <div className="w-full h-32 bg-muted flex items-center justify-center">
            <Car className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        <Badge className={cn('absolute top-3 right-3', status.color)}>
          {status.label}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold">
              {vehicle.make} {vehicle.model}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-mono">
              {vehicle.registration}
            </p>
          </div>
          {vehicle.year && (
            <span className="text-sm text-muted-foreground">{vehicle.year}</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current booking info */}
        {vehicle.currentBooking && (
          <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">
                {vehicle.currentBooking.renter_name || 'Anonym lejer'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(vehicle.currentBooking.start_date), 'd. MMM', { locale: da })} - {format(new Date(vehicle.currentBooking.end_date), 'd. MMM yyyy', { locale: da })}
            </p>
          </div>
        )}

        {/* Economics summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Brutto denne måned</p>
            <p className="font-bold text-lg">{formatCurrency(vehicle.monthlyRevenue)} kr</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1">Netto til dig</p>
            <p className="font-bold text-lg text-primary">{formatCurrency(vehicle.netPayout)} kr</p>
          </div>
        </div>

        {/* Installment warning if active */}
        {vehicle.activeInstallment && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 text-sm text-amber-700">
              <CreditCard className="w-4 h-4" />
              <span className="font-medium">Månedligt afdrag</span>
            </div>
            <p className="text-lg font-bold text-amber-700 mt-1">
              -{formatCurrency(vehicle.activeInstallment.monthlyAmount)} kr/md
            </p>
            <p className="text-xs text-muted-foreground">
              {vehicle.activeInstallment.description} • {vehicle.activeInstallment.remainingMonths} mdr tilbage
            </p>
          </div>
        )}

        {/* 10-month guarantee barometer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">10-måneders garanti</span>
            <span className={cn('font-medium', isMeetingGuarantee ? 'text-green-600' : 'text-foreground')}>
              {vehicle.daysRentedThisYear} / {vehicle.guaranteeDays} dage
            </span>
          </div>
          <Progress 
            value={guaranteeProgress} 
            className={cn('h-3', isMeetingGuarantee && '[&>div]:bg-green-500')}
          />
          {isMeetingGuarantee && (
            <div className="flex items-center gap-1.5 text-xs text-green-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Garanti opfyldt!</span>
            </div>
          )}
        </div>

        {/* Expandable details */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full">
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Skjul detaljer
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Vis flere detaljer
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 pt-4">
            {/* Detailed economics */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Økonomi detaljer
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between p-2 bg-muted/30 rounded">
                  <span className="text-muted-foreground">Årlig omsætning</span>
                  <span className="font-medium">{formatCurrency(vehicle.yearlyRevenue)} kr</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/30 rounded">
                  <span className="text-muted-foreground">LEJIO ({Math.round(commissionRate * 100)}%)</span>
                  <span className="font-medium text-destructive">-{formatCurrency(vehicle.commission)} kr</span>
                </div>
              </div>
            </div>

            {/* Odometer and service */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Gauge className="w-4 h-4 text-primary" />
                Forbrug & Stand
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between p-2 bg-muted/30 rounded">
                  <span className="text-muted-foreground">Kilometerstand</span>
                  <span className="font-medium">
                    {vehicle.current_odometer?.toLocaleString('da-DK') || 'Ukendt'} km
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-muted/30 rounded">
                  <span className="text-muted-foreground">Rengjort</span>
                  <span className="font-medium flex items-center gap-1">
                    {vehicle.isClean ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-green-500" />
                        Ja
                      </>
                    ) : (
                      'Nej'
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Service log */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Wrench className="w-4 h-4 text-primary" />
                Service-log
              </h4>
              {vehicle.lastServiceLog ? (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{vehicle.lastServiceLog.service_type}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(vehicle.lastServiceLog.service_date), 'd. MMM yyyy', { locale: da })}
                    </span>
                  </div>
                  {vehicle.lastServiceLog.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {vehicle.lastServiceLog.description}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Ingen service registreret endnu</p>
              )}
              {vehicle.last_service_date && (
                <p className="text-xs text-muted-foreground">
                  Næste service: {vehicle.service_status === 'service_soon' ? 'Snart' : 'Planlagt'}
                </p>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
