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
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  cvr?: string;
  enriched?: boolean;
  email_sent?: boolean;
  email_status?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      mode, 
      existingLeads, 
      targetIndustries,
      autoEnrich = true,
      sendEmails = false,
      batchSize = 20,
      includeScoring = true
    } = await req.json();
    
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
- Inkluder også specifik CVR-søgning hvor muligt

Returner et JSON array med objekter der har:
- company_type: Type af virksomhed at søge efter
- industry: Branche
- city: By/område at fokusere på (eller "Hele Danmark")
- reason: Hvorfor dette er en god lead-type
- score: Score fra 1-10
- search_query: Konkret søgeforespørgsel til CVR eller web
- industry_segment: Specifik markedssegment`
            },
            {
              role: 'user',
              content: `Her er vores eksisterende leads:\n${JSON.stringify(leadSummary, null, 2)}\n\nForeslå 8-12 nye lead-typer vi bør fokusere på baseret på dette mønster. Vær specifik med CVR-søgninger.`
            }
          ],
          max_tokens: 2500,
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
              score: Math.min(10, (s.score || 5) + 1), // Boost smart recommendations
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
- industry_code: CVR industriekode hvor relevant

Fokuser på:
1. Små og mellemstore biludlejningsfirmaer
2. Bilforhandlere der kunne tilbyde lånebiler
3. Værksteder med lånebilsbehov  
4. Leasingselskaber
5. MC-forhandlere med udlejning
6. Campingvognsudlejere
7. Taxiselskaber
8. Transportfirmaer
9. Bilskole (til instruktørkørsel)
10. Carsharing-tjenester

Returner KUN et JSON array, ingen anden tekst.`
            },
            {
              role: 'user',
              content: `Generer ${batchSize} forskellige søgeforslag for at finde nye leads i Danmark. Vær meget specifik med CVR-søgninger og kontaktinformation hints.`
            }
          ],
          max_tokens: 3000,
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
          search_query: 'biludlejning CVR',
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

    // IMPROVEMENT: Automatic enrichment of leads with contact info
    if (autoEnrich && suggestions.length > 0) {
      console.log(`🔍 Starting automatic enrichment of ${suggestions.length} leads...`);
      
      for (let i = 0; i < suggestions.length; i++) {
        try {
          const lead = suggestions[i];
          const enrichmentResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
                  content: `Du er ekspert i at finde kontaktinformation på danske virksomheder.
Din opgave er at finde og foreslå email, telefon, website og CVR for en virksomhed.

Returner ALTID et JSON objekt med denne struktur (også hvis du ikke finder alting):
{
  "email": "forslag@eksempel.dk eller null",
  "phone": "+4512345678 eller null",
  "website": "https://eksempel.dk eller null",
  "cvr": "12345678 eller null",
  "confidence": 0.0-1.0,
  "notes": "Kort note om hvad der blev fundet"
}

Giv realistiske forslag baseret på dansk navngivningstraditioner.
Returner KUN JSON, ingen anden tekst.`
                },
                {
                  role: 'user',
                  content: `Virksomhed: ${lead.company_name}
By: ${lead.city || 'Hele Danmark'}
Industri: ${lead.industry}
Søgning: ${lead.search_query}

Find kontaktinformation for denne virksomhed type. Hvis du ikke kan finde det præcist, giv intelligente forslag baseret på danske virksomhednavn og mønstre.`
                }
              ],
              max_tokens: 500,
            }),
          });

          if (enrichmentResponse.ok) {
            const enrichData = await enrichmentResponse.json();
            const enrichContent = enrichData.choices?.[0]?.message?.content || '';
            
            try {
              const enriched = JSON.parse(enrichContent);
              if (enriched.email) lead.contact_email = enriched.email;
              if (enriched.phone) lead.contact_phone = enriched.phone;
              if (enriched.website) lead.website = enriched.website;
              if (enriched.cvr) lead.cvr = enriched.cvr;
              lead.enriched = true;
              
              console.log(`✅ Enriched ${lead.company_name}: email=${!!lead.contact_email}, phone=${!!lead.contact_phone}, website=${!!lead.website}`);
            } catch (e) {
              console.error(`Failed to parse enrichment for ${lead.company_name}:`, e);
            }
          }
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`Error enriching lead ${i}:`, error);
        }
      }
    }

    // IMPROVEMENT: Intelligent scoring based on multiple factors
    if (includeScoring) {
      suggestions = suggestions.map(lead => ({
        ...lead,
        score: calculateImprovedScore(lead, existingLeads),
      }));
    }

    // Sort by score
    suggestions.sort((a, b) => b.score - a.score);

    // IMPROVEMENT: Save leads to database and optionally send emails
    const savedLeads = [];
    for (const lead of suggestions.slice(0, Math.min(50, suggestions.length))) {
      try {
        // Check if lead already exists
        const { data: existing } = await supabase
          .from('leads')
          .select('id')
          .eq('company_name', lead.company_name)
          .maybeSingle();

        if (!existing) {
          const { data: newLead, error } = await supabase
            .from('leads')
            .insert({
              company_name: lead.company_name,
              industry: lead.industry,
              city: lead.city,
              reason: lead.reason,
              score: lead.score,
              search_query: lead.search_query,
              source: lead.source,
              contact_email: lead.contact_email,
              contact_phone: lead.contact_phone,
              website: lead.website,
              cvr: lead.cvr,
              enriched: lead.enriched,
              status: 'new',
            })
            .select()
            .single();

          if (!error && newLead) {
            savedLeads.push(newLead);
            lead.email_sent = false;

            // IMPROVEMENT: Send welcome email if enabled
            if (sendEmails && lead.contact_email) {
              try {
                const emailResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
                        content: `Du skriver professionelle, kortfattede sales-emails på dansk.
Skriv en personaliseret email til en virksomhed der præsenterer LEJIO-platformen.

Email skal:
- Være kort (max 150 ord)
- Være personlig og relevants for deres industri
- Afslutte med CTA (call to action) til at booke demo
- Signeres af LEJIO sales team`
                      },
                      {
                        role: 'user',
                        content: `Virksomhed: ${lead.company_name}
Industri: ${lead.industry}
By: ${lead.city}
Grund til kontakt: ${lead.reason}`
                      }
                    ],
                    max_tokens: 500,
                  }),
                });

                if (emailResponse.ok) {
                  const emailData = await emailResponse.json();
                  const emailContent = emailData.choices?.[0]?.message?.content || '';
                  
                  // TODO: Send actual email via edge function
                  lead.email_status = 'generated';
                  console.log(`✉️ Generated email for ${lead.company_name}`);
                }
              } catch (error) {
                console.error(`Error generating email for ${lead.company_name}:`, error);
                lead.email_status = 'error';
              }
            }
          } else if (error) {
            console.error(`Error saving lead ${lead.company_name}:`, error);
          }
        } else {
          console.log(`Lead ${lead.company_name} already exists`);
        }
      } catch (error) {
        console.error(`Error processing lead ${lead.company_name}:`, error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        suggestions: suggestions.slice(0, 50),
        savedLeads: savedLeads.length,
        mode,
        total: suggestions.length,
        enriched: suggestions.filter(s => s.enriched).length,
        stats: {
          with_email: suggestions.filter(s => s.contact_email).length,
          with_phone: suggestions.filter(s => s.contact_phone).length,
          with_website: suggestions.filter(s => s.website).length,
          with_cvr: suggestions.filter(s => s.cvr).length,
        }
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

// IMPROVEMENT: Enhanced scoring algorithm
function calculateImprovedScore(lead: LeadSuggestion, existingLeads: any[] = []): number {
  let score = lead.score || 5;

  // Boost if has enriched contact info
  if (lead.enriched) score += 1.5;
  if (lead.contact_email) score += 1;
  if (lead.contact_phone) score += 0.5;
  if (lead.website) score += 0.5;
  if (lead.cvr) score += 0.5;

  // Boost for high-value industries
  const highValueIndustries = ['billeasing', 'bilforhandler', 'autoværksted'];
  if (highValueIndustries.includes(lead.industry?.toLowerCase())) {
    score += 1;
  }

  // Boost for major cities
  const majorCities = ['København', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg'];
  if (majorCities.includes(lead.city)) {
    score += 0.5;
  }

  // Penalty if already in existing leads
  if (existingLeads?.some(l => l.company_name?.toLowerCase() === lead.company_name?.toLowerCase())) {
    score -= 3;
  }

  // Cap at 10
  return Math.min(10, Math.max(1, score));
}
