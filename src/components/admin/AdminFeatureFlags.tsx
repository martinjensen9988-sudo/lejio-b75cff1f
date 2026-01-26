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
    // Store custom links for features (video, image, page)
    const [customLinks, setCustomLinks] = useState({});

    // Save custom link for a feature
    const handleCustomLinkChange = async (customerId, featureKey, type, value) => {
      const customer = customers.find(c => c.id === customerId);
      const flags = customer?.feature_flags || {};
      const links = flags.custom_links || {};
      const newLinks = { ...links, [featureKey]: { ...links[featureKey], [type]: value } };
      const newFlags = { ...flags, custom_links: newLinks };
      const { error } = await supabase
        .from('profiles')
        .update({ feature_flags: newFlags })
        .eq('id', customerId);
      if (!error) {
        setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, feature_flags: newFlags } : c));
        toast.success('Link opdateret');
      } else {
        toast.error('Kunne ikke opdatere link');
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


  const featureCategories = [
    { id: 'booking', label: 'Booking & Kalender', title: 'Booking & Kalender', tier: 'starter', icon: Calendar, color: 'from-primary to-primary/60' },
    { id: 'contracts', label: 'Kontrakter & Dokumentation', title: 'Kontrakter & Dokumentation', tier: 'starter', icon: FileText, color: 'from-accent to-accent/60' },
    { id: 'checkin', label: 'Check-in & Check-out', title: 'Check-in & Check-out', tier: 'starter', icon: Camera, color: 'from-teal-500 to-teal-500/60' },
    { id: 'payment', label: 'Betaling & Økonomi', title: 'Betaling & Økonomi', tier: 'starter', icon: CreditCard, color: 'from-secondary to-secondary/60' },
    { id: 'communication', label: 'Kommunikation', title: 'Kommunikation', tier: 'starter', icon: MessageSquare, color: 'from-indigo-500 to-indigo-500/60' },
    { id: 'renter', label: 'Lejer-administration', title: 'Lejer-administration', tier: 'starter', icon: Users, color: 'from-blue-500 to-blue-500/60' },
    { id: 'locations', label: 'Lokationer & Afdelinger', title: 'Lokationer & Afdelinger', tier: 'pro', icon: Store, color: 'from-emerald-500 to-emerald-500/60' },
    { id: 'gps', label: 'GPS & Flådestyring', title: 'GPS & Flådestyring', tier: 'pro', icon: MapPin, color: 'from-green-500 to-green-500/60' },
    { id: 'motorcycle', label: 'Motorcykel & Scooter', title: 'Motorcykel & Scooter', tier: 'pro', icon: Bike, color: 'from-yellow-500 to-yellow-500/60' },
    { id: 'service', label: 'Værksted & Service', title: 'Værksted & Service', tier: 'pro', icon: Wrench, color: 'from-orange-500 to-orange-500/60' },
    { id: 'ai', label: 'AI-funktioner', title: 'AI-funktioner', tier: 'pro', icon: Brain, color: 'from-purple-500 to-purple-500/60' },
    { id: 'corporate', label: 'Erhverv & Flåde', title: 'Erhverv & Flåde', tier: 'enterprise', icon: Building2, color: 'from-slate-500 to-slate-500/60' }
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
          <div className="text-sm text-muted-foreground mb-4">Her ser du alle moduler og features. Vælg en kunde for at redigere deres features.</div>
          <Accordion type="multiple" collapsible>
            {featureCategories.map((category, idx) => {
              const CategoryIcon = category.icon;
              return (
                <AccordionItem key={category.id} value={category.id} className="mb-2 border rounded-lg">
                  <AccordionTrigger className="flex items-center gap-4 px-4 py-3 font-bold text-left">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-md`}>
                      {CategoryIcon && <CategoryIcon className="w-6 h-6 text-white" />}
                    </div>
                    <span className="font-display text-xl font-bold">{category.title}</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${tierColors[category.tier]}`}>{category.tier.charAt(0).toUpperCase() + category.tier.slice(1)}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                      {FEATURES.filter(f => f.key && PACKAGE_FEATURES[category.tier].includes(category.id)).map(feature => {
                        const isStandard = STANDARD_FEATURES.includes(feature.key);
                        return (
                          <Card key={feature.key} className={`relative p-3 flex flex-col gap-2 ${tierColors[category.tier]}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-sm">{feature.label}</span>
                              {isStandard && <span className="ml-1 text-xs text-primary">(Standard)</span>}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
        {/* Customer selection and feature editing */}
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
            <div key={customer.id} className="mb-8">
              <div className="font-bold text-lg mb-1">{customer.company_name || customer.full_name || customer.email}</div>
              <div className="text-sm text-muted-foreground mb-4">Abonnement: {customer.subscription_tier || 'Ingen'} | Status: {customer.subscription_status || 'Ukendt'}</div>
              {/* Modules as cards/grids */}
              <div className="space-y-10">
                {featureCategories.map((category, idx) => {
                  const CategoryIcon = category.icon;
                  return (
                    <div key={category.id} className="">
                      <div className="flex items-center gap-4 mb-2">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-md`}>
                          {CategoryIcon && <CategoryIcon className="w-6 h-6 text-white" />}
                        </div>
                        <h2 className="font-display text-xl font-bold">{category.title}</h2>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${tierColors[category.tier]}`}>{category.tier.charAt(0).toUpperCase() + category.tier.slice(1)}</span>
                      </div>
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                        {FEATURES.filter(f => f.key && PACKAGE_FEATURES[category.tier].includes(category.id)).map(feature => {
                          const isStandard = STANDARD_FEATURES.includes(feature.key);
                          return (
                            <Card key={feature.key} className={`relative p-3 flex flex-col gap-2 ${tierColors[category.tier]}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <Switch
                                  checked={isStandard ? true : !!customer.feature_flags?.[feature.key]}
                                  disabled={isStandard}
                                  onCheckedChange={checked => !isStandard && handleToggle(customer.id, feature.key, checked)}
                                />
                                <span className="font-bold text-sm">{feature.label}</span>
                                {isStandard && <span className="ml-1 text-xs text-primary">(Standard)</span>}
                              </div>
                              {/* Admin custom links for video, image, page */}
                              <div className="flex flex-col gap-1">
                                <input
                                  type="url"
                                  placeholder="Video-link"
                                  className="px-2 py-1 rounded border text-xs"
                                  value={customer.feature_flags?.custom_links?.[feature.key]?.video || ''}
                                  onChange={e => handleCustomLinkChange(customer.id, feature.key, 'video', e.target.value)}
                                />
                                <input
                                  type="url"
                                  placeholder="Billede-link"
                                  className="px-2 py-1 rounded border text-xs"
                                  value={customer.feature_flags?.custom_links?.[feature.key]?.image || ''}
                                  onChange={e => handleCustomLinkChange(customer.id, feature.key, 'image', e.target.value)}
                                />
                                <input
                                  type="url"
                                  placeholder="Side-link"
                                  className="px-2 py-1 rounded border text-xs"
                                  value={customer.feature_flags?.custom_links?.[feature.key]?.page || ''}
                                  onChange={e => handleCustomLinkChange(customer.id, feature.key, 'page', e.target.value)}
                                />
                              </div>
                            </Card>
                          );
                        })}
                      </div>
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
