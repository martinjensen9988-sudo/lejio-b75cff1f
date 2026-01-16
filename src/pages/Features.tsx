import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Calendar, 
  FileText, 
  CreditCard, 
  MapPin, 
  Bell, 
  Shield, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Car, 
  Settings, 
  Clock,
  Repeat,
  Wrench,
  Gauge,
  CircleDot,
  FileCheck,
  Smartphone,
  Truck,
  Star,
  Gift,
  Receipt,
  Camera,
  Brain,
  BadgeCheck,
  Wallet,
  Building2,
  Scan,
  ShieldCheck,
  Navigation as NavigationIcon,
  Store,
  Bike,
  CalendarClock,
  Thermometer,
  AlertTriangle,
  QrCode,
  Share2,
  Globe,
  Zap,
  TrendingDown
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();

  const featureCategories = [
    {
      title: "Booking & Kalender",
      icon: Calendar,
      color: "bg-primary/10 text-primary",
      features: [
        {
          title: "Smart Booking-kalender",
          description: "Visuel oversigt over alle dine bookinger med drag-and-drop funktionalitet.",
          icon: Calendar,
        },
        {
          title: "Automatisk tilgængelighed",
          description: "Systemet blokerer automatisk datoer ved nye bookinger.",
          icon: Clock,
        },
        {
          title: "Abonnementsudlejning",
          description: "Tilbyd månedlig bilabonnement med automatisk kortbetaling.",
          icon: Repeat,
        },
        {
          title: "AI-prissætning",
          description: "Få intelligente prisforslag baseret på marked, sæson og efterspørgsel.",
          icon: Brain,
          badge: "Ny",
        },
        {
          title: "Sæsonpriser",
          description: "Indstil forskellige priser for høj- og lavsæson automatisk.",
          icon: CalendarClock,
          badge: "Ny",
        },
      ],
    },
    {
      title: "Lokationer & Afdelinger",
      icon: Store,
      color: "bg-emerald-500/10 text-emerald-600",
      features: [
        {
          title: "Multi-lokation support",
          description: "Administrer flere udlejningslokationer fra ét dashboard.",
          icon: Store,
          badge: "Ny",
        },
        {
          title: "Åbningstider pr. lokation",
          description: "Indstil individuelle åbningstider for hver lokation.",
          icon: Clock,
          badge: "Ny",
        },
        {
          title: "Særlige lukkedage",
          description: "Tilføj helligdage og særlige lukkedage pr. lokation.",
          icon: CalendarClock,
          badge: "Ny",
        },
        {
          title: "Forberedelsestid",
          description: "Indstil hvor lang tid der skal bruges til klargøring mellem bookinger.",
          icon: Wrench,
          badge: "Ny",
        },
        {
          title: "Lokation på køretøj",
          description: "Tildel køretøjer til specifikke lokationer for bedre overblik.",
          icon: MapPin,
          badge: "Ny",
        },
      ],
    },
    {
      title: "Kontrakter & Dokumentation",
      icon: FileText,
      color: "bg-accent/10 text-accent",
      features: [
        {
          title: "Automatisk kontraktgenerering",
          description: "Juridisk korrekte lejekontrakter genereres automatisk med alle detaljer.",
          icon: FileText,
        },
        {
          title: "Digital underskrift",
          description: "Både udlejer og lejer underskriver digitalt direkte i systemet.",
          icon: FileCheck,
        },
        {
          title: "PDF-download & Email",
          description: "Kontrakter sendes automatisk til begge parter som PDF.",
          icon: Smartphone,
        },
        {
          title: "Skaderapporter med AI",
          description: "Dokumentér bilens stand med AI-analyse af fotos og skader.",
          icon: Scan,
        },
        {
          title: "Lokationsinfo i kontrakt",
          description: "Afhentningslokation med adresse og telefonnummer inkluderes automatisk.",
          icon: Store,
          badge: "Ny",
        },
      ],
    },
    {
      title: "Check-in & Check-out",
      icon: Camera,
      color: "bg-teal-500/10 text-teal-600",
      features: [
        {
          title: "Nummerplade-scanning",
          description: "Scan nummerpladen ved udlevering og aflevering for automatisk verifikation.",
          icon: Scan,
        },
        {
          title: "Dashboard-foto med AI",
          description: "Tag foto af instrumentbrættet – AI aflæser km-stand og brændstofniveau.",
          icon: Camera,
        },
        {
          title: "GPS-lokationsverifikation",
          description: "Bekræft at bilen afleveres det rigtige sted med GPS-tjek.",
          icon: MapPin,
        },
        {
          title: "Automatisk opgørelse",
          description: "Systemet beregner km-overskridelse og brændstofgebyr automatisk.",
          icon: Receipt,
        },
        {
          title: "QR-kode check-in",
          description: "Generér QR-koder til hurtig selv-check-in for lejere.",
          icon: QrCode,
          badge: "Ny",
        },
      ],
    },
    {
      title: "Betaling & Økonomi",
      icon: CreditCard,
      color: "bg-secondary/10 text-secondary-foreground",
      features: [
        {
          title: "Flere betalingsmetoder",
          description: "Modtag betaling via kort, MobilePay, bankoverførsel eller kontant.",
          icon: CreditCard,
        },
        {
          title: "Automatisk abonnementsbetaling",
          description: "Ved månedlig leje trækkes beløbet automatisk fra lejerens kort.",
          icon: Repeat,
        },
        {
          title: "Depositumhåndtering",
          description: "Administrer depositum og frigivelse sikkert gennem systemet.",
          icon: Shield,
        },
        {
          title: "Selvrisiko-forsikring",
          description: "Tilbyd lejere at reducere selvrisiko til 0 kr. for kun 49 kr./dag.",
          icon: ShieldCheck,
        },
        {
          title: "Brændstofpolitik",
          description: "Automatisk beregning af brændstofgebyr ved manglende tank.",
          icon: Gauge,
        },
        {
          title: "Platformgebyr-betaling",
          description: "Administrer og betal platformgebyrer direkte i systemet.",
          icon: Wallet,
          badge: "Ny",
        },
      ],
    },
    {
      title: "Bøder & Afgifter",
      icon: Receipt,
      color: "bg-red-500/10 text-red-600",
      features: [
        {
          title: "Bøde-håndtering",
          description: "Upload bøder og afgifter og send dem automatisk videre til lejeren.",
          icon: Receipt,
        },
        {
          title: "Auto-match med booking",
          description: "Systemet finder automatisk den relevante booking baseret på dato og køretøj.",
          icon: FileCheck,
        },
        {
          title: "Fleksibelt administrationsgebyr",
          description: "Indstil dit eget gebyr fra 0-800 kr. ved videresendelse af bøder.",
          icon: Settings,
        },
        {
          title: "Email-notifikation",
          description: "Lejeren får automatisk en email med bødedetaljer og betalingsinfo.",
          icon: Bell,
        },
      ],
    },
    {
      title: "GPS & Flådestyring",
      icon: MapPin,
      color: "bg-green-500/10 text-green-600",
      features: [
        {
          title: "Real-time GPS-sporing",
          description: "Se hvor dine biler befinder sig i realtid på kortet.",
          icon: MapPin,
        },
        {
          title: "Geofencing-alarmer",
          description: "Få besked når en bil forlader et defineret område.",
          icon: CircleDot,
        },
        {
          title: "Kilometerregistrering",
          description: "Automatisk opdatering af kilometertal via GPS-tracker.",
          icon: Gauge,
        },
        {
          title: "Webhook-integration",
          description: "Modtag GPS-data fra alle førende GPS-udbydere via webhook.",
          icon: Zap,
          badge: "Ny",
        },
      ],
    },
    {
      title: "Motorcykel & Scooter",
      icon: Bike,
      color: "bg-yellow-500/10 text-yellow-600",
      features: [
        {
          title: "MC-kørekort validering",
          description: "Automatisk tjek af kørekortstype (A1, A2, A) mod motorcyklens effekt.",
          icon: BadgeCheck,
          badge: "Ny",
        },
        {
          title: "MC-specifik vedligeholdelse",
          description: "Spor kædeservice, dækslid og andre MC-specifikke serviceintervaller.",
          icon: Wrench,
          badge: "Ny",
        },
        {
          title: "Sæson-tjekliste",
          description: "Automatiske påmindelser om forårsgøring og vinterklargøring.",
          icon: Thermometer,
          badge: "Ny",
        },
        {
          title: "MC Check-in guide",
          description: "Specialiseret check-in flow med MC-specifikke kontrolpunkter.",
          icon: FileCheck,
          badge: "Ny",
        },
      ],
    },
    {
      title: "Værksted & Service",
      icon: Wrench,
      color: "bg-orange-500/10 text-orange-600",
      features: [
        {
          title: "Smart Service hos LEJIO",
          description: "Book værkstedstider direkte i systemet – vi klarer servicen for dig.",
          icon: Wrench,
        },
        {
          title: "Syns-påmindelser",
          description: "Automatisk påmindelse når syn nærmer sig.",
          icon: Bell,
        },
        {
          title: "Dækstyring",
          description: "Administrer sommer/vinterdæk og dækhotel-lokationer.",
          icon: CircleDot,
        },
        {
          title: "Byttebil-funktion",
          description: "Udskift køretøj midt i lejeperiode ved service eller nedbrud.",
          icon: Truck,
        },
        {
          title: "Service-booking",
          description: "Book og administrer service- og værkstedsaftaler direkte i systemet.",
          icon: CalendarClock,
          badge: "Ny",
        },
      ],
    },
    {
      title: "Henvisningsprogram",
      icon: Gift,
      color: "bg-pink-500/10 text-pink-600",
      features: [
        {
          title: "Del din kode",
          description: "Få en unik henvisningskode som du kan dele med venner og familie.",
          icon: Gift,
        },
        {
          title: "500 kr. til begge",
          description: "Den henviste får 500 kr. rabat – og du får 500 kr. i kredit.",
          icon: Wallet,
        },
        {
          title: "Brug kredit ved booking",
          description: "Anvend din optjente kredit direkte i booking-flowet.",
          icon: CreditCard,
        },
        {
          title: "Del på sociale medier",
          description: "Del nemt din henvisningskode på Facebook, Instagram og SMS.",
          icon: Share2,
          badge: "Ny",
        },
      ],
    },
    {
      title: "Kommunikation",
      icon: MessageSquare,
      color: "bg-purple-500/10 text-purple-600",
      features: [
        {
          title: "Indbygget beskedsystem",
          description: "Kommuniker direkte med lejere gennem platformen.",
          icon: MessageSquare,
        },
        {
          title: "Push-notifikationer",
          description: "Få besked på telefonen ved nye bookinger og beskeder.",
          icon: Bell,
        },
        {
          title: "Automatiske emails",
          description: "Bookingbekræftelser og påmindelser sendes automatisk.",
          icon: Smartphone,
        },
        {
          title: "Live Chat Support",
          description: "AI-assisteret kundesupport direkte i appen.",
          icon: MessageSquare,
        },
        {
          title: "Ulæste beskeder",
          description: "Se altid hvor mange ulæste beskeder du har i menuen.",
          icon: Bell,
          badge: "Ny",
        },
      ],
    },
    {
      title: "Lejer-administration",
      icon: Users,
      color: "bg-blue-500/10 text-blue-600",
      features: [
        {
          title: "Kørekortsverifikation",
          description: "AI-verificerer kørekort med foto-upload og automatisk godkendelse.",
          icon: BadgeCheck,
        },
        {
          title: "Lejerhistorik",
          description: "Se alle tidligere bookinger og interaktioner med hver lejer.",
          icon: Users,
        },
        {
          title: "Lejer-rating",
          description: "Bedøm lejere og se deres gennemsnitlige rating.",
          icon: Star,
        },
        {
          title: "Advarselsregister",
          description: "Se advarsler på problematiske lejere på tværs af platformen.",
          icon: AlertTriangle,
        },
        {
          title: "Kundesegmenter",
          description: "Opdel dine lejere i segmenter baseret på adfærd og værdi.",
          icon: Users,
          badge: "Ny",
        },
        {
          title: "Favorit-lejere",
          description: "Gem dine bedste lejere som favoritter for hurtig adgang.",
          icon: Star,
          badge: "Ny",
        },
      ],
    },
    {
      title: "Erhverv & Flåde",
      icon: Building2,
      color: "bg-slate-500/10 text-slate-600",
      features: [
        {
          title: "Erhvervskonti",
          description: "Særlige vilkår og fakturering for erhvervskunder med EAN-nummer.",
          icon: Building2,
        },
        {
          title: "Afdelingsbudgetter",
          description: "Fordel kørsel på afdelinger med separate budgetter og rapporter.",
          icon: BarChart3,
        },
        {
          title: "Medarbejder-administration",
          description: "Administrer hvilke medarbejdere der må leje hvilke biler.",
          icon: Users,
        },
        {
          title: "Månedlig samlet faktura",
          description: "Én faktura for alle bookinger med EAN/CVR-nummer.",
          icon: Receipt,
        },
        {
          title: "Flåde-afregning",
          description: "Månedlig afregning med kommission for store flådeejere.",
          icon: Wallet,
          badge: "Ny",
        },
        {
          title: "CVR-opslag",
          description: "Automatisk opslag af virksomhedsdata via CVR-nummer.",
          icon: Building2,
          badge: "Ny",
        },
      ],
    },
    {
      title: "Private Flåder",
      icon: Car,
      color: "bg-cyan-500/10 text-cyan-600",
      features: [
        {
          title: "Flåde-abonnementer",
          description: "Tilbyd private flådeabonnementer med fast månedspris.",
          icon: Car,
          badge: "Ny",
        },
        {
          title: "Dedikeret kontaktperson",
          description: "Alle flådekunder får en personlig kontaktperson.",
          icon: Users,
          badge: "Ny",
        },
        {
          title: "Grøn flåde-rapport",
          description: "CO2-udledningsrapporter for miljøbevidste virksomheder.",
          icon: Globe,
          badge: "Ny",
        },
        {
          title: "Fleksible vilkår",
          description: "Tilpassede lejevilkår og priser for flådekunder.",
          icon: Settings,
          badge: "Ny",
        },
      ],
    },
    {
      title: "Statistik & Rapporter",
      icon: BarChart3,
      color: "bg-indigo-500/10 text-indigo-600",
      features: [
        {
          title: "Indtjeningsoversigt",
          description: "Se din samlede indtjening fordelt på biler og perioder.",
          icon: BarChart3,
        },
        {
          title: "Udnyttelsesgrad",
          description: "Analysér hvor ofte dine biler er udlejet.",
          icon: Gauge,
        },
        {
          title: "AI Dashboard-analyse",
          description: "Få AI-genererede indsigter og anbefalinger til din forretning.",
          icon: Brain,
        },
        {
          title: "Månedlige opgørelser",
          description: "Detaljerede rapporter til regnskab og SKAT.",
          icon: FileText,
        },
        {
          title: "Udlejer-rapport",
          description: "Komplet månedlig rapport med alle udlejninger og indtægter.",
          icon: Receipt,
          badge: "Ny",
        },
      ],
    },
    {
      title: "Rabatter & Kampagner",
      icon: Gift,
      color: "bg-rose-500/10 text-rose-600",
      features: [
        {
          title: "Rabatkoder",
          description: "Opret og administrer rabatkoder til dine kampagner.",
          icon: Gift,
          badge: "Ny",
        },
        {
          title: "Procentrabat",
          description: "Tilbyd procentvise rabatter på udlejninger.",
          icon: Receipt,
          badge: "Ny",
        },
        {
          title: "Fast rabat",
          description: "Giv et fast kronebeløb i rabat på bookinger.",
          icon: Wallet,
          badge: "Ny",
        },
        {
          title: "Tidsbegrænsede tilbud",
          description: "Sæt start- og slutdato på dine rabatkampagner.",
          icon: Clock,
          badge: "Ny",
        },
      ],
    },
    {
      title: "Sikkerhed & Advarsler",
      icon: Shield,
      color: "bg-amber-500/10 text-amber-600",
      features: [
        {
          title: "Advarselsregister",
          description: "Se advarsler på problematiske lejere fra hele platformen.",
          icon: AlertTriangle,
        },
        {
          title: "Opret advarsler",
          description: "Registrer problemer med lejere så andre udlejere kan se dem.",
          icon: Shield,
        },
        {
          title: "Klage-system",
          description: "Lejere kan klage over uberettigede advarsler til LEJIO.",
          icon: FileCheck,
        },
        {
          title: "Kørekortsverifikation",
          description: "AI-verificerer kørekort med foto-upload og automatisk godkendelse.",
          icon: BadgeCheck,
        },
        {
          title: "Vanvidskørsel-klausul",
          description: "Lejere accepterer fuldt ansvar ved groft uagtsom kørsel.",
          icon: ShieldCheck,
        },
        {
          title: "Tvistmægling",
          description: "LEJIO mægler ved konflikter mellem lejer og udlejer.",
          icon: Users,
          badge: "Ny",
        },
      ],
    },
    {
      title: "Lejio 2.0 - AI Flåde",
      icon: Truck,
      color: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600",
      features: [
        {
          title: "Auto-Dispatch",
          description: "AI analyserer søgehistorik og foreslår at flytte biler til lokationer med høj efterspørgsel.",
          icon: Truck,
          badge: "2.0",
        },
        {
          title: "Intelligent flådefordeling",
          description: "Maksimer udnyttelsesgraden med AI-drevne anbefalinger.",
          icon: Brain,
          badge: "2.0",
        },
        {
          title: "Efterspørgselsanalyse",
          description: "Se realtids-data om søgninger pr. lokation og biltype.",
          icon: BarChart3,
          badge: "2.0",
        },
        {
          title: "Omsætningsoptimering",
          description: "Få estimeret indtægtsstigning ved at følge AI-anbefalinger.",
          icon: TrendingDown,
          badge: "2.0",
        },
      ],
    },
    {
      title: "Lejio 2.0 - Service-Logistik",
      icon: Wrench,
      color: "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-600",
      features: [
        {
          title: "Automatisk service-planlægning",
          description: "Systemet spærrer automatisk biler ved service-intervaller.",
          icon: Wrench,
          badge: "2.0",
        },
        {
          title: "Km-trigger opgaver",
          description: "Opret opgaver der aktiveres ved et bestemt kilometertal.",
          icon: Gauge,
          badge: "2.0",
        },
        {
          title: "Transport-opgaver",
          description: "Koordiner medarbejdere til at køre biler til værksted.",
          icon: Truck,
          badge: "2.0",
        },
        {
          title: "Automatisk booking-blokering",
          description: "Biler blokeres automatisk under planlagte serviceopgaver.",
          icon: Calendar,
          badge: "2.0",
        },
      ],
    },
    {
      title: "Lejio 2.0 - Selvrisiko",
      icon: Shield,
      color: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600",
      features: [
        {
          title: "Dynamisk selvrisiko-styring",
          description: "Differentier selvrisiko baseret på lejerens profil og bilens værdi.",
          icon: Shield,
          badge: "2.0",
        },
        {
          title: "Premium selvrisiko-tilkøb",
          description: "Lad lejere købe 0 kr. selvrisiko for en daglig pris.",
          icon: ShieldCheck,
          badge: "2.0",
        },
        {
          title: "Lejer-rating kriterier",
          description: "Kræv minimum rating eller antal bookinger for bedre vilkår.",
          icon: Star,
          badge: "2.0",
        },
        {
          title: "Automatisk profil-matching",
          description: "Systemet vælger automatisk den bedste profil til lejeren.",
          icon: BadgeCheck,
          badge: "2.0",
        },
      ],
    },
    {
      title: "Lejio 2.0 - Messenger",
      icon: MessageSquare,
      color: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600",
      features: [
        {
          title: "Automatisk oversættelse",
          description: "Beskeder oversættes automatisk mellem lejer og udlejer.",
          icon: Globe,
          badge: "2.0",
        },
        {
          title: "Sprogdetektion",
          description: "AI registrerer automatisk hvilket sprog beskeden er skrevet på.",
          icon: Brain,
          badge: "2.0",
        },
        {
          title: "Turist-venlig",
          description: "Perfekt til udenlandske lejere og turister.",
          icon: Users,
          badge: "2.0",
        },
        {
          title: "Dokumentation",
          description: "Al kommunikation gemmes som dokumentation ved tvister.",
          icon: FileText,
          badge: "2.0",
        },
      ],
    },
    {
      title: "Lejio 2.0 - Tab af Indtægt",
      icon: TrendingDown,
      color: "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-600",
      features: [
        {
          title: "Automatisk tab-beregning",
          description: "Beregn tabt indtægt baseret på bilens historiske udlejningsrate.",
          icon: BarChart3,
          badge: "2.0",
        },
        {
          title: "Udnyttelsesgrad-analyse",
          description: "Systemet bruger de sidste 90 dages data til præcis beregning.",
          icon: Gauge,
          badge: "2.0",
        },
        {
          title: "Krav-indsendelse",
          description: "Send automatisk krav til forsikring eller lejer.",
          icon: FileText,
          badge: "2.0",
        },
        {
          title: "Integreret med skaderapporter",
          description: "Beregningen tilføjes automatisk til skadeskravet.",
          icon: Scan,
          badge: "2.0",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Alt hvad du har brug for
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Alle funktioner i LEJIO
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Fra booking til kontrakter, betaling til GPS-sporing – vi har samlet alt du behøver for at drive din udlejningsforretning. Over 80+ funktioner i én platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                onClick={() => navigate('/auth')}
              >
                Kom i gang gratis
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/#pricing')}
              >
                Se priser
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="space-y-16">
            {featureCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center gap-3 mb-8">
                  <div className={`p-3 rounded-xl ${category.color}`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    {category.title}
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {category.features.map((feature, featureIndex) => (
                    <Card key={featureIndex} className="border-border/50 hover:border-primary/30 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className={`p-2 rounded-lg ${category.color} w-fit`}>
                            <feature.icon className="w-4 h-4" />
                          </div>
                          {feature.badge && (
                            <Badge 
                              variant={feature.badge === "Ny" ? "default" : "secondary"}
                              className={feature.badge === "Ny" ? "bg-accent text-accent-foreground" : ""}
                            >
                              {feature.badge}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg mt-3">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-muted-foreground">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-muted-foreground">Funktioner</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">22</div>
              <div className="text-muted-foreground">Kategorier</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">AI Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Dansk</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Klar til at komme i gang?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Opret din gratis konto i dag og begynd at udleje dine køretøjer på den smarte måde.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate('/auth')}
            >
              Opret gratis konto
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/search')}
            >
              Se biler til leje
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
