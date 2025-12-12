import { DamageItem } from '@/hooks/useDamageReports';

interface DamageMarker {
  id: string;
  position: string;
  damage_type: string;
  severity: string;
  description?: string | null;
}

interface VehicleDamageMapProps {
  title: string;
  damages: DamageMarker[];
  className?: string;
}

// Map positions to SVG coordinates (percentages)
const POSITION_COORDS: Record<string, { x: number; y: number }> = {
  'front-left': { x: 18, y: 12 },
  'front-center': { x: 50, y: 8 },
  'front-right': { x: 82, y: 12 },
  'left-side': { x: 8, y: 50 },
  'right-side': { x: 92, y: 50 },
  'rear-left': { x: 18, y: 88 },
  'rear-center': { x: 50, y: 92 },
  'rear-right': { x: 82, y: 88 },
  'roof': { x: 50, y: 50 },
  'interior-front': { x: 50, y: 35 },
  'interior-rear': { x: 50, y: 65 },
  'trunk': { x: 50, y: 82 },
};

const SEVERITY_COLORS: Record<string, string> = {
  minor: '#facc15', // yellow
  moderate: '#f97316', // orange
  severe: '#ef4444', // red
};

const DAMAGE_TYPE_LABELS: Record<string, string> = {
  scratch: 'R',
  dent: 'B',
  crack: 'C',
  stain: 'P',
  tear: 'F',
  missing: 'M',
  broken: 'Ø',
  other: 'X',
};

export const VehicleDamageMap = ({ title, damages, className = '' }: VehicleDamageMapProps) => {
  return (
    <div className={`${className}`}>
      <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">{title}</h4>
      <div className="relative w-full max-w-[220px] mx-auto">
        {/* Car SVG - Top-down view */}
        <svg viewBox="0 0 100 150" className="w-full h-auto">
          {/* Car body outline */}
          <g fill="none" stroke="#374151" strokeWidth="1.5">
            {/* Main body */}
            <path d="M 20,25 
                     C 20,15 35,10 50,10 
                     C 65,10 80,15 80,25 
                     L 85,40 
                     L 85,110 
                     C 85,120 80,130 75,135 
                     C 65,140 35,140 25,135 
                     C 20,130 15,120 15,110 
                     L 15,40 
                     Z" />
            
            {/* Windshield */}
            <path d="M 25,28 L 50,22 L 75,28 L 72,42 L 28,42 Z" />
            
            {/* Rear window */}
            <path d="M 28,108 L 72,108 L 75,122 L 50,128 L 25,122 Z" />
            
            {/* Left front wheel */}
            <ellipse cx="15" cy="35" rx="6" ry="12" />
            
            {/* Right front wheel */}
            <ellipse cx="85" cy="35" rx="6" ry="12" />
            
            {/* Left rear wheel */}
            <ellipse cx="15" cy="105" rx="6" ry="12" />
            
            {/* Right rear wheel */}
            <ellipse cx="85" cy="105" rx="6" ry="12" />
            
            {/* Side mirrors */}
            <ellipse cx="12" cy="45" rx="4" ry="2" />
            <ellipse cx="88" cy="45" rx="4" ry="2" />
            
            {/* Hood line */}
            <line x1="30" y1="42" x2="70" y2="42" />
            
            {/* Trunk line */}
            <line x1="30" y1="108" x2="70" y2="108" />
            
            {/* Center console line */}
            <line x1="50" y1="48" x2="50" y2="100" strokeDasharray="3,3" strokeWidth="0.5" />
            
            {/* Front seats */}
            <rect x="30" y="48" width="15" height="20" rx="3" strokeWidth="0.8" />
            <rect x="55" y="48" width="15" height="20" rx="3" strokeWidth="0.8" />
            
            {/* Rear seats */}
            <rect x="28" y="75" width="44" height="18" rx="3" strokeWidth="0.8" />
          </g>
          
          {/* Damage markers */}
          {damages.map((damage, index) => {
            const coords = POSITION_COORDS[damage.position];
            if (!coords) return null;
            
            const color = SEVERITY_COLORS[damage.severity] || SEVERITY_COLORS.moderate;
            const label = DAMAGE_TYPE_LABELS[damage.damage_type] || 'X';
            
            return (
              <g key={damage.id || index}>
                <circle
                  cx={coords.x}
                  cy={coords.y * 1.5}
                  r="6"
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <text
                  x={coords.x}
                  y={coords.y * 1.5 + 3}
                  textAnchor="middle"
                  fontSize="7"
                  fontWeight="bold"
                  fill="#ffffff"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Damage count indicator */}
        {damages.length > 0 && (
          <div className="absolute -top-1 -right-1 bg-destructive text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {damages.length}
          </div>
        )}
      </div>
      
      {/* Damage list */}
      {damages.length > 0 ? (
        <div className="mt-3 space-y-1">
          {damages.map((damage, index) => (
            <div key={damage.id || index} className="flex items-center gap-2 text-xs">
              <span 
                className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold text-[10px]"
                style={{ backgroundColor: SEVERITY_COLORS[damage.severity] || SEVERITY_COLORS.moderate }}
              >
                {DAMAGE_TYPE_LABELS[damage.damage_type] || 'X'}
              </span>
              <span className="text-gray-600">
                {POSITION_LABELS[damage.position] || damage.position}: {DAMAGE_TYPE_FULL_LABELS[damage.damage_type] || damage.damage_type}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400 text-center mt-3">Ingen skader registreret</p>
      )}
    </div>
  );
};

const POSITION_LABELS: Record<string, string> = {
  'front-left': 'Forfra V',
  'front-center': 'Forfra',
  'front-right': 'Forfra H',
  'left-side': 'Venstre',
  'right-side': 'Højre',
  'rear-left': 'Bagfra V',
  'rear-center': 'Bagfra',
  'rear-right': 'Bagfra H',
  'roof': 'Tag',
  'interior-front': 'Kabine F',
  'interior-rear': 'Kabine B',
  'trunk': 'Bagagerum',
};

const DAMAGE_TYPE_FULL_LABELS: Record<string, string> = {
  scratch: 'Ridse',
  dent: 'Bule',
  crack: 'Revne',
  stain: 'Plet',
  tear: 'Flænge',
  missing: 'Mangler',
  broken: 'Ødelagt',
  other: 'Andet',
};

export default VehicleDamageMap;
