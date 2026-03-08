import { useState, useCallback, useRef, useEffect } from "react";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/apex-chat`;

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const STORAGE_KEY = "apex_chat_messages";
const VISITOR_KEY = "apex_visitor_id";
const CONVERSATION_KEY = "apex_conversation_id";

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

function getConversationId(): string {
  let id = sessionStorage.getItem(CONVERSATION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(CONVERSATION_KEY, id);
  }
  return id;
}

export function getConversationIdForFeedback(): string {
  return sessionStorage.getItem(CONVERSATION_KEY) || "";
}

function loadMessages(): ChatMessage[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveMessages(msgs: ChatMessage[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  } catch { /* quota exceeded, ignore */ }
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Persist messages to sessionStorage
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const sendMessage = useCallback(async (input: string) => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: trimmed };
    const assistantId = crypto.randomUUID(); // Pre-generate stable ID for the assistant message

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const allMessages = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));

    try {
      abortRef.current = new AbortController();
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages,
          conversation_id: getConversationId(),
          visitor_id: getVisitorId(),
        }),
        signal: abortRef.current.signal,
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: "Something went wrong" }));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";
      let assistantCreated = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              const currentContent = assistantContent;
              if (!assistantCreated) {
                assistantCreated = true;
                setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: currentContent }]);
              } else {
                setMessages(prev =>
                  prev.map(m => m.id === assistantId ? { ...m, content: currentContent } : m)
                );
              }
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Handle any remaining buffer
      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              const currentContent = assistantContent;
              if (!assistantCreated) {
                assistantCreated = true;
                setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: currentContent }]);
              } else {
                setMessages(prev =>
                  prev.map(m => m.id === assistantId ? { ...m, content: currentContent } : m)
                );
              }
            }
          } catch { /* ignore partial */ }
        }
      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        setError(e.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [messages, isLoading]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setError(null);
    sessionStorage.removeItem(CONVERSATION_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return { messages, isLoading, error, sendMessage, resetChat };
}
