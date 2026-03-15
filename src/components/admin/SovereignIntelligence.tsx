import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Globe, TrendingUp, Monitor, Link as LinkIcon } from "lucide-react";

interface SiteIntelligence {
  pageviews_24h: number;
  unique_visitors_24h: number;
  sessions_24h: number;
  pageviews_7d: number;
  unique_visitors_7d: number;
  pageviews_30d: number;
  unique_visitors_30d: number;
  top_pages: { path: string; count: number }[];
  top_referrers: { source: string; count: number }[];
  daily_chart: { date: string; views: number; visitors: number }[];
  recent_visits: {
    visitor_id: string;
    page_path: string;
    referrer: string | null;
    created_at: string;
    user_agent: string | null;
    language: string | null;
    session_id: string | null;
    screen_width: number | null;
    screen_height: number | null;
  }[];
}

const SovereignIntelligence = ({ data }: { data: SiteIntelligence | null }) => {
  if (!data) return <div className="text-sm text-muted-foreground text-center py-8">No intelligence data available.</div>;

  const maxViews = Math.max(...(data.daily_chart.map(d => d.views) || [1]));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-gold/20">
          <CardContent className="pt-4 pb-4 text-center">
            <Eye className="h-5 w-5 text-gold mx-auto mb-1" />
            <div className="text-2xl font-black text-foreground">{data.pageviews_24h}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Page Views (24h)</div>
          </CardContent>
        </Card>
        <Card className="border-gold/20">
          <CardContent className="pt-4 pb-4 text-center">
            <Globe className="h-5 w-5 text-primary mx-auto mb-1" />
            <div className="text-2xl font-black text-foreground">{data.unique_visitors_24h}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Unique Visitors (24h)</div>
          </CardContent>
        </Card>
        <Card className="border-gold/20">
          <CardContent className="pt-4 pb-4 text-center">
            <TrendingUp className="h-5 w-5 text-compliant mx-auto mb-1" />
            <div className="text-2xl font-black text-foreground">{data.unique_visitors_7d}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Unique Visitors (7d)</div>
          </CardContent>
        </Card>
        <Card className="border-gold/20">
          <CardContent className="pt-4 pb-4 text-center">
            <Monitor className="h-5 w-5 text-accent mx-auto mb-1" />
            <div className="text-2xl font-black text-foreground">{data.unique_visitors_30d}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Unique Visitors (30d)</div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Traffic Chart (CSS bars) */}
      <Card className="border-gold/20">
        <CardHeader><CardTitle className="text-sm">Daily Traffic — Last 7 Days</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end gap-1 h-32">
            {data.daily_chart.map(day => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[9px] text-gold font-bold">{day.views}</div>
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${Math.max(4, (day.views / maxViews) * 100)}%`,
                    background: "linear-gradient(to top, hsl(var(--gold)), hsl(var(--primary)))",
                  }}
                />
                <div className="text-[8px] text-muted-foreground">{day.date.slice(5)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Top Pages */}
        <Card className="border-gold/20">
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Eye className="h-4 w-4" /> Top Pages (7d)</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.top_pages.map((p, i) => (
                <div key={p.path} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] text-muted-foreground w-4">{i + 1}.</span>
                    <span className="text-xs font-mono truncate">{p.path}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0">{p.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card className="border-gold/20">
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><LinkIcon className="h-4 w-4" /> Top Referrers (7d)</CardTitle></CardHeader>
          <CardContent>
            {data.top_referrers.length === 0 ? (
              <p className="text-xs text-muted-foreground">No external referrers yet.</p>
            ) : (
              <div className="space-y-2">
                {data.top_referrers.map((r, i) => (
                  <div key={r.source} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] text-muted-foreground w-4">{i + 1}.</span>
                      <span className="text-xs font-mono truncate">{r.source}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">{r.count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Live Feed */}
      <Card className="border-gold/20">
        <CardHeader><CardTitle className="text-sm">Live Visitor Feed (Last 50)</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[10px]">Time</TableHead>
                <TableHead className="text-[10px]">Page</TableHead>
                <TableHead className="text-[10px]">Referrer</TableHead>
                <TableHead className="text-[10px]">Visitor</TableHead>
                <TableHead className="text-[10px]">Screen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recent_visits.map((v, i) => (
                <TableRow key={i}>
                  <TableCell className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {new Date(v.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </TableCell>
                  <TableCell className="text-[10px] font-mono max-w-[140px] truncate">{v.page_path}</TableCell>
                  <TableCell className="text-[10px] max-w-[120px] truncate text-muted-foreground">
                    {v.referrer ? (() => { try { return new URL(v.referrer).hostname; } catch { return v.referrer; } })() : "—"}
                  </TableCell>
                  <TableCell className="text-[10px] font-mono">{v.visitor_id?.slice(0, 8)}…</TableCell>
                  <TableCell className="text-[10px] text-muted-foreground">
                    {v.screen_width && v.screen_height ? `${v.screen_width}×${v.screen_height}` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SovereignIntelligence;
