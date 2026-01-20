import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendEmailRequest {
  leadId?: string;
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  body: string;
}

// Base64 encode for SMTP auth
function base64Encode(str: string): string {
  return btoa(str);
}

// Simple SMTP client using raw TCP
async function sendSmtpEmail(
  host: string,
  user: string,
  password: string,
  from: string,
  to: string,
  subject: string,
  textBody: string,
  htmlBody: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const conn = await Deno.connectTls({
      hostname: host,
      port: 465,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const readResponse = async (): Promise<string> => {
      const buffer = new Uint8Array(1024);
      const n = await conn.read(buffer);
      if (n === null) return "";
      return decoder.decode(buffer.subarray(0, n));
    };

    const sendCommand = async (command: string): Promise<string> => {
      await conn.write(encoder.encode(command + "\r\n"));
      return await readResponse();
    };

    // Read greeting
    await readResponse();

    // EHLO
    await sendCommand(`EHLO ${host}`);

    // AUTH LOGIN
    await sendCommand("AUTH LOGIN");
    await sendCommand(base64Encode(user));
    await sendCommand(base64Encode(password));

    // MAIL FROM
    await sendCommand(`MAIL FROM:<${from}>`);

    // RCPT TO
    await sendCommand(`RCPT TO:<${to}>`);

    // DATA
    await sendCommand("DATA");

    // Email content with MIME
    const boundary = `----=_Part_${Date.now()}`;
    const messageId = `<${Date.now()}.${Math.random().toString(36).substring(2)}@lejio.dk>`;
    
    const emailContent = [
      `From: "LEJIO Forhandler" <${from}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `Message-ID: ${messageId}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      `Reply-To: hej@lejio.dk`,
      ``,
      `--${boundary}`,
      `Content-Type: text/plain; charset=UTF-8`,
      ``,
      textBody,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset=UTF-8`,
      ``,
      htmlBody,
      ``,
      `--${boundary}--`,
      `.`,
    ].join("\r\n");

    await sendCommand(emailContent);

    // QUIT
    await sendCommand("QUIT");
    conn.close();

    return { success: true, messageId };
  } catch (error: any) {
    console.error("SMTP error:", error);
    return { success: false, error: error.message };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadId, recipientEmail, recipientName, subject, body }: SendEmailRequest = await req.json();

    // Validate required fields
    if (!recipientEmail || !subject || !body) {
      return new Response(
        JSON.stringify({ error: "recipientEmail, subject og body er påkrævet" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(recipientEmail)) {
      return new Response(
        JSON.stringify({ error: "Ugyldig email-adresse" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get SMTP settings for sales emails
    const smtpHost = Deno.env.get("SALES_SMTP_HOST");
    const smtpUser = Deno.env.get("SALES_SMTP_USER");
    const smtpPassword = Deno.env.get("SALES_SMTP_PASSWORD");

    if (!smtpHost || !smtpUser || !smtpPassword) {
      console.error("Missing SALES SMTP configuration");
      return new Response(
        JSON.stringify({ error: "Salgs-SMTP er ikke konfigureret" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Convert plain text body to HTML (preserve line breaks)
    const htmlBody = body
      .split('\n')
      .map(line => line.trim() === '' ? '<br>' : `<p style="margin: 0 0 12px 0;">${line}</p>`)
      .join('');

    const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${htmlBody}
</body>
</html>`;

    // Send email via SMTP
    const result = await sendSmtpEmail(
      smtpHost,
      smtpUser,
      smtpPassword,
      "forhandler@lejio.dk",
      recipientEmail,
      subject,
      body,
      emailHtml
    );

    if (!result.success) {
      throw new Error(result.error || "SMTP fejl");
    }

    console.log("Sales email sent successfully:", result.messageId);

    // Update the sales_emails table if leadId is provided
    if (leadId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Get auth header to identify user
      const authHeader = req.headers.get("Authorization");
      let userId: string | null = null;
      
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data: { user } } = await supabase.auth.getUser(token);
        userId = user?.id || null;
      }

      // Insert email record with sent status
      await supabase
        .from("sales_emails")
        .insert({
          lead_id: leadId,
          subject,
          body,
          status: "sent",
          sent_at: new Date().toISOString(),
          created_by: userId,
        });

      // Update lead status
      await supabase
        .from("sales_leads")
        .update({
          status: "contacted",
          last_contacted_at: new Date().toISOString(),
        })
        .eq("id", leadId);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sendt succesfuldt",
        messageId: result.messageId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-sales-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Kunne ikke sende email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
