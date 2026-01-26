import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const STANDARD_FEATURES = ['booking_calendar', 'contract_generation', 'pdf_email']; // Tilpas listen efter behov
const FEATURES = [
  { key: 'booking_calendar', label: 'Smart Booking-kalender' },
  { key: 'auto_availability', label: 'Automatisk tilgængelighed' },
  { key: 'subscription_rental', label: 'Abonnementsudlejning' },
  { key: 'ai_pricing', label: 'AI-prissætning' },
  { key: 'season_pricing', label: 'Sæsonpriser' },
  { key: 'multi_location', label: 'Multi-lokation support' },
  { key: 'location_hours', label: 'Åbningstider pr. lokation' },
  { key: 'special_closures', label: 'Særlige lukkedage' },
  { key: 'location_on_vehicle', label: 'Lokation på køretøj' },
  { key: 'contract_generation', label: 'Automatisk kontraktgenerering' },
  { key: 'digital_signature', label: 'Digital underskrift' },
  { key: 'pdf_email', label: 'PDF-download & Email' },
  { key: 'damage_ai', label: 'Skaderapporter med AI' },
  { key: 'location_in_contract', label: 'Lokationsinfo i kontrakt' },
  { key: 'license_plate_scan', label: 'Nummerplade-scanning' },
  { key: 'dashboard_photo_ai', label: 'Dashboard-foto med AI' },
  { key: 'gps_verification', label: 'GPS-lokationsverifikation' },
  { key: 'auto_statement', label: 'Automatisk opgørelse' },
  { key: 'qr_checkin', label: 'QR-kode check-in' },
  { key: 'payment_methods', label: 'Flere betalingsmetoder' },
  { key: 'auto_subscription_payment', label: 'Automatisk abonnementsbetaling' },
  { key: 'deposit_handling', label: 'Depositumhåndtering' },
  { key: 'selfrisk_insurance', label: 'Selvrisiko-forsikring' },
  { key: 'fuel_policy', label: 'Brændstofpolitik' },
  { key: 'platform_fee_payment', label: 'Platformgebyr-betaling' },
  { key: 'gps_security', label: 'GPS-sikkerhed' },
  { key: 'geofencing', label: 'Geofencing-alarmer' },
  { key: 'km_registration', label: 'Kilometerregistrering' },
  { key: 'webhook_gps', label: 'Webhook-integration' },
  { key: 'mc_license_validation', label: 'MC-kørekort validering' },
  { key: 'mc_maintenance', label: 'MC-specifik vedligeholdelse' },
  { key: 'season_checklist', label: 'Sæson-tjekliste' },
  { key: 'mc_checkin_guide', label: 'MC Check-in guide' },
  { key: 'smart_service', label: 'Smart Service hos LEJIO' },
  { key: 'inspection_reminders', label: 'Syns-påmindelser' },
  { key: 'tire_management', label: 'Dækstyring' },
  { key: 'replacement_car', label: 'Byttebil-funktion' },
  { key: 'service_booking', label: 'Service-booking' },
  { key: 'auto_dispatch_ai', label: 'Auto-Dispatch AI' },
  { key: 'ai_dashboard_analysis', label: 'Dashboard-analyse' },
  { key: 'ai_translation', label: 'AI-oversættelse' },
  { key: 'damage_ai_analysis', label: 'Skade-AI' },
  { key: 'messaging', label: 'Indbygget beskedsystem' },
  { key: 'push_notifications', label: 'Push-notifikationer' },
  { key: 'auto_emails', label: 'Automatiske emails' },
  { key: 'live_chat', label: 'Live Chat Support' },
  { key: 'unread_messages', label: 'Ulæste beskeder' },
  { key: 'license_verification', label: 'Kørekortsverifikation' },
  { key: 'renter_history', label: 'Lejerhistorik' },
  { key: 'renter_rating', label: 'Lejer-rating' },
  { key: 'warning_register', label: 'Advarselsregister' },
  { key: 'customer_segments', label: 'Kundesegmenter' },
  { key: 'favorite_renters', label: 'Favorit-lejere' },
  { key: 'business_accounts', label: 'Erhvervskonti' },
  { key: 'department_budgets', label: 'Afdelingsbudgetter' },
  { key: 'employee_management', label: 'Medarbejder-administration' },
  { key: 'monthly_invoice', label: 'Månedlig samlet faktura' },
  { key: 'fleet_settlement', label: 'Flåde-afregning' },
  { key: 'cvr_lookup', label: 'CVR-opslag' }
];

export const AdminFeatureFlags = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, company_name, feature_flags, subscription_status, subscription_tier');
      if (!error) setCustomers(data || []);
      setIsLoading(false);
    };
    fetchCustomers();
  }, []);

  const handleToggle = async (customerId, featureKey, enabled) => {
    const customer = customers.find(c => c.id === customerId);
    const flags = customer?.feature_flags || {};
    const newFlags = { ...flags, [featureKey]: enabled };
    const { error } = await supabase
      .from('profiles')
      .update({ feature_flags: newFlags })
      .eq('id', customerId);
    if (!error) {
      setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, feature_flags: newFlags } : c));
      toast.success('Feature opdateret');
    } else {
      toast.error('Kunne ikke opdatere feature');
    }
  };

  if (isLoading) return <div>Indlæser...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Flags pr. Kunde</CardTitle>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Søg kunde (navn, email, firma)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </CardHeader>
      <CardContent>
        {customers
          .filter(customer => {
            const q = search.toLowerCase();
            return (
              !q ||
              (customer.company_name && customer.company_name.toLowerCase().includes(q)) ||
              (customer.full_name && customer.full_name.toLowerCase().includes(q)) ||
              (customer.email && customer.email.toLowerCase().includes(q))
            );
          })
          .map(customer => (
            <div key={customer.id} className="mb-6 p-4 border rounded-lg">
              <div className="font-bold mb-2">{customer.company_name || customer.full_name || customer.email}</div>
              <div className="text-sm text-muted-foreground mb-2">
                Abonnement: {customer.subscription_tier || 'Ingen'} | Status: {customer.subscription_status || 'Ukendt'}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {FEATURES.map(feature => {
                  const isStandard = STANDARD_FEATURES.includes(feature.key);
                  return (
                    <div key={feature.key} className="flex items-center gap-2">
                      <Switch
                        checked={isStandard ? true : !!customer.feature_flags?.[feature.key]}
                        disabled={isStandard}
                        onCheckedChange={checked => !isStandard && handleToggle(customer.id, feature.key, checked)}
                      />
                      <span>{feature.label}{isStandard && <span className="ml-1 text-xs text-primary">(Standard)</span>}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
