import { useState, useRef, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Plus, Trash2, Car, Fuel, FileCheck, Upload, X, AlertTriangle, Save, MapPin } from 'lucide-react';
import { useDamageReports, DamageReport, DamageItem, CreateDamageItemInput } from '@/hooks/useDamageReports';
import { useContracts, Contract } from '@/hooks/useContracts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import VehicleDamageSelector from './VehicleDamageSelector';

interface DamageReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  vehicleId: string;
  contractId?: string;
  reportType: 'pickup' | 'return';
  existingReport?: DamageReport;
}

const VEHICLE_POSITIONS = [
  { value: 'front-left', label: 'Forfra venstre' },
  { value: 'front-center', label: 'Forfra midt' },
  { value: 'front-right', label: 'Forfra højre' },
  { value: 'left-side', label: 'Venstre side' },
  { value: 'right-side', label: 'Højre side' },
  { value: 'rear-left', label: 'Bagfra venstre' },
  { value: 'rear-center', label: 'Bagfra midt' },
  { value: 'rear-right', label: 'Bagfra højre' },
  { value: 'roof', label: 'Tag' },
  { value: 'interior-front', label: 'Kabine foran' },
  { value: 'interior-rear', label: 'Kabine bag' },
  { value: 'trunk', label: 'Bagagerum' },
];

const DAMAGE_TYPES = [
  { value: 'scratch', label: 'Ridse' },
  { value: 'dent', label: 'Bule' },
  { value: 'crack', label: 'Revne' },
  { value: 'stain', label: 'Plet' },
  { value: 'tear', label: 'Flaenge' },
  { value: 'missing', label: 'Mangler' },
  { value: 'broken', label: 'Oedelagt' },
  { value: 'other', label: 'Andet' },
];

const FUEL_LEVELS = [
  { value: 'empty', label: 'Tom' },
  { value: 'quarter', label: '1/4' },
  { value: 'half', label: '1/2' },
  { value: 'three_quarters', label: '3/4' },
  { value: 'full', label: 'Fuld' },
];

const SEVERITY_COLORS: Record<string, string> = {
  minor: 'bg-yellow-100 text-yellow-800',
  moderate: 'bg-orange-100 text-orange-800',
  severe: 'bg-red-100 text-red-800',
};

// Fuel level numeric values for calculations (in percentage of tank)
const FUEL_LEVEL_VALUES: Record<string, number> = {
  empty: 0,
  quarter: 25,
  half: 50,
  three_quarters: 75,
  full: 100,
};

// Estimate tank size in liters (average car tank)
const ESTIMATED_TANK_SIZE = 50;

export const DamageReportModal = ({
  open,
  onOpenChange,
  bookingId,
  vehicleId,
  contractId,
  reportType,
  existingReport,
}: DamageReportModalProps) => {
  const { createReport, updateReport, addDamageItem, removeDamageItem, uploadDamagePhoto } = useDamageReports(bookingId);
  const { getContractByBookingId, contracts } = useContracts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [report, setReport] = useState<DamageReport | null>(existingReport || null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAddingDamage, setIsAddingDamage] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  // Form state
  const [odometerReading, setOdometerReading] = useState(existingReport?.odometer_reading?.toString() || '');
  const [fuelLevel, setFuelLevel] = useState<string>(existingReport?.fuel_level || '');
  const [exteriorClean, setExteriorClean] = useState(existingReport?.exterior_clean ?? true);
  const [interiorClean, setInteriorClean] = useState(existingReport?.interior_clean ?? true);
  const [notes, setNotes] = useState(existingReport?.notes || '');
  
  // New damage item form
  const [newDamage, setNewDamage] = useState<Partial<CreateDamageItemInput>>({
    position: '',
    damage_type: '',
    severity: 'minor',
    description: '',
  });
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  const [pendingPhotoPreview, setPendingPhotoPreview] = useState<string | null>(null);

  // Get contract for fuel policy
  const contract = useMemo(() => getContractByBookingId(bookingId), [bookingId, contracts]);

  // Calculate fuel fee for return reports
  const fuelFeeCalculation = useMemo(() => {
    if (reportType !== 'return' || !contract || !contract.fuel_policy_enabled || !fuelLevel) {
      return null;
    }

    const currentLevelPercent = FUEL_LEVEL_VALUES[fuelLevel] ?? 100;
    
    // If tank is full, no fee
    if (currentLevelPercent === 100) {
      return { totalFee: 0, missingLiters: 0, baseFee: 0, literFee: 0, description: 'Tank er fuld - ingen gebyr' };
    }

    const missingPercent = 100 - currentLevelPercent;
    const missingLiters = Math.round((missingPercent / 100) * ESTIMATED_TANK_SIZE);
    
    const baseFee = contract.fuel_missing_fee || 0;
    const literFee = missingLiters * (contract.fuel_price_per_liter || 0);
    const totalFee = baseFee + literFee;

    return {
      totalFee,
      missingLiters,
      baseFee,
      literFee,
      pricePerLiter: contract.fuel_price_per_liter || 0,
      description: `Mangler ca. ${missingLiters} liter brændstof`,
    };
  }, [reportType, contract, fuelLevel]);

  // Save fuel fee to booking
  const saveFuelFeeToBooking = async (feeAmount: number) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ fuel_fee: feeAmount })
        .eq('id', bookingId);

      if (error) throw error;
      toast.success('Brændstofgebyr gemt på booking');
      return true;
    } catch (err) {
      console.error('Error saving fuel fee:', err);
      toast.error('Kunne ikke gemme brændstofgebyr');
      return false;
    }
  };

  const handleCreateReport = async () => {
    setIsCreating(true);
    try {
      const newReport = await createReport({
        booking_id: bookingId,
        vehicle_id: vehicleId,
        contract_id: contractId,
        report_type: reportType,
        odometer_reading: odometerReading ? parseInt(odometerReading) : undefined,
        fuel_level: fuelLevel as DamageReport['fuel_level'] || undefined,
        exterior_clean: exteriorClean,
        interior_clean: interiorClean,
        notes: notes || undefined,
      });
      
      if (newReport) {
        setReport(newReport);
        
        // Auto-save fuel fee for return reports
        if (reportType === 'return' && fuelFeeCalculation && fuelFeeCalculation.totalFee > 0) {
          await saveFuelFeeToBooking(fuelFeeCalculation.totalFee);
        }
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateReport = async () => {
    if (!report) return;
    
    await updateReport(report.id, {
      odometer_reading: odometerReading ? parseInt(odometerReading) : undefined,
      fuel_level: fuelLevel as DamageReport['fuel_level'] || undefined,
      exterior_clean: exteriorClean,
      interior_clean: interiorClean,
      notes: notes || undefined,
    });

    // Update fuel fee for return reports
    if (reportType === 'return' && fuelFeeCalculation) {
      await saveFuelFeeToBooking(fuelFeeCalculation.totalFee);
    }
  };

  const handleSaveFuelFee = async () => {
    if (fuelFeeCalculation) {
      await saveFuelFeeToBooking(fuelFeeCalculation.totalFee);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPendingPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDamageItem = async () => {
    if (!report || !newDamage.position || !newDamage.damage_type || !newDamage.severity) {
      toast.error('Udfyld venligst alle felter');
      return;
    }

    setIsAddingDamage(true);
    try {
      let photoUrl: string | undefined;
      
      if (pendingPhoto) {
        setUploadingPhoto(true);
        const url = await uploadDamagePhoto(pendingPhoto, report.id);
        if (url) photoUrl = url;
        setUploadingPhoto(false);
      }

      await addDamageItem({
        damage_report_id: report.id,
        position: newDamage.position,
        damage_type: newDamage.damage_type,
        severity: newDamage.severity,
        description: newDamage.description,
        photo_url: photoUrl,
      });

      // Reset form
      setNewDamage({ position: '', damage_type: '', severity: 'minor', description: '' });
      setPendingPhoto(null);
      setPendingPhotoPreview(null);
    } finally {
      setIsAddingDamage(false);
    }
  };

  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleUploadPhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  const reportTitle = reportType === 'pickup' ? 'Udlevering' : 'Indlevering';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            Skadesrapport - {reportTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vehicle Status Section */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Koeretoekets tilstand
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="odometer">Kilometerstand</Label>
                <Input
                  id="odometer"
                  type="number"
                  value={odometerReading}
                  onChange={(e) => setOdometerReading(e.target.value)}
                  placeholder="f.eks. 125000"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Braendstofniveau</Label>
                <Select value={fuelLevel} onValueChange={setFuelLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vaelg niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    {FUEL_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <span className="flex items-center gap-2">
                          <Fuel className="w-4 h-4" />
                          {level.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="exterior-clean" 
                  checked={exteriorClean}
                  onCheckedChange={(checked) => setExteriorClean(checked as boolean)}
                />
                <Label htmlFor="exterior-clean">Udvendig ren</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="interior-clean" 
                  checked={interiorClean}
                  onCheckedChange={(checked) => setInteriorClean(checked as boolean)}
                />
                <Label htmlFor="interior-clean">Indvendig ren</Label>
              </div>
            </div>

            {/* Fuel Fee Calculation for Return Reports */}
            {reportType === 'return' && contract?.fuel_policy_enabled && fuelLevel && fuelFeeCalculation && (
              <div className={`rounded-lg p-4 border ${fuelFeeCalculation.totalFee > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-start gap-3">
                  {fuelFeeCalculation.totalFee > 0 ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <Fuel className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-2">
                      {fuelFeeCalculation.totalFee > 0 ? 'Brændstofgebyr' : 'Ingen brændstofgebyr'}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">{fuelFeeCalculation.description}</p>
                    
                    {fuelFeeCalculation.totalFee > 0 && (
                      <div className="bg-white rounded p-3 space-y-2">
                        {fuelFeeCalculation.baseFee > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Fast gebyr:</span>
                            <span className="font-medium">{fuelFeeCalculation.baseFee.toFixed(2)} kr</span>
                          </div>
                        )}
                        {fuelFeeCalculation.literFee > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>{fuelFeeCalculation.missingLiters} liter × {fuelFeeCalculation.pricePerLiter?.toFixed(2)} kr:</span>
                            <span className="font-medium">{fuelFeeCalculation.literFee.toFixed(2)} kr</span>
                          </div>
                        )}
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold">
                          <span>Total brændstofgebyr:</span>
                          <span className="text-amber-700">{fuelFeeCalculation.totalFee.toFixed(2)} kr</span>
                        </div>
                      </div>
                    )}
                    
                    {report && (
                      <Button 
                        onClick={handleSaveFuelFee} 
                        size="sm" 
                        className="mt-3 gap-2"
                        variant={fuelFeeCalculation.totalFee > 0 ? "default" : "outline"}
                      >
                        <Save className="w-4 h-4" />
                        Gem brændstofgebyr på booking
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Bemaerkninger</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Generelle bemaerkninger om koeretoekets tilstand..."
                rows={2}
              />
            </div>

            {!report ? (
              <Button onClick={handleCreateReport} disabled={isCreating} className="w-full">
                {isCreating ? 'Opretter...' : 'Opret skadesrapport'}
              </Button>
            ) : (
              <Button onClick={handleUpdateReport} variant="outline" className="w-full">
                Gem aendringer
              </Button>
            )}
          </div>

          {/* Existing Damages */}
          {report && report.damage_items && report.damage_items.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold">Registrerede skader ({report.damage_items.length})</h3>
                <div className="space-y-2">
                  {report.damage_items.map((item) => (
                    <DamageItemCard 
                      key={item.id} 
                      item={item} 
                      onRemove={() => removeDamageItem(item.id)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Add New Damage */}
          {report && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Tilføj ny skade
                </h3>
                
                <Tabs defaultValue="visual" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="visual" className="gap-2">
                      <MapPin className="w-4 h-4" />
                      Visuel markering
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="gap-2">
                      <Car className="w-4 h-4" />
                      Manuel valg
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="visual" className="mt-4">
                    <VehicleDamageSelector
                      selectedPosition={newDamage.position || ''}
                      onSelectPosition={(pos) => setNewDamage({ ...newDamage, position: pos })}
                      existingDamages={report.damage_items?.map(item => ({
                        id: item.id,
                        position: item.position,
                        severity: item.severity,
                        damage_type: item.damage_type,
                      })) || []}
                    />
                  </TabsContent>
                  
                  <TabsContent value="manual" className="mt-4">
                    <div className="space-y-2">
                      <Label>Position på køretøj</Label>
                      <Select 
                        value={newDamage.position} 
                        onValueChange={(v) => setNewDamage({ ...newDamage, position: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Vælg position" />
                        </SelectTrigger>
                        <SelectContent>
                          {VEHICLE_POSITIONS.map((pos) => (
                            <SelectItem key={pos.value} value={pos.value}>
                              {pos.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>

                {newDamage.position && (
                  <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Valgt position:</span>{' '}
                      <span className="font-medium text-primary">
                        {VEHICLE_POSITIONS.find(p => p.value === newDamage.position)?.label}
                      </span>
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>Type skade</Label>
                  <Select 
                    value={newDamage.damage_type} 
                    onValueChange={(v) => setNewDamage({ ...newDamage, damage_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Vælg type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAMAGE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Alvorlighed</Label>
                  <Select 
                    value={newDamage.severity} 
                    onValueChange={(v) => setNewDamage({ ...newDamage, severity: v as 'minor' | 'moderate' | 'severe' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Mindre</SelectItem>
                      <SelectItem value="moderate">Moderat</SelectItem>
                      <SelectItem value="severe">Alvorlig</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Beskrivelse</Label>
                  <Textarea
                    value={newDamage.description || ''}
                    onChange={(e) => setNewDamage({ ...newDamage, description: e.target.value })}
                    placeholder="Beskriv skaden..."
                    rows={2}
                  />
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label>Billede af skaden</Label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleTakePhoto}
                      className="flex-1"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Tag billede
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleUploadPhoto}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload billede
                    </Button>
                  </div>
                  
                  {pendingPhotoPreview && (
                    <div className="relative inline-block mt-2">
                      <img 
                        src={pendingPhotoPreview} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 w-6 h-6"
                        onClick={() => {
                          setPendingPhoto(null);
                          setPendingPhotoPreview(null);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleAddDamageItem} 
                  disabled={isAddingDamage || !newDamage.position || !newDamage.damage_type}
                  className="w-full"
                >
                  {uploadingPhoto ? 'Uploader billede...' : isAddingDamage ? 'Tilføjer...' : 'Tilføj skade'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DamageItemCard = ({ item, onRemove }: { item: DamageItem; onRemove: () => void }) => {
  const position = VEHICLE_POSITIONS.find(p => p.value === item.position)?.label || item.position;
  const damageType = DAMAGE_TYPES.find(t => t.value === item.damage_type)?.label || item.damage_type;
  const severityLabel: Record<string, string> = { minor: 'Mindre', moderate: 'Moderat', severe: 'Alvorlig' };

  return (
    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
      {item.photo_url && (
        <img 
          src={item.photo_url} 
          alt="Skade" 
          className="w-16 h-16 object-cover rounded-lg border"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">{position}</span>
          <span className="text-muted-foreground">-</span>
          <span>{damageType}</span>
          <Badge className={SEVERITY_COLORS[item.severity]}>{severityLabel[item.severity]}</Badge>
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground mt-1 truncate">{item.description}</p>
        )}
      </div>
      <Button variant="ghost" size="icon" onClick={onRemove} className="shrink-0">
        <Trash2 className="w-4 h-4 text-destructive" />
      </Button>
    </div>
  );
};

export default DamageReportModal;
