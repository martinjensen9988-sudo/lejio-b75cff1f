import { Vehicle } from '@/hooks/useVehicles';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Calendar, Fuel, Trash2, Edit, ToggleLeft, ToggleRight } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onToggleAvailability: (id: string, available: boolean) => void;
  onDelete: (id: string) => void;
}

const VehicleCard = ({ vehicle, onToggleAvailability, onDelete }: VehicleCardProps) => {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft border border-border hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Car className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-muted-foreground font-mono">
              {vehicle.registration}
            </p>
          </div>
        </div>
        <Badge variant={vehicle.is_available ? 'default' : 'secondary'}>
          {vehicle.is_available ? 'Tilgængelig' : 'Ikke tilgængelig'}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
        {vehicle.year && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>{vehicle.year}</span>
          </div>
        )}
        {vehicle.fuel_type && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Fuel className="w-3.5 h-3.5" />
            <span className="capitalize">{vehicle.fuel_type}</span>
          </div>
        )}
        {vehicle.daily_price && (
          <div className="font-semibold text-foreground">
            {vehicle.daily_price} kr/dag
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => onToggleAvailability(vehicle.id, !vehicle.is_available)}
        >
          {vehicle.is_available ? (
            <>
              <ToggleRight className="w-4 h-4 mr-1 text-mint" />
              Deaktiver
            </>
          ) : (
            <>
              <ToggleLeft className="w-4 h-4 mr-1" />
              Aktiver
            </>
          )}
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive text-xs" onClick={() => onDelete(vehicle.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default VehicleCard;
