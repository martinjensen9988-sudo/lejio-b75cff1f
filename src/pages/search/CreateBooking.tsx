import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { differenceInDays, format } from 'date-fns';
import { da } from 'date-fns/locale';
import { Calendar, Car, Check, User, Mail, Phone, Loader2, MapPin, Bike, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VehicleLocationMap from '@/components/search/VehicleLocationMap';
import { MCLicenseCheck } from '@/components/search/MCLicenseCheck';
import { MCCategory } from '@/lib/mcLicenseValidation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const CreateBookingPage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [vehicle, setVehicle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [licenseValid, setLicenseValid] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    acceptTerms: false,
  });

  // Parse dates from URL params
  const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null;
  const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : null;
  const periodType = (searchParams.get('periodType') as 'daily' | 'weekly' | 'monthly') || 'daily';
  const periodCount = parseInt(searchParams.get('periodCount') || '1');

  // Fetch vehicle data
  useEffect(() => {
    const fetchVehicle = async () => {
      if (!vehicleId) return;

      try {
        const { data, error } = await supabase
          .from('vehicles_public')
          .select('*')
          .eq('id', vehicleId)
          .single();

        if (error) throw error;
        setVehicle(data);
      } catch (err) {
        console.error('Error fetching vehicle:', err);
        toast({
          title: 'Fejl',
          description: 'Kunne ikke hente køretøjsoplysninger',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  // Determine vehicle type
  const vehicleType = vehicle?.vehicle_type as string;
  const isMCOrScooter = vehicleType === 'motorcykel' || vehicleType === 'scooter';
  const mcCategory = isMCOrScooter ? (vehicle?.mc_category as MCCategory) : null;

  // Calculate pricing
  const pricing = useMemo(() => {
    if (!vehicle) return { unitPrice: 0, unitLabel: '', totalPrice: 0, periodCount: 1, periodType: 'daily', days: 1 };

    let unitPrice = 0;
    let unitLabel = '';
    let totalPrice = 0;
    let days = 1;

    if (startDate && endDate) {
      days = differenceInDays(endDate, startDate) + 1;
    }

    switch (periodType) {
      case 'monthly':
        unitPrice = vehicle.monthly_price || (vehicle.daily_price || 0) * 30;
        unitLabel = 'pr. måned';
        totalPrice = unitPrice * periodCount;
        break;
      case 'weekly':
        unitPrice = vehicle.weekly_price || (vehicle.daily_price || 0) * 7;
        unitLabel = 'pr. uge';
        totalPrice = unitPrice * periodCount;
        break;
      default:
        unitPrice = vehicle.daily_price || 0;
        unitLabel = 'pr. dag';
        totalPrice = unitPrice * periodCount;
    }

    return { unitPrice, unitLabel, totalPrice, periodCount, periodType, days };
  }, [vehicle, startDate, endDate, periodType, periodCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast({ title: 'Udfyld alle felter', description: 'Navn, email og telefon er påkrævet', variant: 'destructive' });
      return;
    }

    if (!formData.acceptTerms) {
      toast({ title: 'Acceptér betingelser', description: 'Du skal acceptere lejebetingelserne', variant: 'destructive' });
      return;
    }

    if (isMCOrScooter && !licenseValid) {
      toast({ title: 'Kørekort kræves', description: 'Du skal have gyldigt kørekort til denne køretøjstype', variant: 'destructive' });
      return;
    }

    if (!startDate || !endDate) {
      toast({ title: 'Vælg datoer', description: 'Vælg venligst start- og slutdato', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Fetch full vehicle data
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select('owner_id, registration, current_location_id')
        .eq('id', vehicleId)
        .single();

      if (vehicleError || !vehicleData) throw new Error('Kunne ikke finde køretøj');

      // Create booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          vehicle_id: vehicleId,
          lessor_id: vehicleData.owner_id,
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd'),
          total_price: pricing.totalPrice,
          status: 'pending',
          renter_name: formData.name,
          renter_email: formData.email,
          renter_phone: formData.phone,
          notes: formData.notes || null,
          pickup_location_id: vehicleData.current_location_id || null,
          dropoff_location_id: vehicleData.current_location_id || null,
        });

      if (bookingError) throw new Error('Kunne ikke oprette booking');

      setStep('success');
      toast({ title: 'Booking sendt!', description: 'Udlejeren vil kontakte dig snarest' });
    } catch (error) {
      console.error('Booking error:', error);
      toast({ title: 'Fejl', description: error instanceof Error ? error.message : 'Der opstod en fejl', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-xl font-semibold mb-4">Køretøj ikke fundet</h2>
          <Button variant="outline" onClick={() => navigate('/search')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tilbage til søgning
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-display font-bold flex items-center gap-2">
                {isMCOrScooter ? <Bike className="w-6 h-6 text-primary" /> : <Car className="w-6 h-6 text-primary" />}
                Book {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-muted-foreground">Udfyld dine oplysninger for at sende en bookingforespørgsel</p>
            </div>
          </div>

          {step === 'success' ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-mint/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-mint" />
                </div>
                <h2 className="text-xl font-bold mb-2">Booking sendt!</h2>
                <p className="text-muted-foreground mb-6">
                  Din forespørgsel er sendt til udlejeren. Du vil modtage en bekræftelse på email.
                </p>
                <Button onClick={() => navigate('/search')}>Tilbage til søgning</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Afhentningssted
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VehicleLocationMap
                    latitude={vehicle.latitude}
                    longitude={vehicle.longitude}
                    address={vehicle.location_address || vehicle.display_address}
                    postalCode={vehicle.location_postal_code || vehicle.display_postal_code}
                    city={vehicle.location_city || vehicle.display_city}
                    className="h-40"
                  />
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking oversigt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Køretøj:</span>
                    <span className="font-medium">{vehicle.make} {vehicle.model}</span>
                  </div>
                  {startDate && endDate && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Periode:</span>
                        <span className="font-medium">
                          {format(startDate, 'dd. MMM', { locale: da })} - {format(endDate, 'dd. MMM yyyy', { locale: da })}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pris {pricing.unitLabel}:</span>
                    <span className="font-medium">{pricing.unitPrice.toLocaleString('da-DK')} kr</span>
                  </div>
                  <div className="pt-2 border-t flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg text-primary">{pricing.totalPrice.toLocaleString('da-DK')} kr</span>
                  </div>
                </CardContent>
              </Card>

              {/* MC License Check */}
              {isMCOrScooter && mcCategory && (
                <MCLicenseCheck mcCategory={mcCategory} onValidationChange={setLicenseValid} />
              )}

              {/* Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Dine oplysninger</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Fulde navn *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+45 12 34 56 78"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Bemærkninger</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Eventuelle spørgsmål eller ønsker..."
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="terms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptTerms: checked === true }))}
                      />
                      <Label htmlFor="terms" className="text-sm cursor-pointer">
                        Jeg accepterer lejebetingelserne
                      </Label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
                        Annuller
                      </Button>
                      <Button type="submit" disabled={isSubmitting} className="flex-1">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Sender...
                          </>
                        ) : (
                          'Send booking'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateBookingPage;
