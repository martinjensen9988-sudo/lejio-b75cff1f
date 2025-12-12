import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useGeofences } from '@/hooks/useGeofences';
import { useVehicles } from '@/hooks/useVehicles';
import { supabase } from '@/integrations/supabase/client';

interface AddGeofenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddGeofenceDialog = ({ open, onOpenChange }: AddGeofenceDialogProps) => {
  const { addGeofence } = useGeofences();
  const { vehicles } = useVehicles();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const circleRef = useRef<string | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    vehicle_id: '',
    name: '',
    center_latitude: 55.6761,
    center_longitude: 12.5683,
    radius_meters: 1000,
    alert_on_exit: true,
    alert_on_enter: false,
  });

  // Fetch Mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) throw error;
        setMapboxToken(data.token);
      } catch (err) {
        console.error('Error fetching Mapbox token:', err);
      }
    };
    if (open) fetchToken();
  }, [open]);

  // Initialize map
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || !open) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [formData.center_longitude, formData.center_latitude],
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add marker
    markerRef.current = new mapboxgl.Marker({ draggable: true })
      .setLngLat([formData.center_longitude, formData.center_latitude])
      .addTo(map.current);

    markerRef.current.on('dragend', () => {
      const lngLat = markerRef.current?.getLngLat();
      if (lngLat) {
        setFormData((prev) => ({
          ...prev,
          center_latitude: lngLat.lat,
          center_longitude: lngLat.lng,
        }));
      }
    });

    // Add circle on load
    map.current.on('load', () => {
      updateCircle();
    });

    // Click to move marker
    map.current.on('click', (e) => {
      markerRef.current?.setLngLat(e.lngLat);
      setFormData((prev) => ({
        ...prev,
        center_latitude: e.lngLat.lat,
        center_longitude: e.lngLat.lng,
      }));
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken, open]);

  // Update circle when radius or position changes
  const updateCircle = () => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const sourceId = 'geofence-circle';
    
    // Create circle GeoJSON
    const center = [formData.center_longitude, formData.center_latitude];
    const radiusInKm = formData.radius_meters / 1000;
    const points = 64;
    const coords: number[][] = [];

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const dx = radiusInKm * Math.cos(angle);
      const dy = radiusInKm * Math.sin(angle);
      const lat = center[1] + (dy / 111.32);
      const lng = center[0] + (dx / (111.32 * Math.cos(center[1] * Math.PI / 180)));
      coords.push([lng, lat]);
    }
    coords.push(coords[0]); // Close the circle

    const circleData: GeoJSON.Feature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coords],
      },
      properties: {},
    };

    if (map.current.getSource(sourceId)) {
      (map.current.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(circleData);
    } else {
      map.current.addSource(sourceId, {
        type: 'geojson',
        data: circleData,
      });

      map.current.addLayer({
        id: 'geofence-circle-fill',
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': '#3b82f6',
          'fill-opacity': 0.2,
        },
      });

      map.current.addLayer({
        id: 'geofence-circle-line',
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#3b82f6',
          'line-width': 2,
        },
      });
    }
  };

  useEffect(() => {
    updateCircle();
  }, [formData.center_latitude, formData.center_longitude, formData.radius_meters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await addGeofence.mutateAsync(formData);
    setFormData({
      vehicle_id: '',
      name: '',
      center_latitude: 55.6761,
      center_longitude: 12.5683,
      radius_meters: 1000,
      alert_on_exit: true,
      alert_on_enter: false,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Opret geofence</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Køretøj *</Label>
              <Select
                value={formData.vehicle_id}
                onValueChange={(value) => setFormData({ ...formData, vehicle_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vælg køretøj" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} ({vehicle.registration})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Navn *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="f.eks. Hjemmeadresse"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Radius: {formData.radius_meters} meter</Label>
            <Slider
              value={[formData.radius_meters]}
              onValueChange={([value]) => setFormData({ ...formData, radius_meters: value })}
              min={100}
              max={10000}
              step={100}
            />
          </div>

          <div className="h-64 rounded-lg overflow-hidden border">
            <div ref={mapContainer} className="w-full h-full" />
          </div>
          <p className="text-xs text-muted-foreground">
            Klik på kortet eller træk markøren for at placere geofencens centrum
          </p>

          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.alert_on_exit}
                onCheckedChange={(checked) => setFormData({ ...formData, alert_on_exit: checked })}
              />
              <Label>Alarm ved udkørsel</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.alert_on_enter}
                onCheckedChange={(checked) => setFormData({ ...formData, alert_on_enter: checked })}
              />
              <Label>Alarm ved indkørsel</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuller
            </Button>
            <Button type="submit" disabled={!formData.vehicle_id || !formData.name || addGeofence.isPending}>
              {addGeofence.isPending ? 'Opretter...' : 'Opret geofence'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
