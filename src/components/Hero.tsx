import { Button } from "@/components/ui/button";
import { ArrowRight, Check, User, Building2 } from "lucide-react";
import HeroVisual from "./HeroVisual";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(174_72%_56%/0.12),transparent_60%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">For private & professionelle udlejere</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              Lej din bil ud –{" "}
              <span className="text-gradient">professionelt</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Uanset om du er privatperson eller erhvervsdrivende. Lejio håndterer booking, kontrakt og betaling – du bestemmer resten.
            </p>

            {/* Dual Track Badges */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-foreground">Privat Udlejer</div>
                  <div className="text-xs text-muted-foreground">Vi klarer betalingen for dig</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-foreground">Professionel Udlejer</div>
                  <div className="text-xs text-muted-foreground">Brug din egen betalingsløsning</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Button variant="hero" size="xl" className="group">
                Kom i gang gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="glass" size="xl">
                Se hvordan det virker
              </Button>
            </div>

            {/* Trust Points */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {[
                "Ingen binding",
                "Automatiske kontrakter",
                "Sikker betaling",
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  {point}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
