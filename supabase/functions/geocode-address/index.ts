import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address, postalCode, city } = await req.json();
    
    if (!address && !postalCode && !city) {
      return new Response(
        JSON.stringify({ error: 'Address information required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const mapboxToken = Deno.env.get('MAPBOX_PUBLIC_TOKEN');
    if (!mapboxToken) {
      console.error('MAPBOX_PUBLIC_TOKEN not configured');
      return new Response(
        JSON.stringify({ error: 'Geocoding service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build full address string for geocoding
    const addressParts = [address, postalCode, city, 'Denmark'].filter(Boolean);
    const fullAddress = addressParts.join(', ');
    const encodedAddress = encodeURIComponent(fullAddress);

    console.log('Geocoding address:', fullAddress);

    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${mapboxToken}&country=DK&limit=1`;
    
    const response = await fetch(geocodeUrl);
    
    if (!response.ok) {
      console.error('Mapbox API error:', response.status, await response.text());
      return new Response(
        JSON.stringify({ error: 'Geocoding request failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      console.log('No geocoding results found for:', fullAddress);
      return new Response(
        JSON.stringify({ error: 'Address not found', latitude: null, longitude: null }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const [longitude, latitude] = data.features[0].center;
    const placeName = data.features[0].place_name;
    
    console.log('Geocoded successfully:', { latitude, longitude, placeName });

    return new Response(
      JSON.stringify({ 
        latitude, 
        longitude, 
        placeName,
        success: true 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in geocode-address function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
