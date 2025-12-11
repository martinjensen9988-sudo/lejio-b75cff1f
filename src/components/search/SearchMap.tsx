import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { SearchVehicle } from "@/pages/Search";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface SearchMapProps {
  vehicles: SearchVehicle[];
  selectedVehicle: string | null;
  onVehicleSelect: (id: string | null) => void;
}

function SearchMap({ vehicles, selectedVehicle, onVehicleSelect }: SearchMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-mapbox-token");
        if (error) throw error;
        if (data?.token) {
          setMapboxToken(data.token);
        } else {
          setError("Mapbox token ikke konfigureret");
        }
      } catch (err: any) {
        console.error("Error fetching mapbox token:", err);
        setError("Kunne ikke hente kort-konfiguration");
      } finally {
        setLoading(false);
      }
    };
    fetchToken();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [10.5, 55.8], // Center of Denmark
      zoom: 6,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken]);

  // Update markers when vehicles change
  useEffect(() => {
    if (!map.current || !mapboxToken) return;

    // Remove old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add new markers
    vehicles.forEach((vehicle) => {
      if (!vehicle.lat || !vehicle.lng) return;

      const isSelected = selectedVehicle === vehicle.id;

      // Create custom marker element
      const el = document.createElement("div");
      el.className = "custom-car-marker";
      el.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: ${isSelected ? "hsl(225, 100%, 57%)" : "white"};
          color: ${isSelected ? "white" : "hsl(225, 100%, 57%)"};
          border: 2px solid hsl(225, 100%, 57%);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          transform: ${isSelected ? "scale(1.25)" : "scale(1)"};
          transition: all 0.2s;
          cursor: pointer;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/>
            <path d="M9 17h6"/>
            <circle cx="17" cy="17" r="2"/>
          </svg>
        </div>
      `;

      el.addEventListener("click", () => {
        onVehicleSelect(vehicle.id);
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([vehicle.lng, vehicle.lat])
        .addTo(map.current!);

      markersRef.current[vehicle.id] = marker;
    });
  }, [vehicles, selectedVehicle, onVehicleSelect, mapboxToken]);

  // Fly to selected vehicle
  useEffect(() => {
    if (!map.current || !selectedVehicle) return;

    const vehicle = vehicles.find((v) => v.id === selectedVehicle);
    if (vehicle?.lat && vehicle?.lng) {
      map.current.flyTo({
        center: [vehicle.lng, vehicle.lat],
        zoom: 12,
        duration: 500,
      });
    }
  }, [selectedVehicle, vehicles]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/50 rounded-2xl">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/50 rounded-2xl">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return <div ref={mapContainer} className="h-full w-full rounded-2xl" />;
}

export default SearchMap;
