import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Brain, RotateCcw, Sparkles, Database, Shield, Anchor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

const AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-ai`;

type Msg = { id: string; role: "user" | "assistant"; content: string };

const QUICK_COMMANDS = [
  { icon: Database, label: "Platform Stats", msg: "Give me a full overview of platform stats — users, revenue, compliance scores, and any issues I should know about." },
  { icon: Shield, label: "Compliance Report", msg: "Run a compliance analysis across all silos and tell me which ones need attention." },
  { icon: Anchor, label: "Anchor to Chain", msg: "Anchor our latest Merkle roots to the blockchain and confirm the transaction." },
  { icon: Brain, label: "Growth Strategy", msg: "Based on our current data, what are the top 3 strategic moves to grow revenue this quarter?" },
];

export default function AdminAIChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: trimmed };
    const assistantId = crypto.randomUUID();
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const allMsgs = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));

    try {
      const session = await (await import("@/integrations/supabase/client")).supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const resp = await fetch(AI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ messages: allMsgs }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let content = "";
      let created = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              content += delta;
              const cur = content;
              if (!created) {
                created = true;
                setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: cur }]);
              } else {
                setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: cur } : m));
              }
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: `⚠ Error: ${e.message}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  return (
    <Card className="border-primary/30 bg-card/80 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm">Sovereign AI</CardTitle>
              <p className="text-[10px] text-muted-foreground">Command Intelligence • Gemini-Powered</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setMessages([])} className="h-7 w-7 p-0">
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Messages */}
        <div ref={scrollRef} className="h-[400px] overflow-y-auto space-y-3 scroll-smooth pr-1">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Sparkles className="h-8 w-8 text-primary mb-3 opacity-60" />
              <p className="text-sm font-semibold text-foreground mb-1">Command Center Ready</p>
              <p className="text-xs text-muted-foreground mb-4 max-w-[280px]">
                Your private AI with full platform access. Query data, research markets, analyze compliance, or plan strategy.
              </p>
              <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                {QUICK_COMMANDS.map(cmd => (
                  <button
                    key={cmd.label}
                    onClick={() => sendMessage(cmd.msg)}
                    className="flex items-center gap-2 text-left text-xs px-3 py-2.5 rounded-lg border border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all"
                  >
                    <cmd.icon className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="text-foreground">{cmd.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}>
                  {msg.role === "user" ? (
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  ) : (
                    <div className="prose prose-sm prose-invert max-w-none [&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_ul]:my-1 [&_li]:my-0 [&_a]:text-primary [&_strong]:text-foreground [&_code]:text-primary [&_code]:bg-background/30 [&_code]:px-1 [&_code]:rounded [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-xl rounded-bl-sm px-3 py-2">
                <div className="flex gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value.slice(0, 2000))}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Command your empire..."
            rows={1}
            className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-transparent focus:ring-primary/30 transition-all resize-none min-h-[38px] max-h-[120px]"
            disabled={isLoading}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="h-[38px] w-[38px] p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
