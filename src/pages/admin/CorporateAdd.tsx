import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Plus, Building2 } from 'lucide-react';

const CorporateAddPage = () => {
  const navigate = useNavigate();
  const { hasAccess, isLoading: authLoading } = useAdminAuth();
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    cvr_number: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    ean_number: '',
    billing_address: '',
    billing_city: '',
    billing_postal_code: '',
    monthly_budget: '',
    commission_rate: '10',
    notes: '',
  });

  const handleCreate = async () => {
    if (!formData.company_name || !formData.cvr_number || !formData.contact_name || !formData.contact_email) {
      toast.error('Udfyld venligst alle påkrævede felter');
      return;
    }

    setCreating(true);
    const { error } = await supabase.from('corporate_accounts').insert({
      company_name: formData.company_name,
      cvr_number: formData.cvr_number,
      contact_name: formData.contact_name,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone || null,
      ean_number: formData.ean_number || null,
      billing_address: formData.billing_address || null,
      billing_city: formData.billing_city || null,
      billing_postal_code: formData.billing_postal_code || null,
      monthly_budget: formData.monthly_budget ? parseFloat(formData.monthly_budget) : null,
      commission_rate: parseFloat(formData.commission_rate) || 10,
      notes: formData.notes || null,
      status: 'active',
      contract_start_date: new Date().toISOString().split('T')[0],
    });

    setCreating(false);

    if (error) {
      toast.error('Kunne ikke oprette virksomhedskonto');
      console.error(error);
      return;
    }

    toast.success('Virksomhedskonto oprettet!');
    navigate('/admin/corporate');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAccess) {
    navigate('/admin');
    return null;
  }

  return (
    <AdminDashboardLayout activeTab="corporate">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin/corporate')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tilbage
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Opret virksomhedskonto</h2>
            <p className="text-muted-foreground">Tilføj en ny corporate fleet-kunde</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Virksomhedsoplysninger
            </CardTitle>
            <CardDescription>
              Udfyld oplysningerne for den nye virksomhedskonto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Virksomhedsnavn *</Label>
                <Input
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="ACME ApS"
                />
              </div>
              <div className="space-y-2">
                <Label>CVR-nummer *</Label>
                <Input
                  value={formData.cvr_number}
                  onChange={(e) => setFormData({ ...formData, cvr_number: e.target.value })}
                  placeholder="12345678"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kontaktperson *</Label>
                <Input
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  placeholder="Hans Hansen"
                />
              </div>
              <div className="space-y-2">
                <Label>Kontakt e-mail *</Label>
                <Input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  placeholder="hans@acme.dk"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="+45 12 34 56 78"
                />
              </div>
              <div className="space-y-2">
                <Label>EAN-nummer</Label>
                <Input
                  value={formData.ean_number}
                  onChange={(e) => setFormData({ ...formData, ean_number: e.target.value })}
                  placeholder="5790001234567"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Faktureringsadresse</Label>
              <Input
                value={formData.billing_address}
                onChange={(e) => setFormData({ ...formData, billing_address: e.target.value })}
                placeholder="Hovedgaden 1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>By</Label>
                <Input
                  value={formData.billing_city}
                  onChange={(e) => setFormData({ ...formData, billing_city: e.target.value })}
                  placeholder="København"
                />
              </div>
              <div className="space-y-2">
                <Label>Postnummer</Label>
                <Input
                  value={formData.billing_postal_code}
                  onChange={(e) => setFormData({ ...formData, billing_postal_code: e.target.value })}
                  placeholder="1000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Månedligt budget (DKK)</Label>
                <Input
                  type="number"
                  value={formData.monthly_budget}
                  onChange={(e) => setFormData({ ...formData, monthly_budget: e.target.value })}
                  placeholder="50000"
                />
              </div>
              <div className="space-y-2">
                <Label>Kommissionsrate (%)</Label>
                <Input
                  type="number"
                  value={formData.commission_rate}
                  onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
                  placeholder="10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Noter</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Eventuelle noter om aftalen..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => navigate('/admin/corporate')}>
                Annuller
              </Button>
              <Button className="flex-1" onClick={handleCreate} disabled={creating}>
                {creating ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Opret virksomhedskonto
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
};

export default CorporateAddPage;
