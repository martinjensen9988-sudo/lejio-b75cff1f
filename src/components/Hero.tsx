import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Search, ArrowRight, Sparkles, Car, Building2, Zap, Bike } from "lucide-react";
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
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/40 text-sm font-bold text-foreground mb-8 animate-scale-in">
              <Zap className="w-4 h-4 text-secondary" />
              <span>100+ funktioner • 22 kategorier • AI-drevet</span>
            </div>

            {/* Bold headline */}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-[6rem] font-black leading-[0.9] mb-6 animate-slide-up">
              <span className="block text-foreground">DANMARKS</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-mint bg-clip-text text-transparent py-2">
                KOMPLETTE
              </span>
              <span className="block text-foreground">UDLEJNINGSPLATFORM</span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-slide-up font-medium" style={{ animationDelay: '0.1s' }}>
              Alt-i-én løsning med AI-prissætning, GPS-sporing, automatiske kontrakter, flådestyring, service-logistik og meget mere.
            </p>

            {/* Search Box - Bold version */}
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
                  <span>Søg nu</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Three path cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
            {/* Lejer */}
            <div 
              className="group bg-card rounded-3xl p-8 border-2 border-primary/20 hover:border-primary/50 cursor-pointer transition-all hover:shadow-2xl hover:shadow-primary/10 animate-scale-in hover:-translate-y-2"
              style={{ animationDelay: '0.3s' }}
              onClick={() => navigate('/search')}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/30">
                <Car className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl font-black text-foreground mb-2">
                Lej et køretøj
              </h3>
              <p className="text-muted-foreground mb-6">
                Find biler, MC, scootere, campingvogne og trailere fra lokale udlejere.
              </p>
              <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all">
                <span>Søg køretøjer</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* Udlejer */}
            <div 
              className="group relative bg-card rounded-3xl p-8 border-2 border-accent/20 hover:border-accent/50 cursor-pointer transition-all hover:shadow-2xl hover:shadow-accent/10 animate-scale-in hover:-translate-y-2"
              style={{ animationDelay: '0.4s' }}
              onClick={() => navigate('/auth')}
            >
              {/* January promo bubble */}
              <div className="absolute -top-3 -right-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold shadow-lg animate-pulse">
                🎉 6 mdr. GRATIS
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-accent/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-2xl font-black text-foreground mb-2">
                Tjen penge
              </h3>
              <p className="text-muted-foreground mb-4">
                Lej dit køretøj ud og tjen op til 5.000+ kr om måneden.
              </p>
              <p className="text-xs text-green-600 font-semibold mb-4">
                Tilmeld dig i januar – ingen kreditkort krævet!
              </p>
              <div className="flex items-center gap-2 text-accent font-bold group-hover:gap-3 transition-all">
                <span>Bliv udlejer</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* Privat Fleet */}
            <div 
              className="group relative bg-gradient-to-br from-mint/10 to-mint/5 rounded-3xl p-8 border-2 border-mint/40 hover:border-mint/70 cursor-pointer transition-all hover:shadow-2xl hover:shadow-mint/10 animate-scale-in hover:-translate-y-2"
              style={{ animationDelay: '0.5s' }}
              onClick={() => navigate('/privat-fleet')}
            >
              <div className="absolute -top-3 -right-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold shadow-lg animate-pulse">
                🎉 6 mdr. GRATIS
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mint to-mint/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-mint/30">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-2xl font-black text-foreground mb-2">
                Privat Fleet
              </h3>
              <p className="text-muted-foreground mb-4">
                Aflever din bil – vi klarer alt. Du får 70% udbetalt.
              </p>
              <p className="text-xs text-green-600 font-semibold mb-4">
                Tilmeld dig i januar – ingen kreditkort krævet!
              </p>
              <div className="flex items-center gap-2 text-mint font-bold group-hover:gap-3 transition-all">
                <span>Læs mere</span>
                <ArrowRight className="w-5 h-5" />
              </div>
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
