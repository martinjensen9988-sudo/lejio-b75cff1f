import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContractSignedRequest {
  contractId: string;
  signerRole: 'lessor' | 'renter';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { contractId, signerRole }: ContractSignedRequest = await req.json();

    console.log(`Sending contract signed email for contract: ${contractId}, signer: ${signerRole}`);

    // Fetch contract details
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .single();

    if (contractError || !contract) {
      console.error('Contract not found:', contractError);
      return new Response(JSON.stringify({ error: 'Contract not found' }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Format dates
    const startDate = new Date(contract.start_date).toLocaleDateString('da-DK');
    const endDate = new Date(contract.end_date).toLocaleDateString('da-DK');
    const signedAt = new Date().toLocaleDateString('da-DK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Check if SMTP is configured
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const fromEmail = Deno.env.get("SMTP_FROM_EMAIL") || "noreply@lejio.dk";

    if (!smtpHost || !smtpUser || !smtpPassword) {
      console.log("SMTP not configured, skipping email");
      return new Response(JSON.stringify({ success: true, message: 'SMTP not configured' }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build contract details HTML
    const contractDetailsHtml = `
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Kontraktdetaljer</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666;">Kontraktnummer:</td>
            <td style="padding: 8px 0; font-weight: bold;">${contract.contract_number}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Køretøj:</td>
            <td style="padding: 8px 0; font-weight: bold;">${contract.vehicle_make} ${contract.vehicle_model}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Registreringsnummer:</td>
            <td style="padding: 8px 0; font-weight: bold;">${contract.vehicle_registration}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Lejeperiode:</td>
            <td style="padding: 8px 0; font-weight: bold;">${startDate} - ${endDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Dagspris:</td>
            <td style="padding: 8px 0; font-weight: bold;">${contract.daily_price} kr</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Inkluderede km:</td>
            <td style="padding: 8px 0; font-weight: bold;">${contract.included_km} km/dag</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Total pris:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #2962FF;">${contract.total_price} kr</td>
          </tr>
          ${contract.deposit_amount ? `
          <tr>
            <td style="padding: 8px 0; color: #666;">Depositum:</td>
            <td style="padding: 8px 0; font-weight: bold;">${contract.deposit_amount} kr</td>
          </tr>
          ` : ''}
        </table>
      </div>
    `;

    // Status badge
    const isFullySigned = contract.status === 'signed';
    const statusBadge = isFullySigned 
      ? `<span style="background-color: #00E676; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold;">✓ Fuldt underskrevet</span>`
      : `<span style="background-color: #FFD600; color: #333; padding: 8px 16px; border-radius: 20px; font-weight: bold;">⏳ Afventer ${contract.lessor_signature ? 'lejer' : 'udlejer'}s underskrift</span>`;

    // Build email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Nunito', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2962FF; margin: 0;">LEJIO</h1>
          <p style="color: #666; margin: 5px 0;">Din biludlejningsplatform</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #2962FF 0%, #448AFF 100%); color: white; padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0 0 10px 0;">Kontrakt underskrevet! ✍️</h2>
          <p style="margin: 0; opacity: 0.9;">Du har underskrevet lejekontrakten</p>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.8;">${signedAt}</p>
        </div>

        <div style="text-align: center; margin: 20px 0;">
          ${statusBadge}
        </div>

        ${contractDetailsHtml}

        <div style="display: table; width: 100%; margin: 20px 0;">
          <div style="display: table-cell; width: 48%; background-color: #e3f2fd; padding: 15px; border-radius: 8px; vertical-align: top;">
            <h4 style="color: #2962FF; margin-top: 0;">Udlejer</h4>
            <p style="margin: 5px 0;"><strong>${contract.lessor_name}</strong></p>
            <p style="margin: 5px 0; color: #666;">${contract.lessor_email}</p>
            ${contract.lessor_phone ? `<p style="margin: 5px 0; color: #666;">${contract.lessor_phone}</p>` : ''}
            ${contract.lessor_signature ? `<p style="margin: 5px 0; color: #00E676;">✓ Underskrevet</p>` : ''}
          </div>
          <div style="display: table-cell; width: 4%;"></div>
          <div style="display: table-cell; width: 48%; background-color: #fff3e0; padding: 15px; border-radius: 8px; vertical-align: top;">
            <h4 style="color: #FF8A65; margin-top: 0;">Lejer</h4>
            <p style="margin: 5px 0;"><strong>${contract.renter_name}</strong></p>
            <p style="margin: 5px 0; color: #666;">${contract.renter_email}</p>
            ${contract.renter_phone ? `<p style="margin: 5px 0; color: #666;">${contract.renter_phone}</p>` : ''}
            ${contract.renter_signature ? `<p style="margin: 5px 0; color: #00E676;">✓ Underskrevet</p>` : ''}
          </div>
        </div>

        ${contract.vanvidskørsel_accepted ? `
        <div style="background-color: #ffebee; border-left: 4px solid #f44336; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; color: #c62828;">
            <strong>⚠️ Vanvidskørsel-klausul accepteret:</strong><br>
            Du har accepteret fuldt ansvar for køretøjets værdi ved skader forårsaget af vanvidskørsel.
          </p>
        </div>
        ` : ''}

        ${isFullySigned ? `
        <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; color: #2e7d32;">
            <strong>✓ Kontrakten er nu gyldig!</strong><br>
            Begge parter har underskrevet. Bookingen er bekræftet og køretøjet er klar til afhentning ${startDate}.
          </p>
        </div>
        ` : `
        <div style="background-color: #fff8e1; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; color: #f57c00;">
            <strong>⏳ Afventer underskrift</strong><br>
            Kontrakten mangler stadig udlejerens underskrift før den er gyldig.
          </p>
        </div>
        `}

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://lejio.dk/my-rentals" style="display: inline-block; background-color: #2962FF; color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: bold;">
            Se mine lejeaftaler
          </a>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
          <p>Dette er en automatisk genereret email fra LEJIO.</p>
          <p>Du modtager denne email fordi du er part i en lejekontrakt.</p>
          <p style="margin-top: 10px;">
            <a href="https://lejio.dk" style="color: #2962FF;">lejio.dk</a>
          </p>
        </div>
      </body>
      </html>
    `;

    // Create SMTP client
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

    // Send email to renter
    await client.send({
      from: fromEmail,
      to: contract.renter_email,
      subject: `Kontrakt ${contract.contract_number} - ${isFullySigned ? 'Fuldt underskrevet ✓' : 'Din underskrift er registreret'}`,
      content: emailHtml,
      html: emailHtml,
    });

    console.log("Contract signed email sent to renter:", contract.renter_email);

    // If fully signed, also notify the lessor
    if (isFullySigned) {
      const lessorEmailHtml = emailHtml
        .replace('Du har underskrevet lejekontrakten', `${contract.renter_name} har underskrevet lejekontrakten`)
        .replace('Se mine lejeaftaler', 'Se mine udlejninger');

      await client.send({
        from: fromEmail,
        to: contract.lessor_email,
        subject: `Kontrakt ${contract.contract_number} - Fuldt underskrevet! ✓`,
        content: lessorEmailHtml,
        html: lessorEmailHtml,
      });

      console.log("Contract signed notification sent to lessor:", contract.lessor_email);
    }

    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in send-contract-signed function:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
