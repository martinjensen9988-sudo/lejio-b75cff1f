import { Booking } from '@/hooks/useBookings';
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
import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import { Check, X, Clock, Car, Calendar } from 'lucide-react';

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
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bil</TableHead>
            <TableHead>Lejer</TableHead>
            <TableHead>Periode</TableHead>
            <TableHead>Pris</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Handlinger</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookingsTable;
