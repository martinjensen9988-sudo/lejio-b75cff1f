import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing chat request with", messages.length, "messages");

    const systemPrompt = `Du er LEJIO's hjælpsomme AI-assistent. LEJIO er en dansk platform for biludlejning, der forbinder private og professionelle udlejere med lejere.

Vigtige informationer om LEJIO:
- LEJIO er "Hotels.com for biludlejning" i Danmark
- Platformen håndterer booking, kontrakter, og betalinger
- Private udlejere betaler 49 kr pr. booking
- Professionelle udlejere (CVR) betaler abonnement: 299 kr/måned for 1-5 biler, 499 kr/måned for 6-15 biler, 799 kr/måned for 16+ biler
- Fleet Basic: 15% kommission, LEJIO håndterer platform og kundeservice
- Fleet Premium: 10% kommission, LEJIO håndterer alt inkl. afhentning og rengøring
- 14 dages gratis prøveperiode for professionelle

Du kan besvare spørgsmål om:
- Priser og abonnementer
- Hvordan platformen fungerer
- Registrering som udlejer
- Booking-processen
- Kontrakter og forsikring
- Generelle spørgsmål om biludlejning

Hvis du ikke kan besvare et spørgsmål, eller brugeren specifikt beder om at tale med kundeservice, så svar med præcis denne tekst på en ny linje: "[NEEDS_HUMAN_SUPPORT]"

Vær venlig, professionel og hjælpsom. Hold svarene korte og præcise.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "For mange forespørgsler. Prøv igen om lidt." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI-tjenesten er midlertidigt utilgængelig." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI-fejl. Prøv igen." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error: unknown) {
    console.error("Chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Ukendt fejl";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
