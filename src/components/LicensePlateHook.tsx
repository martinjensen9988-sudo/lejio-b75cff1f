import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const LicensePlateHook = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-lavender-gradient">
      {/* Organic shapes */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-secondary/20 blob animate-blob animate-float" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-mint/15 blob-2 animate-blob animate-float-slow" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-4xl mb-4 block animate-bounce-soft">🎰</span>
          <h2 className="font-display text-4xl sm:text-5xl font-black mb-4 animate-slide-up">
            Hvad er din bil <span className="text-gradient-warm">værd?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Indtast din nummerplade og se, hvad du kan tjene ved at leje din bil ud.
          </p>

          {/* License Plate Input - Designed to look like a real Danish plate */}
          <div className="max-w-md mx-auto mb-8 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-card rounded-2xl p-2 shadow-xl border-4 border-red-500/80 relative overflow-hidden">
              {/* EU stripe on the left */}
              <div className="absolute left-0 top-0 bottom-0 w-10 bg-primary flex flex-col items-center justify-center">
                <div className="text-[8px] text-primary-foreground font-bold">DK</div>
                <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-secondary" />
                  ))}
                </div>
              </div>
              
              <input 
                type="text" 
                placeholder="AB 12 345"
                className="w-full bg-white text-foreground text-center text-3xl font-black py-5 pl-12 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/40 uppercase tracking-widest"
                maxLength={8}
              />
            </div>
          </div>

          <Button variant="warm" size="xl" className="group animate-scale-in" style={{ animationDelay: '0.3s' }}>
            Beregn min indtægt
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </Button>

          <p className="text-sm text-muted-foreground mt-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Vi henter bildata automatisk via Motorregisteret. Ingen binding.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LicensePlateHook;
