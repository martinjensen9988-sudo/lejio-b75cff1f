import {
  Calendar, FileText, CreditCard, MapPin, Bell, Users, BarChart3, MessageSquare, Camera, Brain, BadgeCheck, Wallet, Building2, Scan, FileCheck, Store, Bike, CalendarClock, Wrench, CircleDot, Star, Receipt, Truck, Shield, ShieldCheck, Smartphone, QrCode, Globe, Zap, TrendingDown, AlertTriangle, ArrowRight, Play, Check, Lock
} from "lucide-react";
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

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
  // Store global links for features (video, image, page)
  const [customLinks, setCustomLinks] = useState({});
  // Loading state pr. feature
  const [saving, setSaving] = useState<{[key: string]: boolean}>({});

    // Load global feature links from Supabase
    useEffect(() => {
      const fetchLinks = async () => {
        const { data, error } = await supabase.from<any, any>('feature_links').select('feature_key, video, image, page');
        if (!error && data) {
          const linksObj = {};
          data.forEach(row => {
            // @ts-ignore
            linksObj[row.feature_key] = {
              // @ts-ignore
              video: row.video || '',
              // @ts-ignore
              image: row.image || '',
              // @ts-ignore
              page: row.page || ''
            };
          });
          setCustomLinks(linksObj);
        }
      };
      fetchLinks();
    }, []);

    // Save global link for a feature
    const handleGlobalLinkChange = async (featureKey, type, value) => {
      setCustomLinks(prev => ({ ...prev, [featureKey]: { ...prev[featureKey], [type]: value } }));
    };

    const handleSaveGlobalLinks = async (featureKey: string) => {
      setSaving(prev => ({ ...prev, [featureKey]: true }));
      const links = customLinks[featureKey] || {};
      const { error } = await supabase.from<any, any>('feature_links').upsert({
        feature_key: featureKey,
        video: links.video || '',
        image: links.image || '',
        page: links.page || ''
      }, { onConflict: 'feature_key' });
      setSaving(prev => ({ ...prev, [featureKey]: false }));
      if (!error) {
        toast.success('Links gemt!');
      } else {
        toast.error('Kunne ikke gemme links');
      }
    };
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

  // Map features to abonnementer and fleet packages
  const PACKAGE_GROUPS = [
    {
      name: 'Abonnementer',
      description: 'Features der følger med abonnementspakker (Starter, Pro, Enterprise)',
      tiers: ['starter', 'pro', 'enterprise'],
      color: 'bg-green-50 border-green-200',
    },
    {
      name: 'Fleet Pakker',
      description: 'Ekstra features for flådeejere og erhverv',
      tiers: ['pro', 'enterprise'],
      color: 'bg-blue-50 border-blue-200',
    }
  ];

  const PACKAGE_FEATURES = {
    starter: ['booking', 'contracts', 'checkin', 'payment', 'communication', 'renter'],
    pro: ['locations', 'gps', 'motorcycle', 'service', 'ai'],
    enterprise: ['corporate']
  };


  const packageTabs = [
    { id: 'starter', label: 'Starter', color: 'bg-slate-100 text-slate-800' },
    { id: 'pro', label: 'Pro', color: 'bg-blue-100 text-blue-800' },
    { id: 'enterprise', label: 'Enterprise', color: 'bg-purple-100 text-purple-800' }
  ];

  const tierColors = {
    starter: 'bg-slate-100 text-slate-800',
    pro: 'bg-blue-100 text-blue-800',
    enterprise: 'bg-purple-100 text-purple-800'
  };

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
        {/* Show each customer as a section, with modules as cards/grids like /funktioner */}
        {/* Show all modules/features by default, only show customer features after selection */}
        <div className="mb-8">
          <div className="font-bold text-lg mb-1">Admin oversigt</div>
          <div className="text-sm text-muted-foreground mb-4">Her ser du alle moduler og features. Rediger links for hver funktion direkte her.</div>
          <Accordion type="multiple">
            {packageTabs.map(tab => (
              <AccordionItem key={tab.id} value={tab.id} className="mb-2 border rounded-lg">
                <AccordionTrigger className="flex items-center gap-4 px-4 py-3 font-bold text-left">
                  <span className={`font-display text-xl font-bold`}>{tab.label}</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${tab.color}`}>{tab.label}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    {FEATURES.filter(f => PACKAGE_FEATURES[tab.id]?.includes(f.key)).map(feature => {
                      const isStandard = STANDARD_FEATURES.includes(feature.key);
                      const globalLinks = customLinks[feature.key] || {};
                      return (
                        <Card key={feature.key} className={`relative p-3 flex flex-col gap-2 ${tab.color}`}> 
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm">{feature.label}</span>
                            {isStandard && <span className="ml-1 text-xs text-primary">(Standard)</span>}
                          </div>
                          <div className="flex flex-col gap-1 mt-2">
                            <input
                              type="url"
                              placeholder="Video-link (global)"
                              className="px-2 py-1 rounded border text-xs"
                              value={globalLinks.video || ''}
                              onChange={e => handleGlobalLinkChange(feature.key, 'video', e.target.value)}
                            />
                            <input
                              type="url"
                              placeholder="Billede-link (global)"
                              className="px-2 py-1 rounded border text-xs"
                              value={globalLinks.image || ''}
                              onChange={e => handleGlobalLinkChange(feature.key, 'image', e.target.value)}
                            />
                            <input
                              type="url"
                              placeholder="Side-link (global)"
                              className="px-2 py-1 rounded border text-xs"
                              value={globalLinks.page || ''}
                              onChange={e => handleGlobalLinkChange(feature.key, 'page', e.target.value)}
                            />
                            <Button size="sm" className="mt-1 self-end" variant="secondary" disabled={!!saving[feature.key]} onClick={() => handleSaveGlobalLinks(feature.key)}>
                              {saving[feature.key] ? 'Gemmer...' : 'Gem links'}
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        {/* Customer selection and feature editing */}
        {!search.trim() && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <p className="text-lg font-semibold mb-2">Søg efter en kunde for at redigere deres features</p>
            <p className="text-sm">Indtast navn, email eller firma i søgefeltet ovenfor.</p>
          </div>
        )}
        {search.trim() && customers
          .filter(customer => {
            const q = search.toLowerCase();
            return (
              (customer.company_name && customer.company_name.toLowerCase().includes(q)) ||
              (customer.full_name && customer.full_name.toLowerCase().includes(q)) ||
              (customer.email && customer.email.toLowerCase().includes(q))
            );
          })
          .map(customer => (
            <div key={customer.id} className="mb-8">
              <div className="font-bold text-lg mb-1">{customer.company_name || customer.full_name || customer.email}</div>
              <div className="text-sm text-muted-foreground mb-4">Abonnement: {customer.subscription_tier || 'Ingen'} | Status: {customer.subscription_status || 'Ukendt'}</div>
              {/* Modules as cards/grids */}
              <div className="space-y-10">
                {packageTabs.map(tab => (
                  <div key={tab.id} className="">
                    <div className="flex items-center gap-4 mb-2">
                      <span className={`font-display text-xl font-bold`}>{tab.label}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${tab.color}`}>{tab.label}</span>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                      {FEATURES.filter(f => PACKAGE_FEATURES[tab.id]?.includes(f.key)).map(feature => {
                        const isStandard = STANDARD_FEATURES.includes(feature.key);
                        return (
                          <Card key={feature.key} className={`relative p-3 flex flex-col gap-2 ${tab.color}`}> 
                            <div className="flex items-center gap-2 mb-1">
                              <Switch
                                checked={isStandard ? true : !!customer.feature_flags?.[feature.key]}
                                disabled={isStandard}
                                onCheckedChange={checked => !isStandard && handleToggle(customer.id, feature.key, checked)}
                              />
                              <span className="font-bold text-sm">{feature.label}</span>
                              {isStandard && <span className="ml-1 text-xs text-primary">(Standard)</span>}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
