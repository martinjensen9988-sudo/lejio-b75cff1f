import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-foreground mb-8">Handelsbetingelser</h1>
          
          <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
            <p className="text-lg">
              Disse handelsbetingelser ("Betingelser") gælder for brugen af LEJIO's platform lejio.dk 
              og udgør en bindende aftale mellem dig og LEJIO.
            </p>
            
            <p className="text-sm text-muted-foreground">
              Sidst opdateret: {new Date().toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mt-8 mb-4">1. Om LEJIO</h2>
              <p>
                LEJIO er en online platform, der forbinder lejere med private og professionelle udlejere 
                af køretøjer. LEJIO fungerer som formidler og er ikke part i lejeaftalen mellem lejer og udlejer.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>LEJIO</li>
                <li>E-mail: hej@lejio.dk</li>
                <li>Web: lejio.dk</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mt-8 mb-4">2. Definitioner</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>"Platformen":</strong> LEJIO's hjemmeside og tilhørende services på lejio.dk</li>
                <li><strong>"Udlejer":</strong> En privatperson eller virksomhed, der udlejer køretøjer via Platformen</li>
                <li><strong>"Lejer":</strong> En person, der lejer et køretøj via Platformen</li>
                <li><strong>"Bruger":</strong> Enhver person, der anvender Platformen (lejere og udlejere)</li>
                <li><strong>"Booking":</strong> En reservation af et køretøj via Platformen</li>
                <li><strong>"Lejekontrakt":</strong> Den juridisk bindende aftale mellem lejer og udlejer</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mt-8 mb-4">3. Registrering og brugerkonto</h2>
              <h3 className="font-display text-xl font-medium text-foreground mt-6 mb-3">3.1 Oprettelse af konto</h3>
              <p>
                For at bruge Platformen skal du oprette en brugerkonto med korrekte og opdaterede oplysninger. 
                Du er ansvarlig for at holde dine kontooplysninger og adgangskode fortrolige.
              </p>

              <h3 className="font-display text-xl font-medium text-foreground mt-6 mb-3">3.2 Krav til udlejere</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Skal være fyldt 18 år</li>
                <li>Skal have gyldigt kørekort</li>
                <li>Skal have gyldig ansvarsforsikring på køretøjet</li>
                <li>Professionelle udlejere skal have gyldigt CVR-nummer</li>
              </ul>

              <h3 className="font-display text-xl font-medium text-foreground mt-6 mb-3">3.3 Krav til lejere</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Skal være fyldt 21 år (kan variere afhængigt af udlejers krav)</li>
                <li>Skal have gyldigt kørekort i mindst 2 år</li>
                <li>Skal kunne fremvise gyldig legitimation</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mt-8 mb-4">4. Udlejers forpligtelser</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sikre at køretøjet er lovligt, forsikret og i sikker stand</li>
                <li>Give korrekte og fyldestgørende oplysninger om køretøjet</li>
                <li>Stille køretøjet til rådighed som aftalt</li>
                <li>Have gyldig ansvarsforsikring og kaskoforsikring</li>
                <li>Overholde alle gældende love og regler for udlejning</li>
                <li>Behandle lejers personoplysninger fortroligt</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mt-8 mb-4">5. Lejers forpligtelser</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Behandle køretøjet med omhu og forsvarligt</li>
                <li>Kun bruge køretøjet til lovlige formål</li>
                <li>Returnere køretøjet i samme stand som ved modtagelse</li>
                <li>Overholde alle færdselsregler</li>
                <li>Straks meddele udlejer om skader eller uheld</li>
                <li>Betale for brændstof, bøder og afgifter pådraget i lejeperioden</li>
                <li>Ikke videreleje eller udlåne køretøjet til tredjemand</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mt-8 mb-4">6. Vanvidskørsel og ansvar</h2>
              <p>
                Lejer accepterer ved indgåelse af lejekontrakten fuldt økonomisk ansvar for køretøjets værdi i 
                tilfælde af skade forårsaget af vanvidskørsel eller groft uagtsom kørsel.
              </p>
              <p className="mt-4">
                Dette ansvar gælder uanset forsikringsdækning og kan omfatte køretøjets fulde genanskaffelsesværdi.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mt-8 mb-4">7. Booking og betaling</h2>
              <h3 className="font-display text-xl font-medium text-foreground mt-6 mb-3">7.1 Booking</h3>
              <p>
                En booking er først bindende, når begge parter har underskrevet lejekontrakten digitalt, og 
                eventuel betaling er gennemført.
              </p>

              <h3 className="font-display text-xl font-medium text-foreground mt-6 mb-3">7.2 Betalingsmetoder</h3>
              <p>
                Betalingen håndteres direkte mellem lejer og udlejer via udlejers valgte betalingsmetode 
                (kort, bankoverførsel, MobilePay eller kontant).
              </p>

              <h3 className="font-display text-xl font-medium text-foreground mt-6 mb-3">7.3 Depositum</h3>
              <p>
                Udlejer kan kræve depositum som sikkerhed. Depositum tilbagebetales efter returneringen, 
                fratrukket eventuelle omkostninger til skader, manglende brændstof eller andre udeståender.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mt-8 mb-4">8. Priser og gebyrer</h2>
              <h3 className="font-display text-xl font-medium text-foreground mt-6 mb-3">8.1 Private udlejere</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gratis at oprette profil og køretøjer</li>
                <li>49 kr pr. gennemført booking</li>
              </ul>

              <h3 className="font-display text-xl font-medium text-foreground mt-6 mb-3">8.2 Pro Partner (CVR)</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>299 kr/måned for 1-5 køretøjer</li>
                <li>499 kr/måned for 6-15 køretøjer</li>
                <li>799 kr/måned for 16+ køretøjer</li>
                <li>14 dages gratis prøveperiode</li>
              </ul>

              <h3 className="font-display text-xl font-medium text-foreground mt-6 mb-3">8.3 LEJIO Varetager</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>LEJIO Varetager: 15% kommission</li>
                <li>LEJIO Varetager Pro: 10% kommission</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mt-8 mb-4">9. Afbestilling</h2>
              <h3 className="font-display text-xl font-medium text-foreground mt-6 mb-3">9.1 Lejers afbestilling</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Mere end 48 timer før: Fuld refundering (ekskl. eventuelle gebyrer)</li>
                <li>24-48 timer før: 50% refundering</li>
                <li>Mindre end 24 timer før: Ingen refundering</li>
              </ul>

              <h3 className="font-display text-xl font-medium text-foreground mt-6 mb-3">9.2 Udlejers afbestilling</h3>
              <p>
                Udlejer bør undgå at aflyse bekræftede bookinger. Gentagne aflysninger kan medføre 
                suspension fra platformen.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mt-8 mb-4">10. Forsikring</h2>
              <p>
                Udlejer er ansvarlig for at køretøjet er forsikret med minimum lovpligtig ansvarsforsikring. 
                LEJIO formidler ikke forsikring og er ikke ansvarlig for forsikringsdækning.
              </p>
              <p className="mt-4">
                Lejer anbefales at tegne egen rejseforsikring og evt. supplerende forsikring.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mt-8 mb-4">11. Advarselssystem</h2>
              <p>
                LEJIO driver et advarselssystem, hvor udlejere kan registrere problematiske lejere. 
                Advarsler kan udstedes ved:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Skader på køretøj</li>
                <li>Manglende betaling</li>
                <li>Kontraktbrud</li>
                <li>Svindel eller misbrug</li>
                <li>Vanvidskørsel</li>
                <li>Sen returnering</li>
              </ul>
              <p className="mt-4">
                Lejere kan klage over advarsler, og LEJIO's administration behandler alle klager.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mt-8 mb-4">12. LEJIO's ansvar</h2>
              <p>
                LEJIO er en formidlingsplatform og er ikke part i lejeaftalen mellem lejer og udlejer. 
                LEJIO er derfor ikke ansvarlig for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Køretøjets stand eller egnethed</li>
                <li>Skader eller tab i forbindelse med udlejningen</li>
                <li>Brugernes opfyldelse af deres forpligtelser</li>
                <li>Tvister mellem lejer og udlejer</li>
              </ul>
              <p className="mt-4">
                LEJIO's ansvar er under alle omstændigheder begrænset til de gebyrer, der er betalt til 
                LEJIO i de seneste 12 måneder.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mt-8 mb-4">13. Kontosuspension og udelukkelse</h2>
              <p>LEJIO kan suspendere eller lukke en brugerkonto ved:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Overtrædelse af disse betingelser</li>
                <li>Svigagtig eller ulovlig adfærd</li>
                <li>Gentagne klager fra andre brugere</li>
                <li>Manglende betaling af gebyrer</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mt-8 mb-4">14. Ændringer af betingelser</h2>
              <p>
                LEJIO kan ændre disse betingelser med 30 dages varsel. Fortsat brug af platformen efter 
                ændringer udgør accept af de nye betingelser.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mt-8 mb-4">15. Tvistløsning</h2>
              <p>
                Eventuelle tvister skal forsøges løst ved forhandling. Hvis dette ikke lykkes, afgøres 
                tvisten ved de danske domstole efter dansk ret.
              </p>
              <p className="mt-4">
                Du kan også klage til Forbrugerklagenævnet:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Forbrugerklagenævnet</li>
                <li>Carl Jacobsens Vej 35</li>
                <li>2500 Valby</li>
                <li>www.forbrug.dk</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground mt-8 mb-4">16. Kontakt</h2>
              <p>
                Har du spørgsmål til disse handelsbetingelser, er du velkommen til at kontakte os:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>E-mail: hej@lejio.dk</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
