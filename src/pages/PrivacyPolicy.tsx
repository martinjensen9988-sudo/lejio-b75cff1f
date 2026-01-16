import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Shield, Lock } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Bold geometric background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-mint/20 via-background to-primary/10" />
            <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-mint rounded-full blur-[100px] opacity-15 animate-float-slow" />
            <div className="absolute top-1/4 -right-32 w-[400px] h-[400px] bg-primary rounded-full blur-[80px] opacity-20 animate-float" />
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }} />
          </div>
          
          <div className="container mx-auto px-6 py-16 relative z-10">
            <div className="max-w-4xl animate-slide-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/20 border border-mint/40 text-sm font-bold text-foreground mb-6">
                <Lock className="w-4 h-4 text-mint" />
                <span>Databeskyttelse</span>
              </div>
              
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.9] mb-6">
                <span className="block bg-gradient-to-r from-mint via-primary to-accent bg-clip-text text-transparent py-2">
                  Privatlivspolitik
                </span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Sidst opdateret: {new Date().toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </section>
        
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-[2rem] border-2 border-border p-8 sm:p-12 shadow-xl">
              <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
                <p className="text-lg">
                  Denne privatlivspolitik beskriver, hvordan LEJIO ("vi", "os" eller "vores") indsamler, bruger og beskytter dine personoplysninger, når du bruger vores platform lejio.dk.
                </p>

                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">1. Dataansvarlig</h2>
                  <p>
                    LEJIO er dataansvarlig for behandlingen af dine personoplysninger. Du kan kontakte os på:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>E-mail: hej@lejio.dk</li>
                    <li>Adresse: Danmark</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">2. Hvilke oplysninger indsamler vi?</h2>
                  <p>Vi indsamler følgende typer af personoplysninger:</p>
                  
                  <h3 className="font-display text-xl font-medium text-foreground mt-6 mb-3">Oplysninger du giver os</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Kontaktoplysninger: Navn, e-mailadresse, telefonnummer, adresse</li>
                    <li>Identifikationsoplysninger: Kørekortnummer, fødselsdato</li>
                    <li>Virksomhedsoplysninger: CVR-nummer, firmanavn (for forhandlere)</li>
                    <li>Betalingsoplysninger: Bankkontonummer, MobilePay-nummer</li>
                    <li>Køretøjsoplysninger: Registreringsnummer, mærke, model</li>
                  </ul>

                  <h3 className="font-display text-xl font-medium text-foreground mt-6 mb-3">Oplysninger vi indsamler automatisk</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Tekniske data: IP-adresse, browsertype, enhedstype</li>
                    <li>Brugsdata: Sidevisninger, klik, søgninger på platformen</li>
                    <li>Cookies og lignende teknologier</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">3. Formål med behandlingen</h2>
                  <p>Vi behandler dine personoplysninger til følgende formål:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>At facilitere udlejning af køretøjer mellem lejere og udlejere</li>
                    <li>At oprette og administrere din brugerkonto</li>
                    <li>At generere juridisk bindende lejekontrakter</li>
                    <li>At behandle betalinger og udstede fakturaer</li>
                    <li>At kommunikere med dig om dine bookinger og vores service</li>
                    <li>At forbedre vores platform og brugeroplevelse</li>
                    <li>At overholde lovgivning, herunder bogføringsloven</li>
                    <li>At beskytte mod svindel og misbrug via vores advarselssystem</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">4. Retsgrundlag</h2>
                  <p>Vi behandler dine personoplysninger på følgende retsgrundlag:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Kontraktopfyldelse:</strong> Behandlingen er nødvendig for at opfylde vores aftale med dig</li>
                    <li><strong>Retlig forpligtelse:</strong> Vi er forpligtet til at opbevare visse oplysninger iht. bogføringsloven</li>
                    <li><strong>Legitime interesser:</strong> Vi har en legitim interesse i at forebygge svindel og forbedre vores service</li>
                    <li><strong>Samtykke:</strong> Til markedsføring indhenter vi dit samtykke</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">5. Deling af oplysninger</h2>
                  <p>Vi deler dine personoplysninger med:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Lejere/Udlejere:</strong> Nødvendige oplysninger for at gennemføre en udlejning</li>
                    <li><strong>Betalingsudbydere:</strong> Stripe, Quickpay, PensoPay, Reepay eller OnPay (afhængig af udlejers valg)</li>
                    <li><strong>IT-leverandører:</strong> Hosting og tekniske services</li>
                    <li><strong>Myndigheder:</strong> Når vi er retligt forpligtet hertil</li>
                  </ul>
                  <p className="mt-4">
                    Vi sælger aldrig dine personoplysninger til tredjeparter til markedsføringsformål.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">6. Advarselssystem</h2>
                  <p>
                    LEJIO driver et advarselssystem, der giver udlejere mulighed for at registrere problematiske lejere 
                    (f.eks. ved skader, manglende betaling eller kontraktbrud). Disse advarsler er tilgængelige for 
                    andre udlejere på platformen i op til 5 år.
                  </p>
                  <p className="mt-4">
                    Hvis du modtager en advarsel, vil du blive informeret via e-mail og have mulighed for at klage. 
                    Klager behandles af LEJIO's administration.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">7. Opbevaringsperiode</h2>
                  <p>Vi opbevarer dine personoplysninger så længe det er nødvendigt:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Kontooplysninger: Så længe din konto er aktiv, plus 3 år efter lukning</li>
                    <li>Bookingdata og kontrakter: 5 år iht. bogføringsloven</li>
                    <li>Advarsler i advarselssystemet: Op til 5 år</li>
                    <li>Betalingsoplysninger: 5 år iht. bogføringsloven</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">8. Dine rettigheder</h2>
                  <p>Du har følgende rettigheder i henhold til GDPR:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Ret til indsigt:</strong> Du kan anmode om en kopi af dine personoplysninger</li>
                    <li><strong>Ret til berigtigelse:</strong> Du kan få rettet urigtige oplysninger</li>
                    <li><strong>Ret til sletning:</strong> Du kan anmode om sletning af dine oplysninger (med forbehold for lovkrav)</li>
                    <li><strong>Ret til begrænsning:</strong> Du kan anmode om begrænsning af behandlingen</li>
                    <li><strong>Ret til dataportabilitet:</strong> Du kan få udleveret dine data i et struktureret format</li>
                    <li><strong>Ret til indsigelse:</strong> Du kan gøre indsigelse mod visse former for behandling</li>
                  </ul>
                  <p className="mt-4">
                    For at udøve dine rettigheder, kontakt os på hej@lejio.dk.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">9. Cookies</h2>
                  <p>
                    Vi bruger cookies til at forbedre din oplevelse på vores platform. Cookies hjælper os med at 
                    huske dine præferencer og analysere brugen af platformen.
                  </p>
                  <p className="mt-4">
                    Du kan administrere dine cookie-præferencer i din browsers indstillinger.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">10. Sikkerhed</h2>
                  <p>
                    Vi anvender passende tekniske og organisatoriske sikkerhedsforanstaltninger for at beskytte 
                    dine personoplysninger mod uautoriseret adgang, ændring, videregivelse eller sletning.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">11. Ændringer til denne politik</h2>
                  <p>
                    Vi kan opdatere denne privatlivspolitik fra tid til anden. Ved væsentlige ændringer vil vi 
                    informere dig via e-mail eller en notifikation på platformen.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">12. Klage til Datatilsynet</h2>
                  <p>
                    Hvis du er utilfreds med vores behandling af dine personoplysninger, kan du indgive en klage 
                    til Datatilsynet:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Datatilsynet</li>
                    <li>Carl Jacobsens Vej 35</li>
                    <li>2500 Valby</li>
                    <li>Telefon: 33 19 32 00</li>
                    <li>E-mail: dt@datatilsynet.dk</li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;