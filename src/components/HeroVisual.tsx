import { CreditCard, FileText, Calendar, Shield } from "lucide-react";

const HeroVisual = () => {
  const features = [
    { icon: CreditCard, label: "Betaling", color: "from-primary to-primary/60" },
    { icon: FileText, label: "Kontrakt", color: "from-accent to-accent/60" },
    { icon: Calendar, label: "Kalender", color: "from-primary to-accent" },
    { icon: Shield, label: "Forsikring", color: "from-accent/80 to-primary/80" },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square">
      {/* Center Core */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-2xl bg-glass border border-border glow-primary flex items-center justify-center z-20">
        <div className="text-center">
          <div className="font-display text-lg font-bold text-foreground">LEJIO</div>
          <div className="text-xs text-muted-foreground">Platform</div>
        </div>
      </div>

      {/* Orbital Ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-border/30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-border/20" />

      {/* Feature Nodes */}
      {features.map((feature, i) => {
        const angle = (i * 90 - 45) * (Math.PI / 180);
        const radius = 160;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 animate-float"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <div className="relative group cursor-pointer">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} p-[1px] shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-110`}>
                <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-foreground" />
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {feature.label}
              </div>
            </div>
          </div>
        );
      })}

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(174 72% 56% / 0.3)" />
            <stop offset="100%" stopColor="hsl(270 60% 60% / 0.3)" />
          </linearGradient>
        </defs>
        {features.map((_, i) => {
          const angle = (i * 90 - 45) * (Math.PI / 180);
          const radius = 160;
          const x = 200 + Math.cos(angle) * radius;
          const y = 200 + Math.sin(angle) * radius;

          return (
            <line
              key={i}
              x1="200"
              y1="200"
              x2={x}
              y2={y}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              strokeDasharray="4 4"
              className="animate-pulse-glow"
              style={{ animationDelay: `${i * 0.25}s` }}
            />
          );
        })}
      </svg>

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/60 animate-float"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${20 + Math.random() * 60}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${4 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
};

export default HeroVisual;
