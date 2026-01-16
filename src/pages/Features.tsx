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
  TrendingDown,
  ArrowRight
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
      color: "from-primary to-primary/60",
      features: [
        { title: "Smart Booking-kalender", description: "Visuel oversigt over alle dine bookinger med drag-and-drop funktionalitet.", icon: Calendar },
        { title: "Automatisk tilgængelighed", description: "Systemet blokerer automatisk datoer ved nye bookinger.", icon: Clock },
        { title: "Abonnementsudlejning", description: "Tilbyd månedlig bilabonnement med automatisk kortbetaling.", icon: Repeat },
        { title: "AI-prissætning", description: "Få intelligente prisforslag baseret på marked, sæson og efterspørgsel.", icon: Brain, badge: "Ny" },
        { title: "Sæsonpriser", description: "Indstil forskellige priser for høj- og lavsæson automatisk.", icon: CalendarClock, badge: "Ny" },
      ],
    },
    {
      title: "Lokationer & Afdelinger",
      icon: Store,
      color: "from-emerald-500 to-emerald-500/60",
      features: [
        { title: "Multi-lokation support", description: "Administrer flere udlejningslokationer fra ét dashboard.", icon: Store, badge: "Ny" },
        { title: "Åbningstider pr. lokation", description: "Indstil individuelle åbningstider for hver lokation.", icon: Clock, badge: "Ny" },
        { title: "Særlige lukkedage", description: "Tilføj helligdage og særlige lukkedage pr. lokation.", icon: CalendarClock, badge: "Ny" },
        { title: "Forberedelsestid", description: "Indstil hvor lang tid der skal bruges til klargøring mellem bookinger.", icon: Wrench, badge: "Ny" },
        { title: "Lokation på køretøj", description: "Tildel køretøjer til specifikke lokationer for bedre overblik.", icon: MapPin, badge: "Ny" },
      ],
    },
    {
      title: "Kontrakter & Dokumentation",
      icon: FileText,
      color: "from-accent to-accent/60",
      features: [
        { title: "Automatisk kontraktgenerering", description: "Juridisk korrekte lejekontrakter genereres automatisk med alle detaljer.", icon: FileText },
        { title: "Digital underskrift", description: "Både udlejer og lejer underskriver digitalt direkte i systemet.", icon: FileCheck },
        { title: "PDF-download & Email", description: "Kontrakter sendes automatisk til begge parter som PDF.", icon: Smartphone },
        { title: "Skaderapporter med AI", description: "Dokumentér bilens stand med AI-analyse af fotos og skader.", icon: Scan },
        { title: "Lokationsinfo i kontrakt", description: "Afhentningslokation med adresse og telefonnummer inkluderes automatisk.", icon: Store, badge: "Ny" },
      ],
    },
    {
      title: "Check-in & Check-out",
      icon: Camera,
      color: "from-teal-500 to-teal-500/60",
      features: [
        { title: "Nummerplade-scanning", description: "Scan nummerpladen ved udlevering og aflevering for automatisk verifikation.", icon: Scan },
        { title: "Dashboard-foto med AI", description: "Tag foto af instrumentbrættet – AI aflæser km-stand og brændstofniveau.", icon: Camera },
        { title: "GPS-lokationsverifikation", description: "Bekræft at bilen afleveres det rigtige sted med GPS-tjek.", icon: MapPin },
        { title: "Automatisk opgørelse", description: "Systemet beregner km-overskridelse og brændstofgebyr automatisk.", icon: Receipt },
        { title: "QR-kode check-in", description: "Generér QR-koder til hurtig selv-check-in for lejere.", icon: QrCode, badge: "Ny" },
      ],
    },
    {
      title: "Betaling & Økonomi",
      icon: CreditCard,
      color: "from-secondary to-secondary/60",
      features: [
        { title: "Flere betalingsmetoder", description: "Modtag betaling via kort, MobilePay, bankoverførsel eller kontant.", icon: CreditCard },
        { title: "Automatisk abonnementsbetaling", description: "Ved månedlig leje trækkes beløbet automatisk fra lejerens kort.", icon: Repeat },
        { title: "Depositumhåndtering", description: "Administrer depositum og frigivelse sikkert gennem systemet.", icon: Shield },
        { title: "Selvrisiko-forsikring", description: "Tilbyd lejere at reducere selvrisiko til 0 kr. for kun 49 kr./dag.", icon: ShieldCheck },
        { title: "Brændstofpolitik", description: "Automatisk beregning af brændstofgebyr ved manglende tank.", icon: Gauge },
        { title: "Platformgebyr-betaling", description: "Administrer og betal platformgebyrer direkte i systemet.", icon: Wallet, badge: "Ny" },
      ],
    },
    {
      title: "GPS & Flådestyring",
      icon: MapPin,
      color: "from-green-500 to-green-500/60",
      features: [
        { title: "Real-time GPS-sporing", description: "Se hvor dine biler befinder sig i realtid på kortet.", icon: MapPin },
        { title: "Geofencing-alarmer", description: "Få besked når en bil forlader et defineret område.", icon: CircleDot },
        { title: "Kilometerregistrering", description: "Automatisk opdatering af kilometertal via GPS-tracker.", icon: Gauge },
        { title: "Webhook-integration", description: "Modtag GPS-data fra alle førende GPS-udbydere via webhook.", icon: Zap, badge: "Ny" },
      ],
    },
    {
      title: "Motorcykel & Scooter",
      icon: Bike,
      color: "from-yellow-500 to-yellow-500/60",
      features: [
        { title: "MC-kørekort validering", description: "Automatisk tjek af kørekortstype (A1, A2, A) mod motorcyklens effekt.", icon: BadgeCheck, badge: "Ny" },
        { title: "MC-specifik vedligeholdelse", description: "Spor kædeservice, dækslid og andre MC-specifikke serviceintervaller.", icon: Wrench, badge: "Ny" },
        { title: "Sæson-tjekliste", description: "Automatiske påmindelser om forårsgøring og vinterklargøring.", icon: Thermometer, badge: "Ny" },
        { title: "MC Check-in guide", description: "Specialiseret check-in flow med MC-specifikke kontrolpunkter.", icon: FileCheck, badge: "Ny" },
      ],
    },
    {
      title: "Værksted & Service",
      icon: Wrench,
      color: "from-orange-500 to-orange-500/60",
      features: [
        { title: "Smart Service hos LEJIO", description: "Book værkstedstider direkte i systemet – vi klarer servicen for dig.", icon: Wrench },
        { title: "Syns-påmindelser", description: "Automatisk påmindelse når syn nærmer sig.", icon: Bell },
        { title: "Dækstyring", description: "Administrer sommer/vinterdæk og dækhotel-lokationer.", icon: CircleDot },
        { title: "Byttebil-funktion", description: "Udskift køretøj midt i lejeperiode ved service eller nedbrud.", icon: Truck },
        { title: "Service-booking", description: "Book og administrer service- og værkstedsaftaler direkte i systemet.", icon: CalendarClock, badge: "Ny" },
      ],
    },
    {
      title: "AI-funktioner",
      icon: Brain,
      color: "from-purple-500 to-purple-500/60",
      features: [
        { title: "Auto-Dispatch AI", description: "AI-drevet flådefordeling baseret på efterspørgsel og søgemønstre.", icon: Brain, badge: "AI" },
        { title: "AI-prissætning", description: "Intelligente prisforslag baseret på marked og konkurrence.", icon: TrendingDown, badge: "AI" },
        { title: "Dashboard-analyse", description: "AI analyserer dine data og giver personlige anbefalinger.", icon: BarChart3, badge: "AI" },
        { title: "Skade-AI", description: "Automatisk analyse og kategorisering af skadebilleder.", icon: Camera, badge: "AI" },
        { title: "AI-oversættelse", description: "Automatisk oversættelse af beskeder mellem sprog.", icon: Globe, badge: "AI" },
      ],
    },
    {
      title: "Kommunikation",
      icon: MessageSquare,
      color: "from-indigo-500 to-indigo-500/60",
      features: [
        { title: "Indbygget beskedsystem", description: "Kommuniker direkte med lejere gennem platformen.", icon: MessageSquare },
        { title: "Push-notifikationer", description: "Få besked på telefonen ved nye bookinger og beskeder.", icon: Bell },
        { title: "Automatiske emails", description: "Bookingbekræftelser og påmindelser sendes automatisk.", icon: Smartphone },
        { title: "Live Chat Support", description: "AI-assisteret kundesupport direkte i appen.", icon: MessageSquare },
        { title: "Ulæste beskeder", description: "Se altid hvor mange ulæste beskeder du har i menuen.", icon: Bell, badge: "Ny" },
      ],
    },
    {
      title: "Lejer-administration",
      icon: Users,
      color: "from-blue-500 to-blue-500/60",
      features: [
        { title: "Kørekortsverifikation", description: "AI-verificerer kørekort med foto-upload og automatisk godkendelse.", icon: BadgeCheck },
        { title: "Lejerhistorik", description: "Se alle tidligere bookinger og interaktioner med hver lejer.", icon: Users },
        { title: "Lejer-rating", description: "Bedøm lejere og se deres gennemsnitlige rating.", icon: Star },
        { title: "Advarselsregister", description: "Se advarsler på problematiske lejere på tværs af platformen.", icon: AlertTriangle },
        { title: "Kundesegmenter", description: "Opdel dine lejere i segmenter baseret på adfærd og værdi.", icon: Users, badge: "Ny" },
        { title: "Favorit-lejere", description: "Gem dine bedste lejere som favoritter for hurtig adgang.", icon: Star, badge: "Ny" },
      ],
    },
    {
      title: "Erhverv & Flåde",
      icon: Building2,
      color: "from-slate-500 to-slate-500/60",
      features: [
        { title: "Erhvervskonti", description: "Særlige vilkår og fakturering for erhvervskunder med EAN-nummer.", icon: Building2 },
        { title: "Afdelingsbudgetter", description: "Fordel kørsel på afdelinger med separate budgetter og rapporter.", icon: BarChart3 },
        { title: "Medarbejder-administration", description: "Administrer hvilke medarbejdere der må leje hvilke biler.", icon: Users },
        { title: "Månedlig samlet faktura", description: "Én faktura for alle bookinger med EAN/CVR-nummer.", icon: Receipt },
        { title: "Flåde-afregning", description: "Månedlig afregning med kommission for store flådeejere.", icon: Wallet, badge: "Ny" },
        { title: "CVR-opslag", description: "Automatisk opslag af virksomhedsdata via CVR-nummer.", icon: Building2, badge: "Ny" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-24 sm:py-32 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-mint/10 rounded-full blur-[150px] rotate-12" />
          </div>
          
          {/* Geometric shapes */}
          <div className="absolute top-32 right-20 w-24 h-24 border-4 border-primary/20 rotate-45 hidden lg:block" />
          <div className="absolute bottom-32 left-20 w-16 h-16 bg-accent/10 rounded-full hidden lg:block" />
          <div className="absolute top-1/2 right-32 w-8 h-32 bg-mint/10 rounded-full hidden lg:block" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-bold text-primary mb-8 animate-slide-up">
                <Zap className="w-4 h-4" />
                <span>100+ funktioner • 12 kategorier • AI-drevet</span>
              </div>
              
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <span className="block">ALT DU BEHØVER</span>
                <span className="block bg-gradient-to-r from-primary via-accent to-mint bg-clip-text text-transparent">
                  TIL BILUDLEJNING
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Fra booking til betaling, fra GPS-sporing til AI-prissætning. 
                LEJIO har alle funktioner du behøver for at drive en succesfuld udlejningsforretning.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <Button size="lg" className="font-bold text-lg px-8 py-6 shadow-lg shadow-primary/20" onClick={() => navigate('/auth')}>
                  Kom i gang gratis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="font-bold text-lg px-8 py-6" onClick={() => navigate('/faq')}>
                  Se alle FAQ
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { number: "100+", label: "Funktioner" },
                { number: "12", label: "Kategorier" },
                { number: "5", label: "AI-funktioner" },
                { number: "24/7", label: "Support" },
              ].map((stat, index) => (
                <div key={index} className="text-center p-6 rounded-2xl bg-card/50 border border-border/50">
                  <div className="font-display text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 relative">
          <div className="container mx-auto px-6">
            <div className="space-y-16">
              {featureCategories.map((category, categoryIndex) => {
                const CategoryIcon = category.icon;
                return (
                  <div key={categoryIndex} className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                        <CategoryIcon className="w-7 h-7 text-white" />
                      </div>
                      <h2 className="font-display text-3xl font-black">{category.title}</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                      {category.features.map((feature, featureIndex) => {
                        const FeatureIcon = feature.icon;
                        return (
                          <Card 
                            key={featureIndex}
                            className="group hover:shadow-xl hover:-translate-y-1 transition-all bg-card/50 backdrop-blur-sm border-border/50"
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                  <FeatureIcon className="w-5 h-5 text-white" />
                                </div>
                                {feature.badge && (
                                  <Badge variant="secondary" className="text-xs font-bold">
                                    {feature.badge}
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-base font-bold mt-3">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <CardDescription className="text-sm">{feature.description}</CardDescription>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center p-12 rounded-[3rem] bg-gradient-to-br from-primary/10 via-accent/10 to-mint/10 border-2 border-primary/20">
              <h2 className="font-display text-4xl font-black mb-4">
                Klar til at komme i gang?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Opret en gratis konto og oplev alle funktioner selv.
              </p>
              <Button size="lg" className="font-bold text-lg px-10 py-6 shadow-lg shadow-primary/20" onClick={() => navigate('/auth')}>
                Start gratis nu
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Features;