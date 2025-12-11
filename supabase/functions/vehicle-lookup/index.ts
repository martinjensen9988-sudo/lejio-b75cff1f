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

    // Call Kameli API
    const response = await fetch(
      `https://www.nummerpladeapi.dk/api/v2/vehicle/${cleanedRegistration}`,
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
      console.error(`Kameli API error: ${response.status} - ${errorText}`);
      
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

    const data = await response.json();
    console.log('Vehicle data received:', JSON.stringify(data));

    // Map Kameli API response to our format
    const vehicleData: VehicleData = {
      registration: cleanedRegistration,
      make: data.make || data.brand || '',
      model: data.model || '',
      variant: data.variant || data.version || '',
      year: data.model_year || data.first_registration_date?.substring(0, 4) || 0,
      fuel_type: data.fuel_type || data.propellant || '',
      color: data.color || '',
      vin: data.vin || '',
      vehicle_id: data.vehicle_id || data.id || '',
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
