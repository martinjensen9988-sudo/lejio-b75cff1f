import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadData {
  company_name: string;
  contact_name?: string;
  industry?: string;
  city?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lead, emailType } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const leadData = lead as LeadData;
    
    let prompt = '';
    
    switch (emailType) {
      case 'introduction':
        prompt = `Skriv en professionel introduktions-email på dansk til ${leadData.company_name}${leadData.contact_name ? ` (kontaktperson: ${leadData.contact_name})` : ''}.
        
Virksomheden er${leadData.industry ? ` i branchen: ${leadData.industry}` : ' en dansk virksomhed'}${leadData.city ? ` fra ${leadData.city}` : ''}.

Emailen skal:
- Præsentere LEJIO som en moderne platform til biludlejning
- Fremhæve fordele som: nem online booking, digitale lejekontrakter med signatur direkte i systemet (IKKE NemID/MitID), GPS-sporing, automatisk fakturering
- Være venlig og professionel
- Ikke være for lang (max 150 ord)
- Inkludere en opfordring til at høre mere

VIGTIGT: LEJIO bruger IKKE NemID eller MitID. Vi har vores eget digitale signatur-system hvor begge parter signerer kontrakten direkte i platformen.

Returner kun email-teksten uden emne eller hilsner.`;
        break;
        
      case 'followup':
        prompt = `Skriv en opfølgende email på dansk til ${leadData.company_name}${leadData.contact_name ? ` (kontaktperson: ${leadData.contact_name})` : ''}.

Emailen skal:
- Minde dem om vores tidligere henvendelse
- Tilbyde et kort møde eller demo
- Være kort og venlig (max 100 ord)
- Nævne at LEJIO kan hjælpe med at effektivisere deres biludlejning

Returner kun email-teksten.`;
        break;
        
      case 'offer':
        prompt = `Skriv en email med et særligt tilbud på dansk til ${leadData.company_name}.

Emailen skal:
- Tilbyde en gratis prøveperiode på 30 dage
- Fremhæve at der ingen binding er
- Nævne at de kan starte med få biler og skalere op
- Være overbevisende men ikke pushy (max 120 ord)

Returner kun email-teksten.`;
        break;
        
      default:
        prompt = `Skriv en professionel salgs-email på dansk til ${leadData.company_name}. Hold det kort og venligt. BEMÆRK: LEJIO bruger IKKE NemID/MitID - vi har vores eget digitale signatur-system.`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `Du er en professionel salgs-specialist for LEJIO, en dansk biludlejningsplatform. Du skriver korte, professionelle og venlige emails på dansk. Brug aldrig emojis eller overdreven entusiasme.

VIGTIGT: 
- LEJIO bruger IKKE NemID eller MitID til kontrakter. Vi har vores eget digitale signatur-system, hvor begge parter (udlejer og lejer) signerer kontrakten direkte i platformen med en signatur-pad. Nævn aldrig NemID eller MitID i dine emails.
- Alle emails skal ALTID afsluttes med "Med venlig hilsen\n\nRasmus\nLEJIO"`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'For mange forespørgsler. Prøv igen om lidt.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Betalingskrævet. Kontakt support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const emailContent = data.choices?.[0]?.message?.content || '';
    
    // Generate subject based on email type
    let subject = '';
    switch (emailType) {
      case 'introduction':
        subject = `LEJIO - Moderne biludlejning til ${leadData.company_name}`;
        break;
      case 'followup':
        subject = `Opfølgning: LEJIO biludlejningsplatform`;
        break;
      case 'offer':
        subject = `Særligt tilbud: 30 dages gratis prøveperiode`;
        break;
      default:
        subject = `LEJIO - Effektiv biludlejning`;
    }

    return new Response(
      JSON.stringify({ 
        subject,
        body: emailContent.trim()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating sales email:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Kunne ikke generere email' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});