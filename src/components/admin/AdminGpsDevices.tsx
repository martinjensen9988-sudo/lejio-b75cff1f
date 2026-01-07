import { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

interface GpsDevice {
  id: string;
  device_id: string;
  device_name: string | null;
  provider: string;
  is_active: boolean;
  last_seen_at: string | null;
  webhook_secret: string | null;
  vehicle_id: string;
  vehicle?: {
    make: string;
    model: string;
    registration: string;
    owner_id: string;
  };
  owner?: {
    email: string;
    company_name: string | null;
    full_name: string | null;
  };
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  registration: string;
  owner_id: string;
}

interface Profile {
  id: string;
  email: string;
  company_name: string | null;
  full_name: string | null;
}

const GPS_PROVIDERS = [
  { value: 'generic', label: 'Generic GPS' },
  { value: 'teltonika', label: 'Teltonika' },
  { value: 'queclink', label: 'Queclink' },
  { value: 'ruptela', label: 'Ruptela' },
  { value: 'other', label: 'Anden' },
];

const AdminGpsDevices = () => {
  const [devices, setDevices] = useState<GpsDevice[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [formData, setFormData] = useState({
    vehicle_id: '',
    device_id: '',
    device_name: '',
    provider: 'generic',
    webhook_secret: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // Fetch all GPS devices with vehicle info
    const { data: devicesData, error: devicesError } = await supabase
      .from('gps_devices')
      .select(`
        *,
        vehicle:vehicles(make, model, registration, owner_id)
      `)
      .order('created_at', { ascending: false });

    if (devicesError) {
      console.error('Error fetching devices:', devicesError);
    } else if (devicesData) {
      // Fetch owner profiles for each device
      const ownerIds = [...new Set(devicesData.map(d => d.vehicle?.owner_id).filter(Boolean))];
      
      if (ownerIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, email, company_name, full_name')
          .in('id', ownerIds);

        const profileMap = new Map(profilesData?.map(p => [p.id, p]) || []);
        
        const devicesWithOwners = devicesData.map(device => ({
          ...device,
          owner: device.vehicle?.owner_id ? profileMap.get(device.vehicle.owner_id) : undefined,
        }));
        
        setDevices(devicesWithOwners);
      } else {
        setDevices(devicesData);
      }
    }

    // Fetch all profiles for dropdown
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('id, email, company_name, full_name')
      .order('email');

    if (allProfiles) {
      setProfiles(allProfiles);
    }

    setLoading(false);
  };

  const fetchUserVehicles = async (userId: string) => {
    const { data } = await supabase
      .from('vehicles')
      .select('id, make, model, registration, owner_id')
      .eq('owner_id', userId)
      .order('make');

    setVehicles(data || []);
  };

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    setFormData(prev => ({ ...prev, vehicle_id: '' }));
    fetchUserVehicles(userId);
  };

  const generateWebhookSecret = () => {
    // Use cryptographically secure random generation
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const secret = Array.from(array, byte => 
      byte.toString(16).padStart(2, '0')
    ).join('');
    setFormData(prev => ({ ...prev, webhook_secret: secret }));
  };

  const handleSubmit = async () => {
    if (!formData.vehicle_id || !formData.device_id) {
      toast.error('Vælg køretøj og indtast device ID');
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from('gps_devices')
      .insert({
        vehicle_id: formData.vehicle_id,
        device_id: formData.device_id,
        device_name: formData.device_name || null,
        provider: formData.provider,
        webhook_secret: formData.webhook_secret || null,
      });

    if (error) {
      console.error('Error adding device:', error);
      toast.error('Kunne ikke tilføje GPS-enhed');
    } else {
      toast.success('GPS-enhed tilføjet!');
      setDialogOpen(false);
      setFormData({ vehicle_id: '', device_id: '', device_name: '', provider: 'generic', webhook_secret: '' });
      setSelectedUserId('');
      setVehicles([]);
      fetchData();
    }

    setSaving(false);
  };

  const handleDelete = async (deviceId: string) => {
    if (!confirm('Er du sikker på, at du vil slette denne GPS-enhed?')) return;

    const { error } = await supabase
      .from('gps_devices')
      .delete()
      .eq('id', deviceId);

    if (error) {
      toast.error('Kunne ikke slette GPS-enhed');
    } else {
      toast.success('GPS-enhed slettet');
      fetchData();
    }
  };

  const filteredDevices = devices.filter(d =>
    d.device_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.device_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.vehicle?.registration?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.owner?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.owner?.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              GPS-enheder
            </CardTitle>
            <CardDescription>Administrer GPS-trackere for udlejere</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tilføj GPS-enhed
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tilføj GPS-enhed</DialogTitle>
                <DialogDescription>
                  Tilføj en ny GPS-tracker til en udlejers køretøj
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Vælg udlejer</Label>
                  <Select value={selectedUserId} onValueChange={handleUserChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vælg udlejer..." />
                    </SelectTrigger>
                    <SelectContent>
                      {profiles.map(profile => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.company_name || profile.full_name || profile.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedUserId && (
                  <div className="space-y-2">
                    <Label>Vælg køretøj</Label>
                    <Select 
                      value={formData.vehicle_id} 
                      onValueChange={(v) => setFormData(prev => ({ ...prev, vehicle_id: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Vælg køretøj..." />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map(vehicle => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.make} {vehicle.model} ({vehicle.registration})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>GPS-udbyder</Label>
                  <Select 
                    value={formData.provider} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, provider: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GPS_PROVIDERS.map(p => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Device ID</Label>
                  <Input
                    value={formData.device_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, device_id: e.target.value }))}
                    placeholder="Unikt device ID fra trackeren"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Enhedsnavn (valgfrit)</Label>
                  <Input
                    value={formData.device_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, device_name: e.target.value }))}
                    placeholder="F.eks. 'Tracker 1'"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Webhook Secret (valgfrit)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.webhook_secret}
                      onChange={(e) => setFormData(prev => ({ ...prev, webhook_secret: e.target.value }))}
                      placeholder="Til sikker webhook-validering"
                    />
                    <Button type="button" variant="outline" onClick={generateWebhookSecret}>
                      Generer
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuller
                </Button>
                <Button onClick={handleSubmit} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Tilføj
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Søg efter device ID, nummerplade, udlejer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredDevices.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Ingen GPS-enheder fundet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enhed</TableHead>
                <TableHead>Køretøj</TableHead>
                <TableHead>Udlejer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sidst set</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{device.device_name || device.device_id}</p>
                      <p className="text-sm text-muted-foreground">{device.provider}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {device.vehicle ? (
                      <div>
                        <p>{device.vehicle.make} {device.vehicle.model}</p>
                        <p className="text-sm text-muted-foreground">{device.vehicle.registration}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {device.owner ? (
                      <div>
                        <p>{device.owner.company_name || device.owner.full_name || '-'}</p>
                        <p className="text-sm text-muted-foreground">{device.owner.email}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={device.is_active ? 'default' : 'secondary'}>
                      {device.is_active ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {device.last_seen_at ? (
                      format(new Date(device.last_seen_at), 'dd. MMM yyyy HH:mm', { locale: da })
                    ) : (
                      <span className="text-muted-foreground">Aldrig</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(device.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminGpsDevices;
