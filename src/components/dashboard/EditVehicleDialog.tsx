import { useState, useRef } from 'react';
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
import { Vehicle, PaymentScheduleType } from '@/hooks/useVehicles';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Loader2, Upload, X, Car, CreditCard, CalendarClock, MapPin, AlertTriangle, Truck, Tent, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { TrailerFields } from './TrailerFields';
import { CaravanFields } from './CaravanFields';

const VEHICLE_FEATURES = [
  { id: 'aircon', label: 'Aircondition' },
  { id: 'gps', label: 'GPS/Navigation' },
  { id: 'bluetooth', label: 'Bluetooth' },
  { id: 'cruise_control', label: 'Fartpilot' },
  { id: 'parking_sensors', label: 'Parkeringssensorer' },
  { id: 'backup_camera', label: 'Bakkamera' },
  { id: 'heated_seats', label: 'Sædevarme' },
  { id: 'leather_seats', label: 'Lædersæder' },
  { id: 'sunroof', label: 'Panoramatag' },
  { id: 'keyless', label: 'Nøglefri start' },
  { id: 'apple_carplay', label: 'Apple CarPlay' },
  { id: 'android_auto', label: 'Android Auto' },
  { id: 'roof_rack', label: 'Tagbøjler' },
  { id: 'tow_hitch', label: 'Anhængertræk' },
  { id: 'child_seat', label: 'Barnestol inkl.' },
  { id: 'winter_tires', label: 'Vinterdæk' },
];

interface EditVehicleDialogProps {
  vehicle: Vehicle;
  onUpdate: (id: string, updates: Partial<Vehicle>) => Promise<boolean>;
}

const EditVehicleDialog = ({ vehicle, onUpdate }: EditVehicleDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    daily_price: vehicle.daily_price || undefined,
    weekly_price: vehicle.weekly_price || undefined,
    monthly_price: vehicle.monthly_price || undefined,
    included_km: vehicle.included_km || 100,
    extra_km_price: vehicle.extra_km_price || 2.5,
    unlimited_km: vehicle.unlimited_km || false,
    description: vehicle.description || '',
    image_url: vehicle.image_url || '',
    features: vehicle.features || [],
    deposit_required: vehicle.deposit_required || false,
    deposit_amount: vehicle.deposit_amount || 0,
    prepaid_rent_enabled: vehicle.prepaid_rent_enabled || false,
    prepaid_rent_months: vehicle.prepaid_rent_months || 1,
    payment_schedule: (vehicle.payment_schedule || 'upfront') as PaymentScheduleType,
    use_custom_location: vehicle.use_custom_location || false,
    location_address: vehicle.location_address || '',
    location_postal_code: vehicle.location_postal_code || '',
    location_city: vehicle.location_city || '',
    latitude: vehicle.latitude || undefined as number | undefined,
    longitude: vehicle.longitude || undefined as number | undefined,
    vehicle_value: vehicle.vehicle_value || undefined as number | undefined,
    // Trailer fields
    trailer_type: vehicle.trailer_type || '',
    internal_length_cm: vehicle.internal_length_cm || undefined as number | undefined,
    internal_width_cm: vehicle.internal_width_cm || undefined as number | undefined,
    internal_height_cm: vehicle.internal_height_cm || undefined as number | undefined,
    plug_type: vehicle.plug_type || '',
    tempo_approved: vehicle.tempo_approved || false,
    requires_b_license: vehicle.requires_b_license ?? true,
    has_ramps: vehicle.has_ramps || false,
    has_winch: vehicle.has_winch || false,
    has_tarpaulin: vehicle.has_tarpaulin || false,
    has_net: vehicle.has_net || false,
    has_jockey_wheel: vehicle.has_jockey_wheel || false,
    has_lock_included: vehicle.has_lock_included || false,
    has_adapter: vehicle.has_adapter || false,
    // Caravan fields
    adult_sleeping_capacity: vehicle.adult_sleeping_capacity || undefined as number | undefined,
    child_sleeping_capacity: vehicle.child_sleeping_capacity || undefined as number | undefined,
    layout_type: vehicle.layout_type || '',
    has_fridge: vehicle.has_fridge || false,
    has_freezer: vehicle.has_freezer || false,
    has_gas_burner: vehicle.has_gas_burner || false,
    has_toilet: vehicle.has_toilet || false,
    has_shower: vehicle.has_shower || false,
    has_hot_water: vehicle.has_hot_water || false,
    has_awning_tent: vehicle.has_awning_tent || false,
    has_mover: vehicle.has_mover || false,
    has_bike_rack: vehicle.has_bike_rack || false,
    has_ac: vehicle.has_ac || false,
    has_floor_heating: vehicle.has_floor_heating || false,
    has_tv: vehicle.has_tv || false,
    service_included: vehicle.service_included || false,
    camping_furniture_included: vehicle.camping_furniture_included || false,
    gas_bottle_included: vehicle.gas_bottle_included || false,
    pets_allowed: vehicle.pets_allowed || false,
    smoking_allowed: vehicle.smoking_allowed || false,
    festival_use_allowed: vehicle.festival_use_allowed || false,
    total_weight: vehicle.total_weight || undefined as number | undefined,
    has_kitchen: vehicle.has_kitchen || false,
    has_bathroom: vehicle.has_bathroom || false,
    has_awning: vehicle.has_awning || false,
    // Cleaning fees
    exterior_cleaning_fee: vehicle.exterior_cleaning_fee || 350,
    interior_cleaning_fee: vehicle.interior_cleaning_fee || 500,
    // Pickup/Dropoff times
    default_pickup_time: vehicle.default_pickup_time || '10:00',
    default_dropoff_time: vehicle.default_dropoff_time || '08:00',
    late_return_charge_enabled: vehicle.late_return_charge_enabled ?? true,
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // Reset form to vehicle's current values
      setFormData({
        daily_price: vehicle.daily_price || undefined,
        weekly_price: vehicle.weekly_price || undefined,
        monthly_price: vehicle.monthly_price || undefined,
        included_km: vehicle.included_km || 100,
        extra_km_price: vehicle.extra_km_price || 2.5,
        unlimited_km: vehicle.unlimited_km || false,
        description: vehicle.description || '',
        image_url: vehicle.image_url || '',
        features: vehicle.features || [],
        deposit_required: vehicle.deposit_required || false,
        deposit_amount: vehicle.deposit_amount || 0,
        prepaid_rent_enabled: vehicle.prepaid_rent_enabled || false,
        prepaid_rent_months: vehicle.prepaid_rent_months || 1,
        payment_schedule: (vehicle.payment_schedule || 'upfront') as PaymentScheduleType,
        use_custom_location: vehicle.use_custom_location || false,
        location_address: vehicle.location_address || '',
        location_postal_code: vehicle.location_postal_code || '',
        location_city: vehicle.location_city || '',
        latitude: vehicle.latitude || undefined,
        longitude: vehicle.longitude || undefined,
        vehicle_value: vehicle.vehicle_value || undefined,
        // Trailer fields
        trailer_type: vehicle.trailer_type || '',
        internal_length_cm: vehicle.internal_length_cm || undefined,
        internal_width_cm: vehicle.internal_width_cm || undefined,
        internal_height_cm: vehicle.internal_height_cm || undefined,
        plug_type: vehicle.plug_type || '',
        tempo_approved: vehicle.tempo_approved || false,
        requires_b_license: vehicle.requires_b_license ?? true,
        has_ramps: vehicle.has_ramps || false,
        has_winch: vehicle.has_winch || false,
        has_tarpaulin: vehicle.has_tarpaulin || false,
        has_net: vehicle.has_net || false,
        has_jockey_wheel: vehicle.has_jockey_wheel || false,
        has_lock_included: vehicle.has_lock_included || false,
        has_adapter: vehicle.has_adapter || false,
        // Caravan fields
        adult_sleeping_capacity: vehicle.adult_sleeping_capacity || undefined,
        child_sleeping_capacity: vehicle.child_sleeping_capacity || undefined,
        layout_type: vehicle.layout_type || '',
        has_fridge: vehicle.has_fridge || false,
        has_freezer: vehicle.has_freezer || false,
        has_gas_burner: vehicle.has_gas_burner || false,
        has_toilet: vehicle.has_toilet || false,
        has_shower: vehicle.has_shower || false,
        has_hot_water: vehicle.has_hot_water || false,
        has_awning_tent: vehicle.has_awning_tent || false,
        has_mover: vehicle.has_mover || false,
        has_bike_rack: vehicle.has_bike_rack || false,
        has_ac: vehicle.has_ac || false,
        has_floor_heating: vehicle.has_floor_heating || false,
        has_tv: vehicle.has_tv || false,
        service_included: vehicle.service_included || false,
        camping_furniture_included: vehicle.camping_furniture_included || false,
        gas_bottle_included: vehicle.gas_bottle_included || false,
        pets_allowed: vehicle.pets_allowed || false,
        smoking_allowed: vehicle.smoking_allowed || false,
        festival_use_allowed: vehicle.festival_use_allowed || false,
        total_weight: vehicle.total_weight || undefined,
        has_kitchen: vehicle.has_kitchen || false,
        has_bathroom: vehicle.has_bathroom || false,
        has_awning: vehicle.has_awning || false,
        // Cleaning fees
        exterior_cleaning_fee: vehicle.exterior_cleaning_fee || 350,
        interior_cleaning_fee: vehicle.interior_cleaning_fee || 500,
        // Pickup/Dropoff times
        default_pickup_time: vehicle.default_pickup_time || '10:00',
        default_dropoff_time: vehicle.default_dropoff_time || '08:00',
        late_return_charge_enabled: vehicle.late_return_charge_enabled ?? true,
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Kun billedfiler er tilladt');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Billedet må max være 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${vehicle.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('vehicle-images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Billede uploadet!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Kunne ikke uploade billede');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId],
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    let finalData = { ...formData };
    
    // Geocode the address if custom location is enabled
    if (formData.use_custom_location && formData.location_address) {
      try {
        const { data, error } = await supabase.functions.invoke('geocode-address', {
          body: {
            address: formData.location_address,
            postalCode: formData.location_postal_code,
            city: formData.location_city,
          },
        });
        
        if (!error && data?.latitude && data?.longitude) {
          finalData = {
            ...finalData,
            latitude: data.latitude,
            longitude: data.longitude,
          };
        }
      } catch (err) {
        console.error('Geocoding failed:', err);
        // Continue without coordinates
      }
    } else if (!formData.use_custom_location) {
      // Clear coordinates if custom location is disabled
      finalData = {
        ...finalData,
        latitude: undefined,
        longitude: undefined,
      };
    }
    
    const success = await onUpdate(vehicle.id, finalData);
    setIsLoading(false);
    if (success) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs">
          <Edit className="w-4 h-4 mr-1" />
          Rediger
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Rediger {vehicle.make} {vehicle.model}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Vehicle Image */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Billede</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                {formData.image_url ? (
                  <img 
                    src={formData.image_url} 
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Car className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Upload billede
                </Button>
                {formData.image_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Fjern
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Prices */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Priser</Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Pr. dag (kr)</Label>
                <Input
                  type="number"
                  value={formData.daily_price || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    daily_price: parseFloat(e.target.value) || undefined 
                  }))}
                  placeholder="499"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Pr. uge (kr)</Label>
                <Input
                  type="number"
                  value={formData.weekly_price || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    weekly_price: parseFloat(e.target.value) || undefined 
                  }))}
                  placeholder="2.800"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Pr. måned (kr)</Label>
                <Input
                  type="number"
                  value={formData.monthly_price || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    monthly_price: parseFloat(e.target.value) || undefined 
                  }))}
                  placeholder="9.900"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Value for Vanvidskørsel */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Bilens værdi (vanvidskørsel)</Label>
            <div className="space-y-2">
              <Input
                type="number"
                value={formData.vehicle_value || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  vehicle_value: parseFloat(e.target.value) || undefined 
                }))}
                placeholder="F.eks. 150.000"
              />
              <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium text-yellow-600 mb-1">Vigtig information</p>
                    <p>Denne værdi bruges ved vanvidskørsel-ansvar i lejekontrakten. Værdien må <strong>aldrig</strong> være højere end den faktiske købspris.</p>
                    <p className="mt-1">LEJIO kan foretage stikprøvekontrol og kræve dokumentation (slutseddel eller bankoverførsel).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Unlimited KM checkbox */}
          <div 
            className="flex items-center space-x-3 p-3 rounded-xl bg-mint/10 border border-mint/20 cursor-pointer"
            onClick={() => setFormData(prev => ({ ...prev, unlimited_km: !prev.unlimited_km }))}
          >
            <Checkbox
              id="edit_unlimited_km"
              checked={formData.unlimited_km || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, unlimited_km: !!checked }))}
            />
            <label htmlFor="edit_unlimited_km" className="text-sm font-medium cursor-pointer select-none">
              Fri km (ingen km-begrænsning)
            </label>
          </div>

          {/* Kilometers - only show if not unlimited */}
          {!formData.unlimited_km && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Inkl. km/dag</Label>
                <Input
                  type="number"
                  value={formData.included_km || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    included_km: parseInt(e.target.value) || undefined 
                  }))}
                  placeholder="100"
                />
              </div>
              <div className="space-y-2">
                <Label>Ekstra km pris (kr)</Label>
                <Input
                  type="number"
                  step="0.50"
                  value={formData.extra_km_price || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    extra_km_price: parseFloat(e.target.value) || undefined 
                  }))}
                  placeholder="2,50"
                />
              </div>
            </div>
          )}

          {/* Cleaning Fees */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Rengøringsgebyrer</Label>
            <p className="text-xs text-muted-foreground">
              Gebyrer der opkræves hvis bilen returneres snavset
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Udvendig rengøring (kr)</Label>
                <Input
                  type="number"
                  value={formData.exterior_cleaning_fee || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    exterior_cleaning_fee: parseFloat(e.target.value) || 350 
                  }))}
                  placeholder="350"
                />
                <p className="text-xs text-muted-foreground">Standard: 350 kr</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Indvendig rengøring (kr)</Label>
                <Input
                  type="number"
                  max={1500}
                  value={formData.interior_cleaning_fee || ''}
                  onChange={(e) => {
                    const value = Math.min(parseFloat(e.target.value) || 500, 1500);
                    setFormData(prev => ({ ...prev, interior_cleaning_fee: value }));
                  }}
                  placeholder="500"
                />
                <p className="text-xs text-muted-foreground">Max: 1.500 kr</p>
              </div>
            </div>
          </div>

          {/* Pickup/Dropoff Times */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Afhentnings- og afleveringstider
            </Label>
            <p className="text-xs text-muted-foreground">
              Standardtider for afhentning og aflevering. Lejere kan vælge tidspunkt ved booking.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Afhentning fra kl.</Label>
                <Input
                  type="time"
                  value={formData.default_pickup_time || '10:00'}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    default_pickup_time: e.target.value 
                  }))}
                />
                <p className="text-xs text-muted-foreground">Standard: 10:00</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Aflevering senest kl.</Label>
                <Input
                  type="time"
                  value={formData.default_dropoff_time || '08:00'}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    default_dropoff_time: e.target.value 
                  }))}
                />
                <p className="text-xs text-muted-foreground">Standard: 08:00</p>
              </div>
            </div>
            
            {/* Late return charge toggle */}
            <div 
              className="flex items-center space-x-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20 cursor-pointer"
              onClick={() => setFormData(prev => ({ ...prev, late_return_charge_enabled: !prev.late_return_charge_enabled }))}
            >
              <Checkbox
                id="edit_late_return_charge"
                checked={formData.late_return_charge_enabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, late_return_charge_enabled: !!checked }))}
              />
              <div className="flex-1">
                <label htmlFor="edit_late_return_charge" className="text-sm font-medium cursor-pointer select-none">
                  Gebyr ved sen aflevering
                </label>
                <p className="text-xs text-muted-foreground">
                  Hvis bilen afleveres senere end den valgte tid, betaler lejer for en ekstra lejedag
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Beskrivelse</Label>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Fortæl om din bil..."
            />
          </div>

          {/* Deposit Section */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Depositum & Forudbetaling</Label>
            
            {/* Deposit checkbox */}
            <div 
              className="flex items-center space-x-3 p-3 rounded-xl bg-lavender/10 border border-lavender/20 cursor-pointer"
              onClick={() => setFormData(prev => ({ ...prev, deposit_required: !prev.deposit_required }))}
            >
              <Checkbox
                id="edit_deposit_required"
                checked={formData.deposit_required || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, deposit_required: !!checked }))}
              />
              <label htmlFor="edit_deposit_required" className="text-sm font-medium cursor-pointer select-none">
                Kræv depositum
              </label>
            </div>

            {formData.deposit_required && (
              <div className="space-y-2 pl-6">
                <Label className="text-xs text-muted-foreground">Depositum beløb (kr)</Label>
                <Input
                  type="number"
                  value={formData.deposit_amount || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, deposit_amount: parseFloat(e.target.value) || 0 }))}
                  placeholder="2.500"
                />
              </div>
            )}

            {/* Prepaid rent checkbox */}
            <div 
              className="flex items-center space-x-3 p-3 rounded-xl bg-accent/10 border border-accent/20 cursor-pointer"
              onClick={() => setFormData(prev => ({ ...prev, prepaid_rent_enabled: !prev.prepaid_rent_enabled }))}
            >
              <Checkbox
                id="edit_prepaid_rent"
                checked={formData.prepaid_rent_enabled || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, prepaid_rent_enabled: !!checked }))}
              />
              <label htmlFor="edit_prepaid_rent" className="text-sm font-medium cursor-pointer select-none">
                Kræv forudbetalt leje
              </label>
            </div>

            {formData.prepaid_rent_enabled && (
              <div className="space-y-2 pl-6">
                <Label className="text-xs text-muted-foreground">Antal måneder forudbetaling</Label>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  value={formData.prepaid_rent_months || 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, prepaid_rent_months: parseInt(e.target.value) || 1 }))}
                  placeholder="1"
                />
                <p className="text-xs text-muted-foreground">
                  Lejer skal betale {formData.prepaid_rent_months || 1} måneds leje forud ved første betaling
                </p>
              </div>
              )}
            </div>

            {/* Payment Schedule */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Betalingsplan</Label>
              <RadioGroup
                value={formData.payment_schedule || 'upfront'}
                onValueChange={(value: PaymentScheduleType) => 
                  setFormData(prev => ({ ...prev, payment_schedule: value }))
                }
                className="space-y-2"
              >
                <div 
                  className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    formData.payment_schedule === 'upfront' 
                      ? 'bg-primary/10 border-primary/30' 
                      : 'bg-muted/30 border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, payment_schedule: 'upfront' as PaymentScheduleType }))}
                >
                  <RadioGroupItem value="upfront" id="edit_payment_upfront" />
                  <CreditCard className="w-4 h-4 text-primary" />
                  <div className="flex-1">
                    <label htmlFor="edit_payment_upfront" className="text-sm font-medium cursor-pointer">
                      Forudbetaling
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Lejer betaler hele lejeperioden på forhånd
                    </p>
                  </div>
                </div>
                <div 
                  className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    formData.payment_schedule === 'monthly' 
                      ? 'bg-coral/10 border-coral/30' 
                      : 'bg-muted/30 border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, payment_schedule: 'monthly' as PaymentScheduleType }))}
                >
                  <RadioGroupItem value="monthly" id="edit_payment_monthly" />
                  <CalendarClock className="w-4 h-4 text-coral" />
                  <div className="flex-1">
                    <label htmlFor="edit_payment_monthly" className="text-sm font-medium cursor-pointer">
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
              onClick={() => setFormData(prev => ({ ...prev, use_custom_location: !prev.use_custom_location }))}
            >
              <Checkbox
                id="edit_use_custom_location"
                checked={formData.use_custom_location || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, use_custom_location: !!checked }))}
              />
              <MapPin className="w-4 h-4 text-primary" />
              <label htmlFor="edit_use_custom_location" className="text-sm font-medium cursor-pointer select-none">
                Bilen står på en anden adresse
              </label>
            </div>
            
            <p className="text-xs text-muted-foreground">
              {formData.use_custom_location 
                ? 'Indtast adressen hvor bilen kan afhentes' 
                : 'Bilen vises på din firmaadresse på kortet'}
            </p>

            {formData.use_custom_location && (
              <div className="space-y-3 pl-6 animate-in slide-in-from-top-2">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Adresse</Label>
                  <Input
                    value={formData.location_address || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, location_address: e.target.value }))}
                    placeholder="Gade og husnummer"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Postnummer</Label>
                    <Input
                      value={formData.location_postal_code || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, location_postal_code: e.target.value }))}
                      placeholder="2100"
                      maxLength={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">By</Label>
                    <Input
                      value={formData.location_city || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, location_city: e.target.value }))}
                      placeholder="København"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Trailer specific fields */}
          {vehicle.vehicle_type === 'trailer' && (
            <TrailerFields 
              vehicleDetails={formData as unknown as Record<string, unknown>}
              setVehicleDetails={(fn) => setFormData(prev => fn(prev as unknown as Record<string, unknown>) as typeof prev)}
            />
          )}

          {/* Caravan specific fields */}
          {vehicle.vehicle_type === 'campingvogn' && (
            <CaravanFields 
              vehicleDetails={formData as unknown as Record<string, unknown>}
              setVehicleDetails={(fn) => setFormData(prev => fn(prev as unknown as Record<string, unknown>) as typeof prev)}
            />
          )}

          {/* Features - only for cars */}
          {vehicle.vehicle_type === 'bil' && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Udstyr & Features</Label>
              <div className="grid grid-cols-2 gap-2">
                {VEHICLE_FEATURES.map(feature => (
                  <div
                    key={feature.id}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleFeatureToggle(feature.id)}
                  >
                    <Checkbox
                      id={feature.id}
                      checked={formData.features.includes(feature.id)}
                      onCheckedChange={() => handleFeatureToggle(feature.id)}
                    />
                    <label 
                      htmlFor={feature.id} 
                      className="text-sm cursor-pointer select-none"
                    >
                      {feature.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => setOpen(false)}
            >
              Annuller
            </Button>
            <Button 
              variant="warm" 
              className="flex-1" 
              onClick={handleSave} 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Gem ændringer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicleDialog;
