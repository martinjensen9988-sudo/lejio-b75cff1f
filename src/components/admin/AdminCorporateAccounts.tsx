import { useState, useEffect } from 'react';
import { Building2, Plus, Users, Car, FileText, Loader2, MoreHorizontal, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

interface CorporateAccount {
  id: string;
  company_name: string;
  cvr_number: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  ean_number: string | null;
  billing_address: string | null;
  billing_city: string | null;
  billing_postal_code: string | null;
  monthly_budget: number | null;
  commission_rate: number | null;
  status: string | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
  notes: string | null;
  created_at: string | null;
}

interface CorporateStats {
  total_employees: number;
  total_fleet_vehicles: number;
  total_bookings: number;
  total_invoices: number;
}

const AdminCorporateAccounts = () => {
  const [accounts, setAccounts] = useState<CorporateAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<CorporateAccount | null>(null);
  const [accountStats, setAccountStats] = useState<CorporateStats | null>(null);
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

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const { data, error } = await supabase
      .from('corporate_accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Kunne ikke hente virksomhedskonti');
      console.error(error);
    } else {
      setAccounts(data || []);
    }
    setLoading(false);
  };

  const fetchAccountStats = async (accountId: string) => {
    const [employees, vehicles, bookings, invoices] = await Promise.all([
      supabase.from('corporate_employees').select('id', { count: 'exact' }).eq('corporate_account_id', accountId),
      supabase.from('corporate_fleet_vehicles').select('id', { count: 'exact' }).eq('corporate_account_id', accountId),
      supabase.from('corporate_bookings').select('id', { count: 'exact' }).eq('corporate_account_id', accountId),
      supabase.from('corporate_invoices').select('id', { count: 'exact' }).eq('corporate_account_id', accountId),
    ]);

    setAccountStats({
      total_employees: employees.count || 0,
      total_fleet_vehicles: vehicles.count || 0,
      total_bookings: bookings.count || 0,
      total_invoices: invoices.count || 0,
    });
  };

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
    setShowCreateDialog(false);
    setFormData({
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
    fetchAccounts();
  };

  const handleViewDetails = async (account: CorporateAccount) => {
    setSelectedAccount(account);
    setShowDetailsDialog(true);
    await fetchAccountStats(account.id);
  };

  const handleUpdateStatus = async (accountId: string, status: string) => {
    const { error } = await supabase
      .from('corporate_accounts')
      .update({ status })
      .eq('id', accountId);

    if (error) {
      toast.error('Kunne ikke opdatere status');
      return;
    }

    toast.success('Status opdateret');
    fetchAccounts();
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-accent">Aktiv</Badge>;
      case 'pending':
        return <Badge variant="secondary">Afventer</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspenderet</Badge>;
      case 'terminated':
        return <Badge variant="outline">Opsagt</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Virksomhedskonti
            </CardTitle>
            <CardDescription>Administrer corporate fleet-kunder</CardDescription>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Opret virksomhed
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Opret ny virksomhedskonto</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Virksomhedsnavn *</Label>
                    <Input
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      placeholder="ACME ApS"
                    />
                  </div>
                  <div>
                    <Label>CVR-nummer *</Label>
                    <Input
                      value={formData.cvr_number}
                      onChange={(e) => setFormData({ ...formData, cvr_number: e.target.value })}
                      placeholder="12345678"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Kontaktperson *</Label>
                    <Input
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      placeholder="Hans Hansen"
                    />
                  </div>
                  <div>
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
                  <div>
                    <Label>Telefon</Label>
                    <Input
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      placeholder="+45 12 34 56 78"
                    />
                  </div>
                  <div>
                    <Label>EAN-nummer</Label>
                    <Input
                      value={formData.ean_number}
                      onChange={(e) => setFormData({ ...formData, ean_number: e.target.value })}
                      placeholder="5790001234567"
                    />
                  </div>
                </div>
                <div>
                  <Label>Faktureringsadresse</Label>
                  <Input
                    value={formData.billing_address}
                    onChange={(e) => setFormData({ ...formData, billing_address: e.target.value })}
                    placeholder="Hovedgaden 1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>By</Label>
                    <Input
                      value={formData.billing_city}
                      onChange={(e) => setFormData({ ...formData, billing_city: e.target.value })}
                      placeholder="København"
                    />
                  </div>
                  <div>
                    <Label>Postnummer</Label>
                    <Input
                      value={formData.billing_postal_code}
                      onChange={(e) => setFormData({ ...formData, billing_postal_code: e.target.value })}
                      placeholder="1000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Månedligt budget (DKK)</Label>
                    <Input
                      type="number"
                      value={formData.monthly_budget}
                      onChange={(e) => setFormData({ ...formData, monthly_budget: e.target.value })}
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <Label>Kommissionsrate (%)</Label>
                    <Input
                      type="number"
                      value={formData.commission_rate}
                      onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
                      placeholder="10"
                    />
                  </div>
                </div>
                <div>
                  <Label>Noter</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Eventuelle noter om aftalen..."
                    rows={3}
                  />
                </div>
                <Button onClick={handleCreate} disabled={creating} className="w-full">
                  {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Opret virksomhedskonto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Ingen virksomhedskonti endnu</p>
            <p className="text-sm">Opret den første virksomhedskonto for at komme i gang</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Virksomhed</TableHead>
                  <TableHead className="hidden sm:table-cell">CVR</TableHead>
                  <TableHead className="hidden md:table-cell">Kontaktperson</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Oprettet</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{account.company_name}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">CVR: {account.cvr_number}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{account.cvr_number}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>
                        <p>{account.contact_name}</p>
                        <p className="text-xs text-muted-foreground">{account.contact_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(account.status)}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {account.created_at && format(new Date(account.created_at), 'dd. MMM yyyy', { locale: da })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(account)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Se detaljer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(account.id, 'active')}>
                            Aktiver
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(account.id, 'suspended')}>
                            Suspender
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(account.id, 'terminated')}>
                            Opsig
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedAccount?.company_name}</DialogTitle>
            </DialogHeader>
            {selectedAccount && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{accountStats?.total_employees || 0}</p>
                        <p className="text-xs text-muted-foreground">Medarbejdere</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-accent" />
                      <div>
                        <p className="text-2xl font-bold">{accountStats?.total_fleet_vehicles || 0}</p>
                        <p className="text-xs text-muted-foreground">Køretøjer</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-secondary" />
                      <div>
                        <p className="text-2xl font-bold">{accountStats?.total_bookings || 0}</p>
                        <p className="text-xs text-muted-foreground">Bookinger</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-warm" />
                      <div>
                        <p className="text-2xl font-bold">{accountStats?.total_invoices || 0}</p>
                        <p className="text-xs text-muted-foreground">Fakturaer</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">CVR-nummer</p>
                    <p className="font-medium">{selectedAccount.cvr_number}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">EAN-nummer</p>
                    <p className="font-medium">{selectedAccount.ean_number || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Kontaktperson</p>
                    <p className="font-medium">{selectedAccount.contact_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">E-mail</p>
                    <p className="font-medium">{selectedAccount.contact_email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Telefon</p>
                    <p className="font-medium">{selectedAccount.contact_phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Kommissionsrate</p>
                    <p className="font-medium">{selectedAccount.commission_rate || 10}%</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Faktureringsadresse</p>
                    <p className="font-medium">
                      {selectedAccount.billing_address && `${selectedAccount.billing_address}, `}
                      {selectedAccount.billing_postal_code} {selectedAccount.billing_city}
                    </p>
                  </div>
                  {selectedAccount.notes && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Noter</p>
                      <p className="font-medium">{selectedAccount.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminCorporateAccounts;
