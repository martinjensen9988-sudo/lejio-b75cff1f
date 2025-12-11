import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContractSignedRequest {
  contractId: string;
  signerRole: 'lessor' | 'renter';
}

interface Contract {
  id: string;
  contract_number: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_registration: string;
  vehicle_vin: string | null;
  vehicle_year: number | null;
  vehicle_value: number | null;
  start_date: string;
  end_date: string;
  daily_price: number;
  included_km: number;
  extra_km_price: number;
  total_price: number;
  deposit_amount: number | null;
  lessor_name: string;
  lessor_email: string;
  lessor_phone: string | null;
  lessor_address: string | null;
  lessor_company_name: string | null;
  lessor_cvr: string | null;
  lessor_signature: string | null;
  lessor_signed_at: string | null;
  renter_name: string;
  renter_email: string;
  renter_phone: string | null;
  renter_address: string | null;
  renter_license_number: string | null;
  renter_signature: string | null;
  renter_signed_at: string | null;
  vanvidskørsel_accepted: boolean;
  vanvidskørsel_liability_amount: number | null;
  insurance_company: string | null;
  insurance_policy_number: string | null;
  status: string;
}

async function generateContractPDF(contract: Contract): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  
  const margin = 50;
  let y = height - margin;
  
  const drawText = (text: string, x: number, yPos: number, size = 10, font = helvetica, color = rgb(0.2, 0.2, 0.2)) => {
    page.drawText(text, { x, y: yPos, size, font, color });
  };
  
  const drawLine = (yPos: number) => {
    page.drawLine({
      start: { x: margin, y: yPos },
      end: { x: width - margin, y: yPos },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });
  };

  // Header
  drawText('LEJEKONTRAKT', margin, y, 24, helveticaBold, rgb(0.16, 0.38, 1));
  y -= 25;
  drawText(`Kontrakt nr: ${contract.contract_number}`, margin, y, 12, helveticaBold);
  y -= 40;
  
  // Contract dates
  const startDate = new Date(contract.start_date).toLocaleDateString('da-DK');
  const endDate = new Date(contract.end_date).toLocaleDateString('da-DK');
  
  drawLine(y + 15);
  drawText('KØRETØJSOPLYSNINGER', margin, y, 12, helveticaBold, rgb(0.16, 0.38, 1));
  y -= 20;
  
  drawText(`Mærke/Model: ${contract.vehicle_make} ${contract.vehicle_model}`, margin, y);
  drawText(`Årgang: ${contract.vehicle_year || 'Ikke angivet'}`, width/2, y);
  y -= 15;
  drawText(`Registreringsnummer: ${contract.vehicle_registration}`, margin, y);
  drawText(`Stelnummer (VIN): ${contract.vehicle_vin || 'Ikke angivet'}`, width/2, y);
  y -= 15;
  if (contract.vehicle_value) {
    drawText(`Køretøjets værdi: ${contract.vehicle_value.toLocaleString('da-DK')} kr`, margin, y);
    y -= 15;
  }
  
  y -= 20;
  drawLine(y + 15);
  drawText('LEJEPERIODE', margin, y, 12, helveticaBold, rgb(0.16, 0.38, 1));
  y -= 20;
  drawText(`Fra: ${startDate}`, margin, y);
  drawText(`Til: ${endDate}`, width/2, y);
  y -= 30;
  
  drawLine(y + 15);
  drawText('PRISER OG BETINGELSER', margin, y, 12, helveticaBold, rgb(0.16, 0.38, 1));
  y -= 20;
  drawText(`Dagspris: ${contract.daily_price} kr`, margin, y);
  drawText(`Inkluderede km/dag: ${contract.included_km} km`, width/2, y);
  y -= 15;
  drawText(`Pris pr. ekstra km: ${contract.extra_km_price} kr`, margin, y);
  drawText(`Total pris: ${contract.total_price.toLocaleString('da-DK')} kr`, width/2, y, 10, helveticaBold);
  y -= 15;
  if (contract.deposit_amount) {
    drawText(`Depositum: ${contract.deposit_amount.toLocaleString('da-DK')} kr`, margin, y);
    y -= 15;
  }
  
  y -= 20;
  drawLine(y + 15);
  drawText('UDLEJER', margin, y, 12, helveticaBold, rgb(0.16, 0.38, 1));
  y -= 20;
  drawText(`Navn: ${contract.lessor_name}`, margin, y);
  y -= 15;
  drawText(`Email: ${contract.lessor_email}`, margin, y);
  if (contract.lessor_phone) {
    drawText(`Telefon: ${contract.lessor_phone}`, width/2, y);
  }
  y -= 15;
  if (contract.lessor_address) {
    drawText(`Adresse: ${contract.lessor_address}`, margin, y);
    y -= 15;
  }
  if (contract.lessor_company_name) {
    drawText(`Firma: ${contract.lessor_company_name}`, margin, y);
    if (contract.lessor_cvr) {
      drawText(`CVR: ${contract.lessor_cvr}`, width/2, y);
    }
    y -= 15;
  }
  
  y -= 20;
  drawLine(y + 15);
  drawText('LEJER', margin, y, 12, helveticaBold, rgb(0.16, 0.38, 1));
  y -= 20;
  drawText(`Navn: ${contract.renter_name}`, margin, y);
  y -= 15;
  drawText(`Email: ${contract.renter_email}`, margin, y);
  if (contract.renter_phone) {
    drawText(`Telefon: ${contract.renter_phone}`, width/2, y);
  }
  y -= 15;
  if (contract.renter_address) {
    drawText(`Adresse: ${contract.renter_address}`, margin, y);
    y -= 15;
  }
  if (contract.renter_license_number) {
    drawText(`Kørekortnummer: ${contract.renter_license_number}`, margin, y);
    y -= 15;
  }
  
  // Insurance
  if (contract.insurance_company) {
    y -= 20;
    drawLine(y + 15);
    drawText('FORSIKRING', margin, y, 12, helveticaBold, rgb(0.16, 0.38, 1));
    y -= 20;
    drawText(`Forsikringsselskab: ${contract.insurance_company}`, margin, y);
    if (contract.insurance_policy_number) {
      drawText(`Policenummer: ${contract.insurance_policy_number}`, width/2, y);
    }
    y -= 15;
  }
  
  // Vanvidskørsel clause
  if (contract.vanvidskørsel_accepted) {
    y -= 20;
    drawLine(y + 15);
    drawText('VANVIDSKØRSEL-KLAUSUL', margin, y, 12, helveticaBold, rgb(0.8, 0.2, 0.2));
    y -= 20;
    drawText('Lejer har accepteret fuldt ansvar for køretøjets værdi ved skader', margin, y, 9);
    y -= 12;
    drawText('forårsaget af vanvidskørsel eller grov uagtsomhed.', margin, y, 9);
    if (contract.vanvidskørsel_liability_amount) {
      y -= 12;
      drawText(`Ansvarsbeløb: ${contract.vanvidskørsel_liability_amount.toLocaleString('da-DK')} kr`, margin, y, 9, helveticaBold);
    }
    y -= 15;
  }
  
  // Signatures section
  y -= 30;
  drawLine(y + 15);
  drawText('UNDERSKRIFTER', margin, y, 12, helveticaBold, rgb(0.16, 0.38, 1));
  y -= 30;
  
  // Lessor signature
  const lessorSignedDate = contract.lessor_signed_at 
    ? new Date(contract.lessor_signed_at).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Ikke underskrevet';
  
  drawText('Udlejer:', margin, y, 10, helveticaBold);
  y -= 15;
  drawText(contract.lessor_name, margin, y);
  y -= 15;
  drawText(`Dato: ${lessorSignedDate}`, margin, y, 9);
  
  // Draw lessor signature image if exists
  if (contract.lessor_signature) {
    try {
      const signatureData = contract.lessor_signature.split(',')[1];
      if (signatureData) {
        const signatureBytes = Uint8Array.from(atob(signatureData), c => c.charCodeAt(0));
        const signatureImage = await pdfDoc.embedPng(signatureBytes);
        const signatureDims = signatureImage.scale(0.3);
        page.drawImage(signatureImage, {
          x: margin,
          y: y - signatureDims.height - 5,
          width: Math.min(signatureDims.width, 150),
          height: Math.min(signatureDims.height, 40),
        });
        y -= 50;
      }
    } catch (e) {
      console.log('Could not embed lessor signature:', e);
      drawText('[Underskrift registreret digitalt]', margin, y - 20, 8, helvetica, rgb(0.5, 0.5, 0.5));
      y -= 30;
    }
  }
  
  // Renter signature
  y -= 20;
  const renterSignedDate = contract.renter_signed_at 
    ? new Date(contract.renter_signed_at).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Ikke underskrevet';
  
  drawText('Lejer:', margin, y, 10, helveticaBold);
  y -= 15;
  drawText(contract.renter_name, margin, y);
  y -= 15;
  drawText(`Dato: ${renterSignedDate}`, margin, y, 9);
  
  // Draw renter signature image if exists
  if (contract.renter_signature) {
    try {
      const signatureData = contract.renter_signature.split(',')[1];
      if (signatureData) {
        const signatureBytes = Uint8Array.from(atob(signatureData), c => c.charCodeAt(0));
        const signatureImage = await pdfDoc.embedPng(signatureBytes);
        const signatureDims = signatureImage.scale(0.3);
        page.drawImage(signatureImage, {
          x: margin,
          y: y - signatureDims.height - 5,
          width: Math.min(signatureDims.width, 150),
          height: Math.min(signatureDims.height, 40),
        });
      }
    } catch (e) {
      console.log('Could not embed renter signature:', e);
      drawText('[Underskrift registreret digitalt]', margin, y - 20, 8, helvetica, rgb(0.5, 0.5, 0.5));
    }
  }
  
  // Footer
  page.drawText('Genereret af LEJIO - lejio.dk', { 
    x: margin, 
    y: 30, 
    size: 8, 
    font: helvetica, 
    color: rgb(0.6, 0.6, 0.6) 
  });
  page.drawText(`Dokument genereret: ${new Date().toLocaleDateString('da-DK')}`, { 
    x: width - margin - 120, 
    y: 30, 
    size: 8, 
    font: helvetica, 
    color: rgb(0.6, 0.6, 0.6) 
  });
  
  return await pdfDoc.save();
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

    // Generate PDF
    console.log('Generating contract PDF...');
    const pdfBytes = await generateContractPDF(contract as Contract);
    const pdfBase64 = btoa(String.fromCharCode(...pdfBytes));
    console.log('PDF generated successfully, size:', pdfBytes.length);

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

        <div style="background-color: #e3f2fd; border-left: 4px solid #2962FF; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; color: #1565c0;">
            <strong>📎 Vedhæftet: Lejekontrakt</strong><br>
            Din underskrevne lejekontrakt er vedhæftet som PDF.
          </p>
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

    // Send email to renter with PDF attachment
    await client.send({
      from: fromEmail,
      to: contract.renter_email,
      subject: `Kontrakt ${contract.contract_number} - ${isFullySigned ? 'Fuldt underskrevet ✓' : 'Din underskrift er registreret'}`,
      content: emailHtml,
      html: emailHtml,
      attachments: [
        {
          filename: `Lejekontrakt-${contract.contract_number}.pdf`,
          content: pdfBase64,
          encoding: 'base64',
          contentType: 'application/pdf',
        },
      ],
    });

    console.log("Contract signed email with PDF sent to renter:", contract.renter_email);

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
        attachments: [
          {
            filename: `Lejekontrakt-${contract.contract_number}.pdf`,
            content: pdfBase64,
            encoding: 'base64',
            contentType: 'application/pdf',
          },
        ],
      });

      console.log("Contract signed notification with PDF sent to lessor:", contract.lessor_email);
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
