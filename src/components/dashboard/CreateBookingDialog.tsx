import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Vehicle } from '@/hooks/useVehicles';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Plus, CalendarIcon, Loader2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { da } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CreateBookingDialogProps {
  vehicles: Vehicle[];
  onBookingCreated: () => void;
}

const CreateBookingDialog = ({ vehicles, onBookingCreated }: CreateBookingDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicle_id: '',
    start_date: undefined as Date | undefined,
    end_date: undefined as Date | undefined,
    renter_name: '',
    renter_email: '',
    renter_phone: '',
    notes: '',
  });

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicle_id);
  
  const calculatePrice = () => {
    if (!formData.start_date || !formData.end_date || !selectedVehicle) return 0;
    
    const days = differenceInDays(formData.end_date, formData.start_date) + 1;
    
    // Use monthly price if >= 30 days
    if (days >= 30 && selectedVehicle.monthly_price) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      return (months * selectedVehicle.monthly_price) + 
             (remainingDays * (selectedVehicle.daily_price || 0));
    }
    
    // Use weekly price if >= 7 days
    if (days >= 7 && selectedVehicle.weekly_price) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      return (weeks * selectedVehicle.weekly_price) + 
             (remainingDays * (selectedVehicle.daily_price || 0));
    }
    
    // Use daily price
    return days * (selectedVehicle.daily_price || 0);
  };

  const totalPrice = calculatePrice();
  const days = formData.start_date && formData.end_date 
    ? differenceInDays(formData.end_date, formData.start_date) + 1 
    : 0;

  const resetForm = () => {
    setFormData({
      vehicle_id: '',
      start_date: undefined,
      end_date: undefined,
      renter_name: '',
      renter_email: '',
      renter_phone: '',
      notes: '',
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) resetForm();
  };

  const handleSubmit = async () => {
    if (!user || !formData.vehicle_id || !formData.start_date || !formData.end_date || !formData.renter_name) {
      toast.error('Udfyld venligst alle påkrævede felter');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from('bookings').insert({
        vehicle_id: formData.vehicle_id,
        lessor_id: user.id,
        start_date: format(formData.start_date, 'yyyy-MM-dd'),
        end_date: format(formData.end_date, 'yyyy-MM-dd'),
        renter_name: formData.renter_name,
        renter_email: formData.renter_email || null,
        renter_phone: formData.renter_phone || null,
        notes: formData.notes || null,
        total_price: totalPrice,
        status: 'confirmed',
      });

      if (error) throw error;

      toast.success('Booking oprettet!');
      onBookingCreated();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Kunne ikke oprette booking');
    } finally {
      setIsLoading(false);
    }
  };

  const availableVehicles = vehicles.filter(v => v.is_available);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Manuel booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Opret manuel booking
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Vehicle Selection */}
          <div className="space-y-2">
            <Label>Vælg bil *</Label>
            <Select
              value={formData.vehicle_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Vælg en bil" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {availableVehicles.map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} ({vehicle.registration})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Startdato *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.start_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date 
                      ? format(formData.start_date, "d. MMM yyyy", { locale: da })
                      : "Vælg dato"
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.start_date}
                    onSelect={(date) => setFormData(prev => ({ 
                      ...prev, 
                      start_date: date,
                      end_date: prev.end_date && date && prev.end_date < date ? date : prev.end_date
                    }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Slutdato *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.end_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.end_date 
                      ? format(formData.end_date, "d. MMM yyyy", { locale: da })
                      : "Vælg dato"
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.end_date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, end_date: date }))}
                    disabled={(date) => date < (formData.start_date || new Date())}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Price Summary */}
          {selectedVehicle && days > 0 && (
            <div className="p-4 rounded-xl bg-mint/10 border border-mint/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">{days} dag{days > 1 ? 'e' : ''}</p>
                  <p className="font-display font-bold text-lg">{totalPrice.toLocaleString('da-DK')} kr</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  {selectedVehicle.daily_price && <p>{selectedVehicle.daily_price} kr/dag</p>}
                </div>
              </div>
            </div>
          )}

          {/* Renter Info */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Lejer information</Label>
            
            <div className="space-y-2">
              <Label>Navn *</Label>
              <Input
                value={formData.renter_name}
                onChange={(e) => setFormData(prev => ({ ...prev, renter_name: e.target.value }))}
                placeholder="Kundens fulde navn"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.renter_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, renter_email: e.target.value }))}
                  placeholder="kunde@email.dk"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input
                  type="tel"
                  value={formData.renter_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, renter_phone: e.target.value }))}
                  placeholder="+45 12 34 56 78"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Noter</Label>
              <textarea
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Eventuelle noter til bookingen..."
              />
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
              onClick={handleSubmit}
              disabled={isLoading || !formData.vehicle_id || !formData.start_date || !formData.end_date || !formData.renter_name}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Opret booking'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBookingDialog;
