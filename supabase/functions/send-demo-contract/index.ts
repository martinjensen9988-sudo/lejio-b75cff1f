import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DemoContractRequest {
  recipientEmail: string;
}

// Helper function to split text into lines
function splitTextToLines(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  return lines;
}

async function generateDemoContractPDF(): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const primaryColor = rgb(0.16, 0.38, 1); // #2962FF
  const dangerColor = rgb(0.8, 0.2, 0.2);
  const textColor = rgb(0.2, 0.2, 0.2);
  const lightGray = rgb(0.5, 0.5, 0.5);
  const lineColor = rgb(0.85, 0.85, 0.85);
  
  let currentPage = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = currentPage.getSize();
  
  const margin = 50;
  let y = height - margin;
  
  const checkNewPage = () => {
    if (y < 100) {
      currentPage = pdfDoc.addPage([595.28, 841.89]);
      y = height - margin;
    }
  };
  
  const drawText = (text: string, x: number, yPos: number, size = 10, font = helvetica, color = textColor) => {
    currentPage.drawText(text, { x, y: yPos, size, font, color });
  };
  
  const drawLine = (yPos: number) => {
    currentPage.drawLine({
      start: { x: margin, y: yPos },
      end: { x: width - margin, y: yPos },
      thickness: 0.5,
      color: lineColor,
    });
  };

  const drawSectionHeader = (title: string, color = primaryColor) => {
    checkNewPage();
    y -= 10;
    drawLine(y + 5);
    y -= 5;
    drawText(title, margin, y, 12, helveticaBold, color);
    y -= 20;
  };

  const drawLabelValue = (label: string, value: string) => {
    drawText(label, margin, y, 9, helvetica, lightGray);
    drawText(value, margin + 120, y, 10, helvetica, textColor);
    y -= 15;
  };

  const drawParagraph = (text: string, fontSize = 9) => {
    const lines = splitTextToLines(text, 85);
    for (const line of lines) {
      checkNewPage();
      drawText(line, margin, y, fontSize, helvetica, textColor);
      y -= 12;
    }
    y -= 5;
  };

  // Demo data
  const demoContract = {
    contract_number: '2025-000001',
    created_at: new Date().toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' }),
    lessor_name: 'LEJIO Demo ApS',
    lessor_company_name: 'LEJIO Demo ApS',
    lessor_cvr: '12345678',
    lessor_email: 'demo@lejio.dk',
    lessor_phone: '+45 12 34 56 78',
    lessor_address: 'Demovej 123, 2100 København Ø',
    renter_name: 'Martin Jensen',
    renter_email: 'martinjensen9988@gmail.com',
    renter_phone: '+45 77 17 67 29',
    renter_address: 'Testvej 456, 7361 Ejstrupholm',
    renter_license_number: '37773994',
    vehicle_registration: 'AB12345',
    vehicle_make: 'VOLKSWAGEN',
    vehicle_model: 'PASSAT',
    vehicle_year: 2022,
    vehicle_vin: 'WVWZZZ3CZWE123456',
    vehicle_value: 250000,
    start_date: '1. januar 2025',
    end_date: '31. januar 2025',
    daily_price: 450,
    included_km: 100,
    extra_km_price: 2.50,
    total_price: 13950,
    deposit_amount: 5000,
    deductible_amount: 6000,
    insurance_company: 'Tryg Forsikring',
    insurance_policy_number: 'POL-2024-123456',
    vanvidskorsel_liability_amount: 250000,
  };

  // Header
  drawText('LEJEKONTRAKT', margin, y, 24, helveticaBold, primaryColor);
  drawText(demoContract.contract_number, margin + 200, y, 16, helveticaBold, textColor);
  y -= 20;
  drawText('LEJIO - Danmarks bedste biludlejningsplatform', margin, y, 10, helvetica, lightGray);
  y -= 10;
  drawText(`Oprettet: ${demoContract.created_at}`, margin, y, 9, helvetica, lightGray);
  y -= 30;
  
  // Udlejer Section
  drawSectionHeader('UDLEJER');
  drawLabelValue('Navn:', demoContract.lessor_name);
  drawLabelValue('Virksomhed:', demoContract.lessor_company_name);
  drawLabelValue('CVR. Nr.:', demoContract.lessor_cvr);
  drawLabelValue('Email:', demoContract.lessor_email);
  drawLabelValue('Telefon:', demoContract.lessor_phone);
  drawLabelValue('Adresse:', demoContract.lessor_address);

  // Lejer Section
  drawSectionHeader('LEJER');
  drawLabelValue('Navn:', demoContract.renter_name);
  drawLabelValue('Email:', demoContract.renter_email);
  drawLabelValue('Telefon:', demoContract.renter_phone);
  drawLabelValue('Adresse:', demoContract.renter_address);
  drawLabelValue('Kørekort nr.:', demoContract.renter_license_number);

  // Lejebil Section
  drawSectionHeader('LEJEBIL');
  drawLabelValue('Reg. nr.:', demoContract.vehicle_registration);
  drawLabelValue('Mærke, model:', `${demoContract.vehicle_make}, ${demoContract.vehicle_model}`);
  drawLabelValue('Årgang:', demoContract.vehicle_year.toString());
  drawLabelValue('Stelnummer (VIN):', demoContract.vehicle_vin);
  drawLabelValue('Køretøjets værdi:', `${demoContract.vehicle_value.toLocaleString('da-DK')} kr`);

  // Lejeaftale Section
  drawSectionHeader('LEJEAFTALE');
  drawText('Periode', margin, y, 10, helveticaBold, textColor);
  y -= 15;
  drawLabelValue('Fra dato:', demoContract.start_date);
  drawLabelValue('Til dato:', demoContract.end_date);

  // Priser Section
  drawSectionHeader('PRISER');
  drawLabelValue('Dagspris:', `${demoContract.daily_price.toLocaleString('da-DK')} kr inkl. moms`);
  drawLabelValue('Km inkl. pr. dag:', `${demoContract.included_km} km`);
  drawLabelValue('Pris pr. overkørt km:', `${demoContract.extra_km_price} kr inkl. moms`);
  drawLabelValue('Depositum:', `${demoContract.deposit_amount.toLocaleString('da-DK')} kr`);
  y -= 5;
  drawText('Total pris:', margin, y, 11, helveticaBold, textColor);
  drawText(`${demoContract.total_price.toLocaleString('da-DK')} kr inkl. moms`, margin + 120, y, 12, helveticaBold, primaryColor);
  y -= 20;

  // Forsikring Section
  drawSectionHeader('FORSIKRINGSFORHOLD');
  drawLabelValue('Selvrisiko:', `${demoContract.deductible_amount.toLocaleString('da-DK')} kr (momsfri)`);
  drawLabelValue('Forsikringsselskab:', demoContract.insurance_company);
  drawLabelValue('Policenummer:', demoContract.insurance_policy_number);

  // Førerforhold - NEW PAGE
  checkNewPage();
  drawSectionHeader('FØRERFORHOLD');
  drawParagraph('Bilen må kun føres af den lejer, der har tegnet lejekontrakten samt personer – over 23 år – der hører til lejers husstand, hvis disse har et gyldigt dansk kørekort, og erklærer at overholde færdselslovens bestemmelser ved deres brug af bilen. Bilen må ikke fremlejes, benyttes til motorsport, eller til person- eller godstransport mod betaling. Bilen må kun anvendes til kørsel i Danmark, hvis ikke andet er aftalt med udlejer.');

  // Betaling
  drawSectionHeader('BETALING');
  drawParagraph('Betaling sker i henhold til den aftalte betalingsplan. Ved manglende betaling fremsendes rykkerskrivelse med gebyr. Udlejer er berettiget til at ophæve lejeaftalen og tilbagetage bilen straks, såfremt lejer misligholder lejeaftalen.');

  // Vanvidskørsel
  checkNewPage();
  drawSectionHeader('VANVIDSKØRSEL', dangerColor);
  drawParagraph('Ved lejers underskrift, erklærer lejer, at lejer – og dem lejer måtte overlade bilen til, jf. ovenstående – ikke tidligere har kørt i en bil, eller vil køre i denne bil, på en måde, der kan karakteriseres som vanvidskørsel, jf. færdselslovens § 133a, herunder f.eks. ved kørsel med hastighed over 200 km/t, mere end 100% overskridelse af hastighedsgrænsen eller spirituskørsel.');
  drawParagraph('Lejer er indforstået med og accepterer, at lejer personligt kan blive pålagt det fulde erstatningsansvar ved konfiskation af bilen som følge af vanvidskørsel.');
  y -= 5;
  drawText('Erstatningsansvar ved konfiskation:', margin, y, 10, helveticaBold, dangerColor);
  drawText(`${demoContract.vanvidskorsel_liability_amount.toLocaleString('da-DK')} kr`, margin + 200, y, 11, helveticaBold, dangerColor);
  y -= 20;

  // Overholdelse af forskrifter
  drawSectionHeader('OVERHOLDELSE AF FORSKRIFTER');
  drawParagraph('Lejer er ansvarlig for, at såvel private som offentlige forskrifter, der gælder for benyttelse af køretøjet, overholdes. Dette indebærer tillige, at det påhviler lejer at betale eventuelle parkeringsafgifter, der måtte blive pålagt køretøjet. Hvis lejer forsømmer at betale eventuelt pålagte afgifter (fx standsnings- og parkeringsafgifter) vil udlejer opkræve sådanne afgifter hos lejer med tillæg af gebyrer.');

  // P-Bøder
  checkNewPage();
  drawSectionHeader('P-BØDER');
  drawParagraph('Bøderne skal betales med det samme. Ellers pålægges der ekstra gebyr og ekspeditionsgebyr oveni den oprindelige bøde. Har du mere end 2 ubetalte p-bøder, ophører samarbejdet og lejekontrakten er ikke længere gyldig.');

  // Ingen rygning
  drawSectionHeader('INGEN RYGNING');
  drawParagraph('Rygning er ikke tilladt i bilen. Overtrædes dette, vil udlejer opkræve gebyrer i overensstemmelse med gældende gebyroversigt. Lejer er oplyst om, at det sædvanligvis er særdeles omkostningsfyldt at få renset en bil, hvori der har været røget.');

  // Service og vedligeholdelse
  drawSectionHeader('SERVICE, SYN OG VEDLIGEHOLDELSE');
  drawParagraph('Lejer skal vedligeholde bilen, således at bilen til enhver tid er i god og brugbar stand og ikke udviser anden forringelse end, hvad der følger af almindeligt slid og ælde. Det er lejers ansvar, at bilen får gennemført regelmæssige services og synsgennemgange. Service, syn og reparationer af bilen, skal altid ske hos udlejer (medmindre andet er aftalt).');

  // Kaskoforsikring
  checkNewPage();
  drawSectionHeader('KASKOFORSIKRING, SKADER OG ØVRIGE UDGIFTER');
  drawParagraph('Lejer hæfter for alle skader, som ikke er eller ville være dækket af en tegnet kaskoforsikring. Bemærk: Stenslag og evt. udskift af rude er ikke inkluderet i forsikringen. Øvrige udgifter i forbindelse med uheld under udlejningen betales af lejer. Alle skader der er foretaget i lejeperioden skal oplyses til udlejer.');

  // Ophør
  drawSectionHeader('OPHØR');
  drawParagraph('Opsigelsen er løbende måned + en måned. Udlejer er berettiget til at ophæve lejeaftalen og tilbagetage bilen straks, såfremt lejer misligholder lejeaftalen. Ved lejeaftalens udløb eller dennes ophør, er lejer forpligtet til at tilbagelevere bilen på udlejers adresse. Lejer kan ikke udøve tilbageholdsret i køretøjet.');

  // Tilbagelevering
  drawSectionHeader('TILBAGELEVERING');
  drawParagraph('Tilbagelevering skal ske inden kl. 15.00 på sidste dag i din kontrakt. Overtrædelse medfører ekstra dages leje og omkostninger, hvis der er overkørte km. Bilen afleveres i rengjort og vasket stand og tømt for private effekter. Såfremt en gennemgang af bilen har påvist skader, der dækkes af bilens kaskoforsikring, er lejer forpligtet til at udfylde en skadesanmeldelse. Lejer hæfter for eventuelle konstaterede skader og mangler. Ved mangel på rengøring af køretøjet foreligger der en ekstra udgift.');
  drawParagraph('Betalt depositum refunderes 1 måned efter indlevering af bilen.');

  // Gebyroversigt
  checkNewPage();
  drawSectionHeader('GEBYROVERSIGT');
  const gebyrer = [
    ['Kopi af aftale', '100 kr pr. aftale'],
    ['Dokumentændringer', '500 kr pr. aftale'],
    ['Rykkerskrivelse', '100 kr pr. faktura'],
    ['Gebyr for mangler ved aflevering', '1.500 kr + faktiske omkostninger'],
    ['Aflevering på forkert sted', '1.500 kr + faktiske omkostninger'],
    ['Gebyr for ubetalte afgifter/bøder', '500 kr'],
    ['Rygning i køretøjet', '5.000 kr'],
    ['Udeblivelse fra værkstedstid', '500 kr'],
  ];
  
  for (const [gebyr, pris] of gebyrer) {
    checkNewPage();
    drawText(`• ${gebyr}:`, margin, y, 9, helvetica, textColor);
    drawText(pris, margin + 250, y, 9, helveticaBold, textColor);
    y -= 14;
  }

  // Tro og love erklæring
  checkNewPage();
  drawSectionHeader('TRO- OG LOVEERKLÆRING – VANVIDSKØRSEL');
  drawParagraph('Jeg erklærer på tro og love, at jeg eller dem jeg måtte overlade køretøjet til, ikke vil køre i bilen på en sådan måde, at kørslen er i strid med lov om vanvidskørsel (L127), hvorefter politiet vil være berettiget til at beslaglægge og herefter konfiskere køretøjet.');
  drawParagraph('Ved min underskrift på denne tro- og loveerklæring accepterer jeg at være fuldt erstatningsansvarlig over for ejeren af denne bil, hvis jeg eller den jeg overlader bilen til, overtræder lov om vanvidskørsel.');
  drawParagraph('Jeg anerkender ved min underskrift at være blevet orienteret om risikoen for at blive pålagt at betale en erstatningssum til sælger på det lejede køretøjs værdi i tilfælde af, at køretøjet konfiskeres af politiet, jf. lov om vanvidskørsel.');
  
  y -= 10;
  drawText('Følgende overtrædelser betragtes som vanvidskørsel:', margin, y, 10, helveticaBold, dangerColor);
  y -= 15;
  const vanvidsRules = [
    'Uagtsomt manddrab under særligt skærpende omstændigheder',
    'Særlig hensynsløs kørsel',
    'Kørsel med hastighedsoverskridelse på mere end 100% ved kørsel over 100 km/t',
    'Kørsel med en hastighed på 200 km/t eller derover',
    'Spirituskørsel med en promille over 2,00',
  ];
  for (const rule of vanvidsRules) {
    checkNewPage();
    drawText(`• ${rule}`, margin + 10, y, 9, helvetica, textColor);
    y -= 12;
  }

  // Underskrifter
  checkNewPage();
  y -= 20;
  drawSectionHeader('UNDERSKRIFTER');
  
  drawText('Udlejer:', margin, y, 10, helveticaBold, textColor);
  y -= 15;
  drawText(demoContract.lessor_name, margin, y, 10, helvetica, textColor);
  y -= 15;
  drawText('Dato: [Afventer underskrift]', margin, y, 9, helvetica, lightGray);
  y -= 30;
  drawLine(y);
  y -= 30;
  
  drawText('Lejer:', margin, y, 10, helveticaBold, textColor);
  y -= 15;
  drawText(demoContract.renter_name, margin, y, 10, helvetica, textColor);
  y -= 15;
  drawText('Dato: [Afventer underskrift]', margin, y, 9, helvetica, lightGray);
  y -= 30;
  drawLine(y);
  
  // Footer on all pages
  const pages = pdfDoc.getPages();
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    p.drawText('Genereret af LEJIO • lejio.dk', { 
      x: margin, 
      y: 30, 
      size: 8, 
      font: helvetica, 
      color: lightGray 
    });
    p.drawText(`Kontrakt: ${demoContract.contract_number} • Side ${i + 1} af ${pages.length}`, { 
      x: width - margin - 160, 
      y: 30, 
      size: 8, 
      font: helvetica, 
      color: lightGray 
    });
  }
  
  return await pdfDoc.save();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail }: DemoContractRequest = await req.json();

    console.log(`Generating and sending demo contract to: ${recipientEmail}`);

    // Check if SMTP is configured
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const fromEmail = Deno.env.get("SMTP_FROM_EMAIL") || "noreply@lejio.dk";

    if (!smtpHost || !smtpUser || !smtpPassword) {
      console.error("SMTP not configured");
      return new Response(JSON.stringify({ error: 'SMTP not configured' }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate PDF
    console.log('Generating demo contract PDF...');
    const pdfBytes = await generateDemoContractPDF();
    const pdfBase64 = btoa(String.fromCharCode(...pdfBytes));
    console.log('PDF generated successfully, size:', pdfBytes.length);

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
          <h1 style="color: #2962FF; margin: 0; font-size: 32px;">LEJIO</h1>
          <p style="color: #666; margin: 5px 0;">Danmarks bedste biludlejningsplatform</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #2962FF 0%, #448AFF 100%); color: white; padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0 0 10px 0;">Demo Lejekontrakt 📄</h2>
          <p style="margin: 0; opacity: 0.9;">Her er et eksempel på en lejekontrakt fra LEJIO</p>
        </div>

        <div style="background-color: #e3f2fd; border-left: 4px solid #2962FF; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; color: #1565c0;">
            <strong>📎 Vedhæftet: Demo Lejekontrakt</strong><br>
            Den vedhæftede PDF viser hvordan en komplet lejekontrakt ser ud i LEJIO-systemet.
          </p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Kontrakten indeholder:</h3>
          <ul style="color: #666; margin: 0; padding-left: 20px;">
            <li>Udlejer- og lejeroplysninger</li>
            <li>Køretøjsdetaljer og værdi</li>
            <li>Lejeperiode og priser</li>
            <li>Forsikringsforhold og selvrisiko</li>
            <li>Førerforhold og betingelser</li>
            <li>Vanvidskørselsklausul med erstatningsansvar</li>
            <li>P-bøder og gebyrer</li>
            <li>Tilbagelevering og afslutning</li>
            <li>Komplet gebyroversigt</li>
            <li>Tro- og loveerklæring</li>
            <li>Underskriftsfelter</li>
          </ul>
        </div>

        <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; color: #2e7d32;">
            <strong>✓ Juridisk korrekt</strong><br>
            Kontrakten er baseret på danske standardvilkår for biludlejning og indeholder alle nødvendige juridiske klausuler.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://lejio.dk" style="display: inline-block; background-color: #2962FF; color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: bold;">
            Besøg LEJIO
          </a>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
          <p>Dette er en demo-email fra LEJIO.</p>
          <p style="margin-top: 10px;">
            <a href="https://lejio.dk" style="color: #2962FF;">lejio.dk</a>
          </p>
        </div>
      </body>
      </html>
    `;

    // Create SMTP client - try port 465 with SSL
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

    // Send email with PDF attachment
    await client.send({
      from: fromEmail,
      to: recipientEmail,
      subject: 'LEJIO Demo Lejekontrakt - Eksempel på komplet kontrakt',
      content: emailHtml,
      html: emailHtml,
      attachments: [
        {
          filename: 'LEJIO-Demo-Lejekontrakt-2025-000001.pdf',
          content: pdfBase64,
          encoding: 'base64',
          contentType: 'application/pdf',
        },
      ],
    });

    console.log("Demo contract email sent to:", recipientEmail);

    await client.close();

    return new Response(JSON.stringify({ success: true, message: 'Demo contract sent successfully' }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in send-demo-contract function:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
