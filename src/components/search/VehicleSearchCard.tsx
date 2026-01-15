import { useMemo } from "react";
import { Car, Fuel, Calendar, Gauge, Check, Shield, Star, Truck, Tent, Users, ChefHat, Bath, Umbrella, Weight, MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchVehicle, SearchFiltersState } from "@/pages/Search";
import { LessorStatusBadge } from "@/components/ratings/LessorStatusBadge";
import FavoriteButton from "@/components/search/FavoriteButton";

interface VehicleSearchCardProps {
  vehicle: SearchVehicle;
  isSelected: boolean;
  onSelect: () => void;
  filters: SearchFiltersState;
  viewMode?: 'grid' | 'list' | 'map';
}

const VehicleSearchCard = ({
  vehicle,
  isSelected,
  onSelect,
  filters,
  viewMode = 'grid',
}: VehicleSearchCardProps) => {
  const navigate = useNavigate();

  const VehicleIcon = useMemo(() => {
    switch (vehicle.vehicle_type) {
      case 'trailer': return Truck;
      case 'campingvogn': return Tent;
      default: return Car;
    }
  }, [vehicle.vehicle_type]);

  const vehicleTypeLabel = useMemo(() => {
    switch (vehicle.vehicle_type) {
      case 'trailer': return 'Trailer';
      case 'campingvogn': return 'Campingvogn';
      default: return 'Bil';
    }
  }, [vehicle.vehicle_type]);

  const pricing = useMemo(() => {
    const { periodType, periodCount } = filters;

    let unitPrice = 0;
    let unitLabel = "";
    let periodLabel = "";

    switch (periodType) {
      case "monthly":
        unitPrice = vehicle.monthly_price || (vehicle.daily_price || 0) * 30;
        unitLabel = "/md";
        periodLabel = periodCount === 1 ? "måned" : "måneder";
        break;
      case "weekly":
        unitPrice = vehicle.weekly_price || (vehicle.daily_price || 0) * 7;
        unitLabel = "/uge";
        periodLabel = periodCount === 1 ? "uge" : "uger";
        break;
      default:
        unitPrice = vehicle.daily_price || 0;
        unitLabel = "/dag";
        periodLabel = periodCount === 1 ? "dag" : "dage";
    }

    const totalPrice = unitPrice * periodCount;

    return {
      unitPrice,
      unitLabel,
      totalPrice,
      periodCount,
      periodLabel,
    };
  }, [filters, vehicle]);

  const location = vehicle.location_city || vehicle.location_postal_code || 'Danmark';

  if (viewMode === 'list') {
    return (
      <div
        className={`group bg-card rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1 ${
          isSelected
            ? "border-primary shadow-xl shadow-primary/10"
            : "border-border hover:border-primary/30 hover:shadow-lg"
        }`}
        onClick={onSelect}
      >
        <div className="flex">
          {/* Image */}
          <div className="w-64 h-48 relative shrink-0">
            {vehicle.image_url ? (
              <img
                src={vehicle.image_url}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <VehicleIcon className="w-16 h-16 text-muted-foreground/50" />
              </div>
            )}
            <FavoriteButton 
              vehicleId={vehicle.id} 
              className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg"
            />
            {vehicle.owner_fleet_plan && (
              <Badge className="absolute bottom-3 left-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
                <Shield className="w-3 h-3 mr-1" />
                LEJIO Varetager
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  {vehicle.variant && (
                    <p className="text-muted-foreground">{vehicle.variant}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-black text-primary">
                    {pricing.unitPrice.toLocaleString("da-DK")} kr
                  </div>
                  <span className="text-sm text-muted-foreground">{pricing.unitLabel}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                {vehicle.year && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {vehicle.year}
                  </span>
                )}
                {vehicle.vehicle_type === 'bil' && vehicle.fuel_type && (
                  <span className="flex items-center gap-1.5">
                    <Fuel className="w-4 h-4" />
                    {vehicle.fuel_type}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {location}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {filters.startDate ? (
                <div className="text-sm">
                  <span className="text-muted-foreground">{pricing.periodCount} {pricing.periodLabel}:</span>
                  <span className="ml-2 font-bold text-foreground">{pricing.totalPrice.toLocaleString("da-DK")} kr</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Vælg datoer for total pris</span>
              )}
              <Button
                className="bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/booking/${vehicle.id}`);
                }}
              >
                Lej nu
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div
      className={`group bg-card rounded-3xl border-2 transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-2 ${
        isSelected
          ? "border-primary shadow-xl shadow-primary/10"
          : "border-border hover:border-primary/30 hover:shadow-xl"
      }`}
      onClick={onSelect}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {vehicle.image_url ? (
          <img
            src={vehicle.image_url}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <VehicleIcon className="w-16 h-16 text-muted-foreground/50" />
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {vehicle.vehicle_type !== 'bil' && (
            <Badge className="bg-secondary/90 backdrop-blur-sm text-secondary-foreground shadow-lg">
              <VehicleIcon className="w-3 h-3 mr-1" />
              {vehicleTypeLabel}
            </Badge>
          )}
          {vehicle.unlimited_km && vehicle.vehicle_type === 'bil' && (
            <Badge className="bg-accent/90 backdrop-blur-sm text-white shadow-lg">
              <Check className="w-3 h-3 mr-1" />
              Fri km
            </Badge>
          )}
        </div>

        {/* Favorite button */}
        <FavoriteButton 
          vehicleId={vehicle.id} 
          className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg"
        />

        {/* Fleet badge */}
        {vehicle.owner_fleet_plan && (
          <Badge className="absolute bottom-3 right-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
            <Shield className="w-3 h-3 mr-1" />
            LEJIO
          </Badge>
        )}

        {/* Price tag */}
        <div className="absolute bottom-3 left-3 bg-card/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-xl font-black text-primary">
              {pricing.unitPrice.toLocaleString("da-DK")}
            </span>
            <span className="text-sm text-muted-foreground">kr{pricing.unitLabel}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title & Rating */}
        <div className="mb-3">
          <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {vehicle.make} {vehicle.model}
          </h3>
          {vehicle.variant && (
            <p className="text-sm text-muted-foreground truncate">{vehicle.variant}</p>
          )}
        </div>

        {/* Rating & Status */}
        {(vehicle.owner_lessor_status || vehicle.owner_average_rating) && (
          <div className="flex items-center gap-2 mb-3">
            {vehicle.owner_lessor_status && (
              <LessorStatusBadge status={vehicle.owner_lessor_status} size="sm" />
            )}
            {vehicle.owner_average_rating && vehicle.owner_average_rating > 0 && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-secondary text-secondary" />
                {vehicle.owner_average_rating.toFixed(1)}
              </span>
            )}
          </div>
        )}

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4 text-sm text-muted-foreground">
          {vehicle.year && (
            <span className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-lg">
              <Calendar className="w-3.5 h-3.5" />
              {vehicle.year}
            </span>
          )}
          {vehicle.vehicle_type === 'bil' && vehicle.fuel_type && (
            <span className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-lg">
              <Fuel className="w-3.5 h-3.5" />
              {vehicle.fuel_type}
            </span>
          )}
          {vehicle.vehicle_type === 'trailer' && vehicle.total_weight && (
            <span className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-lg">
              <Weight className="w-3.5 h-3.5" />
              {vehicle.total_weight} kg
            </span>
          )}
          {vehicle.vehicle_type === 'campingvogn' && vehicle.sleeping_capacity && (
            <span className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-lg">
              <Users className="w-3.5 h-3.5" />
              {vehicle.sleeping_capacity} pers.
            </span>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>

        {/* Campingvogn amenities */}
        {vehicle.vehicle_type === 'campingvogn' && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {vehicle.has_kitchen && (
              <Badge variant="secondary" className="text-xs">
                <ChefHat className="w-3 h-3 mr-1" />
                Køkken
              </Badge>
            )}
            {vehicle.has_bathroom && (
              <Badge variant="secondary" className="text-xs">
                <Bath className="w-3 h-3 mr-1" />
                Bad
              </Badge>
            )}
            {vehicle.has_awning && (
              <Badge variant="secondary" className="text-xs">
                <Umbrella className="w-3 h-3 mr-1" />
                Markise
              </Badge>
            )}
          </div>
        )}

        {/* Total price & Book button */}
        <div className="pt-4 border-t border-border">
          {filters.startDate ? (
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                {pricing.periodCount} {pricing.periodLabel}
              </span>
              <span className="font-bold text-foreground">
                {pricing.totalPrice.toLocaleString("da-DK")} kr
              </span>
            </div>
          ) : null}
          <Button
            className="w-full bg-gradient-to-r from-primary to-primary/80 font-bold shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/booking/${vehicle.id}`);
            }}
          >
            Lej nu
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleSearchCard;
