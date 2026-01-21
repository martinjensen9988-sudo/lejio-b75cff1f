import { forwardRef } from "react";
import { MapPin, Mail, Heart, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Footer = forwardRef<HTMLElement>((props, ref) => {
  const navigate = useNavigate();

  return (
    <footer ref={ref} className="relative overflow-hidden" {...props}>
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-primary-foreground mb-6">
            Klar til at komme i gang?
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-10">
            Opret en gratis konto og begynd at leje ud eller find dit næste køretøj i dag.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="xl" 
              variant="secondary" 
              className="font-bold text-lg shadow-lg"
              onClick={() => navigate('/auth')}
            >
              Opret gratis konto
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              size="xl" 
              variant="outline" 
              className="font-bold text-lg border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate('/search')}
            >
              Udforsk køretøjer
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-foreground text-background py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-black text-xl">🚗</span>
                </div>
                <span className="font-display font-black text-3xl text-background">LEJIO</span>
              </div>
              <p className="text-background/70 max-w-xs mb-6">
                Danmarks smarteste platform til køretøjsudlejning. Private og forhandlere – alt samlet ét sted.
              </p>
              <div className="flex items-center gap-2 text-sm text-background/60">
                <MapPin className="w-4 h-4" />
                <span>Danmark 🇩🇰</span>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-background text-lg mb-6">For lejere</h4>
              <ul className="space-y-4 text-background/70">
                <li><a href="/search" className="hover:text-primary transition-colors">Søg køretøjer</a></li>
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">Hvordan det virker</a></li>
                <li><a href="/faq" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-background text-lg mb-6">For udlejere</h4>
              <ul className="space-y-4 text-background/70">
                <li><a href="/funktioner" className="hover:text-primary transition-colors">Alle funktioner</a></li>
                <li><a href="/auth" className="hover:text-primary transition-colors">Bliv privat udlejer</a></li>
                <li><a href="/privat-fleet" className="hover:text-primary transition-colors">Privat Fleet</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Priser</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-background text-lg mb-6">Kontakt</h4>
              <div className="flex items-center gap-3 text-background/70 mb-4">
                <div className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <a href="tel:+4591998929" className="hover:text-primary transition-colors">91 99 89 29</a>
              </div>
              <div className="flex items-center gap-3 text-background/70 mb-6">
                <div className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <a href="mailto:hej@lejio.dk" className="hover:text-primary transition-colors">hej@lejio.dk</a>
              </div>
              
              {/* Social icons */}
              <div className="flex gap-3">
                <a 
                  href="https://www.facebook.com/profile.php?id=61584959161176" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-background/10 hover:bg-primary flex items-center justify-center text-xl transition-all hover:scale-110"
                  aria-label="Facebook"
                >
                  📘
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-xl bg-background/10 hover:bg-primary flex items-center justify-center text-xl transition-all hover:scale-110"
                  aria-label="Instagram"
                >
                  📸
                </a>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-background/50 flex items-center gap-2">
              © {new Date().getFullYear()} LEJIO. Lavet med <Heart className="w-4 h-4 text-accent" /> i Danmark
            </p>
            <div className="flex gap-8 text-sm text-background/50">
              <a href="/om-os" className="hover:text-primary transition-colors">Om os</a>
              <a href="/privatlivspolitik" className="hover:text-primary transition-colors">Privatlivspolitik</a>
              <a href="/handelsbetingelser" className="hover:text-primary transition-colors">Handelsbetingelser</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
