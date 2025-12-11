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
import { Edit, Loader2, Upload, X, Car, CreditCard, CalendarClock } from 'lucide-react';
import { toast } from 'sonner';

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
    const success = await onUpdate(vehicle.id, formData);
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

          {/* Features */}
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
