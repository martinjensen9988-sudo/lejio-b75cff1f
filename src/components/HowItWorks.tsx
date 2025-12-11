import { Settings, Globe, Zap, CheckCircle2 } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Opret din profil",
    icon: Settings,
    description: "Tilføj dine biler, priser og forsikringsoplysninger. Forbind din betalingsløsning (Quickpay, PensoPay, Stripe el. lign.).",
  },
  {
    step: 2,
    title: "Del din side",
    icon: Globe,
    description: "Få din egen professionelle bookingside. Del linket på sociale medier, din hjemmeside eller via annoncer.",
  },
  {
    step: 3,
    title: "Modtag bookinger",
    icon: Zap,
    description: "Kunder booker direkte. Pengene går til din konto. Kontrakten genereres automatisk med alle juridiske detaljer.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative bg-card/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,hsl(174_72%_56%/0.06),transparent_50%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Kom i gang på <span className="text-gradient">3 minutter</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ingen kompleks opsætning. Ingen lange kontrakter. Brug dit eksisterende setup.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent md:-translate-x-px" />

            {steps.map((step, i) => (
              <div
                key={i}
                className={`relative flex items-start gap-6 md:gap-0 mb-16 last:mb-0 animate-slide-up ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {/* Content */}
                <div className={`flex-1 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="inline-block p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all">
                    <div className={`flex items-center gap-3 mb-4 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className={i % 2 === 0 ? 'md:text-right' : ''}>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Trin {step.step}</div>
                        <div className="font-display text-lg font-bold text-foreground">{step.title}</div>
                      </div>
                    </div>
                    
                    <p className={`text-sm text-muted-foreground ${i % 2 === 0 ? 'md:text-right' : ''}`}>
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50" />
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="max-w-2xl mx-auto mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-card to-accent/10 border border-primary/30 animate-scale-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Resultat</div>
              <div className="font-display text-lg font-bold text-foreground">Parat til at modtage bookinger</div>
            </div>
          </div>
          <p className="text-muted-foreground">
            Du har nu en professionel booking-platform. Kunder booker, betaler direkte til dig, og modtager en juridisk kontrakt – alt sammen automatisk.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
