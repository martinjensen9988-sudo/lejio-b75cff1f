import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Contract, useContracts } from "@/hooks/useContracts";
import { usePayments } from "@/hooks/usePayments";
import ContractSigningModal from "@/components/contracts/ContractSigningModal";
import {
  Car,
  Calendar,
  FileText,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  FileCheck,
  User,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  Download,
  CreditCard,
  Navigation2,
} from "lucide-react";
import { toast } from "sonner";

interface RentalBooking {
  id: string;
  vehicle_id: string;
  lessor_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  renter_name: string | null;
  renter_email: string | null;
  renter_phone: string | null;
  created_at: string;
  vehicle?: {
    id: string;
    make: string;
    model: string;
    registration: string;
    image_url: string | null;
    use_custom_location: boolean;
    location_address: string | null;
    location_postal_code: string | null;
    location_city: string | null;
    latitude: number | null;
    longitude: number | null;
  };
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: "Afventer bekræftelse", variant: "outline", icon: Clock },
  confirmed: { label: "Bekræftet", variant: "default", icon: CheckCircle },
  active: { label: "Aktiv", variant: "default", icon: Car },
  completed: { label: "Afsluttet", variant: "secondary", icon: CheckCircle },
  cancelled: { label: "Annulleret", variant: "destructive", icon: XCircle },
};

const MyRentals = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile, loading: authLoading } = useAuth();
  const { contracts, signContract, downloadContractPdf, refetch: refetchContracts } = useContracts();
  const { redirectToPayment, isProcessing: isPaymentProcessing } = usePayments();
  const [bookings, setBookings] = useState<RentalBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [signingModalOpen, setSigningModalOpen] = useState(false);

  // Check for contractId in URL params (from email link)
  const contractIdFromUrl = searchParams.get("contractId");

  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to auth with return URL
      const returnUrl = contractIdFromUrl 
        ? `/my-rentals?contractId=${contractIdFromUrl}`
        : "/my-rentals";
      navigate(`/auth?redirect=${encodeURIComponent(returnUrl)}`);
    }
  }, [user, authLoading, navigate, contractIdFromUrl]);

  // Fetch renter's bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            *,
            vehicle:vehicles(id, make, model, registration, image_url, use_custom_location, location_address, location_postal_code, location_city, latitude, longitude)
          `)
          .eq("renter_email", user.email)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setBookings(data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // Open contract from URL param
  useEffect(() => {
    if (contractIdFromUrl && contracts.length > 0) {
      const contract = contracts.find(c => c.id === contractIdFromUrl);
      if (contract) {
        setSelectedContract(contract);
        setSigningModalOpen(true);
      }
    }
  }, [contractIdFromUrl, contracts]);

  const getContractForBooking = (bookingId: string) => {
    return contracts.find(c => c.booking_id === bookingId);
  };

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setSigningModalOpen(true);
  };

  const handleRebook = (booking: RentalBooking) => {
    if (booking.vehicle?.id) {
      navigate(`/booking/${booking.vehicle.id}`);
    }
  };

  const handlePayment = async (bookingId: string) => {
    await redirectToPayment(bookingId);
  };

  const openDirections = (booking: RentalBooking) => {
    const vehicle = booking.vehicle;
    if (!vehicle) return;

    // Get address or coordinates
    let destination = '';
    
    if (vehicle.latitude && vehicle.longitude) {
      destination = `${vehicle.latitude},${vehicle.longitude}`;
    } else if (vehicle.use_custom_location && vehicle.location_address) {
      destination = encodeURIComponent(
        [vehicle.location_address, vehicle.location_postal_code, vehicle.location_city, 'Denmark']
          .filter(Boolean)
          .join(', ')
      );
    } else {
      toast.error('Ingen adresse tilgængelig for dette køretøj');
      return;
    }

    // Detect platform and open appropriate maps app
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    
    if (isIOS || isMac) {
      // Apple Maps
      window.open(`https://maps.apple.com/?daddr=${destination}`, '_blank');
    } else {
      // Google Maps
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
    }
  };

  const canShowDirections = (booking: RentalBooking, contract: Contract | undefined) => {
    // Only show directions if contract is signed by both parties
    return contract?.renter_signature && contract?.lessor_signature && 
           booking.vehicle && 
           (booking.vehicle.latitude && booking.vehicle.longitude || 
            (booking.vehicle.use_custom_location && booking.vehicle.location_address));
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const activeBookings = bookings.filter(b => ["pending", "confirmed", "active"].includes(b.status));
  const pastBookings = bookings.filter(b => ["completed", "cancelled"].includes(b.status));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Mine lejeaftaler</h1>
            <p className="text-muted-foreground">
              Se dine bookinger, underskriv kontrakter og genbestil biler
            </p>
          </div>

          {/* Profile Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Min profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{profile?.full_name || "Ikke angivet"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{profile?.phone || "Ikke angivet"}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => navigate("/settings")}
              >
                Rediger profil
              </Button>
            </CardContent>
          </Card>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="active" className="gap-2">
                <Car className="w-4 h-4" />
                Aktive ({activeBookings.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <Clock className="w-4 h-4" />
                Historik ({pastBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {activeBookings.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Ingen aktive bookinger</h3>
                    <p className="text-muted-foreground mb-4">
                      Du har ingen aktive eller afventende bookinger
                    </p>
                    <Button onClick={() => navigate("/search")}>
                      Find en bil
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                activeBookings.map((booking) => {
                  const contract = getContractForBooking(booking.id);
                  const StatusIcon = statusConfig[booking.status]?.icon || Clock;

                  return (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Vehicle Image */}
                          <div className="w-full md:w-48 h-32 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                            {booking.vehicle?.image_url ? (
                              <img
                                src={booking.vehicle.image_url}
                                alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Car className="w-12 h-12 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {booking.vehicle?.make} {booking.vehicle?.model}
                                </h3>
                                <p className="text-sm text-muted-foreground font-mono">
                                  {booking.vehicle?.registration}
                                </p>
                              </div>
                              <Badge variant={statusConfig[booking.status]?.variant || "outline"}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig[booking.status]?.label || booking.status}
                              </Badge>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>
                                  {format(new Date(booking.start_date), "d. MMM", { locale: da })} - {format(new Date(booking.end_date), "d. MMM yyyy", { locale: da })}
                                </span>
                              </div>
                              <div className="font-semibold text-primary">
                                {booking.total_price.toLocaleString("da-DK")} kr
                              </div>
                            </div>

                            {/* Contract Actions */}
                            <div className="flex flex-wrap gap-2 pt-2">
                              {/* Payment button for pending bookings */}
                              {booking.status === "pending" && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="gap-1 bg-primary hover:bg-primary/90"
                                  onClick={() => handlePayment(booking.id)}
                                  disabled={isPaymentProcessing}
                                >
                                  {isPaymentProcessing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <CreditCard className="w-4 h-4" />
                                  )}
                                  Betal nu
                                </Button>
                              )}
                              
                              {contract ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant={contract.renter_signature ? "outline" : "default"}
                                    className="gap-1"
                                    onClick={() => handleViewContract(contract)}
                                  >
                                    {contract.renter_signature ? (
                                      <>
                                        <FileCheck className="w-4 h-4" />
                                        Se kontrakt
                                      </>
                                    ) : (
                                      <>
                                        <FileText className="w-4 h-4" />
                                        Underskriv kontrakt
                                      </>
                                    )}
                                  </Button>
                                  {contract.pdf_url && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="gap-1"
                                      onClick={() => downloadContractPdf(contract)}
                                    >
                                      <Download className="w-4 h-4" />
                                      Download PDF
                                    </Button>
                                  )}
                                  {/* Directions button - only when contract is fully signed */}
                                  {canShowDirections(booking, contract) && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="gap-1 text-primary border-primary/30 hover:bg-primary/10"
                                      onClick={() => openDirections(booking)}
                                    >
                                      <Navigation2 className="w-4 h-4" />
                                      Rutevejledning
                                    </Button>
                                  )}
                                </>
                              ) : booking.status === "confirmed" ? (
                                <p className="text-sm text-muted-foreground">
                                  Kontrakt afventer oprettelse...
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {pastBookings.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Ingen tidligere lejeaftaler</h3>
                    <p className="text-muted-foreground">
                      Dine afsluttede bookinger vil blive vist her
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pastBookings.map((booking) => {
                  const contract = getContractForBooking(booking.id);
                  const StatusIcon = statusConfig[booking.status]?.icon || Clock;

                  return (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Vehicle Image */}
                          <div className="w-full md:w-48 h-32 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                            {booking.vehicle?.image_url ? (
                              <img
                                src={booking.vehicle.image_url}
                                alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Car className="w-12 h-12 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {booking.vehicle?.make} {booking.vehicle?.model}
                                </h3>
                                <p className="text-sm text-muted-foreground font-mono">
                                  {booking.vehicle?.registration}
                                </p>
                              </div>
                              <Badge variant={statusConfig[booking.status]?.variant || "outline"}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig[booking.status]?.label || booking.status}
                              </Badge>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>
                                  {format(new Date(booking.start_date), "d. MMM", { locale: da })} - {format(new Date(booking.end_date), "d. MMM yyyy", { locale: da })}
                                </span>
                              </div>
                              <div className="font-semibold">
                                {booking.total_price.toLocaleString("da-DK")} kr
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2 pt-2">
                              {contract && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1"
                                    onClick={() => handleViewContract(contract)}
                                  >
                                    <FileCheck className="w-4 h-4" />
                                    Se kontrakt
                                  </Button>
                                  {contract.pdf_url && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="gap-1"
                                      onClick={() => downloadContractPdf(contract)}
                                    >
                                      <Download className="w-4 h-4" />
                                      Download PDF
                                    </Button>
                                  )}
                                </>
                              )}
                              {booking.status === "completed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  onClick={() => handleRebook(booking)}
                                >
                                  <RefreshCw className="w-4 h-4" />
                                  Lej igen
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Contract Signing Modal */}
      {selectedContract && (
        <ContractSigningModal
          contract={selectedContract}
          open={signingModalOpen}
          onOpenChange={(open) => {
            setSigningModalOpen(open);
            if (!open) {
              // Clear URL param when closing
              navigate("/my-rentals", { replace: true });
            }
          }}
          onSign={async (contractId, signature, acceptVanvidskorsel, role) => {
            const result = await signContract(contractId, signature, acceptVanvidskorsel, role);
            if (result) {
              await refetchContracts();
            }
            return result;
          }}
        />
      )}
    </div>
  );
};

export default MyRentals;
