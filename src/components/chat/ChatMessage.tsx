import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getConversationIdForFeedback, type ChatMessage as ChatMsg } from "@/hooks/use-chat";

interface Props {
  message: ChatMsg;
}

export default function ChatMessage({ message }: Props) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const handleFeedback = async (rating: "up" | "down") => {
    if (feedback) return;
    setFeedback(rating);
    const conversationId = getConversationIdForFeedback();
    supabase.from("chat_feedback" as any).insert({
      rating,
      conversation_id: conversationId || null,
      message_content: message.content.slice(0, 200),
    }).then(() => {});
  };

  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-200`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
        isUser
          ? "bg-primary text-primary-foreground rounded-br-md"
          : "bg-muted text-foreground rounded-bl-md"
      }`}>
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none [&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_ul]:my-1 [&_li]:my-0 [&_a]:text-primary [&_a]:underline [&_strong]:text-foreground [&_code]:text-primary [&_code]:bg-background/30 [&_code]:px-1 [&_code]:rounded">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        {!isUser && message.content && (
          <div className="flex gap-1 mt-1.5 justify-end opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => handleFeedback("up")}
              className={`p-1 rounded transition-colors ${
                feedback === "up" ? "text-compliant" : "text-muted-foreground/40 hover:text-muted-foreground"
              }`}
              aria-label="Helpful"
            >
              <ThumbsUp className="h-3 w-3" />
            </button>
            <button
              onClick={() => handleFeedback("down")}
              className={`p-1 rounded transition-colors ${
                feedback === "down" ? "text-destructive" : "text-muted-foreground/40 hover:text-muted-foreground"
              }`}
              aria-label="Not helpful"
            >
              <ThumbsDown className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
