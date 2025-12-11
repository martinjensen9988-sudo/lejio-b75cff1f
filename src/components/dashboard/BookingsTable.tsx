import { useState } from 'react';
import { Booking } from '@/hooks/useBookings';
import { Contract, useContracts } from '@/hooks/useContracts';
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
import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import { Check, X, Car, Calendar, FileText, Loader2, FileCheck } from 'lucide-react';

interface BookingsTableProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: Booking['status']) => void;
}

const statusConfig: Record<Booking['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Afventer', variant: 'outline' },
  confirmed: { label: 'Bekræftet', variant: 'default' },
  active: { label: 'Aktiv', variant: 'default' },
  completed: { label: 'Afsluttet', variant: 'secondary' },
  cancelled: { label: 'Annulleret', variant: 'destructive' },
};

const BookingsTable = ({ bookings, onUpdateStatus }: BookingsTableProps) => {
  const { contracts, generateContract, signContract, isLoading: contractsLoading } = useContracts();
  const [generatingContractFor, setGeneratingContractFor] = useState<string | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [signingModalOpen, setSigningModalOpen] = useState(false);

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
                          onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                        >
                          <Check className="w-4 h-4" />
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateStatus(booking.id, 'active')}
                      >
                        Start
                      </Button>
                    )}
                    {booking.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateStatus(booking.id, 'completed')}
                      >
                        Afslut
                      </Button>
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
    </>
  );
};

export default BookingsTable;
