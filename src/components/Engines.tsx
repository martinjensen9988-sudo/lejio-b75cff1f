import { Wallet, Calculator, FileSignature, Radio, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const engines = [
  {
    icon: Wallet,
    title: "Financial Engine",
    subtitle: "Erstatter bank/Stripe dashboard",
    color: "primary",
    features: [
      "Virtual Wallets for lejere og udlejere",
      "Escrow med intelligent penge-frigivelse",
      "Split Payments med 24-timers delay",
      "Float-indtjening på stilstående midler",
    ],
    benefit: "Udlejer ser saldo hos jer, ikke hos Stripe",
  },
  {
    icon: Calculator,
    title: "Accounting Engine",
    subtitle: "Erstatter e-conomic/Dinero",
    color: "accent",
    features: [
      "Dobbelt bogføring med debet/kredit",
      "Automatisk moms-beregning",
      "Asset Management & afskrivninger",
      "SKAT API integration",
    ],
    benefit: "Udlejere opsiger Dinero permanent",
  },
  {
    icon: FileSignature,
    title: "Trust & Legal Engine",
    subtitle: "Erstatter e-Boks/Penneo",
    color: "primary",
    features: [
      "Proprietær kryptografisk signering",
      "Automatisk kontraktgenerering",
      "Dokumentarkiv med udløbshåndtering",
      "Juridisk bindende uden eksterne tjenester",
    ],
    benefit: "Spar 5 kr. per underskrift",
  },
  {
    icon: Radio,
    title: "Telematics Engine",
    subtitle: "Erstatter Fleet Complete/Automile",
    color: "accent",
    features: [
      "Raw data ingestion via TCP/UDP",
      "Kørestils-analyse i realtid",
      "Dynamisk forsikringspris",
      "Fuld data-ejerskab",
    ],
    benefit: "Data bruges til at sætte forsikringsprisen",
  },
];

const Engines = () => {
  return (
    <section id="engines" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(270_60%_60%/0.05),transparent_60%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            De 4 <span className="text-gradient">Interne Motorer</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            For at gøre eksterne systemer overflødige, skal I bygge fire dedikerede motorer internt i jeres backend.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {engines.map((engine, i) => (
            <div
              key={i}
              className="group relative rounded-2xl bg-card border border-border p-6 lg:p-8 hover:border-primary/50 transition-all duration-500 animate-scale-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${engine.color === 'primary' ? 'bg-primary/5' : 'bg-accent/5'}`} />
              
              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-xl ${engine.color === 'primary' ? 'bg-primary/20' : 'bg-accent/20'} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <engine.icon className={`w-7 h-7 ${engine.color === 'primary' ? 'text-primary' : 'text-accent'}`} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-1">
                      {engine.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{engine.subtitle}</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {engine.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 shrink-0 mt-0.5 ${engine.color === 'primary' ? 'text-primary' : 'text-accent'}`} />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className={`p-4 rounded-xl ${engine.color === 'primary' ? 'bg-primary/10 border border-primary/20' : 'bg-accent/10 border border-accent/20'}`}>
                  <p className="text-sm font-medium text-foreground">
                    ✨ {engine.benefit}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="glass" size="lg" className="group">
            Udforsk teknisk dokumentation
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Engines;
