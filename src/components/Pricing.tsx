import { Check, ArrowRight, User, Building2, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Organic backgrounds */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-secondary/10 blob animate-blob" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-mint/10 blob-2 animate-blob" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          {/* Free Trial Banner */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-mint/30 to-accent/30 border-2 border-mint/50 shadow-lg shadow-mint/20 mb-6">
            <span className="text-2xl">🎁</span>
            <div className="text-left">
              <p className="font-bold text-foreground">6 måneders gratis adgang</p>
              <p className="text-sm text-muted-foreground">Fuld adgang til alt – intet kreditkort krævet</p>
            </div>
          </div>
          
          <span className="text-4xl mb-4 block">💎</span>
          <h2 className="font-display text-4xl sm:text-5xl font-black mb-4">
            Priser der giver <span className="text-gradient-warm">mening</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Du betaler kun, når du tjener penge. Ingen skjulte gebyrer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {/* P2P Pricing */}
          <div className="rounded-3xl bg-peach-gradient border-2 border-accent/30 p-6 hover:shadow-xl transition-all animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-xl font-black text-foreground">Privat Udlejer</h3>
                <p className="text-xs text-muted-foreground">Gør det selv</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-display text-4xl font-black text-foreground">Gratis</span>
              </div>
              <p className="text-accent font-bold text-sm">59 kr per booking</p>
              <p className="text-xs text-muted-foreground mt-1">Du betaler kun når du tjener</p>
            </div>

            <ul className="space-y-2 mb-6 text-sm">
              {[
                "Ingen månedlig betaling",
                "Automatisk P2P-kontrakt",
                "Kalender og booking-system",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-xs">✓</span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button variant="warm" size="sm" className="w-full group" onClick={() => navigate('/auth')}>
              Opret gratis profil
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Private Fleet - 30% */}
          <div className="rounded-3xl bg-gradient-to-br from-mint/30 to-accent/20 border-2 border-mint/40 p-6 hover:shadow-xl transition-all relative animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-mint to-accent text-white text-xs font-bold shadow-lg">
              <Sparkles className="w-3 h-3 inline mr-1" />
              Nyt!
            </div>
            
            <div className="flex items-center gap-3 mb-4 mt-1">
              <div className="w-12 h-12 rounded-2xl bg-mint/30 flex items-center justify-center">
                <User className="w-6 h-6 text-mint" />
              </div>
              <div>
                <h3 className="font-display text-xl font-black text-foreground">Privat Fleet</h3>
                <p className="text-xs text-muted-foreground">Vi driver din udlejning</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display text-4xl font-black text-foreground">30%</span>
              </div>
              <p className="text-mint font-bold text-sm">af omsætningen</p>
              <p className="text-xs text-muted-foreground mt-1">Slip for alt besvær</p>
            </div>

            <ul className="space-y-2 mb-6 text-sm">
              {[
                "LEJIO håndterer alt",
                "Booking & kundeservice",
                "Kontrakt & betaling",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-mint/20 flex items-center justify-center text-xs">✓</span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button variant="default" size="sm" className="w-full group bg-gradient-to-r from-mint to-accent hover:opacity-90" onClick={() => navigate('/auth')}>
              Kom i gang
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Pro Pricing */}
          <div className="rounded-3xl bg-blue-gradient border-2 border-primary/30 p-6 hover:shadow-xl transition-all relative animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg">
              ⭐ Populær
            </div>
            
            <div className="flex items-center gap-3 mb-4 mt-1">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-black text-foreground">Forhandler</h3>
                <p className="text-xs text-muted-foreground">SaaS Abonnement</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-muted-foreground text-sm">Fra</span>
                <span className="font-display text-4xl font-black text-foreground">349</span>
                <span className="text-muted-foreground text-sm">kr/md</span>
              </div>
              <p className="text-primary font-bold text-sm">+ 25 kr per booking</p>
              <p className="text-xs text-muted-foreground mt-1">Du beholder 100% af betalingen</p>
            </div>

            <ul className="space-y-2 mb-6 text-sm">
              {[
                "Brug din egen betalingsløsning",
                "Din forsikring i kontrakten",
                "B2B-kontrakt med CVR",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">✓</span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button variant="default" size="sm" className="w-full group" onClick={() => navigate('/auth')}>
              Start gratis prøve
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Fleet Plans Section */}
        <div className="mt-16 pt-12 border-t border-border/50">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-black mb-2">Fleet-planer til virksomheder</h3>
            <p className="text-muted-foreground">For forhandlere der vil have LEJIO til at drive deres udlejning</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Fleet Basic */}
            <div className="rounded-3xl bg-gradient-to-br from-lavender/30 to-mint/20 border-2 border-lavender/40 p-6 hover:shadow-xl transition-all animate-scale-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-lavender/30 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-lavender" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-black text-foreground">Fleet Basic</h3>
                  <p className="text-xs text-muted-foreground">Vi driver din udlejning</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display text-4xl font-black text-foreground">20%</span>
                </div>
                <p className="text-lavender font-bold text-sm">af omsætningen</p>
                <p className="text-xs text-muted-foreground mt-1">Ingen månedlig udgift</p>
              </div>

              <ul className="space-y-2 mb-6 text-sm">
                {[
                  "LEJIO håndterer alt",
                  "Booking & kundeservice",
                  "Badge på dine køretøjer",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-lavender/20 flex items-center justify-center text-xs">✓</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant="outline" size="sm" className="w-full group border-lavender/50 hover:bg-lavender/10">
                Kontakt os
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Fleet Premium */}
            <div className="rounded-3xl bg-gradient-to-br from-primary/20 to-lavender/20 border-2 border-primary/40 p-6 hover:shadow-xl transition-all relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-lavender text-primary-foreground text-xs font-bold shadow-lg">
                🚀 Premium
              </div>
              
              <div className="flex items-center gap-3 mb-4 mt-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-lavender/30 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-black text-foreground">Fleet Premium</h3>
                  <p className="text-xs text-muted-foreground">Fuld service løsning</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display text-4xl font-black text-foreground">35%</span>
                </div>
                <p className="text-primary font-bold text-sm">af omsætningen</p>
                <p className="text-xs text-muted-foreground mt-1">Alt inkluderet</p>
              </div>

              <ul className="space-y-2 mb-6 text-sm">
                {[
                  "Alt fra Fleet Basic",
                  "Prioriteret synlighed",
                  "Dedikeret kontaktperson",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">✓</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant="default" size="sm" className="w-full group bg-gradient-to-r from-primary to-lavender hover:opacity-90">
                Kontakt os
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
