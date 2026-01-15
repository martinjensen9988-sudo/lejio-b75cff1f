import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const SMTP_HOST = Deno.env.get("SMTP_HOST")!;
const SMTP_USER = Deno.env.get("SMTP_USER")!;
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD")!;
const SMTP_FROM_EMAIL = Deno.env.get("SMTP_FROM_EMAIL")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FineNotificationRequest {
  renterEmail: string;
  renterName: string;
  lessorName: string;
  fineType: string;
  fineDate: string;
  fineAmount: number;
  adminFee: number;
  totalAmount: number;
  description?: string;
  fileUrl?: string;
  vehicleInfo?: string;
}

const FINE_TYPE_LABELS: Record<string, string> = {
  parking: "Parkeringsbøde",
  speed: "Fartbøde",
  toll: "Betalingsring/Bro",
  other: "Afgift",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: FineNotificationRequest = await req.json();
    const fineTypeLabel = FINE_TYPE_LABELS[data.fineType] || data.fineType;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bøde/Afgift - Handling Påkrævet</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">⚠️ Bøde/Afgift Modtaget</h1>
          </div>
          
          <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px;">Hej ${data.renterName},</p>
            
            <p>Der er registreret en <strong>${fineTypeLabel}</strong> i forbindelse med din lejeaftale.</p>
            
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #dc2626;">Bødeoplysninger</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Type:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 600;">${fineTypeLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Dato:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.fineDate}</td>
                </tr>
                ${data.vehicleInfo ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;">Køretøj:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.vehicleInfo}</td>
                </tr>
                ` : ''}
                ${data.description ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;">Beskrivelse:</td>
                  <td style="padding: 8px 0; text-align: right;">${data.description}</td>
                </tr>
                ` : ''}
                <tr style="border-top: 1px solid #fecaca;">
                  <td style="padding: 8px 0; color: #666;">Bødebeløb:</td>
                  <td style="padding: 8px 0; text-align: right;">${data.fineAmount.toLocaleString('da-DK')} kr</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Administrationsgebyr:</td>
                  <td style="padding: 8px 0; text-align: right;">${data.adminFee.toLocaleString('da-DK')} kr</td>
                </tr>
                <tr style="border-top: 2px solid #dc2626;">
                  <td style="padding: 12px 0; font-weight: bold; font-size: 18px;">Total at betale:</td>
                  <td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 18px; color: #dc2626;">${data.totalAmount.toLocaleString('da-DK')} kr</td>
                </tr>
              </table>
            </div>

            ${data.fileUrl ? `
            <p>
              <a href="${data.fileUrl}" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                📄 Se bøde/dokumentation
              </a>
            </p>
            ` : ''}

            <p style="margin-top: 20px;">Venligst betal beløbet hurtigst muligt. Ved spørgsmål kontakt udlejer: <strong>${data.lessorName}</strong></p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #666; text-align: center;">
              Denne email er sendt via LEJIO - Danmarks smarteste udlejningsplatform
            </p>
          </div>
        </body>
      </html>
    `;

    // Send email using Resend-compatible API or direct SMTP
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SMTP_PASSWORD}`,
      },
      body: JSON.stringify({
        from: SMTP_FROM_EMAIL,
        to: [data.renterEmail],
        subject: `⚠️ ${fineTypeLabel} - ${data.totalAmount.toLocaleString('da-DK')} kr at betale`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Email send failed: ${errorText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error sending fine notification:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});