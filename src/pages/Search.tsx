import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/search/SearchFilters";
import VehicleSearchCard from "@/components/search/VehicleSearchCard";
import SearchMap from "@/components/search/SearchMap";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Car, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  // Location fields from database
  use_custom_location: boolean;
  location_address: string | null;
  location_postal_code: string | null;
  location_city: string | null;
  latitude: number | null;
  longitude: number | null;
  display_address: string | null;
  display_postal_code: string | null;
  display_city: string | null;
  // Fleet/owner info for badges
  owner_fleet_plan: 'fleet_basic' | 'fleet_premium' | null;
  owner_lessor_status: 'bronze' | 'silver' | 'gold' | 'platinum' | null;
  owner_average_rating: number | null;
  owner_company_name: string | null;
  // For map compatibility
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
}

const Search = () => {
  const [vehicles, setVehicles] = useState<SearchVehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<SearchVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [filters, setFilters] = useState<SearchFiltersState>({
    priceMin: 0,
    priceMax: 5000,
    fuelType: "all",
    startDate: undefined,
    endDate: undefined,
    periodType: 'daily',
    periodCount: 1,
  });

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
      const vehiclesWithLocations = (data || []).map((vehicle, index) => {
        // Use real coordinates if available
        if (vehicle.latitude && vehicle.longitude) {
          return {
            ...vehicle,
            lat: vehicle.latitude,
            lng: vehicle.longitude,
          };
        }
        
        // Fallback: generate location based on postal code or random
        // In production, all vehicles should have geocoded coordinates
        const postalCode = vehicle.display_postal_code;
        let lat = 55.6761; // Default Copenhagen
        let lng = 12.5683;
        
        if (postalCode) {
          // Rough estimation based on Danish postal codes
          const code = parseInt(postalCode);
          if (code >= 1000 && code <= 2999) {
            // Copenhagen area
            lat = 55.676 + (Math.random() - 0.5) * 0.1;
            lng = 12.568 + (Math.random() - 0.5) * 0.15;
          } else if (code >= 3000 && code <= 3699) {
            // North Zealand
            lat = 55.85 + (Math.random() - 0.5) * 0.2;
            lng = 12.35 + (Math.random() - 0.5) * 0.3;
          } else if (code >= 4000 && code <= 4999) {
            // South/West Zealand
            lat = 55.4 + (Math.random() - 0.5) * 0.3;
            lng = 11.8 + (Math.random() - 0.5) * 0.4;
          } else if (code >= 5000 && code <= 5999) {
            // Funen
            lat = 55.4 + (Math.random() - 0.5) * 0.15;
            lng = 10.4 + (Math.random() - 0.5) * 0.2;
          } else if (code >= 6000 && code <= 6999) {
            // South Jutland
            lat = 55.3 + (Math.random() - 0.5) * 0.3;
            lng = 9.5 + (Math.random() - 0.5) * 0.4;
          } else if (code >= 7000 && code <= 7999) {
            // Central Jutland
            lat = 56.1 + (Math.random() - 0.5) * 0.3;
            lng = 9.5 + (Math.random() - 0.5) * 0.4;
          } else if (code >= 8000 && code <= 8999) {
            // East Jutland / Aarhus
            lat = 56.15 + (Math.random() - 0.5) * 0.2;
            lng = 10.2 + (Math.random() - 0.5) * 0.3;
          } else if (code >= 9000 && code <= 9999) {
            // North Jutland
            lat = 57.0 + (Math.random() - 0.5) * 0.3;
            lng = 10.0 + (Math.random() - 0.5) * 0.5;
          }
        } else {
          // Random fallback across Denmark
          lat = 55.6 + (Math.random() - 0.5) * 1.5;
          lng = 10.5 + (Math.random() - 0.5) * 3;
        }
        
        return {
          ...vehicle,
          lat,
          lng,
        };
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

    // Price filter
    result = result.filter((v) => {
      const price = v.daily_price || 0;
      return price >= filters.priceMin && price <= filters.priceMax;
    });

    // Fuel type filter
    if (filters.fuelType !== "all") {
      result = result.filter((v) => v.fuel_type === filters.fuelType);
    }

    setFilteredVehicles(result);
  }, [filters, vehicles]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-20">
        {/* Search Header */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 py-8 px-6">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Find din næste lejebil
            </h1>
            <p className="text-muted-foreground">
              {filteredVehicles.length} biler tilgængelige i Danmark
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
              {/* Map - Hidden on mobile when showing list */}
              <div className={`${showMap ? 'block' : 'hidden'} md:block md:w-1/2 lg:w-3/5`}>
                <div className="sticky top-24 h-[500px] md:h-[calc(100vh-200px)] rounded-2xl overflow-hidden border border-border shadow-soft">
                  <SearchMap
                    vehicles={filteredVehicles}
                    selectedVehicle={selectedVehicle}
                    onVehicleSelect={setSelectedVehicle}
                  />
                </div>
              </div>

              {/* Vehicle List - Hidden on mobile when showing map */}
              <div className={`${!showMap ? 'block' : 'hidden'} md:block md:w-1/2 lg:w-2/5`}>
                <div className="space-y-4">
                  {filteredVehicles.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border border-border">
                      <Car className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Ingen biler fundet</h3>
                      <p className="text-muted-foreground">
                        Prøv at justere dine filtre for at se flere resultater
                      </p>
                    </div>
                  ) : (
                    filteredVehicles.map((vehicle) => (
                      <VehicleSearchCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        isSelected={selectedVehicle === vehicle.id}
                        onSelect={() => setSelectedVehicle(vehicle.id)}
                        filters={filters}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
