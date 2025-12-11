interface LejioLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const LejioLogo = ({ size = "md", showText = true }: LejioLogoProps) => {
  const sizes = {
    sm: { container: "w-8 h-8", text: "text-lg" },
    md: { container: "w-10 h-10", text: "text-xl" },
    lg: { container: "w-14 h-14", text: "text-2xl" },
  };

  return (
    <div className="flex items-center gap-3 group">
      <div className={`${sizes[size].container} rounded-xl bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-2/3 h-2/3"
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
          {/* Key symbol */}
          <circle cx="16" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" className="text-primary-foreground" />
          <path d="M16 12V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary-foreground" />
        </svg>
      </div>
      {showText && (
        <span className={`font-display font-bold ${sizes[size].text} text-foreground tracking-tight`}>
          LEJIO
        </span>
      )}
    </div>
  );
};

export default LejioLogo;
