import { useState } from "react";
import { ArrowRight, User, Building2, Shield, Sparkles, Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"privat" | "erhverv">("privat");

  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[150px] opacity-5" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-mint rounded-full blur-[120px] opacity-5" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-bold text-accent mb-6">
            <Crown className="w-4 h-4" />
            <span>Gennemsigtige priser</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
            Vælg den plan der{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              passer dig
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ingen skjulte gebyrer. Start gratis og betal kun når du tjener.
          </p>
        </div>

        {/* Toggle between Privat and Erhverv */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-full bg-muted/50 border border-border">
            <button
              onClick={() => setActiveTab("privat")}
              className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${
                activeTab === "privat"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Privatperson
              </span>
            </button>
            <button
              onClick={() => setActiveTab("erhverv")}
              className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${
                activeTab === "erhverv"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Erhverv / Forhandler
              </span>
            </button>
          </div>
        </div>

        {/* Privat pricing cards */}
        {activeTab === "privat" && (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-fade-in">
            {/* Privat Udlejer */}
            <div className="rounded-[2rem] bg-card border-2 border-accent/20 p-8 hover:shadow-2xl hover:border-accent/50 transition-all group hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center mb-8 shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
                <User className="w-8 h-8 text-white" />
              </div>

              <h3 className="font-display text-2xl font-black text-foreground mb-2">Privat Udlejer</h3>
              <p className="text-muted-foreground mb-8">Gør det selv – fuld kontrol over din udlejning</p>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-6xl font-black text-foreground">0</span>
                  <span className="text-muted-foreground text-lg">kr/md</span>
                </div>
                <p className="text-accent font-bold mt-2 text-lg">+ 59 kr per booking</p>
              </div>

              <ul className="space-y-4 mb-10">
                {[
                  "Ingen månedlig betaling",
                  "Automatisk kontrakt",
                  "Kalender & booking",
                  "Direkte kundekontakt",
                  "Du styrer alt selv"
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Button variant="warm" size="lg" className="w-full font-bold text-lg py-6" onClick={() => navigate('/auth')}>
                Kom i gang gratis
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Privat Fleet - Featured */}
            <div className="rounded-[2rem] bg-gradient-to-br from-mint/10 via-card to-accent/10 border-2 border-mint/50 p-8 hover:shadow-2xl transition-all relative hover:-translate-y-2">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-gradient-to-r from-mint to-accent text-white text-sm font-bold shadow-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Populær
              </div>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mint to-accent flex items-center justify-center mb-8 shadow-lg shadow-mint/30">
                <User className="w-8 h-8 text-white" />
              </div>

              <h3 className="font-display text-2xl font-black text-foreground mb-2">Privat Fleet</h3>
              <p className="text-muted-foreground mb-8">Vi driver udlejningen for dig – ingen besvær</p>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-6xl font-black text-foreground">30</span>
                  <span className="text-muted-foreground text-lg">%</span>
                </div>
                <p className="text-mint font-bold mt-2 text-lg">Du beholder 70% af omsætningen</p>
              </div>

              <ul className="space-y-4 mb-10">
                {[
                  "LEJIO håndterer alt for dig",
                  "Min. 30 dages abonnement",
                  "70% udbetalt direkte til dig",
                  "Ingen bekymringer",
                  "Perfekt til privatbiler"
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-mint/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-mint" />
                    </div>
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                <Button size="lg" className="w-full font-bold text-lg py-6 bg-gradient-to-r from-mint to-accent hover:opacity-90 shadow-lg shadow-mint/30" onClick={() => navigate('/auth')}>
                  Kom i gang
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="w-full text-mint hover:text-mint/80 font-medium" onClick={() => navigate('/privat-fleet')}>
                  Læs mere om Privat Fleet →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Erhverv pricing cards */}
        {activeTab === "erhverv" && (
          <div className="animate-fade-in">
            {/* Three tier pricing */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
              {/* Starter */}
              <div className="rounded-[2rem] bg-card border-2 border-primary/20 p-8 hover:shadow-2xl hover:border-primary/50 transition-all relative hover:-translate-y-2">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-bold shadow-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Anbefalet
                </div>

                <h3 className="font-display text-2xl font-black text-foreground mb-1 mt-4">Starter</h3>
                <p className="text-muted-foreground text-sm mb-6">1-5 biler</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-5xl font-black text-foreground">349</span>
                    <span className="text-muted-foreground text-sm">kr/md</span>
                  </div>
                  <p className="text-primary font-bold mt-2 text-sm">+ 3% kommission</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Op til 5 køretøjer",
                    "Ubegrænsede bookinger",
                    "Digitale kontrakter",
                    "Dashboard & statistik"
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground text-sm">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button size="lg" className="w-full font-bold shadow-lg shadow-primary/20" onClick={() => navigate('/auth')}>
                  Vælg Starter
                </Button>
              </div>

              {/* Standard */}
              <div className="rounded-[2rem] bg-card border-2 border-border p-8 hover:shadow-2xl hover:border-primary/30 transition-all hover:-translate-y-2">
                <h3 className="font-display text-2xl font-black text-foreground mb-1">Standard</h3>
                <p className="text-muted-foreground text-sm mb-6">6-15 biler</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-5xl font-black text-foreground">599</span>
                    <span className="text-muted-foreground text-sm">kr/md</span>
                  </div>
                  <p className="text-primary font-bold mt-2 text-sm">+ 3% kommission</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Op til 15 køretøjer",
                    "Ubegrænsede bookinger",
                    "Digitale kontrakter",
                    "Dashboard & statistik",
                    "Prioriteret support"
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground text-sm">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="outline" size="lg" className="w-full font-bold" onClick={() => navigate('/auth')}>
                  Vælg Standard
                </Button>
              </div>

              {/* Enterprise */}
              <div className="rounded-[2rem] bg-card border-2 border-border p-8 hover:shadow-2xl hover:border-primary/30 transition-all hover:-translate-y-2">
                <h3 className="font-display text-2xl font-black text-foreground mb-1">Enterprise</h3>
                <p className="text-muted-foreground text-sm mb-6">16+ biler</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-5xl font-black text-foreground">899</span>
                    <span className="text-muted-foreground text-sm">kr/md</span>
                  </div>
                  <p className="text-primary font-bold mt-2 text-sm">+ 3% kommission</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Ubegrænsede køretøjer",
                    "Ubegrænsede bookinger",
                    "Digitale kontrakter",
                    "Dashboard & statistik",
                    "Dedikeret support",
                    "API adgang"
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground text-sm">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="outline" size="lg" className="w-full font-bold" onClick={() => navigate('/auth')}>
                  Vælg Enterprise
                </Button>
              </div>
            </div>

            {/* Fleet plans for dealers */}
            <div className="bg-card rounded-[2.5rem] p-10 border-2 border-border max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lavender/10 border border-lavender/20 text-sm font-bold text-lavender mb-4">
                  <Shield className="w-4 h-4" />
                  <span>Alternativ til SaaS</span>
                </div>
                <h3 className="font-display text-3xl font-black mb-3">Fleet-planer</h3>
                <p className="text-muted-foreground text-lg">Lad LEJIO drive din udlejning – vi tager os af alt</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Fleet Basic */}
                <div className="rounded-2xl bg-lavender/5 border-2 border-lavender/30 p-8 hover:shadow-xl hover:border-lavender/50 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lavender to-lavender/60 flex items-center justify-center shadow-lg">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-display text-xl font-black text-foreground">Fleet Basic</h4>
                      <p className="text-sm text-muted-foreground">Vi driver udlejningen</p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="font-display text-4xl font-black text-foreground">20%</span>
                    <span className="text-lavender font-bold">af omsætningen</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-sm">
                    {["Ingen månedlig udgift", "LEJIO håndterer alt", "Badge på køretøjer"].map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-lavender" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button variant="outline" className="w-full border-lavender/40 hover:bg-lavender/10 hover:border-lavender/60">
                    Kontakt os
                  </Button>
                </div>

                {/* Fleet Premium */}
                <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-lavender/5 border-2 border-primary/30 p-8 hover:shadow-xl hover:border-primary/50 transition-all relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-lavender text-white text-xs font-bold shadow-lg flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Premium
                  </div>

                  <div className="flex items-center gap-4 mb-6 mt-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-lavender flex items-center justify-center shadow-lg">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-display text-xl font-black text-foreground">Fleet Premium</h4>
                      <p className="text-sm text-muted-foreground">Fuld service løsning</p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="font-display text-4xl font-black text-foreground">35%</span>
                    <span className="text-primary font-bold">af omsætningen</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-sm">
                    {["Alt fra Basic", "Prioriteret synlighed", "Dedikeret kontaktperson"].map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full bg-gradient-to-r from-primary to-lavender hover:opacity-90">
                    Kontakt os
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;
