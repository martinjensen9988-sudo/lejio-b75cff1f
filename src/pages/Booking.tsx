import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { format, addDays, addWeeks, addMonths } from "date-fns";
import { da } from "date-fns/locale";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Car,
  Calendar as CalendarIcon,
  Upload,
  FileCheck,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  User,
  Mail,
  Phone,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PeriodType = "daily" | "weekly" | "monthly";

interface Vehicle {
  id: string;
  owner_id: string;
  make: string;
  model: string;
  variant: string | null;
  year: number | null;
  daily_price: number | null;
  weekly_price: number | null;
  monthly_price: number | null;
  image_url: string | null;
  fuel_type: string | null;
  registration: string;
  unlimited_km: boolean;
  included_km: number | null;
  extra_km_price: number | null;
  deposit_required: boolean;
  deposit_amount: number | null;
  prepaid_rent_enabled: boolean;
  prepaid_rent_months: number | null;
}

const Booking = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Booking details
  const [periodType, setPeriodType] = useState<PeriodType>("daily");
  const [periodCount, setPeriodCount] = useState(1);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  // Step 2: Document uploads
  const [driverLicense, setDriverLicense] = useState<File | null>(null);
  const [healthCard, setHealthCard] = useState<File | null>(null);

  // Step 3: Confirmation
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptVanvid, setAcceptVanvid] = useState(false);

  // Fetch vehicle data
  useEffect(() => {
    const fetchVehicle = async () => {
      if (!vehicleId) {
        navigate("/search");
        return;
      }

      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", vehicleId)
        .single();

      if (error || !data) {
        toast({
          title: "Bil ikke fundet",
          description: "Den valgte bil findes ikke længere",
          variant: "destructive",
        });
        navigate("/search");
        return;
      }

      setVehicle(data);
      setLoading(false);
    };

    fetchVehicle();
  }, [vehicleId, navigate, toast]);

  // Calculate end date based on period
  const endDate = useMemo(() => {
    if (!startDate) return undefined;
    switch (periodType) {
      case "monthly":
        return addMonths(startDate, periodCount);
      case "weekly":
        return addWeeks(startDate, periodCount);
      default:
        return addDays(startDate, periodCount - 1);
    }
  }, [startDate, periodType, periodCount]);

  // Calculate pricing
  const pricing = useMemo(() => {
    if (!vehicle) return null;

    let unitPrice = 0;
    let unitLabel = "";

    switch (periodType) {
      case "monthly":
        unitPrice = vehicle.monthly_price || (vehicle.daily_price || 0) * 30;
        unitLabel = "pr. måned";
        break;
      case "weekly":
        unitPrice = vehicle.weekly_price || (vehicle.daily_price || 0) * 7;
        unitLabel = "pr. uge";
        break;
      default:
        unitPrice = vehicle.daily_price || 0;
        unitLabel = "pr. dag";
    }

    const rentalTotal = unitPrice * periodCount;
    const deposit = vehicle.deposit_required ? (vehicle.deposit_amount || 0) : 0;
    const prepaidRent = vehicle.prepaid_rent_enabled && periodType === "monthly"
      ? unitPrice * (vehicle.prepaid_rent_months || 1)
      : 0;

    return {
      unitPrice,
      unitLabel,
      rentalTotal,
      deposit,
      prepaidRent,
      grandTotal: rentalTotal + deposit + prepaidRent,
      periodCount,
      periodType,
    };
  }, [vehicle, periodType, periodCount]);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Fil for stor",
          description: "Maksimum filstørrelse er 10 MB",
          variant: "destructive",
        });
        return;
      }
      setFile(file);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!startDate) {
          toast({ title: "Vælg startdato", variant: "destructive" });
          return false;
        }
        if (!formData.name || !formData.email || !formData.phone) {
          toast({ title: "Udfyld alle påkrævede felter", variant: "destructive" });
          return false;
        }
        return true;
      case 2:
        if (!driverLicense) {
          toast({ title: "Upload dit kørekort", variant: "destructive" });
          return false;
        }
        return true;
      case 3:
        if (!acceptTerms || !acceptVanvid) {
          toast({ title: "Acceptér alle betingelser", variant: "destructive" });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3) || !vehicle || !startDate || !endDate || !pricing) return;

    setSubmitting(true);

    try {
      // Fetch owner profile
      const { data: ownerProfile, error: profileError } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("id", vehicle.owner_id)
        .single();

      if (profileError) throw new Error("Kunne ikke finde udlejer");

      // Upload documents to storage
      let driverLicenseUrl = null;
      if (driverLicense) {
        const fileName = `${Date.now()}-license-${driverLicense.name}`;
        const { error: uploadError } = await supabase.storage
          .from("contracts")
          .upload(fileName, driverLicense);
        if (!uploadError) {
          driverLicenseUrl = fileName;
        }
      }

      // Create booking
      const { error: bookingError } = await supabase.from("bookings").insert({
        vehicle_id: vehicle.id,
        lessor_id: vehicle.owner_id,
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
        total_price: pricing.grandTotal,
        status: "pending",
        renter_name: formData.name,
        renter_email: formData.email,
        renter_phone: formData.phone,
        notes: formData.notes || null,
      });

      if (bookingError) throw new Error("Kunne ikke oprette booking");

      // Send notification
      await supabase.functions.invoke("send-booking-notification", {
        body: {
          lessorEmail: ownerProfile.email,
          lessorName: ownerProfile.full_name || "Udlejer",
          renterName: formData.name,
          renterEmail: formData.email,
          renterPhone: formData.phone,
          vehicleMake: vehicle.make,
          vehicleModel: vehicle.model,
          vehicleRegistration: vehicle.registration,
          startDate: format(startDate, "dd. MMMM yyyy", { locale: da }),
          endDate: format(endDate, "dd. MMMM yyyy", { locale: da }),
          totalPrice: pricing.grandTotal,
          notes: formData.notes,
        },
      });

      toast({
        title: "Booking sendt!",
        description: "Udlejeren vil kontakte dig snarest",
      });

      navigate("/search");
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Fejl",
        description: error instanceof Error ? error.message : "Der opstod en fejl",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vehicle) return null;

  const steps = [
    { number: 1, title: "Vælg periode", icon: CalendarIcon },
    { number: 2, title: "Dokumenter", icon: Upload },
    { number: 3, title: "Bekræft", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Book bil</h1>
            <p className="text-muted-foreground">
              {vehicle.make} {vehicle.model} {vehicle.variant}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                    currentStep >= step.number
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border text-muted-foreground"
                  )}
                >
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "ml-3 text-sm font-medium hidden sm:block",
                    currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-4",
                      currentStep > step.number ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl border border-border p-6">
                {/* Step 1: Period & Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Vælg lejeperiode</h2>

                    {/* Period Type */}
                    <div className="space-y-2">
                      <Label>Lejetype</Label>
                      <Select value={periodType} onValueChange={(v) => setPeriodType(v as PeriodType)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Dage</SelectItem>
                          <SelectItem value="weekly">Uger</SelectItem>
                          <SelectItem value="monthly">Måneder</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Period Count */}
                    <div className="space-y-2">
                      <Label>
                        Antal {periodType === "monthly" ? "måneder" : periodType === "weekly" ? "uger" : "dage"}
                      </Label>
                      <Select value={String(periodCount)} onValueChange={(v) => setPeriodCount(Number(v))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: periodType === "monthly" ? 12 : periodType === "weekly" ? 8 : 30 }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Start Date */}
                    <div className="space-y-2">
                      <Label>Startdato *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP", { locale: da }) : "Vælg dato"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {startDate && endDate && (
                      <div className="bg-muted/50 rounded-xl p-4">
                        <p className="text-sm text-muted-foreground">Slutdato:</p>
                        <p className="font-medium">{format(endDate, "PPP", { locale: da })}</p>
                      </div>
                    )}

                    <hr className="border-border" />

                    <h2 className="text-xl font-semibold">Dine oplysninger</h2>

                    <div className="space-y-2">
                      <Label htmlFor="name">Fulde navn *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
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
                          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
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
                          onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
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
                        onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                        placeholder="Evt. spørgsmål eller ønsker..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Documents */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Upload dokumenter</h2>

                    <div className="space-y-4">
                      {/* Driver License */}
                      <div className="space-y-2">
                        <Label>Kørekort *</Label>
                        <div
                          className={cn(
                            "border-2 border-dashed rounded-xl p-6 text-center transition-colors",
                            driverLicense
                              ? "border-accent bg-accent/10"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          {driverLicense ? (
                            <div className="flex items-center justify-center gap-2">
                              <FileCheck className="w-6 h-6 text-accent" />
                              <span className="font-medium">{driverLicense.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDriverLicense(null)}
                              >
                                Fjern
                              </Button>
                            </div>
                          ) : (
                            <label className="cursor-pointer">
                              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Klik for at uploade kørekort
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG eller PDF (maks 10 MB)
                              </p>
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, setDriverLicense)}
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Health Card */}
                      <div className="space-y-2">
                        <Label>Sygesikringsbevis (valgfri)</Label>
                        <div
                          className={cn(
                            "border-2 border-dashed rounded-xl p-6 text-center transition-colors",
                            healthCard
                              ? "border-accent bg-accent/10"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          {healthCard ? (
                            <div className="flex items-center justify-center gap-2">
                              <FileCheck className="w-6 h-6 text-accent" />
                              <span className="font-medium">{healthCard.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setHealthCard(null)}
                              >
                                Fjern
                              </Button>
                            </div>
                          ) : (
                            <label className="cursor-pointer">
                              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Klik for at uploade sygesikringsbevis
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG eller PDF (maks 10 MB)
                              </p>
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, setHealthCard)}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Bekræft din booking</h2>

                    {/* Booking Summary */}
                    <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                      <h3 className="font-medium">Opsummering</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bil:</span>
                          <span className="font-medium">
                            {vehicle.make} {vehicle.model}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Periode:</span>
                          <span className="font-medium">
                            {startDate && format(startDate, "dd. MMM", { locale: da })} -{" "}
                            {endDate && format(endDate, "dd. MMM yyyy", { locale: da })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Varighed:</span>
                          <span className="font-medium">
                            {periodCount}{" "}
                            {periodType === "monthly"
                              ? periodCount === 1 ? "måned" : "måneder"
                              : periodType === "weekly"
                              ? periodCount === 1 ? "uge" : "uger"
                              : periodCount === 1 ? "dag" : "dage"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lejer:</span>
                          <span className="font-medium">{formData.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Acceptances */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 border border-border rounded-xl">
                        <Checkbox
                          id="terms"
                          checked={acceptTerms}
                          onCheckedChange={(c) => setAcceptTerms(c as boolean)}
                        />
                        <label htmlFor="terms" className="text-sm cursor-pointer">
                          Jeg accepterer lejebetingelserne og bekræfter at jeg har gyldigt
                          kørekort
                        </label>
                      </div>

                      <div className="flex items-start gap-3 p-4 border border-destructive/50 rounded-xl bg-destructive/5">
                        <Checkbox
                          id="vanvid"
                          checked={acceptVanvid}
                          onCheckedChange={(c) => setAcceptVanvid(c as boolean)}
                        />
                        <label htmlFor="vanvid" className="text-sm cursor-pointer">
                          <span className="font-medium text-destructive">Vanvidskørsel:</span>{" "}
                          Jeg accepterer at jeg hæfter for bilens fulde værdi ved
                          vanvidskørsel eller grov uagtsomhed
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={currentStep === 1 ? () => navigate("/search") : prevStep}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    {currentStep === 1 ? "Tilbage til søgning" : "Tilbage"}
                  </Button>

                  {currentStep < 3 ? (
                    <Button variant="warm" onClick={nextStep}>
                      Næste
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      variant="warm"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      Bekræft booking
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Price Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                {/* Vehicle Image */}
                {vehicle.image_url ? (
                  <img
                    src={vehicle.image_url}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-32 object-cover rounded-xl mb-4"
                  />
                ) : (
                  <div className="w-full h-32 bg-muted rounded-xl mb-4 flex items-center justify-center">
                    <Car className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}

                <h3 className="font-bold text-lg mb-1">
                  {vehicle.make} {vehicle.model}
                </h3>
                {vehicle.variant && (
                  <p className="text-sm text-muted-foreground mb-4">{vehicle.variant}</p>
                )}

                {pricing && (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {pricing.periodCount} × {pricing.unitPrice.toLocaleString("da-DK")} kr
                      </span>
                      <span>{pricing.rentalTotal.toLocaleString("da-DK")} kr</span>
                    </div>

                    {pricing.deposit > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Depositum</span>
                        <span>{pricing.deposit.toLocaleString("da-DK")} kr</span>
                      </div>
                    )}

                    {pricing.prepaidRent > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Forudbetalt leje ({vehicle.prepaid_rent_months} md.)
                        </span>
                        <span>{pricing.prepaidRent.toLocaleString("da-DK")} kr</span>
                      </div>
                    )}

                    {vehicle.unlimited_km && (
                      <div className="flex justify-between text-accent">
                        <span>Kilometer</span>
                        <span className="flex items-center gap-1">
                          <Check className="w-4 h-4" /> Fri km
                        </span>
                      </div>
                    )}

                    <hr className="border-border" />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        {pricing.grandTotal.toLocaleString("da-DK")} kr
                      </span>
                    </div>

                    {(pricing.deposit > 0 || pricing.prepaidRent > 0) && (
                      <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-lg text-xs">
                        <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <span className="text-yellow-800 dark:text-yellow-200">
                          Depositum og forudbetalt leje betales ved afhentning
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
