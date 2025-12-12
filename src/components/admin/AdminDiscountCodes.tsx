import { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, Percent, Gift, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  max_uses: number | null;
  current_uses: number;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

const AdminDiscountCodes = () => {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percent',
    discount_value: 10,
    max_uses: '',
    valid_until: '',
  });

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching discount codes:', error);
    } else {
      setCodes(data || []);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!formData.code || !formData.discount_value) {
      toast.error('Udfyld alle påkrævede felter');
      return;
    }

    setCreating(true);

    const { error } = await supabase.from('discount_codes').insert({
      code: formData.code.toUpperCase(),
      description: formData.description || null,
      discount_type: formData.discount_type,
      discount_value: formData.discount_value,
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
      valid_until: formData.valid_until || null,
    });

    if (error) {
      if (error.code === '23505') {
        toast.error('Denne kode eksisterer allerede');
      } else {
        toast.error('Kunne ikke oprette rabatkode');
      }
      setCreating(false);
      return;
    }

    toast.success('Rabatkode oprettet!');
    setShowCreate(false);
    setFormData({
      code: '',
      description: '',
      discount_type: 'percent',
      discount_value: 10,
      max_uses: '',
      valid_until: '',
    });
    fetchCodes();
    setCreating(false);
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('discount_codes')
      .update({ is_active: !currentState })
      .eq('id', id);

    if (error) {
      toast.error('Kunne ikke opdatere rabatkode');
      return;
    }

    fetchCodes();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('discount_codes')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Kunne ikke slette rabatkode');
      return;
    }

    toast.success('Rabatkode slettet');
    fetchCodes();
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rabatkoder</CardTitle>
              <CardDescription>Opret og administrer rabatkoder til kunder</CardDescription>
            </div>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Opret rabatkode
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {codes.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Ingen rabatkoder</h3>
              <p className="text-muted-foreground mb-4">Opret din første rabatkode</p>
              <Button onClick={() => setShowCreate(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Opret rabatkode
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Værdi</TableHead>
                  <TableHead>Brug</TableHead>
                  <TableHead>Udløber</TableHead>
                  <TableHead>Aktiv</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell>
                      <div>
                        <p className="font-mono font-bold">{code.code}</p>
                        {code.description && (
                          <p className="text-sm text-muted-foreground">{code.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {code.discount_type === 'percent' ? (
                          <><Percent className="w-3 h-3 mr-1" /> Procent</>
                        ) : (
                          <><Gift className="w-3 h-3 mr-1" /> Gratis måneder</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {code.discount_type === 'percent' 
                        ? `${code.discount_value}%`
                        : `${code.discount_value} mdr.`}
                    </TableCell>
                    <TableCell>
                      {code.current_uses} / {code.max_uses || '∞'}
                    </TableCell>
                    <TableCell>
                      {code.valid_until 
                        ? format(new Date(code.valid_until), 'dd. MMM yyyy', { locale: da })
                        : 'Ingen'}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={code.is_active}
                        onCheckedChange={() => handleToggleActive(code.id, code.is_active)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(code.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Opret rabatkode</DialogTitle>
            <DialogDescription>
              Opret en ny rabatkode som kunder kan bruge ved tilmelding
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Kode *</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="F.eks. VELKOMMEN20"
                  className="font-mono"
                />
                <Button variant="outline" type="button" onClick={generateRandomCode}>
                  Generer
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Beskrivelse</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="F.eks. Velkomsttilbud til nye kunder"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rabattype *</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, discount_type: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Procent rabat</SelectItem>
                    <SelectItem value="free_months">Gratis måneder</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  {formData.discount_type === 'percent' ? 'Procent' : 'Antal måneder'} *
                </Label>
                <Input
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_value: parseInt(e.target.value) || 0 }))}
                  min={1}
                  max={formData.discount_type === 'percent' ? 100 : 12}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max antal brug</Label>
                <Input
                  type="number"
                  value={formData.max_uses}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_uses: e.target.value }))}
                  placeholder="Ubegrænset"
                  min={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Udløbsdato</Label>
                <Input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>
                Annuller
              </Button>
              <Button className="flex-1" onClick={handleCreate} disabled={creating}>
                {creating ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Opret
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminDiscountCodes;
