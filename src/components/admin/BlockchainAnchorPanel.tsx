import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Anchor, ExternalLink, RefreshCw, CheckCircle, Hash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function BlockchainAnchorPanel() {
  const [anchors, setAnchors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchoring, setAnchoring] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/blockchain-anchor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ action: "history" }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setAnchors(data.anchors || []);
      }
    } catch (e) {
      console.error("Failed to fetch anchors:", e);
    } finally {
      setLoading(false);
    }
  };

  const anchorNow = async () => {
    setAnchoring(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/blockchain-anchor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ action: "anchor" }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.success) {
          toast.success(`Anchored ${data.anchor.entries_count} entries to ${data.anchor.chain}`);
          fetchHistory();
        } else {
          toast.info(data.message || "Nothing to anchor");
        }
      }
    } catch (e: any) {
      toast.error("Anchor failed: " + e.message);
    } finally {
      setAnchoring(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Anchor className="h-4 w-4 text-primary" />
            <CardTitle className="text-xs sm:text-sm">Blockchain Anchors</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={fetchHistory} className="h-7 w-7 p-0">
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button size="sm" onClick={anchorNow} disabled={anchoring} className="h-7 text-xs px-2">
              <Anchor className="h-3 w-3 mr-1" /> {anchoring ? "Anchoring..." : "Anchor Now"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : anchors.length === 0 ? (
          <div className="text-center py-6">
            <Anchor className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-40" />
            <p className="text-xs text-muted-foreground">No blockchain anchors yet</p>
            <p className="text-[10px] text-muted-foreground mt-1">Click "Anchor Now" to write Merkle roots to chain</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {anchors.map((a, i) => (
              <div key={i} className="bg-muted/30 rounded-lg p-2.5 border border-border">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-semibold text-foreground">{a.chain}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px]">{a.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                  <div>
                    <Hash className="h-2.5 w-2.5 inline mr-0.5" />
                    Block: {a.block_number?.toLocaleString()}
                  </div>
                  <div>Entries: {a.entries_count}</div>
                  <div>Gas: {a.gas_used?.toLocaleString()}</div>
                  <div>{new Date(a.anchored_at).toLocaleDateString()}</div>
                </div>
                <div className="mt-1.5 flex items-center gap-1">
                  <code className="text-[8px] font-mono text-primary/70 truncate flex-1">{a.tx_id}</code>
                  <a href={a.explorer_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
