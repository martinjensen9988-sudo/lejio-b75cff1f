import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGpsDevices } from '@/hooks/useGpsDevices';
import { useVehicles } from '@/hooks/useVehicles';

interface AddGpsDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GPS_PROVIDERS = [
  { value: 'teltonika', label: 'Teltonika' },
  { value: 'ruptela', label: 'Ruptela' },
  { value: 'autopi', label: 'AutoPi' },
  { value: 'generic', label: 'Generisk / Anden' },
];

export const AddGpsDeviceDialog = ({ open, onOpenChange }: AddGpsDeviceDialogProps) => {
  const { addDevice } = useGpsDevices();
  const { vehicles } = useVehicles();
  const [formData, setFormData] = useState({
    vehicle_id: '',
    device_id: '',
    provider: 'generic',
    device_name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await addDevice.mutateAsync({
      vehicle_id: formData.vehicle_id,
      device_id: formData.device_id,
      provider: formData.provider,
      device_name: formData.device_name || undefined,
    });

    setFormData({ vehicle_id: '', device_id: '', provider: 'generic', device_name: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tilføj GPS-enhed</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle">Køretøj *</Label>
            <Select
              value={formData.vehicle_id}
              onValueChange={(value) => setFormData({ ...formData, vehicle_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Vælg køretøj" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} ({vehicle.registration})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">GPS-udbyder</Label>
            <Select
              value={formData.provider}
              onValueChange={(value) => setFormData({ ...formData, provider: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GPS_PROVIDERS.map((provider) => (
                  <SelectItem key={provider.value} value={provider.value}>
                    {provider.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="device_id">Enheds-ID / IMEI *</Label>
            <Input
              id="device_id"
              value={formData.device_id}
              onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
              placeholder="f.eks. 352656100123456"
              required
            />
            <p className="text-xs text-muted-foreground">
              Dette ID bruges af GPS-udbyderen til at identificere enheden
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="device_name">Enhedsnavn (valgfrit)</Label>
            <Input
              id="device_name"
              value={formData.device_name}
              onChange={(e) => setFormData({ ...formData, device_name: e.target.value })}
              placeholder="f.eks. GPS Tracker #1"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuller
            </Button>
            <Button type="submit" disabled={!formData.vehicle_id || !formData.device_id || addDevice.isPending}>
              {addDevice.isPending ? 'Tilføjer...' : 'Tilføj enhed'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
