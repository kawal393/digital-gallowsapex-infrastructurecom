import { useState } from "react";
import { MessageSquarePlus, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { value: "suggestion", label: "💡 Suggestion" },
  { value: "issue", label: "🐛 Report Issue" },
  { value: "complaint", label: "📢 Complaint" },
  { value: "praise", label: "⭐ Praise" },
];

const FeedbackWidget = () => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("suggestion");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() || message.trim().length < 5) {
      toast.error("Please enter at least 5 characters.");
      return;
    }
    if (message.length > 2000) {
      toast.error("Message too long. Max 2000 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("feedback_submissions").insert({
        category,
        message: message.trim(),
        email: email.trim() || null,
        page_url: window.location.pathname,
      });
      if (error) throw error;
      toast.success("Thank you! Your feedback has been received.");
      setMessage("");
      setEmail("");
      setCategory("suggestion");
      setOpen(false);
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-24 right-5 z-50 p-3 rounded-full bg-gold text-primary-foreground shadow-lg hover:shadow-gold-lg transition-shadow cursor-pointer border-none"
            aria-label="Open feedback"
            title="Send us feedback"
          >
            <MessageSquarePlus className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Feedback panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-50 w-80 rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <h3 className="text-sm font-bold text-foreground tracking-wide">
                💬 Feedback & Suggestions
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer"
                aria-label="Close feedback"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {/* Category pills */}
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-colors cursor-pointer bg-transparent ${
                      category === cat.value
                        ? "border-gold text-gold bg-gold/10"
                        : "border-border text-muted-foreground hover:border-gold/50 hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Message */}
              <Textarea
                placeholder="Tell us what's on your mind..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[80px] resize-none text-sm bg-background"
                maxLength={2000}
              />

              {/* Optional email */}
              <Input
                type="email"
                placeholder="Email (optional — for follow-up)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm bg-background"
              />

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                disabled={submitting || !message.trim()}
                variant="hero"
                size="sm"
                className="w-full"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Submit Feedback
                  </>
                )}
              </Button>

              <p className="text-[10px] text-muted-foreground text-center">
                Your feedback helps us build a better platform.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackWidget;
