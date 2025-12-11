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
import { Vehicle } from '@/hooks/useVehicles';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Loader2, Upload, X, Car } from 'lucide-react';
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
    description: vehicle.description || '',
    image_url: vehicle.image_url || '',
    features: vehicle.features || [],
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
        description: vehicle.description || '',
        image_url: vehicle.image_url || '',
        features: vehicle.features || [],
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

          {/* Kilometers */}
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
