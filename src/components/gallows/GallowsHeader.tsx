const GallowsHeader = () => {
  return (
    <header className="border-b border-gallows-border px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-mono tracking-wider animate-gallows-pulse text-gallows-text">
          APEX DIGITAL GALLOWS
        </h1>
        <p className="text-sm font-mono text-gallows-muted mt-1">
          Sovereign AI Compliance Gateway — EU AI Act Enforcement Layer
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gallows-approved opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gallows-approved" />
        </span>
        <span className="text-xs font-mono text-gallows-approved">SYSTEM ACTIVE</span>
      </div>
    </header>
  );
};

export default GallowsHeader;
