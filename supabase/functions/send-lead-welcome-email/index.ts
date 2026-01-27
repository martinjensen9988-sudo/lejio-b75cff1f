import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendLeadEmailRequest {
  leadId: string;
  companyName: string;
  contactEmail: string;
  industry: string;
  city?: string;
  reason: string;
  subject?: string;
  body?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      leadId,
      companyName,
      contactEmail,
      industry,
      city,
      reason,
      subject,
      body,
    } = (await req.json()) as SendLeadEmailRequest;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let emailSubject = subject;
    let emailBody = body;

    // Generate email if not provided
    if (!emailBody || !emailSubject) {
      const emailResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-3-flash-preview',
          messages: [
            {
              role: 'system',
              content: `Du skriver professionelle, personaliserede sales-emails på dansk for LEJIO - en moderne biludlejningsplatform.

Emailen skal:
- Være varm og personlig (mentioner virksomhedsnavnet og industri)
- Forklare hvordan LEJIO kan hjælpe deres forretning
- Inkludere konkrete fordele for deres industri
- Afslutte med en stærk CTA (call to action) til at booke demo
- Være kort (max 200 ord)
- Signeres af LEJIO sales team

Return JSON med:
{
  "subject": "Emne for emailen",
  "body": "Email body i markdown"
}`,
            },
            {
              role: 'user',
              content: `Skriv en personaliseret sales-email til:
Virksomhed: ${companyName}
Industri: ${industry}
By: ${city || 'Danmark'}
Grund til at kontakte: ${reason}`,
            },
          ],
          max_tokens: 600,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to generate email');
      }

      const emailData = await emailResponse.json();
      const emailContent = emailData.choices?.[0]?.message?.content || '';

      try {
        const parsed = JSON.parse(emailContent);
        emailSubject = parsed.subject || 'Velkommen til LEJIO';
        emailBody = parsed.body || 'Tak fordi du overvejer LEJIO!';
      } catch (e) {
        console.error('Failed to parse email generation:', e);
        emailSubject = 'Velkommen til LEJIO';
        emailBody = `Hej ${companyName},\n\nVi synes at LEJIO kunne være perfekt for jer!\n\nVed du gerne høre mere?\n\nMed venlig hilsen,\nLEJIO Sales Team`;
      }
    }

    // Save email to database before sending
    const { data: savedEmail, error: saveError } = await supabase
      .from('lead_emails_sent')
      .insert({
        lead_id: leadId,
        company_name: companyName,
        recipient_email: contactEmail,
        subject: emailSubject,
        body: emailBody,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving email record:', saveError);
    }

    // Mark lead as email_sent in leads table
    await supabase
      .from('leads')
      .update({
        email_sent: true,
        email_status: 'sent',
        last_email_sent_at: new Date().toISOString(),
      })
      .eq('id', leadId)
      .catch(err => console.error('Error updating lead status:', err));

    // TODO: Send actual email via email service (SendGrid, Resend, etc)
    // For now, we're just tracking that email was generated and would be sent
    console.log(`✉️ Email prepared for ${companyName} (${contactEmail})`);
    console.log(`Subject: ${emailSubject}`);

    return new Response(
      JSON.stringify({
        success: true,
        leadId,
        email: {
          to: contactEmail,
          subject: emailSubject,
          body: emailBody,
        },
        saved: !!savedEmail,
        message: 'Email generated and recorded',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Send lead email error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to send email',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
