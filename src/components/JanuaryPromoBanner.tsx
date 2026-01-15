import { Gift, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const JanuaryPromoBanner = () => {
  return (
    <div className="bg-gradient-to-r from-primary via-primary/90 to-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <Sparkles className="absolute top-2 left-[10%] w-4 h-4 text-white/30 animate-pulse" />
        <Sparkles className="absolute bottom-2 right-[15%] w-3 h-3 text-white/40 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <Sparkles className="absolute top-3 right-[30%] w-3 h-3 text-white/30 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto px-4 py-3 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-white text-center">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 animate-bounce" />
            <span className="font-bold text-sm sm:text-base">
              🎉 JANUAR TILBUD
            </span>
          </div>
          <span className="text-sm sm:text-base">
            Tilmeld dig nu og få <strong>6 måneders gratis adgang</strong> – intet kreditkort krævet!
          </span>
          <Link 
            to="/auth" 
            className="inline-flex items-center gap-1 bg-white text-primary px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors shadow-lg"
          >
            Kom i gang gratis
            <Sparkles className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JanuaryPromoBanner;
