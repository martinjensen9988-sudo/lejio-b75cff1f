import { Car, Sparkles, Shield, Clock, CreditCard, FileCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Clock,
      title: "Book på sekunder",
      description: "Find og book dit køretøj på under 2 minutter.",
      color: "from-primary to-primary/60",
      bgColor: "bg-primary/10"
    },
    {
      icon: FileCheck,
      title: "Automatisk kontrakt",
      description: "Juridisk bindende kontrakt genereres automatisk.",
      color: "from-mint to-mint/60",
      bgColor: "bg-mint/10"
    },
    {
      icon: Shield,
      title: "Tryg handel",
      description: "Verificerede brugere og sikker betaling.",
      color: "from-accent to-accent/60",
      bgColor: "bg-accent/10"
    },
    {
      icon: CreditCard,
      title: "Nem betaling",
      description: "Betal sikkert online med kort eller MobilePay.",
      color: "from-lavender to-lavender/60",
      bgColor: "bg-lavender/10"
    },
    {
      icon: Car,
      title: "Alle køretøjer",
      description: "Biler, campingvogne, trailere – alt samlet.",
      color: "from-secondary to-secondary/60",
      bgColor: "bg-secondary/10"
    },
    {
      icon: Sparkles,
      title: "AI-drevet",
      description: "Smart prissætning og skadesregistrering.",
      color: "from-mint to-accent",
      bgColor: "bg-gradient-to-br from-mint/10 to-accent/10"
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-muted/30">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
            Hvorfor <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">LEJIO</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Alt hvad du behøver til nem og tryg biludlejning.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div 
                key={i}
                className={`group ${feature.bgColor} rounded-3xl p-8 border-2 border-transparent hover:border-primary/30 transition-all hover:shadow-xl animate-scale-in`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Vehicle types showcase */}
        <div className="text-center mb-12">
          <h3 className="font-display text-3xl font-black mb-8">
            Find det rette køretøj
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { emoji: "🚗", label: "Biler", count: "350+" },
              { emoji: "🏕️", label: "Campingvogne", count: "80+" },
              { emoji: "🚐", label: "Autocampere", count: "45+" },
              { emoji: "🚚", label: "Trailere", count: "60+" },
            ].map((type, i) => (
              <div 
                key={i}
                className="bg-card rounded-2xl px-8 py-6 border-2 border-border hover:border-primary/40 transition-all cursor-pointer hover:shadow-lg group animate-scale-in"
                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                onClick={() => navigate('/search')}
              >
                <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">{type.emoji}</span>
                <div className="font-bold text-foreground">{type.label}</div>
                <div className="text-sm text-primary font-medium">{type.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button 
            size="xl" 
            className="bg-gradient-to-r from-primary to-primary/80 text-lg font-bold px-10"
            onClick={() => navigate('/search')}
          >
            Udforsk alle køretøjer
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
