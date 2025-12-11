interface LejioLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const LejioLogo = ({ size = "md", showText = true }: LejioLogoProps) => {
  const sizes = {
    sm: { container: "w-8 h-8", text: "text-lg", ring: "w-5 h-5" },
    md: { container: "w-10 h-10", text: "text-xl", ring: "w-6 h-6" },
    lg: { container: "w-14 h-14", text: "text-2xl", ring: "w-8 h-8" },
  };

  return (
    <div className="flex items-center gap-3 group">
      <div className={`${sizes[size].container} rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow relative overflow-hidden`}>
        {/* Road/movement lines */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary-foreground/40" />
          <div className="absolute left-1/3 top-1/4 bottom-1/4 w-px bg-primary-foreground/20" />
          <div className="absolute left-2/3 top-1/4 bottom-1/4 w-px bg-primary-foreground/20" />
        </div>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-2/3 h-2/3 relative z-10"
        >
          {/* Car silhouette simplified */}
          <path
            d="M6 18L8 12H24L26 18M26 18H6M26 18V24H24V22H8V24H6V18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary-foreground"
          />
          {/* Wheels */}
          <circle cx="10" cy="20" r="2" fill="currentColor" className="text-primary-foreground" />
          <circle cx="22" cy="20" r="2" fill="currentColor" className="text-primary-foreground" />
        </svg>
      </div>
      {showText && (
        <div className="flex items-baseline">
          <span className={`font-display font-extrabold ${sizes[size].text} text-foreground tracking-tight`}>
            LEJI
          </span>
          <span className={`font-display font-extrabold ${sizes[size].text} text-primary tracking-tight`}>
            O
          </span>
        </div>
      )}
    </div>
  );
};

export default LejioLogo;
