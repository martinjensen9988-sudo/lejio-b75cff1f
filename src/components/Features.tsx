import { Car, MapPin, Shield, Clock, CreditCard, Star, ArrowRight, Zap, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();

  // Lejer-fokuserede features
  const renterFeatures = [
    {
      icon: Car,
      title: "Stort udvalg",
      description: "Biler, motorcykler, scootere, campingvogne, autocampere og trailere fra lokale udlejere.",
      color: "from-primary to-primary/60",
    },
    {
      icon: MapPin,
      title: "Tæt på dig",
      description: "Find køretøjer i dit lokalområde. Søg på postnummer eller by.",
      color: "from-accent to-accent/60",
    },
    {
      icon: Shield,
      title: "Direkte afregning",
      description: "Afregn leje og depositum direkte med udlejeren via MobilePay eller bankoverførsel. Enkelt og gennemskueligt.",
      color: "from-mint to-mint/60",
    },
    {
      icon: Clock,
      title: "Hurtig booking",
      description: "Book på under 5 minutter. Modtag kontrakt og bekræftelse med det samme.",
      color: "from-lavender to-lavender/60",
    },
    {
      icon: CreditCard,
      title: "Gennemsigtige priser",
      description: "Se den fulde pris inkl. alt før du booker. Ingen skjulte gebyrer.",
      color: "from-secondary to-secondary/60",
    },
    {
      icon: Star,
      title: "Verificerede udlejere",
      description: "Læs anmeldelser og ratings fra andre lejere før du booker.",
      color: "from-yellow-500 to-yellow-500/60",
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[150px] opacity-5" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent rounded-full blur-[120px] opacity-5" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header - Lejer fokuseret */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-bold text-primary mb-6">
            <CheckCircle2 className="w-4 h-4" />
            <span>For lejere</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
            Hvorfor leje hos{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-mint bg-clip-text text-transparent">
              LEJIO?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Vi gør det nemt, sikkert og gennemsigtigt at leje køretøjer fra lokale udlejere.
          </p>
        </div>

        {/* Lejer features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {renterFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div 
                key={i}
                className="group bg-card/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-border/50 hover:border-primary/30 transition-all hover:shadow-lg animate-scale-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA for lejere */}
        <div className="text-center mb-20">
          <Button 
            size="xl" 
            className="bg-gradient-to-r from-primary to-primary/80 text-lg font-bold px-12 shadow-lg shadow-primary/20"
            onClick={() => navigate('/search')}
          >
            Find dit køretøj nu
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 max-w-xl mx-auto mb-16">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-sm font-medium">Eller</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Udlejer teaser - mindre prominent */}
        <div className="bg-gradient-to-br from-accent/10 to-mint/10 rounded-3xl p-8 md:p-12 border-2 border-accent/30 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/40 text-sm font-bold text-accent mb-6">
            <Sparkles className="w-4 h-4" />
            <span>For udlejere</span>
          </div>
          
          <h3 className="font-display text-3xl md:text-4xl font-black mb-4">
            Har du et køretøj?{" "}
            <span className="bg-gradient-to-r from-accent to-mint bg-clip-text text-transparent">
              Tjen penge på det
            </span>
          </h3>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Bliv udlejer på LEJIO og lad dit køretøj arbejde for dig. Vi håndterer kontrakter, booking og formidling – så du kan fokusere på udlejningen.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-card/80 rounded-full px-4 py-2">
              <CheckCircle2 className="w-4 h-4 text-mint" />
              <span className="text-sm font-medium">6 mdr. gratis</span>
            </div>
            <div className="flex items-center gap-2 bg-card/80 rounded-full px-4 py-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Auto-kontrakter</span>
            </div>
            <div className="flex items-center gap-2 bg-card/80 rounded-full px-4 py-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Enkel afregning</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="warm"
              size="lg" 
              className="font-bold text-lg px-8"
              onClick={() => navigate('/auth')}
            >
              Bliv udlejer gratis
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              size="lg" 
              className="font-bold text-lg px-8 border-accent/40 hover:bg-accent/10"
              onClick={() => navigate('/hvad-er-lejio')}
            >
              Læs mere om platformen
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
