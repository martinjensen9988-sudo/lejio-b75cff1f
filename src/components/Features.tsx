import { User, Building2, CreditCard, FileSignature, Shield, Check, ArrowRight, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(168_80%_50%/0.04),transparent_60%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* For Lejere Section */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            For lejere
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
            Én søgning –{" "}
            <span className="text-gradient">alle muligheder</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find den perfekte bil fra private og professionelle udlejere. Sammenlign priser, book direkte, og få kontrakten med det samme.
          </p>
        </div>

        {/* Unified Search Benefits */}
        <div className="grid sm:grid-cols-3 gap-6 mb-24">
          {[
            { icon: Zap, title: "Instant booking", desc: "Book med det samme på de fleste biler" },
            { icon: FileSignature, title: "Automatisk kontrakt", desc: "Juridisk bindende aftale genereres ved booking" },
            { icon: Shield, title: "Sikker betaling", desc: "Alle transaktioner er beskyttet" },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all animate-scale-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* For Udlejere Section */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-muted-foreground text-xs font-medium mb-4">
            For udlejere
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
            Ét system –{" "}
            <span className="text-gradient">to spor</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Privat eller professionel? Lejio tilpasser sig din situation med den rigtige løsning.
          </p>
        </div>

        {/* The Fork - Two Tracks */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* P2P Track */}
          <div className="rounded-2xl bg-card border border-accent/30 p-8 hover:border-accent/50 transition-all group animate-scale-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-foreground">Privat Udlejer</h3>
                <p className="text-sm text-accent">P2P – Peer-to-Peer</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">
              Du har en bil du sjældent bruger? Lej den ud og tjen penge. Vi klarer betaling, kontrakt og formidling – du godkender bare bookinger.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CreditCard className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Vi håndterer betalingen</div>
                  <p className="text-sm text-muted-foreground">Kunden betaler via Lejio (Escrow). Vi udbetaler til dig efter lejen.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Forsikringsvejledning</div>
                  <p className="text-sm text-muted-foreground">Vi guider lejeren til dags-forsikring eller accept af eget ansvar.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <FileSignature className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="font-medium text-foreground">P2P-kontrakt</div>
                  <p className="text-sm text-muted-foreground">Standard lejeaftale mellem dig og lejeren.</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
              <div className="flex items-center gap-2 text-sm text-accent font-medium">
                <span>💰</span>
                <span>15-20% provision – ingen faste omkostninger</span>
              </div>
            </div>
          </div>

          {/* Pro Track */}
          <div className="rounded-2xl bg-card border border-primary/30 p-8 hover:border-primary/50 transition-all group animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-foreground">Professionel Udlejer</h3>
                <p className="text-sm text-primary">B2P – Business-to-Platform</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">
              Kør din biludlejning professionelt. Behold fuld kontrol over betalinger og forsikring – vi leverer teknologien og kunderne.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CreditCard className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Bring Your Own Gateway</div>
                  <p className="text-sm text-muted-foreground">Forbind Quickpay, PensoPay, Reepay eller Stripe. Pengene går direkte til dig.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Din egen flådeforsikring</div>
                  <p className="text-sm text-muted-foreground">Dit policenummer og selskab flettes automatisk ind i kontrakten.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <FileSignature className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">B2B-kontrakt</div>
                  <p className="text-sm text-muted-foreground">Professionel kontrakt med CVR og dine egne lejebetingelser.</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <span>✨</span>
                <span>SaaS abonnement + lille booking-gebyr – du beholder 100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shared Tech Features */}
        <div className="text-center mb-8">
          <h3 className="font-display text-xl font-bold text-foreground mb-2">Den tekniske motor</h3>
          <p className="text-muted-foreground">Disse funktioner driver hele platformen</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Smart Payment Switch", desc: "Skifter automatisk gateway baseret på biltype" },
            { title: "Nummerplade API", desc: "Kameli integration – hent bildata på sekunder" },
            { title: "Legal Engine", desc: "PDF-kontrakter genereret on-the-fly" },
            { title: "Unified Search", desc: "Private + Pro biler i én søgning" },
          ].map((feature, i) => (
            <div key={i} className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all animate-scale-in" style={{ animationDelay: `${0.2 + i * 0.05}s` }}>
              <Check className="w-5 h-5 text-primary mb-2" />
              <div className="font-medium text-foreground text-sm">{feature.title}</div>
              <div className="text-xs text-muted-foreground">{feature.desc}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="glass" size="lg" className="group">
            Bliv udlejer
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
