import { HelpCircle, User, Building2, Car, CreditCard, FileSignature, CheckCircle2, ArrowDown, Search } from "lucide-react";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative bg-card/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,hsl(168_80%_50%/0.04),transparent_50%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
            Sådan virker <span className="text-gradient">LEJIO</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            For lejere er det simpelt. For udlejere tilpasser systemet sig automatisk.
          </p>
        </div>

        {/* For Lejere */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
              For lejere
            </div>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: 1, icon: Search, title: "Søg", desc: "Find biler i dit område – private og professionelle vises sammen" },
              { step: 2, icon: CreditCard, title: "Book & betal", desc: "Vælg bil, betalingsmetode og bekræft booking" },
              { step: 3, icon: FileSignature, title: "Kør afsted", desc: "Modtag kontrakt, hent bil og kør!" },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-card border border-border animate-scale-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Trin {item.step}</div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* For Udlejere - The Fork */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-muted-foreground text-xs font-medium mb-4">
              For udlejere
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              The Fork – Vælg dit spor
            </h3>
            <p className="text-muted-foreground">Ved oprettelse beslutter ét spørgsmål hele dit setup</p>
          </div>

          {/* The Fork Question */}
          <div className="text-center mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-card border border-border">
              <HelpCircle className="w-6 h-6 text-primary" />
              <span className="font-display text-lg font-bold text-foreground">"Har du et CVR-nummer?"</span>
            </div>
          </div>

          {/* Fork Visualization */}
          <div className="relative mb-12">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-primary to-transparent" />
            <div className="absolute left-1/2 top-8 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-accent via-border to-primary" />
            
            <div className="grid md:grid-cols-2 gap-8 pt-12">
              {/* P2P Path */}
              <div className="relative animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <div className="absolute left-1/2 md:left-auto md:right-0 -top-4 -translate-x-1/2 md:translate-x-1/2 w-px h-4 bg-accent/50" />
                
                <div className="p-6 rounded-2xl bg-card border border-accent/30 hover:border-accent/50 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-sm font-bold text-accent">NEJ – Privat (P2P)</div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      "CPR-validering + bankkonto",
                      "Betaling via Lejio (Escrow)",
                      "Link til dags-forsikring",
                      "Standard P2P-kontrakt",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <ArrowDown className="w-4 h-4 text-accent/50" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pro Path */}
              <div className="relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
                <div className="absolute left-1/2 md:left-0 -top-4 -translate-x-1/2 md:-translate-x-1/2 w-px h-4 bg-primary/50" />
                
                <div className="p-6 rounded-2xl bg-card border border-primary/30 hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-sm font-bold text-primary">JA – Professionel (B2P)</div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      "CVR-validering + virksomhedsinfo",
                      "Bring Your Own Gateway",
                      "Din flådeforsikring i kontrakten",
                      "B2B-kontrakt med dine betingelser",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <ArrowDown className="w-4 h-4 text-primary/50" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shared steps */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Car, title: "Tilføj biler", desc: "Indtast nummerplade – vi henter data via Kameli API" },
              { icon: CreditCard, title: "Sæt priser", desc: "Dagspris, depositum, km-grænse og selvrisiko" },
              { icon: FileSignature, title: "Modtag bookinger", desc: "Alt automatiseret – kontrakt + betaling" },
            ].map((step, i) => (
              <div 
                key={i} 
                className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all animate-scale-in"
                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="font-medium text-foreground mb-1">{step.title}</div>
                <div className="text-sm text-muted-foreground">{step.desc}</div>
              </div>
            ))}
          </div>

          {/* Result */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-accent/10 via-card to-primary/10 border border-border animate-scale-in" style={{ animationDelay: '0.7s' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Resultat</div>
                <div className="font-display text-lg font-bold text-foreground">Du er nu synlig på kortet</div>
              </div>
            </div>
            <p className="text-muted-foreground">
              Dine biler vises i søgeresultater sammen med alle andre. Lejere kan finde dig, booke og få en professionel kontrakt – uanset om du er privat eller professionel.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
