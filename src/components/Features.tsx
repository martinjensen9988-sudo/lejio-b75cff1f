import { User, Building2, CreditCard, FileSignature, Shield, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(270_60%_60%/0.05),transparent_60%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
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
                <p className="text-sm text-accent">Ingen CVR? Intet problem.</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">
              Du har en bil du sjældent bruger? Lej den ud og tjen penge. Vi klarer alt det tekniske – du skal bare godkende bookinger.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CreditCard className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Vi håndterer betalingen</div>
                  <p className="text-sm text-muted-foreground">Kunden betaler via Lejio. Vi udbetaler til din bankkonto efter lejen.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Forsikringsvejledning</div>
                  <p className="text-sm text-muted-foreground">Vi guider lejeren til at købe dags-forsikring eller acceptere eget ansvar.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <FileSignature className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="font-medium text-foreground">P2P-kontrakt</div>
                  <p className="text-sm text-muted-foreground">Automatisk genereret lejeaftale mellem dig og lejeren.</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
              <div className="flex items-center gap-2 text-sm text-accent font-medium">
                <span>💰</span>
                <span>20% gebyr på bookinger – du får 80% udbetalt</span>
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
                <p className="text-sm text-primary">Med CVR og egen indløsningsaftale</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">
              Kør din biludlejning professionelt. Behold fuld kontrol over betalinger, forsikring og prissætning – vi leverer teknologien.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CreditCard className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Din egen betalingsløsning</div>
                  <p className="text-sm text-muted-foreground">Forbind Quickpay, PensoPay, Reepay eller Stripe. Pengene går direkte til dig.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Din egen forsikring</div>
                  <p className="text-sm text-muted-foreground">Dit policenummer og selskab flettes automatisk ind i kontrakten.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <FileSignature className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Erhvervskontrakt</div>
                  <p className="text-sm text-muted-foreground">Juridisk bindende aftale med CVR, forsikringsoplysninger og fuld sporbarhed.</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <span>✨</span>
                <span>299 kr/md + 19 kr per booking – du beholder 100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shared Features */}
        <div className="text-center mb-8">
          <h3 className="font-display text-xl font-bold text-foreground mb-2">Fælles for begge spor</h3>
          <p className="text-muted-foreground">Disse funktioner får alle udlejere adgang til</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Nummerplade-opslag", desc: "Automatisk bildata via Kameli API" },
            { title: "Smart kalender", desc: "Booking-system med tilgængelighed" },
            { title: "Kundevalidering", desc: "Kørekort og ID-tjek" },
            { title: "Automatiske kontrakter", desc: "PDF genereres ved booking" },
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
            Se alle funktioner
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
