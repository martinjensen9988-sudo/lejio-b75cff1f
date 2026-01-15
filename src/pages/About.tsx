import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Car, Caravan, Truck, Scan, FileCheck, Shield, Wrench, RefreshCw, Leaf } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px]" />
          
          <div className="container mx-auto px-6 py-16 relative z-10">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tilbage
            </Button>
            
            <div className="max-w-4xl">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
                Om <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Lejio.dk</span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground font-medium">
                Danmarks Nye Hub for Intelligent Mobilitet
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto space-y-16">
            
            {/* Intro */}
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Lejio.dk er ikke blot en hjemmeside; det er fremtidens infrastruktur for udlejning og deling af transportmidler. Vi opererer som en dansk, hybrid markedsplads, der nedbryder barriererne mellem den private deleøkonomi og forhandlere. Ved at samle alle typer transport – fra personbiler til trailere og campingvogne – skaber vi et økosystem, hvor tilgængelighed altid vinder over ejerskab.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Vores fundament hviler på principperne om <strong className="text-foreground">Minileasing</strong> og <strong className="text-foreground">Radikal Fleksibilitet</strong>. Vi tror på, at den traditionelle 3-årige leasingkontrakt er en forældet model i en verden, hvor behov ændrer sig hurtigere end nogensinde før.
              </p>
            </div>

            {/* Unique Concept */}
            <div>
              <h2 className="font-display text-3xl font-bold mb-8">
                Det unikke Lejio-koncept: Mere end bare biler
              </h2>
              <p className="text-muted-foreground mb-8">
                Hvor andre platforme ofte begrænser sig til én kategori, er Lejio designet til at håndtere alt, hvad der ruller. Vi har skabt en platform, der favner bredden af den danske transportkultur:
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Personbiler */}
                <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Car className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">Personbiler & Minileasing</h3>
                  <p className="text-muted-foreground text-sm">
                    Vi har specialiseret os i lejeperioder på 30+ dage. Det er den perfekte løsning til dig, der står mellem to biler, har fået nyt job, eller som ønsker at teste elbil-livet af uden at binde dig økonomisk i årevis. 0 kr. i udbetaling, ingen lang binding – bare en bil, når du har brug for den.
                  </p>
                </div>

                {/* Campingvogne */}
                <div className="bg-card rounded-2xl p-6 border border-border hover:border-accent/50 transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <Caravan className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">Campingvogne – Frihed på landevejen</h3>
                  <p className="text-muted-foreground text-sm">
                    Vi gør drømmen om den frie ferie tilgængelig. Gennem Lejio kan ejere af campingvogne få dækket deres årlige omkostninger ved at udleje vognen i de uger, de ikke selv bruger den, mens lejerne får adgang til kvalitetsvogne uden de store investeringsomkostninger.
                  </p>
                </div>

                {/* Trailere */}
                <div className="bg-card rounded-2xl p-6 border border-border hover:border-mint/50 transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-mint/10 flex items-center justify-center mb-4">
                    <Truck className="w-7 h-7 text-mint" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">Trailere til ethvert behov</h3>
                  <p className="text-muted-foreground text-sm">
                    Fra den lille havetrailer til den store flyttetrailer eller den specialiserede hestetrailer. Vi gør det muligt at finde en trailer i nabolaget med få klik, fremfor at skulle køre langt til en tankstation.
                  </p>
                </div>
              </div>
            </div>

            {/* Technology Section */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 sm:p-12 border border-primary/20">
              <h2 className="font-display text-3xl font-bold mb-4">
                Teknologien bag: Lejio Vision
              </h2>
              <p className="text-muted-foreground mb-8">
                Vi ved, at den største bekymring ved udlejning er spørgsmålet om tillid og dokumentation. Derfor har vi udviklet <strong className="text-foreground">Lejio Vision</strong>, en teknologisk løsning, der fjerner det manuelle besvær og de juridiske gråzoner.
              </p>

              <div className="grid sm:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Scan className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold">Intelligent Nummerplade-scanning</h4>
                  <p className="text-sm text-muted-foreground">
                    Vores app verificerer automatisk køretøjet ved hjælp af OCR-teknologi. Dette sikrer, at lejekontrakten altid er bundet til det korrekte stelnummer og de korrekte forsikringsdata.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                    <FileCheck className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="font-bold">AI Dashboard-analyse</h4>
                  <p className="text-sm text-muted-foreground">
                    Ved at tage et enkelt billede af instrumentbrættet kan vores kunstige intelligens øjeblikkeligt aflæse kilometerstand og brændstofniveau. Dataene overføres direkte til lejekontrakten.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-mint/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-mint" />
                  </div>
                  <h4 className="font-bold">Digital Bevissikring</h4>
                  <p className="text-sm text-muted-foreground">
                    Alle billeder gemmes med tidsstempel og GPS-koordinater, hvilket fungerer som en uomtvistelig dokumentation for begge parter.
                  </p>
                </div>
              </div>
            </div>

            {/* For Dealers */}
            <div>
              <h2 className="font-display text-3xl font-bold mb-4">
                Professionel Flådestyring for Forhandlere
              </h2>
              <p className="text-muted-foreground mb-8">
                For forhandlere fungerer Lejio som et komplet Operating System. Vi leverer de værktøjer, der kræves for at skalere en moderne udlejningsforretning:
              </p>

              <div className="grid sm:grid-cols-3 gap-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Automatiseret Jura</h4>
                    <p className="text-sm text-muted-foreground">
                      Vi genererer dynamiske, juridisk validerede lejekontrakter, der underskrives digitalt med MitID/NemID-validering af parterne.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                    <Wrench className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Service- & Vedligeholdelsesmodul</h4>
                    <p className="text-sm text-muted-foreground">
                      Systemet holder automatisk styr på køretøjernes sundhed inkl. påmindelser om syn, serviceintervaller og dækskift.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Smart Byttebil-funktion</h4>
                    <p className="text-sm text-muted-foreground">
                      Med ét klik kan du overføre alle lejerens data, depositum og kontraktdetaljer til et nyt køretøj ved service eller nedbrud.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-card rounded-3xl p-8 sm:p-12 border border-border text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display text-3xl font-bold mb-4">
                Vores Vision for Fremtiden
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Hos Lejio.dk ser vi ind i en fremtid, hvor mobilitet er en service fremfor et aktiv. Vi ønsker at reducere antallet af biler, der holder stille i de danske indkørsler, ved at gøre det attraktivt og sikkert at dele dem.
              </p>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Hver gang en trailer eller en bil bliver delt på Lejio, optimerer vi udnyttelsen af planetens ressourcer. Vi skaber økonomisk værdi for ejeren og mobilitetsfrihed for lejeren.
              </p>
              <p className="text-xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Lejio.dk – Frihed uden binding, drevet af intelligent teknologi.
              </p>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/search')}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
              >
                Udforsk køretøjer
              </Button>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
