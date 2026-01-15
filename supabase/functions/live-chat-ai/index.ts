import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting (per IP, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // requests per window
const RATE_WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

// Input validation constants
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

function validateMessages(messages: unknown): { valid: boolean; error?: string } {
  if (!Array.isArray(messages)) {
    return { valid: false, error: "Messages must be an array" };
  }
  
  if (messages.length === 0) {
    return { valid: false, error: "At least one message is required" };
  }
  
  if (messages.length > MAX_MESSAGES) {
    return { valid: false, error: `Maximum ${MAX_MESSAGES} messages allowed` };
  }
  
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (!msg || typeof msg !== 'object') {
      return { valid: false, error: `Invalid message at index ${i}` };
    }
    
    if (typeof msg.content !== 'string') {
      return { valid: false, error: `Message content must be a string at index ${i}` };
    }
    
    if (msg.content.length > MAX_MESSAGE_LENGTH) {
      return { valid: false, error: `Message at index ${i} exceeds ${MAX_MESSAGE_LENGTH} characters` };
    }
    
    if (typeof msg.role !== 'string' || !['user', 'assistant'].includes(msg.role)) {
      return { valid: false, error: `Invalid role at index ${i}. Must be 'user' or 'assistant'` };
    }
  }
  
  return { valid: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting by IP
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(JSON.stringify({ error: "For mange forespørgsler. Vent venligst et øjeblik." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { messages } = body;
    
    // Validate input messages
    const validation = validateMessages(messages);
    if (!validation.valid) {
      console.log(`Invalid input: ${validation.error}`);
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing chat request with", messages.length, "messages");

    const systemPrompt = `Du er LEJIO's hjælpsomme AI-assistent. LEJIO er en dansk platform for køretøjsudlejning, der forbinder private udlejere og forhandlere med lejere.

Vigtige informationer om LEJIO:
- LEJIO er "Hotels.com for køretøjsudlejning" i Danmark
- Platformen håndterer booking, kontrakter, og betalinger
- Private udlejere betaler 49 kr pr. booking
- Forhandlere (CVR) betaler abonnement: 299 kr/måned for 1-5 køretøjer, 499 kr/måned for 6-15 køretøjer, 799 kr/måned for 16+ køretøjer
- Fleet Basic: 15% kommission, LEJIO håndterer platform og kundeservice
- Fleet Premium: 10% kommission, LEJIO håndterer alt inkl. afhentning og rengøring
- 14 dages gratis prøveperiode for forhandlere

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
