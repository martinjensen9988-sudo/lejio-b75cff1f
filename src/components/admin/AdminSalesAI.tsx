import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSalesLeads, SalesLead } from '@/hooks/useSalesLeads';
import { useCVRLookup } from '@/hooks/useCVRLookup';
import { 
  Plus, 
  Search, 
  Upload, 
  Mail, 
  Building2, 
  Phone, 
  Globe,
  Sparkles,
  Copy,
  Send,
  Loader2,
  Trash2,
  FileText,
  Facebook
} from 'lucide-react';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  interested: 'bg-green-100 text-green-800',
  not_interested: 'bg-red-100 text-red-800',
  converted: 'bg-purple-100 text-purple-800',
};

const statusLabels: Record<string, string> = {
  new: 'Ny',
  contacted: 'Kontaktet',
  interested: 'Interesseret',
  not_interested: 'Ikke interesseret',
  converted: 'Konverteret',
};

const sourceLabels: Record<string, string> = {
  manual: 'Manuel',
  cvr: 'CVR-opslag',
  facebook: 'Facebook',
  csv: 'CSV-import',
};

export default function AdminSalesAI() {
  const { 
    leads, 
    isLoading, 
    fetchLeads, 
    addLead, 
    updateLead, 
    deleteLead,
    importFromCSV,
    generateEmail,
    saveEmail 
  } = useSalesLeads();
  
  const { lookupCVR, isLoading: cvrLoading } = useCVRLookup();
  
  const [activeTab, setActiveTab] = useState('leads');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Add lead dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newLead, setNewLead] = useState<Partial<SalesLead>>({});
  const [cvrSearch, setCvrSearch] = useState('');
  
  // Email dialog
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<SalesLead | null>(null);
  const [emailType, setEmailType] = useState('introduction');
  const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Import dialog
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [facebookText, setFacebookText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleCVRLookup = async () => {
    if (!cvrSearch) return;
    
    const result = await lookupCVR(cvrSearch);
    if (result) {
      setNewLead({
        company_name: result.companyName,
        cvr_number: result.cvr,
        address: result.address,
        city: result.city,
        postal_code: result.postalCode,
        contact_phone: result.phone,
        contact_email: result.email,
        industry: result.industry,
        source: 'cvr',
      });
    }
  };

  const handleAddLead = async () => {
    if (!newLead.company_name) return;
    
    await addLead(newLead);
    setAddDialogOpen(false);
    setNewLead({});
    setCvrSearch('');
  };

  const handleGenerateEmail = async () => {
    if (!selectedLead) return;
    
    setIsGenerating(true);
    const result = await generateEmail(selectedLead, emailType);
    if (result) {
      setGeneratedEmail(result);
    }
    setIsGenerating(false);
  };

  const handleCopyEmail = () => {
    if (!generatedEmail) return;
    
    const text = `Emne: ${generatedEmail.subject}\n\n${generatedEmail.body}`;
    navigator.clipboard.writeText(text);
  };

  const handleSaveEmail = async () => {
    if (!selectedLead || !generatedEmail) return;
    
    await saveEmail(selectedLead.id, generatedEmail.subject, generatedEmail.body);
    await updateLead(selectedLead.id, { 
      status: 'contacted',
      last_contacted_at: new Date().toISOString()
    });
    setEmailDialogOpen(false);
    setGeneratedEmail(null);
  };

  const handleImportCSV = async () => {
    if (!csvText.trim()) return;
    
    setIsImporting(true);
    await importFromCSV(csvText);
    setImportDialogOpen(false);
    setCsvText('');
    setIsImporting(false);
  };

  const handleImportFacebook = async () => {
    if (!facebookText.trim()) return;
    
    setIsImporting(true);
    
    // Parse Facebook text - typically company names, one per line
    const lines = facebookText.trim().split('\n');
    const leads: Partial<SalesLead>[] = lines
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(company_name => ({
        company_name,
        source: 'facebook',
      }));
    
    for (const lead of leads) {
      await addLead(lead);
    }
    
    setImportDialogOpen(false);
    setFacebookText('');
    setIsImporting(false);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.cvr_number?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Salgs AI</h2>
          <p className="text-muted-foreground">Find nye kunder og generer personlige emails</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Importer leads</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="csv">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="csv">
                    <FileText className="w-4 h-4 mr-2" />
                    CSV
                  </TabsTrigger>
                  <TabsTrigger value="facebook">
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="csv" className="space-y-4">
                  <div>
                    <Label>CSV-data</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Indsæt CSV med kolonner: virksomhed, cvr, kontakt, email, telefon, by, branche
                    </p>
                    <Textarea
                      value={csvText}
                      onChange={(e) => setCsvText(e.target.value)}
                      placeholder="virksomhed,cvr,kontakt,email,telefon&#10;Firma A/S,12345678,Peter Hansen,peter@firma.dk,12345678"
                      rows={8}
                    />
                  </div>
                  <Button onClick={handleImportCSV} disabled={isImporting || !csvText.trim()}>
                    {isImporting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Importer CSV
                  </Button>
                </TabsContent>
                <TabsContent value="facebook" className="space-y-4">
                  <div>
                    <Label>Firmanavne fra Facebook</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Indsæt firmanavne (ét per linje) fra Facebook grupper eller sider
                    </p>
                    <Textarea
                      value={facebookText}
                      onChange={(e) => setFacebookText(e.target.value)}
                      placeholder="Auto Hansen A/S&#10;Biludlejning Vest&#10;Biler & Co"
                      rows={8}
                    />
                  </div>
                  <Button onClick={handleImportFacebook} disabled={isImporting || !facebookText.trim()}>
                    {isImporting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Importer fra Facebook
                  </Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
          
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tilføj lead
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tilføj nyt lead</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label>CVR-opslag</Label>
                    <Input
                      value={cvrSearch}
                      onChange={(e) => setCvrSearch(e.target.value)}
                      placeholder="Indtast CVR-nummer"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleCVRLookup} disabled={cvrLoading}>
                      {cvrLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Firmanavn *</Label>
                    <Input
                      value={newLead.company_name || ''}
                      onChange={(e) => setNewLead({ ...newLead, company_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>CVR</Label>
                    <Input
                      value={newLead.cvr_number || ''}
                      onChange={(e) => setNewLead({ ...newLead, cvr_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Kontaktperson</Label>
                    <Input
                      value={newLead.contact_name || ''}
                      onChange={(e) => setNewLead({ ...newLead, contact_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newLead.contact_email || ''}
                      onChange={(e) => setNewLead({ ...newLead, contact_email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Telefon</Label>
                    <Input
                      value={newLead.contact_phone || ''}
                      onChange={(e) => setNewLead({ ...newLead, contact_phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>By</Label>
                    <Input
                      value={newLead.city || ''}
                      onChange={(e) => setNewLead({ ...newLead, city: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Branche</Label>
                    <Input
                      value={newLead.industry || ''}
                      onChange={(e) => setNewLead({ ...newLead, industry: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Noter</Label>
                    <Textarea
                      value={newLead.notes || ''}
                      onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                    />
                  </div>
                </div>
                
                <Button onClick={handleAddLead} className="w-full" disabled={!newLead.company_name}>
                  Tilføj lead
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Søg i leads..."
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="new">Nye</SelectItem>
                  <SelectItem value="contacted">Kontaktet</SelectItem>
                  <SelectItem value="interested">Interesseret</SelectItem>
                  <SelectItem value="not_interested">Ikke interesseret</SelectItem>
                  <SelectItem value="converted">Konverteret</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge variant="secondary">{filteredLeads.length} leads</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Ingen leads fundet</p>
              <p className="text-sm">Tilføj leads manuelt, via CVR-opslag, eller importer fra fil</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Virksomhed</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kilde</TableHead>
                  <TableHead>Tilføjet</TableHead>
                  <TableHead className="text-right">Handlinger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{lead.company_name}</p>
                        {lead.cvr_number && (
                          <p className="text-sm text-muted-foreground">CVR: {lead.cvr_number}</p>
                        )}
                        {lead.city && (
                          <p className="text-sm text-muted-foreground">{lead.city}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {lead.contact_name && <p>{lead.contact_name}</p>}
                        {lead.contact_email && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {lead.contact_email}
                          </p>
                        )}
                        {lead.contact_phone && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {lead.contact_phone}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={lead.status}
                        onValueChange={(value) => updateLead(lead.id, { status: value })}
                      >
                        <SelectTrigger className="w-32">
                          <Badge className={statusColors[lead.status]}>
                            {statusLabels[lead.status]}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{sourceLabels[lead.source] || lead.source}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(lead.created_at), 'd. MMM yyyy', { locale: da })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedLead(lead);
                            setEmailDialogOpen(true);
                            setGeneratedEmail(null);
                          }}
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          Generer email
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLead(lead.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Email generation dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Generer email til {selectedLead?.company_name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Email-type</Label>
              <Select value={emailType} onValueChange={setEmailType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="introduction">Introduktion</SelectItem>
                  <SelectItem value="followup">Opfølgning</SelectItem>
                  <SelectItem value="offer">Særligt tilbud</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleGenerateEmail} disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Genererer...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generer email
                </>
              )}
            </Button>
            
            {generatedEmail && (
              <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
                <div>
                  <Label>Emne</Label>
                  <Input 
                    value={generatedEmail.subject} 
                    onChange={(e) => setGeneratedEmail({ ...generatedEmail, subject: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Indhold</Label>
                  <Textarea 
                    value={generatedEmail.body} 
                    onChange={(e) => setGeneratedEmail({ ...generatedEmail, body: e.target.value })}
                    rows={8}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCopyEmail}>
                    <Copy className="w-4 h-4 mr-2" />
                    Kopier
                  </Button>
                  <Button onClick={handleSaveEmail}>
                    <Send className="w-4 h-4 mr-2" />
                    Gem & marker kontaktet
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}