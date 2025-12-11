import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingNotificationRequest {
  lessorEmail: string;
  lessorName: string;
  renterName: string;
  renterEmail: string;
  renterPhone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleRegistration: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  notes?: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: BookingNotificationRequest = await req.json();
    console.log("Received booking notification request:", data);

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
        port: 587,
        tls: true,
        auth: {
          username: smtpUser,
          password: smtpPassword,
        },
      },
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2962FF, #00E676); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .info-row:last-child { border-bottom: none; }
    .label { color: #666; font-weight: 500; }
    .value { color: #333; font-weight: 600; }
    .price { font-size: 24px; color: #2962FF; font-weight: bold; text-align: center; padding: 20px; }
    .cta { text-align: center; margin-top: 20px; }
    .cta a { background: #2962FF; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚗 Ny bookingforespørgsel!</h1>
    </div>
    <div class="content">
      <p>Hej ${data.lessorName},</p>
      <p>Du har modtaget en ny bookingforespørgsel på LEJIO!</p>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #2962FF;">📋 Lejer information</h3>
        <div class="info-row">
          <span class="label">Navn:</span>
          <span class="value">${data.renterName}</span>
        </div>
        <div class="info-row">
          <span class="label">Email:</span>
          <span class="value">${data.renterEmail}</span>
        </div>
        <div class="info-row">
          <span class="label">Telefon:</span>
          <span class="value">${data.renterPhone}</span>
        </div>
      </div>

      <div class="info-box">
        <h3 style="margin-top: 0; color: #2962FF;">🚙 Køretøj</h3>
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
        <h3 style="margin-top: 0; color: #2962FF;">📅 Periode</h3>
        <div class="info-row">
          <span class="label">Fra:</span>
          <span class="value">${data.startDate}</span>
        </div>
        <div class="info-row">
          <span class="label">Til:</span>
          <span class="value">${data.endDate}</span>
        </div>
      </div>

      ${data.notes ? `
      <div class="info-box">
        <h3 style="margin-top: 0; color: #2962FF;">📝 Noter</h3>
        <p style="margin: 0;">${data.notes}</p>
      </div>
      ` : ''}

      <div class="price">
        Total: ${data.totalPrice.toLocaleString('da-DK')} kr
      </div>

      <div class="cta">
        <a href="https://lejio.dk/dashboard">Se booking i dashboard</a>
      </div>

      <div class="footer">
        <p>Denne email er sendt automatisk fra LEJIO</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    await client.send({
      from: smtpFromEmail,
      to: data.lessorEmail,
      subject: `Ny bookingforespørgsel: ${data.vehicleMake} ${data.vehicleModel}`,
      content: emailHtml,
      html: emailHtml,
    });

    await client.close();

    console.log("Email sent successfully to:", data.lessorEmail);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending booking notification:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
