import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// HTML escape function to prevent XSS/injection
function escapeHtml(text: string | null | undefined): string {
  if (!text) return '';
  return text.replace(/[&<>"']/g, char => 
    ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[char] || char
  );
}

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
    // Verify JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const data: BookingConfirmationRequest = await req.json();
    console.log("Sending booking confirmation to renter:", data.renterEmail);

    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const smtpFromEmail = Deno.env.get("SMTP_FROM_EMAIL");

    if (!smtpHost || !smtpUser || !smtpPassword || !smtpFromEmail) {
      console.error("Missing SMTP configuration");
      throw new Error("SMTP configuration is incomplete");
    }

    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: 465,
        tls: true,
        auth: {
          username: smtpUser,
          password: smtpPassword,
        },
      },
    });

    // Escape all user-provided data
    const safeRenterName = escapeHtml(data.renterName);
    const safeLessorName = escapeHtml(data.lessorName);
    const safeLessorPhone = escapeHtml(data.lessorPhone);
    const safeLessorEmail = escapeHtml(data.lessorEmail);
    const safeVehicleMake = escapeHtml(data.vehicleMake);
    const safeVehicleModel = escapeHtml(data.vehicleModel);
    const safeVehicleRegistration = escapeHtml(data.vehicleRegistration);
    const safeStartDate = escapeHtml(data.startDate);
    const safeEndDate = escapeHtml(data.endDate);
    const safeContractNumber = escapeHtml(data.contractNumber);
    const safeContractId = escapeHtml(data.contractId);

    // Generate contract signing link - use the app domain
    const appDomain = "https://lejio.dk";
    const contractLink = `${appDomain}/my-rentals?contractId=${encodeURIComponent(data.contractId)}`;

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
      <p>Hej ${safeRenterName},</p>
      <p>Gode nyheder! Din bookingforespørgsel er blevet godkendt af udlejeren.</p>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #00E676;">🚙 Din lejebil</h3>
        <div class="info-row">
          <span class="label">Bil:</span>
          <span class="value">${safeVehicleMake} ${safeVehicleModel}</span>
        </div>
        <div class="info-row">
          <span class="label">Registrering:</span>
          <span class="value">${safeVehicleRegistration}</span>
        </div>
      </div>

      <div class="info-box">
        <h3 style="margin-top: 0; color: #00E676;">📅 Lejeperiode</h3>
        <div class="info-row">
          <span class="label">Fra:</span>
          <span class="value">${safeStartDate}</span>
        </div>
        <div class="info-row">
          <span class="label">Til:</span>
          <span class="value">${safeEndDate}</span>
        </div>
      </div>

      <div class="price">
        Total: ${data.totalPrice.toLocaleString('da-DK')} kr
      </div>

      <div class="contract-box">
        <h3>📋 Underskriv din lejekontrakt</h3>
        <p>Før du kan afhente bilen, skal du underskrive lejekontrakten digitalt.</p>
        <p class="contract-number">Kontrakt: ${safeContractNumber}</p>
        <a href="${contractLink}" class="cta-button" style="display: inline-block; margin-top: 15px;">
          ✍️ Underskriv kontrakt nu
        </a>
      </div>

      <div class="contact-box">
        <h3>📞 Kontakt udlejeren</h3>
        <p style="margin-bottom: 5px;"><strong>${safeLessorName}</strong></p>
        ${safeLessorPhone ? `<p style="margin: 5px 0;">Telefon: <a href="tel:${safeLessorPhone}">${safeLessorPhone}</a></p>` : ''}
        <p style="margin: 5px 0;">Email: <a href="mailto:${safeLessorEmail}">${safeLessorEmail}</a></p>
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
      subject: `🎉 Din booking er bekræftet: ${safeVehicleMake} ${safeVehicleModel} - Underskriv kontrakt`,
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
