import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import LejioLogo from "./LejioLogo";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent"}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="#"><LejioLogo size="md" /></a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Funktioner</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">Sådan virker det</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Priser</a>
            <Button variant="ghost" size="sm">Log ind</Button>
            <Button variant="hero" size="sm">Kom i gang</Button>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 animate-fade-in">
            <a href="#features" className="text-muted-foreground hover:text-foreground">Funktioner</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground">Sådan virker det</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground">Priser</a>
            <Button variant="hero" size="default" className="w-full">Kom i gang</Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
