import { Button } from "@/components/ui/button";
import { Shield, ShieldOff, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GallowsHeaderProps {
  paused: boolean;
  onTogglePause: () => void;
}

const GallowsHeader = ({ paused, onTogglePause }: GallowsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-gallows-border px-4 md:px-6 py-4 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="text-gallows-muted hover:text-gallows-text transition-colors bg-transparent border-none cursor-pointer"
          title="Back to Home"
        >
          <Home className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold font-mono tracking-wider animate-gallows-pulse text-gallows-text">
            APEX DIGITAL GALLOWS
          </h1>
          <p className="text-xs md:text-sm font-mono text-gallows-muted mt-0.5">
            Sovereign AI Compliance Gateway — EU AI Act Enforcement Layer
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Sovereign Pause / Kill Switch — Art. 14 */}
        <Button
          onClick={onTogglePause}
          className={`font-mono text-xs tracking-wider gap-2 border transition-all ${
            paused
              ? 'bg-gallows-blocked/20 border-gallows-blocked/60 text-gallows-blocked hover:bg-gallows-blocked/30'
              : 'bg-gallows-bg border-gallows-approved/40 text-gallows-approved hover:bg-gallows-approved/10'
          }`}
          variant="outline"
          size="sm"
        >
          {paused ? (
            <>
              <ShieldOff className="h-3.5 w-3.5" />
              SYSTEM PAUSED — CLICK TO RESUME
            </>
          ) : (
            <>
              <Shield className="h-3.5 w-3.5" />
              SOVEREIGN PAUSE (Art. 14)
            </>
          )}
        </Button>

        {/* System Status */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${paused ? 'bg-gallows-blocked' : 'bg-gallows-approved'}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${paused ? 'bg-gallows-blocked' : 'bg-gallows-approved'}`} />
          </span>
          <span className={`text-xs font-mono ${paused ? 'text-gallows-blocked' : 'text-gallows-approved'}`}>
            {paused ? 'HALTED' : 'ACTIVE'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default GallowsHeader;
