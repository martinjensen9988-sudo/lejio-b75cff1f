import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Sparkles, Building2, CheckCircle, ArrowRight } from 'lucide-react';

interface UpgradeToProCardProps {
  onUpgradeSuccess?: () => void;
}

const UpgradeToProCard = ({ onUpgradeSuccess }: UpgradeToProCardProps) => {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    cvr_number: '',
  });

  // Only show for private users
  if (profile?.user_type !== 'privat') {
    return null;
  }

  const handleUpgrade = async () => {
    if (!user) return;

    if (!formData.company_name.trim()) {
      toast.error('Indtast venligst virksomhedsnavn');
      return;
    }

    if (!formData.cvr_number.trim() || formData.cvr_number.length < 8) {
      toast.error('Indtast venligst et gyldigt CVR-nummer (8 cifre)');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          user_type: 'professionel',
          company_name: formData.company_name.trim(),
          cvr_number: formData.cvr_number.trim(),
          subscription_status: 'trial',
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Din profil er nu opgraderet til Pro!', {
        description: 'Du har nu 14 dages gratis prøveperiode.',
      });

      setIsOpen(false);
      onUpgradeSuccess?.();
      
      // Reload the page to reflect the changes
      window.location.reload();
    } catch (error) {
      console.error('Error upgrading profile:', error);
      toast.error('Kunne ikke opgradere profil', {
        description: 'Prøv igen senere',
      });
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Få dine biler vist på søgesiden',
    'Automatisk kontraktgenerering',
    'Digital signatur på kontrakter',
    'Ingen gebyr per booking',
    'Fast månedlig pris fra 299 kr',
    '14 dages gratis prøveperiode',
  ];

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Opgrader til Pro
        </CardTitle>
        <CardDescription>
          Bliv professionel udlejer og få adgang til alle funktioner
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Din nuværende status</p>
              <p className="font-semibold text-foreground">Privat udlejer</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Opgradér til</p>
              <p className="font-semibold text-primary">Pro udlejer</p>
            </div>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Opgrader din profil til Pro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Opgrader til Pro-profil
                </DialogTitle>
                <DialogDescription>
                  Indtast dine virksomhedsoplysninger for at blive professionel udlejer. Du får 14 dages gratis prøveperiode.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Virksomhedsnavn *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData(p => ({ ...p, company_name: e.target.value }))}
                    placeholder="Dit firma ApS"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvr_number">CVR-nummer *</Label>
                  <Input
                    id="cvr_number"
                    value={formData.cvr_number}
                    onChange={(e) => setFormData(p => ({ ...p, cvr_number: e.target.value.replace(/\D/g, '').slice(0, 8) }))}
                    placeholder="12345678"
                    maxLength={8}
                  />
                  <p className="text-xs text-muted-foreground">
                    8-cifret CVR-nummer fra CVR-registeret
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    14 dages gratis prøveperiode
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Under prøveperioden kan du udforske alle Pro-funktioner. Dine biler vil være skjulte for lejere indtil du aktiverer dit abonnement.
                  </p>
                </div>

                <Button 
                  onClick={handleUpgrade} 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  {loading ? 'Opgraderer...' : 'Bekræft og opgrader'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradeToProCard;
