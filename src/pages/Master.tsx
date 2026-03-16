import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Shield, Activity, ArrowLeft, RefreshCw, Eye, EyeOff,
  DollarSign, AlertTriangle, Users, Zap, Heart, Mountain,
  Pill, Brain, Power, PowerOff, Plus, UserPlus, Globe, Factory, Landmark, Crosshair
} from "lucide-react";
import apexLogo from "@/assets/apex-logo.png";
import { toast } from "sonner";

const SILO_ICONS: Record<string, any> = { Heart, Mountain, Pill, Brain, Shield, Factory, Landmark, Crosshair };
const ICON_OPTIONS = ["Shield", "Heart", "Mountain", "Pill", "Brain", "Factory", "Landmark", "Crosshair"];
const COLOR_OPTIONS = ["#D4AF37", "#E74C3C", "#3498DB", "#2ECC71", "#9B59B6", "#E67E22", "#1ABC9C", "#95A5A6"];

const Master = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [data, setData] = useState<any>(null);
  const [assignUserId, setAssignUserId] = useState("");
  const [assignSiloId, setAssignSiloId] = useState("");

  // Add Industry form
  const [newSiloName, setNewSiloName] = useState("");
  const [newSiloDisplay, setNewSiloDisplay] = useState("");
  const [newSiloDesc, setNewSiloDesc] = useState("");
  const [newSiloColor, setNewSiloColor] = useState("#D4AF37");
  const [newSiloIcon, setNewSiloIcon] = useState("Shield");
  const [showAddIndustry, setShowAddIndustry] = useState(false);

  // Add Revenue form
  const [revSiloId, setRevSiloId] = useState("");
  const [revPartnerId, setRevPartnerId] = useState("");
  const [revDealName, setRevDealName] = useState("");
  const [revAmount, setRevAmount] = useState("");
  const [revMasterShare, setRevMasterShare] = useState("50");
  const [revPartnerShare, setRevPartnerShare] = useState("50");
  const [showAddRevenue, setShowAddRevenue] = useState(false);

  // Add Silo Data form
  const [dataSiloId, setDataSiloId] = useState("");
  const [dataTitle, setDataTitle] = useState("");
  const [dataType, setDataType] = useState("");
  const [dataDesc, setDataDesc] = useState("");
  const [dataScore, setDataScore] = useState("75");
  const [showAddData, setShowAddData] = useState(false);

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

  const runAutoMonitor = async () => {
    try {
      toast.info("Running auto-monitor scan...");
      const { data: result, error } = await supabase.functions.invoke("silo-auto-monitor", { body: { threshold: 40 } });
      if (error) throw error;
      const triggered = result?.kill_switches_triggered || 0;
      if (triggered > 0) {
        toast.warning(`Auto-monitor triggered ${triggered} Protocol Intervention(s)!`);
      } else {
        toast.success(`All ${result?.silos_scanned || 0} silos passed compliance check`);
      }
      fetchData();
    } catch (e: any) {
      toast.error("Auto-monitor failed: " + (e.message || "Unknown error"));
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
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
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
        <div className="container mx-auto max-w-7xl flex items-center justify-between h-14 px-3 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <img src={apexLogo} alt="APEX" className="h-6 w-6 sm:h-7 sm:w-7 glow-gold" />
              <span className="font-bold text-gold-gradient text-xs sm:text-sm">APEX</span>
            </Link>
            <Badge variant="outline" className="text-[9px] sm:text-xs border-primary text-primary font-mono">
              MASTER VIEW
            </Badge>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" onClick={() => runAutoMonitor()} className="h-8 px-2 sm:px-3 text-[10px] sm:text-xs text-primary">
              <Zap className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline">Auto-Monitor</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={fetchData} className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline ml-1 text-xs">Refresh</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} className="h-8 px-2 sm:px-3 text-xs">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Admin</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-primary">Sovereign Command Center</h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Global Operational Map — All Sectors</p>
          </div>
          <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-primary opacity-60" />
        </div>

        {/* Global Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
            {[
              { icon: Users, value: stats.total_users, label: "Total Users", color: "text-primary" },
              { icon: Shield, value: stats.total_silos, label: "Active Silos", color: "text-primary" },
              { icon: DollarSign, value: `$${stats.total_revenue?.toLocaleString()}`, label: "Total Revenue", color: "text-primary" },
              { icon: DollarSign, value: `$${stats.master_share?.toLocaleString()}`, label: "Master Share", color: "text-primary" },
              { icon: AlertTriangle, value: stats.active_kills, label: "Active PILs", color: stats.active_kills > 0 ? "text-destructive" : "text-muted-foreground" },
            ].map((s, i) => (
              <Card key={i} className={`border-border ${i === 4 && stats.active_kills > 0 ? "border-destructive" : ""}`}>
                <CardContent className="pt-3 pb-2 sm:pt-4 sm:pb-3 text-center">
                  <s.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 mx-auto mb-1 ${s.color}`} />
                  <div className={`text-base sm:text-xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-[8px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Silo Cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Industry Silos</h2>
            <Dialog open={showAddIndustry} onOpenChange={setShowAddIndustry}>
              <DialogTrigger asChild>
                <Button size="sm" className="text-xs"><Plus className="h-3 w-3 mr-1" /> Add Industry</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add New Industry Silo</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <Input placeholder="Slug (e.g. banking)" value={newSiloName} onChange={e => setNewSiloName(e.target.value)} />
                  <Input placeholder="Display Name (e.g. Banking & Finance)" value={newSiloDisplay} onChange={e => setNewSiloDisplay(e.target.value)} />
                  <Input placeholder="Description" value={newSiloDesc} onChange={e => setNewSiloDesc(e.target.value)} />
                  <div className="flex gap-2">
                    <Select value={newSiloIcon} onValueChange={setNewSiloIcon}>
                      <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map(ic => <SelectItem key={ic} value={ic}>{ic}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={newSiloColor} onValueChange={setNewSiloColor}>
                      <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {COLOR_OPTIONS.map(c => (
                          <SelectItem key={c} value={c}>
                            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: c }} />{c}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full"
                    disabled={!newSiloName || !newSiloDisplay}
                    onClick={() => {
                      invokeAction("add_industry", { name: newSiloName, display_name: newSiloDisplay, description: newSiloDesc, color: newSiloColor, icon: newSiloIcon });
                      setNewSiloName(""); setNewSiloDisplay(""); setNewSiloDesc(""); setShowAddIndustry(false);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Create Silo
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-sm font-bold text-foreground">{silo.record_count}</div>
                        <div className="text-[9px] text-muted-foreground">Records</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">{silo.partner_count}</div>
                        <div className="text-[9px] text-muted-foreground">Partners</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">{silo.avg_compliance_score}%</div>
                        <div className="text-[9px] text-muted-foreground">Score</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold" style={{ color: silo.color }}>${silo.total_revenue?.toLocaleString()}</div>
                      <div className="text-[9px] text-muted-foreground">Revenue</div>
                    </div>
                    {/* Compliance gauge */}
                    <Progress value={silo.avg_compliance_score} className="h-1.5" />
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
                          className="flex-1 text-[10px] h-7"
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

        {/* Tabs */}
        <Tabs defaultValue="partners" className="w-full">
          <TabsList className="mb-3 sm:mb-4 bg-muted w-full sm:w-auto flex-wrap">
            <TabsTrigger value="partners" className="text-[10px] sm:text-xs flex-1 sm:flex-none"><Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" /> Partners</TabsTrigger>
            <TabsTrigger value="revenue" className="text-[10px] sm:text-xs flex-1 sm:flex-none"><DollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" /> Revenue</TabsTrigger>
            <TabsTrigger value="data" className="text-[10px] sm:text-xs flex-1 sm:flex-none"><Activity className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" /> Data</TabsTrigger>
            <TabsTrigger value="kills" className="text-[10px] sm:text-xs flex-1 sm:flex-none"><AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" /> Kills</TabsTrigger>
          </TabsList>

          {/* Partners Tab */}
          <TabsContent value="partners">
            <Card>
              <CardHeader><CardTitle className="text-base">Partner Access Control</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                  <Select value={assignUserId} onValueChange={setAssignUserId}>
                    <SelectTrigger className="flex-1 text-xs"><SelectValue placeholder="Select User" /></SelectTrigger>
                    <SelectContent>
                      {users.map((u: any) => <SelectItem key={u.id} value={u.id} className="text-xs">{u.email}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={assignSiloId} onValueChange={setAssignSiloId}>
                    <SelectTrigger className="flex-1 text-xs"><SelectValue placeholder="Select Silo" /></SelectTrigger>
                    <SelectContent>
                      {silos.map((s: any) => <SelectItem key={s.id} value={s.id} className="text-xs">{s.display_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button size="sm" className="text-xs" disabled={!assignUserId || !assignSiloId} onClick={() => {
                    invokeAction("assign_partner", { user_id: assignUserId, silo_id: assignSiloId });
                    setAssignUserId(""); setAssignSiloId("");
                  }}>
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
                          <Badge style={{ backgroundColor: `${p.silo_color}20`, color: p.silo_color }} className="text-[10px]">{p.silo_name}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">{p.access_level}</TableCell>
                        <TableCell>
                          {p.is_active ? (
                            <Badge className="bg-primary/20 text-primary text-[10px]"><Eye className="h-2.5 w-2.5 mr-1" /> Active</Badge>
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
                      <TableRow><TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-8">No partners assigned.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">50/50 Revenue Ledger</CardTitle>
                  <Dialog open={showAddRevenue} onOpenChange={setShowAddRevenue}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="text-xs"><Plus className="h-3 w-3 mr-1" /> Add Deal</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Record Revenue Split</DialogTitle></DialogHeader>
                      <div className="space-y-3">
                        <Input placeholder="Deal Name" value={revDealName} onChange={e => setRevDealName(e.target.value)} />
                        <Input placeholder="Total Amount" type="number" value={revAmount} onChange={e => setRevAmount(e.target.value)} />
                        <Select value={revSiloId} onValueChange={setRevSiloId}>
                          <SelectTrigger><SelectValue placeholder="Select Silo" /></SelectTrigger>
                          <SelectContent>{silos.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.display_name}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={revPartnerId} onValueChange={setRevPartnerId}>
                          <SelectTrigger><SelectValue placeholder="Select Partner" /></SelectTrigger>
                          <SelectContent>{users.map((u: any) => <SelectItem key={u.id} value={u.id}>{u.email}</SelectItem>)}</SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Input placeholder="Master %" type="number" value={revMasterShare} onChange={e => { setRevMasterShare(e.target.value); setRevPartnerShare(String(100 - Number(e.target.value))); }} />
                          <Input placeholder="Partner %" type="number" value={revPartnerShare} disabled />
                        </div>
                        <Button className="w-full" disabled={!revDealName || !revAmount || !revSiloId || !revPartnerId} onClick={() => {
                          invokeAction("add_revenue_split", { silo_id: revSiloId, partner_user_id: revPartnerId, deal_name: revDealName, total_amount: Number(revAmount), master_share: Number(revMasterShare), partner_share: Number(revPartnerShare) });
                          setRevDealName(""); setRevAmount(""); setRevSiloId(""); setRevPartnerId(""); setShowAddRevenue(false);
                        }}>
                          <Plus className="h-4 w-4 mr-1" /> Record Deal
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {stats && (
                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div>
                      <div className="text-lg font-bold text-foreground">${stats.total_revenue?.toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground">Total Revenue</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary">${stats.master_share?.toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground">Master Share</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-foreground">${stats.partner_share?.toLocaleString()}</div>
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
                        <TableCell className="text-xs text-primary">{r.master_share}%</TableCell>
                        <TableCell className="text-xs">{r.partner_share}%</TableCell>
                        <TableCell>
                          <Badge className={r.status === "paid" ? "bg-primary/20 text-primary text-[10px]" : "bg-muted text-muted-foreground text-[10px]"}>{r.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {revenue.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-8">No revenue splits recorded.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Silo Data Tab */}
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Silo Records</CardTitle>
                  <Dialog open={showAddData} onOpenChange={setShowAddData}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="text-xs"><Plus className="h-3 w-3 mr-1" /> Add Record</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Add Silo Record</DialogTitle></DialogHeader>
                      <div className="space-y-3">
                        <Select value={dataSiloId} onValueChange={setDataSiloId}>
                          <SelectTrigger><SelectValue placeholder="Select Silo" /></SelectTrigger>
                          <SelectContent>{silos.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.display_name}</SelectItem>)}</SelectContent>
                        </Select>
                        <Input placeholder="Title" value={dataTitle} onChange={e => setDataTitle(e.target.value)} />
                        <Input placeholder="Record Type (e.g. audit, report)" value={dataType} onChange={e => setDataType(e.target.value)} />
                        <Input placeholder="Description" value={dataDesc} onChange={e => setDataDesc(e.target.value)} />
                        <Input placeholder="Compliance Score (0-100)" type="number" value={dataScore} onChange={e => setDataScore(e.target.value)} />
                        <Button className="w-full" disabled={!dataSiloId || !dataTitle || !dataType} onClick={() => {
                          invokeAction("add_silo_data", { silo_id: dataSiloId, title: dataTitle, record_type: dataType, description: dataDesc, compliance_score: Number(dataScore) });
                          setDataTitle(""); setDataType(""); setDataDesc(""); setShowAddData(false);
                        }}>
                          <Plus className="h-4 w-4 mr-1" /> Add Record
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Silo</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(data?.silo_data || []).slice(0, 50).map((d: any) => {
                      const silo = silos.find((s: any) => s.id === d.silo_id);
                      return (
                        <TableRow key={d.id}>
                          <TableCell className="text-xs font-medium">{d.title}</TableCell>
                          <TableCell>
                            <Badge style={{ backgroundColor: `${silo?.color || "#888"}20`, color: silo?.color || "#888" }} className="text-[10px]">{silo?.display_name || "?"}</Badge>
                          </TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{d.record_type}</Badge></TableCell>
                          <TableCell className="text-xs">{d.compliance_score}%</TableCell>
                          <TableCell>
                            <Badge className={d.status === "active" ? "bg-primary/20 text-primary text-[10px]" : d.status === "halted" ? "bg-destructive/20 text-destructive text-[10px]" : "bg-muted text-muted-foreground text-[10px]"}>
                              {d.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {(data?.silo_data || []).length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-8">No silo records.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kill Switch Log */}
          <TabsContent value="kills">
            <Card>
              <CardHeader><CardTitle className="text-base">Kill Switch Audit Trail</CardTitle></CardHeader>
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
                            <Badge style={{ backgroundColor: `${silo?.color || "#888"}20`, color: silo?.color || "#888" }} className="text-[10px]">{silo?.display_name || "?"}</Badge>
                          </TableCell>
                          <TableCell className="text-xs max-w-[200px] truncate">{k.reason}</TableCell>
                          <TableCell>
                            <Badge className={k.severity === "critical" ? "bg-destructive/20 text-destructive text-[10px]" : "bg-accent/20 text-accent-foreground text-[10px]"}>{k.severity}</Badge>
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
                      <TableRow><TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-8">No kill switch events.</TableCell></TableRow>
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
