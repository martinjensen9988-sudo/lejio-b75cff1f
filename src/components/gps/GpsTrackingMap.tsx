import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { GpsDeviceWithLatest } from '@/hooks/useGpsDevices';
import { MapPin } from 'lucide-react';

interface GpsTrackingMapProps {
  devices: GpsDeviceWithLatest[];
  selectedDevice?: GpsDeviceWithLatest | null;
  onSelectDevice?: (device: GpsDeviceWithLatest) => void;
}

export const GpsTrackingMap = ({ devices, selectedDevice, onSelectDevice }: GpsTrackingMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) throw error;
        setMapboxToken(data.token);
      } catch (err) {
        console.error('Error fetching Mapbox token:', err);
        setError('Kunne ikke hente kortdata');
      } finally {
        setLoading(false);
      }
    };
    fetchToken();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [10.2, 56.2], // Denmark center
      zoom: 6,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken]);

  // Update markers
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for devices with positions
    const devicesWithPositions = devices.filter((d) => d.latest_position);
    
    devicesWithPositions.forEach((device) => {
      if (!device.latest_position) return;

      const isSelected = selectedDevice?.id === device.id;
      
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'gps-marker';
      el.innerHTML = `
        <div style="
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: ${isSelected ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'};
          border: 3px solid ${isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          transition: all 0.2s;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${isSelected ? 'white' : 'currentColor'}" stroke-width="2">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
            <circle cx="7" cy="17" r="2"></circle>
            <circle cx="17" cy="17" r="2"></circle>
          </svg>
        </div>
      `;

      el.addEventListener('click', () => {
        onSelectDevice?.(device);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([device.latest_position.longitude, device.latest_position.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <strong>${device.vehicle?.make} ${device.vehicle?.model}</strong><br/>
              <span style="color: #666;">${device.vehicle?.registration}</span><br/>
              ${device.latest_position.speed !== null ? `<span>Hastighed: ${Math.round(device.latest_position.speed)} km/t</span><br/>` : ''}
              ${device.latest_position.odometer !== null ? `<span>Km-tæller: ${Math.round(device.latest_position.odometer)} km</span>` : ''}
            </div>
          `)
        )
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (devicesWithPositions.length > 0 && !selectedDevice) {
      const bounds = new mapboxgl.LngLatBounds();
      devicesWithPositions.forEach((device) => {
        if (device.latest_position) {
          bounds.extend([device.latest_position.longitude, device.latest_position.latitude]);
        }
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 14 });
    }
  }, [devices, selectedDevice, onSelectDevice]);

  // Fly to selected device
  useEffect(() => {
    if (!map.current || !selectedDevice?.latest_position) return;

    map.current.flyTo({
      center: [selectedDevice.latest_position.longitude, selectedDevice.latest_position.latitude],
      zoom: 14,
      duration: 1000,
    });
  }, [selectedDevice]);

  if (loading) {
    return (
      <Card className="h-[500px]">
        <CardContent className="h-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-[500px]">
        <CardContent className="h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[500px] overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Live sporing
          {devices.filter((d) => d.latest_position).length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({devices.filter((d) => d.latest_position).length} køretøjer)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-60px)]">
        <div ref={mapContainer} className="w-full h-full" />
      </CardContent>
    </Card>
  );
};
