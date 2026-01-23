import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const smtpFromEmail = Deno.env.get("SMTP_FROM_EMAIL");

    if (!smtpHost || !smtpUser || !smtpPassword || !smtpFromEmail) {
      console.error("Missing SMTP configuration");
      return new Response(JSON.stringify({ 
        error: "SMTP not configured",
        missing: {
          host: !smtpHost,
          user: !smtpUser,
          password: !smtpPassword,
          from: !smtpFromEmail
        }
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("SMTP Config:", { host: smtpHost, user: smtpUser, from: smtpFromEmail });

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

    const now = new Date().toLocaleString('da-DK', { 
      timeZone: 'Europe/Copenhagen',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
    .success-box { background: white; padding: 25px; border-radius: 12px; text-align: center; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 2px solid #00E676; }
    .checkmark { font-size: 48px; margin-bottom: 10px; }
    .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ LEJIO Email Test</h1>
    </div>
    <div class="content">
      <div class="success-box">
        <div class="checkmark">✓</div>
        <h2 style="color: #00E676; margin: 0;">Email systemet virker!</h2>
      </div>
      
      <p>Dette er en testmail sendt fra LEJIO platformen.</p>
      <p><strong>Sendt:</strong> ${now}</p>
      <p><strong>Fra:</strong> ${smtpFromEmail}</p>
      
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
      to: "hej@lejio.dk",
      subject: "✅ Test email fra LEJIO - Alt virker!",
      content: emailHtml,
      html: emailHtml,
    });

    await client.close();

    console.log("Test email sent successfully!");

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Test email sendt til hej@lejio.dk",
      sentAt: now
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending test email:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
