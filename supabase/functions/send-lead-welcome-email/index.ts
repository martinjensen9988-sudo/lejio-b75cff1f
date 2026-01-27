import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { leadId } = await req.json();

    // Fetch lead details
    const { data: lead, error: leadError } = await supabase
      .from('sales_leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      console.error('Lead not found:', leadError);
      return new Response(
        JSON.stringify({ error: 'Lead not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!lead.contact_email) {
      console.log('No email for lead:', lead.company_name);
      return new Response(
        JSON.stringify({ error: 'No email address available', success: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const smtpFromEmail = Deno.env.get("SMTP_FROM_EMAIL") || "noreply@lejio.dk";

    if (!smtpHost || !smtpUser || !smtpPassword) {
      console.error("SMTP not configured");
      return new Response(
        JSON.stringify({ success: false, message: "SMTP not configured" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: 465,
        tls: true,
        auth: { username: smtpUser, password: smtpPassword },
      },
    });

    const contactName = lead.contact_name?.split(' ')[0] || 'Hej';
    const industryDK = lead.industry?.toLowerCase() || 'virksomhed';

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body{font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;line-height:1.6;color:#333}
    .container{max-width:600px;margin:0 auto;padding:20px}
    .header{background:linear-gradient(135deg,#2962FF,#00E676);padding:30px;border-radius:12px 12px 0 0;text-align:center}
    .header h1{color:#fff;margin:0;font-size:24px}
    .content{background:#f8f9fa;padding:30px;border-radius:0 0 12px 12px}
    .benefit-box{background:#fff;padding:20px;border-radius:8px;margin:15px 0;border-left:4px solid #2962FF;box-shadow:0 2px 4px rgba(0,0,0,.1)}
    .benefit-box h3{margin-top:0;color:#2962FF}
    .cta-button{display:inline-block;background:linear-gradient(135deg,#FFD600,#FF8A65);color:#333;text-decoration:none;padding:16px 32px;border-radius:30px;font-weight:bold;font-size:16px;margin:20px auto;box-shadow:0 4px 15px rgba(255,214,0,.4)}
    .features{display:grid;gap:15px}
    .feature{background:#fff;padding:15px;border-radius:8px;border-left:4px solid #00E676}
    .feature-title{font-weight:bold;color:#00E676;margin-bottom:5px}
    .footer{text-align:center;margin-top:30px;color:#888;font-size:12px;border-top:1px solid #ddd;padding-top:20px}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Velkommen til LEJIO!</h1>
    </div>
    <div class="content">
      <p>Hej ${contactName},</p>
      
      <p>Vi har identificeret at ${lead.company_name} ville være en perfekt match for LEJIO - Danmarks bedste biludlejningsplatform.</p>
      
      <div class="benefit-box">
        <h3>Hvorfor LEJIO?</h3>
        <p>For ${industryDK} som jer, tilbyder LEJIO:</p>
        <ul style="margin:10px 0;padding-left:20px">
          <li>Fleksibel udlejning direkte til jeres kunder</li>
          <li>Økonomisk løsning uden store investeringer</li>
          <li>Enkel integration og betaling</li>
          <li>24/7 support og GPS tracking</li>
          <li>Vejledning gennem hele processen</li>
        </ul>
      </div>
      
      <div style="background:#FFF8E1;border-left:4px solid #FFD600;padding:20px;border-radius:0 8px 8px 0;margin:20px 0">
        <h3 style="margin-top:0;color:#F57C00">💡 Jeres mulighed</h3>
        <p>I kan nu tilbyde lånebiler til jeres kunder, hvilket øger værdi og kundebinding.</p>
      </div>
      
      <p style="text-align:center">
        <a href="https://lejio.dk/get-started?ref=${lead.id}" class="cta-button">
          📞 Få gratis konsultation
        </a>
      </p>
      
      <p>eller ring mig direkte på <strong>+45 40 40 90 00</strong> for at høre mere.</p>
      
      <div class="footer">
        <p>Med venlig hilsen,<br/>
        <strong>LEJIO Sales Team</strong><br/>
        Copenhagen, Denmark<br/>
        <a href="https://lejio.dk" style="color:#2962FF;text-decoration:none">lejio.dk</a></p>
        <p style="margin-top:20px;font-size:11px">
          Denne email blev sendt fordi vi tror, du ville være interesseret i at høre om LEJIO. 
          Du kan altid kontakte os for at blive fjernet fra listen.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    await client.send({
      from: smtpFromEmail,
      to: lead.contact_email,
      subject: `🚀 Ny mulighed for ${lead.company_name} - LEJIO Biludlejning`,
      content: emailHtml,
      html: emailHtml,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Transfer-Encoding': '8bit',
      },
    } as any);

    await client.close();

    // Update lead to mark email as sent
    await supabase
      .from('sales_leads')
      .update({
        status: 'contacted',
        last_contact_date: new Date().toISOString(),
        notes: `Welcome email sent at ${new Date().toISOString()}. ${lead.notes || ''}`
      })
      .eq('id', leadId);

    console.log(`✅ Welcome email sent to ${lead.contact_email} for ${lead.company_name}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Email sent to ${lead.contact_email}`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending lead welcome email:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
