import { Button } from "@/components/ui/button";
import { Car, Menu, X } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-glass border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Car className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              FleetCore
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#engines" className="text-muted-foreground hover:text-foreground transition-colors">
              Motorer
            </a>
            <a href="#architecture" className="text-muted-foreground hover:text-foreground transition-colors">
              Arkitektur
            </a>
            <a href="#roadmap" className="text-muted-foreground hover:text-foreground transition-colors">
              Roadmap
            </a>
            <Button variant="hero" size="default">
              Kom i gang
            </Button>
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 animate-fade-in">
            <a href="#engines" className="text-muted-foreground hover:text-foreground transition-colors">
              Motorer
            </a>
            <a href="#architecture" className="text-muted-foreground hover:text-foreground transition-colors">
              Arkitektur
            </a>
            <a href="#roadmap" className="text-muted-foreground hover:text-foreground transition-colors">
              Roadmap
            </a>
            <Button variant="hero" size="default" className="w-full">
              Kom i gang
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
