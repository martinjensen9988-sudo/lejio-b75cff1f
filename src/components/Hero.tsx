import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Search, ArrowRight, Sparkles, Car, Building2 } from "lucide-react";
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
      {/* Bold gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-mint/20" />
      
      {/* Animated shapes */}
      <div className="absolute top-20 left-[10%] w-32 h-32 bg-secondary rounded-full blur-xl opacity-60 animate-float" />
      <div className="absolute top-40 right-[15%] w-48 h-48 bg-mint rounded-full blur-2xl opacity-40 animate-float-slow" />
      <div className="absolute bottom-32 left-[20%] w-40 h-40 bg-accent rounded-full blur-2xl opacity-50 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 right-[10%] w-56 h-56 bg-lavender rounded-full blur-3xl opacity-40 animate-float-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary rounded-full blur-[120px] opacity-10" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Bold headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-black leading-[0.9] mb-6 animate-slide-up">
            <span className="block text-foreground">LEJ. KØR.</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-mint bg-clip-text text-transparent">
              NEMT.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up font-medium" style={{ animationDelay: '0.1s' }}>
            Biler, campingvogne og trailere – fra private og forhandlere i hele Danmark.
          </p>

          {/* Search Box - Bold version */}
          <div className="bg-card/80 backdrop-blur-xl rounded-[2rem] p-3 shadow-2xl border-2 border-primary/20 max-w-3xl mx-auto animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl bg-background border-2 border-border hover:border-primary/50 transition-colors">
                <MapPin className="w-6 h-6 text-primary shrink-0" />
                <input 
                  type="text" 
                  placeholder="Hvor skal du hente?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-lg"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-background border-2 border-border md:w-52 cursor-pointer hover:border-primary/50 transition-colors">
                    <Calendar className="w-6 h-6 text-accent shrink-0" />
                    <span className={cn(
                      "flex-1 text-left text-lg",
                      startDate ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {startDate ? format(startDate, "dd. MMM", { locale: da }) : "Hvornår?"}
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
                className="md:px-10 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-xl font-bold rounded-2xl" 
                onClick={handleSearch}
              >
                <Search className="w-6 h-6" />
                <span className="hidden sm:inline">Søg nu</span>
              </Button>
            </div>
          </div>

          {/* Two paths - bold cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-16 max-w-4xl mx-auto">
            {/* Lejer */}
            <div 
              className="group bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm rounded-3xl p-8 border-2 border-primary/30 hover:border-primary/60 cursor-pointer transition-all hover:shadow-2xl hover:shadow-primary/20 animate-scale-in"
              style={{ animationDelay: '0.3s' }}
              onClick={() => navigate('/search')}
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Car className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl font-black text-foreground mb-2">
                Find et køretøj
              </h3>
              <p className="text-muted-foreground mb-4">
                Book biler, campingvogne og trailere fra folk i dit område.
              </p>
              <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all">
                <span>Søg nu</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* Udlejer */}
            <div 
              className="group bg-gradient-to-br from-accent/10 to-accent/5 backdrop-blur-sm rounded-3xl p-8 border-2 border-accent/30 hover:border-accent/60 cursor-pointer transition-all hover:shadow-2xl hover:shadow-accent/20 animate-scale-in"
              style={{ animationDelay: '0.4s' }}
              onClick={() => navigate('/auth')}
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Sparkles className="w-10 h-10 text-accent-foreground" />
              </div>
              <h3 className="font-display text-2xl font-black text-foreground mb-2">
                Tjen penge på din bil
              </h3>
              <p className="text-muted-foreground mb-4">
                Lej dit køretøj ud og tjen op til 5.000+ kr/md.
              </p>
              <div className="flex items-center gap-2 text-accent font-bold group-hover:gap-3 transition-all">
                <span>Kom i gang</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Fleet banner */}
          <div 
            className="mt-10 max-w-4xl mx-auto animate-fade-in cursor-pointer group"
            style={{ animationDelay: '0.5s' }}
            onClick={() => navigate('/privat-fleet')}
          >
            <div className="bg-gradient-to-r from-mint/20 via-mint/10 to-accent/20 rounded-2xl p-6 border-2 border-mint/40 hover:border-mint/60 transition-all flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-mint to-mint/60 flex items-center justify-center shadow-lg">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-foreground text-lg">Privat Fleet</span>
                    <span className="px-2 py-0.5 rounded-full bg-mint text-white text-xs font-bold">NY</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Aflever din bil – vi klarer resten. Du får 70%.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-mint font-bold group-hover:gap-3 transition-all whitespace-nowrap">
                <span>Læs mere</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {[
              { value: "500+", label: "Køretøjer" },
              { value: "2.000+", label: "Tilfredse kunder" },
              { value: "4.8★", label: "Gennemsnitlig rating" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-4xl sm:text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
