import LejioLogo from "./LejioLogo";
import { MapPin, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            {/* White version of logo */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-primary-foreground flex items-center justify-center">
                <span className="text-primary font-black text-xl">🚗</span>
              </div>
              <span className="font-display font-black text-2xl text-primary-foreground">LEJIO</span>
            </div>
            <p className="text-sm text-primary-foreground/80 max-w-xs">
              Den nemmeste vej til din næste bil. Private og professionelle udlejere – alt samlet ét sted.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-primary-foreground/70">
              <MapPin className="w-4 h-4" />
              <span>Danmark</span>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-primary-foreground mb-4">For lejere</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><a href="/search" className="hover:text-secondary transition-colors">Søg biler</a></li>
              <li><a href="#how-it-works" className="hover:text-secondary transition-colors">Hvordan det virker</a></li>
              <li><a href="/faq" className="hover:text-secondary transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-primary-foreground mb-4">For udlejere</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-secondary transition-colors">Bliv privat udlejer</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Pro-partner program</a></li>
              <li><a href="#pricing" className="hover:text-secondary transition-colors">Priser</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-primary-foreground mb-4">Kontakt</h4>
            <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
              <Mail className="w-4 h-4" />
              <a href="mailto:hej@lejio.dk" className="hover:text-secondary transition-colors">hej@lejio.dk</a>
            </div>
            
            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              <a 
                href="https://www.facebook.com/profile.php?id=61584959161176" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-primary-foreground/10 hover:bg-secondary flex items-center justify-center text-lg transition-colors"
                aria-label="Facebook"
              >
                📘
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-primary-foreground/10 hover:bg-secondary flex items-center justify-center text-lg transition-colors"
                aria-label="Instagram"
              >
                📸
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/70 flex items-center gap-1">
            © {new Date().getFullYear()} LEJIO. Lavet med <Heart className="w-4 h-4 text-accent inline" /> i Danmark
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/70">
            <a href="/privatlivspolitik" className="hover:text-secondary transition-colors">Privatlivspolitik</a>
            <a href="/handelsbetingelser" className="hover:text-secondary transition-colors">Handelsbetingelser</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
