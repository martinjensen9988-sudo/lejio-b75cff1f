import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Car, Calendar, Fuel } from "lucide-react";
import { useVehicleLookup, VehicleData } from "@/hooks/useVehicleLookup";
import { toast } from "sonner";

const LicensePlateHook = () => {
  const [registration, setRegistration] = useState("");
  const { vehicle, isLoading, error, lookupVehicle, reset } = useVehicleLookup();

  const handleLookup = async () => {
    if (!registration.trim()) {
      toast.error("Indtast venligst en nummerplade");
      return;
    }
    
    const result = await lookupVehicle(registration);
    if (result) {
      toast.success(`${result.make} ${result.model} fundet!`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLookup();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegistration(e.target.value);
    if (vehicle) {
      reset();
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-lavender-gradient">
      {/* Organic shapes */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-secondary/20 blob animate-blob animate-float" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-mint/15 blob-2 animate-blob animate-float-slow" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-4xl mb-4 block animate-bounce-soft">🎰</span>
          <h2 className="font-display text-4xl sm:text-5xl font-black mb-4 animate-slide-up">
            Hvad er dit køretøj <span className="text-gradient-warm">værd?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Indtast nummerplade og se, hvad du kan tjene ved at leje din bil, campingvogn eller trailer ud.
          </p>

          {/* License Plate Input - Designed to look like a real Danish plate */}
          <div className="max-w-md mx-auto mb-8 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-card rounded-2xl p-2 shadow-xl border-4 border-destructive/60 relative overflow-hidden">
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
                value={registration}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full bg-card text-foreground text-center text-3xl font-black py-5 pl-12 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/40 uppercase tracking-widest"
                maxLength={8}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-destructive text-sm mb-4 animate-fade-in">{error}</p>
          )}

          {/* Vehicle result card */}
          {vehicle && (
            <VehicleCard vehicle={vehicle} />
          )}

          <Button 
            variant="warm" 
            size="xl" 
            className="group animate-scale-in" 
            style={{ animationDelay: '0.3s' }}
            onClick={handleLookup}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Henter køretøjsdata...
              </>
            ) : vehicle ? (
              <>
                Beregn min indtægt
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </>
            ) : (
              <>
                Find mit køretøj
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </>
            )}
          </Button>

          <p className="text-sm text-muted-foreground mt-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Vi henter køretøjsdata automatisk via Motorregisteret. Ingen binding.
          </p>
        </div>
      </div>
    </section>
  );
};

const VehicleCard = ({ vehicle }: { vehicle: VehicleData }) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-xl border border-border mb-8 animate-scale-in text-left">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
          <Car className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">
            {vehicle.make} {vehicle.model}
          </h3>
          {vehicle.variant && (
            <p className="text-sm text-muted-foreground">{vehicle.variant}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {vehicle.year > 0 && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{vehicle.year}</span>
          </div>
        )}
        {vehicle.fuel_type && (
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground capitalize">{vehicle.fuel_type}</span>
          </div>
        )}
        {vehicle.color && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-muted border border-border" />
            <span className="text-sm text-foreground capitalize">{vehicle.color}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LicensePlateHook;
