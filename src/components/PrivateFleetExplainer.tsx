import { Car, Camera, FileCheck, CreditCard, Shield, Phone, Calendar, CheckCircle2, Sparkles, ArrowRight, Clock, Users, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PrivateFleetExplainer = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "1",
      icon: Car,
      title: "Tilmeld din bil",
      description: "Upload billeder og oplysninger om dit køretøj. Vi laver en professionel annonce der tiltrækker lejere.",
      details: [
        "Indtast registreringsnummer – vi henter automatisk bildata",
        "Upload mindst 6 billeder af bilen",
        "Angiv tilgængelighed og ønsket dagspris",
        "Vi optimerer prisen baseret på markedet"
      ],
      color: "mint"
    },
    {
      number: "2",
      icon: Users,
      title: "Vi finder lejere",
      description: "LEJIO markedsfører din bil og håndterer alle henvendelser fra potentielle lejere.",
      details: [
        "Din bil vises på LEJIO's platform",
        "Vi besvarer alle spørgsmål fra interesserede",
        "Screening af lejere – kørekort verificeres",
        "Du godkender eller afviser bookinger i app'en"
      ],
      color: "accent"
    },
    {
      number: "3",
      icon: FileCheck,
      title: "Kontrakt & forsikring",
      description: "Vi genererer automatisk lejekontrakt med alle juridiske detaljer og sikrer korrekt forsikringsdækning.",
      details: [
        "Professionel lejekontrakt genereres automatisk",
        "Lejers kørekort og ID verificeres",
        "Selvrisiko og ansvar er klart defineret",
        "Digital underskrift fra begge parter"
      ],
      color: "primary"
    },
    {
      number: "4",
      icon: Camera,
      title: "Check-in & check-ud",
      description: "Ved afhentning og aflevering dokumenterer vi bilens stand med fotos og AI-analyse.",
      details: [
        "360° fotodokumentation af bilen",
        "AI scanner for ridser og skader",
        "Kilometertæller og brændstofniveau registreres",
        "Tidsstemplet rapport gemmes som bevis"
      ],
      color: "lavender"
    },
    {
      number: "5",
      icon: CreditCard,
      title: "Betaling & udbetaling",
      description: "Vi opkræver betaling fra lejer og overfører dit beløb direkte til din konto.",
      details: [
        "Lejer betaler ved booking",
        "Vi tilbageholder 30% til LEJIO",
        "Du modtager 70% af lejeindtægten",
        "Udbetaling hver 14. dag til din bankkonto"
      ],
      color: "secondary"
    },
    {
      number: "6",
      icon: Shield,
      title: "Skadeshåndtering",
      description: "Hvis uheldet er ude, håndterer vi hele processen med lejer og forsikring.",
      details: [
        "Skader opdages ved check-ud scanning",
        "Vi opkræver selvrisiko fra lejer",
        "Forsikringssag oprettes om nødvendigt",
        "Du skal ikke løfte en finger"
      ],
      color: "mint"
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Spar tid",
      description: "Ingen mails, opkald eller koordinering. Vi klarer alt."
    },
    {
      icon: Shield,
      title: "Tryg udlejning",
      description: "Professionel kontrakt, ID-verifikation og skadesdokumentation."
    },
    {
      icon: CreditCard,
      title: "Sikker betaling",
      description: "Vi opkræver og udbetaler – ingen risiko for manglende betaling."
    },
    {
      icon: Wrench,
      title: "Support 24/7",
      description: "Lejere kontakter os – ikke dig – ved spørgsmål."
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
      mint: { bg: "bg-mint/10", border: "border-mint/30", icon: "text-mint", badge: "bg-mint/20" },
      accent: { bg: "bg-accent/10", border: "border-accent/30", icon: "text-accent", badge: "bg-accent/20" },
      primary: { bg: "bg-primary/10", border: "border-primary/30", icon: "text-primary", badge: "bg-primary/20" },
      lavender: { bg: "bg-lavender/10", border: "border-lavender/30", icon: "text-lavender", badge: "bg-lavender/20" },
      secondary: { bg: "bg-secondary/10", border: "border-secondary/30", icon: "text-secondary", badge: "bg-secondary/20" },
    };
    return colors[color] || colors.primary;
  };

  return (
    <section id="private-fleet" className="py-24 relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
      {/* Background decorations */}
      <div className="absolute top-40 left-10 w-96 h-96 bg-mint/5 blob animate-blob" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-accent/5 blob-2 animate-blob" style={{ animationDelay: '3s' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-mint/20 to-accent/20 border border-mint/30 mb-6">
            <Sparkles className="w-4 h-4 text-mint" />
            <span className="text-sm font-medium">Nyt: Privat Fleet</span>
          </div>
          
          <h2 className="font-display text-4xl sm:text-5xl font-black mb-4">
            Lad os <span className="text-gradient-warm">tjene penge</span> for dig
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Du ejer bilen – vi klarer resten. LEJIO håndterer alt fra markedsføring til betaling, 
            så du kan læne dig tilbage og se pengene tikke ind.
          </p>
          
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-mint/30 to-accent/30 border-2 border-mint/50">
            <div className="text-left">
              <p className="text-3xl font-black text-foreground">70%</p>
              <p className="text-sm text-muted-foreground">til dig</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-left">
              <p className="text-3xl font-black text-mint">30%</p>
              <p className="text-sm text-muted-foreground">til LEJIO</p>
            </div>
          </div>
        </div>

        {/* Step-by-step process */}
        <div className="mb-20">
          <h3 className="font-display text-2xl font-bold text-center mb-12">
            Sådan fungerer det – trin for trin
          </h3>
          
          <div className="space-y-8 max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const colors = getColorClasses(step.color);
              const Icon = step.icon;
              
              return (
                <div 
                  key={index}
                  className={`rounded-3xl ${colors.bg} border-2 ${colors.border} p-6 sm:p-8 animate-scale-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Step number and icon */}
                    <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
                      <div className={`w-14 h-14 rounded-2xl ${colors.badge} flex items-center justify-center`}>
                        <span className="font-display text-2xl font-black">{step.number}</span>
                      </div>
                      <div className={`w-12 h-12 rounded-xl ${colors.badge} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${colors.icon}`} />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="font-display text-xl font-bold mb-2">{step.title}</h4>
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      
                      <div className="grid sm:grid-cols-2 gap-2">
                        {step.details.map((detail, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle2 className={`w-4 h-4 mt-0.5 ${colors.icon} flex-shrink-0`} />
                            <span className="text-sm text-muted-foreground">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits grid */}
        <div className="mb-16">
          <h3 className="font-display text-2xl font-bold text-center mb-8">
            Hvorfor vælge Privat Fleet?
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={index}
                  className="rounded-2xl bg-card border border-border p-6 text-center hover:shadow-lg transition-all animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-mint/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-mint" />
                  </div>
                  <h4 className="font-display font-bold mb-2">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Example calculation */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="rounded-3xl bg-gradient-to-br from-mint/20 to-accent/10 border-2 border-mint/30 p-8">
            <h3 className="font-display text-xl font-bold text-center mb-6">
              💰 Eksempel: Hvad kan du tjene?
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-muted-foreground">Din bil udlejes for</span>
                <span className="font-bold">450 kr/dag</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-muted-foreground">Udlejet 10 dage om måneden</span>
                <span className="font-bold">4.500 kr</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-muted-foreground">LEJIO's andel (30%)</span>
                <span className="text-muted-foreground">-1.350 kr</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-mint/10 rounded-xl px-4 -mx-4">
                <span className="font-bold text-lg">Din indtjening</span>
                <span className="font-display text-2xl font-black text-mint">3.150 kr/md</span>
              </div>
            </div>
            
            <p className="text-center text-sm text-muted-foreground mt-6">
              * Uden at løfte en finger. Vi klarer alt arbejdet.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-16">
          <h3 className="font-display text-2xl font-bold text-center mb-8">
            Ofte stillede spørgsmål
          </h3>
          
          <div className="space-y-4">
            {[
              {
                q: "Hvem står for forsikringen?",
                a: "Din bil er dækket af din egen forsikring. Lejeren accepterer i kontrakten at dække selvrisiko ved skader. Vi sørger for at alle lejere er over 21 år og har gyldigt kørekort."
              },
              {
                q: "Hvordan får jeg mine penge?",
                a: "Vi udbetaler til din bankkonto hver 14. dag. Du kan følge alle bookinger og indtjening i din LEJIO-app i realtid."
              },
              {
                q: "Hvad hvis bilen bliver skadet?",
                a: "Vores check-in/check-ud system dokumenterer bilens stand med fotos og AI-scanning. Ved skader opkræver vi selvrisiko fra lejer og hjælper med forsikringssag om nødvendigt."
              },
              {
                q: "Kan jeg selv bestemme hvornår bilen er tilgængelig?",
                a: "Ja! Du styrer selv tilgængeligheden i kalenderen. Du kan også godkende eller afvise hver enkelt booking."
              },
              {
                q: "Hvad koster det at komme i gang?",
                a: "Ingenting! Der er ingen opstartsgebyr. Vi tager kun 30% af den faktiske omsætning, når din bil udlejes."
              },
              {
                q: "Hvordan afleverer lejeren nøglerne?",
                a: "Det aftaler I selv – enten personlig overdragelse eller via nøgleboks. Vi guider jer gennem processen."
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <h4 className="font-bold mb-2">{faq.q}</h4>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 rounded-3xl bg-gradient-to-r from-mint/20 to-accent/20 border-2 border-mint/40">
            <div className="text-center sm:text-left">
              <h3 className="font-display text-2xl font-black mb-2">Klar til at tjene penge på din bil?</h3>
              <p className="text-muted-foreground">Opret profil og tilmeld din bil på under 5 minutter.</p>
            </div>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-mint to-accent hover:opacity-90 text-white font-bold px-8"
              onClick={() => navigate('/auth')}
            >
              Kom i gang nu
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivateFleetExplainer;
