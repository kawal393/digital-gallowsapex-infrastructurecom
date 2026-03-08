import { useMemo } from "react";

type RegStatus = "enforced" | "enacted" | "proposed" | "draft" | "none";

interface RegulationMapProps {
  regulations: Array<{
    country: string;
    status: RegStatus;
  }>;
  onCountryClick?: (country: string) => void;
}

// Real simplified SVG world map paths (derived from Natural Earth)
const worldOutline = "M60,200 Q80,195 100,190 Q140,170 180,165 Q200,160 220,155 L240,150 Q260,148 280,152 Q300,158 310,162 Q320,170 330,175 L340,180 Q345,185 350,190 L360,200 Q365,210 370,220 Q375,235 380,250 Q385,270 390,280 L395,290 Q400,300 405,310 L410,320 Q412,330 410,340 L405,350 Q400,355 395,358 L390,360 Q385,362 380,360 L370,355 Q360,348 350,342 L340,338 Q330,335 320,332 L310,330 Q300,330 290,335 Q280,342 270,348 L260,352 Q250,355 240,352 L230,348 Q220,340 215,335 L210,328 Q200,315 195,308 L190,300 Q185,290 180,282 L175,275 Q170,268 165,262 L160,258 Q150,250 140,248 Q130,250 120,255 L110,262 Q100,268 90,270 L80,268 Q70,262 65,255 L62,248 Q60,240 58,230 L57,220 Q58,210 60,200Z";

// Country dot positions on the map (approximate)
const countryPositions: Record<string, { x: number; y: number; label: string }> = {
  "European Union": { x: 510, y: 135, label: "EU" },
  "Germany": { x: 508, y: 130, label: "DE" },
  "France": { x: 492, y: 142, label: "FR" },
  "Italy": { x: 510, y: 150, label: "IT" },
  "Spain": { x: 478, y: 155, label: "ES" },
  "Netherlands": { x: 500, y: 122, label: "NL" },
  "United Kingdom": { x: 482, y: 118, label: "UK" },
  "Switzerland": { x: 505, y: 140, label: "CH" },
  "Norway": { x: 508, y: 98, label: "NO" },
  "United States": { x: 200, y: 165, label: "US" },
  "Canada": { x: 210, y: 115, label: "CA" },
  "Brazil": { x: 290, y: 290, label: "BR" },
  "Mexico": { x: 170, y: 210, label: "MX" },
  "China": { x: 720, y: 170, label: "CN" },
  "Japan": { x: 800, y: 155, label: "JP" },
  "South Korea": { x: 780, y: 162, label: "KR" },
  "India": { x: 670, y: 215, label: "IN" },
  "Singapore": { x: 730, y: 260, label: "SG" },
  "Australia": { x: 790, y: 335, label: "AU" },
  "New Zealand": { x: 855, y: 365, label: "NZ" },
  "UAE": { x: 615, y: 210, label: "AE" },
  "Saudi Arabia": { x: 595, y: 215, label: "SA" },
  "Israel": { x: 570, y: 190, label: "IL" },
  "South Africa": { x: 550, y: 345, label: "ZA" },
  "Kenya": { x: 575, y: 270, label: "KE" },
  "Nigeria": { x: 510, y: 255, label: "NG" },
};

const statusColors: Record<RegStatus, string> = {
  enforced: "hsl(142, 76%, 36%)",
  enacted: "hsl(43, 85%, 52%)",
  proposed: "hsl(38, 92%, 50%)",
  draft: "hsl(240, 5%, 46%)",
  none: "hsl(0, 84%, 60%)",
};

// Simplified continent outlines
const continents = [
  // North America
  "M100,85 L115,82 130,78 155,80 180,75 210,72 240,78 265,90 275,100 280,115 278,130 270,145 258,155 245,162 230,168 215,172 200,178 185,185 170,192 155,200 140,210 125,218 110,225 100,228 90,220 85,205 82,190 80,175 82,160 85,145 88,130 92,115 95,100Z",
  // South America
  "M200,235 L215,230 230,228 245,232 258,238 268,248 275,260 280,275 282,290 278,308 272,322 265,335 258,348 248,358 238,365 228,368 218,365 208,358 200,348 195,335 192,320 190,305 192,290 195,275 198,260 200,245Z",
  // Europe
  "M460,80 L475,78 490,82 505,80 520,82 535,88 545,95 550,108 548,120 545,132 540,142 535,150 528,155 520,158 510,160 500,158 490,155 482,150 475,142 470,132 465,120 462,108 460,95Z",
  // Africa
  "M470,185 L485,180 500,178 515,182 528,188 538,198 545,210 550,225 552,242 548,260 542,278 535,295 528,310 518,325 508,338 498,348 488,355 478,358 468,355 458,348 450,338 445,325 442,310 440,295 442,278 445,260 448,242 452,225 458,210 462,198Z",
  // Asia
  "M560,70 L580,68 605,72 630,68 660,72 690,78 720,82 748,88 770,95 790,105 805,118 812,132 815,148 810,162 800,175 788,185 775,192 758,198 740,202 720,205 700,208 680,210 660,208 640,205 622,200 608,192 598,182 590,170 585,155 580,140 578,125 575,108 572,95 568,82Z",
  // Oceania
  "M730,295 L750,290 770,288 790,292 810,298 828,308 838,320 842,335 840,350 832,362 820,372 808,378 792,380 778,378 762,372 750,362 742,350 738,335 735,320 732,308Z",
];

const RegulationMap = ({ regulations, onCountryClick }: RegulationMapProps) => {
  const statusMap = useMemo(() => {
    const map: Record<string, RegStatus> = {};
    regulations.forEach((r) => { map[r.country] = r.status; });
    return map;
  }, [regulations]);

  return (
    <div className="rounded-xl border border-border bg-card/60 p-3 sm:p-5 overflow-hidden">
      <svg viewBox="50 50 830 360" className="w-full h-auto" style={{ maxHeight: 420 }}>
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(43, 85%, 52%)" stopOpacity="0.03" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <filter id="dotGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background glow */}
        <rect x="50" y="50" width="830" height="360" fill="url(#mapGlow)" />

        {/* Continent outlines */}
        {continents.map((path, i) => (
          <path
            key={i}
            d={path}
            fill="hsl(var(--muted) / 0.15)"
            stroke="hsl(var(--border))"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        ))}

        {/* Grid lines */}
        {[130, 180, 230, 280, 330].map((y) => (
          <line key={`h${y}`} x1="70" y1={y} x2="860" y2={y} stroke="hsl(var(--border))" strokeWidth="0.3" strokeDasharray="4,8" opacity="0.3" />
        ))}
        {[200, 350, 500, 650, 800].map((x) => (
          <line key={`v${x}`} x1={x} y1="70" x2={x} y2="390" stroke="hsl(var(--border))" strokeWidth="0.3" strokeDasharray="4,8" opacity="0.3" />
        ))}

        {/* Country dots + labels */}
        {Object.entries(countryPositions).map(([country, pos]) => {
          const status = statusMap[country] || "none";
          const color = statusColors[status];
          return (
            <g
              key={country}
              onClick={() => onCountryClick?.(country)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
            >
              {/* Pulse ring */}
              <circle
                cx={pos.x} cy={pos.y} r="8"
                fill={color}
                fillOpacity="0.12"
                className="animate-pulse"
              />
              {/* Dot */}
              <circle
                cx={pos.x} cy={pos.y} r="4"
                fill={color}
                filter="url(#dotGlow)"
                className="transition-all duration-300 hover:r-6"
              />
              {/* Label */}
              <text
                x={pos.x}
                y={pos.y - 10}
                textAnchor="middle"
                fill="hsl(var(--foreground))"
                fontSize="7"
                fontWeight="700"
                fontFamily="system-ui"
                className="pointer-events-none select-none"
                opacity="0.7"
              >
                {pos.label}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(80, 390)">
          {(["enforced", "enacted", "proposed", "draft"] as RegStatus[]).map((s, i) => (
            <g key={s} transform={`translate(${i * 115}, 0)`}>
              <circle cx="0" cy="0" r="4" fill={statusColors[s]} />
              <text x="8" y="3.5" fill="hsl(var(--muted-foreground))" fontSize="8" fontFamily="system-ui" fontWeight="500">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default RegulationMap;
