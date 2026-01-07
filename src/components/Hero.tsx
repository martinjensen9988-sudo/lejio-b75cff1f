import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Search, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { cn } from "@/lib/utils";
import HeroAnimations from "./HeroAnimations";

const Hero = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (startDate) params.set("startDate", startDate.toISOString());
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-hero-gradient">
      {/* Organic blob backgrounds */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 blob animate-blob animate-float-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-lavender/20 blob-2 animate-blob animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-mint/15 blob animate-blob animate-float-slow" style={{ animationDelay: '4s' }} />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-secondary/15 blob-2 animate-blob animate-float" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Free Trial Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-mint/20 to-accent/20 border-2 border-mint/40 shadow-lg shadow-mint/20 mb-4 animate-slide-up">
            <span className="text-xl">🎉</span>
            <span className="text-sm font-bold text-foreground">6 MÅNEDERS GRATIS ADGANG</span>
            <span className="text-xl">🎉</span>
          </div>
          
          {/* Sub Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border-2 border-border shadow-soft mb-8 animate-slide-up" style={{ animationDelay: '0.05s' }}>
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-muted-foreground">Intet kreditkort krævet – fuld adgang til alt</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-foreground">Friheden venter </span>
            <span className="text-gradient-warm">lige om hjørnet</span>
            <span className="inline-block ml-2 animate-wiggle">🚗</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Lej en bil fra naboer eller professionelle udlejere. Book på sekunder, 
            få kontrakten med det samme – og kør afsted.
          </p>

          {/* Search Box */}
          <div className="bg-card rounded-3xl p-4 shadow-lg shadow-primary/10 border-2 border-border max-w-3xl mx-auto animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-muted/50 border border-border">
                <MapPin className="w-5 h-5 text-mint shrink-0" />
                <input 
                  type="text" 
                  placeholder="Hvor skal du hente bilen?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-muted/50 border border-border md:w-48 cursor-pointer hover:bg-muted/70 transition-colors">
                    <Calendar className="w-5 h-5 text-lavender shrink-0" />
                    <span className={cn(
                      "flex-1 text-left",
                      startDate ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {startDate ? format(startDate, "dd/MM/yyyy") : "Hvornår?"}
                    </span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <Button variant="hero" size="xl" className="md:px-8 group" onClick={handleSearch}>
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Find din bil nu</span>
                <span className="sm:hidden">Søg</span>
              </Button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            {[
              { emoji: "🚀", text: "Instant booking" },
              { emoji: "📄", text: "Automatisk kontrakt" },
              { emoji: "🛡️", text: "Sikker betaling" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-lg">{item.emoji}</span>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Happy animated illustrations */}
        <div className="mt-12 md:mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <HeroAnimations />
        </div>

        {/* Car cards floating below */}
        <div className="mt-8 flex justify-center gap-4 md:gap-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="bg-card rounded-2xl p-3 md:p-4 shadow-lg border-2 border-mint/30 animate-float" style={{ animationDelay: '0s' }}>
            <div className="w-16 h-12 md:w-20 md:h-14 bg-mint/20 rounded-xl flex items-center justify-center mb-2">
              <span className="text-xl md:text-2xl">🚗</span>
            </div>
            <div className="text-xs font-bold text-foreground">VW Golf</div>
            <div className="text-xs text-muted-foreground">Fra 299 kr/dag</div>
          </div>
          <div className="bg-card rounded-2xl p-3 md:p-4 shadow-lg border-2 border-accent/30 animate-float" style={{ animationDelay: '0.5s' }}>
            <div className="w-16 h-12 md:w-20 md:h-14 bg-accent/20 rounded-xl flex items-center justify-center mb-2">
              <span className="text-xl md:text-2xl">🚙</span>
            </div>
            <div className="text-xs font-bold text-foreground">Tesla Model 3</div>
            <div className="text-xs text-muted-foreground">Fra 599 kr/dag</div>
          </div>
          <div className="hidden sm:block bg-card rounded-2xl p-3 md:p-4 shadow-lg border-2 border-lavender/30 animate-float" style={{ animationDelay: '1s' }}>
            <div className="w-16 h-12 md:w-20 md:h-14 bg-lavender/20 rounded-xl flex items-center justify-center mb-2">
              <span className="text-xl md:text-2xl">🚐</span>
            </div>
            <div className="text-xs font-bold text-foreground">VW Transporter</div>
            <div className="text-xs text-muted-foreground">Fra 499 kr/dag</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
