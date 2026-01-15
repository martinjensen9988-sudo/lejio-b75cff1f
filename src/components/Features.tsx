import { User, Building2, Key, PiggyBank, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Features = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Organic backgrounds */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-mint/10 blob animate-blob" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 blob-2 animate-blob" style={{ animationDelay: '3s' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <span className="text-4xl mb-4 block">🎯</span>
          <h2 className="font-display text-4xl sm:text-5xl font-black mb-4">
            Vælg din <span className="text-gradient">vej</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Uanset om du søger et køretøj eller vil leje dit ud – LEJIO gør det nemt og trygt.
          </p>
        </div>

        {/* The Split - Two Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Lejer Card */}
          <div className="group bg-blue-gradient rounded-3xl p-8 border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl hover:shadow-primary/10 animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Key className="w-8 h-8 text-primary" />
            </div>
            
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              Skal du på tur? 🚗🏕️
            </h3>
            <p className="text-muted-foreground mb-6">
              Find det perfekte køretøj i dit nabolag. Fra små bybiler til campingvogne og trailere – alt samlet ét sted.
            </p>

            <div className="space-y-3 mb-8">
              {[
                "Søg blandt hundredvis af køretøjer",
                "Biler, campingvogne og trailere",
                "Instant booking på de fleste køretøjer",
                "Automatisk juridisk kontrakt",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">✓</span>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>

            <Button variant="default" size="lg" className="w-full group/btn">
              Find køretøj
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Udlejer Card */}
          <div className="group bg-peach-gradient rounded-3xl p-8 border-2 border-accent/20 hover:border-accent/40 transition-all hover:shadow-xl hover:shadow-accent/10 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <PiggyBank className="w-8 h-8 text-accent" />
            </div>
            
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              Har du køretøjer der står stille? 💰
            </h3>
            <p className="text-muted-foreground mb-6">
              Lad din bil, campingvogn eller trailer tjene penge. Det er nemt, trygt – og du bestemmer selv prisen.
            </p>

            <div className="space-y-3 mb-8">
              {[
                "Opret dit køretøj på 2 minutter",
                "Du bestemmer pris og tilgængelighed",
                "Vi håndterer betaling og kontrakt",
                "Tjen op til 5.000+ kr/md ekstra",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs">✓</span>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>

            <Button variant="warm" size="lg" className="w-full group/btn">
              Bliv udlejer
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Pro Partners Section */}
        <div className="mt-24">
          <div className="text-center mb-12 animate-slide-up">
            <span className="text-3xl mb-4 block">🏢</span>
            <h3 className="font-display text-3xl font-bold text-foreground mb-2">
              Er du forhandler?
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Få superkræfter til din forretning. Behold din egen betalingsløsning og forsikring – vi leverer teknologien.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: "💳", title: "Brug din egen betalingsløsning", desc: "Quickpay, PensoPay, Stripe" },
              { icon: "📋", title: "B2B Kontrakter", desc: "Med dit CVR og vilkår" },
              { icon: "🛡️", title: "Din forsikring", desc: "Automatisk i kontrakten" },
              { icon: "📊", title: "Dashboard", desc: "Komplet overblik" },
            ].map((item, i) => (
              <div 
                key={i} 
                className="p-5 rounded-2xl bg-card border-2 border-border hover:border-primary/30 transition-all text-center animate-scale-in"
                style={{ animationDelay: `${0.2 + i * 0.1}s` }}
              >
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <div className="font-bold text-foreground text-sm mb-1">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="glass" size="lg">
              Læs mere om forhandler-program
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
