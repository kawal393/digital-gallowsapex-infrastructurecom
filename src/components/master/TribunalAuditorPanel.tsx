import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Shield, UserCheck, Globe, Key, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Auditor {
  id: string;
  auditor_name: string;
  organization: string;
  jurisdiction: string;
  status: string;
  public_key: string | null;
  user_id: string;
  created_at: string;
}

const JURISDICTIONS = ["EU", "Australia", "UK", "US", "Canada", "India", "MENA", "APAC"];
const ROLES = [
  "Privacy Lawyer",
  "EU AI Act Specialist",
  "Cryptographer / Academic",
  "Enterprise CISO",
  "Standards Body Participant",
  "Regulatory Advisor",
  "Independent Auditor",
];

const TribunalAuditorPanel = () => {
  const [auditors, setAuditors] = useState<Auditor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [jurisdiction, setJurisdiction] = useState("EU");
  const [role, setRole] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [userId, setUserId] = useState("");

  const fetchAuditors = async () => {
    const { data, error } = await supabase
      .from("tribunal_auditors")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAuditors(data as Auditor[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAuditors();
  }, []);

  const addAuditor = async () => {
    if (!name || !org || !userId) {
      toast.error("Name, organization, and user ID are required");
      return;
    }

    const { error } = await supabase.from("tribunal_auditors").insert({
      auditor_name: name,
      organization: `${org}${role ? ` — ${role}` : ""}`,
      jurisdiction,
      public_key: publicKey || null,
      user_id: userId,
      status: "active",
    });

    if (error) {
      toast.error("Failed to add auditor: " + error.message);
      return;
    }

    toast.success(`Auditor ${name} appointed to Sovereign Tribunal`);
    setName("");
    setOrg("");
    setRole("");
    setPublicKey("");
    setUserId("");
    setShowAdd(false);
    fetchAuditors();
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    const { error } = await supabase
      .from("tribunal_auditors")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    toast.success(`Auditor ${newStatus === "active" ? "activated" : "suspended"}`);
    fetchAuditors();
  };

  const activeCount = auditors.filter((a) => a.status === "active").length;
  const quorumReady = activeCount >= 3;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Sovereign Tribunal — Auditor Registry
            </CardTitle>
            <p className="text-[10px] text-muted-foreground mt-1">
              5-party human auditor ratification layer · 3-of-5 threshold
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-[10px] ${
                quorumReady
                  ? "border-compliant/30 text-compliant"
                  : "border-destructive/30 text-destructive"
              }`}
            >
              {activeCount}/5 {quorumReady ? "QUORUM READY" : "BELOW QUORUM"}
            </Badge>
            <Dialog open={showAdd} onOpenChange={setShowAdd}>
              <DialogTrigger asChild>
                <Button size="sm" className="text-xs" disabled={activeCount >= 5}>
                  <Plus className="h-3 w-3 mr-1" /> Appoint Auditor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Appoint Tribunal Auditor</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Input
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    placeholder="Organization"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                  />
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Expertise / Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={jurisdiction} onValueChange={setJurisdiction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      {JURISDICTIONS.map((j) => (
                        <SelectItem key={j} value={j}>
                          {j}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="User ID (UUID from auth)"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                  <Textarea
                    placeholder="Ed25519 Public Key (hex, optional)"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    className="font-mono text-xs"
                    rows={2}
                  />
                  <Button
                    className="w-full"
                    disabled={!name || !org || !userId}
                    onClick={addAuditor}
                  >
                    <UserCheck className="h-4 w-4 mr-1" /> Appoint to Tribunal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Composition Guide */}
        <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-2">
            Recommended Composition
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { role: "Privacy Lawyer", region: "Australia" },
              { role: "EU AI Act Specialist", region: "EU" },
              { role: "Cryptographer", region: "Any" },
              { role: "Enterprise CISO", region: "US/UK" },
              { role: "Standards Participant", region: "Any" },
            ].map((r, i) => (
              <div key={i} className="text-center p-2 rounded-lg bg-background border border-border">
                <p className="text-[10px] font-bold text-foreground">{r.role}</p>
                <p className="text-[9px] text-muted-foreground">{r.region}</p>
                {auditors.some(
                  (a) =>
                    a.status === "active" &&
                    a.organization.toLowerCase().includes(r.role.toLowerCase().split(" ")[0])
                ) ? (
                  <Badge className="mt-1 text-[8px] bg-compliant/20 text-compliant">FILLED</Badge>
                ) : (
                  <Badge variant="outline" className="mt-1 text-[8px] border-destructive/30 text-destructive">
                    VACANT
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Auditor Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Auditor</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Jurisdiction</TableHead>
              <TableHead>Public Key</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditors.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="text-xs font-medium">{a.auditor_name}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{a.organization}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">
                    <Globe className="h-2.5 w-2.5 mr-1" />
                    {a.jurisdiction}
                  </Badge>
                </TableCell>
                <TableCell>
                  {a.public_key ? (
                    <Badge className="text-[9px] bg-primary/10 text-primary font-mono">
                      <Key className="h-2.5 w-2.5 mr-1" />
                      {a.public_key.slice(0, 12)}...
                    </Badge>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">Not set</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`text-[10px] ${
                      a.status === "active"
                        ? "bg-compliant/20 text-compliant"
                        : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {a.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant={a.status === "active" ? "destructive" : "outline"}
                    size="sm"
                    className="text-[10px] h-6"
                    onClick={() => toggleStatus(a.id, a.status)}
                  >
                    {a.status === "active" ? "Suspend" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {auditors.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-xs text-muted-foreground py-8">
                  No tribunal auditors appointed. Click "Appoint Auditor" to begin.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TribunalAuditorPanel;
