import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FoundLead {
  company_name: string;
  industry: string;
  city?: string;
  email?: string;
  phone?: string;
  website?: string;
  cvr_number?: string;
  reason: string;
  score: number;
  source: string;
}

interface SearchResult {
  company: string;
  industry: string;
  city: string;
  score: number;
}

async function enrichLeadWithContactInfo(companyName: string, industry: string): Promise<{ email?: string; phone?: string; website?: string; cvr?: string }> {
  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) return {};

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
            content: `Du er en forsker der finder kontaktinformation om danske virksomheder.
            
Du skal finde eller estimere:
- Email adresse (især info@, contact@, eller sales@)
- Telefonnummer (hvis kendt)
- Website URL
- CVR nummer (hvis dansk virksomhed)

Returner JSON objekt med de felter du kan identificere. Hvis du ikke er sikker, udelad feltet.
Var præcis og realistisk - hvis du ikke ved det, sig det ikke.`
          },
          {
            role: 'user',
            content: `Find kontaktinfo for: ${companyName}, industri: ${industry}`
          }
        ],
        max_tokens: 500,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Failed to parse contact info:', e);
      }
    }
  } catch (error) {
    console.error('Error enriching lead:', error);
  }
  return {};
}

async function calculateLeadScore(lead: SearchResult, enrichedData: any): Promise<number> {
  let score = 5; // Base score
  
  // Industry scoring
  const highValueIndustries = ['biludlejning', 'bilforhandler', 'autoværksted', 'billeasing', 'bilsalg'];
  const mediumValueIndustries = ['motorcykeludlejning', 'campingvognsudlejning', 'turistselskab', 'hotelkæde', 'eventudlejning'];
  
  if (highValueIndustries.some(i => lead.industry?.toLowerCase().includes(i))) {
    score += 3;
  } else if (mediumValueIndustries.some(i => lead.industry?.toLowerCase().includes(i))) {
    score += 2;
  }
  
  // Location scoring (Copenhagen metro area has more potential)
  const copenhagenAreas = ['København', 'Frederiksberg', 'Glostrup', 'Hvidovre', 'Rødovre', 'Lyngby', 'Bagsværd'];
  if (copenhagenAreas.some(a => lead.city?.includes(a))) {
    score += 2;
  }
  
  // Contact info scoring
  if (enrichedData.email) score += 2;
  if (enrichedData.phone) score += 1;
  if (enrichedData.website) score += 1;
  if (enrichedData.cvr) score += 1;
  
  return Math.min(10, score);
}

async function generateLeadSuggestions(mode: string): Promise<SearchResult[]> {
  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) return [];

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
            content: `Du er en B2B sales eksperte for LEJIO, en dansk biludlejningsplatform.

Din opgave er at generere en liste over danske virksomheder der ville have nytte af biludlejning.

Vigtige brancher:
1. Biludlejningsfirmaer (expansion targets)
2. Bilforhandlere (lånebilsbehov)
3. Autoværksteder (lånebiler)
4. Leasingselskaber
5. Motorcykelforhandlere
6. Campingvognsudlejere
7. Turoperatører
8. Hoteller/hotelkæder
9. Event/conference firmaer
10. Flyvepladser

For hver virksomhed, generer:
- company: Konkret virksomhedsnavn (DANISH virksomheder)
- industry: Branche
- city: By i Danmark
- score: 1-10 potentialrescore

Returner JSON array med 20 forslag.`
          },
          {
            role: 'user',
            content: `Generer 20 danske virksomheder der ville være gode leads for biludlejning. Fokuser på virksomheder som ville have KONKRET nytte af platformen. Vær specifik med navne.`
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
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Failed to parse suggestions:', e);
      }
    }
  } catch (error) {
    console.error('Error generating suggestions:', error);
  }
  
  return [];
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🤖 Starting automated lead finding...');

    // Generate 20 lead suggestions using AI
    const suggestions = await generateLeadSuggestions('auto');
    console.log(`Found ${suggestions.length} lead suggestions`);

    if (suggestions.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No suggestions generated', success: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process each lead: enrich with contact info, score, and add to database
    const addedLeads: FoundLead[] = [];
    
    for (const suggestion of suggestions.slice(0, 20)) {
      try {
        // Enrich lead with contact information
        const enrichedData = await enrichLeadWithContactInfo(suggestion.company, suggestion.industry);
        
        // Calculate comprehensive score
        const finalScore = await calculateLeadScore(suggestion, enrichedData);
        
        // Check if lead already exists
        const { data: existingLead } = await supabase
          .from('sales_leads')
          .select('id')
          .eq('company_name', suggestion.company)
          .single();
        
        if (existingLead) {
          console.log(`Lead ${suggestion.company} already exists, skipping...`);
          continue;
        }
        
        // Add lead to database
        const { data: newLead, error: insertError } = await supabase
          .from('sales_leads')
          .insert({
            company_name: suggestion.company,
            industry: suggestion.industry,
            city: suggestion.city,
            contact_email: enrichedData.email,
            contact_phone: enrichedData.phone,
            website: enrichedData.website,
            cvr_number: enrichedData.cvr,
            status: 'new',
            lead_score: finalScore,
            source: 'ai_automated_discovery',
            notes: `Auto-discovered: ${suggestion.score}/10 initial score. Contact info: ${Object.keys(enrichedData).filter(k => enrichedData[k]).join(', ')}`,
          })
          .select()
          .single();
        
        if (insertError) {
          console.error(`Error adding lead ${suggestion.company}:`, insertError);
          continue;
        }
        
        console.log(`✅ Added lead: ${suggestion.company} (score: ${finalScore})`);
        
        // Send welcome email if contact email is available
        if (enrichedData.email && newLead?.id) {
          try {
            await supabase.functions.invoke('send-lead-welcome-email', {
              body: { leadId: newLead.id }
            });
            console.log(`📧 Welcome email sent to ${enrichedData.email}`);
          } catch (emailError) {
            console.error(`Error sending welcome email:`, emailError);
          }
        }
        
        addedLeads.push({
          company_name: suggestion.company,
          industry: suggestion.industry,
          city: suggestion.city,
          email: enrichedData.email,
          phone: enrichedData.phone,
          website: enrichedData.website,
          cvr_number: enrichedData.cvr,
          reason: `Relevant for ${suggestion.industry}`,
          score: finalScore,
          source: 'ai_automated_discovery',
        });
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (leadError) {
        console.error(`Error processing lead:`, leadError);
        continue;
      }
    }
    
    console.log(`📊 Added ${addedLeads.length} new leads today`);
    
    // Send summary notification to admin
    if (addedLeads.length > 0) {
      try {
        await supabase.functions.invoke('send-admin-email', {
          body: {
            subject: `🎯 ${addedLeads.length} nye leads opdaget og tilføjet`,
            message: `
              <h2>Automatisk Lead Discovery - Daglig Rapport</h2>
              <p>Der blev fundet og tilføjet <strong>${addedLeads.length} nye leads</strong> i dag.</p>
              
              <h3>Tilføjede leads:</h3>
              <ul>
                ${addedLeads.map(l => `
                  <li>
                    <strong>${l.company_name}</strong> (${l.industry}) - Score: ${l.score}/10
                    ${l.email ? `<br/>Email: ${l.email}` : ''}
                    ${l.phone ? `<br/>Telefon: ${l.phone}` : ''}
                  </li>
                `).join('')}
              </ul>
              
              <p><strong>Gennemsnitlig score:</strong> ${(addedLeads.reduce((sum, l) => sum + l.score, 0) / addedLeads.length).toFixed(1)}/10</p>
            `
          }
        });
      } catch (emailError) {
        console.error('Error sending admin notification:', emailError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        added: addedLeads.length,
        leads: addedLeads,
        message: `Successfully added ${addedLeads.length} new leads`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Auto lead finder error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to find leads' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
