import { useState } from 'react';
import { Booking } from '@/hooks/useBookings';
import { Contract, useContracts } from '@/hooks/useContracts';
import { useDamageReports } from '@/hooks/useDamageReports';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ContractSigningModal from '@/components/contracts/ContractSigningModal';
import DamageReportModal from '@/components/damage/DamageReportModal';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import { Check, X, Car, Calendar, FileText, Loader2, FileCheck, Camera, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';

interface BookingsTableProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: Booking['status']) => Promise<boolean>;
}

const statusConfig: Record<Booking['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Afventer', variant: 'outline' },
  confirmed: { label: 'Bekræftet', variant: 'default' },
  active: { label: 'Aktiv', variant: 'default' },
  completed: { label: 'Afsluttet', variant: 'secondary' },
  cancelled: { label: 'Annulleret', variant: 'destructive' },
};

const BookingsTable = ({ bookings, onUpdateStatus }: BookingsTableProps) => {
  const { profile } = useAuth();
  const { contracts, generateContract, signContract, isLoading: contractsLoading } = useContracts();
  const [generatingContractFor, setGeneratingContractFor] = useState<string | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [signingModalOpen, setSigningModalOpen] = useState(false);
  const [confirmingBooking, setConfirmingBooking] = useState<string | null>(null);
  
  // Damage report state
  const [damageReportOpen, setDamageReportOpen] = useState(false);
  const [selectedBookingForDamage, setSelectedBookingForDamage] = useState<Booking | null>(null);
  const [damageReportType, setDamageReportType] = useState<'pickup' | 'return'>('pickup');

  const handleConfirmBooking = async (booking: Booking) => {
    setConfirmingBooking(booking.id);
    
    try {
      // First generate the contract
      setGeneratingContractFor(booking.id);
      const contract = await generateContract(booking.id, {
        vehicleValue: 150000,
        depositAmount: 2500,
      });
      setGeneratingContractFor(null);

      if (!contract) {
        toast.error('Kunne ikke oprette kontrakt');
        setConfirmingBooking(null);
        return;
      }

      // Update booking status
      const success = await onUpdateStatus(booking.id, 'confirmed');
      
      if (success && booking.renter_email && booking.renter_name) {
        // Send confirmation email with contract link
        const { error } = await supabase.functions.invoke('send-booking-confirmation', {
          body: {
            renterEmail: booking.renter_email,
            renterName: booking.renter_name,
            lessorName: profile?.full_name || 'Udlejer',
            lessorPhone: profile?.phone,
            lessorEmail: profile?.email,
            vehicleMake: booking.vehicle?.make || '',
            vehicleModel: booking.vehicle?.model || '',
            vehicleRegistration: booking.vehicle?.registration || '',
            startDate: format(new Date(booking.start_date), 'd. MMMM yyyy', { locale: da }),
            endDate: format(new Date(booking.end_date), 'd. MMMM yyyy', { locale: da }),
            totalPrice: booking.total_price,
            contractId: contract.id,
            contractNumber: contract.contract_number,
          },
        });

        if (error) {
          console.error('Email error:', error);
          toast.warning('Booking bekræftet, men email kunne ikke sendes');
        } else {
          toast.success('Booking bekræftet, kontrakt oprettet og email sendt til lejer');
        }
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error('Der opstod en fejl ved bekræftelse');
    } finally {
      setConfirmingBooking(null);
    }
  };

  const handleGenerateContract = async (booking: Booking) => {
    setGeneratingContractFor(booking.id);
    await generateContract(booking.id, {
      vehicleValue: 150000, // Default vehicle value, could be customized
      depositAmount: 2500,
    });
    setGeneratingContractFor(null);
  };

  const getContractForBooking = (bookingId: string) => {
    return contracts.find(c => c.booking_id === bookingId);
  };

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setSigningModalOpen(true);
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-2xl border border-border">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          Ingen bookinger endnu
        </h3>
        <p className="text-muted-foreground text-sm">
          Dine bookinger vil blive vist her, når lejere booker dine biler.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bil</TableHead>
              <TableHead>Lejer</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead>Pris</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Kontrakt</TableHead>
              <TableHead className="text-right">Handlinger</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => {
              const contract = getContractForBooking(booking.id);
              const isGenerating = generatingContractFor === booking.id;

              return (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">
                          {booking.vehicle?.make} {booking.vehicle?.model}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {booking.vehicle?.registration}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{booking.renter_name || 'Ukendt'}</p>
                      <p className="text-xs text-muted-foreground">{booking.renter_email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="text-foreground">
                        {format(new Date(booking.start_date), 'd. MMM', { locale: da })}
                      </p>
                      <p className="text-muted-foreground">
                        til {format(new Date(booking.end_date), 'd. MMM yyyy', { locale: da })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-foreground">{booking.total_price} kr</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[booking.status].variant}>
                      {statusConfig[booking.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {contract ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1"
                        onClick={() => handleViewContract(contract)}
                      >
                        {contract.status === 'signed' ? (
                          <>
                            <FileCheck className="w-4 h-4 text-mint" />
                            <span className="text-mint">Underskrevet</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4 text-accent" />
                            <span className="text-accent">Afventer</span>
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => handleGenerateContract(booking)}
                        disabled={isGenerating || contractsLoading}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Opretter...
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4" />
                            Opret kontrakt
                          </>
                        )}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {booking.status === 'pending' && (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-mint hover:text-mint"
                          onClick={() => handleConfirmBooking(booking)}
                          disabled={confirmingBooking === booking.id}
                        >
                          {confirmingBooking === booking.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    {booking.status === 'confirmed' && (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBookingForDamage(booking);
                            setDamageReportType('pickup');
                            setDamageReportOpen(true);
                          }}
                          title="Udleveringsrapport"
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateStatus(booking.id, 'active')}
                        >
                          Start
                        </Button>
                      </div>
                    )}
                    {booking.status === 'active' && (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBookingForDamage(booking);
                            setDamageReportType('return');
                            setDamageReportOpen(true);
                          }}
                          title="Indleveringsrapport"
                        >
                          <ClipboardCheck className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateStatus(booking.id, 'completed')}
                        >
                          Afslut
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Contract Signing Modal */}
      {selectedContract && (
        <ContractSigningModal
          contract={selectedContract}
          open={signingModalOpen}
          onOpenChange={setSigningModalOpen}
          onSign={signContract}
        />
      )}

      {/* Damage Report Modal */}
      {selectedBookingForDamage && (
        <DamageReportModal
          open={damageReportOpen}
          onOpenChange={setDamageReportOpen}
          bookingId={selectedBookingForDamage.id}
          vehicleId={selectedBookingForDamage.vehicle_id}
          contractId={getContractForBooking(selectedBookingForDamage.id)?.id}
          reportType={damageReportType}
        />
      )}
    </>
  );
};

export default BookingsTable;
