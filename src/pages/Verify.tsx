import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, ShieldCheck, ShieldX, Hash, Clock, AlertTriangle, Copy, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

interface VerificationResult {
  verified: boolean;
  found: boolean;
  merkle_verified?: boolean;
  commit_id?: string;
  predicate_id?: string;
  phase?: string;
  status?: string;
  merkle_root?: string;
  action_summary?: string;
  created_at?: string;
  challenged_at?: string;
  proven_at?: string;
  verification_time_ms?: number;
  violation_found?: string;
  queried_hash: string;
  queried_at: string;
  engine: string;
  algorithm?: string;
  eu_ai_act_compliance?: boolean;
  message?: string;
}

const VERIFY_URL = `https://qhtntebpcribjiwrdtdd.supabase.co/functions/v1/verify-hash`;

const Verify = () => {
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [searched, setSearched] = useState(false);

  const handleVerify = async () => {
    if (!hash.trim()) {
      toast.error("Please enter a hash to verify");
      return;
    }
    setLoading(true);
    setResult(null);
    setSearched(true);
    try {
      const res = await fetch(VERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash: hash.trim() }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      toast.error("Verification request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20 pb-16">
        {/* Hero */}
        <section className="relative py-16 sm:py-24 px-4 grid-bg overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, hsl(43 85% 52% / 0.06) 0%, transparent 60%)" }}
          />
          <div className="container mx-auto max-w-3xl relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge variant="outline" className="border-gold/30 text-gold mb-4">
                PUBLIC VERIFICATION PORTAL
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                <span className="text-chrome-gradient">Verify Any</span>{" "}
                <span className="text-gold-gradient">Hash</span>
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Independently verify any SHA-256 hash against the APEX immutable ledger.
                No account required. Full transparency.
              </p>

              {/* Search Box */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={hash}
                    onChange={(e) => setHash(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                    placeholder="Enter SHA-256 hash to verify..."
                    className="pl-9 h-12 bg-card border-border text-foreground font-mono text-sm placeholder:text-muted-foreground"
                  />
                </div>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleVerify}
                  disabled={loading}
                  className="h-12 px-6 shrink-0"
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Verify
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Results */}
        <section className="px-4 -mt-8">
          <div className="container mx-auto max-w-3xl">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-8 text-center"
                >
                  <div className="h-8 w-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-mono">Querying immutable ledger...</p>
                </motion.div>
              )}

              {!loading && result && result.found && (
                <motion.div
                  key="found"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-compliant/30 bg-card/80 backdrop-blur-sm overflow-hidden"
                >
                  {/* Status Header */}
                  <div className="border-b border-border px-6 py-4 flex items-center justify-between flex-wrap gap-3"
                    style={{ background: "linear-gradient(135deg, hsl(142 76% 36% / 0.08), transparent)" }}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-6 w-6 text-compliant" />
                      <div>
                        <p className="font-black text-compliant text-sm">HASH VERIFIED</p>
                        <p className="text-xs text-muted-foreground">Found in APEX immutable ledger</p>
                      </div>
                    </div>
                    <Badge className="bg-compliant/10 text-compliant border-compliant/30">
                      {result.phase}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="px-6 py-5 space-y-3">
                    {[
                      { label: "Commit ID", value: result.commit_id },
                      { label: "Predicate", value: result.predicate_id },
                      { label: "Phase", value: result.phase },
                      { label: "Status", value: result.status },
                      { label: "Merkle Root", value: result.merkle_root, mono: true },
                      { label: "Action", value: result.action_summary },
                      { label: "Created", value: result.created_at ? new Date(result.created_at).toLocaleString() : null },
                      { label: "Challenged", value: result.challenged_at ? new Date(result.challenged_at).toLocaleString() : "No challenge" },
                      { label: "Proven", value: result.proven_at ? new Date(result.proven_at).toLocaleString() : "Not yet proven" },
                      { label: "EU AI Act Compliant", value: result.eu_ai_act_compliance ? "YES" : "PENDING" },
                    ].filter(r => r.value).map((row) => (
                      <div key={row.label} className="flex items-start justify-between gap-4 text-sm">
                        <span className="text-muted-foreground shrink-0">{row.label}</span>
                        <span className={`text-foreground text-right ${row.mono ? 'font-mono text-xs' : ''} break-all`}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* API Reference */}
                  <div className="border-t border-border px-6 py-3 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-mono">{result.engine} — {result.algorithm}</span>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                      className="text-xs text-muted-foreground hover:text-gold transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer"
                    >
                      <Copy className="h-3 w-3" /> Copy JSON
                    </button>
                  </div>
                </motion.div>
              )}

              {!loading && result && !result.found && (
                <motion.div
                  key="notfound"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-destructive/30 bg-card/80 backdrop-blur-sm p-8 text-center"
                >
                  <ShieldX className="h-10 w-10 text-destructive mx-auto mb-3" />
                  <p className="font-bold text-destructive mb-2">HASH NOT FOUND</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                    This hash does not exist in the APEX Gallows immutable ledger. It may not have been registered or may be from a different system.
                  </p>
                  <div className="rounded-lg bg-background/60 border border-border p-3 font-mono text-xs text-muted-foreground break-all max-w-lg mx-auto">
                    {result.queried_hash}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* How It Works */}
            {!searched && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12 grid sm:grid-cols-3 gap-6"
              >
                {[
                  { icon: Hash, title: "Paste Hash", desc: "Enter any SHA-256 hash from a compliance certificate or audit trail" },
                  { icon: Search, title: "Query Ledger", desc: "We search across commit, Merkle, proof, and challenge hashes" },
                  { icon: Shield, title: "Get Result", desc: "Instant verification with full provenance chain and Merkle proof status" },
                ].map((s, i) => (
                  <div key={s.title} className="rounded-xl border border-border bg-card/60 p-5 text-center">
                    <div className="mx-auto w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
                      <s.icon className="h-5 w-5 text-gold" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-1">{s.title}</h3>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* API Access */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 rounded-xl border border-border bg-card/60 p-6"
            >
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-gold" />
                API Access
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Verify hashes programmatically. No authentication required.
              </p>
              <div className="space-y-3">
                <div className="rounded-lg bg-background border border-border p-3">
                  <p className="text-[10px] text-muted-foreground font-mono mb-1">GET</p>
                  <code className="text-xs text-gold font-mono break-all">
                    {VERIFY_URL}?hash=YOUR_SHA256_HASH
                  </code>
                </div>
                <div className="rounded-lg bg-background border border-border p-3">
                  <p className="text-[10px] text-muted-foreground font-mono mb-1">POST</p>
                  <code className="text-xs text-gold font-mono break-all">
                    {`curl -X POST ${VERIFY_URL} -H "Content-Type: application/json" -d '{"hash":"YOUR_SHA256_HASH"}'`}
                  </code>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Verify;
