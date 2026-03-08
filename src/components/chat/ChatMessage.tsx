import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { ChatMessage as ChatMsg } from "@/hooks/use-chat";

interface Props {
  message: ChatMsg;
}

export default function ChatMessage({ message }: Props) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const handleFeedback = async (rating: "up" | "down") => {
    if (feedback) return;
    setFeedback(rating);
    // Store feedback - fire and forget
    supabase.from("chat_feedback").insert({
      message_id: message.id,
      rating,
    }).then(() => {});
  };

  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
        isUser
          ? "bg-primary text-primary-foreground rounded-br-md"
          : "bg-muted text-foreground rounded-bl-md"
      }`}>
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none [&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_ul]:my-1 [&_li]:my-0">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        {!isUser && message.content && (
          <div className="flex gap-1 mt-1.5 justify-end">
            <button
              onClick={() => handleFeedback("up")}
              className={`p-1 rounded hover:bg-background/20 transition-colors ${feedback === "up" ? "text-green-400" : "text-muted-foreground/50"}`}
            >
              <ThumbsUp className="h-3 w-3" />
            </button>
            <button
              onClick={() => handleFeedback("down")}
              className={`p-1 rounded hover:bg-background/20 transition-colors ${feedback === "down" ? "text-red-400" : "text-muted-foreground/50"}`}
            >
              <ThumbsDown className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
