import { Check, ArrowRight, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Organic backgrounds */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-secondary/10 blob animate-blob" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-mint/10 blob-2 animate-blob" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <span className="text-4xl mb-4 block">💎</span>
          <h2 className="font-display text-4xl sm:text-5xl font-black mb-4">
            Priser der giver <span className="text-gradient-warm">mening</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Du betaler kun, når du tjener penge. Ingen skjulte gebyrer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* P2P Pricing */}
          <div className="rounded-3xl bg-peach-gradient border-2 border-accent/30 p-8 hover:shadow-xl transition-all animate-scale-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
                <User className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-black text-foreground">Privat Udlejer</h3>
                <p className="text-sm text-muted-foreground">No-Cure-No-Pay</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-5xl font-black text-foreground">Gratis</span>
              </div>
              <p className="text-accent font-bold">15-20% af lejeprisen</p>
              <p className="text-sm text-muted-foreground mt-1">Du betaler kun når du tjener</p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "Ingen månedlig betaling",
                "Vi håndterer kortbetaling",
                "Automatisk P2P-kontrakt",
                "Udbetaling til din bank",
                "Kalender og booking-system",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-sm">✓</span>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button variant="warm" size="lg" className="w-full group">
              Opret gratis profil
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Pro Pricing */}
          <div className="rounded-3xl bg-blue-gradient border-2 border-primary/30 p-8 hover:shadow-xl transition-all relative animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg">
              ⭐ For virksomheder
            </div>
            
            <div className="flex items-center gap-4 mb-6 mt-2">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-black text-foreground">Pro Partner</h3>
                <p className="text-sm text-muted-foreground">SaaS Abonnement</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-muted-foreground">Fra</span>
                <span className="font-display text-5xl font-black text-foreground">299</span>
                <span className="text-muted-foreground">kr/md</span>
              </div>
              <p className="text-primary font-bold">+ 10-20 kr. per booking</p>
              <p className="text-sm text-muted-foreground mt-1">Du beholder 100% af betalingen</p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "Bring Your Own Gateway",
                "Din forsikring i kontrakten",
                "B2B-kontrakt med CVR",
                "Ubegrænset antal biler",
                "Priority support",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">✓</span>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button variant="default" size="lg" className="w-full group">
              Start gratis prøveperiode
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
