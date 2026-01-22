import { Search, CreditCard, Key, Car, Wallet, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden bg-muted/30">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-[10%] w-32 h-32 bg-mint rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-20 left-[10%] w-40 h-40 bg-accent rounded-full blur-3xl opacity-15 animate-float-slow" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/10 border border-mint/20 text-sm font-bold text-mint mb-6">
            <CheckCircle2 className="w-4 h-4" />
            <span>Super enkelt</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
            Så{" "}
            <span className="bg-gradient-to-r from-mint to-accent bg-clip-text text-transparent">
              nemt
            </span>{" "}
            er det
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Fra søgning til kørsel – på under 5 minutter.
          </p>
        </div>

        {/* Two columns: Lejere + Udlejere */}
        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Lejere */}
          <div className="bg-card rounded-[2rem] p-8 border-2 border-primary/20 shadow-xl animate-scale-in">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30">
                <Key className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-black text-foreground">For lejere</h3>
                <p className="text-muted-foreground">Find og book dit drømmekøretøj</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {[
                { step: 1, icon: Search, title: "Søg", desc: "Find køretøjer i dit område og vælg datoer", color: "bg-primary", iconBg: "bg-primary/10" },
                { step: 2, icon: CreditCard, title: "Book & bekræft", desc: "Reservér dit køretøj online og modtag instruktioner til direkte afregning med udlejer", color: "bg-mint", iconBg: "bg-mint/10" },
                { step: 3, icon: Car, title: "Hent & kør", desc: "Modtag nøgler, kontrakt og afsted!", color: "bg-accent", iconBg: "bg-accent/10" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={i} 
                    className="flex items-center gap-5 group"
                  >
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display text-lg font-bold text-foreground">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-primary to-primary/80 font-bold text-lg py-6 shadow-lg shadow-primary/20"
              onClick={() => navigate('/search')}
            >
              Find køretøj nu
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Udlejere */}
          <div className="bg-card rounded-[2rem] p-8 border-2 border-accent/20 shadow-xl animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg shadow-accent/30">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-black text-foreground">For udlejere</h3>
                <p className="text-muted-foreground">Tjen penge på dit køretøj</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {[
                { step: 1, icon: Car, title: "Opret køretøj", desc: "Indtast nummerplade – vi henter data automatisk", color: "bg-accent", iconBg: "bg-accent/10" },
                { step: 2, icon: Users, title: "Modtag bookinger", desc: "Godkend anmodninger med ét enkelt klik", color: "bg-lavender", iconBg: "bg-lavender/10" },
                { step: 3, icon: Wallet, title: "Modtag betaling", desc: "Du modtager leje og depositum direkte fra lejeren. Vi fakturerer blot vores kommission efterfølgende.", color: "bg-mint", iconBg: "bg-mint/10" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={i} 
                    className="flex items-center gap-5 group"
                  >
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display text-lg font-bold text-foreground">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button 
              variant="warm"
              size="lg" 
              className="w-full font-bold text-lg py-6"
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
