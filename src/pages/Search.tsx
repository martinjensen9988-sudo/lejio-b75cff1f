import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SearchMap from "@/components/search/SearchMap";
import SearchFilters from "@/components/search/SearchFilters";
import VehicleSearchCard from "@/components/search/VehicleSearchCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Car, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  registration: string;
  // Simulated location for demo (in production, add lat/lng to vehicles table)
  lat?: number;
  lng?: number;
}

export interface SearchFiltersState {
  priceMin: number;
  priceMax: number;
  fuelType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
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
  });

  // Fetch available vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("is_available", true);

      if (error) {
        console.error("Error fetching vehicles:", error);
        setLoading(false);
        return;
      }

      // Add simulated locations for demo (spread around Denmark)
      const vehiclesWithLocations = (data || []).map((vehicle, index) => ({
        ...vehicle,
        // Simulated locations around major Danish cities
        lat: 55.6 + (Math.random() - 0.5) * 1.5,
        lng: 10.5 + (Math.random() - 0.5) * 3,
      }));

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
