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
import { usePayments } from "@/hooks/usePayments";
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
  MapPin,
  CreditCard as IdCard,
  UserPlus,
  Globe,
  CheckCircle,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import DeductibleInsuranceOption from "@/components/booking/DeductibleInsuranceOption";
import ReferralCreditOption from "@/components/booking/ReferralCreditOption";
import { useReferral } from "@/hooks/useReferral";
import { PaymentMethodSelector, PaymentMethod } from "@/components/booking/PaymentMethodSelector";

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
  default_pickup_time: string | null;
  default_dropoff_time: string | null;
  late_return_charge_enabled: boolean | null;
}

const Booking = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { redirectToPayment, isProcessing: isPaymentProcessing } = usePayments();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);
  const [lessorPaymentSettings, setLessorPaymentSettings] = useState<{
    accepted_payment_methods: PaymentMethod[];
    mobilepay_number: string | null;
    bank_reg_number: string | null;
    bank_account_number: string | null;
  } | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

  // Step 1: Booking details
  const [periodType, setPeriodType] = useState<PeriodType>("daily");
  const [periodCount, setPeriodCount] = useState(1);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    address: "",
    postalCode: "",
    city: "",
    phone: "",
    email: "",
    licenseNumber: "",
    licenseIssueDate: "",
    licenseCountry: "Danmark",
    notes: "",
    pickupTime: "10:00",
    dropoffTime: "08:00",
  });

  // Extra driver
  const [hasExtraDriver, setHasExtraDriver] = useState(false);
  const [extraDriver, setExtraDriver] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    licenseNumber: "",
    licenseIssueDate: "",
    licenseCountry: "Danmark",
  });

  // Step 2: Document uploads
  const [driverLicense, setDriverLicense] = useState<File | null>(null);
  const [healthCard, setHealthCard] = useState<File | null>(null);

  // Step 3: Confirmation
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptVanvid, setAcceptVanvid] = useState(false);
  
  // Deductible insurance
  const [deductibleInsurancePrice, setDeductibleInsurancePrice] = useState(0);
  const [hasDeductibleInsurance, setHasDeductibleInsurance] = useState(false);

  // Referral credit
  const [referralCredit, setReferralCredit] = useState(0);
  const [pendingRedemptionId, setPendingRedemptionId] = useState<string | undefined>();
  const { useCredit, completePendingReferral } = useReferral();

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
      
      // Set default pickup/dropoff times from vehicle settings
      setFormData(prev => ({
        ...prev,
        pickupTime: data.default_pickup_time || '10:00',
        dropoffTime: data.default_dropoff_time || '08:00',
      }));

      // Fetch lessor payment methods (for the payment step)
      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("accepted_payment_methods, mobilepay_number, bank_reg_number, bank_account_number")
          .eq("id", data.owner_id)
          .single();

        if (profileData) {
          const accepted = (profileData.accepted_payment_methods as PaymentMethod[]) || ["cash"];
          setLessorPaymentSettings({
            accepted_payment_methods: accepted,
            mobilepay_number: profileData.mobilepay_number,
            bank_reg_number: profileData.bank_reg_number,
            bank_account_number: profileData.bank_account_number,
          });

          // Default selection (first available)
          if (accepted.length > 0) setSelectedPaymentMethod(accepted[0]);
        }
      } catch {
        // Non-blocking: payment step can still show fallback
      }

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
      deductibleInsurance: deductibleInsurancePrice,
      referralDiscount: referralCredit,
      grandTotal: Math.max(0, unitPrice + deposit + prepaidRent + deductibleInsurancePrice - referralCredit),
      periodCount,
      periodType,
    };
  }, [vehicle, periodType, periodCount, deductibleInsurancePrice, referralCredit]);

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
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.birthDate || !formData.address || !formData.postalCode || !formData.city || !formData.licenseNumber || !formData.licenseIssueDate) {
          toast({ title: "Udfyld alle påkrævede felter", variant: "destructive" });
          return false;
        }
        if (hasExtraDriver && (!extraDriver.firstName || !extraDriver.lastName || !extraDriver.licenseNumber || !extraDriver.licenseIssueDate)) {
          toast({ title: "Udfyld alle felter for ekstra fører", variant: "destructive" });
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
      const { data: bookingData, error: bookingError } = await supabase.from("bookings").insert({
        vehicle_id: vehicle.id,
        lessor_id: vehicle.owner_id,
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
        total_price: pricing.grandTotal,
        status: "pending",
        renter_name: `${formData.firstName} ${formData.lastName}`,
        renter_email: formData.email,
        renter_phone: formData.phone,
        notes: formData.notes || null,
        // Pricing details for contract
        period_type: periodType,
        period_count: periodCount,
        daily_price: vehicle.daily_price || null,
        weekly_price: vehicle.weekly_price || null,
        monthly_price: vehicle.monthly_price || null,
        base_price: pricing.unitPrice,
        included_km: vehicle.included_km || null,
        extra_km_price: vehicle.extra_km_price || null,
        unlimited_km: vehicle.unlimited_km || false,
        deposit_amount: pricing.deposit || null,
        // Deductible insurance
        deductible_insurance_selected: hasDeductibleInsurance,
        deductible_insurance_price: hasDeductibleInsurance ? deductibleInsurancePrice : 0,
        original_deductible: 5000,
        // New driver info fields
        renter_first_name: formData.firstName,
        renter_last_name: formData.lastName,
        renter_birth_date: formData.birthDate || null,
        renter_address: formData.address,
        renter_postal_code: formData.postalCode,
        renter_city: formData.city,
        renter_license_number: formData.licenseNumber,
        renter_license_issue_date: formData.licenseIssueDate || null,
        renter_license_country: formData.licenseCountry,
        // Pickup/Dropoff times
        pickup_time: formData.pickupTime,
        dropoff_time: formData.dropoffTime,
        // Extra driver
        has_extra_driver: hasExtraDriver,
        extra_driver_first_name: hasExtraDriver ? extraDriver.firstName : null,
        extra_driver_last_name: hasExtraDriver ? extraDriver.lastName : null,
        extra_driver_birth_date: hasExtraDriver && extraDriver.birthDate ? extraDriver.birthDate : null,
        extra_driver_license_number: hasExtraDriver ? extraDriver.licenseNumber : null,
        extra_driver_license_issue_date: hasExtraDriver && extraDriver.licenseIssueDate ? extraDriver.licenseIssueDate : null,
        extra_driver_license_country: hasExtraDriver ? extraDriver.licenseCountry : null,
      }).select("id").single();

      if (bookingError) throw new Error("Kunne ikke oprette booking");
      
      // Store the booking ID for payment step
      setCreatedBookingId(bookingData.id);

      // Save deductible insurance if selected
      if (hasDeductibleInsurance && deductibleInsurancePrice > 0) {
        const totalDays = periodType === 'monthly' 
          ? periodCount * 30 
          : periodType === 'weekly' 
            ? periodCount * 7 
            : periodCount;
        
        await supabase.from("deductible_insurance").insert({
          booking_id: bookingData.id,
          days_covered: totalDays,
          daily_rate: 49,
          total_amount: deductibleInsurancePrice,
          original_deductible: 5000,
          new_deductible: 0,
          status: 'active',
        });
      }

      // Handle referral credit/discount
      if (referralCredit > 0) {
        // If using available credit, deduct it
        if (!pendingRedemptionId) {
          await useCredit(referralCredit, bookingData.id);
        } else {
          // Complete the pending referral redemption
          await completePendingReferral(pendingRedemptionId, bookingData.id);
        }
      }

      // Send notification
      await supabase.functions.invoke("send-booking-notification", {
        body: {
          lessorEmail: ownerProfile.email,
          lessorName: ownerProfile.full_name || "Udlejer",
          renterName: `${formData.firstName} ${formData.lastName}`,
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
        title: "Booking oprettet!",
        description: "Du kan nu betale for din booking",
      });

      // Move to step 4 (confirmation/payment)
      setCurrentStep(4);
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
    { number: 4, title: "Betal", icon: Wallet },
  ];

  const handlePayment = async () => {
    if (!createdBookingId) {
      toast({
        title: "Fejl",
        description: "Ingen booking fundet",
        variant: "destructive",
      });
      return;
    }

    // Require a payment method selection when configured
    if (lessorPaymentSettings?.accepted_payment_methods?.length && !selectedPaymentMethod) {
      toast({
        title: "Vælg betalingsmetode",
        description: "Du skal vælge en betalingsmetode før du fortsætter",
        variant: "destructive",
      });
      return;
    }

    // Persist selected method on the booking before proceeding
    if (selectedPaymentMethod) {
      const { error: updateError } = await supabase
        .from("bookings")
        .update({ payment_method: selectedPaymentMethod })
        .eq("id", createdBookingId);

      if (updateError) {
        toast({
          title: "Fejl",
          description: "Kunne ikke gemme betalingsmetode",
          variant: "destructive",
        });
        return;
      }
    }

    // Non-card methods do not redirect to card checkout
    if (selectedPaymentMethod && selectedPaymentMethod !== "card") {
      const msg =
        selectedPaymentMethod === "cash"
          ? "Du betaler kontant ved afhentning."
          : selectedPaymentMethod === "mobilepay"
            ? `Du betaler via MobilePay${lessorPaymentSettings?.mobilepay_number ? ` til ${lessorPaymentSettings.mobilepay_number}` : ""}.`
            : `Du betaler via bankoverførsel${lessorPaymentSettings?.bank_reg_number && lessorPaymentSettings?.bank_account_number ? ` til reg ${lessorPaymentSettings.bank_reg_number} konto ${lessorPaymentSettings.bank_account_number}` : ""}.`;

      toast({ title: "Betalingsmetode valgt", description: msg });
      navigate("/my-rentals");
      return;
    }

    await redirectToPayment(createdBookingId);
  };

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
                      <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Slutdato:</p>
                          <p className="font-medium">{format(endDate, "PPP", { locale: da })}</p>
                        </div>
                        
                        {/* Pickup & Dropoff Times */}
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                          <div className="space-y-2">
                            <Label htmlFor="pickupTime" className="text-sm">Afhentning kl.</Label>
                            <Input
                              id="pickupTime"
                              type="time"
                              value={formData.pickupTime}
                              onChange={(e) => setFormData(p => ({ ...p, pickupTime: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dropoffTime" className="text-sm">Aflevering kl.</Label>
                            <Input
                              id="dropoffTime"
                              type="time"
                              value={formData.dropoffTime}
                              onChange={(e) => setFormData(p => ({ ...p, dropoffTime: e.target.value }))}
                            />
                          </div>
                        </div>
                        
                        {vehicle?.late_return_charge_enabled !== false && (
                          <div className="bg-destructive/10 rounded-lg p-3 text-sm border border-destructive/20">
                            <p className="text-destructive">
                              <strong>Sen aflevering:</strong> Afleveres bilen efter kl. {formData.dropoffTime}, opkræves gebyr svarende til 1 ekstra lejedag.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <hr className="border-border" />

                    <h2 className="text-xl font-semibold">Personlige oplysninger</h2>
                    <p className="text-sm text-muted-foreground -mt-4">Til lejekontrakten - skal matche dit kørekort</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Fornavn *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                            placeholder="Fornavn"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Efternavn *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                          placeholder="Efternavn"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Fødselsdato *</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData((p) => ({ ...p, birthDate: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                          placeholder="Vejnavn og husnummer"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postnummer *</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => setFormData((p) => ({ ...p, postalCode: e.target.value }))}
                          placeholder="1234"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">By *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                          placeholder="By"
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

                    <hr className="border-border" />

                    <h2 className="text-xl font-semibold">Føreroplysninger</h2>
                    <p className="text-sm text-muted-foreground -mt-4">Til forsikring og verifikation</p>

                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Kørekortnummer *</Label>
                      <div className="relative">
                        <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={(e) => setFormData((p) => ({ ...p, licenseNumber: e.target.value }))}
                          placeholder="Det lange nummer på kortet"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="licenseIssueDate">Udstedelsesdato *</Label>
                        <Input
                          id="licenseIssueDate"
                          type="date"
                          value={formData.licenseIssueDate}
                          onChange={(e) => setFormData((p) => ({ ...p, licenseIssueDate: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="licenseCountry">Land</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="licenseCountry"
                            value={formData.licenseCountry}
                            onChange={(e) => setFormData((p) => ({ ...p, licenseCountry: e.target.value }))}
                            placeholder="Danmark"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <hr className="border-border" />

                    {/* Extra Driver */}
                    <div className="flex items-center gap-3 p-4 border border-border rounded-xl">
                      <Checkbox
                        id="extraDriver"
                        checked={hasExtraDriver}
                        onCheckedChange={(c) => setHasExtraDriver(c as boolean)}
                      />
                      <label htmlFor="extraDriver" className="flex items-center gap-2 cursor-pointer">
                        <UserPlus className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Tilføj ekstra fører</span>
                      </label>
                    </div>

                    {hasExtraDriver && (
                      <div className="p-4 border border-border rounded-xl space-y-4 bg-muted/30">
                        <h3 className="font-medium flex items-center gap-2">
                          <UserPlus className="w-4 h-4" />
                          Ekstra fører
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="extraFirstName">Fornavn *</Label>
                            <Input
                              id="extraFirstName"
                              value={extraDriver.firstName}
                              onChange={(e) => setExtraDriver((p) => ({ ...p, firstName: e.target.value }))}
                              placeholder="Fornavn"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="extraLastName">Efternavn *</Label>
                            <Input
                              id="extraLastName"
                              value={extraDriver.lastName}
                              onChange={(e) => setExtraDriver((p) => ({ ...p, lastName: e.target.value }))}
                              placeholder="Efternavn"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="extraBirthDate">Fødselsdato</Label>
                          <Input
                            id="extraBirthDate"
                            type="date"
                            value={extraDriver.birthDate}
                            onChange={(e) => setExtraDriver((p) => ({ ...p, birthDate: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="extraLicenseNumber">Kørekortnummer *</Label>
                          <Input
                            id="extraLicenseNumber"
                            value={extraDriver.licenseNumber}
                            onChange={(e) => setExtraDriver((p) => ({ ...p, licenseNumber: e.target.value }))}
                            placeholder="Det lange nummer på kortet"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="extraLicenseIssueDate">Udstedelsesdato *</Label>
                            <Input
                              id="extraLicenseIssueDate"
                              type="date"
                              value={extraDriver.licenseIssueDate}
                              onChange={(e) => setExtraDriver((p) => ({ ...p, licenseIssueDate: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="extraLicenseCountry">Land</Label>
                            <Input
                              id="extraLicenseCountry"
                              value={extraDriver.licenseCountry}
                              onChange={(e) => setExtraDriver((p) => ({ ...p, licenseCountry: e.target.value }))}
                              placeholder="Danmark"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <hr className="border-border" />

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
                          <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deductible Insurance Option */}
                    <DeductibleInsuranceOption
                      periodType={periodType}
                      periodCount={periodCount}
                      originalDeductible={5000}
                      onSelect={(selected, price) => {
                        setHasDeductibleInsurance(selected);
                        setDeductibleInsurancePrice(price);
                      }}
                    />

                    {/* Referral Credit Option */}
                    <ReferralCreditOption
                      periodType={periodType}
                      onCreditApplied={(credit, redemptionId) => {
                        setReferralCredit(credit);
                        setPendingRedemptionId(redemptionId);
                      }}
                    />

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

                {/* Step 4: Confirmation & Payment */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-accent" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Booking oprettet!</h2>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Din booking er oprettet og udlejeren er blevet notificeret.
                        Betal nu for at bekræfte din reservation.
                      </p>
                    </div>

                    {pricing && (
                      <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                        <h3 className="font-semibold">Betalingsoversigt</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {vehicle.make} {vehicle.model}
                            </span>
                          </div>
                          {startDate && endDate && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Periode</span>
                              <span>
                                {format(startDate, "d. MMM", { locale: da })} - {format(endDate, "d. MMM yyyy", { locale: da })}
                              </span>
                            </div>
                          )}
                          <hr className="border-border my-2" />
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span className="text-primary">
                              {pricing.grandTotal.toLocaleString("da-DK")} kr
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment method selection */}
                    {lessorPaymentSettings?.accepted_payment_methods?.length ? (
                      <PaymentMethodSelector
                        acceptedMethods={lessorPaymentSettings.accepted_payment_methods}
                        selectedMethod={selectedPaymentMethod}
                        onMethodChange={setSelectedPaymentMethod}
                        lessorPaymentDetails={{
                          mobilepay_number: lessorPaymentSettings.mobilepay_number,
                          bank_reg_number: lessorPaymentSettings.bank_reg_number,
                          bank_account_number: lessorPaymentSettings.bank_account_number,
                        }}
                      />
                    ) : null}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate("/my-rentals")}
                      >
                        Se mine lejeaftaler
                      </Button>
                      <Button
                        variant="warm"
                        className="flex-1 gap-2"
                        onClick={handlePayment}
                        disabled={isPaymentProcessing}
                      >
                        {isPaymentProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CreditCard className="w-4 h-4" />
                        )}
                        Betal nu
                      </Button>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                {currentStep < 4 && (
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
                )}
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
                        Pris {pricing.periodType === "monthly" ? "pr. måned" : pricing.periodType === "weekly" ? "pr. uge" : "pr. dag"}
                      </span>
                      <span>{pricing.unitPrice.toLocaleString("da-DK")} kr</span>
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

                    {pricing.deductibleInsurance > 0 && (
                      <div className="flex justify-between text-primary">
                        <span className="text-muted-foreground">Nul selvrisiko-forsikring</span>
                        <span>{pricing.deductibleInsurance.toLocaleString("da-DK")} kr</span>
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

                    {pricing.referralDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="text-green-600">Henvisningsrabat</span>
                        <span>-{pricing.referralDiscount.toLocaleString("da-DK")} kr</span>
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
