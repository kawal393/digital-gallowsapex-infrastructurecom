import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Users, AlertTriangle, ThumbsUp, ThumbsDown, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Analytics = {
  totalConversations: number;
  totalMessages: number;
  leads: Array<{ id: string; lead_name: string | null; lead_email: string; lead_company: string | null; created_at: string }>;
  knowledgeGaps: Array<{ id: string; question: string; created_at: string }>;
  feedback: { total: number; positive: number; negative: number };
  recentConversations: Array<{
    id: string; visitor_id: string; message_count: number;
    lead_email: string | null; lead_name: string | null; created_at: string; updated_at: string;
  }>;
};

export default function ChatAnalytics() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("chat-analytics");
      if (error) throw error;
      setData(result);
    } catch (e: any) {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return <p className="text-sm text-muted-foreground text-center py-8">No analytics data available.</p>;

  const satisfactionRate = data.feedback.total > 0
    ? Math.round((data.feedback.positive / data.feedback.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={fetchAnalytics}>
          <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<MessageCircle className="h-4 w-4" />} label="Conversations" value={data.totalConversations} />
        <StatCard icon={<Users className="h-4 w-4" />} label="Messages" value={data.totalMessages} />
        <StatCard icon={<Mail className="h-4 w-4" />} label="Leads Captured" value={data.leads.length} accent />
        <StatCard
          icon={<ThumbsUp className="h-4 w-4" />}
          label="Satisfaction"
          value={`${satisfactionRate}%`}
          subtitle={`${data.feedback.positive}↑ ${data.feedback.negative}↓`}
        />
      </div>

      {/* Leads Table */}
      {data.leads.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" /> Captured Leads
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="text-left py-2 pr-4">Name</th>
                  <th className="text-left py-2 pr-4">Email</th>
                  <th className="text-left py-2 pr-4">Company</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.leads.map(lead => (
                  <tr key={lead.id} className="border-b border-border/50 last:border-0">
                    <td className="py-2 pr-4 text-foreground">{lead.lead_name || "—"}</td>
                    <td className="py-2 pr-4 text-primary">{lead.lead_email}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{lead.lead_company || "—"}</td>
                    <td className="py-2 text-muted-foreground">{new Date(lead.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Knowledge Gaps */}
      {data.knowledgeGaps.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" /> Knowledge Gaps
          </h3>
          <div className="space-y-2">
            {data.knowledgeGaps.map(gap => (
              <div key={gap.id} className="flex items-start gap-2 text-xs">
                <span className="text-warning mt-0.5">•</span>
                <div>
                  <p className="text-foreground">{gap.question}</p>
                  <p className="text-muted-foreground/60">{new Date(gap.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Conversations */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" /> Recent Conversations
        </h3>
        <div className="space-y-2">
          {data.recentConversations.slice(0, 10).map(conv => (
            <div key={conv.id} className="flex items-center justify-between text-xs py-1.5 border-b border-border/30 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-mono">{conv.visitor_id.slice(0, 8)}…</span>
                {conv.lead_email && (
                  <span className="text-primary text-[10px] bg-primary/10 rounded px-1.5 py-0.5">Lead</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{conv.message_count} msgs</span>
                <span className="text-muted-foreground/60">{new Date(conv.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtitle, accent }: {
  icon: React.ReactNode; label: string; value: string | number; subtitle?: string; accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={accent ? "text-primary" : "text-muted-foreground"}>{icon}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${accent ? "text-primary" : "text-foreground"}`}>{value}</p>
      {subtitle && <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
}
