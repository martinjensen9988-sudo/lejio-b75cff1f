import { Car, Fuel, Calendar, Gauge, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchVehicle, SearchFiltersState } from "@/pages/Search";
import { differenceInDays } from "date-fns";
import { useState } from "react";
import BookingModal from "./BookingModal";

interface VehicleSearchCardProps {
  vehicle: SearchVehicle;
  isSelected: boolean;
  onSelect: () => void;
  filters: SearchFiltersState;
}

const VehicleSearchCard = ({
  vehicle,
  isSelected,
  onSelect,
  filters,
}: VehicleSearchCardProps) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Calculate total price if dates are selected
  const calculateTotalPrice = () => {
    if (!filters.startDate || !filters.endDate || !vehicle.daily_price) return null;
    const days = differenceInDays(filters.endDate, filters.startDate) + 1;
    return days * vehicle.daily_price;
  };

  const totalPrice = calculateTotalPrice();
  const days =
    filters.startDate && filters.endDate
      ? differenceInDays(filters.endDate, filters.startDate) + 1
      : null;

  return (
    <>
      <div
        className={`bg-card rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
          isSelected
            ? "border-primary shadow-lg"
            : "border-border hover:border-primary/50 hover:shadow-md"
        }`}
        onClick={onSelect}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="sm:w-1/3 h-40 sm:h-auto relative">
            {vehicle.image_url ? (
              <img
                src={vehicle.image_url}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Car className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            {vehicle.unlimited_km && (
              <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
                <Check className="w-3 h-3 mr-1" />
                Fri km
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg text-foreground">
                  {vehicle.make} {vehicle.model}
                </h3>
                {vehicle.variant && (
                  <p className="text-sm text-muted-foreground">{vehicle.variant}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">
                  {vehicle.daily_price?.toLocaleString("da-DK")} kr
                </div>
                <span className="text-sm text-muted-foreground">/dag</span>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-3 mb-3 text-sm text-muted-foreground">
              {vehicle.year && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {vehicle.year}
                </span>
              )}
              {vehicle.fuel_type && (
                <span className="flex items-center gap-1">
                  <Fuel className="w-4 h-4" />
                  {vehicle.fuel_type}
                </span>
              )}
              {!vehicle.unlimited_km && vehicle.included_km && (
                <span className="flex items-center gap-1">
                  <Gauge className="w-4 h-4" />
                  {vehicle.included_km} km/dag inkl.
                </span>
              )}
            </div>

            {/* Color & Features badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {vehicle.color && (
                <Badge variant="outline" className="text-xs">
                  {vehicle.color}
                </Badge>
              )}
              {vehicle.features?.slice(0, 3).map((feature, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>

            {/* Total price & Book button */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              {totalPrice && days ? (
                <div>
                  <span className="text-sm text-muted-foreground">
                    {days} {days === 1 ? "dag" : "dage"}:
                  </span>
                  <span className="ml-2 font-bold text-foreground">
                    {totalPrice.toLocaleString("da-DK")} kr
                  </span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Vælg datoer for at se total pris
                </span>
              )}
              <Button
                variant="warm"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBookingModal(true);
                }}
              >
                Book nu
              </Button>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        vehicle={vehicle}
        filters={filters}
      />
    </>
  );
};

export default VehicleSearchCard;
