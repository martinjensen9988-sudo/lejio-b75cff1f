import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LejioLogo from "./LejioLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-card/90 backdrop-blur-md shadow-soft border-b border-border" : "bg-transparent"}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
            <LejioLogo size="md" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <a href="/search" onClick={(e) => { e.preventDefault(); navigate("/search"); }} className="text-muted-foreground hover:text-primary font-medium transition-colors">Find bil</a>
            
            {/* Show landing page links only on homepage or when not logged in */}
            {(isHomePage || !user) && (
              <>
                <a href="#features" className="text-muted-foreground hover:text-primary font-medium transition-colors">Funktioner</a>
                <a href="#how-it-works" className="text-muted-foreground hover:text-primary font-medium transition-colors">Sådan virker det</a>
                <a href="#pricing" className="text-muted-foreground hover:text-primary font-medium transition-colors">Priser</a>
              </>
            )}
            
            <a href="/faq" onClick={(e) => { e.preventDefault(); navigate("/faq"); }} className="text-muted-foreground hover:text-primary font-medium transition-colors">FAQ</a>
            
            {user && (
              <>
                <a href="/my-rentals" onClick={(e) => { e.preventDefault(); navigate("/my-rentals"); }} className="text-muted-foreground hover:text-primary font-medium transition-colors">Mine lejeaftaler</a>
                <a href="/beskeder" onClick={(e) => { e.preventDefault(); navigate("/beskeder"); }} className="text-muted-foreground hover:text-primary font-medium transition-colors">Beskeder</a>
              </>
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              <div className="w-24 h-9 bg-muted rounded-xl animate-pulse" />
            ) : user ? (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-colors">
                      <div className={`w-2 h-2 rounded-full ${profile?.user_type === 'professionel' ? 'bg-primary' : 'bg-accent'}`} />
                      <span className="text-sm font-medium text-foreground">
                        {profile?.full_name || user.email?.split('@')[0]}
                      </span>
                      {profile?.user_type === 'professionel' && (
                        <span className="text-xs px-1.5 py-0.5 rounded-md bg-primary/20 text-primary font-medium">Pro</span>
                      )}
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                    <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Indstillinger
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Log ud
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Log ind</Button>
                <Button variant="warm" size="sm" onClick={() => navigate("/auth")}>Bliv Udlejer</Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="lg:hidden text-foreground p-2 rounded-xl hover:bg-muted transition-colors" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-soft px-6 py-4 flex flex-col gap-4 animate-fade-in">
            <a href="/search" onClick={(e) => { e.preventDefault(); navigate("/search"); setIsOpen(false); }} className="text-muted-foreground hover:text-primary font-medium py-2">Find bil</a>
            
            {(isHomePage || !user) && (
              <>
                <a href="#features" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-primary font-medium py-2">Funktioner</a>
                <a href="#how-it-works" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-primary font-medium py-2">Sådan virker det</a>
                <a href="#pricing" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-primary font-medium py-2">Priser</a>
              </>
            )}
            
            <a href="/faq" onClick={(e) => { e.preventDefault(); navigate("/faq"); setIsOpen(false); }} className="text-muted-foreground hover:text-primary font-medium py-2">FAQ</a>
            
            {user && (
              <>
                <a href="/my-rentals" onClick={(e) => { e.preventDefault(); navigate("/my-rentals"); setIsOpen(false); }} className="text-muted-foreground hover:text-primary font-medium py-2">Mine lejeaftaler</a>
                <a href="/beskeder" onClick={(e) => { e.preventDefault(); navigate("/beskeder"); setIsOpen(false); }} className="text-muted-foreground hover:text-primary font-medium py-2">Beskeder</a>
              </>
            )}
            
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              {user ? (
                <>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { navigate("/dashboard"); setIsOpen(false); }}>
                    Dashboard
                  </Button>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{profile?.full_name || user.email}</span>
                    {profile?.user_type === 'professionel' && (
                      <span className="text-xs px-1.5 py-0.5 rounded-md bg-primary/20 text-primary font-medium">Pro</span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { navigate("/settings"); setIsOpen(false); }}>
                    Indstillinger
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-1" />
                    Log ud
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Log ind</Button>
                  <Button variant="warm" size="sm" className="w-full" onClick={() => navigate("/auth")}>Bliv Udlejer</Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
