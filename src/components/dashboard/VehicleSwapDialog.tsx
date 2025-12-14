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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowRightLeft, Car, Loader2, AlertTriangle } from 'lucide-react';
import { Vehicle } from '@/hooks/useVehicles';

interface Booking {
  id: string;
  vehicle_id: string;
  renter_name?: string | null;
  renter_email?: string | null;
  start_date: string;
  end_date: string;
  status: string;
}

interface VehicleSwapDialogProps {
  booking: Booking;
  currentVehicle: Vehicle;
  availableVehicles: Vehicle[];
  onSwapComplete: () => void;
}

const VehicleSwapDialog = ({ booking, currentVehicle, availableVehicles, onSwapComplete }: VehicleSwapDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [swapReason, setSwapReason] = useState<'service' | 'breakdown' | 'damage' | 'upgrade'>('service');
  const [currentOdometer, setCurrentOdometer] = useState(currentVehicle.current_odometer || 0);
  const [notes, setNotes] = useState('');

  // Filter out the current vehicle from available vehicles
  const eligibleVehicles = availableVehicles.filter(v => 
    v.id !== currentVehicle.id && 
    v.is_available && 
    v.service_status !== 'blocked'
  );

  const handleSwap = async () => {
    if (!selectedVehicleId) {
      toast.error('Vælg venligst et nyt køretøj');
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Ikke logget ind');

      // 1. Create vehicle swap record
      const { error: swapError } = await supabase
        .from('vehicle_swaps')
        .insert({
          booking_id: booking.id,
          original_vehicle_id: currentVehicle.id,
          new_vehicle_id: selectedVehicleId,
          swap_reason: swapReason,
          original_odometer: currentOdometer,
          notes: notes,
          created_by: user.id,
        });

      if (swapError) throw swapError;

      // 2. Update booking with new vehicle
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ vehicle_id: selectedVehicleId })
        .eq('id', booking.id);

      if (bookingError) throw bookingError;

      // 3. Update old vehicle status
      const { error: oldVehicleError } = await supabase
        .from('vehicles')
        .update({ 
          service_status: swapReason === 'breakdown' || swapReason === 'damage' ? 'blocked' : 'service_required',
          current_odometer: currentOdometer,
        })
        .eq('id', currentVehicle.id);

      if (oldVehicleError) throw oldVehicleError;

      // 4. Update new vehicle availability
      const { error: newVehicleError } = await supabase
        .from('vehicles')
        .update({ is_available: false })
        .eq('id', selectedVehicleId);

      if (newVehicleError) throw newVehicleError;

      toast.success('Køretøj udskiftet succesfuldt');
      setOpen(false);
      onSwapComplete();
    } catch (err) {
      console.error('Error swapping vehicle:', err);
      toast.error('Kunne ikke udskifte køretøj');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedVehicle = eligibleVehicles.find(v => v.id === selectedVehicleId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowRightLeft className="w-4 h-4" />
          Byt køretøj
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Udskift køretøj
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Vehicle Info */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground mb-2">Nuværende køretøj</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Car className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">{currentVehicle.make} {currentVehicle.model}</p>
                <p className="text-sm text-muted-foreground">{currentVehicle.registration}</p>
              </div>
            </div>
          </div>

          {/* Booking Info */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground mb-2">Booking</p>
            <p className="font-medium">{booking.renter_name || booking.renter_email}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(booking.start_date).toLocaleDateString('da-DK')} - {new Date(booking.end_date).toLocaleDateString('da-DK')}
            </p>
          </div>

          {/* Swap Reason */}
          <div className="space-y-2">
            <Label>Årsag til udskiftning</Label>
            <Select value={swapReason} onValueChange={(value: any) => setSwapReason(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="service">🔧 Service</SelectItem>
                <SelectItem value="breakdown">🚨 Nedbrud</SelectItem>
                <SelectItem value="damage">💥 Skade</SelectItem>
                <SelectItem value="upgrade">⬆️ Opgradering</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Current Odometer */}
          <div className="space-y-2">
            <Label>Km-tal ved udskiftning</Label>
            <Input
              type="number"
              value={currentOdometer}
              onChange={(e) => setCurrentOdometer(parseInt(e.target.value) || 0)}
            />
          </div>

          {/* Select New Vehicle */}
          <div className="space-y-2">
            <Label>Vælg nyt køretøj</Label>
            {eligibleVehicles.length === 0 ? (
              <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Ingen ledige køretøjer til udskiftning</span>
                </div>
              </div>
            ) : (
              <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Vælg køretøj..." />
                </SelectTrigger>
                <SelectContent>
                  {eligibleVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} ({vehicle.registration})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Selected Vehicle Preview */}
          {selectedVehicle && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-muted-foreground mb-2">Nyt køretøj</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Car className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">{selectedVehicle.make} {selectedVehicle.model}</p>
                  <p className="text-sm text-muted-foreground">{selectedVehicle.registration}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>Noter (valgfrit)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Evt. bemærkninger til udskiftningen..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Annuller
            </Button>
            <Button 
              onClick={handleSwap} 
              disabled={isLoading || !selectedVehicleId}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Udskifter...
                </>
              ) : (
                'Bekræft udskiftning'
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Bemærk: Lejeren vil modtage et tillæg til lejekontrakten med det nye køretøj.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleSwapDialog;
