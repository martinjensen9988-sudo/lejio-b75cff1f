import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         req.headers.get('x-real-ip') ||
         req.headers.get('cf-connecting-ip') ||
         'unknown';
}

function checkRateLimit(clientIP: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(clientIP);

  if (record && now > record.resetTime) {
    rateLimitStore.delete(clientIP);
  }

  const currentRecord = rateLimitStore.get(clientIP);

  if (!currentRecord) {
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (currentRecord.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, retryAfter: Math.ceil((currentRecord.resetTime - now) / 1000) };
  }

  currentRecord.count++;
  return { allowed: true };
}

interface DamageItem {
  position: string;
  severity: "minor" | "moderate" | "severe";
  damageType: string;
  description: string;
  confidence: number;
}

// Input validation constants
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB max for base64 image
const MAX_VEHICLE_AREA_LENGTH = 50;
const ALLOWED_VEHICLE_AREAS = [
  'front-left', 'front-center', 'front-right',
  'left-side', 'right-side',
  'rear-left', 'rear-center', 'rear-right',
  'roof', 'interior-front', 'interior-rear', 'trunk'
];

function validateInput(image: unknown, vehicleArea: unknown): { valid: boolean; error?: string } {
  if (!image || typeof image !== 'string') {
    return { valid: false, error: 'Image is required and must be a string' };
  }
  
  // Check image size (base64 encoded)
  if (image.length > MAX_IMAGE_SIZE) {
    return { valid: false, error: 'Image exceeds maximum size limit' };
  }
  
  // Validate image format (should be data URL or valid URL)
  if (!image.startsWith('data:image/') && !image.startsWith('http://') && !image.startsWith('https://')) {
    return { valid: false, error: 'Invalid image format' };
  }
  
  // Validate vehicleArea if provided
  if (vehicleArea !== undefined && vehicleArea !== null) {
    if (typeof vehicleArea !== 'string') {
      return { valid: false, error: 'vehicleArea must be a string' };
    }
    if (vehicleArea.length > MAX_VEHICLE_AREA_LENGTH) {
      return { valid: false, error: 'vehicleArea exceeds maximum length' };
    }
    if (vehicleArea && !ALLOWED_VEHICLE_AREAS.includes(vehicleArea)) {
      return { valid: false, error: 'Invalid vehicleArea value' };
    }
  }
  
  return { valid: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting
  const clientIP = getClientIP(req);
  const rateLimitResult = checkRateLimit(clientIP);
  if (!rateLimitResult.allowed) {
    return new Response(
      JSON.stringify({ error: "For mange forespørgsler. Prøv igen senere." }),
      { 
        status: 429, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Retry-After": String(rateLimitResult.retryAfter || 60)
        } 
      }
    );
  }

  try {
    const body = await req.json();
    const { image, vehicleArea } = body;

    // Validate input
    const validation = validateInput(image, vehicleArea);
    if (!validation.valid) {
      console.log('Input validation failed:', validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Du er en ekspert i bilskader og vurderer køretøjer ved check-in/check-out.

Analysér billedet og identificér ALLE synlige skader, ridser, buler eller defekter.

For hver skade, returner et JSON-array med objekter der har:
- position: område på bilen (vælg fra: front-left, front-center, front-right, left-side, right-side, rear-left, rear-center, rear-right, roof, interior-front, interior-rear, trunk)
- severity: "minor" (små ridser/skrammer), "moderate" (synlige buler/større ridser), "severe" (alvorlige skader/deformationer)
- damageType: type skade (ridse, bule, rust, revne, lakskade, stenslag, deformation, snavs, slitage)
- description: kort dansk beskrivelse (max 20 ord)
- confidence: 0.0-1.0 hvor sikker du er

Hvis INGEN skader er synlige, returner et tomt array [].

VIGTIGT: Vær grundig men ikke overivrig - kun registrer reelle skader, ikke normale slid eller refleksioner.

${vehicleArea ? `Fokuser på dette område: ${vehicleArea}` : ''}

Svar KUN med valid JSON-array, ingen anden tekst.`;

    // Use gemini-2.5-flash which supports vision/multimodal
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
          { 
            role: "user", 
            content: [
              { 
                type: "image_url", 
                image_url: { url: image }
              },
              { 
                type: "text", 
                text: "Analysér dette billede af køretøjet og identificér alle synlige skader." 
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit overskredet, prøv igen senere." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Betalingskrævet for AI-tjenesten." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse JSON from response
    let damages: DamageItem[] = [];
    try {
      // Handle markdown code blocks
      let jsonContent = content.trim();
      const jsonMatch = jsonContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1].trim();
      }
      damages = JSON.parse(jsonContent);
      
      // Validate structure
      if (!Array.isArray(damages)) {
        damages = [];
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      damages = [];
    }

    // Add timestamp and image reference
    const result = {
      damages,
      analyzedAt: new Date().toISOString(),
      totalDamages: damages.length,
      hasSevereDamage: damages.some(d => d.severity === "severe"),
      summary: damages.length === 0 
        ? "Ingen synlige skader fundet" 
        : `Fundet ${damages.length} ${damages.length === 1 ? 'skade' : 'skader'}`
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-vehicle-damage:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
