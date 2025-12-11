import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  renterEmail: string;
  renterName: string;
  lessorName: string;
  lessorPhone: string | null;
  lessorEmail: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleRegistration: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  contractId: string;
  contractNumber: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: BookingConfirmationRequest = await req.json();
    console.log("Sending booking confirmation to renter:", data.renterEmail);

    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const smtpFromEmail = Deno.env.get("SMTP_FROM_EMAIL");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");

    if (!smtpHost || !smtpUser || !smtpPassword || !smtpFromEmail) {
      console.error("Missing SMTP configuration");
      throw new Error("SMTP configuration is incomplete");
    }

    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: 587,
        tls: true,
        auth: {
          username: smtpUser,
          password: smtpPassword,
        },
      },
    });

    // Generate contract signing link - use the app domain
    const appDomain = "https://lejio.dk"; // Production domain
    const contractLink = `${appDomain}/my-rentals?contractId=${data.contractId}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #00E676, #2962FF); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; }
    .success-badge { background: #00E676; color: white; display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: 600; margin-bottom: 20px; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .info-row:last-child { border-bottom: none; }
    .label { color: #666; font-weight: 500; }
    .value { color: #333; font-weight: 600; }
    .price { font-size: 24px; color: #00E676; font-weight: bold; text-align: center; padding: 20px; }
    .contact-box { background: #2962FF; color: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
    .contact-box h3 { margin-top: 0; }
    .contact-box a { color: white; }
    .cta-button { display: block; background: linear-gradient(135deg, #FFD600, #FF8A65); color: #333; text-decoration: none; padding: 16px 32px; border-radius: 30px; font-weight: bold; font-size: 18px; text-align: center; margin: 25px 0; box-shadow: 0 4px 15px rgba(255, 214, 0, 0.4); }
    .cta-button:hover { transform: translateY(-2px); }
    .contract-box { background: linear-gradient(135deg, #FFD600, #FF8A65); padding: 25px; border-radius: 12px; margin: 20px 0; text-align: center; }
    .contract-box h3 { margin-top: 0; color: #333; font-size: 20px; }
    .contract-box p { color: #555; margin-bottom: 15px; }
    .contract-number { background: white; display: inline-block; padding: 8px 16px; border-radius: 6px; font-family: monospace; font-size: 14px; color: #333; }
    .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Din booking er bekræftet!</h1>
    </div>
    <div class="content">
      <p>Hej ${data.renterName},</p>
      <p>Gode nyheder! Din bookingforespørgsel er blevet godkendt af udlejeren.</p>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #00E676;">🚙 Din lejebil</h3>
        <div class="info-row">
          <span class="label">Bil:</span>
          <span class="value">${data.vehicleMake} ${data.vehicleModel}</span>
        </div>
        <div class="info-row">
          <span class="label">Registrering:</span>
          <span class="value">${data.vehicleRegistration}</span>
        </div>
      </div>

      <div class="info-box">
        <h3 style="margin-top: 0; color: #00E676;">📅 Lejeperiode</h3>
        <div class="info-row">
          <span class="label">Fra:</span>
          <span class="value">${data.startDate}</span>
        </div>
        <div class="info-row">
          <span class="label">Til:</span>
          <span class="value">${data.endDate}</span>
        </div>
      </div>

      <div class="price">
        Total: ${data.totalPrice.toLocaleString('da-DK')} kr
      </div>

      <div class="contract-box">
        <h3>📋 Underskriv din lejekontrakt</h3>
        <p>Før du kan afhente bilen, skal du underskrive lejekontrakten digitalt.</p>
        <p class="contract-number">Kontrakt: ${data.contractNumber}</p>
        <a href="${contractLink}" class="cta-button" style="display: inline-block; margin-top: 15px;">
          ✍️ Underskriv kontrakt nu
        </a>
      </div>

      <div class="contact-box">
        <h3>📞 Kontakt udlejeren</h3>
        <p style="margin-bottom: 5px;"><strong>${data.lessorName}</strong></p>
        ${data.lessorPhone ? `<p style="margin: 5px 0;">Telefon: <a href="tel:${data.lessorPhone}">${data.lessorPhone}</a></p>` : ''}
        <p style="margin: 5px 0;">Email: <a href="mailto:${data.lessorEmail}">${data.lessorEmail}</a></p>
        <p style="margin-top: 15px; font-size: 14px; opacity: 0.9;">Kontakt udlejeren for at aftale afhentning efter kontrakten er underskrevet.</p>
      </div>

      <div class="info-box" style="background: #FFF8E1; border-left: 4px solid #FFD600;">
        <h3 style="margin-top: 0; color: #F57C00;">📋 Næste skridt</h3>
        <ol style="margin: 0; padding-left: 20px;">
          <li><strong>Underskriv kontrakten</strong> via linket ovenfor</li>
          <li>Kontakt udlejeren for at aftale tid og sted</li>
          <li>Medbring gyldigt kørekort ved afhentning</li>
          <li>Nyd turen! 🚗</li>
        </ol>
      </div>

      <div class="footer">
        <p>Denne email er sendt automatisk fra LEJIO</p>
        <p>Har du spørgsmål? Kontakt os på support@lejio.dk</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    await client.send({
      from: smtpFromEmail,
      to: data.renterEmail,
      subject: `🎉 Din booking er bekræftet: ${data.vehicleMake} ${data.vehicleModel} - Underskriv kontrakt`,
      content: emailHtml,
      html: emailHtml,
    });

    await client.close();

    console.log("Confirmation email sent successfully to:", data.renterEmail);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending confirmation email:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
