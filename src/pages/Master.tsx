import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Shield, Activity, ArrowLeft, RefreshCw, Eye, EyeOff,
  DollarSign, AlertTriangle, Users, Zap, Heart, Mountain,
  Pill, Brain, Power, PowerOff, Plus, UserPlus, Globe
} from "lucide-react";
import apexLogo from "@/assets/apex-logo.png";
import { toast } from "sonner";

const SILO_ICONS: Record<string, any> = { Heart, Mountain, Pill, Brain, Shield };

const Master = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [data, setData] = useState<any>(null);
  const [assignUserId, setAssignUserId] = useState("");
  const [assignSiloId, setAssignSiloId] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("master-data");
      if (error) {
        const body = error.context ? await error.context.json?.() : null;
        if (body?.error?.includes("Forbidden") || body?.error?.includes("Master")) {
          setForbidden(true);
          setLoading(false);
          return;
        }
        throw error;
      }
      if (result?.error?.includes("Forbidden")) { setForbidden(true); setLoading(false); return; }
      setData(result);
    } catch (e: any) {
      toast.error(e.message || "Failed to load master data");
      setForbidden(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [user]);

  const invokeAction = async (action: string, payload: any) => {
    try {
      const { data: result, error } = await supabase.functions.invoke("master-data", {
        body: { action, ...payload },
      });
      if (error) throw error;
      toast.success("Action completed");
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "Action failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-2">SOVEREIGN ACCESS DENIED</h2>
            <p className="text-sm text-muted-foreground mb-4">Master-level clearance required.</p>
            <Button variant="hero" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = data?.global_stats;
  const silos = data?.silos || [];
  const partners = data?.partners || [];
  const revenue = data?.revenue || [];
  const killLogs = data?.kill_logs || [];
  const users = data?.users || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto max-w-7xl flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <img src={apexLogo} alt="APEX" className="h-7 w-7 glow-gold" />
              <span className="font-bold text-gold-gradient text-sm">APEX</span>
            </a>
            <Badge variant="outline" className="text-xs border-gold text-gold font-mono">
              MASTER VIEW
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Admin
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gold-gradient">Sovereign Command Center</h1>
            <p className="text-xs text-muted-foreground mt-1">Global Operational Map — All Sectors</p>
          </div>
          <Globe className="h-8 w-8 text-gold opacity-60" />
        </div>

        {/* Global Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Card className="border-border">
              <CardContent className="pt-4 pb-3 text-center">
                <Users className="h-4 w-4 text-primary mx-auto mb-1" />
                <div className="text-xl font-bold text-foreground">{stats.total_users}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Users</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-4 pb-3 text-center">
                <Shield className="h-4 w-4 text-gold mx-auto mb-1" />
                <div className="text-xl font-bold text-foreground">{stats.total_silos}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Active Silos</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-4 pb-3 text-center">
                <DollarSign className="h-4 w-4 text-compliant mx-auto mb-1" />
                <div className="text-xl font-bold text-foreground">${stats.total_revenue?.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Revenue</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-4 pb-3 text-center">
                <DollarSign className="h-4 w-4 text-gold mx-auto mb-1" />
                <div className="text-xl font-bold text-gold">${stats.master_share?.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Master Share</div>
              </CardContent>
            </Card>
            <Card className={`border-border ${stats.active_kills > 0 ? "border-destructive" : ""}`}>
              <CardContent className="pt-4 pb-3 text-center">
                <AlertTriangle className={`h-4 w-4 mx-auto mb-1 ${stats.active_kills > 0 ? "text-destructive" : "text-muted-foreground"}`} />
                <div className={`text-xl font-bold ${stats.active_kills > 0 ? "text-destructive" : "text-foreground"}`}>{stats.active_kills}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Kill Switches</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Silo Cards — The Operational Map */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Industry Silos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {silos.map((silo: any) => {
              const IconComp = SILO_ICONS[silo.icon] || Shield;
              return (
                <Card key={silo.id} className={`border-border relative overflow-hidden ${silo.is_halted ? "border-destructive" : ""}`}>
                  {silo.is_halted && (
                    <div className="absolute inset-0 bg-destructive/10 z-10 flex items-center justify-center">
                      <Badge className="bg-destructive text-destructive-foreground text-xs animate-pulse">
                        <PowerOff className="h-3 w-3 mr-1" /> HALTED
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${silo.color}20` }}>
                          <IconComp className="h-4 w-4" style={{ color: silo.color }} />
                        </div>
                        <CardTitle className="text-sm">{silo.display_name}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-[10px]">{silo.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{silo.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div>
                        <div className="text-sm font-bold text-foreground">{silo.record_count}</div>
                        <div className="text-[9px] text-muted-foreground">Records</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">{silo.partner_count}</div>
                        <div className="text-[9px] text-muted-foreground">Partners</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold" style={{ color: silo.color }}>${silo.total_revenue?.toLocaleString()}</div>
                      <div className="text-[9px] text-muted-foreground">Revenue</div>
                    </div>
                    <div className="flex gap-1">
                      {!silo.is_halted ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1 text-[10px] h-7"
                          onClick={() => invokeAction("trigger_kill_switch", {
                            silo_id: silo.id,
                            reason: "Master-initiated compliance halt",
                            severity: "critical"
                          })}
                        >
                          <PowerOff className="h-3 w-3 mr-1" /> Kill Switch
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-[10px] h-7 border-compliant text-compliant"
                          onClick={() => {
                            const activeKill = killLogs.find((k: any) => k.silo_id === silo.id && !k.resolved_at);
                            if (activeKill) invokeAction("resolve_kill_switch", { kill_switch_id: activeKill.id, silo_id: silo.id });
                          }}
                        >
                          <Power className="h-3 w-3 mr-1" /> Restore
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tabs: Partners, Revenue, Kill Switch Log */}
        <Tabs defaultValue="partners" className="w-full">
          <TabsList className="mb-4 bg-muted">
            <TabsTrigger value="partners" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-3.5 w-3.5 mr-1.5" /> Partners
            </TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <DollarSign className="h-3.5 w-3.5 mr-1.5" /> Revenue Ledger
            </TabsTrigger>
            <TabsTrigger value="kills" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5" /> Kill Switch Log
            </TabsTrigger>
          </TabsList>

          {/* Partners Tab */}
          <TabsContent value="partners">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Partner Access Control</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Assign Partner */}
                <div className="flex flex-col sm:flex-row gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                  <Select value={assignUserId} onValueChange={setAssignUserId}>
                    <SelectTrigger className="flex-1 text-xs">
                      <SelectValue placeholder="Select User" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u: any) => (
                        <SelectItem key={u.id} value={u.id} className="text-xs">{u.email}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={assignSiloId} onValueChange={setAssignSiloId}>
                    <SelectTrigger className="flex-1 text-xs">
                      <SelectValue placeholder="Select Silo" />
                    </SelectTrigger>
                    <SelectContent>
                      {silos.map((s: any) => (
                        <SelectItem key={s.id} value={s.id} className="text-xs">{s.display_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="hero"
                    className="text-xs"
                    disabled={!assignUserId || !assignSiloId}
                    onClick={() => {
                      invokeAction("assign_partner", { user_id: assignUserId, silo_id: assignSiloId });
                      setAssignUserId("");
                      setAssignSiloId("");
                    }}
                  >
                    <UserPlus className="h-3 w-3 mr-1" /> Assign
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Silo</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-xs font-mono">{p.email}</TableCell>
                        <TableCell>
                          <Badge style={{ backgroundColor: `${p.silo_color}20`, color: p.silo_color }} className="text-[10px]">
                            {p.silo_name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{p.access_level}</TableCell>
                        <TableCell>
                          {p.is_active ? (
                            <Badge className="bg-compliant/20 text-compliant text-[10px]"><Eye className="h-2.5 w-2.5 mr-1" /> Active</Badge>
                          ) : (
                            <Badge className="bg-destructive/20 text-destructive text-[10px]"><EyeOff className="h-2.5 w-2.5 mr-1" /> Revoked</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant={p.is_active ? "destructive" : "outline"}
                            size="sm"
                            className="text-[10px] h-6"
                            onClick={() => invokeAction("toggle_partner_access", { assignment_id: p.id, is_active: !p.is_active })}
                          >
                            {p.is_active ? "Revoke" : "Restore"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {partners.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-8">
                          No partners assigned. Use the panel above to assign a user to a silo.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Ledger Tab */}
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">50/50 Revenue Ledger</CardTitle>
              </CardHeader>
              <CardContent>
                {stats && (
                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div>
                      <div className="text-lg font-bold text-foreground">${stats.total_revenue?.toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground">Total Revenue</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gold">${stats.master_share?.toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground">Master Share</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary">${stats.partner_share?.toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground">Partner Share</div>
                    </div>
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deal</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Master %</TableHead>
                      <TableHead>Partner %</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenue.map((r: any) => (
                      <TableRow key={r.id}>
                        <TableCell className="text-xs font-medium">{r.deal_name}</TableCell>
                        <TableCell className="text-xs font-mono">${Number(r.total_amount).toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-gold">{r.master_share}%</TableCell>
                        <TableCell className="text-xs text-primary">{r.partner_share}%</TableCell>
                        <TableCell>
                          <Badge className={r.status === "paid" ? "bg-compliant/20 text-compliant text-[10px]" : "bg-muted text-muted-foreground text-[10px]"}>
                            {r.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {revenue.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-8">
                          No revenue splits recorded yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kill Switch Log */}
          <TabsContent value="kills">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Kill Switch Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Silo</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Triggered</TableHead>
                      <TableHead>Resolved</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {killLogs.map((k: any) => {
                      const silo = silos.find((s: any) => s.id === k.silo_id);
                      return (
                        <TableRow key={k.id}>
                          <TableCell>
                            <Badge style={{ backgroundColor: `${silo?.color || "#888"}20`, color: silo?.color || "#888" }} className="text-[10px]">
                              {silo?.display_name || "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs max-w-[200px] truncate">{k.reason}</TableCell>
                          <TableCell>
                            <Badge className={k.severity === "critical" ? "bg-destructive/20 text-destructive text-[10px]" : "bg-accent/20 text-accent-foreground text-[10px]"}>
                              {k.severity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">{new Date(k.created_at).toLocaleString()}</TableCell>
                          <TableCell className="text-xs">
                            {k.resolved_at ? new Date(k.resolved_at).toLocaleString() : (
                              <Badge className="bg-destructive/20 text-destructive text-[10px] animate-pulse">ACTIVE</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {killLogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-8">
                          No kill switch events recorded.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Master;
