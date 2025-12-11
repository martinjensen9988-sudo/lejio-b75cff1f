import { useState } from "react";
import { differenceInDays, format } from "date-fns";
import { da } from "date-fns/locale";
import { Calendar, Car, Check, User, Mail, Phone, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { SearchVehicle, SearchFiltersState } from "@/pages/Search";
import { supabase } from "@/integrations/supabase/client";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  vehicle: SearchVehicle;
  filters: SearchFiltersState;
}

const BookingModal = ({ open, onClose, vehicle, filters }: BookingModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"details" | "success">("details");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
    acceptTerms: false,
  });

  const days =
    filters.startDate && filters.endDate
      ? differenceInDays(filters.endDate, filters.startDate) + 1
      : 1;
  const totalPrice = (vehicle.daily_price || 0) * days;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Udfyld alle felter",
        description: "Navn, email og telefon er påkrævet",
        variant: "destructive",
      });
      return;
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Acceptér betingelser",
        description: "Du skal acceptere lejebetingelserne for at fortsætte",
        variant: "destructive",
      });
      return;
    }

    if (!filters.startDate || !filters.endDate) {
      toast({
        title: "Vælg datoer",
        description: "Vælg venligst start- og slutdato for din booking",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Fetch vehicle owner's profile for email
      const { data: ownerProfile, error: profileError } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', vehicle.owner_id)
        .single();

      if (profileError) {
        console.error('Error fetching owner profile:', profileError);
        throw new Error('Kunne ikke finde udlejer');
      }

      // Create booking in database
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          vehicle_id: vehicle.id,
          lessor_id: vehicle.owner_id,
          start_date: format(filters.startDate!, 'yyyy-MM-dd'),
          end_date: format(filters.endDate!, 'yyyy-MM-dd'),
          total_price: totalPrice,
          status: 'pending',
          renter_name: formData.name,
          renter_email: formData.email,
          renter_phone: formData.phone,
          notes: formData.notes || null,
        });

      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        throw new Error('Kunne ikke oprette booking');
      }

      // Send email notification to lessor
      const { error: emailError } = await supabase.functions.invoke('send-booking-notification', {
        body: {
          lessorEmail: ownerProfile.email,
          lessorName: ownerProfile.full_name || 'Udlejer',
          renterName: formData.name,
          renterEmail: formData.email,
          renterPhone: formData.phone,
          vehicleMake: vehicle.make,
          vehicleModel: vehicle.model,
          vehicleRegistration: vehicle.registration,
          startDate: format(filters.startDate!, 'dd. MMMM yyyy', { locale: da }),
          endDate: format(filters.endDate!, 'dd. MMMM yyyy', { locale: da }),
          totalPrice: totalPrice,
          notes: formData.notes,
        },
      });

      if (emailError) {
        console.error('Email notification error:', emailError);
        // Don't throw - booking was created, just email failed
      }

      setStep("success");

      toast({
        title: "Booking sendt!",
        description: "Udlejeren vil kontakte dig snarest",
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Fejl",
        description: error instanceof Error ? error.message : "Der opstod en fejl",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("details");
    setFormData({
      name: "",
      email: "",
      phone: "",
      notes: "",
      acceptTerms: false,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {step === "details" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                Book {vehicle.make} {vehicle.model}
              </DialogTitle>
              <DialogDescription>
                Udfyld dine oplysninger for at sende en bookingforespørgsel
              </DialogDescription>
            </DialogHeader>

            {/* Booking Summary */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bil:</span>
                <span className="font-medium">
                  {vehicle.make} {vehicle.model} {vehicle.variant}
                </span>
              </div>
              {filters.startDate && filters.endDate && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Periode:</span>
                    <span className="font-medium">
                      {format(filters.startDate, "dd. MMM", { locale: da })} -{" "}
                      {format(filters.endDate, "dd. MMM yyyy", { locale: da })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Antal dage:</span>
                    <span className="font-medium">{days}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dagspris:</span>
                <span className="font-medium">
                  {vehicle.daily_price?.toLocaleString("da-DK")} kr
                </span>
              </div>
              {vehicle.unlimited_km ? (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kilometer:</span>
                  <span className="font-medium text-accent">✓ Fri km</span>
                </div>
              ) : (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Inkl. km:</span>
                  <span className="font-medium">{vehicle.included_km} km/dag</span>
                </div>
              )}
              <div className="pt-2 border-t border-border flex justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg text-primary">
                  {totalPrice.toLocaleString("da-DK")} kr
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Fulde navn *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Dit navn"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="din@email.dk"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="+45 12 34 56 78"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Besked til udlejer (valgfri)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Evt. spørgsmål eller ønsker..."
                  rows={3}
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      acceptTerms: checked as boolean,
                    }))
                  }
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground leading-tight cursor-pointer"
                >
                  Jeg accepterer lejebetingelserne og bekræfter at jeg har gyldigt
                  kørekort
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                >
                  Annuller
                </Button>
                <Button type="submit" variant="warm" className="flex-1" disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Calendar className="w-4 h-4 mr-2" />
                  )}
                  Send forespørgsel
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">Booking sendt!</h3>
            <p className="text-muted-foreground mb-6">
              Din bookingforespørgsel er sendt til udlejeren. Du vil modtage en
              bekræftelse på {formData.email} snarest.
            </p>
            <Button variant="warm" onClick={handleClose}>
              Luk
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
