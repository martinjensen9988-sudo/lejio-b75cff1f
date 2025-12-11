import { HelpCircle, User, Building2, Car, CreditCard, FileSignature, CheckCircle2, ArrowDown } from "lucide-react";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative bg-card/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,hsl(174_72%_56%/0.06),transparent_50%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Sådan virker <span className="text-gradient">The Fork</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ved oprettelse vælger du dit spor. Systemet tilpasser sig automatisk.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: The Fork */}
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-4">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Trin 1: Vælg dit spor</span>
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Har du et CVR-nummer?</h3>
            <p className="text-muted-foreground">Dette ene spørgsmål bestemmer, hvordan dit flow ser ud</p>
          </div>

          {/* Fork Visualization */}
          <div className="relative mb-12">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-primary to-transparent" />
            <div className="absolute left-1/2 top-8 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-accent via-border to-primary" />
            
            <div className="grid md:grid-cols-2 gap-8 pt-12">
              {/* P2P Path */}
              <div className="relative animate-scale-in">
                <div className="absolute left-1/2 md:left-auto md:right-0 -top-4 -translate-x-1/2 md:translate-x-1/2 w-px h-4 bg-accent/50" />
                
                <div className="p-6 rounded-2xl bg-card border border-accent/30 hover:border-accent/50 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-sm font-medium text-accent">NEJ – Privat udlejer</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <ArrowDown className="w-4 h-4 text-accent/50" />
                      <span className="text-muted-foreground">CPR-validering + bankkonto (IBAN)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <ArrowDown className="w-4 h-4 text-accent/50" />
                      <span className="text-muted-foreground">Betaling via Lejios gateway</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <ArrowDown className="w-4 h-4 text-accent/50" />
                      <span className="text-muted-foreground">Link til dags-forsikring</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <ArrowDown className="w-4 h-4 text-accent/50" />
                      <span className="text-muted-foreground">P2P-kontrakt genereres</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro Path */}
              <div className="relative animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <div className="absolute left-1/2 md:left-0 -top-4 -translate-x-1/2 md:-translate-x-1/2 w-px h-4 bg-primary/50" />
                
                <div className="p-6 rounded-2xl bg-card border border-primary/30 hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-sm font-medium text-primary">JA – Professionel udlejer</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <ArrowDown className="w-4 h-4 text-primary/50" />
                      <span className="text-muted-foreground">CVR-validering + virksomhedsinfo</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <ArrowDown className="w-4 h-4 text-primary/50" />
                      <span className="text-muted-foreground">Gateway API-nøgler (Quickpay/Stripe)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <ArrowDown className="w-4 h-4 text-primary/50" />
                      <span className="text-muted-foreground">Policenummer + forsikringsselskab</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <ArrowDown className="w-4 h-4 text-primary/50" />
                      <span className="text-muted-foreground">Erhvervskontrakt genereres</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Shared steps */}
          <div className="text-center mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border">
              <span className="text-sm text-muted-foreground">Trin 2-4: Fælles for begge</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Car, title: "Tilføj biler", desc: "Indtast nummerplade – vi henter data automatisk" },
              { icon: CreditCard, title: "Sæt priser", desc: "Dagspris, depositum og km-grænse" },
              { icon: FileSignature, title: "Modtag bookinger", desc: "Kontrakt + betaling håndteres automatisk" },
            ].map((step, i) => (
              <div 
                key={i} 
                className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all animate-scale-in"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
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
          <div className="p-8 rounded-2xl bg-gradient-to-r from-accent/10 via-card to-primary/10 border border-border animate-scale-in" style={{ animationDelay: '0.6s' }}>
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
              Uanset om du er privat eller professionel, ender du med en professionel booking-platform. 
              Betalingsflowet og kontrakten tilpasses automatisk dit spor.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
