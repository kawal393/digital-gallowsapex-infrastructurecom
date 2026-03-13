import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield, ArrowLeft, RefreshCw, Activity, DollarSign,
  Heart, Mountain, Pill, Brain, PowerOff, FileText, AlertTriangle
} from "lucide-react";
import apexLogo from "@/assets/apex-logo.png";
import { toast } from "sonner";

const SILO_ICONS: Record<string, any> = { Heart, Mountain, Pill, Brain, Shield };

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

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch user's silo assignments
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
      const siloIds = assigns.map(a => a.silo_id);

      // Fetch silos, data, revenue, kill logs for assigned silos only
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
    } catch (e: any) {
      toast.error("Failed to load silo data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-2">No Silo Access</h2>
            <p className="text-sm text-muted-foreground mb-4">You have not been assigned to any industry silo. Contact the Master for access.</p>
            <Button variant="hero" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
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
  const IconComp = currentSilo ? (SILO_ICONS[currentSilo.icon] || Shield) : Shield;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto max-w-6xl flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <img src={apexLogo} alt="APEX" className="h-7 w-7 glow-gold" />
              <span className="font-bold text-gold-gradient text-sm">APEX</span>
            </a>
            {currentSilo && (
              <Badge style={{ backgroundColor: `${currentSilo.color}20`, color: currentSilo.color }} className="text-xs">
                {currentSilo.display_name}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={fetchData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Silo Selector (if multiple silos) */}
        {silos.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {silos.map(s => {
              const Icon = SILO_ICONS[s.icon] || Shield;
              return (
                <Button
                  key={s.id}
                  variant={activeSilo === s.id ? "hero" : "outline"}
                  size="sm"
                  onClick={() => setActiveSilo(s.id)}
                  className="text-xs"
                >
                  <Icon className="h-3 w-3 mr-1" /> {s.display_name}
                </Button>
              );
            })}
          </div>
        )}

        {/* Halted Warning */}
        {isHalted && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 flex items-center gap-3">
            <PowerOff className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-sm font-bold text-destructive">SILO HALTED</p>
              <p className="text-xs text-muted-foreground">Compliance integrity breach detected. Operations suspended by Master.</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <IconComp className="h-4 w-4 mx-auto mb-1" style={{ color: currentSilo?.color }} />
              <div className="text-lg font-bold text-foreground">{currentData.length}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Records</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <Activity className="h-4 w-4 text-compliant mx-auto mb-1" />
              <div className="text-lg font-bold text-foreground">{currentData.filter(d => d.status === "active").length}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <DollarSign className="h-4 w-4 text-gold mx-auto mb-1" />
              <div className="text-lg font-bold text-gold">${totalEarnings.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Your Earnings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <AlertTriangle className={`h-4 w-4 mx-auto mb-1 ${isHalted ? "text-destructive" : "text-muted-foreground"}`} />
              <div className={`text-lg font-bold ${isHalted ? "text-destructive" : "text-foreground"}`}>
                {isHalted ? "HALTED" : "CLEAR"}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase">Status</div>
            </CardContent>
          </Card>
        </div>

        {/* Silo Description */}
        {currentSilo && (
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground">{currentSilo.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Data Table */}
        <Tabs defaultValue="records">
          <TabsList className="bg-muted">
            <TabsTrigger value="records" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-3.5 w-3.5 mr-1.5" /> Records
            </TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <DollarSign className="h-3.5 w-3.5 mr-1.5" /> Revenue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="records">
            <Card>
              <CardContent className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map(d => (
                      <TableRow key={d.id}>
                        <TableCell className="text-xs font-medium">{d.title}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{d.record_type}</Badge></TableCell>
                        <TableCell className="text-xs">{d.compliance_score}%</TableCell>
                        <TableCell>
                          <Badge className={
                            d.status === "active" ? "bg-compliant/20 text-compliant text-[10px]"
                            : d.status === "halted" ? "bg-destructive/20 text-destructive text-[10px]"
                            : "bg-muted text-muted-foreground text-[10px]"
                          }>{d.status}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">{new Date(d.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                    {currentData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-8">
                          No records in this silo yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardContent className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deal</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Your Share</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenue.map(r => (
                      <TableRow key={r.id}>
                        <TableCell className="text-xs font-medium">{r.deal_name}</TableCell>
                        <TableCell className="text-xs font-mono">${Number(r.total_amount).toLocaleString()}</TableCell>
                        <TableCell className="text-xs font-mono text-gold">
                          ${(Number(r.total_amount) * Number(r.partner_share) / 100).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={r.status === "paid" ? "bg-compliant/20 text-compliant text-[10px]" : "bg-muted text-muted-foreground text-[10px]"}>
                            {r.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {revenue.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-8">
                          No revenue splits yet.
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

export default SiloDashboard;
