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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGeofences } from '@/hooks/useGeofences';
import { useVehicles } from '@/hooks/useVehicles';
import { supabase } from '@/integrations/supabase/client';
import { Circle, Pentagon, Trash2 } from 'lucide-react';

interface AddGeofenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Predefined country boundaries (simplified)
const COUNTRY_BOUNDARIES: Record<string, { name: string; coordinates: number[][] }> = {
  denmark: {
    name: 'Danmark',
    coordinates: [
      [8.0, 54.5], [8.0, 57.8], [10.5, 57.8], [12.7, 56.0], 
      [12.7, 55.3], [15.2, 55.0], [15.2, 54.5], [12.0, 54.5], 
      [10.0, 54.8], [8.0, 54.5]
    ]
  },
  scandinavia: {
    name: 'Skandinavien',
    coordinates: [
      [4.5, 57.8], [5.0, 62.5], [7.0, 65.0], [14.0, 69.0], 
      [31.0, 70.0], [31.0, 60.0], [28.0, 59.5], [23.0, 59.0],
      [18.0, 56.0], [12.5, 55.5], [8.0, 54.5], [4.5, 57.8]
    ]
  },
  eu: {
    name: 'EU',
    coordinates: [
      [-10.0, 36.0], [-10.0, 71.0], [40.0, 71.0], [40.0, 36.0], [-10.0, 36.0]
    ]
  }
};

export const AddGeofenceDialog = ({ open, onOpenChange }: AddGeofenceDialogProps) => {
  const { addGeofence } = useGeofences();
  const { vehicles } = useVehicles();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [geofenceType, setGeofenceType] = useState<'circle' | 'polygon'>('circle');
  const [polygonPoints, setPolygonPoints] = useState<number[][]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const [formData, setFormData] = useState({
    vehicle_id: '',
    name: '',
    center_latitude: 55.6761,
    center_longitude: 12.5683,
    radius_meters: 5000, // Default 5km
    alert_on_exit: true,
    alert_on_enter: false,
  });

  // Convert radius to km for display
  const radiusKm = formData.radius_meters / 1000;

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
      zoom: geofenceType === 'polygon' ? 5 : 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    if (geofenceType === 'circle') {
      // Add marker for circle mode
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

      // Click to move marker
      map.current.on('click', (e) => {
        markerRef.current?.setLngLat(e.lngLat);
        setFormData((prev) => ({
          ...prev,
          center_latitude: e.lngLat.lat,
          center_longitude: e.lngLat.lng,
        }));
      });
    } else {
      // Polygon mode - click to add points
      map.current.on('click', (e) => {
        if (selectedPreset) return; // Don't add points when using preset
        setPolygonPoints(prev => [...prev, [e.lngLat.lng, e.lngLat.lat]]);
      });
    }

    // Add shapes on load
    map.current.on('load', () => {
      if (geofenceType === 'circle') {
        updateCircle();
      } else {
        updatePolygon();
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
      markerRef.current = null;
    };
  }, [mapboxToken, open, geofenceType]);

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

  // Update polygon
  const updatePolygon = () => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const sourceId = 'geofence-polygon';
    const pointsToUse = selectedPreset 
      ? COUNTRY_BOUNDARIES[selectedPreset]?.coordinates || []
      : polygonPoints;

    if (pointsToUse.length < 3) {
      // Remove existing polygon if not enough points
      if (map.current.getLayer('geofence-polygon-fill')) {
        map.current.removeLayer('geofence-polygon-fill');
      }
      if (map.current.getLayer('geofence-polygon-line')) {
        map.current.removeLayer('geofence-polygon-line');
      }
      if (map.current.getLayer('geofence-polygon-points')) {
        map.current.removeLayer('geofence-polygon-points');
      }
      if (map.current.getSource(sourceId)) {
        map.current.removeSource(sourceId);
      }
      if (map.current.getSource('geofence-points')) {
        map.current.removeSource('geofence-points');
      }
      return;
    }

    const closedCoords = [...pointsToUse, pointsToUse[0]];

    const polygonData: GeoJSON.Feature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [closedCoords],
      },
      properties: {},
    };

    if (map.current.getSource(sourceId)) {
      (map.current.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(polygonData);
    } else {
      map.current.addSource(sourceId, {
        type: 'geojson',
        data: polygonData,
      });

      map.current.addLayer({
        id: 'geofence-polygon-fill',
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': '#3b82f6',
          'fill-opacity': 0.2,
        },
      });

      map.current.addLayer({
        id: 'geofence-polygon-line',
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#3b82f6',
          'line-width': 2,
        },
      });
    }

    // Add point markers for custom polygons
    if (!selectedPreset && pointsToUse.length > 0) {
      const pointsData: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: pointsToUse.map((coord, i) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: coord },
          properties: { index: i },
        })),
      };

      if (map.current.getSource('geofence-points')) {
        (map.current.getSource('geofence-points') as mapboxgl.GeoJSONSource).setData(pointsData);
      } else {
        map.current.addSource('geofence-points', {
          type: 'geojson',
          data: pointsData,
        });

        map.current.addLayer({
          id: 'geofence-polygon-points',
          type: 'circle',
          source: 'geofence-points',
          paint: {
            'circle-radius': 6,
            'circle-color': '#3b82f6',
            'circle-stroke-color': '#fff',
            'circle-stroke-width': 2,
          },
        });
      }
    }
  };

  useEffect(() => {
    if (geofenceType === 'circle') {
      updateCircle();
    }
  }, [formData.center_latitude, formData.center_longitude, formData.radius_meters]);

  useEffect(() => {
    if (geofenceType === 'polygon') {
      updatePolygon();
    }
  }, [polygonPoints, selectedPreset]);

  // Handle preset selection
  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    setPolygonPoints([]);
    
    if (preset && COUNTRY_BOUNDARIES[preset]) {
      setFormData(prev => ({ ...prev, name: COUNTRY_BOUNDARIES[preset].name }));
      
      // Center map on preset
      if (map.current) {
        const coords = COUNTRY_BOUNDARIES[preset].coordinates;
        const bounds = coords.reduce(
          (b, c) => b.extend(c as [number, number]),
          new mapboxgl.LngLatBounds(coords[0] as [number, number], coords[0] as [number, number])
        );
        map.current.fitBounds(bounds, { padding: 50 });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (geofenceType === 'polygon') {
      const pointsToUse = selectedPreset 
        ? COUNTRY_BOUNDARIES[selectedPreset]?.coordinates || []
        : polygonPoints;
      
      if (pointsToUse.length < 3) return;
      
      // Calculate center for display purposes
      const centerLng = pointsToUse.reduce((sum, p) => sum + p[0], 0) / pointsToUse.length;
      const centerLat = pointsToUse.reduce((sum, p) => sum + p[1], 0) / pointsToUse.length;
      
      // Calculate approximate radius for backwards compatibility
      const maxDistKm = pointsToUse.reduce((max, p) => {
        const dLat = (p[1] - centerLat) * 111.32;
        const dLng = (p[0] - centerLng) * 111.32 * Math.cos(centerLat * Math.PI / 180);
        return Math.max(max, Math.sqrt(dLat * dLat + dLng * dLng));
      }, 0);
      
      // Store as proper polygon with coordinates
      await addGeofence.mutateAsync({
        ...formData,
        center_latitude: centerLat,
        center_longitude: centerLng,
        radius_meters: Math.round(maxDistKm * 1000),
        geofence_type: 'polygon',
        polygon_coordinates: pointsToUse,
      });
    } else {
      await addGeofence.mutateAsync({
        ...formData,
        geofence_type: 'circle',
        polygon_coordinates: null,
      });
    }
    
    // Reset form
    setFormData({
      vehicle_id: '',
      name: '',
      center_latitude: 55.6761,
      center_longitude: 12.5683,
      radius_meters: 5000,
      alert_on_exit: true,
      alert_on_enter: false,
    });
    setPolygonPoints([]);
    setSelectedPreset('');
    setGeofenceType('circle');
    onOpenChange(false);
  };

  const clearPolygon = () => {
    setPolygonPoints([]);
    setSelectedPreset('');
    setFormData(prev => ({ ...prev, name: '' }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

          {/* Geofence type tabs */}
          <Tabs value={geofenceType} onValueChange={(v) => setGeofenceType(v as 'circle' | 'polygon')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="circle" className="gap-2">
                <Circle className="w-4 h-4" />
                Cirkel
              </TabsTrigger>
              <TabsTrigger value="polygon" className="gap-2">
                <Pentagon className="w-4 h-4" />
                Område/Grænse
              </TabsTrigger>
            </TabsList>

            <TabsContent value="circle" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Radius: {radiusKm.toFixed(1)} km</Label>
                <Slider
                  value={[formData.radius_meters]}
                  onValueChange={([value]) => setFormData({ ...formData, radius_meters: value })}
                  min={500}
                  max={100000}
                  step={500}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.5 km</span>
                  <span>100 km</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="polygon" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Foruddefinerede områder</Label>
                <Select value={selectedPreset} onValueChange={handlePresetChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vælg et land/område..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="denmark">Danmark</SelectItem>
                    <SelectItem value="scandinavia">Skandinavien</SelectItem>
                    <SelectItem value="eu">EU</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Eller klik på kortet for at tegne dit eget område
                </p>
              </div>

              {(polygonPoints.length > 0 || selectedPreset) && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {selectedPreset 
                      ? `${COUNTRY_BOUNDARIES[selectedPreset]?.name} valgt`
                      : `${polygonPoints.length} punkter tegnet`
                    }
                  </span>
                  <Button type="button" variant="outline" size="sm" onClick={clearPolygon}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Ryd
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="h-64 rounded-lg overflow-hidden border">
            <div ref={mapContainer} className="w-full h-full" />
          </div>
          <p className="text-xs text-muted-foreground">
            {geofenceType === 'circle' 
              ? 'Klik på kortet eller træk markøren for at placere geofencens centrum'
              : 'Klik på kortet for at tegne punkter, eller vælg et foruddefineret område'
            }
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
            <Button 
              type="submit" 
              disabled={
                !formData.vehicle_id || 
                !formData.name || 
                addGeofence.isPending ||
                (geofenceType === 'polygon' && polygonPoints.length < 3 && !selectedPreset)
              }
            >
              {addGeofence.isPending ? 'Opretter...' : 'Opret geofence'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};