import { Search, CreditCard, Key, Car, Wallet, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
            Så <span className="bg-gradient-to-r from-mint to-accent bg-clip-text text-transparent">nemt</span> er det
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Fra søgning til kørsel – på under 5 minutter.
          </p>
        </div>

        {/* Two columns: Lejere + Udlejere */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Lejere */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Key className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-2xl font-black text-foreground">For lejere</h3>
            </div>

            {[
              { step: 1, icon: Search, title: "Søg", desc: "Find køretøjer i dit område", color: "bg-primary" },
              { step: 2, icon: CreditCard, title: "Book & betal", desc: "Sikker online betaling", color: "bg-mint" },
              { step: 3, icon: Car, title: "Hent & kør", desc: "Modtag nøgler og kontrakt", color: "bg-accent" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div 
                  key={i} 
                  className="flex items-start gap-4 p-5 rounded-2xl bg-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-all animate-scale-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center shrink-0 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">TRIN {item.step}</span>
                    </div>
                    <h4 className="font-display text-lg font-bold text-foreground mt-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              );
            })}

            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-primary to-primary/80 font-bold"
              onClick={() => navigate('/search')}
            >
              Find køretøj nu
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Udlejere */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-2xl font-black text-foreground">For udlejere</h3>
            </div>

            {[
              { step: 1, icon: Car, title: "Opret køretøj", desc: "Vi henter data automatisk", color: "bg-accent" },
              { step: 2, icon: Users, title: "Modtag bookinger", desc: "Godkend med ét klik", color: "bg-lavender" },
              { step: 3, icon: Wallet, title: "Få betaling", desc: "Penge direkte til din konto", color: "bg-mint" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div 
                  key={i} 
                  className="flex items-start gap-4 p-5 rounded-2xl bg-accent/5 border-2 border-accent/20 hover:border-accent/40 transition-all animate-scale-in"
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center shrink-0 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">TRIN {item.step}</span>
                    </div>
                    <h4 className="font-display text-lg font-bold text-foreground mt-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              );
            })}

            <Button 
              variant="warm"
              size="lg" 
              className="w-full font-bold"
              onClick={() => navigate('/auth')}
            >
              Bliv udlejer gratis
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
