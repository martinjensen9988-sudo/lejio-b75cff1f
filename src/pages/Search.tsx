import { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/search/SearchFilters";
import VehicleSearchCard from "@/components/search/VehicleSearchCard";
import SearchMap from "@/components/search/SearchMap";
import { VehicleDetailModal } from "@/components/search/VehicleDetailModal";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Car, MapPin, ArrowUpDown, Search as SearchIcon, X, Truck, Tent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = 'price_asc' | 'price_desc' | 'date_desc' | 'date_asc' | 'rating_desc';

export type VehicleTypeFilter = 'all' | 'bil' | 'trailer' | 'campingvogn';

// Public vehicle data - no sensitive fields like owner_id, vin, registration
export interface SearchVehicle {
  id: string;
  make: string;
  model: string;
  variant: string | null;
  year: number | null;
  daily_price: number | null;
  weekly_price: number | null;
  monthly_price: number | null;
  image_url: string | null;
  fuel_type: string | null;
  color: string | null;
  included_km: number | null;
  extra_km_price: number | null;
  unlimited_km: boolean;
  features: string[] | null;
  deposit_required: boolean;
  deposit_amount: number | null;
  use_custom_location: boolean;
  location_address: string | null;
  location_postal_code: string | null;
  location_city: string | null;
  latitude: number | null;
  longitude: number | null;
  vehicle_type: 'bil' | 'trailer' | 'campingvogn';
  total_weight: number | null;
  requires_b_license: boolean;
  sleeping_capacity: number | null;
  has_kitchen: boolean;
  has_bathroom: boolean;
  has_awning: boolean;
  // New trailer fields
  trailer_type: string | null;
  internal_length_cm: number | null;
  internal_width_cm: number | null;
  internal_height_cm: number | null;
  plug_type: string | null;
  has_ramps: boolean;
  has_winch: boolean;
  has_tarpaulin: boolean;
  has_net: boolean;
  has_jockey_wheel: boolean;
  has_lock_included: boolean;
  has_adapter: boolean;
  tempo_approved: boolean;
  // New caravan fields
  adult_sleeping_capacity: number | null;
  child_sleeping_capacity: number | null;
  layout_type: string | null;
  has_fridge: boolean;
  has_freezer: boolean;
  has_gas_burner: boolean;
  has_toilet: boolean;
  has_shower: boolean;
  has_hot_water: boolean;
  has_mover: boolean;
  has_bike_rack: boolean;
  has_ac: boolean;
  has_floor_heating: boolean;
  has_tv: boolean;
  has_awning_tent: boolean;
  service_included: boolean;
  camping_furniture_included: boolean;
  gas_bottle_included: boolean;
  pets_allowed: boolean;
  smoking_allowed: boolean;
  festival_use_allowed: boolean;
  // Display/owner fields
  display_address?: string | null;
  display_postal_code?: string | null;
  display_city?: string | null;
  owner_id?: string;
  owner_fleet_plan?: 'fleet_basic' | 'fleet_premium' | null;
  owner_lessor_status?: 'bronze' | 'silver' | 'gold' | 'platinum' | null;
  owner_average_rating?: number | null;
  owner_company_name?: string | null;
  created_at?: string | null;
  lat?: number;
  lng?: number;
}

export type RentalPeriodType = 'daily' | 'weekly' | 'monthly';

export interface SearchFiltersState {
  priceMin: number;
  priceMax: number;
  fuelType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  periodType: RentalPeriodType;
  periodCount: number;
  vehicleType: VehicleTypeFilter;
  trailerType?: string;
  maxWeight?: number;
  minSleepingCapacity?: number;
}

const Search = () => {
  const [vehicles, setVehicles] = useState<SearchVehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<SearchVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [detailVehicle, setDetailVehicle] = useState<SearchVehicle | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFiltersState>({
    priceMin: 0,
    priceMax: 5000,
    fuelType: "all",
    startDate: undefined,
    endDate: undefined,
    periodType: 'daily',
    periodCount: 1,
    vehicleType: 'all',
  });

  // Sort vehicles based on selected option
  const sortedVehicles = useMemo(() => {
    const sorted = [...filteredVehicles];
    switch (sortBy) {
      case 'price_asc':
        return sorted.sort((a, b) => (a.daily_price || 0) - (b.daily_price || 0));
      case 'price_desc':
        return sorted.sort((a, b) => (b.daily_price || 0) - (a.daily_price || 0));
      case 'date_asc':
        return sorted.sort((a, b) => 
          new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
        );
      case 'date_desc':
        return sorted.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
      case 'rating_desc':
        return sorted.sort((a, b) => (b.owner_average_rating || 0) - (a.owner_average_rating || 0));
      default:
        return sorted;
    }
  }, [filteredVehicles, sortBy]);

  // Fetch available vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      // Use public view that only exposes non-sensitive fields
      const { data, error } = await supabase
        .from("vehicles_public")
        .select("*");

      if (error) {
        console.error("Error fetching vehicles:", error);
        setLoading(false);
        return;
      }

      // Map database coordinates to lat/lng for map, with fallback for vehicles without coordinates
      const vehiclesWithLocations = (data || []).map((vehicle) => {
        // Default location values
        let lat = vehicle.latitude || 55.6761;
        let lng = vehicle.longitude || 12.5683;
        
        // Fallback: generate location based on postal code if no coordinates
        if (!vehicle.latitude || !vehicle.longitude) {
          const postalCode = vehicle.location_postal_code;
          if (postalCode) {
            const code = parseInt(postalCode);
            if (code >= 1000 && code <= 2999) {
              lat = 55.676 + (Math.random() - 0.5) * 0.1;
              lng = 12.568 + (Math.random() - 0.5) * 0.15;
            } else if (code >= 3000 && code <= 3699) {
              lat = 55.85 + (Math.random() - 0.5) * 0.2;
              lng = 12.35 + (Math.random() - 0.5) * 0.3;
            } else if (code >= 4000 && code <= 4999) {
              lat = 55.4 + (Math.random() - 0.5) * 0.3;
              lng = 11.8 + (Math.random() - 0.5) * 0.4;
            } else if (code >= 5000 && code <= 5999) {
              lat = 55.4 + (Math.random() - 0.5) * 0.15;
              lng = 10.4 + (Math.random() - 0.5) * 0.2;
            } else if (code >= 6000 && code <= 6999) {
              lat = 55.3 + (Math.random() - 0.5) * 0.3;
              lng = 9.5 + (Math.random() - 0.5) * 0.4;
            } else if (code >= 7000 && code <= 7999) {
              lat = 56.1 + (Math.random() - 0.5) * 0.3;
              lng = 9.5 + (Math.random() - 0.5) * 0.4;
            } else if (code >= 8000 && code <= 8999) {
              lat = 56.15 + (Math.random() - 0.5) * 0.2;
              lng = 10.2 + (Math.random() - 0.5) * 0.3;
            } else if (code >= 9000 && code <= 9999) {
              lat = 57.0 + (Math.random() - 0.5) * 0.3;
              lng = 10.0 + (Math.random() - 0.5) * 0.5;
            }
          } else {
            lat = 55.6 + (Math.random() - 0.5) * 1.5;
            lng = 10.5 + (Math.random() - 0.5) * 3;
          }
        }
        
        return {
          ...vehicle,
          vehicle_type: vehicle.vehicle_type || 'bil',
          total_weight: vehicle.total_weight || null,
          requires_b_license: vehicle.requires_b_license ?? true,
          sleeping_capacity: vehicle.sleeping_capacity || null,
          has_kitchen: vehicle.has_kitchen || false,
          has_bathroom: vehicle.has_bathroom || false,
          has_awning: vehicle.has_awning || false,
          lat,
          lng,
        } as SearchVehicle;
      });

      setVehicles(vehiclesWithLocations);
      setFilteredVehicles(vehiclesWithLocations);
      setLoading(false);
    };

    fetchVehicles();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...vehicles];

    // Vehicle type filter
    if (filters.vehicleType !== "all") {
      result = result.filter((v) => v.vehicle_type === filters.vehicleType);
    }

    // Search query filter (make/model)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((v) => {
        const make = (v.make || '').toLowerCase();
        const model = (v.model || '').toLowerCase();
        const variant = (v.variant || '').toLowerCase();
        return make.includes(query) || model.includes(query) || variant.includes(query);
      });
    }

    // Price filter
    result = result.filter((v) => {
      const price = v.daily_price || 0;
      return price >= filters.priceMin && price <= filters.priceMax;
    });

    // Weight filter for trailers/campingvogne
    if (filters.maxWeight && (filters.vehicleType === 'trailer' || filters.vehicleType === 'campingvogn')) {
      result = result.filter((v) => !v.total_weight || v.total_weight <= filters.maxWeight!);
    }

    // Sleeping capacity filter for campingvogne
    if (filters.minSleepingCapacity && filters.vehicleType === 'campingvogn') {
      const minCapacity = filters.minSleepingCapacity;
      result = result.filter((v) => {
        const totalCapacity = (v.adult_sleeping_capacity || 0) + (v.child_sleeping_capacity || 0) || v.sleeping_capacity || 0;
        return totalCapacity >= minCapacity;
      });
    }

    // Trailer type filter
    if (filters.trailerType && filters.trailerType !== 'all' && filters.vehicleType === 'trailer') {
      result = result.filter((v) => v.trailer_type === filters.trailerType);
    }

    setFilteredVehicles(result);
  }, [filters, vehicles, searchQuery]);

  // Get vehicle type label and count
  const getVehicleTypeLabel = () => {
    switch (filters.vehicleType) {
      case 'bil': return 'biler';
      case 'trailer': return 'trailere';
      case 'campingvogn': return 'campingvogne';
      default: return 'køretøjer';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-20">
        {/* Search Header */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 py-8 px-6">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Find dit næste køretøj
            </h1>
            <p className="text-muted-foreground">
              {filteredVehicles.length} {getVehicleTypeLabel()} tilgængelige i Danmark
            </p>
          </div>
        </div>

        {/* Filters */}
        <SearchFilters filters={filters} setFilters={setFilters} />

        {/* Toggle Map/List on mobile */}
        <div className="md:hidden px-4 py-3 border-b border-border">
          <div className="flex gap-2">
            <Button
              variant={showMap ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMap(true)}
              className="flex-1"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Kort
            </Button>
            <Button
              variant={!showMap ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMap(false)}
              className="flex-1"
            >
              <Car className="w-4 h-4 mr-2" />
              Liste
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Vehicle List - Shows by default */}
              <div className={`${!showMap ? 'block' : 'hidden'} md:block ${showMap ? 'md:w-1/2 lg:w-2/5' : 'md:w-full'}`}>
                <div className="flex flex-col gap-3 mb-4">
                  {/* Search Input */}
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Søg efter mærke eller model..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Sort and Map Toggle */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h2 className="font-semibold text-lg">{filteredVehicles.length} {getVehicleTypeLabel()}</h2>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <ArrowUpDown className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Sorter efter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date_desc">Nyeste først</SelectItem>
                          <SelectItem value="date_asc">Ældste først</SelectItem>
                          <SelectItem value="price_asc">Pris: Lav til høj</SelectItem>
                          <SelectItem value="price_desc">Pris: Høj til lav</SelectItem>
                          <SelectItem value="rating_desc">Bedst bedømt</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMap(!showMap)}
                        className="hidden md:flex shrink-0"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        {showMap ? 'Skjul kort' : 'Vis kort'}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className={`grid gap-4 ${!showMap ? 'md:grid-cols-2 lg:grid-cols-3' : ''}`}>
                  {filteredVehicles.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border border-border col-span-full">
                      <Car className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Ingen biler fundet</h3>
                      <p className="text-muted-foreground">
                        Prøv at justere dine filtre for at se flere resultater
                      </p>
                    </div>
                  ) : (
                    sortedVehicles.map((vehicle) => (
                      <VehicleSearchCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        isSelected={selectedVehicle === vehicle.id}
                        onSelect={() => {
                          setSelectedVehicle(vehicle.id);
                          setDetailVehicle(vehicle);
                        }}
                        filters={filters}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Map - Hidden by default, shown when toggled */}
              {showMap && (
                <div className={`${showMap ? 'block' : 'hidden'} md:block md:w-1/2 lg:w-3/5`}>
                  <div className="sticky top-24 h-[500px] md:h-[calc(100vh-200px)] rounded-2xl overflow-hidden border border-border shadow-soft">
                    <SearchMap
                      vehicles={filteredVehicles}
                      selectedVehicle={selectedVehicle}
                      onVehicleSelect={setSelectedVehicle}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Vehicle Detail Modal */}
        <VehicleDetailModal
          vehicle={detailVehicle}
          open={detailVehicle !== null}
          onOpenChange={(open) => {
            if (!open) setDetailVehicle(null);
          }}
          filters={filters}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Search;
