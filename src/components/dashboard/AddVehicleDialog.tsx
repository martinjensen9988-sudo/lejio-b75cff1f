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
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useVehicleLookup, VehicleData } from '@/hooks/useVehicleLookup';
import { useVehicles, VehicleInsert } from '@/hooks/useVehicles';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Search, Loader2, Car, Check, CreditCard, CalendarClock, MapPin } from 'lucide-react';

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
        weekly_price: 2800,
        monthly_price: 9900,
        included_km: 100,
        extra_km_price: 2.50,
        deposit_required: false,
        deposit_amount: 0,
        prepaid_rent_enabled: false,
        prepaid_rent_months: 1,
        payment_schedule: 'upfront' as const,
        use_custom_location: false,
        location_address: '',
        location_postal_code: '',
        location_city: '',
      });
      setStep('details');
    }
  };

  const handleAddVehicle = async () => {
    if (!vehicleDetails.registration || !vehicleDetails.make || !vehicleDetails.model) return;
    
    let finalDetails = { ...vehicleDetails };
    
    // Geocode the address if custom location is enabled
    if (vehicleDetails.use_custom_location && vehicleDetails.location_address) {
      try {
        const { data, error } = await supabase.functions.invoke('geocode-address', {
          body: {
            address: vehicleDetails.location_address,
            postalCode: vehicleDetails.location_postal_code,
            city: vehicleDetails.location_city,
          },
        });
        
        if (!error && data?.latitude && data?.longitude) {
          finalDetails.latitude = data.latitude;
          finalDetails.longitude = data.longitude;
        }
      } catch (err) {
        console.error('Geocoding failed:', err);
        // Continue without coordinates
      }
    }
    
    const result = await addVehicle(finalDetails as VehicleInsert);
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

            <div className="space-y-3">
              <Label className="text-base font-semibold">Priser</Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Pr. dag (kr)</Label>
                  <Input
                    type="number"
                    value={vehicleDetails.daily_price || ''}
                    onChange={(e) => setVehicleDetails(prev => ({ ...prev, daily_price: parseFloat(e.target.value) || undefined }))}
                    placeholder="499"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Pr. uge (kr)</Label>
                  <Input
                    type="number"
                    value={vehicleDetails.weekly_price || ''}
                    onChange={(e) => setVehicleDetails(prev => ({ ...prev, weekly_price: parseFloat(e.target.value) || undefined }))}
                    placeholder="2.800"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Pr. måned (kr)</Label>
                  <Input
                    type="number"
                    value={vehicleDetails.monthly_price || ''}
                    onChange={(e) => setVehicleDetails(prev => ({ ...prev, monthly_price: parseFloat(e.target.value) || undefined }))}
                    placeholder="9.900"
                  />
                </div>
              </div>
            </div>

            {/* Unlimited KM checkbox */}
            <div 
              className="flex items-center space-x-3 p-3 rounded-xl bg-mint/10 border border-mint/20 cursor-pointer"
              onClick={() => setVehicleDetails(prev => ({ ...prev, unlimited_km: !prev.unlimited_km }))}
            >
              <Checkbox
                id="unlimited_km"
                checked={vehicleDetails.unlimited_km || false}
                onCheckedChange={(checked) => setVehicleDetails(prev => ({ ...prev, unlimited_km: !!checked }))}
              />
              <label htmlFor="unlimited_km" className="text-sm font-medium cursor-pointer select-none">
                Fri km (ingen km-begrænsning)
              </label>
            </div>

            {!vehicleDetails.unlimited_km && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Inkl. km/dag</Label>
                  <Input
                    type="number"
                    value={vehicleDetails.included_km || ''}
                    onChange={(e) => setVehicleDetails(prev => ({ ...prev, included_km: parseInt(e.target.value) || undefined }))}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ekstra km pris (kr)</Label>
                  <Input
                    type="number"
                    step="0.50"
                    value={vehicleDetails.extra_km_price || ''}
                    onChange={(e) => setVehicleDetails(prev => ({ ...prev, extra_km_price: parseFloat(e.target.value) || undefined }))}
                    placeholder="2,50"
                  />
                </div>
              </div>
            )}

            {/* Deposit Section */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Depositum & Forudbetaling</Label>
              
              {/* Deposit checkbox */}
              <div 
                className="flex items-center space-x-3 p-3 rounded-xl bg-lavender/10 border border-lavender/20 cursor-pointer"
                onClick={() => setVehicleDetails(prev => ({ ...prev, deposit_required: !prev.deposit_required }))}
              >
                <Checkbox
                  id="deposit_required"
                  checked={vehicleDetails.deposit_required || false}
                  onCheckedChange={(checked) => setVehicleDetails(prev => ({ ...prev, deposit_required: !!checked }))}
                />
                <label htmlFor="deposit_required" className="text-sm font-medium cursor-pointer select-none">
                  Kræv depositum
                </label>
              </div>

              {vehicleDetails.deposit_required && (
                <div className="space-y-2 pl-6">
                  <Label className="text-xs text-muted-foreground">Depositum beløb (kr)</Label>
                  <Input
                    type="number"
                    value={vehicleDetails.deposit_amount || ''}
                    onChange={(e) => setVehicleDetails(prev => ({ ...prev, deposit_amount: parseFloat(e.target.value) || 0 }))}
                    placeholder="2.500"
                  />
                </div>
              )}

              {/* Prepaid rent checkbox */}
              <div 
                className="flex items-center space-x-3 p-3 rounded-xl bg-accent/10 border border-accent/20 cursor-pointer"
                onClick={() => setVehicleDetails(prev => ({ ...prev, prepaid_rent_enabled: !prev.prepaid_rent_enabled }))}
              >
                <Checkbox
                  id="prepaid_rent"
                  checked={vehicleDetails.prepaid_rent_enabled || false}
                  onCheckedChange={(checked) => setVehicleDetails(prev => ({ ...prev, prepaid_rent_enabled: !!checked }))}
                />
                <label htmlFor="prepaid_rent" className="text-sm font-medium cursor-pointer select-none">
                  Kræv forudbetalt leje
                </label>
              </div>

              {vehicleDetails.prepaid_rent_enabled && (
                <div className="space-y-2 pl-6">
                  <Label className="text-xs text-muted-foreground">Antal måneder forudbetaling</Label>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    value={vehicleDetails.prepaid_rent_months || 1}
                    onChange={(e) => setVehicleDetails(prev => ({ ...prev, prepaid_rent_months: parseInt(e.target.value) || 1 }))}
                    placeholder="1"
                  />
                  <p className="text-xs text-muted-foreground">
                    Lejer skal betale {vehicleDetails.prepaid_rent_months || 1} måneds leje forud ved første betaling
                  </p>
                </div>
              )}
            </div>

            {/* Payment Schedule */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Betalingsplan</Label>
              <RadioGroup
                value={vehicleDetails.payment_schedule || 'upfront'}
                onValueChange={(value: 'upfront' | 'monthly') => 
                  setVehicleDetails(prev => ({ ...prev, payment_schedule: value }))
                }
                className="space-y-2"
              >
                <div 
                  className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    vehicleDetails.payment_schedule === 'upfront' 
                      ? 'bg-primary/10 border-primary/30' 
                      : 'bg-muted/30 border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setVehicleDetails(prev => ({ ...prev, payment_schedule: 'upfront' as const }))}
                >
                  <RadioGroupItem value="upfront" id="payment_upfront" />
                  <CreditCard className="w-4 h-4 text-primary" />
                  <div className="flex-1">
                    <label htmlFor="payment_upfront" className="text-sm font-medium cursor-pointer">
                      Forudbetaling
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Lejer betaler hele lejeperioden på forhånd
                    </p>
                  </div>
                </div>
                <div 
                  className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    vehicleDetails.payment_schedule === 'monthly' 
                      ? 'bg-coral/10 border-coral/30' 
                      : 'bg-muted/30 border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setVehicleDetails(prev => ({ ...prev, payment_schedule: 'monthly' as const }))}
                >
                  <RadioGroupItem value="monthly" id="payment_monthly" />
                  <CalendarClock className="w-4 h-4 text-coral" />
                  <div className="flex-1">
                    <label htmlFor="payment_monthly" className="text-sm font-medium cursor-pointer">
                      Månedlig opkrævning
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Automatisk trækning fra lejers kort hver måned
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Custom Location */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Afhentningssted</Label>
              
              <div 
                className="flex items-center space-x-3 p-3 rounded-xl bg-primary/10 border border-primary/20 cursor-pointer"
                onClick={() => setVehicleDetails(prev => ({ ...prev, use_custom_location: !prev.use_custom_location }))}
              >
                <Checkbox
                  id="use_custom_location"
                  checked={vehicleDetails.use_custom_location || false}
                  onCheckedChange={(checked) => setVehicleDetails(prev => ({ ...prev, use_custom_location: !!checked }))}
                />
                <MapPin className="w-4 h-4 text-primary" />
                <label htmlFor="use_custom_location" className="text-sm font-medium cursor-pointer select-none">
                  Bilen står på en anden adresse
                </label>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {vehicleDetails.use_custom_location 
                  ? 'Indtast adressen hvor bilen kan afhentes' 
                  : 'Bilen vises på din firmaadresse på kortet'}
              </p>

              {vehicleDetails.use_custom_location && (
                <div className="space-y-3 pl-6 animate-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Adresse</Label>
                    <Input
                      value={vehicleDetails.location_address || ''}
                      onChange={(e) => setVehicleDetails(prev => ({ ...prev, location_address: e.target.value }))}
                      placeholder="Gade og husnummer"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Postnummer</Label>
                      <Input
                        value={vehicleDetails.location_postal_code || ''}
                        onChange={(e) => setVehicleDetails(prev => ({ ...prev, location_postal_code: e.target.value }))}
                        placeholder="2100"
                        maxLength={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">By</Label>
                      <Input
                        value={vehicleDetails.location_city || ''}
                        onChange={(e) => setVehicleDetails(prev => ({ ...prev, location_city: e.target.value }))}
                        placeholder="København"
                      />
                    </div>
                  </div>
                </div>
              )}
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
