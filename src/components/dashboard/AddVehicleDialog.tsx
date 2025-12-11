import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVehicleLookup, VehicleData } from '@/hooks/useVehicleLookup';
import { useVehicles, VehicleInsert } from '@/hooks/useVehicles';
import { Plus, Search, Loader2, Car, Check } from 'lucide-react';

const AddVehicleDialog = () => {
  const [open, setOpen] = useState(false);
  const [registration, setRegistration] = useState('');
  const [step, setStep] = useState<'lookup' | 'details'>('lookup');
  const [vehicleDetails, setVehicleDetails] = useState<Partial<VehicleInsert>>({});
  
  const { vehicle, isLoading: lookupLoading, error, lookupVehicle, reset } = useVehicleLookup();
  const { addVehicle, isLoading: addingVehicle } = useVehicles();

  const handleLookup = async () => {
    const result = await lookupVehicle(registration);
    if (result) {
      setVehicleDetails({
        registration: result.registration,
        make: result.make,
        model: result.model,
        variant: result.variant,
        year: result.year > 0 ? result.year : undefined,
        fuel_type: result.fuel_type,
        color: result.color,
        vin: result.vin,
        daily_price: 499,
        included_km: 100,
        extra_km_price: 2.50,
      });
      setStep('details');
    }
  };

  const handleAddVehicle = async () => {
    if (!vehicleDetails.registration || !vehicleDetails.make || !vehicleDetails.model) return;
    
    const result = await addVehicle(vehicleDetails as VehicleInsert);
    if (result) {
      setOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setRegistration('');
    setStep('lookup');
    setVehicleDetails({});
    reset();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="warm" className="gap-2">
          <Plus className="w-4 h-4" />
          Tilføj bil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {step === 'lookup' ? 'Find din bil' : 'Bekræft biloplysninger'}
          </DialogTitle>
        </DialogHeader>

        {step === 'lookup' ? (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Nummerplade</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="AB 12 345"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                  className="text-center text-xl font-bold uppercase tracking-widest"
                  maxLength={8}
                />
                <Button onClick={handleLookup} disabled={lookupLoading || !registration.trim()}>
                  {lookupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            {vehicle && (
              <div className="p-4 rounded-xl bg-mint/10 border border-mint/20 animate-scale-in">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-mint/20 flex items-center justify-center">
                    <Car className="w-6 h-6 text-mint" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-foreground">
                      {vehicle.make} {vehicle.model}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.year > 0 && `${vehicle.year} • `}
                      {vehicle.fuel_type && vehicle.fuel_type}
                    </p>
                  </div>
                  <Check className="w-5 h-5 text-mint ml-auto" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Car className="w-5 h-5 text-primary" />
                <span className="font-display font-bold">
                  {vehicleDetails.make} {vehicleDetails.model}
                </span>
                <span className="text-sm text-muted-foreground ml-auto">
                  {vehicleDetails.registration}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {vehicleDetails.year && (
                  <div>
                    <span className="text-muted-foreground">Årgang:</span>
                    <span className="ml-1 font-medium">{vehicleDetails.year}</span>
                  </div>
                )}
                {vehicleDetails.fuel_type && (
                  <div>
                    <span className="text-muted-foreground">Brændstof:</span>
                    <span className="ml-1 font-medium capitalize">{vehicleDetails.fuel_type}</span>
                  </div>
                )}
                {vehicleDetails.color && (
                  <div>
                    <span className="text-muted-foreground">Farve:</span>
                    <span className="ml-1 font-medium capitalize">{vehicleDetails.color}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Dagspris (kr)</Label>
                <Input
                  type="number"
                  value={vehicleDetails.daily_price || ''}
                  onChange={(e) => setVehicleDetails(prev => ({ ...prev, daily_price: parseFloat(e.target.value) }))}
                  placeholder="499"
                />
              </div>
              <div className="space-y-2">
                <Label>Inkl. km/dag</Label>
                <Input
                  type="number"
                  value={vehicleDetails.included_km || ''}
                  onChange={(e) => setVehicleDetails(prev => ({ ...prev, included_km: parseInt(e.target.value) }))}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ekstra km pris (kr)</Label>
              <Input
                type="number"
                step="0.50"
                value={vehicleDetails.extra_km_price || ''}
                onChange={(e) => setVehicleDetails(prev => ({ ...prev, extra_km_price: parseFloat(e.target.value) }))}
                placeholder="2.50"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep('lookup')}>
                Tilbage
              </Button>
              <Button variant="warm" className="flex-1" onClick={handleAddVehicle} disabled={addingVehicle}>
                {addingVehicle ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tilføj bil'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleDialog;
