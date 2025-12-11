import { Check, ArrowRight, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(270_60%_60%/0.06),transparent_50%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Priser der passer til{" "}
            <span className="text-gradient">din situation</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Privat eller professionel – vælg det spor der giver mening for dig.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* P2P Pricing */}
          <div className="rounded-2xl bg-card border border-accent/30 p-8 hover:border-accent/50 transition-all animate-scale-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">Privat Udlejer</h3>
                <p className="text-sm text-muted-foreground">Uden CVR-nummer</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-4xl font-bold text-foreground">Gratis</span>
              </div>
              <p className="text-sm text-accent font-medium">20% gebyr per booking</p>
              <p className="text-xs text-muted-foreground mt-1">Du får 80% udbetalt til din bankkonto</p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "Ingen månedlig betaling",
                "Vi håndterer kortbetaling",
                "Automatisk P2P-kontrakt",
                "Udbetaling til din bank",
                "Kalender og booking-system",
                "Email-notifikationer",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button variant="glass" size="lg" className="w-full group border-accent/30 hover:border-accent">
              Kom i gang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Perfekt til dig der lejer ud lejlighedsvis
            </p>
          </div>

          {/* Pro Pricing */}
          <div className="rounded-2xl bg-card border border-primary/50 p-8 shadow-lg shadow-primary/10 hover:border-primary transition-all animate-scale-in relative" style={{ animationDelay: '0.1s' }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              Mest populær
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">Professionel Udlejer</h3>
                <p className="text-sm text-muted-foreground">Med CVR-nummer</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-4xl font-bold text-foreground">299</span>
                <span className="text-muted-foreground">kr/md</span>
              </div>
              <p className="text-sm text-primary font-medium">+ 19 kr. per booking</p>
              <p className="text-xs text-muted-foreground mt-1">Du beholder 100% af betalingen</p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "Din egen betalingsløsning",
                "Din egen forsikring i kontrakten",
                "Erhvervskontrakt med CVR",
                "Ubegrænset antal biler",
                "Smart kalender og booking",
                "Månedlig fakturering (fradrag)",
                "Priority support",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button variant="hero" size="lg" className="w-full group">
              Prøv gratis i 14 dage
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Ingen kreditkort påkrævet. Ingen binding.
            </p>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-12 max-w-2xl mx-auto p-6 rounded-xl bg-secondary/50 border border-border animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <h4 className="font-display font-bold text-foreground mb-2">Hvordan fungerer betalingsflowet?</h4>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="text-accent font-medium">Privat:</span> Kunden betaler til Lejio → Vi fratrækker 20% → Du får resten udbetalt.
            </div>
            <div>
              <span className="text-primary font-medium">Professionel:</span> Kunden betaler direkte til din konto → Vi sender månedlig faktura.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
