import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VehicleData {
  registration: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  fuel_type: string;
  color: string;
  vin: string;
  vehicle_id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { registration } = await req.json();
    
    if (!registration) {
      return new Response(
        JSON.stringify({ error: 'Registration number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('KAMELI_API_KEY');
    if (!apiKey) {
      console.error('KAMELI_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean registration number (remove spaces, uppercase)
    const cleanedRegistration = registration.replace(/\s/g, '').toUpperCase();
    console.log(`Looking up vehicle: ${cleanedRegistration}`);

    // Call Kameli/Nummerplade API - correct endpoint is api.nrpla.de
    const response = await fetch(
      `https://api.nrpla.de/${cleanedRegistration}?advanced=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Nummerplade API error: ${response.status} - ${errorText}`);
      
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ error: 'Køretøj ikke fundet', code: 'NOT_FOUND' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: 'Ugyldig API-nøgle', code: 'UNAUTHORIZED' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Kunne ikke hente bildata', code: 'API_ERROR' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const responseData = await response.json();
    console.log('Vehicle data received:', JSON.stringify(responseData));

    // API returns data nested inside a "data" object
    const data = responseData.data || responseData;

    // Map Nummerplade API response to our format
    // API returns: registration, vin, brand, model, version, fuel_type, model_year, color, etc.
    const vehicleData: VehicleData = {
      registration: data.registration || cleanedRegistration,
      make: data.brand || '',
      model: data.model || '',
      variant: data.version || '',
      year: data.model_year || (data.first_registration_date ? parseInt(data.first_registration_date.substring(0, 4)) : 0),
      fuel_type: data.fuel_type || '',
      color: typeof data.color === 'object' ? data.color.name : (data.color || ''),
      vin: data.vin || '',
      vehicle_id: String(data.vehicle_id || data.registration || ''),
    };

    return new Response(
      JSON.stringify({ vehicle: vehicleData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in vehicle-lookup function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
