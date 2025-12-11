import { Monitor, Smartphone, Server, Database, Cpu, Shield } from "lucide-react";

const Architecture = () => {
  const layers = [
    {
      title: "Client Layer",
      color: "primary",
      items: [
        { icon: Smartphone, label: "Mobile App", tech: "React Native" },
        { icon: Monitor, label: "Web Dashboard", tech: "Next.js" },
        { icon: Cpu, label: "Keyless IoT", tech: "Embedded" },
      ],
    },
    {
      title: "API Gateway",
      color: "muted",
      items: [
        { icon: Server, label: "GraphQL Federation", tech: "Gateway" },
      ],
    },
    {
      title: "Core Services",
      color: "accent",
      items: [
        { icon: Shield, label: "Booking", tech: "Service" },
        { icon: Shield, label: "Fleet", tech: "Service" },
        { icon: Shield, label: "User/Auth", tech: "Service" },
      ],
    },
    {
      title: "Data Layer",
      color: "primary",
      items: [
        { icon: Database, label: "PostgreSQL", tech: "Core Data" },
        { icon: Database, label: "Ledger", tech: "Financial Logs" },
        { icon: Database, label: "TimescaleDB", tech: "GPS/IOT" },
      ],
    },
  ];

  return (
    <section id="architecture" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(174_72%_56%/0.08),transparent_60%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            System <span className="text-gradient-accent">Arkitektur</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            En moderne microservices-arkitektur designet til skalering og vedligeholdelse af komplekse finansielle operationer.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {layers.map((layer, i) => (
            <div
              key={i}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="mb-2">
                <span className={`text-xs font-medium uppercase tracking-wider ${layer.color === 'primary' ? 'text-primary' : layer.color === 'accent' ? 'text-accent' : 'text-muted-foreground'}`}>
                  {layer.title}
                </span>
              </div>
              
              <div className={`rounded-xl border ${layer.color === 'primary' ? 'border-primary/30 bg-primary/5' : layer.color === 'accent' ? 'border-accent/30 bg-accent/5' : 'border-border bg-card'} p-4`}>
                <div className="flex flex-wrap justify-center gap-4">
                  {layer.items.map((item, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors group"
                    >
                      <div className={`w-10 h-10 rounded-lg ${layer.color === 'primary' ? 'bg-primary/20' : layer.color === 'accent' ? 'bg-accent/20' : 'bg-muted'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <item.icon className={`w-5 h-5 ${layer.color === 'primary' ? 'text-primary' : layer.color === 'accent' ? 'text-accent' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.tech}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {i < layers.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="w-px h-8 bg-gradient-to-b from-border to-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { label: "Go/Rust", desc: "Finansielle dele" },
            { label: "TypeScript", desc: "Forretningslogik" },
            { label: "Kubernetes", desc: "Infrastruktur" },
          ].map((tech, i) => (
            <div key={i} className="text-center p-6 rounded-xl bg-card border border-border animate-scale-in" style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
              <div className="font-display text-lg font-bold text-gradient">{tech.label}</div>
              <div className="text-sm text-muted-foreground">{tech.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Architecture;
