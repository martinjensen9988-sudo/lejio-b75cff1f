import { Car, FileSignature, CreditCard, Shield, User, Building2, ArrowRight } from "lucide-react";

const HeroVisual = () => {
  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto">
      {/* Central Hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center shadow-2xl shadow-primary/30 z-20">
        <span className="font-display text-xl font-bold text-primary-foreground tracking-tight">LEJIO</span>
      </div>

      {/* Orbiting connection lines */}
      <svg className="absolute inset-0 w-full h-full animate-spin-slow" style={{ animationDuration: '30s' }}>
        <circle
          cx="50%"
          cy="50%"
          r="38%"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="1"
          strokeDasharray="8 12"
          opacity="0.3"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(174, 72%, 56%)" />
            <stop offset="100%" stopColor="hsl(270, 60%, 60%)" />
          </linearGradient>
        </defs>
      </svg>

      {/* The Fork - Two User Types */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-4">
        {/* P2P User */}
        <div className="relative group animate-float" style={{ animationDelay: '0s' }}>
          <div className="w-16 h-16 rounded-xl bg-card border border-accent/50 flex flex-col items-center justify-center shadow-lg hover:border-accent hover:shadow-accent/20 transition-all cursor-pointer">
            <User className="w-6 h-6 text-accent mb-1" />
            <span className="text-[10px] text-muted-foreground font-medium">Privat</span>
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-accent/50 to-transparent" />
        </div>

        {/* Pro User */}
        <div className="relative group animate-float" style={{ animationDelay: '0.5s' }}>
          <div className="w-16 h-16 rounded-xl bg-card border border-primary/50 flex flex-col items-center justify-center shadow-lg hover:border-primary hover:shadow-primary/20 transition-all cursor-pointer">
            <Building2 className="w-6 h-6 text-primary mb-1" />
            <span className="text-[10px] text-muted-foreground font-medium">Erhverv</span>
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-primary/50 to-transparent" />
        </div>
      </div>

      {/* Left side - P2P Flow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 space-y-4">
        <div className="group animate-float" style={{ animationDelay: '0.2s' }}>
          <div className="w-14 h-14 rounded-xl bg-card border border-accent/30 flex items-center justify-center shadow-lg hover:border-accent hover:shadow-accent/20 transition-all cursor-pointer">
            <CreditCard className="w-6 h-6 text-accent" />
          </div>
          <div className="mt-1 text-[10px] text-center text-muted-foreground">Via Lejio</div>
        </div>
      </div>

      {/* Right side - Pro Flow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 space-y-4">
        <div className="group animate-float" style={{ animationDelay: '0.4s' }}>
          <div className="w-14 h-14 rounded-xl bg-card border border-primary/30 flex items-center justify-center shadow-lg hover:border-primary hover:shadow-primary/20 transition-all cursor-pointer">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          <div className="mt-1 text-[10px] text-center text-muted-foreground">Direkte</div>
        </div>
      </div>

      {/* Bottom - Shared Features */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6">
        <div className="group animate-float" style={{ animationDelay: '0.6s' }}>
          <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 transition-all cursor-pointer">
            <Car className="w-6 h-6 text-foreground/80" />
          </div>
          <div className="mt-1 text-[10px] text-center text-muted-foreground">Biler</div>
        </div>
        <div className="group animate-float" style={{ animationDelay: '0.8s' }}>
          <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 transition-all cursor-pointer">
            <FileSignature className="w-6 h-6 text-foreground/80" />
          </div>
          <div className="mt-1 text-[10px] text-center text-muted-foreground">Kontrakt</div>
        </div>
        <div className="group animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 transition-all cursor-pointer">
            <Shield className="w-6 h-6 text-foreground/80" />
          </div>
          <div className="mt-1 text-[10px] text-center text-muted-foreground">Forsikring</div>
        </div>
      </div>

      {/* Payment Flow Indicators */}
      <div className="absolute left-16 top-1/3 flex items-center gap-1 text-[9px] text-accent/70">
        <span>20% gebyr</span>
        <ArrowRight className="w-3 h-3" />
      </div>
      <div className="absolute right-16 top-1/3 flex items-center gap-1 text-[9px] text-primary/70">
        <span>Direkte til dig</span>
        <ArrowRight className="w-3 h-3" />
      </div>
    </div>
  );
};

export default HeroVisual;
