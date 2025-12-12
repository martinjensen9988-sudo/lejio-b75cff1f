import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  useRenterWarnings, 
  CreateWarningInput, 
  WarningReason,
  WARNING_REASON_LABELS 
} from '@/hooks/useRenterWarnings';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface CreateWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillData?: {
    renter_email?: string;
    renter_phone?: string;
    renter_name?: string;
    renter_license_number?: string;
    booking_id?: string;
  };
}

export const CreateWarningModal = ({
  isOpen,
  onClose,
  prefillData,
}: CreateWarningModalProps) => {
  const { createWarning } = useRenterWarnings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateWarningInput>({
    renter_email: prefillData?.renter_email || '',
    renter_phone: prefillData?.renter_phone || '',
    renter_name: prefillData?.renter_name || '',
    renter_license_number: prefillData?.renter_license_number || '',
    booking_id: prefillData?.booking_id,
    reason: 'other',
    description: '',
    severity: 3,
    damage_amount: 0,
    unpaid_amount: 0,
  });

  const handleSubmit = async () => {
    if (!formData.renter_email || !formData.description) {
      return;
    }

    setIsSubmitting(true);
    const result = await createWarning(formData);
    setIsSubmitting(false);

    if (result) {
      onClose();
      setFormData({
        renter_email: '',
        renter_phone: '',
        renter_name: '',
        renter_license_number: '',
        reason: 'other',
        description: '',
        severity: 3,
        damage_amount: 0,
        unpaid_amount: 0,
      });
    }
  };

  const getSeverityLabel = (severity: number) => {
    if (severity <= 1) return 'Meget lav';
    if (severity <= 2) return 'Lav';
    if (severity <= 3) return 'Middel';
    if (severity <= 4) return 'Høj';
    return 'Meget høj';
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 1) return 'text-green-600';
    if (severity <= 2) return 'text-yellow-600';
    if (severity <= 3) return 'text-orange-500';
    if (severity <= 4) return 'text-red-500';
    return 'text-red-700';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Opret advarsel om lejer
          </DialogTitle>
          <DialogDescription>
            Advarslen vil være synlig for andre udlejere. Lejeren vil blive notificeret og kan klage.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Renter Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="renter_email">Email *</Label>
              <Input
                id="renter_email"
                type="email"
                value={formData.renter_email}
                onChange={(e) => setFormData(d => ({ ...d, renter_email: e.target.value }))}
                placeholder="lejer@email.dk"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renter_name">Navn</Label>
              <Input
                id="renter_name"
                value={formData.renter_name || ''}
                onChange={(e) => setFormData(d => ({ ...d, renter_name: e.target.value }))}
                placeholder="Lejerens navn"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="renter_phone">Telefon</Label>
              <Input
                id="renter_phone"
                value={formData.renter_phone || ''}
                onChange={(e) => setFormData(d => ({ ...d, renter_phone: e.target.value }))}
                placeholder="+45 12345678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renter_license">Kørekortnummer</Label>
              <Input
                id="renter_license"
                value={formData.renter_license_number || ''}
                onChange={(e) => setFormData(d => ({ ...d, renter_license_number: e.target.value }))}
                placeholder="Kørekortnummer"
              />
            </div>
          </div>

          {/* Warning Details */}
          <div className="space-y-2">
            <Label htmlFor="reason">Årsag *</Label>
            <Select
              value={formData.reason}
              onValueChange={(value) => setFormData(d => ({ ...d, reason: value as WarningReason }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(WARNING_REASON_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beskrivelse *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(d => ({ ...d, description: e.target.value }))}
              placeholder="Beskriv hvad der skete..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Alvorlighed</Label>
              <span className={`text-sm font-medium ${getSeverityColor(formData.severity || 3)}`}>
                {getSeverityLabel(formData.severity || 3)}
              </span>
            </div>
            <Slider
              value={[formData.severity || 3]}
              onValueChange={([value]) => setFormData(d => ({ ...d, severity: value }))}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Mindre</span>
              <span>Alvorlig</span>
            </div>
          </div>

          {/* Financial Impact */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="damage_amount">Skadebeløb (kr)</Label>
              <Input
                id="damage_amount"
                type="number"
                min="0"
                value={formData.damage_amount || ''}
                onChange={(e) => setFormData(d => ({ ...d, damage_amount: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unpaid_amount">Ubetalt beløb (kr)</Label>
              <Input
                id="unpaid_amount"
                type="number"
                min="0"
                value={formData.unpaid_amount || ''}
                onChange={(e) => setFormData(d => ({ ...d, unpaid_amount: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
          </div>

          <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
            <p className="text-sm text-foreground">
              <strong>Vigtigt:</strong> Lejeren vil modtage en email om advarslen og kan klage. 
              LEJIO vil behandle eventuelle klager. Advarslen gemmes i op til 5 år.
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Annuller
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.renter_email || !formData.description}
            variant="destructive"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Opret advarsel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
