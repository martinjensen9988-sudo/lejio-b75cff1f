import { Search, CreditCard, FileSignature, Car, Sparkles } from "lucide-react";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-card">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `radial-gradient(hsl(var(--border)) 1px, transparent 1px)`,
        backgroundSize: '24px 24px'
      }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <span className="text-4xl mb-4 block">✨</span>
          <h2 className="font-display text-4xl sm:text-5xl font-black mb-4">
            Så nemt er det
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fra søgning til aflevering – alt er designet til at være hurtigt og bekvemt.
          </p>
        </div>

        {/* Steps for Lejere */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold">
              <Car className="w-4 h-4" />
              For lejere
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { 
                step: 1, 
                icon: Search, 
                title: "Søg", 
                desc: "Find biler i dit område. Filtrer på type, pris og dato.",
                color: "bg-mint/20 text-mint",
                borderColor: "border-mint/30"
              },
              { 
                step: 2, 
                icon: CreditCard, 
                title: "Book & betal", 
                desc: "Vælg bil, bekræft booking og betal sikkert online.",
                color: "bg-secondary/20 text-secondary-foreground",
                borderColor: "border-secondary/30"
              },
              { 
                step: 3, 
                icon: Sparkles, 
                title: "Kør afsted!", 
                desc: "Hent bilen, modtag kontrakten – og nyd turen!",
                color: "bg-lavender/30 text-lavender-foreground",
                borderColor: "border-lavender/30"
              },
            ].map((item, i) => (
              <div 
                key={i} 
                className={`relative p-8 rounded-3xl bg-card border-2 ${item.borderColor} text-center hover:shadow-lg transition-all animate-scale-in`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-lg">
                  {item.step}
                </div>
                
                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Steps for Udlejere */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-bold">
              <FileSignature className="w-4 h-4" />
              For udlejere
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { 
                step: 1, 
                emoji: "🚗",
                title: "Opret din bil", 
                desc: "Indtast nummerplade – vi henter data automatisk.",
              },
              { 
                step: 2, 
                emoji: "💰",
                title: "Sæt din pris", 
                desc: "Du bestemmer dagspris, depositum og tilgængelighed.",
              },
              { 
                step: 3, 
                emoji: "🎉",
                title: "Modtag bookinger", 
                desc: "Vi håndterer betaling og kontrakt – du godkender bare.",
              },
            ].map((item, i) => (
              <div 
                key={i} 
                className="relative p-8 rounded-3xl bg-peach-gradient border-2 border-accent/20 text-center hover:shadow-lg transition-all animate-scale-in"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center text-sm shadow-lg">
                  {item.step}
                </div>
                
                <span className="text-4xl block mb-4">{item.emoji}</span>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
