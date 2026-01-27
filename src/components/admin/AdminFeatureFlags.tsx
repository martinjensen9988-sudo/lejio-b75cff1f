import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
const FEATURES = [
  "Smart Booking-kalender",
  "Automatisk tilgængelighed",
  "Abonnementsudlejning",
  "AI-prissætning",
  "Sæsonpriser",
  "Multi-lokation support",
  "Åbningstider pr. lokation",
  "Særlige lukkedage",
  "Forberedelsestid",
  "Lokation på køretøj",
  "Automatisk kontraktgenerering",
  "Digital underskrift",
  "PDF-download & Email",
  "Skaderapporter med AI",
  "Lokationsinfo i kontrakt",
  "Nummerplade-scanning",
  "Dashboard-foto med AI",
  "GPS-lokationsverifikation",
  "Automatisk opgørelse",
  "QR-kode check-in",
  "Flere betalingsmetoder",
  "Automatisk abonnementsbetaling",
  "Depositumhåndtering",
  "Selvrisiko-forsikring",
  "Brændstofpolitik",
  "Platformgebyr-betaling",
  "GPS-sikkerhed",
  "Geofencing-alarmer",
  "Kilometerregistrering",
  "Webhook-integration",
  "MC-kørekort validering",
  "MC-specifik vedligeholdelse",
  "Sæson-tjekliste",
  "MC Check-in guide",
  "Smart Service hos LEJIO",
  "Syns-påmindelser",
  "Dækstyring",
  "Byttebil-funktion",
  "Service-booking",
  "Auto-Dispatch AI",
  "Dashboard-analyse",
  "Skade-AI",
  "AI-oversættelse",
  "Indbygget beskedsystem",
  "Push-notifikationer",
  "Automatiske emails",
  "Live Chat Support",
  "Ulæste beskeder",
  "Kørekortsverifikation",
  "Lejerhistorik",
  "Lejer-rating",
  "Advarselsregister",
  "Kundesegmenter",
  "Favorit-lejere",
  "Erhvervskonti",
  "Afdelingsbudgetter",
  "Medarbejder-administration",
  "Månedlig samlet faktura",
  "Flåde-afregning",
  "CVR-opslag"
];

export const AdminFeatureFlags = () => {
  const navigate = typeof window !== 'undefined' ? (window.history.back ? () => window.history.back() : () => {}) : () => {};
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

    const handleSaveGlobalLinks = async (featureTitle: string) => {
      setSaving(prev => ({ ...prev, [featureTitle]: true }));
      // Brug præcis samme key-generator som featuresiden
      const formattedKey = featureTitle.toLowerCase().replace(/[^a-z0-9_]+/gi, '_');
      const links = customLinks[featureTitle] || {};
      const { error } = await supabase.from<any, any>('feature_links').upsert({
        feature_key: formattedKey,
        video: links.video || '',
        image: links.image || '',
        page: links.page || ''
      }, { onConflict: 'feature_key' });
      setSaving(prev => ({ ...prev, [featureTitle]: false }));
      if (!error) {
        toast({ title: 'Links gemt!', description: '', variant: 'default' });
      } else {
        toast({ title: 'Kunne ikke gemme links', description: '', variant: 'destructive' });
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
      toast({ title: 'Feature opdateret', description: '', variant: 'default' });
    } else {
      toast({ title: 'Kunne ikke opdatere feature', description: '', variant: 'destructive' });
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
        <div className="flex items-center justify-between mb-2">
          <CardTitle>Feature Flags pr. Kunde</CardTitle>
          <Button variant="outline" size="sm" onClick={navigate}>
            ← Tilbage
          </Button>
        </div>
        <div className="mt-2">
          <input
            type="text"
            id="search-customer"
            name="search-customer"
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
          <div className="font-bold text-lg mb-1 flex items-center gap-2">
            Rediger links for alle features
            <span className="text-muted-foreground" title="Disse links vises for alle brugere, hvis udfyldt."><Info size={16} /></span>
          </div>
          <div className="text-sm text-muted-foreground mb-4">Her kan du sætte video, billede og side-link på ALLE features – uanset kunde.</div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {FEATURES.map(featureTitle => {
              // Brug præcis samme key-format som Features-siden
              const featureKey = featureTitle.toLowerCase().replace(/[^a-z0-9_]+/gi, '_');
              const globalLinks = customLinks[featureKey] || {};
              return (
                <Card key={featureTitle} className="relative p-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{featureTitle}</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="url"
                        id={`video-link-${featureTitle}`}
                        name={`video-link-${featureTitle}`}
                        placeholder="f.eks. https://youtube.com/... (video)"
                        className="px-2 py-1 rounded border text-xs flex-1"
                        value={globalLinks.video || ''}
                        onChange={e => handleGlobalLinkChange(featureTitle, 'video', e.target.value)}
                      />
                      <span title="Link til video, fx YouTube" className="text-muted-foreground"><Info size={14} /></span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="url"
                        id={`image-link-${featureTitle}`}
                        name={`image-link-${featureTitle}`}
                        placeholder="f.eks. https://billede.dk/... (billede)"
                        className="px-2 py-1 rounded border text-xs flex-1"
                        value={globalLinks.image || ''}
                        onChange={e => handleGlobalLinkChange(featureTitle, 'image', e.target.value)}
                      />
                      <span title="Link til billede" className="text-muted-foreground"><Info size={14} /></span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="url"
                        id={`page-link-${featureTitle}`}
                        name={`page-link-${featureTitle}`}
                        placeholder="f.eks. https://side.dk/... (side)"
                        className="px-2 py-1 rounded border text-xs flex-1"
                        value={globalLinks.page || ''}
                        onChange={e => handleGlobalLinkChange(featureTitle, 'page', e.target.value)}
                      />
                      <span title="Link til side" className="text-muted-foreground"><Info size={14} /></span>
                    </div>
                    <Button size="sm" className="mt-1 self-end" variant="secondary" disabled={!!saving[featureTitle]} onClick={() => handleSaveGlobalLinks(featureTitle)}>
                      {saving[featureTitle] ? 'Gemmer...' : 'Gem links'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
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
                      {FEATURES.map(featureTitle => {
                        // Use the same key generator as everywhere else
                        const featureKey = featureTitle.toLowerCase().replace(/[^a-z0-9_]+/gi, '_');
                        return (
                          <Card key={featureKey} className={`relative p-3 flex flex-col gap-2 ${tab.color}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <Switch
                                checked={!!customer.feature_flags?.[featureKey]}
                                onCheckedChange={checked => handleToggle(customer.id, featureKey, checked)}
                              />
                              <span className="font-bold text-sm">{featureTitle}</span>
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
