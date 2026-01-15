import { Car, Camera, FileCheck, CreditCard, Shield, Phone, Calendar, CheckCircle2, Sparkles, ArrowRight, Clock, Users, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PrivateFleetExplainer = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "1",
      icon: Car,
      title: "Kontakt os",
      description: "Fortæl os om dit køretøj. Vi vurderer bilen og laver en aftale.",
      details: [
        "Kontakt LEJIO via telefon, mail eller formular",
        "Vi vurderer bilen og fastsætter månedsprisen",
        "Du sørger for forsikring der dækker udlejning",
        "Vi udarbejder en samarbejdsaftale"
      ],
      color: "mint"
    },
    {
      number: "2",
      icon: Car,
      title: "Aflever bilen til os",
      description: "Du afleverer bilen til LEJIO – herefter tager vi os af absolut alt.",
      details: [
        "Aflever bilen på vores adresse",
        "Vi tager professionelle billeder af bilen",
        "Vi dokumenterer bilens stand grundigt",
        "Bilen opbevares sikkert hos os"
      ],
      color: "accent"
    },
    {
      number: "3",
      icon: Users,
      title: "Vi opretter annoncen",
      description: "LEJIO sætter prisen, tager billeder og opretter en professionel annonce.",
      details: [
        "Vi fastsætter den optimale månedspris",
        "Professionelle billeder og beskrivelse",
        "Din bil udbydes som abonnement (min. 30 dage)",
        "Annoncen vises på LEJIO's platform"
      ],
      color: "primary"
    },
    {
      number: "4",
      icon: Calendar,
      title: "Vi finder abonnenter",
      description: "Bilen udlejes kun på abonnement – minimum 30 dage ad gangen.",
      details: [
        "Vi screener og verificerer alle lejere",
        "Håndtering af alle spørgsmål og bookinger",
        "Lejer tegner abonnement – ikke dagsleje",
        "Stabil indtægt måned efter måned"
      ],
      color: "lavender"
    },
    {
      number: "5",
      icon: FileCheck,
      title: "Kontrakt & udlevering",
      description: "Vi håndterer kontrakt, check-in og udlevering af bilen til lejeren.",
      details: [
        "Abonnementskontrakt genereres af os",
        "Lejers kørekort og ID verificeres",
        "Grundig check-in med fotodokumentation",
        "Nøgler udleveres af LEJIO"
      ],
      color: "secondary"
    },
    {
      number: "6",
      icon: CreditCard,
      title: "Månedlig udbetaling",
      description: "Lejeren betaler månedligt, og vi overfører din andel til dig.",
      details: [
        "Lejer betaler abonnement hver måned",
        "Vi tilbageholder 30% til LEJIO",
        "Du modtager 70% af lejeindtægten",
        "Fast udbetaling hver måned"
      ],
      color: "mint"
    },
    {
      number: "7",
      icon: Shield,
      title: "Skadeshåndtering",
      description: "Hvis uheldet er ude, håndterer vi hele processen med lejer.",
      details: [
        "Regelmæssig inspektion af bilen",
        "Vi opkræver selvrisiko fra lejer ved skader",
        "Du kontaktes kun ved større skader",
        "Du skal ikke løfte en finger"
      ],
      color: "accent"
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

        {/* Pricing by car size */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="font-display text-2xl font-bold text-center mb-8">
            💰 Hvad kan du tjene?
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { size: "Lille bil", example: "Aygo, Up, i10", price: 3500, icon: "🚗" },
              { size: "Mellem bil", example: "Golf, Ceed, Focus", price: 4500, icon: "🚙" },
              { size: "Stor bil", example: "Passat, Mondeo, A4", price: 5500, icon: "🚘" },
              { size: "SUV", example: "Tiguan, Tucson, Q5", price: 6000, icon: "🚐" },
            ].map((tier, index) => {
              const yourShare = Math.round(tier.price * 0.7);
              return (
                <div 
                  key={index}
                  className="rounded-2xl bg-gradient-to-br from-mint/10 to-accent/5 border border-mint/30 p-5 text-center"
                >
                  <span className="text-3xl mb-2 block">{tier.icon}</span>
                  <h4 className="font-bold text-lg mb-1">{tier.size}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{tier.example}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Abonnement</span>
                      <span className="font-medium">{tier.price.toLocaleString('da-DK')} kr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">LEJIO (30%)</span>
                      <span className="text-muted-foreground">-{Math.round(tier.price * 0.3).toLocaleString('da-DK')} kr</span>
                    </div>
                    <div className="pt-2 border-t border-border/50">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Du får</span>
                        <span className="font-display text-xl font-black text-mint">{yourShare.toLocaleString('da-DK')} kr</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">pr. måned</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-6 p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              ⚠️ <strong>Bemærk:</strong> Priserne er vejledende. Den faktiske pris kan være <strong>højere eller lavere</strong> afhængigt af bilens stand, årgang, kilometertal og udstyr.
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
                q: "Hvordan fungerer det i praksis?",
                a: "Du afleverer din bil til os, og vi tager os af absolut alt derefter. Vi tager billeder, sætter prisen, opretter annonce, finder abonnenter, håndterer kontrakter og betaling. Du behøver ikke gøre noget."
              },
              {
                q: "Hvad betyder abonnement?",
                a: "Bilen udlejes kun på abonnement med minimum 30 dages binding. Det giver dig stabil indtægt og mindre slid på bilen sammenlignet med korttidsudlejning."
              },
              {
                q: "Hvem sætter prisen?",
                a: "Det gør vi. LEJIO fastsætter den optimale månedspris baseret på bilens stand, model og markedet. Vi sørger for at maksimere din indtjening."
              },
              {
                q: "Hvem står for forsikringen?",
                a: "Du står selv for forsikringen af din bil – det er dit ansvar som ejer. Sørg for at din bilforsikring dækker udlejning til tredjemand."
              },
              {
                q: "Hvor afleverer jeg bilen?",
                a: "Du afleverer bilen på vores adresse. Vi tager professionelle billeder og dokumenterer bilens stand. Herefter står vi for alt."
              },
              {
                q: "Hvordan får jeg mine penge?",
                a: "Lejer betaler abonnement hver måned. Vi udbetaler din andel (70%) til din bankkonto månedligt."
              },
              {
                q: "Kan jeg få bilen tilbage?",
                a: "Ja! Giv os besked i god tid (typisk 30 dage), så sørger vi for at bilen er klar til afhentning når nuværende abonnement udløber."
              },
              {
                q: "Hvad koster det at komme i gang?",
                a: "Ingenting! Der er ingen opstartsgebyr. Vi tager kun 30% af abonnementsindtægten."
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
