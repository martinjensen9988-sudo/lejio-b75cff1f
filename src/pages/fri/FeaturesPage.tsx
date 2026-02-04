import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  BarChart3, 
  Users, 
  FileText, 
  Shield, 
  Clock, 
  CheckCircle2, 
  Smartphone,
  MapPin,
  DollarSign,
  Bell,
  Lock,
  ArrowRight,
  Settings,
  Cloud,
  TrendingUp,
  Calendar
} from 'lucide-react';

export function FriFeaturesPage() {
  const features = [
    {
      category: 'Flådestyring',
      icon: Zap,
      description: 'Administrer hele din bilflåde på ét sted',
      features: [
        'Registrer og organiser køretøjer',
        'Spor vedligeholdelse og inspektioner',
        'Administrer forsikring og registreringsdokumenter',
        'Billeder og dokumentation af køretøjer',
        'Tilstand og kilometer notater',
        'GPS-tracking og placeringsdata'
      ]
    },
    {
      category: 'Bookinger & Kalenderstyring',
      icon: Calendar,
      description: 'Modtag og administrer bookinger nemt',
      features: [
        'Online bookingkalender',
        'Automatisk bekræftelse af bookinger',
        'SMS og email påmindelser til kunder',
        'Fleksibel prissætning per køretøj',
        'Tilgængelighedsstyring',
        'Dubletbooking-beskyttelse'
      ]
    },
    {
      category: 'Fakturaering & Betalinger',
      icon: DollarSign,
      description: 'Automatiser fakturering og betalinger',
      features: [
        'Automatisk fakturagenerering',
        'Professionelle fakturaer med dit brand',
        'Betalingspåmindelser',
        'Spor udestående beløb',
        'Rabatter og kuponkoder',
        'Integrering med betalingsmetoder'
      ]
    },
    {
      category: 'Analytik & Rapporter',
      icon: BarChart3,
      description: 'Data-drevne indsigter om din forretning',
      features: [
        'Omsætningsrapporter',
        'Utilization rates',
        'Kundetendenser',
        'Køretøjsperformance',
        'Sammenlignbare grafer og diagrammer',
        'Eksporter rapporter til PDF'
      ]
    },
    {
      category: 'Teamsamarbejde',
      icon: Users,
      description: 'Samarbejd med dine medarbejdere',
      features: [
        'Tilføj ubegrænsede teammedlemmer',
        'Tilpassede roller og rettigheder',
        'Aktivitetslog og revision',
        'Teamkalender og opgavestyring',
        'Notater og kommentarer på bookinger',
        'Delegation af opgaver'
      ]
    },
    {
      category: 'Sikkerhed & Compliance',
      icon: Shield,
      description: 'Enterprise-grade sikkerhed',
      features: [
        '100% SSL-kryptering',
        'GDPR-kompatibel',
        'Totrins-autentificering',
        'Daglige backups',
        'Adgangskontrol og logging',
        'Sikker datacenter-hosting'
      ]
    },
    {
      category: 'Dokumenthåndtering',
      icon: FileText,
      description: 'Organisér alle dokumenter sikkert',
      features: [
        'Gem kontrakter og aftaler',
        'Forsikringsdokumenter',
        'Køretøjsdokumentation',
        'Kundeudtalelser og identifikation',
        'Version kontrol af dokumenter',
        'Nemt at dele med teammedlemmer'
      ]
    },
    {
      category: 'Kommunikation',
      icon: Bell,
      description: 'Hold kunderne orienteret',
      features: [
        'SMS og email integrations',
        'Automatiske påmindelser',
        'Kundebeskeder og notifikationer',
        'Tilpasbare email-skabeloner',
        'Booking-links til deling',
        'Chat-support'
      ]
    },
    {
      category: 'Branding & Tilpasning',
      icon: Settings,
      description: 'Gør platformen til dit eget brand',
      features: [
        'Indsæt dine farver og logo',
        'Tilpasset domæne',
        'Brugerdefinerede email-signaturer',
        'Tilpasset kundeportal',
        'Sidespecifikke branding',
        'Hvid-label mulighed'
      ]
    },
    {
      category: 'Integration & API',
      icon: Cloud,
      description: 'Forbind dine favoritværktøjer',
      features: [
        'Webhook-support',
        'REST API (Business plan+)',
        'Integration med regnskabssoftware',
        'Export til Excel/CSV',
        'Kalenderintegrationer',
        'Betaling gateway-integrationer'
      ]
    },
    {
      category: 'Support & Onboarding',
      icon: Clock,
      description: 'Vi hjælper dig på vejen',
      features: [
        'Personlig onboarding assistance',
        'Email support (24 timer responstid)',
        'Detaljeret dokumentation',
        'Video-tutorials',
        'FAQ og knowledge base',
        'Slack support (Business plan+)'
      ]
    },
    {
      category: 'Performance & Reliability',
      icon: TrendingUp,
      description: 'Hurtig og pålidelig drift',
      features: [
        '99.9% uptime garanteret',
        'Verden-klasse infrastruktur',
        'Automatiske opdateringer',
        'Mobiloptimeret',
        'Offline mode',
        'Synkronisering på alle enheder'
      ]
    }
  ];

  // Icon mapping since we can't pass icon functions directly
  const iconMap: { [key: string]: any } = {
    'Flådestyring': Zap,
    'Bookinger & Kalenderstyring': Calendar,
    'Fakturaering & Betalinger': DollarSign,
    'Analytik & Rapporter': BarChart3,
    'Teamsamarbejde': Users,
    'Sikkerhed & Compliance': Shield,
    'Dokumenthåndtering': FileText,
    'Kommunikation': Bell,
    'Branding & Tilpasning': Settings,
    'Integration & API': Cloud,
    'Support & Onboarding': Clock,
    'Performance & Reliability': TrendingUp
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/fri" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Din platform
          </Link>
          <div className="flex gap-4">
            <Link to="/fri/login">
              <Button variant="ghost">Log ind</Button>
            </Link>
            <Link to="/fri/trial">
              <Button>Start prøveperiode</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Alle funktioner i <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">platformen</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            En komplet løsning til bilutlejning. Ingen skjulte funktioner – alt er inkluderet i din plan.
          </p>
          <Link to="/fri/trial">
            <Button size="lg" className="gap-2">
              Start gratis prøveperiode <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.category];
            return (
              <Card key={index} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      {IconComponent && <IconComponent className="h-6 w-6 text-blue-600" />}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.category}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="bg-white/50 backdrop-blur-sm py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Hvad er inkluderet på din plan?</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Funktion</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Professional</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Business</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900 font-semibold">Flådestyring</td>
                  <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900 font-semibold">Bookinger</td>
                  <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900 font-semibold">Fakturaering</td>
                  <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900 font-semibold">Grundlæggende analytik</td>
                  <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900 font-semibold">Avanceret analytik</td>
                  <td className="text-center py-4 px-4">–</td>
                  <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900 font-semibold">Teammedlemmer</td>
                  <td className="text-center py-4 px-4">3</td>
                  <td className="text-center py-4 px-4">10</td>
                  <td className="text-center py-4 px-4">Ubegrænset</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900 font-semibold">API adgang</td>
                  <td className="text-center py-4 px-4">–</td>
                  <td className="text-center py-4 px-4">Read-only</td>
                  <td className="text-center py-4 px-4">Fuldt</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900 font-semibold">Branding tilpasning</td>
                  <td className="text-center py-4 px-4">–</td>
                  <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900 font-semibold">Prioritets support</td>
                  <td className="text-center py-4 px-4">–</td>
                  <td className="text-center py-4 px-4">Email + Slack</td>
                  <td className="text-center py-4 px-4">24/7 prioritets</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900 font-semibold">SLA garanteret uptime</td>
                  <td className="text-center py-4 px-4">–</td>
                  <td className="text-center py-4 px-4">–</td>
                  <td className="text-center py-4 px-4">99.9%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Klar til at se det hele i aktion?</h2>
          <p className="text-xl mb-8">
            Prøv alle funktioner helt gratis i 14 dage. Intet kreditkort påkrævet.
          </p>
          <Link to="/fri/trial">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start gratis prøveperiode
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Om platformen</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/fri" className="hover:text-white">Hjem</Link></li>
                <li><Link to="/fri/features" className="hover:text-white">Funktioner</Link></li>
                <li><Link to="/fri/landing" className="hover:text-white">Priser</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="mailto:support@yourdomain.com" className="hover:text-white">support@yourdomain.com</a></li>
                <li><a href="#" className="hover:text-white">Dokumentation</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Juridisk</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privatlivspolitik</a></li>
                <li><a href="#" className="hover:text-white">Vilkår & betingelser</a></li>
                <li><a href="#" className="hover:text-white">GDPR</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Kontakt</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Din virksomhed</li>
                <li>Danmark</li>
                <li><a href="tel:+4544889999" className="hover:text-white">+45 44 88 99 99</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2026 Din platform. Alle rettigheder forbeholdt.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
