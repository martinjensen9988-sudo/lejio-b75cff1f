import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePaymentSettings } from '@/hooks/usePaymentSettings';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import LejioLogo from '@/components/LejioLogo';
import {
  ArrowLeft,
  User,
  Building2,
  CreditCard,
  Shield,
  Loader2,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';

interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  city: string;
  company_name: string;
  cvr_number: string;
  insurance_company: string;
  insurance_policy_number: string;
}

interface PaymentFormData {
  payment_gateway: string;
  gateway_api_key: string;
  gateway_merchant_id: string;
  bank_account: string;
}

const PAYMENT_GATEWAYS = [
  { value: 'none', label: 'Ingen (P2P via LEJIO)' },
  { value: 'quickpay', label: 'Quickpay' },
  { value: 'pensopay', label: 'PensoPay' },
  { value: 'reepay', label: 'Reepay' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'onpay', label: 'OnPay' },
];

const Settings = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { paymentSettings, updatePaymentSettings, loading: paymentLoading } = usePaymentSettings();
  const { toast } = useToast();

  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    postal_code: '',
    city: '',
    company_name: '',
    cvr_number: '',
    insurance_company: '',
    insurance_policy_number: '',
  });

  const [paymentFormData, setPaymentFormData] = useState<PaymentFormData>({
    payment_gateway: 'none',
    gateway_api_key: '',
    gateway_merchant_id: '',
    bank_account: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        postal_code: profile.postal_code || '',
        city: profile.city || '',
        company_name: profile.company_name || '',
        cvr_number: profile.cvr_number || '',
        insurance_company: profile.insurance_company || '',
        insurance_policy_number: profile.insurance_policy_number || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (paymentSettings) {
      setPaymentFormData({
        payment_gateway: paymentSettings.payment_gateway || 'none',
        gateway_api_key: paymentSettings.gateway_api_key || '',
        gateway_merchant_id: paymentSettings.gateway_merchant_id || '',
        bank_account: paymentSettings.bank_account || '',
      });
    }
  }, [paymentSettings]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Save profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          postal_code: formData.postal_code,
          city: formData.city,
          company_name: formData.company_name,
          cvr_number: formData.cvr_number,
          insurance_company: formData.insurance_company || null,
          insurance_policy_number: formData.insurance_policy_number || null,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Save payment settings separately
      const { error: paymentError } = await updatePaymentSettings({
        payment_gateway: paymentFormData.payment_gateway === 'none' ? null : paymentFormData.payment_gateway,
        gateway_api_key: paymentFormData.gateway_api_key || null,
        gateway_merchant_id: paymentFormData.gateway_merchant_id || null,
        bank_account: paymentFormData.bank_account || null,
      });

      if (paymentError) throw paymentError;

      toast({
        title: 'Indstillinger gemt',
        description: 'Dine profiloplysninger er blevet opdateret',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Fejl',
        description: 'Kunne ikke gemme indstillinger',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const isProfessional = profile?.user_type === 'professionel';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Tilbage
              </Button>
              <div className="h-6 w-px bg-border" />
              <LejioLogo size="sm" />
            </div>
            <h1 className="font-display font-bold text-foreground">Indstillinger</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Betaling</span>
            </TabsTrigger>
            <TabsTrigger value="insurance" className="gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Forsikring</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personlige oplysninger
                </CardTitle>
                <CardDescription>
                  Dine grundlæggende kontaktoplysninger
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Fulde navn</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData(p => ({ ...p, full_name: e.target.value }))}
                      placeholder="Dit navn"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+45 12 34 56 78"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank_account">Bankkonto (til udbetalinger)</Label>
                    <Input
                      id="bank_account"
                      value={paymentFormData.bank_account}
                      onChange={(e) => setPaymentFormData(p => ({ ...p, bank_account: e.target.value }))}
                      placeholder="1234-0012345678"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                    placeholder="Vejnavn og husnummer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postnummer</Label>
                    <Input
                      id="postal_code"
                      value={formData.postal_code}
                      onChange={(e) => setFormData(p => ({ ...p, postal_code: e.target.value }))}
                      placeholder="1234"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">By</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
                      placeholder="By"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {isProfessional && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Virksomhedsoplysninger
                  </CardTitle>
                  <CardDescription>
                    Kun for professionelle udlejere med CVR
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Virksomhedsnavn</Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => setFormData(p => ({ ...p, company_name: e.target.value }))}
                        placeholder="Dit firma ApS"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvr_number">CVR-nummer</Label>
                      <Input
                        id="cvr_number"
                        value={formData.cvr_number}
                        onChange={(e) => setFormData(p => ({ ...p, cvr_number: e.target.value }))}
                        placeholder="12345678"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Betalingsgateway
                </CardTitle>
                <CardDescription>
                  {isProfessional 
                    ? 'Tilslut din egen betalingsgateway for at modtage betalinger direkte'
                    : 'Som privat udlejer håndterer LEJIO betalinger for dig (15% gebyr)'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment_gateway">Vælg gateway</Label>
                  <Select
                    value={paymentFormData.payment_gateway}
                    onValueChange={(v) => setPaymentFormData(p => ({ ...p, payment_gateway: v }))}
                    disabled={!isProfessional}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Vælg betalingsgateway" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_GATEWAYS.map(gw => (
                        <SelectItem key={gw.value} value={gw.value}>
                          {gw.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isProfessional && paymentFormData.payment_gateway !== 'none' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="gateway_api_key">API-nøgle</Label>
                      <div className="relative">
                        <Input
                          id="gateway_api_key"
                          type={showApiKey ? 'text' : 'password'}
                          value={paymentFormData.gateway_api_key}
                          onChange={(e) => setPaymentFormData(p => ({ ...p, gateway_api_key: e.target.value }))}
                          placeholder="Din API-nøgle fra gateway"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Find din API-nøgle i din {PAYMENT_GATEWAYS.find(g => g.value === paymentFormData.payment_gateway)?.label} konto
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gateway_merchant_id">Merchant ID</Label>
                      <Input
                        id="gateway_merchant_id"
                        value={paymentFormData.gateway_merchant_id}
                        onChange={(e) => setPaymentFormData(p => ({ ...p, gateway_merchant_id: e.target.value }))}
                        placeholder="Dit Merchant ID"
                      />
                    </div>
                  </>
                )}

                {!isProfessional && (
                  <div className="p-4 bg-muted/50 rounded-xl border border-border">
                    <p className="text-sm text-muted-foreground">
                      Som privat udlejer håndterer LEJIO alle betalinger for dig. Pengene overføres til din bankkonto efter endt leje.
                      For at bruge din egen betalingsgateway skal du opgradere til en professionel konto med CVR.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insurance Tab */}
          <TabsContent value="insurance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Forsikringsoplysninger
                </CardTitle>
                <CardDescription>
                  Disse oplysninger bruges i lejekontrakterne
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="insurance_company">Forsikringsselskab</Label>
                  <Input
                    id="insurance_company"
                    value={formData.insurance_company}
                    onChange={(e) => setFormData(p => ({ ...p, insurance_company: e.target.value }))}
                    placeholder="F.eks. Tryg, Alm. Brand, Codan..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insurance_policy_number">Policenummer</Label>
                  <Input
                    id="insurance_policy_number"
                    value={formData.insurance_policy_number}
                    onChange={(e) => setFormData(p => ({ ...p, insurance_policy_number: e.target.value }))}
                    placeholder="Dit policenummer"
                  />
                </div>

                <div className="p-4 bg-accent/10 rounded-xl border border-accent/30">
                  <p className="text-sm text-foreground">
                    <strong>Vigtigt:</strong> Sørg for at din bilforsikring dækker udlejning til tredjemand. 
                    Kontakt dit forsikringsselskab for at bekræfte dette.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Gem indstillinger
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
