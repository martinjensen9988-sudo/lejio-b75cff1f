import { Rocket, Wallet, Calculator, Shield, CheckCircle2 } from "lucide-react";

const phases = [
  {
    phase: 1,
    title: "MVP Launch",
    icon: Rocket,
    status: "current",
    items: [
      "Egen booking-motor",
      "Betaling via Stripe (skjult)",
      "Simpel PDF faktura",
    ],
  },
  {
    phase: 2,
    title: "Financial Engine",
    icon: Wallet,
    status: "upcoming",
    items: [
      "Wallet-system lancering",
      "Udlejere kan lade penge stå",
      "Float-indtjening aktiveres",
    ],
  },
  {
    phase: 3,
    title: "Accounting Engine",
    icon: Calculator,
    status: "future",
    items: [
      "Regnskabsmodul lancering",
      "Automatisk bogføring",
      "Udlejere opsiger Dinero",
    ],
  },
  {
    phase: 4,
    title: "Insurance Engine",
    icon: Shield,
    status: "future",
    items: [
      "Intern skadesbehandling",
      "MGA model implementeret",
      "Fuld kontrol over claims",
    ],
  },
];

const Roadmap = () => {
  return (
    <section id="roadmap" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,hsl(270_60%_60%/0.06),transparent_50%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Roadmap til <span className="text-gradient">Total Dominans</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            For ikke at drukne i udvikling før I har kunder, rulles det "interne" ud i strategiske faser.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent md:-translate-x-px" />

            {phases.map((phase, i) => (
              <div
                key={i}
                className={`relative flex items-start gap-6 md:gap-0 mb-12 last:mb-0 animate-slide-up ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {/* Content */}
                <div className={`flex-1 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className={`inline-block p-6 rounded-2xl bg-card border ${phase.status === 'current' ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'} transition-all hover:border-primary/50`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg ${phase.status === 'current' ? 'bg-primary/20' : 'bg-muted'} flex items-center justify-center`}>
                        <phase.icon className={`w-5 h-5 ${phase.status === 'current' ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Fase {phase.phase}</div>
                        <div className="font-display font-bold text-foreground">{phase.title}</div>
                      </div>
                    </div>
                    
                    <ul className={`space-y-2 ${i % 2 === 0 ? 'md:text-right' : ''}`}>
                      {phase.items.map((item, j) => (
                        <li key={j} className={`flex items-center gap-2 text-sm text-muted-foreground ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${phase.status === 'current' ? 'text-primary' : 'text-muted-foreground/50'}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center">
                  <div className={`w-4 h-4 rounded-full ${phase.status === 'current' ? 'bg-primary shadow-lg shadow-primary/50' : 'bg-muted border-2 border-border'}`} />
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
