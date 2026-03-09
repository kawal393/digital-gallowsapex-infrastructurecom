import { useEffect, useState } from "react";

interface LatticeNode {
  id: string;
  status: string;
}

export default function LatticeConnections({ nodes }: { nodes: LatticeNode[] }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  const allOnline = nodes.length >= 2 && nodes.every((n) => n.status === "online");
  const lineColor = allOnline ? "hsl(var(--compliant))" : "hsl(var(--warning))";

  return (
    <div className="absolute inset-0 z-0 hidden md:block pointer-events-none" aria-hidden>
      <svg className="w-full h-full" viewBox="0 0 900 200" preserveAspectRatio="xMidYMid meet">
        {/* Lines between nodes: left-center, center-right, left-right */}
        {[
          { x1: 150, y1: 100, x2: 450, y2: 100 },
          { x1: 450, y1: 100, x2: 750, y2: 100 },
          { x1: 150, y1: 100, x2: 750, y2: 100 },
        ].map((line, i) => (
          <line
            key={i}
            {...line}
            stroke={lineColor}
            strokeWidth={1.5}
            strokeDasharray="8 4"
            opacity={pulse ? 0.6 : 0.25}
            style={{ transition: "opacity 1s ease" }}
          />
        ))}
        {/* Center glow */}
        {allOnline && (
          <circle
            cx={450} cy={100} r={pulse ? 8 : 5}
            fill={lineColor}
            opacity={pulse ? 0.5 : 0.2}
            style={{ transition: "all 1s ease" }}
          />
        )}
      </svg>
    </div>
  );
}
