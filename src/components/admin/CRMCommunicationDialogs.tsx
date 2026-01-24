import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, Loader2 } from 'lucide-react';
import { CRMDeal } from '@/hooks/useCRM';
import { useCRMCommunication } from '@/hooks/useCRMCommunication';

interface CRMEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: CRMDeal | null;
  onSuccess?: () => void;
}

export const CRMEmailDialog = ({ open, onOpenChange, deal, onSuccess }: CRMEmailDialogProps) => {
  const { sendEmail, isSendingEmail } = useCRMCommunication();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSend = async () => {
    if (!deal?.contact_email || !subject || !body) return;

    const result = await sendEmail({
      recipientEmail: deal.contact_email,
      recipientName: deal.contact_name,
      subject,
      body,
      dealId: deal.id,
    });

    if (result.success) {
      setSubject('');
      setBody('');
      onOpenChange(false);
      onSuccess?.();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSubject('');
      setBody('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Send email
          </DialogTitle>
          <DialogDescription>
            Send email til {deal?.contact_name || deal?.contact_email}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Til</Label>
            <Input 
              value={`${deal?.contact_name || ''} <${deal?.contact_email || ''}>`} 
              disabled 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email_subject">Emne *</Label>
            <Input
              id="email_subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Vedr. fleet-aftale"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email_body">Besked *</Label>
            <Textarea
              id="email_body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="Skriv din besked her..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Annuller
          </Button>
          <Button onClick={handleSend} disabled={!subject || !body || isSendingEmail}>
            {isSendingEmail && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Send email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface CRMCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: CRMDeal | null;
  onSuccess?: () => void;
}

export const CRMCallDialog = ({ open, onOpenChange, deal, onSuccess }: CRMCallDialogProps) => {
  const { makeCall, isCallingInProgress } = useCRMCommunication();

  const handleCall = async () => {
    if (!deal?.contact_phone) return;

    const result = await makeCall({
      to: deal.contact_phone,
      dealId: deal.id,
      contactName: deal.contact_name,
    });

    if (result.success) {
      onOpenChange(false);
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-600" />
            Start opkald
          </DialogTitle>
          <DialogDescription>
            Ring til {deal?.contact_name || 'kontakt'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="text-2xl font-mono">{deal?.contact_phone}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {deal?.company_name}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuller
          </Button>
          <Button 
            onClick={handleCall} 
            disabled={isCallingInProgress}
            className="bg-green-600 hover:bg-green-700"
          >
            {isCallingInProgress && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Phone className="w-4 h-4 mr-2" />
            Ring op
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
