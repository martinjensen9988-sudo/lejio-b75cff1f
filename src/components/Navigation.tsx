import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import LejioLogo from "./LejioLogo";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-glass border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center">
            <LejioLogo size="md" />
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Funktioner
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              Sådan virker det
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Priser
            </a>
            <Button variant="hero" size="default">
              Prøv gratis i 14 dage
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
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Funktioner
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              Sådan virker det
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Priser
            </a>
            <Button variant="hero" size="default" className="w-full">
              Prøv gratis i 14 dage
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
