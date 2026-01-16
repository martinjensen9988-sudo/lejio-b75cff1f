import { Car, Sparkles, Shield, Clock, CreditCard, FileCheck, ArrowRight, Zap, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "AI-drevet platform",
      description: "Smart prissætning, flådestyring, skadesregistrering og automatiske anbefalinger.",
      color: "from-mint to-accent",
      bgColor: "bg-gradient-to-br from-mint/5 to-accent/5",
      borderColor: "border-mint/20 hover:border-mint/50"
    },
    {
      icon: FileCheck,
      title: "100+ funktioner",
      description: "Fra booking til GPS-sporing, bøder til service – alt i én platform.",
      color: "from-primary to-primary/60",
      bgColor: "bg-primary/5",
      borderColor: "border-primary/20 hover:border-primary/50"
    },
    {
      icon: Shield,
      title: "Dynamisk selvrisiko",
      description: "Differentier selvrisiko baseret på lejerens profil og rating.",
      color: "from-accent to-accent/60",
      bgColor: "bg-accent/5",
      borderColor: "border-accent/20 hover:border-accent/50"
    },
    {
      icon: Clock,
      title: "Auto-Dispatch AI",
      description: "AI analyserer efterspørgsel og foreslår optimal flådefordeling.",
      color: "from-lavender to-lavender/60",
      bgColor: "bg-lavender/5",
      borderColor: "border-lavender/20 hover:border-lavender/50"
    },
    {
      icon: Car,
      title: "Multi-lokation",
      description: "Administrer flere lokationer med separate åbningstider og priser.",
      color: "from-secondary to-secondary/60",
      bgColor: "bg-secondary/5",
      borderColor: "border-secondary/20 hover:border-secondary/50"
    },
    {
      icon: CreditCard,
      title: "Komplet økonomi",
      description: "Fakturaer, bøder, depositum og platformgebyrer – alt automatiseret.",
      color: "from-mint to-mint/60",
      bgColor: "bg-mint/5",
      borderColor: "border-mint/20 hover:border-mint/50"
    }
  ];

  return (
    <section id="features" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[150px] opacity-5" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent rounded-full blur-[120px] opacity-5" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-bold text-primary mb-6">
            <Zap className="w-4 h-4" />
            <span>Hvorfor LEJIO?</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
            Alt du behøver til{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-mint bg-clip-text text-transparent">
              nem udlejning
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Vi har bygget den mest komplette platform til køretøjsudlejning i Danmark.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div 
                key={i}
                className={`group ${feature.bgColor} rounded-3xl p-8 border-2 ${feature.borderColor} transition-all hover:shadow-xl hover:-translate-y-1 animate-scale-in`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-card rounded-[2.5rem] p-10 border-2 border-border max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <div className="text-4xl font-black text-primary mb-2">100+</div>
              <div className="text-muted-foreground font-medium">Funktioner</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-4xl font-black text-accent mb-2">22</div>
              <div className="text-muted-foreground font-medium">Kategorier</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.7s' }}>
              <div className="text-4xl font-black text-mint mb-2">5</div>
              <div className="text-muted-foreground font-medium">AI-funktioner</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.8s' }}>
              <div className="text-4xl font-black text-secondary mb-2">24/7</div>
              <div className="text-muted-foreground font-medium">Drift</div>
            </div>
          </div>
        </div>

        {/* Vehicle types */}
        <div className="bg-card rounded-[2.5rem] p-10 border-2 border-border max-w-5xl mx-auto">
          <h3 className="font-display text-3xl font-black text-center mb-10">
            Find det rette køretøj til din tur
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {[
              { emoji: "🚗", label: "Personbiler", desc: "Fra små bybiler til store familiebiler" },
              { emoji: "🏍️", label: "Motorcykler", desc: "Fra A1 til stor MC" },
              { emoji: "🛵", label: "Scootere", desc: "30 og 45 km/t" },
              { emoji: "🏕️", label: "Campingvogne", desc: "Til ferien i naturen" },
              { emoji: "🚐", label: "Autocampere", desc: "Alt-i-én løsning" },
              { emoji: "🚚", label: "Trailere", desc: "Transport af gods" },
            ].map((type, i) => (
              <div 
                key={i}
                className="text-center p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group animate-scale-in"
                style={{ animationDelay: `${0.9 + i * 0.1}s` }}
                onClick={() => navigate('/search')}
              >
                <span className="text-4xl block mb-3 group-hover:scale-125 transition-transform">{type.emoji}</span>
                <div className="font-display font-bold text-foreground text-base mb-1">{type.label}</div>
                <div className="text-xs text-muted-foreground">{type.desc}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="xl" 
              className="bg-gradient-to-r from-primary to-primary/80 text-lg font-bold px-12 shadow-lg shadow-primary/20"
              onClick={() => navigate('/search')}
            >
              Udforsk alle køretøjer
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              size="xl" 
              variant="outline"
              className="text-lg font-bold px-12"
              onClick={() => navigate('/features')}
            >
              Se alle 100+ funktioner
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
