import { useMemo } from "react";

type RegStatus = "enforced" | "enacted" | "proposed" | "draft" | "none";

interface RegulationMapProps {
  regulations: Array<{
    country: string;
    status: RegStatus;
  }>;
  onCountryClick?: (country: string) => void;
}

// Simplified world map paths for key countries/regions
const countryPaths: Record<string, { path: string; cx: number; cy: number }> = {
  "European Union": { path: "M480,120 L540,120 540,180 480,180Z", cx: 510, cy: 150 },
  "Germany": { path: "M500,130 L520,130 520,155 500,155Z", cx: 510, cy: 142 },
  "France": { path: "M480,145 L505,145 505,175 480,175Z", cx: 492, cy: 160 },
  "Italy": { path: "M505,160 L520,160 520,190 505,190Z", cx: 512, cy: 175 },
  "Spain": { path: "M465,165 L495,165 495,190 465,190Z", cx: 480, cy: 177 },
  "Netherlands": { path: "M495,125 L510,125 510,135 495,135Z", cx: 502, cy: 130 },
  "United Kingdom": { path: "M465,115 L490,115 490,145 465,145Z", cx: 477, cy: 130 },
  "Switzerland": { path: "M500,155 L515,155 515,165 500,165Z", cx: 507, cy: 160 },
  "Norway": { path: "M500,85 L520,85 520,120 500,120Z", cx: 510, cy: 102 },
  "United States": { path: "M100,140 L260,140 260,210 100,210Z", cx: 180, cy: 175 },
  "Canada": { path: "M100,80 L280,80 280,140 100,140Z", cx: 190, cy: 110 },
  "Brazil": { path: "M220,260 L310,260 310,350 220,350Z", cx: 265, cy: 305 },
  "Mexico": { path: "M100,210 L180,210 180,250 100,250Z", cx: 140, cy: 230 },
  "China": { path: "M680,140 L780,140 780,210 680,210Z", cx: 730, cy: 175 },
  "Japan": { path: "M790,155 L820,155 820,190 790,190Z", cx: 805, cy: 172 },
  "South Korea": { path: "M780,165 L800,165 800,185 780,185Z", cx: 790, cy: 175 },
  "India": { path: "M650,190 L710,190 710,270 650,270Z", cx: 680, cy: 230 },
  "Singapore": { path: "M720,260 L735,260 735,270 720,270Z", cx: 727, cy: 265 },
  "Australia": { path: "M740,310 L840,310 840,380 740,380Z", cx: 790, cy: 345 },
  "New Zealand": { path: "M850,360 L875,360 875,390 850,390Z", cx: 862, cy: 375 },
  "UAE": { path: "M610,210 L635,210 635,225 610,225Z", cx: 622, cy: 217 },
  "Saudi Arabia": { path: "M580,200 L620,200 620,235 580,235Z", cx: 600, cy: 217 },
  "Israel": { path: "M560,185 L575,185 575,205 560,205Z", cx: 567, cy: 195 },
  "South Africa": { path: "M530,330 L580,330 580,375 530,375Z", cx: 555, cy: 352 },
  "Kenya": { path: "M570,270 L590,270 590,295 570,295Z", cx: 580, cy: 282 },
  "Nigeria": { path: "M490,250 L520,250 520,275 490,275Z", cx: 505, cy: 262 },
};

const statusColors: Record<RegStatus, string> = {
  enforced: "hsl(142, 76%, 36%)",
  enacted: "hsl(43, 85%, 52%)",
  proposed: "hsl(38, 92%, 50%)",
  draft: "hsl(240, 5%, 46%)",
  none: "hsl(0, 84%, 60%)",
};

const statusFills: Record<RegStatus, string> = {
  enforced: "hsl(142, 76%, 36%, 0.25)",
  enacted: "hsl(43, 85%, 52%, 0.25)",
  proposed: "hsl(38, 92%, 50%, 0.15)",
  draft: "hsl(240, 5%, 46%, 0.1)",
  none: "hsl(0, 84%, 60%, 0.1)",
};

const RegulationMap = ({ regulations, onCountryClick }: RegulationMapProps) => {
  const statusMap = useMemo(() => {
    const map: Record<string, RegStatus> = {};
    regulations.forEach((r) => { map[r.country] = r.status; });
    return map;
  }, [regulations]);

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 overflow-hidden">
      <svg viewBox="60 60 840 360" className="w-full h-auto" style={{ maxHeight: 400 }}>
        {/* Background */}
        <rect x="60" y="60" width="840" height="360" fill="transparent" />

        {/* Country regions */}
        {Object.entries(countryPaths).map(([country, { path, cx, cy }]) => {
          const status = statusMap[country] || "none";
          return (
            <g
              key={country}
              onClick={() => onCountryClick?.(country)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <path
                d={path}
                fill={statusFills[status]}
                stroke={statusColors[status]}
                strokeWidth="1.5"
                rx="3"
                className="transition-all duration-200 hover:opacity-80"
              />
              <circle cx={cx} cy={cy} r="4" fill={statusColors[status]} className="transition-all duration-200" />
              <text
                x={cx}
                y={cy - 8}
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize="7"
                fontWeight="600"
                fontFamily="system-ui"
                className="pointer-events-none select-none"
              >
                {country.length > 12 ? country.slice(0, 10) + "…" : country}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        {(["enforced", "enacted", "proposed", "draft"] as RegStatus[]).map((s, i) => (
          <g key={s} transform={`translate(${80 + i * 120}, 395)`}>
            <circle cx="0" cy="0" r="4" fill={statusColors[s]} />
            <text x="8" y="3" fill="hsl(var(--muted-foreground))" fontSize="8" fontFamily="system-ui">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default RegulationMap;
