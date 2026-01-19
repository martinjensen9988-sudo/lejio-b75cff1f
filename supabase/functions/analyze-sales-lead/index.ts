import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadData {
  company_name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  industry?: string;
  city?: string;
  cvr_number?: string;
  website?: string;
  notes?: string;
  address?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lead } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const leadData = lead as LeadData;
    
    const prompt = `Du er en erfaren salgs-coach der hjælper med at forberede opkald til potentielle kunder for LEJIO, en dansk biludlejningsplatform.

Analyser følgende virksomhed og giv konkrete, handlingsorienterede tips til salgssamtalen:

VIRKSOMHEDSDATA:
- Navn: ${leadData.company_name}
- Kontaktperson: ${leadData.contact_name || 'Ikke angivet'}
- Branche: ${leadData.industry || 'Ikke angivet'}
- By: ${leadData.city || 'Ikke angivet'}
- CVR: ${leadData.cvr_number || 'Ikke angivet'}
- Hjemmeside: ${leadData.website || 'Ikke angivet'}
- Adresse: ${leadData.address || 'Ikke angivet'}
- Tidligere noter: ${leadData.notes || 'Ingen'}

Giv dit svar i følgende JSON-format (og KUN JSON, ingen tekst før eller efter):
{
  "companyInsights": [
    "Indsigt 1 om virksomheden baseret på navn, branche, lokation",
    "Indsigt 2...",
    "Indsigt 3..."
  ],
  "keySellingPoints": [
    {
      "point": "Specifikt salgsargument relevant for denne kunde",
      "why": "Hvorfor dette er vigtigt for dem"
    }
  ],
  "conversationStarters": [
    "Åbningssætning 1 der er personlig og relevant",
    "Åbningssætning 2..."
  ],
  "potentialObjections": [
    {
      "objection": "Mulig indvending kunden kan have",
      "response": "Hvordan du kan håndtere den"
    }
  ],
  "questionsToAsk": [
    "Spørgsmål der kan afdække kundens behov",
    "Spørgsmål 2..."
  ],
  "importantHighlights": [
    {
      "highlight": "Vigtigt punkt at huske",
      "priority": "high" | "medium",
      "reason": "Hvorfor dette er vigtigt"
    }
  ],
  "industryContext": "Kort beskrivelse af hvordan biludlejning typisk bruges i denne branche",
  "suggestedApproach": "Anbefalet samtalestrategi for denne specifikke kunde"
}

Vær specifik og konkret. Brug virksomhedens navn og branche til at gøre tipsene relevante. Hvis branche ikke er angivet, gæt baseret på virksomhedsnavnet.

LEJIO's hovedfordele at fremhæve:
- Nem online booking
- Digitalt kontraktsystem (eget signatur-system, IKKE NemID/MitID)
- GPS-sporing af køretøjer
- Automatisk fakturering
- Flådestyring og analytics
- Skalerbart fra få biler til stor flåde`;

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
            content: 'Du er en erfaren B2B salgs-coach med speciale i dansk biludlejningsbranchen. Du giver altid konkrete, handlingsorienterede råd. Svar KUN med valid JSON.'
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
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse the JSON response
    let analysis;
    try {
      // Remove potential markdown code blocks
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      analysis = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // Return a default structure if parsing fails
      analysis = {
        companyInsights: [`${leadData.company_name} er en potentiel kunde i ${leadData.city || 'Danmark'}`],
        keySellingPoints: [{ point: 'Nem og effektiv biludlejning', why: 'Sparer tid og ressourcer' }],
        conversationStarters: [`Hej, jeg ringer fra LEJIO angående biludlejning for ${leadData.company_name}`],
        potentialObjections: [{ objection: 'Vi har allerede en løsning', response: 'Jeg forstår - må jeg spørge hvad I savner ved jeres nuværende løsning?' }],
        questionsToAsk: ['Hvor mange biler har I i jeres flåde?', 'Hvordan håndterer I booking i dag?'],
        importantHighlights: [{ highlight: 'Fokuser på kundens specifikke behov', priority: 'high', reason: 'Personlig tilgang øger succesraten' }],
        industryContext: 'Virksomheder i denne branche kan ofte drage fordel af fleksibel biludlejning.',
        suggestedApproach: 'Start med at lytte til kundens nuværende udfordringer før du præsenterer LEJIO.'
      };
    }

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error analyzing lead:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Kunne ikke analysere lead' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
