import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WarningNotificationRequest {
  renterEmail: string;
  renterName: string;
  warningId: string;
  reason: string;
  lessorName: string;
  appealUrl: string;
}

const REASON_LABELS: Record<string, string> = {
  damage: 'Skade på køretøj',
  non_payment: 'Manglende betaling',
  contract_violation: 'Kontraktbrud',
  fraud: 'Svindel',
  reckless_driving: 'Vanvidskørsel',
  late_return: 'Forsinket aflevering',
  cleanliness: 'Manglende rengøring',
  other: 'Anden årsag',
};

// HTML escape function to prevent XSS
function escapeHtml(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate URL is on trusted domain
function isValidAppealUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const trustedDomains = ['lejio.dk', 'www.lejio.dk', 'localhost'];
    return trustedDomains.some(domain => parsed.hostname === domain || parsed.hostname.endsWith('.' + domain));
  } catch {
    return false;
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { renterEmail, renterName, warningId, reason, lessorName, appealUrl }: WarningNotificationRequest = await req.json();
    
    // Validate required fields
    if (!renterEmail || !warningId || !reason) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Validate email format
    if (!isValidEmail(renterEmail)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Validate appeal URL if provided
    if (appealUrl && !isValidAppealUrl(appealUrl)) {
      console.warn("Invalid appeal URL provided:", appealUrl);
      // Don't include the URL in the email if it's invalid
    }

    const reasonLabel = REASON_LABELS[reason] || escapeHtml(reason);
    const safeRenterName = escapeHtml(renterName) || 'Lejer';
    const safeLessorName = escapeHtml(lessorName) || 'En udlejer';
    const safeAppealUrl = appealUrl && isValidAppealUrl(appealUrl) ? appealUrl : null;

    const appealLink = safeAppealUrl 
      ? `<p><a href="${safeAppealUrl}">Indgiv klage her</a></p>`
      : '<p>Kontakt venligst LEJIO support for at indgive en klage.</p>';

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LEJIO <noreply@lejio.dk>",
        to: [renterEmail],
        subject: "Vigtig besked: Der er oprettet en advarsel på din profil",
        html: `<h1>Kære ${safeRenterName}</h1><p>En udlejer (${safeLessorName}) har oprettet en advarsel på din profil. Årsag: ${reasonLabel}.</p>${appealLink}`,
      }),
    });

    const data = await emailResponse.json();
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
