import { User } from 'lucide-react';

const LeaderSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Mød folkene bag <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Lejio</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Bag Lejio.dk står et dedikeret team med en passion for teknologi og mobilitet.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                <User className="w-12 h-12 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-1">Rasmus Damsgaard</h3>
              <p className="text-primary font-medium mb-4">Daglig Leder</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Rasmus har fingeren på pulsen i alle dele af forretningen. Han sikrer, at teknologien bag Lejio altid fungerer fejlfrit, og brænder for god kundeservice. Hos Lejio er hjælpen aldrig mere end et opkald eller en besked væk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderSection;
