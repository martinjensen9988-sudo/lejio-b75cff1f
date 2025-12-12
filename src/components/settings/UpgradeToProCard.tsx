import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCVRLookup } from '@/hooks/useCVRLookup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, Sparkles, Building2, CheckCircle, ArrowRight, XCircle, MapPin, Phone, Mail, Calendar, Briefcase, Receipt, Save } from 'lucide-react';

interface UpgradeToProCardProps {
  onUpgradeSuccess?: () => void;
}

const UpgradeToProCard = ({ onUpgradeSuccess }: UpgradeToProCardProps) => {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveContactInfo, setSaveContactInfo] = useState(true);
  const [formData, setFormData] = useState({
    company_name: '',
    cvr_number: '',
  });
  const { data: cvrData, lookupCVR, isLoading: cvrLoading, error: cvrError, isCompanyActive } = useCVRLookup();

  // Auto-lookup CVR when 8 digits are entered
  useEffect(() => {
    const cleanCvr = formData.cvr_number.replace(/\D/g, '');
    if (cleanCvr.length === 8) {
      lookupCVR(cleanCvr).then((result) => {
        if (result?.companyName && result.isActive) {
          setFormData(prev => ({ ...prev, company_name: result.companyName }));
          toast.success('Virksomhed fundet!', {
            description: result.companyName,
          });
        } else if (result?.companyName && !result.isActive) {
          setFormData(prev => ({ ...prev, company_name: result.companyName }));
          toast.error('Virksomheden er ikke aktiv', {
            description: 'Kun aktive virksomheder kan registreres.',
          });
        }
      });
    }
  }, [formData.cvr_number, lookupCVR]);

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

    // Check if company is active
    if (cvrData && !cvrData.isActive) {
      toast.error('Virksomheden er ikke aktiv', {
        description: 'Kun aktive virksomheder kan registreres på platformen.',
      });
      return;
    }

    // Check if company is VAT registered
    if (cvrData && !cvrData.vatRegistered) {
      toast.error('Virksomheden er ikke momsregistreret', {
        description: 'Kun momsregistrerede virksomheder kan registreres som Pro.',
      });
      return;
    }

    setLoading(true);
    try {
      const updateData: Record<string, any> = {
        user_type: 'professionel',
        company_name: formData.company_name.trim(),
        cvr_number: formData.cvr_number.trim(),
        subscription_status: 'trial',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      };

      // Add CVR data to profile if checkbox is checked
      if (saveContactInfo && cvrData) {
        if (cvrData.address) updateData.address = cvrData.address;
        if (cvrData.postalCode) updateData.postal_code = cvrData.postalCode;
        if (cvrData.city) updateData.city = cvrData.city;
        if (cvrData.phone) updateData.phone = cvrData.phone;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
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
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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
                  <Label htmlFor="cvr_number">CVR-nummer *</Label>
                  <div className="relative">
                    <Input
                      id="cvr_number"
                      value={formData.cvr_number}
                      onChange={(e) => setFormData(p => ({ ...p, cvr_number: e.target.value.replace(/\D/g, '').slice(0, 8) }))}
                      placeholder="12345678"
                      maxLength={8}
                      className="pr-10"
                    />
                    {cvrLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      </div>
                    )}
                    {!cvrLoading && cvrData?.isActive && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    )}
                    {!cvrLoading && cvrData && !cvrData.isActive && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <XCircle className="w-4 h-4 text-destructive" />
                      </div>
                    )}
                  </div>
                  {cvrError && (
                    <p className="text-xs text-destructive">{cvrError}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Indtast 8 cifre for automatisk virksomhedsopslag
                  </p>
                </div>

                {/* Company Info Display */}
                {cvrData && (
                  <div className={`p-4 rounded-xl border ${cvrData.isActive ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' : 'bg-destructive/10 border-destructive/30'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      {cvrData.isActive ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                      <span className={`font-semibold ${cvrData.isActive ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>
                        {cvrData.isActive ? 'Aktiv virksomhed' : 'Inaktiv virksomhed'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">{cvrData.companyName}</p>
                          {cvrData.companyType && (
                            <p className="text-xs text-muted-foreground">{cvrData.companyType}</p>
                          )}
                        </div>
                      </div>
                      
                      {(cvrData.address || cvrData.city) && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <p>
                            {cvrData.address}
                            {cvrData.postalCode && cvrData.city && `, ${cvrData.postalCode} ${cvrData.city}`}
                          </p>
                        </div>
                      )}
                      
                      {cvrData.industry && (
                        <div className="flex items-start gap-2">
                          <Briefcase className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <p>{cvrData.industry}</p>
                        </div>
                      )}
                      
                      {cvrData.startDate && (
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <p>Stiftet: {cvrData.startDate}</p>
                        </div>
                      )}
                      
                      {cvrData.phone && (
                        <div className="flex items-start gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <p>{cvrData.phone}</p>
                        </div>
                      )}
                      
                      {cvrData.email && (
                        <div className="flex items-start gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <p>{cvrData.email}</p>
                        </div>
                      )}

                      {/* VAT Registration Status */}
                      <div className="flex items-start gap-2">
                        <Receipt className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          {cvrData.vatRegistered ? (
                            <p className="text-green-600 dark:text-green-400 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Momsregistreret {cvrData.vatNumber && `(${cvrData.vatNumber})`}
                            </p>
                          ) : (
                            <p className="text-destructive flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              Ikke momsregistreret
                            </p>
                          )}
                        </div>
                      </div>

                      {cvrData.status && (
                        <div className="pt-2 border-t border-border/50 mt-2">
                          <p className="text-xs text-muted-foreground">Status: {cvrData.status}</p>
                        </div>
                      )}
                    </div>

                    {/* Save contact info checkbox */}
                    {(cvrData.address || cvrData.phone) && cvrData.isActive && cvrData.vatRegistered && (
                      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-border/50">
                        <Checkbox 
                          id="saveContactInfo" 
                          checked={saveContactInfo}
                          onCheckedChange={(checked) => setSaveContactInfo(checked === true)}
                        />
                        <label 
                          htmlFor="saveContactInfo" 
                          className="text-xs text-muted-foreground cursor-pointer flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          Gem adresse og telefon til min profil
                        </label>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="company_name">Virksomhedsnavn *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData(p => ({ ...p, company_name: e.target.value }))}
                    placeholder="Dit firma ApS"
                    disabled={cvrLoading}
                  />
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
                  disabled={loading || cvrLoading || (cvrData && !cvrData.isActive) || (cvrData && !cvrData.vatRegistered)}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  {loading ? 'Opgraderer...' : 'Bekræft og opgrader'}
                </Button>

                {cvrData && !cvrData.vatRegistered && cvrData.isActive && (
                  <p className="text-xs text-destructive text-center mt-2">
                    Kun momsregistrerede virksomheder kan registreres som Pro-udlejer.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradeToProCard;
