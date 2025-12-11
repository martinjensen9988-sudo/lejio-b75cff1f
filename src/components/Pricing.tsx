import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(270_60%_60%/0.06),transparent_50%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Simpel og <span className="text-gradient">gennemsigtig</span> prissætning
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ingen skjulte gebyrer. Ingen procentdel af din omsætning. Du betaler kun for hvad du bruger.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl bg-card border border-primary/50 p-8 shadow-lg shadow-primary/10 animate-scale-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-4">
                Alt inkluderet
              </div>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="font-display text-5xl font-bold text-foreground">299</span>
                <span className="text-muted-foreground">kr/md</span>
              </div>
              <p className="text-sm text-muted-foreground">+ 19 kr. per booking</p>
            </div>

            {/* Features */}
            <ul className="space-y-4 mb-8">
              {[
                "Ubegrænset antal biler",
                "Egen profilside med dit brand",
                "Integration med din betalingsløsning",
                "Automatisk kontraktgenerering",
                "Smart kalender og booking-system",
                "Kundevalidering og ID-check",
                "Email-notifikationer",
                "Support via chat og email",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button variant="hero" size="xl" className="w-full group">
              Prøv gratis i 14 dage
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Ingen kreditkort påkrævet. Ingen binding.
            </p>
          </div>

          {/* Bottom note */}
          <div className="mt-8 p-6 rounded-xl bg-secondary/50 border border-border">
            <h4 className="font-display font-bold text-foreground mb-2">Hvordan faktureres bookinger?</h4>
            <p className="text-sm text-muted-foreground">
              Sidst på måneden sender vi en samlet regning for dine bookinger. For eksempel: 10 bookinger á 19 kr. + abonnement = 489 kr. Dette kan trækkes fra som en driftsomkostning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
