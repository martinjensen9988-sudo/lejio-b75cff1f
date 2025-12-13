import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Fuel,
  Calendar,
  Gauge,
  Check,
  Shield,
  Star,
  Truck,
  Tent,
  Users,
  ChefHat,
  Bath,
  Umbrella,
  Weight,
  MapPin,
  X,
  CreditCard,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SearchVehicle, SearchFiltersState } from "@/pages/Search";
import { LessorStatusBadge } from "@/components/ratings/LessorStatusBadge";

interface VehicleDetailModalProps {
  vehicle: SearchVehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: SearchFiltersState;
}

export const VehicleDetailModal = ({
  vehicle,
  open,
  onOpenChange,
  filters,
}: VehicleDetailModalProps) => {
  const navigate = useNavigate();

  // Get vehicle type icon
  const VehicleIcon = useMemo(() => {
    if (!vehicle) return Car;
    switch (vehicle.vehicle_type) {
      case "trailer":
        return Truck;
      case "campingvogn":
        return Tent;
      default:
        return Car;
    }
  }, [vehicle?.vehicle_type]);

  // Get vehicle type label
  const vehicleTypeLabel = useMemo(() => {
    if (!vehicle) return "Bil";
    switch (vehicle.vehicle_type) {
      case "trailer":
        return "Trailer";
      case "campingvogn":
        return "Campingvogn";
      default:
        return "Bil";
    }
  }, [vehicle?.vehicle_type]);

  // Calculate pricing based on period type
  const pricing = useMemo(() => {
    if (!vehicle) return { unitPrice: 0, unitLabel: "", totalPrice: 0, periodCount: 0, periodLabel: "" };

    const { periodType, periodCount } = filters;

    let unitPrice = 0;
    let unitLabel = "";
    let periodLabel = "";

    switch (periodType) {
      case "monthly":
        unitPrice = vehicle.monthly_price || (vehicle.daily_price || 0) * 30;
        unitLabel = "/måned";
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

  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Image Header */}
        <div className="relative h-64 w-full">
          {vehicle.image_url ? (
            <img
              src={vehicle.image_url}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <VehicleIcon className="w-24 h-24 text-muted-foreground" />
            </div>
          )}
          
          {/* Badges on image */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Badge className="bg-secondary text-secondary-foreground">
              <VehicleIcon className="w-3 h-3 mr-1" />
              {vehicleTypeLabel}
            </Badge>
            {vehicle.unlimited_km && vehicle.vehicle_type === "bil" && (
              <Badge className="bg-accent text-accent-foreground">
                <Check className="w-3 h-3 mr-1" />
                Fri km
              </Badge>
            )}
          </div>
          
          {vehicle.owner_fleet_plan && (
            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md">
              <Shield className="w-3 h-3 mr-1" />
              LEJIO Varetager
            </Badge>
          )}
        </div>

        <div className="p-6">
          {/* Title & Price */}
          <DialogHeader className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {vehicle.make} {vehicle.model}
                </DialogTitle>
                {vehicle.variant && (
                  <p className="text-muted-foreground mt-1">{vehicle.variant}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">
                  {pricing.unitPrice.toLocaleString("da-DK")} kr
                </div>
                <span className="text-muted-foreground">{pricing.unitLabel}</span>
              </div>
            </div>
          </DialogHeader>

          {/* Owner Info */}
          {vehicle.owner_lessor_status && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
              <LessorStatusBadge status={vehicle.owner_lessor_status} size="md" />
              {vehicle.owner_average_rating && vehicle.owner_average_rating > 0 && (
                <span className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {vehicle.owner_average_rating.toFixed(1)} stjerner
                </span>
              )}
            </div>
          )}

          <Separator className="my-4" />

          {/* Vehicle Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {vehicle.year && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Årgang:</span>
                <span className="font-medium">{vehicle.year}</span>
              </div>
            )}
            
            {vehicle.color && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">Farve:</span>
                <span className="font-medium">{vehicle.color}</span>
              </div>
            )}

            {/* Car-specific */}
            {vehicle.vehicle_type === "bil" && vehicle.fuel_type && (
              <div className="flex items-center gap-2 text-sm">
                <Fuel className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Brændstof:</span>
                <span className="font-medium">{vehicle.fuel_type}</span>
              </div>
            )}

            {vehicle.vehicle_type === "bil" && (
              <div className="flex items-center gap-2 text-sm">
                <Gauge className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Kilometer:</span>
                <span className="font-medium">
                  {vehicle.unlimited_km
                    ? "Fri kilometer"
                    : `${vehicle.included_km || 0} km/dag inkl.`}
                </span>
              </div>
            )}

            {/* Trailer-specific */}
            {vehicle.vehicle_type === "trailer" && vehicle.total_weight && (
              <div className="flex items-center gap-2 text-sm">
                <Weight className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Totalvægt:</span>
                <span className="font-medium">{vehicle.total_weight} kg</span>
              </div>
            )}

            {vehicle.vehicle_type === "trailer" && (
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Kørekort:</span>
                <span className="font-medium">
                  {vehicle.requires_b_license ? "B-kørekort krævet" : "Intet B-kørekort krævet"}
                </span>
              </div>
            )}

            {/* Campingvogn-specific */}
            {vehicle.vehicle_type === "campingvogn" && vehicle.sleeping_capacity && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Sovepladser:</span>
                <span className="font-medium">{vehicle.sleeping_capacity}</span>
              </div>
            )}

            {vehicle.vehicle_type === "campingvogn" && vehicle.total_weight && (
              <div className="flex items-center gap-2 text-sm">
                <Weight className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Totalvægt:</span>
                <span className="font-medium">{vehicle.total_weight} kg</span>
              </div>
            )}

            {/* Location */}
            {vehicle.location_city && (
              <div className="flex items-center gap-2 text-sm col-span-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Lokation:</span>
                <span className="font-medium">
                  {vehicle.location_address && `${vehicle.location_address}, `}
                  {vehicle.location_postal_code} {vehicle.location_city}
                </span>
              </div>
            )}
          </div>

          {/* Campingvogn Amenities */}
          {vehicle.vehicle_type === "campingvogn" && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Faciliteter</h4>
              <div className="flex flex-wrap gap-2">
                {vehicle.has_kitchen && (
                  <Badge variant="secondary">
                    <ChefHat className="w-3 h-3 mr-1" />
                    Køkken
                  </Badge>
                )}
                {vehicle.has_bathroom && (
                  <Badge variant="secondary">
                    <Bath className="w-3 h-3 mr-1" />
                    Bad/Toilet
                  </Badge>
                )}
                {vehicle.has_awning && (
                  <Badge variant="secondary">
                    <Umbrella className="w-3 h-3 mr-1" />
                    Markise
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Udstyr</h4>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map((feature, i) => (
                  <Badge key={i} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Pricing breakdown */}
          {vehicle.deposit_required && vehicle.deposit_amount && (
            <div className="mb-4 p-3 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Prisdetaljer</h4>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Depositum:</span>
                <span className="font-medium">{vehicle.deposit_amount.toLocaleString("da-DK")} kr</span>
              </div>
              {!vehicle.unlimited_km && vehicle.extra_km_price && (
                <div className="flex items-center gap-2 text-sm mt-1">
                  <Gauge className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Ekstra km:</span>
                  <span className="font-medium">{vehicle.extra_km_price} kr/km</span>
                </div>
              )}
            </div>
          )}

          <Separator className="my-4" />

          {/* Total price & Book button */}
          <div className="flex items-center justify-between">
            {filters.startDate ? (
              <div>
                <span className="text-sm text-muted-foreground">
                  Total for {pricing.periodCount} {pricing.periodLabel}:
                </span>
                <div className="text-2xl font-bold text-foreground">
                  {pricing.totalPrice.toLocaleString("da-DK")} kr
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Vælg datoer for at se total pris</span>
              </div>
            )}
            <Button
              variant="warm"
              size="lg"
              onClick={() => {
                onOpenChange(false);
                navigate(`/booking/${vehicle.id}`);
              }}
            >
              Lej nu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
