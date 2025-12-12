import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CVRData {
  cvr: string;
  companyName: string;
  address?: string;
  city?: string;
  postalCode?: string;
  status?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cvr } = await req.json();

    if (!cvr || typeof cvr !== 'string') {
      console.error('Invalid CVR number provided');
      return new Response(
        JSON.stringify({ error: 'CVR-nummer er påkrævet' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean CVR number - only digits, 8 characters
    const cleanCvr = cvr.replace(/\D/g, '');
    
    if (cleanCvr.length !== 8) {
      console.error('Invalid CVR length:', cleanCvr.length);
      return new Response(
        JSON.stringify({ error: 'CVR-nummer skal være 8 cifre' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Looking up CVR:', cleanCvr);

    // Use the Danish CVR API (cvrapi.dk - free for basic lookups)
    const apiUrl = `https://cvrapi.dk/api?search=${cleanCvr}&country=dk`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'LEJIO - Biludlejning Platform',
      },
    });

    if (!response.ok) {
      console.error('CVR API error:', response.status, await response.text());
      
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ error: 'CVR-nummer ikke fundet' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Kunne ikke slå CVR op' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('CVR API response:', JSON.stringify(data));

    // Map the response to our format
    const cvrData: CVRData = {
      cvr: cleanCvr,
      companyName: data.name || '',
      address: data.address || '',
      city: data.city || '',
      postalCode: data.zipcode?.toString() || '',
      status: data.companydesc || '',
    };

    console.log('Returning CVR data:', JSON.stringify(cvrData));

    return new Response(
      JSON.stringify(cvrData),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('CVR lookup error:', error);
    return new Response(
      JSON.stringify({ error: 'Der opstod en fejl ved CVR-opslag' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
