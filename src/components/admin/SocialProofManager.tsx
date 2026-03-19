import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Plus, RefreshCw, Sparkles, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface SocialProofEntry {
  id: string;
  quote: string;
  author_name: string;
  author_title: string | null;
  author_affiliation: string | null;
  source_url: string | null;
  source_type: string;
  approved: boolean;
  featured: boolean;
  created_at: string;
}

interface HarvestLog {
  id: string;
  started_at: string;
  completed_at: string | null;
  queries_run: number;
  results_found: number;
  entries_qualified: number;
  entries_inserted: number;
  status: string;
  errors: string[] | null;
}

const SocialProofManager = () => {
  const [entries, setEntries] = useState<SocialProofEntry[]>([]);
  const [logs, setLogs] = useState<HarvestLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [harvesting, setHarvesting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    quote: "",
    author_name: "",
    author_title: "",
    author_affiliation: "",
    source_url: "",
    source_type: "linkedin",
  });

  const fetchData = async () => {
    setLoading(true);
    const [proofRes, logRes] = await Promise.all([
      supabase.from("social_proof").select("*").order("created_at", { ascending: false }),
      supabase.from("harvest_log" as any).select("*").order("started_at", { ascending: false }).limit(10),
    ]);
    setEntries((proofRes.data as SocialProofEntry[]) || []);
    setLogs((logRes.data as HarvestLog[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id: string) => {
    const { error } = await supabase.from("social_proof").update({ approved: true }).eq("id", id);
    if (error) { toast.error("Failed to approve"); return; }
    toast.success("Approved");
    setEntries(prev => prev.map(e => e.id === id ? { ...e, approved: true } : e));
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase.from("social_proof").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Removed");
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase.from("social_proof").update({ featured: !current }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    setEntries(prev => prev.map(e => e.id === id ? { ...e, featured: !current } : e));
  };

  const handleAdd = async () => {
    if (!newEntry.quote || !newEntry.author_name) {
      toast.error("Quote and author name required");
      return;
    }
    const { error } = await supabase.from("social_proof").insert({
      ...newEntry,
      approved: true,
      featured: false,
    });
    if (error) { toast.error("Failed to add: " + error.message); return; }
    toast.success("Added & approved");
    setNewEntry({ quote: "", author_name: "", author_title: "", author_affiliation: "", source_url: "", source_type: "linkedin" });
    setShowAddForm(false);
    fetchData();
  };

  const runHarvest = async () => {
    setHarvesting(true);
    try {
      const { data, error } = await supabase.functions.invoke("harvest-social-proof");
      if (error) throw error;
      toast.success(`Harvest complete: ${data?.entries_inserted || 0} new entries`);
      fetchData();
    } catch (e: any) {
      toast.error("Harvest failed: " + (e.message || "Unknown error"));
    } finally {
      setHarvesting(false);
    }
  };

  const pendingCount = entries.filter(e => !e.approved).length;
  const approvedCount = entries.filter(e => e.approved).length;

  if (loading) {
    return <div className="flex justify-center py-12"><div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats & Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="text-xs">Pending: {pendingCount}</Badge>
        <Badge className="bg-compliant/20 text-compliant text-xs">Approved: {approvedCount}</Badge>
        <Badge variant="outline" className="text-xs">Total: {entries.length}</Badge>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-1" /> Manual Add
        </Button>
        <Button variant="hero" size="sm" onClick={runHarvest} disabled={harvesting}>
          {harvesting ? <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
          {harvesting ? "Harvesting…" : "Run Harvest Now"}
        </Button>
      </div>

      {/* Manual Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Add Social Proof Entry</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea placeholder="Quote text…" value={newEntry.quote} onChange={e => setNewEntry(p => ({ ...p, quote: e.target.value }))} className="text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Author name" value={newEntry.author_name} onChange={e => setNewEntry(p => ({ ...p, author_name: e.target.value }))} className="text-sm" />
              <Input placeholder="Title / role" value={newEntry.author_title} onChange={e => setNewEntry(p => ({ ...p, author_title: e.target.value }))} className="text-sm" />
              <Input placeholder="Affiliation / company" value={newEntry.author_affiliation} onChange={e => setNewEntry(p => ({ ...p, author_affiliation: e.target.value }))} className="text-sm" />
              <Input placeholder="Source URL" value={newEntry.source_url} onChange={e => setNewEntry(p => ({ ...p, source_url: e.target.value }))} className="text-sm" />
            </div>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newEntry.source_type} onChange={e => setNewEntry(p => ({ ...p, source_type: e.target.value }))}>
              <option value="linkedin">LinkedIn</option>
              <option value="reddit">Reddit</option>
              <option value="citation">Citation</option>
              <option value="commentary">Commentary</option>
              <option value="blog">Blog</option>
              <option value="ietf">IETF</option>
            </select>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd}>Add & Approve</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Queue */}
      {pendingCount > 0 && (
        <Card className="border-gold/30">
          <CardHeader><CardTitle className="text-sm text-gold">⏳ Pending Approval ({pendingCount})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {entries.filter(e => !e.approved).map(entry => (
                <div key={entry.id} className="border border-border rounded-lg p-3 space-y-2">
                  <p className="text-sm italic text-foreground/90">"{entry.quote}"</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{entry.author_name}</span>
                      {entry.author_title && <> · {entry.author_title}</>}
                      {entry.author_affiliation && <> · {entry.author_affiliation}</>}
                      <Badge variant="outline" className="ml-2 text-[10px]">{entry.source_type}</Badge>
                    </div>
                    <div className="flex gap-1">
                      {entry.source_url && (
                        <a href={entry.source_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm"><ExternalLink className="h-3.5 w-3.5" /></Button>
                        </a>
                      )}
                      <Button size="sm" variant="ghost" className="text-compliant hover:text-compliant" onClick={() => handleApprove(entry.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleReject(entry.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approved Entries */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Approved Entries ({approvedCount})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.filter(e => e.approved).map(entry => (
                <TableRow key={entry.id}>
                  <TableCell className="text-xs max-w-[300px] truncate">{entry.quote}</TableCell>
                  <TableCell className="text-xs">{entry.author_name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{entry.source_type}</Badge></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleToggleFeatured(entry.id, entry.featured)}>
                      <Sparkles className={`h-3.5 w-3.5 ${entry.featured ? "text-gold" : "text-muted-foreground"}`} />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleReject(entry.id)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Harvest Logs */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Harvest Logs</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Queries</TableHead>
                <TableHead>Found</TableHead>
                <TableHead>Qualified</TableHead>
                <TableHead>Inserted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs">{new Date(log.started_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={log.status === "completed" ? "bg-compliant/20 text-compliant" : log.status === "running" ? "bg-primary/20 text-primary" : "bg-gold/20 text-gold"} variant="outline">
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{log.queries_run}</TableCell>
                  <TableCell className="text-xs">{log.results_found}</TableCell>
                  <TableCell className="text-xs">{log.entries_qualified}</TableCell>
                  <TableCell className="text-xs">{log.entries_inserted}</TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-xs text-muted-foreground py-4">No harvests yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialProofManager;
