import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
};

interface GpsDataPoint {
  device_id: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  altitude?: number;
  odometer?: number;
  ignition_on?: boolean;
  fuel_level?: number;
  battery_level?: number;
  recorded_at?: string;
  raw_data?: Record<string, unknown>;
}

interface Geofence {
  id: string;
  vehicle_id: string;
  name: string;
  center_latitude: number;
  center_longitude: number;
  radius_meters: number;
  is_active: boolean;
  alert_on_exit: boolean;
  alert_on_enter: boolean;
}

// Haversine formula to calculate distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Check if point is inside geofence
const isInsideGeofence = (lat: number, lon: number, geofence: Geofence): boolean => {
  const distance = calculateDistance(lat, lon, geofence.center_latitude, geofence.center_longitude);
  return distance <= geofence.radius_meters;
};

// Provider-specific data parsers
const parseProviderData = (provider: string, data: Record<string, unknown>): GpsDataPoint | null => {
  try {
    switch (provider) {
      case 'teltonika':
        return parseTeltonika(data);
      case 'ruptela':
        return parseRuptela(data);
      case 'autopi':
        return parseAutoPi(data);
      default:
        return parseGeneric(data);
    }
  } catch (error) {
    console.error(`Error parsing ${provider} data:`, error);
    return null;
  }
};

// Teltonika parser
const parseTeltonika = (data: Record<string, unknown>): GpsDataPoint => {
  return {
    device_id: String(data.imei || data.device_id || data.id),
    latitude: Number(data.latitude || data.lat),
    longitude: Number(data.longitude || data.lng || data.lon),
    speed: data.speed ? Number(data.speed) : undefined,
    heading: data.heading || data.angle ? Number(data.heading || data.angle) : undefined,
    altitude: data.altitude ? Number(data.altitude) : undefined,
    odometer: data.odometer || data.total_odometer ? Number(data.odometer || data.total_odometer) : undefined,
    ignition_on: data.ignition !== undefined ? Boolean(data.ignition) : undefined,
    fuel_level: data.fuel_level ? Number(data.fuel_level) : undefined,
    battery_level: data.battery || data.external_voltage ? Number(data.battery || data.external_voltage) : undefined,
    recorded_at: data.timestamp ? String(data.timestamp) : undefined,
    raw_data: data,
  };
};

// Ruptela parser
const parseRuptela = (data: Record<string, unknown>): GpsDataPoint => {
  const gps = data.gps as Record<string, unknown> | undefined;
  return {
    device_id: String(data.imei || data.deviceId || data.id),
    latitude: Number(data.latitude || data.lat || gps?.lat),
    longitude: Number(data.longitude || data.lng || data.lon || gps?.lng),
    speed: data.speed ? Number(data.speed) : undefined,
    heading: data.direction || data.heading ? Number(data.direction || data.heading) : undefined,
    altitude: data.altitude ? Number(data.altitude) : undefined,
    odometer: data.odometer || data.mileage ? Number(data.odometer || data.mileage) : undefined,
    ignition_on: data.ignition !== undefined ? Boolean(data.ignition) : undefined,
    fuel_level: data.fuel ? Number(data.fuel) : undefined,
    battery_level: data.battery ? Number(data.battery) : undefined,
    recorded_at: data.datetime || data.timestamp ? String(data.datetime || data.timestamp) : undefined,
    raw_data: data,
  };
};

// AutoPi parser
const parseAutoPi = (data: Record<string, unknown>): GpsDataPoint => {
  const position = data.position as Record<string, unknown> | undefined;
  const battery = data.battery as Record<string, unknown> | undefined;
  return {
    device_id: String(data.unit_id || data.device_id || data.id),
    latitude: Number(position?.lat || data.latitude || data.lat),
    longitude: Number(position?.lon || data.longitude || data.lng),
    speed: data.speed ? Number(data.speed) : undefined,
    heading: data.heading || data.track ? Number(data.heading || data.track) : undefined,
    altitude: position?.alt || data.altitude ? Number(position?.alt || data.altitude) : undefined,
    odometer: data.odometer ? Number(data.odometer) : undefined,
    ignition_on: data.engine !== undefined ? Boolean(data.engine) : undefined,
    fuel_level: data.fuel_level ? Number(data.fuel_level) : undefined,
    battery_level: battery?.level ? Number(battery.level) : undefined,
    recorded_at: data.utc || data.timestamp ? String(data.utc || data.timestamp) : undefined,
    raw_data: data,
  };
};

// Generic parser
const parseGeneric = (data: Record<string, unknown>): GpsDataPoint => {
  return {
    device_id: String(data.device_id || data.deviceId || data.imei || data.id || data.tracker_id),
    latitude: Number(data.latitude || data.lat),
    longitude: Number(data.longitude || data.lng || data.lon),
    speed: data.speed ? Number(data.speed) : undefined,
    heading: data.heading || data.bearing || data.direction ? Number(data.heading || data.bearing || data.direction) : undefined,
    altitude: data.altitude || data.alt ? Number(data.altitude || data.alt) : undefined,
    odometer: data.odometer || data.mileage || data.total_distance ? Number(data.odometer || data.mileage || data.total_distance) : undefined,
    ignition_on: data.ignition !== undefined ? Boolean(data.ignition) : (data.engine !== undefined ? Boolean(data.engine) : undefined),
    fuel_level: data.fuel_level || data.fuel ? Number(data.fuel_level || data.fuel) : undefined,
    battery_level: data.battery_level || data.battery ? Number(data.battery_level || data.battery) : undefined,
    recorded_at: data.recorded_at || data.timestamp || data.datetime ? String(data.recorded_at || data.timestamp || data.datetime) : undefined,
    raw_data: data,
  };
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get provider from query params or header
    const url = new URL(req.url);
    const provider = url.searchParams.get('provider') || req.headers.get('x-gps-provider') || 'generic';
    
    console.log(`Received GPS webhook from provider: ${provider}`);

    // Parse request body
    const body = await req.json();
    console.log('Raw webhook data:', JSON.stringify(body).substring(0, 500));

    // Handle both single data point and array of data points
    const dataPoints = Array.isArray(body) ? body : (body.data ? (Array.isArray(body.data) ? body.data : [body.data]) : [body]);

    const results = [];
    const errors = [];

    for (const rawData of dataPoints) {
      const parsed = parseProviderData(provider, rawData);
      
      if (!parsed || !parsed.device_id || !parsed.latitude || !parsed.longitude) {
        errors.push({ error: 'Invalid data format', raw: rawData });
        continue;
      }

      // Look up device in database
      const { data: device, error: deviceError } = await supabase
        .from('gps_devices')
        .select('id, vehicle_id, is_active')
        .eq('device_id', parsed.device_id)
        .single();

      if (deviceError || !device) {
        console.log(`Unknown device: ${parsed.device_id}`);
        errors.push({ error: 'Unknown device', device_id: parsed.device_id });
        continue;
      }

      if (!device.is_active) {
        console.log(`Inactive device: ${parsed.device_id}`);
        errors.push({ error: 'Device is inactive', device_id: parsed.device_id });
        continue;
      }

      // Insert GPS data point
      const { data: insertedPoint, error: insertError } = await supabase
        .from('gps_data_points')
        .insert({
          device_id: device.id,
          latitude: parsed.latitude,
          longitude: parsed.longitude,
          speed: parsed.speed,
          heading: parsed.heading,
          altitude: parsed.altitude,
          odometer: parsed.odometer,
          ignition_on: parsed.ignition_on,
          fuel_level: parsed.fuel_level,
          battery_level: parsed.battery_level,
          raw_data: parsed.raw_data,
          recorded_at: parsed.recorded_at ? new Date(parsed.recorded_at).toISOString() : new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting GPS data:', insertError);
        errors.push({ error: insertError.message, device_id: parsed.device_id });
        continue;
      }

      // Update device last_seen_at
      await supabase
        .from('gps_devices')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', device.id);

      // Update vehicle coordinates
      await supabase
        .from('vehicles')
        .update({ 
          latitude: parsed.latitude, 
          longitude: parsed.longitude 
        })
        .eq('id', device.vehicle_id);

      // Check geofences for this vehicle
      const { data: geofences } = await supabase
        .from('geofences')
        .select('*')
        .eq('vehicle_id', device.vehicle_id)
        .eq('is_active', true);

      if (geofences && geofences.length > 0) {
        // Get the previous GPS point to determine if we crossed a boundary
        const { data: prevPoints } = await supabase
          .from('gps_data_points')
          .select('latitude, longitude')
          .eq('device_id', device.id)
          .neq('id', insertedPoint.id)
          .order('recorded_at', { ascending: false })
          .limit(1);

        const prevPoint = prevPoints?.[0];

        for (const geofence of geofences as Geofence[]) {
          const isCurrentlyInside = isInsideGeofence(parsed.latitude, parsed.longitude, geofence);
          const wasInside = prevPoint ? isInsideGeofence(prevPoint.latitude, prevPoint.longitude, geofence) : isCurrentlyInside;

          // Check for exit
          if (geofence.alert_on_exit && wasInside && !isCurrentlyInside) {
            console.log(`Vehicle exited geofence: ${geofence.name}`);
            await supabase.from('geofence_alerts').insert({
              geofence_id: geofence.id,
              device_id: device.id,
              alert_type: 'exit',
              latitude: parsed.latitude,
              longitude: parsed.longitude,
            });
          }

          // Check for enter
          if (geofence.alert_on_enter && !wasInside && isCurrentlyInside) {
            console.log(`Vehicle entered geofence: ${geofence.name}`);
            await supabase.from('geofence_alerts').insert({
              geofence_id: geofence.id,
              device_id: device.id,
              alert_type: 'enter',
              latitude: parsed.latitude,
              longitude: parsed.longitude,
            });
          }
        }
      }

      results.push({
        device_id: parsed.device_id,
        point_id: insertedPoint.id,
        recorded_at: insertedPoint.recorded_at,
      });
    }

    console.log(`Processed ${results.length} data points, ${errors.length} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: results.length,
        errors: errors.length,
        results,
        ...(errors.length > 0 && { errors })
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('GPS webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
