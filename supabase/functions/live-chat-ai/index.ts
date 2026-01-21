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

// Sanitize message content to prevent prompt injection attempts
function sanitizeMessageContent(content: string): string {
  // Remove potential system prompt injection patterns
  let sanitized = content
    // Remove attempts to override system instructions
    .replace(/\[SYSTEM\]/gi, '[filtered]')
    .replace(/\[ADMIN\]/gi, '[filtered]')
    .replace(/\[OVERRIDE\]/gi, '[filtered]')
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Limit consecutive whitespace
    .replace(/\s{10,}/g, '          ');
  
  return sanitized.trim();
}

interface SanitizedMessage {
  role: 'user' | 'assistant';
  content: string;
}

function validateMessages(messages: unknown): { valid: boolean; error?: string; sanitized?: SanitizedMessage[] } {
  if (!Array.isArray(messages)) {
    return { valid: false, error: "Messages must be an array" };
  }
  
  if (messages.length === 0) {
    return { valid: false, error: "At least one message is required" };
  }
  
  if (messages.length > MAX_MESSAGES) {
    return { valid: false, error: `Maximum ${MAX_MESSAGES} messages allowed` };
  }
  
  const sanitized: SanitizedMessage[] = [];
  
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
    
    // Sanitize content before adding
    sanitized.push({
      role: msg.role as 'user' | 'assistant',
      content: sanitizeMessageContent(msg.content)
    });
  }
  
  return { valid: true, sanitized };
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
    
    // Validate and sanitize input messages
    const validation = validateMessages(messages);
    if (!validation.valid) {
      console.log(`Invalid input: ${validation.error}`);
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Use sanitized messages
    const sanitizedMessages = validation.sanitized!;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing chat request with", sanitizedMessages.length, "messages");

    const systemPrompt = `Du er LEJIO's hjælpsomme AI-assistent. LEJIO er Danmarks førende platform for køretøjsudlejning, der forbinder private udlejere og professionelle forhandlere med lejere.

## LEJIO PLATFORMOVERSIGT
LEJIO er "Hotels.com for køretøjsudlejning" - en komplet digital løsning til biludlejning med AI-drevet teknologi.

## KØRETØJSTYPER
Vi understøtter udlejning af:
- Biler (personbiler, varevogne, SUV'er)
- Motorcykler og scootere (med kørekortsvalidering for MC-kategorier A1, A2, A)
- Trailere (med dimensioner, vægt, trækkoblingstype)
- Campingvogne/caravans (med sovepladser, køkken, bad, udstyr)

## PRISER OG ABONNEMENTER

### Private udlejere (uden CVR)
- 59 kr pr. booking

### Pro/Professionelle udlejere (med CVR)
- Starter: 349 kr/måned (1-5 køretøjer)
- Standard: 599 kr/måned (6-15 køretøjer)
- Enterprise: 899 kr/måned (16+ køretøjer)
- 25 kr pr. booking for alle Pro-kunder
- 14 dages gratis prøveperiode

### LEJIO Fleet (vi styrer din flåde)
- Fleet Basic: 15% kommission - LEJIO håndterer platform, booking og kundeservice
- Fleet Premium: 10% kommission - LEJIO håndterer ALT inkl. afhentning, aflevering og rengøring

## BETALINGSMULIGHEDER
Udlejere kan acceptere:
- Kortbetaling
- MobilePay
- Bankoverførsel
- Kontant

Lejere kan vælge mellem:
- Forudbetaling (hele beløbet på én gang)
- Månedligt abonnement (løbende trækning) - kun ved leje på min. 1 måned

## PRISFLEKSIBILITET
Udlejere kan sætte individuelle priser for:
- Dagspris
- Ugepris
- Månedspris
- Ubegrænset kilometer eller km-inkluderet + tillæg pr. ekstra km

## DIGITALE KONTRAKTER
- Juridisk bindende digitale kontrakter
- Digital underskrift fra både lejer og udlejer
- Automatisk PDF-generering og e-mail
- Skadesregistrering med før/efter billeder
- Vanvidskørsel-ansvarserklæring

## AI-FUNKTIONER
- Vision AI til automatisk aflæsning af km-stand og brændstofniveau fra dashboard-billeder
- AI prisforslag baseret på markedsdata
- AI-drevet skadesanalyse fra billeder
- AI-drevet førerkortverificering
- Live AI-chat support (det er mig!)

## GPS TRACKING
- Realtids GPS-sporing af køretøjer
- Geofence-advarsler (alarm ved kørsel udenfor område)
- Historisk rutevisning
- Webhook-integration

## BOOKINGFLOW
1. Lejer finder køretøj og vælger periode (dag/uge/måned)
2. Udfylder personlige oplysninger
3. Vælger betalingsmetode og evt. abonnement
4. Udlejer modtager notifikation
5. Digital kontrakt sendes til underskrift
6. Check-in med billeddokumentation
7. Check-out med km-aflæsning og skadesgennemgang

## FOR LEJERE
- Profilside med alle lejeaftaler under "Mine lejeaftaler"
- Aktive bookinger og historik
- Alle kontrakter og fakturaer samlet under "Dokumenter"
- Download af PDF-kontrakter
- Rutevejledning til afhentningssted
- Mulighed for genbooking af tidligere lejede køretøjer

## FOR UDLEJERE
- Komplet dashboard med statistik og analytics
- Bookingkalender med overblik
- Køretøjsadministration med flere lokationer
- Kundesegmentering (VIP, gentagende kunder)
- Automatiske servicepåmindelser
- Bøde-tracking og videresendelse
- Fakturagenerering
- Dækstyring

## SIKKERHED
- Førerkortsverificering med AI
- Depositumhåndtering
- Selvrisikoforsikring tilbydes
- Skadesrapporter med fotodokumentation

## KONTAKT
Ved komplekse spørgsmål kan du kontakte:
- Rasmus Damsgaard, Medstifter & Partner
- E-mail: rasmus@lejio.dk
- Telefon: Kontakt via platformen

## INSTRUKTIONER
- Svar altid på dansk
- Vær venlig, professionel og hjælpsom
- Hold svarene korte og præcise
- Hvis du ikke kan besvare et spørgsmål, eller brugeren specifikt beder om at tale med kundeservice, så svar med præcis denne tekst på en ny linje: "[NEEDS_HUMAN_SUPPORT]"
- VIGTIGT: Nævn ALDRIG NemID eller MitID - LEJIO bruger sin egen digitale signatur`;


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
          ...sanitizedMessages,
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
