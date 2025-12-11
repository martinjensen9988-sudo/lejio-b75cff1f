import LejioLogo from "./LejioLogo";
import { MapPin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <LejioLogo size="lg" />
            <p className="text-sm text-muted-foreground mt-4 max-w-xs">
              Hotels.com for biludlejning. Vi samler private og professionelle udlejere i én søgning.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Danmark</span>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-4">For lejere</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Søg biler</a></li>
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">Hvordan det virker</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-4">For udlejere</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Bliv privat udlejer</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pro-partner program</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Priser</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-4">Kontakt</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4 text-primary" />
              <a href="mailto:hej@lejio.dk" className="hover:text-primary transition-colors">hej@lejio.dk</a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LEJIO. Alle rettigheder forbeholdes.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privatlivspolitik</a>
            <a href="#" className="hover:text-primary transition-colors">Handelsbetingelser</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
