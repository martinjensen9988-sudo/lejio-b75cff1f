import { CreditCard, FileSignature, Settings, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: CreditCard,
    title: "Direkte Betaling",
    subtitle: "Din egen indløsningsaftale",
    color: "primary",
    features: [
      "Forbind din egen Quickpay/PensoPay/Stripe",
      "Pengene går direkte til din bank",
      "Vi rører aldrig din omsætning",
      "Spar transaktionsgebyrer",
    ],
    benefit: "Bedre cash-flow med øjeblikkelig udbetaling",
  },
  {
    icon: FileSignature,
    title: "Automatisk Kontrakt",
    subtitle: "Juridisk bindende lejeaftaler",
    color: "accent",
    features: [
      "Automatisk kontraktgenerering ved booking",
      "Dine forsikringsoplysninger inkluderet",
      "Kundens data valideret og flettet ind",
      "Digital accept og signatur",
    ],
    benefit: "Spar tid med automatiske, professionelle kontrakter",
  },
  {
    icon: Settings,
    title: "Dine Biler, Dine Regler",
    subtitle: "Fuld kontrol over din forretning",
    color: "primary",
    features: [
      "Du bestemmer priser og depositum",
      "Vælg din egen selvrisiko",
      "Smart kalender holder styr på alt",
      "Egen profilside til din virksomhed",
    ],
    benefit: "Behold kontrollen – vi leverer teknikken",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(270_60%_60%/0.05),transparent_60%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Alt hvad du behøver –{" "}
            <span className="text-gradient">intet mere</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vi leverer bookingen, kalenderen og kontrakten. Du beholder din egen betalingsløsning og forsikring.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative rounded-2xl bg-card border border-border p-6 lg:p-8 hover:border-primary/50 transition-all duration-500 animate-scale-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${feature.color === 'primary' ? 'bg-primary/5' : 'bg-accent/5'}`} />
              
              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-xl ${feature.color === 'primary' ? 'bg-primary/20' : 'bg-accent/20'} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-7 h-7 ${feature.color === 'primary' ? 'text-primary' : 'text-accent'}`} />
                  </div>
                </div>

                <h3 className="font-display text-xl font-bold text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">{feature.subtitle}</p>

                <ul className="space-y-3 mb-6">
                  {feature.features.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 shrink-0 mt-0.5 ${feature.color === 'primary' ? 'text-primary' : 'text-accent'}`} />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className={`p-4 rounded-xl ${feature.color === 'primary' ? 'bg-primary/10 border border-primary/20' : 'bg-accent/10 border border-accent/20'}`}>
                  <p className="text-sm font-medium text-foreground">
                    ✨ {feature.benefit}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="glass" size="lg" className="group">
            Se alle funktioner
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
