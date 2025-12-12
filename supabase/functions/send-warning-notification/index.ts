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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { renterEmail, renterName, warningId, reason, lessorName, appealUrl }: WarningNotificationRequest = await req.json();
    const reasonLabel = REASON_LABELS[reason] || reason;

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
        html: `<h1>Kære ${renterName || 'Lejer'}</h1><p>En udlejer (${lessorName}) har oprettet en advarsel på din profil. Årsag: ${reasonLabel}.</p><p><a href="${appealUrl}">Indgiv klage her</a></p>`,
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
