import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadSuggestion {
  company_name: string;
  industry: string;
  city?: string;
  reason: string;
  score: number;
  search_query: string;
  source: 'ai_recommendation' | 'ai_discovery';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mode, existingLeads, targetIndustries } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Default target industries for car rental platform
    const industries = targetIndustries || [
      'biludlejning',
      'billeasing', 
      'bilforhandler',
      'autoværksted',
      'autoudlejning',
      'lånebiler',
      'bilsalg',
      'motorcykeludlejning'
    ];

    let suggestions: LeadSuggestion[] = [];

    if (mode === 'smart_recommendations' && existingLeads?.length > 0) {
      // Analyze existing leads to find patterns and suggest similar companies
      const leadSummary = existingLeads.slice(0, 20).map((l: any) => ({
        company: l.company_name,
        industry: l.industry,
        city: l.city,
        status: l.status,
      }));

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
              content: `Du er en salgsekspert for LEJIO, en dansk biludlejningsplatform. 
Analyser de eksisterende leads og foreslå nye typer virksomheder at kontakte.

VIGTIGT:
- Fokuser på danske virksomheder inden for: ${industries.join(', ')}
- Foreslå specifikke virksomhedstyper og geografiske områder
- Giv konkrete søgeforslag der kan bruges til at finde nye leads
- Rangér efter potentiale (1-10)

Returner et JSON array med objekter der har:
- company_type: Type af virksomhed at søge efter
- industry: Branche
- city: By/område at fokusere på (eller "Hele Danmark")
- reason: Hvorfor dette er en god lead-type
- score: Score fra 1-10
- search_query: Konkret søgeforespørgsel til CVR eller web`
            },
            {
              role: 'user',
              content: `Her er vores eksisterende leads:\n${JSON.stringify(leadSummary, null, 2)}\n\nForeslå 5-8 nye lead-typer vi bør fokusere på baseret på dette mønster.`
            }
          ],
          max_tokens: 2000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        
        try {
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            suggestions = parsed.map((s: any) => ({
              company_name: s.company_type || s.company_name,
              industry: s.industry,
              city: s.city,
              reason: s.reason,
              score: s.score || 5,
              search_query: s.search_query,
              source: 'ai_recommendation' as const,
            }));
          }
        } catch (e) {
          console.error('Failed to parse AI recommendations:', e);
        }
      }
    } else {
      // Discovery mode - find new leads based on target industries
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
              content: `Du er en salgsekspert for LEJIO, en dansk biludlejningsplatform.
Din opgave er at generere konkrete søgeforslag for at finde potentielle kunder.

Målbrancher: ${industries.join(', ')}

For hver foreslået søgning, angiv:
- search_query: Præcis søgeforespørgsel (CVR branche eller firmanavn)
- industry: Branche
- city: By at fokusere på (vælg store danske byer)
- reason: Hvorfor denne type virksomhed er relevant
- score: Potentiale score 1-10
- company_type: Beskrivelse af virksomhedstypen

Fokuser på:
1. Små og mellemstore biludlejningsfirmaer
2. Bilforhandlere der kunne tilbyde lånebiler
3. Værksteder med lånebilsbehov  
4. Leasingselskaber
5. MC-forhandlere med udlejning
6. Campingvognsudlejere

Returner KUN et JSON array, ingen anden tekst.`
            },
            {
              role: 'user',
              content: 'Generer 8-10 forskellige søgeforslag for at finde nye leads i Danmark.'
            }
          ],
          max_tokens: 2000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        
        try {
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            suggestions = parsed.map((s: any) => ({
              company_name: s.company_type || s.search_query,
              industry: s.industry,
              city: s.city,
              reason: s.reason,
              score: s.score || 5,
              search_query: s.search_query,
              source: 'ai_discovery' as const,
            }));
          }
        } catch (e) {
          console.error('Failed to parse AI discovery:', e);
        }
      }
    }

    // If no suggestions generated, provide defaults
    if (suggestions.length === 0) {
      suggestions = [
        {
          company_name: 'Biludlejningsfirmaer',
          industry: 'Biludlejning',
          city: 'København',
          reason: 'Største marked for biludlejning i Danmark',
          score: 9,
          search_query: 'biludlejning',
          source: 'ai_discovery',
        },
        {
          company_name: 'Bilforhandlere med lånebiler',
          industry: 'Bilforhandler',
          city: 'Aarhus',
          reason: 'Mange bilforhandlere har brug for lånebilsløsninger',
          score: 8,
          search_query: 'bilforhandler',
          source: 'ai_discovery',
        },
        {
          company_name: 'Autoværksteder',
          industry: 'Autoværksted',
          city: 'Odense',
          reason: 'Værksteder tilbyder ofte lånebiler til kunder',
          score: 7,
          search_query: 'autoværksted lånebil',
          source: 'ai_discovery',
        },
        {
          company_name: 'Leasingselskaber',
          industry: 'Billeasing',
          city: 'Hele Danmark',
          reason: 'Leasingselskaber kan bruge platformen til korttidsudlejning',
          score: 8,
          search_query: 'billeasing',
          source: 'ai_discovery',
        },
        {
          company_name: 'MC-forhandlere',
          industry: 'Motorcykeludlejning',
          city: 'København',
          reason: 'LEJIO understøtter også motorcykeludlejning',
          score: 6,
          search_query: 'motorcykel forhandler',
          source: 'ai_discovery',
        },
      ];
    }

    // Sort by score
    suggestions.sort((a, b) => b.score - a.score);

    return new Response(
      JSON.stringify({
        success: true,
        suggestions,
        mode,
        total: suggestions.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI find leads error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to find leads' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
