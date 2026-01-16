import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Search, ArrowRight, Sparkles, Car, Building2, Zap, Shield, Star, CheckCircle2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { cn } from "@/lib/utils";

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Bold geometric background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-background to-mint/20" />
        
        {/* Large geometric shapes */}
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-primary rounded-full blur-[100px] opacity-20 animate-float-slow" />
        <div className="absolute top-1/4 -right-32 w-[400px] h-[400px] bg-accent rounded-full blur-[80px] opacity-25 animate-float" />
        <div className="absolute -bottom-32 left-1/4 w-[600px] h-[600px] bg-mint rounded-full blur-[120px] opacity-15 animate-float-slow" style={{ animationDelay: '2s' }} />
        
        {/* Decorative elements */}
        <div className="absolute top-32 left-[15%] w-4 h-4 bg-secondary rounded-full animate-bounce-soft" />
        <div className="absolute top-48 right-[20%] w-6 h-6 bg-accent rounded-lg rotate-45 animate-float" />
        <div className="absolute bottom-40 left-[10%] w-3 h-3 bg-mint rounded-full animate-bounce-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-60 right-[15%] w-5 h-5 bg-primary rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main content */}
          <div className="text-center mb-12">
            {/* Badge - Lejer fokuseret */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/40 text-sm font-bold text-foreground mb-8 animate-scale-in">
              <Car className="w-4 h-4 text-primary" />
              <span>Find biler, MC, campingvogne & trailere</span>
            </div>

            {/* Bold headline - Lejer fokuseret */}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] font-black leading-[0.9] mb-6 animate-slide-up">
              <span className="block text-foreground">LEJ DIT NÆSTE</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-mint bg-clip-text text-transparent py-2">
                EVENTYR
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-slide-up font-medium" style={{ animationDelay: '0.1s' }}>
              Lejio er den nye, intelligente vej til leje af biler, trailere og campingvogne. Vi er lige startet, men vores ambition er klar: Vi vil være dit foretrukne valg. Find det køretøj der passer dig, book lynhurtigt til en skarp pris og kom afsted med det samme – med fuld gennemsigtighed og fleksible vilkår.
            </p>

            {/* Search Box - Prominent for lejere */}
            <div className="bg-card/90 backdrop-blur-xl rounded-[2rem] p-4 shadow-2xl border-2 border-primary/20 max-w-4xl mx-auto animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 flex items-center gap-3 px-6 py-5 rounded-2xl bg-background border-2 border-border hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Indtast by eller postnummer..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-lg"
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex items-center gap-3 px-6 py-5 rounded-2xl bg-background border-2 border-border lg:w-64 cursor-pointer hover:border-accent/50 transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <Calendar className="w-6 h-6 text-accent" />
                      </div>
                      <span className={cn(
                        "flex-1 text-left text-lg",
                        startDate ? "text-foreground font-medium" : "text-muted-foreground"
                      )}>
                        {startDate ? format(startDate, "dd. MMM yyyy", { locale: da }) : "Vælg dato..."}
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
                <Button 
                  size="xl" 
                  className="lg:px-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-xl font-bold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all" 
                  onClick={handleSearch}
                >
                  <Search className="w-6 h-6" />
                  <span>Søg køretøjer</span>
                </Button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5 text-mint" />
                <span className="text-sm font-medium">Sikker betaling</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">Automatiske kontrakter</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="w-5 h-5 text-secondary" />
                <span className="text-sm font-medium">Verificerede udlejere</span>
              </div>
            </div>
          </div>

          {/* Vehicle categories for lejere - prominent */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-4xl mx-auto mt-12">
            {[
              { emoji: "🚗", label: "Biler" },
              { emoji: "🏍️", label: "MC" },
              { emoji: "🛵", label: "Scootere" },
              { emoji: "🏕️", label: "Campingvogne" },
              { emoji: "🚐", label: "Autocampere" },
              { emoji: "🚚", label: "Trailere" },
            ].map((type, i) => (
              <div 
                key={i}
                className="text-center p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border hover:border-primary/50 hover:bg-card transition-all cursor-pointer group animate-scale-in"
                style={{ animationDelay: `${0.3 + i * 0.05}s` }}
                onClick={() => navigate('/search')}
              >
                <span className="text-3xl block mb-2 group-hover:scale-125 transition-transform">{type.emoji}</span>
                <div className="font-display font-bold text-foreground text-sm">{type.label}</div>
              </div>
            ))}
          </div>

          {/* Secondary CTA for udlejere - smaller, less prominent */}
          <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <p className="text-muted-foreground mb-4">Har du et køretøj du vil leje ud?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                size="lg"
                className="font-bold border-accent/40 hover:bg-accent/10 hover:border-accent/60"
                onClick={() => navigate('/auth')}
              >
                <Sparkles className="w-5 h-5 text-accent" />
                Bliv udlejer – 6 mdr. gratis
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                className="font-bold text-mint hover:text-mint/80"
                onClick={() => navigate('/hvad-er-lejio')}
              >
                Læs mere om Lejio
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
