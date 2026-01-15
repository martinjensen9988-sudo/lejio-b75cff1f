import { ArrowRight, User, Building2, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-muted/30">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
            Simple <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">priser</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ingen skjulte gebyrer. Betal kun når du tjener.
          </p>
        </div>

        {/* Main pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {/* Privat Udlejer */}
          <div className="rounded-3xl bg-card border-2 border-accent/30 p-8 hover:shadow-2xl hover:border-accent/60 transition-all animate-scale-in group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <User className="w-8 h-8 text-white" />
            </div>

            <h3 className="font-display text-2xl font-black text-foreground mb-1">Privat Udlejer</h3>
            <p className="text-sm text-muted-foreground mb-6">Gør det selv</p>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl font-black text-foreground">0</span>
                <span className="text-muted-foreground">kr/md</span>
              </div>
              <p className="text-accent font-bold mt-1">+ 59 kr per booking</p>
            </div>

            <ul className="space-y-3 mb-8">
              {["Ingen månedlig betaling", "Automatisk kontrakt", "Kalender & booking"].map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm">✓</span>
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>

            <Button variant="warm" size="lg" className="w-full font-bold" onClick={() => navigate('/auth')}>
              Kom i gang
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Privat Fleet - Featured */}
          <div className="rounded-3xl bg-gradient-to-br from-mint/20 to-accent/10 border-2 border-mint/50 p-8 hover:shadow-2xl transition-all relative animate-scale-in scale-105 z-10" style={{ animationDelay: '0.1s' }}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-mint to-accent text-white text-sm font-bold shadow-lg flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              Populær
            </div>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mint to-accent flex items-center justify-center mb-6 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>

            <h3 className="font-display text-2xl font-black text-foreground mb-1">Privat Fleet</h3>
            <p className="text-sm text-muted-foreground mb-6">Vi driver det for dig</p>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl font-black text-foreground">30</span>
                <span className="text-muted-foreground">%</span>
              </div>
              <p className="text-mint font-bold mt-1">af omsætningen</p>
            </div>

            <ul className="space-y-3 mb-8">
              {["LEJIO håndterer alt", "Abonnement min. 30 dage", "Du får 70% udbetalt"].map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-mint/20 flex items-center justify-center text-mint text-sm">✓</span>
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-2">
              <Button size="lg" className="w-full font-bold bg-gradient-to-r from-mint to-accent hover:opacity-90" onClick={() => navigate('/auth')}>
                Kom i gang
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="w-full text-mint hover:text-mint/80" onClick={() => navigate('/privat-fleet')}>
                Læs mere →
              </Button>
            </div>
          </div>

          {/* Forhandler */}
          <div className="rounded-3xl bg-card border-2 border-primary/30 p-8 hover:shadow-2xl hover:border-primary/60 transition-all animate-scale-in group" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Building2 className="w-8 h-8 text-white" />
            </div>

            <h3 className="font-display text-2xl font-black text-foreground mb-1">Forhandler</h3>
            <p className="text-sm text-muted-foreground mb-6">SaaS abonnement</p>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-muted-foreground text-sm">fra</span>
                <span className="font-display text-5xl font-black text-foreground">349</span>
                <span className="text-muted-foreground">kr</span>
              </div>
              <p className="text-primary font-bold mt-1">+ 25 kr per booking</p>
            </div>

            <ul className="space-y-3 mb-8">
              {["Din betalingsløsning", "Din forsikring", "B2B kontrakter"].map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">✓</span>
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" className="w-full font-bold" onClick={() => navigate('/auth')}>
              Start gratis prøve
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Fleet plans for dealers */}
        <div className="border-t border-border pt-16">
          <div className="text-center mb-10">
            <h3 className="font-display text-3xl font-black mb-2">Fleet-planer for forhandlere</h3>
            <p className="text-muted-foreground">Lad LEJIO drive din udlejning</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Fleet Basic */}
            <div className="rounded-3xl bg-lavender/10 border-2 border-lavender/40 p-8 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lavender to-lavender/60 flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-black text-foreground">Fleet Basic</h4>
                  <p className="text-sm text-muted-foreground">Vi driver udlejningen</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-display text-4xl font-black text-foreground">20%</span>
                <span className="text-lavender font-bold">af omsætningen</span>
              </div>

              <ul className="space-y-2 mb-6 text-sm">
                {["Ingen månedlig udgift", "LEJIO håndterer alt", "Badge på køretøjer"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-lavender">✓</span>
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Button variant="outline" className="w-full border-lavender/50 hover:bg-lavender/10">
                Kontakt os
              </Button>
            </div>

            {/* Fleet Premium */}
            <div className="rounded-3xl bg-gradient-to-br from-primary/10 to-lavender/10 border-2 border-primary/40 p-8 hover:shadow-xl transition-all relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-lavender text-white text-xs font-bold">
                🚀 Premium
              </div>

              <div className="flex items-center gap-4 mb-6 mt-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-lavender flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-black text-foreground">Fleet Premium</h4>
                  <p className="text-sm text-muted-foreground">Fuld service</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-display text-4xl font-black text-foreground">35%</span>
                <span className="text-primary font-bold">af omsætningen</span>
              </div>

              <ul className="space-y-2 mb-6 text-sm">
                {["Alt fra Basic", "Prioriteret synlighed", "Dedikeret kontaktperson"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-gradient-to-r from-primary to-lavender hover:opacity-90">
                Kontakt os
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
