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
import {
  Shield, ArrowLeft, RefreshCw, Activity, DollarSign,
  Heart, Mountain, Pill, Brain, PowerOff, FileText, AlertTriangle,
  Factory, Landmark, Crosshair, Radio, TrendingUp, TrendingDown
} from "lucide-react";
import apexLogo from "@/assets/apex-logo.png";
import { toast } from "sonner";

const SILO_ICONS: Record<string, any> = { Heart, Mountain, Pill, Brain, Shield, Factory, Landmark, Crosshair };

const SiloDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [silos, setSilos] = useState<any[]>([]);
  const [siloData, setSiloData] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [killLogs, setKillLogs] = useState<any[]>([]);
  const [activeSilo, setActiveSilo] = useState<string | null>(null);
  const [oracleData, setOracleData] = useState<any>(null);
  const [oracleLoading, setOracleLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: assigns } = await supabase
        .from("silo_assignments")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true);

      if (!assigns || assigns.length === 0) {
        setAssignments([]);
        setLoading(false);
        return;
      }
      setAssignments(assigns);
      const siloIds = assigns.map((a) => a.silo_id);

      const [silosRes, dataRes, revRes, killRes] = await Promise.all([
        supabase.from("industry_silos").select("*").in("id", siloIds),
        supabase.from("silo_data").select("*").in("silo_id", siloIds).order("created_at", { ascending: false }),
        supabase.from("revenue_splits").select("*").eq("partner_user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("kill_switch_log").select("*").in("silo_id", siloIds).order("created_at", { ascending: false }).limit(20),
      ]);

      setSilos(silosRes.data || []);
      setSiloData(dataRes.data || []);
      setRevenue(revRes.data || []);
      setKillLogs(killRes.data || []);
      if (!activeSilo && silosRes.data && silosRes.data.length > 0) {
        setActiveSilo(silosRes.data[0].id);
      }
    } catch {
      toast.error("Failed to load silo data");
    } finally {
      setLoading(false);
    }
  }, [user, activeSilo]);

  const fetchOracle = useCallback(async (siloId: string, siloName: string) => {
    setOracleLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("oracle-feed", {
        body: null,
        headers: { "Content-Type": "application/json" },
      });
      // Use query params approach via direct fetch
      const session = await supabase.auth.getSession();
      const token = session.data.session?.accessToken;
      if (token) {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/oracle-feed?silo_id=${siloId}&silo_name=${encodeURIComponent(siloName)}`;
        const res = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        });
        if (res.ok) {
          setOracleData(await res.json());
        }
      }
    } catch {
      console.warn("Oracle feed unavailable");
    } finally {
      setOracleLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [user]);

  useEffect(() => {
    if (activeSilo) {
      const silo = silos.find(s => s.id === activeSilo);
      if (silo) fetchOracle(activeSilo, silo.name);
    }
  }, [activeSilo, silos]);

  // Auto-refresh oracle every 60s
  useEffect(() => {
    if (!activeSilo) return;
    const interval = setInterval(() => {
      const silo = silos.find(s => s.id === activeSilo);
      if (silo) fetchOracle(activeSilo, silo.name);
    }, 60000);
    return () => clearInterval(interval);
  }, [activeSilo, silos]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-2">No Silo Access</h2>
            <p className="text-sm text-muted-foreground mb-4">You have not been assigned to any industry silo. Contact the Master for access.</p>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSilo = silos.find(s => s.id === activeSilo);
  const currentData = siloData.filter(d => d.silo_id === activeSilo);
  const currentKills = killLogs.filter(k => k.silo_id === activeSilo);
  const isHalted = currentKills.some(k => !k.resolved_at);
  const totalEarnings = revenue.reduce((s, r) => s + (Number(r.total_amount) * Number(r.partner_share) / 100), 0);
  const avgScore = currentData.length > 0
    ? Math.round(currentData.reduce((s, d) => s + (Number(d.compliance_score) || 0), 0) / currentData.length)
    : 0;
  const IconComp = currentSilo ? (SILO_ICONS[currentSilo.icon] || Shield) : Shield;

  const severityColor = (s: string) => {
    if (s === "critical") return "text-destructive";
    if (s === "warning") return "text-yellow-500";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto max-w-6xl flex items-center justify-between h-14 px-3 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <img src={apexLogo} alt="APEX" className="h-6 w-6 sm:h-7 sm:w-7 glow-gold" />
              <span className="font-bold text-gold-gradient text-xs sm:text-sm">APEX</span>
            </Link>
            {currentSilo && (
              <Badge style={{ backgroundColor: `${currentSilo.color}20`, color: currentSilo.color }} className="text-[10px] sm:text-xs truncate max-w-[120px] sm:max-w-none">
                {currentSilo.display_name}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" onClick={fetchData} className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Refresh</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="h-8 px-2 sm:px-3 text-xs">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Dashboard</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Silo Selector */}
        {silos.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {silos.map(s => {
              const Icon = SILO_ICONS[s.icon] || Shield;
              return (
                <Button key={s.id} variant={activeSilo === s.id ? "default" : "outline"} size="sm" onClick={() => setActiveSilo(s.id)} className="text-xs h-8">
                  <Icon className="h-3 w-3 mr-1" /> {s.display_name}
                </Button>
              );
            })}
          </div>
        )}

        {/* Halted Warning */}
        {isHalted && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-3 sm:p-4 flex items-center gap-3">
            <PowerOff className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-bold text-destructive">SILO HALTED</p>
              <p className="text-xs text-muted-foreground">Compliance integrity breach detected. Operations suspended by Master.</p>
            </div>
          </div>
        )}

        {/* Stats Grid — 2x2 mobile, 4 col desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <Card>
            <CardContent className="pt-3 pb-2 sm:pt-4 sm:pb-3 text-center">
              <IconComp className="h-4 w-4 mx-auto mb-1" style={{ color: currentSilo?.color }} />
              <div className="text-base sm:text-lg font-bold text-foreground">{currentData.length}</div>
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase">Records</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-3 pb-2 sm:pt-4 sm:pb-3 text-center">
              <Activity className="h-4 w-4 text-primary mx-auto mb-1" />
              <div className="text-base sm:text-lg font-bold text-foreground">{currentData.filter(d => d.status === "active").length}</div>
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-3 pb-2 sm:pt-4 sm:pb-3 text-center">
              <DollarSign className="h-4 w-4 text-primary mx-auto mb-1" />
              <div className="text-base sm:text-lg font-bold text-primary">${totalEarnings.toLocaleString()}</div>
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase">Your Earnings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-3 pb-2 sm:pt-4 sm:pb-3 text-center">
              <AlertTriangle className={`h-4 w-4 mx-auto mb-1 ${isHalted ? "text-destructive" : "text-muted-foreground"}`} />
              <div className={`text-base sm:text-lg font-bold ${isHalted ? "text-destructive" : "text-foreground"}`}>
                {isHalted ? "HALTED" : "CLEAR"}
              </div>
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase">Status</div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Gauge */}
        {currentSilo && (
          <Card>
            <CardContent className="pt-3 pb-3 sm:pt-4 sm:pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-semibold text-foreground">Compliance Integrity</p>
                <span className={`text-sm sm:text-base font-bold ${avgScore < 40 ? "text-destructive" : avgScore < 70 ? "text-yellow-500" : "text-primary"}`}>{avgScore}%</span>
              </div>
              <Progress value={avgScore} className="h-2" />
              {avgScore < 40 && (
                <p className="text-[10px] text-destructive font-medium animate-pulse">⚠ Below auto-kill threshold — Master may halt operations</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Live Oracle Feed */}
        {oracleData && (
          <Card className="border-primary/30">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-primary animate-pulse" />
                  <CardTitle className="text-xs sm:text-sm">Live Oracle Feed</CardTitle>
                </div>
                <Badge variant="outline" className="text-[9px] sm:text-[10px] font-mono">
                  {new Date(oracleData.last_updated).toLocaleTimeString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(oracleData.metrics || {}).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-muted/50 rounded-lg p-2 text-center">
                    <div className="text-xs sm:text-sm font-bold text-foreground">
                      {typeof value === "number" && key.includes("price") ? `$${value.toLocaleString()}` : typeof value === "number" && key.includes("rate") ? `${value}%` : value?.toLocaleString?.() ?? value}
                    </div>
                    <div className="text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-wider">
                      {key.replace(/_/g, " ")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Updates */}
              <div className="space-y-1.5">
                {(oracleData.recent_updates || []).map((update: any) => (
                  <div key={update.id} className="flex items-start gap-2 text-[10px] sm:text-xs">
                    <span className={`shrink-0 mt-0.5 ${severityColor(update.severity)}`}>
                      {update.severity === "critical" ? "🔴" : update.severity === "warning" ? "🟡" : "🟢"}
                    </span>
                    <span className="text-muted-foreground line-clamp-2">{update.title}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Tabs */}
        <Tabs defaultValue="records">
          <TabsList className="bg-muted w-full sm:w-auto">
            <TabsTrigger value="records" className="text-xs flex-1 sm:flex-none"><FileText className="h-3 w-3 mr-1" /> Records</TabsTrigger>
            <TabsTrigger value="revenue" className="text-xs flex-1 sm:flex-none"><DollarSign className="h-3 w-3 mr-1" /> Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="records">
            <Card>
              <CardContent className="pt-3 sm:pt-4 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[10px] sm:text-xs">Title</TableHead>
                      <TableHead className="text-[10px] sm:text-xs hidden sm:table-cell">Type</TableHead>
                      <TableHead className="text-[10px] sm:text-xs">Score</TableHead>
                      <TableHead className="text-[10px] sm:text-xs">Status</TableHead>
                      <TableHead className="text-[10px] sm:text-xs hidden sm:table-cell">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map(d => (
                      <TableRow key={d.id}>
                        <TableCell className="text-[10px] sm:text-xs font-medium max-w-[120px] sm:max-w-none truncate">{d.title}</TableCell>
                        <TableCell className="hidden sm:table-cell"><Badge variant="outline" className="text-[9px] sm:text-[10px]">{d.record_type}</Badge></TableCell>
                        <TableCell className="text-[10px] sm:text-xs">{d.compliance_score}%</TableCell>
                        <TableCell>
                          <Badge className={
                            d.status === "active" ? "bg-primary/20 text-primary text-[9px] sm:text-[10px]"
                            : d.status === "halted" ? "bg-destructive/20 text-destructive text-[9px] sm:text-[10px]"
                            : "bg-muted text-muted-foreground text-[9px] sm:text-[10px]"
                          }>{d.status}</Badge>
                        </TableCell>
                        <TableCell className="text-[10px] sm:text-xs hidden sm:table-cell">{new Date(d.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                    {currentData.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-8">No records in this silo.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardContent className="pt-3 sm:pt-4 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[10px] sm:text-xs">Deal</TableHead>
                      <TableHead className="text-[10px] sm:text-xs">Total</TableHead>
                      <TableHead className="text-[10px] sm:text-xs">Your Share</TableHead>
                      <TableHead className="text-[10px] sm:text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenue.map(r => (
                      <TableRow key={r.id}>
                        <TableCell className="text-[10px] sm:text-xs font-medium max-w-[100px] sm:max-w-none truncate">{r.deal_name}</TableCell>
                        <TableCell className="text-[10px] sm:text-xs font-mono">${Number(r.total_amount).toLocaleString()}</TableCell>
                        <TableCell className="text-[10px] sm:text-xs font-mono text-primary">
                          ${(Number(r.total_amount) * Number(r.partner_share) / 100).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={r.status === "paid" ? "bg-primary/20 text-primary text-[9px] sm:text-[10px]" : "bg-muted text-muted-foreground text-[9px] sm:text-[10px]"}>
                            {r.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {revenue.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-8">No revenue splits.</TableCell></TableRow>
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

export default SiloDashboard;
