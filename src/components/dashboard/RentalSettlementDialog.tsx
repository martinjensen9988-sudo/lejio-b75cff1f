import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Receipt, Fuel, Car, AlertTriangle, CheckCircle2, Wallet, FileText, Edit2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Booking } from '@/hooks/useBookings';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

interface RentalSettlementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking;
  onComplete: () => void;
}

interface CheckInData {
  confirmed_odometer: number | null;
  confirmed_fuel_percent: number | null;
}

interface CheckOutData {
  km_overage: number | null;
  km_overage_fee: number | null;
  fuel_fee: number | null;
  total_extra_charges: number | null;
  confirmed_odometer: number | null;
  confirmed_fuel_percent: number | null;
  fuel_start_percent: number | null;
  km_driven: number | null;
  exterior_clean: boolean | null;
  interior_clean: boolean | null;
  exterior_cleaning_fee: number | null;
  interior_cleaning_fee: number | null;
}

interface Fine {
  id: string;
  fine_type: string;
  fine_amount: number;
  admin_fee: number;
  total_amount: number;
  fine_date: string;
  status: string;
  description: string | null;
}

interface SettlementSummary {
  rentalPrice: number;
  kmOverageFee: number;
  fuelFee: number;
  exteriorCleaningFee: number;
  interiorCleaningFee: number;
  finesTotal: number;
  totalCharges: number;
  depositAmount: number;
  depositRefund: number;
  amountDueFromRenter: number;
}

interface ManualInput {
  startOdometer: number;
  endOdometer: number;
  startFuelPercent: number;
  endFuelPercent: number;
  exteriorClean: boolean;
  interiorClean: boolean;
}

const RentalSettlementDialog = ({ open, onOpenChange, booking, onComplete }: RentalSettlementDialogProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkInData, setCheckInData] = useState<CheckInData | null>(null);
  const [checkOutData, setCheckOutData] = useState<CheckOutData | null>(null);
  const [fines, setFines] = useState<Fine[]>([]);
  const [settlement, setSettlement] = useState<SettlementSummary | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualInput, setManualInput] = useState<ManualInput>({
    startOdometer: 0,
    endOdometer: 0,
    startFuelPercent: 100,
    endFuelPercent: 100,
    exteriorClean: true,
    interiorClean: true,
  });

  // Get vehicle settings for calculations
  const includedKm = booking.included_km || 0;
  const extraKmRate = booking.extra_km_price || 2; // Default 2 kr per km
  const fuelTankSize = 50; // Default tank size in liters
  const fuelPricePerLiter = 15; // Default fuel price
  const fuelMissingFee = 150; // Service fee for fuel
  const exteriorCleaningFeeRate = booking.vehicle?.exterior_cleaning_fee || 350;
  const interiorCleaningFeeRate = booking.vehicle?.interior_cleaning_fee || 500;

  useEffect(() => {
    if (open && booking) {
      fetchSettlementData();
    }
  }, [open, booking]);

  useEffect(() => {
    // Recalculate settlement when manual input changes
    if (isManualMode) {
      calculateManualSettlement();
    }
  }, [manualInput, isManualMode, fines]);

  const fetchSettlementData = async () => {
    setIsLoading(true);
    try {
      // Fetch check-in record for this booking
      const { data: checkInRecord, error: checkInError } = await supabase
        .from('check_in_out_records')
        .select('confirmed_odometer, confirmed_fuel_percent')
        .eq('booking_id', booking.id)
        .eq('record_type', 'check_in')
        .maybeSingle();

      if (checkInError && checkInError.code !== 'PGRST116') {
        console.error('Error fetching check-in data:', checkInError);
      }

      setCheckInData(checkInRecord);

      // Fetch check-out record for this booking
      const { data: checkOutRecord, error: checkOutError } = await supabase
        .from('check_in_out_records')
        .select('km_overage, km_overage_fee, fuel_fee, total_extra_charges, confirmed_odometer, confirmed_fuel_percent, fuel_start_percent, km_driven, exterior_clean, interior_clean, exterior_cleaning_fee, interior_cleaning_fee')
        .eq('booking_id', booking.id)
        .eq('record_type', 'check_out')
        .maybeSingle();

      if (checkOutError && checkOutError.code !== 'PGRST116') {
        console.error('Error fetching check-out data:', checkOutError);
      }

      setCheckOutData(checkOutRecord as CheckOutData | null);

      // Fetch unpaid fines for this booking
      const { data: bookingFines, error: finesError } = await supabase
        .from('fines')
        .select('id, fine_type, fine_amount, admin_fee, total_amount, fine_date, status, description')
        .eq('booking_id', booking.id)
        .neq('status', 'paid');

      if (finesError) {
        console.error('Error fetching fines:', finesError);
      }

      setFines(bookingFines || []);

      // If no check-out data exists, enable manual mode
      if (!checkOutRecord) {
        setIsManualMode(true);
        if (checkInRecord) {
          setManualInput(prev => ({
            ...prev,
            startOdometer: checkInRecord.confirmed_odometer || 0,
            startFuelPercent: checkInRecord.confirmed_fuel_percent || 100,
          }));
        }
        calculateManualSettlement();
      } else {
        calculateSettlementFromCheckOut(checkOutRecord as CheckOutData, bookingFines || []);
      }
    } catch (err) {
      console.error('Error fetching settlement data:', err);
      toast.error('Kunne ikke hente afregningsdata');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSettlementFromCheckOut = (checkOut: CheckOutData, bookingFines: Fine[]) => {
    const kmOverageFee = checkOut?.km_overage_fee || 0;
    const fuelFee = checkOut?.fuel_fee || 0;
    const exteriorCleaningFee = checkOut?.exterior_cleaning_fee || 0;
    const interiorCleaningFee = checkOut?.interior_cleaning_fee || 0;
    const finesTotal = bookingFines.reduce((sum, fine) => sum + (fine.total_amount || 0), 0);
    const totalCharges = kmOverageFee + fuelFee + exteriorCleaningFee + interiorCleaningFee + finesTotal;
    const depositAmount = booking.deposit_amount || 0;

    const depositRefund = Math.max(0, depositAmount - totalCharges);
    const amountDueFromRenter = Math.max(0, totalCharges - depositAmount);

    setSettlement({
      rentalPrice: booking.total_price,
      kmOverageFee,
      fuelFee,
      exteriorCleaningFee,
      interiorCleaningFee,
      finesTotal,
      totalCharges,
      depositAmount,
      depositRefund,
      amountDueFromRenter,
    });
  };

  const calculateManualSettlement = () => {
    const kmDriven = Math.max(0, manualInput.endOdometer - manualInput.startOdometer);
    const kmOverage = Math.max(0, kmDriven - includedKm);
    const kmOverageFee = kmOverage * extraKmRate;

    const fuelDiff = manualInput.startFuelPercent - manualInput.endFuelPercent;
    const fuelTolerance = 5;
    let fuelFee = 0;

    if (fuelDiff > fuelTolerance) {
      const fuelMissingLiters = (fuelDiff / 100) * fuelTankSize;
      fuelFee = (fuelMissingLiters * fuelPricePerLiter) + fuelMissingFee;
    }

    const exteriorCleaningFee = !manualInput.exteriorClean ? exteriorCleaningFeeRate : 0;
    const interiorCleaningFee = !manualInput.interiorClean ? interiorCleaningFeeRate : 0;

    const finesTotal = fines.reduce((sum, fine) => sum + (fine.total_amount || 0), 0);
    const totalCharges = kmOverageFee + fuelFee + exteriorCleaningFee + interiorCleaningFee + finesTotal;
    const depositAmount = booking.deposit_amount || 0;

    const depositRefund = Math.max(0, depositAmount - totalCharges);
    const amountDueFromRenter = Math.max(0, totalCharges - depositAmount);

    setSettlement({
      rentalPrice: booking.total_price,
      kmOverageFee,
      fuelFee,
      exteriorCleaningFee,
      interiorCleaningFee,
      finesTotal,
      totalCharges,
      depositAmount,
      depositRefund,
      amountDueFromRenter,
    });
  };

  const handleCompleteRental = async () => {
    if (!settlement) return;
    
    setIsProcessing(true);
    try {
      // Create settlement invoice if there are extra charges or if we need to document the deposit refund
      if (settlement.totalCharges > 0 || settlement.depositRefund > 0) {
        const { data: invoiceResult, error: invoiceError } = await supabase.functions.invoke('generate-settlement-invoice', {
          body: {
            bookingId: booking.id,
            settlement: {
              rentalPrice: settlement.rentalPrice,
              kmOverageFee: settlement.kmOverageFee,
              fuelFee: settlement.fuelFee,
              finesTotal: settlement.finesTotal,
              totalCharges: settlement.totalCharges,
              depositAmount: settlement.depositAmount,
              depositRefund: settlement.depositRefund,
              amountDueFromRenter: settlement.amountDueFromRenter,
              fines: fines.map(f => ({
                type: f.fine_type,
                amount: f.fine_amount,
                adminFee: f.admin_fee,
                total: f.total_amount,
                date: f.fine_date,
                description: f.description
              }))
            }
          }
        });

        if (invoiceError) {
          console.error('Error generating settlement invoice:', invoiceError);
          // Continue even if invoice fails - we can generate it later
        }

        // Update fines as settled/deducted from deposit
        if (fines.length > 0) {
          const fineIds = fines.map(f => f.id);
          await supabase
            .from('fines')
            .update({ status: 'paid', paid_at: new Date().toISOString() })
            .in('id', fineIds);
        }

        // Update check-out record settlement status
        if (checkOutData) {
          await supabase
            .from('check_in_out_records')
            .update({ settlement_status: 'settled' })
            .eq('booking_id', booking.id)
            .eq('record_type', 'check_out');
        }
      }

      // Send settlement email to renter
      if (booking.renter_email) {
        await supabase.functions.invoke('send-settlement-email', {
          body: {
            renterEmail: booking.renter_email,
            renterName: booking.renter_name || 'Lejer',
            vehicleName: `${booking.vehicle?.make || ''} ${booking.vehicle?.model || ''}`.trim(),
            vehicleRegistration: booking.vehicle?.registration || '',
            settlement: settlement,
            fines: fines.map(f => ({
              type: f.fine_type,
              amount: f.total_amount,
              date: f.fine_date
            }))
          }
        });
      }

      toast.success('Lejeaftale afsluttet - afregning gennemført');
      onComplete();
      onOpenChange(false);
    } catch (err) {
      console.error('Error completing rental:', err);
      toast.error('Kunne ikke afslutte lejeaftale');
    } finally {
      setIsProcessing(false);
    }
  };

  const fineTypeLabels: Record<string, string> = {
    parking: 'P-afgift',
    speed: 'Fartbøde',
    toll: 'Vejafgift',
    other: 'Andet'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Afslut leje - Afregning
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : settlement ? (
          <div className="space-y-4">
            {/* Booking info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Bookingoplysninger
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-medium">{booking.vehicle?.make} {booking.vehicle?.model}</p>
                <p className="text-muted-foreground font-mono">{booking.vehicle?.registration}</p>
                <p className="text-muted-foreground">
                  {format(new Date(booking.start_date), 'd. MMM', { locale: da })} - {format(new Date(booking.end_date), 'd. MMM yyyy', { locale: da })}
                </p>
                <p>Lejer: {booking.renter_name || 'Ukendt'}</p>
                {includedKm > 0 && (
                  <p className="text-muted-foreground">Inkluderet km: {includedKm} km</p>
                )}
              </CardContent>
            </Card>

            {/* Manual input section - shows when no check-out data exists */}
            {isManualMode && (
              <Card className="border-warning/50 bg-warning/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-warning" />
                    Indtast km-stand og brændstof
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Der er ikke registreret check-in/check-out data. Indtast venligst km-stand og brændstofniveau manuelt.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startOdometer" className="text-xs">Km-stand ved start</Label>
                      <Input
                        id="startOdometer"
                        type="number"
                        value={manualInput.startOdometer}
                        onChange={(e) => setManualInput(prev => ({ ...prev, startOdometer: Number(e.target.value) }))}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endOdometer" className="text-xs">Km-stand ved slut</Label>
                      <Input
                        id="endOdometer"
                        type="number"
                        value={manualInput.endOdometer}
                        onChange={(e) => setManualInput(prev => ({ ...prev, endOdometer: Number(e.target.value) }))}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startFuel" className="text-xs">Brændstof ved start (%)</Label>
                      <Input
                        id="startFuel"
                        type="number"
                        min="0"
                        max="100"
                        value={manualInput.startFuelPercent}
                        onChange={(e) => setManualInput(prev => ({ ...prev, startFuelPercent: Number(e.target.value) }))}
                        placeholder="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endFuel" className="text-xs">Brændstof ved slut (%)</Label>
                      <Input
                        id="endFuel"
                        type="number"
                        min="0"
                        max="100"
                        value={manualInput.endFuelPercent}
                        onChange={(e) => setManualInput(prev => ({ ...prev, endFuelPercent: Number(e.target.value) }))}
                        placeholder="100"
                      />
                    </div>
                  </div>

                  {/* Cleaning checkboxes */}
                  <div className="space-y-2 pt-2 border-t">
                    <Label className="text-xs">Rengøringsstatus</Label>
                    <div 
                      className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer"
                      onClick={() => setManualInput(prev => ({ ...prev, exteriorClean: !prev.exteriorClean }))}
                    >
                      <span className="text-sm">Udvendig ren</span>
                      <div className={`w-4 h-4 rounded border ${manualInput.exteriorClean ? 'bg-primary border-primary' : 'border-muted-foreground'}`} />
                    </div>
                    <div 
                      className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer"
                      onClick={() => setManualInput(prev => ({ ...prev, interiorClean: !prev.interiorClean }))}
                    >
                      <span className="text-sm">Indvendig ren</span>
                      <div className={`w-4 h-4 rounded border ${manualInput.interiorClean ? 'bg-primary border-primary' : 'border-muted-foreground'}`} />
                    </div>
                  </div>

                  {/* Quick calculation summary */}
                  <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                    <p>Kørte km: <span className="font-medium">{Math.max(0, manualInput.endOdometer - manualInput.startOdometer)} km</span></p>
                    <p>Ekstra km: <span className="font-medium">{Math.max(0, manualInput.endOdometer - manualInput.startOdometer - includedKm)} km</span> à {extraKmRate} kr/km</p>
                    {!manualInput.exteriorClean && <p>Udvendig rengøring: <span className="font-medium text-destructive">{exteriorCleaningFeeRate} kr</span></p>}
                    {!manualInput.interiorClean && <p>Indvendig rengøring: <span className="font-medium text-destructive">{interiorCleaningFeeRate} kr</span></p>}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Extra charges */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ekstra opkrævninger</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* KM overage */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Km-overskridelse</span>
                    {isManualMode ? (
                      <span className="text-xs text-muted-foreground">
                        ({Math.max(0, manualInput.endOdometer - manualInput.startOdometer - includedKm)} km ekstra)
                      </span>
                    ) : checkOutData?.km_driven ? (
                      <span className="text-xs text-muted-foreground">
                        ({checkOutData.km_overage || 0} km ekstra)
                      </span>
                    ) : null}
                  </div>
                  <span className={`text-sm font-medium ${settlement.kmOverageFee > 0 ? 'text-destructive' : ''}`}>
                    {settlement.kmOverageFee > 0 ? `${settlement.kmOverageFee.toFixed(2)} kr` : '0 kr'}
                  </span>
                </div>

                {/* Fuel fee */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Brændstofgebyr</span>
                    {isManualMode ? (
                      <span className="text-xs text-muted-foreground">
                        ({manualInput.startFuelPercent}% → {manualInput.endFuelPercent}%)
                      </span>
                    ) : checkOutData?.fuel_start_percent != null && checkOutData?.confirmed_fuel_percent != null ? (
                      <span className="text-xs text-muted-foreground">
                        ({checkOutData.fuel_start_percent}% → {checkOutData.confirmed_fuel_percent}%)
                      </span>
                    ) : null}
                  </div>
                  <span className={`text-sm font-medium ${settlement.fuelFee > 0 ? 'text-destructive' : ''}`}>
                    {settlement.fuelFee > 0 ? `${settlement.fuelFee.toFixed(2)} kr` : '0 kr'}
                  </span>
                </div>

                {/* Fines */}
                {fines.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                        Bøder ({fines.length})
                      </div>
                      {fines.map(fine => (
                        <div key={fine.id} className="flex justify-between items-center text-sm pl-6">
                          <div>
                            <span>{fineTypeLabels[fine.fine_type] || fine.fine_type}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {format(new Date(fine.fine_date), 'd. MMM', { locale: da })}
                            </span>
                          </div>
                          <span className="text-destructive font-medium">{fine.total_amount} kr</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {settlement.totalCharges === 0 && fines.length === 0 && (
                  <div className="flex items-center gap-2 text-primary text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Ingen ekstra opkrævninger
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deposit calculation */}
            <Card className="border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Depositum afregning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Depositum indbetalt</span>
                  <span className="font-medium">{settlement.depositAmount.toFixed(2)} kr</span>
                </div>
                {settlement.totalCharges > 0 && (
                  <div className="flex justify-between text-destructive">
                    <span>Fratrukket (ekstra + bøder)</span>
                    <span className="font-medium">-{Math.min(settlement.depositAmount, settlement.totalCharges).toFixed(2)} kr</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Refunderes til lejer</span>
                  <span className="text-primary">{settlement.depositRefund.toFixed(2)} kr</span>
                </div>
                {settlement.amountDueFromRenter > 0 && (
                  <div className="flex justify-between text-destructive font-semibold pt-2">
                    <span>Lejer skylder yderligere</span>
                    <span>{settlement.amountDueFromRenter.toFixed(2)} kr</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="bg-muted/50">
              <CardContent className="pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total leje</span>
                  <span>{settlement.rentalPrice.toFixed(2)} kr</span>
                </div>
                <div className="flex justify-between">
                  <span>Ekstra opkrævninger</span>
                  <span className={settlement.totalCharges > 0 ? 'text-destructive' : ''}>
                    {settlement.totalCharges.toFixed(2)} kr
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Samlet betaling fra lejer</span>
                  <span>{(settlement.rentalPrice + settlement.amountDueFromRenter).toFixed(2)} kr</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">Ingen afregningsdata fundet</p>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Annuller
          </Button>
          <Button onClick={handleCompleteRental} disabled={isLoading || isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Behandler...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Afslut og send afregning
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RentalSettlementDialog;
