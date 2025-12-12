import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Loader2 } from 'lucide-react';

interface VehicleLocationMapProps {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  address?: string | null;
  postalCode?: string | null;
  city?: string | null;
  className?: string;
}

const VehicleLocationMap = ({ 
  latitude, 
  longitude, 
  address, 
  postalCode, 
  city,
  className = "h-40"
}: VehicleLocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) throw error;
        if (data?.token) {
          setMapboxToken(data.token);
        } else {
          setError('Mapbox token ikke tilgængelig');
        }
      } catch (err) {
        console.error('Error fetching mapbox token:', err);
        setError('Kunne ikke hente kort');
      } finally {
        setLoading(false);
      }
    };
    fetchToken();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;
    
    // Default to Copenhagen if no coordinates
    const lng = longitude || 12.5683;
    const lat = latitude || 55.6761;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: latitude && longitude ? 14 : 10,
      interactive: true,
      dragPan: true,
      scrollZoom: false,
    });

    // Add navigation control
    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'top-right'
    );

    // Add marker if we have coordinates
    if (latitude && longitude) {
      const el = document.createElement('div');
      el.className = 'vehicle-location-marker';
      el.innerHTML = `
        <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2.8-4.2A2 2 0 0 0 13.5 5h-3a2 2 0 0 0-1.7 1L6 10l-2.5 1.1C2.7 11.8 2 12.6 2 13.5V16c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/>
            <circle cx="17" cy="17" r="2"/>
          </svg>
        </div>
      `;

      marker.current = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .addTo(map.current);
    }

    return () => {
      marker.current?.remove();
      map.current?.remove();
    };
  }, [mapboxToken, latitude, longitude]);

  // Build address string
  const addressString = [address, postalCode, city].filter(Boolean).join(', ');

  if (loading) {
    return (
      <div className={`${className} rounded-xl bg-muted/50 flex items-center justify-center`}>
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !mapboxToken) {
    return (
      <div className={`${className} rounded-xl bg-muted/50 flex flex-col items-center justify-center gap-2`}>
        <MapPin className="w-5 h-5 text-muted-foreground" />
        {addressString && (
          <p className="text-xs text-muted-foreground text-center px-4">{addressString}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div 
        ref={mapContainer} 
        className={`${className} rounded-xl overflow-hidden border border-border`}
      />
      {addressString && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{addressString}</span>
        </div>
      )}
    </div>
  );
};

export default VehicleLocationMap;
