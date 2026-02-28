import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { forwardRef, useState } from "react";
import { toast } from "sonner";

const FUNCTION_URL = `https://qhtntebpcribjiwrdtdd.supabase.co/functions/v1/send-contact-email`;

const ContactSection = forwardRef<HTMLElement>((_, ref) => {
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          role: formData.get("role"),
          message: formData.get("message"),
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      toast.success("Demo request submitted. We'll be in touch within 24 hours.");
      form.reset();
    } catch {
      toast.error("Something went wrong. Please try again or email us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section ref={ref} className="relative py-24 px-4" id="contact">
      <div className="container mx-auto max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
            Contact
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Request a Demo
          </h2>
          <p className="text-muted-foreground text-sm">
            Get ahead of August 2, 2026. Start your compliance journey today.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              name="name"
              placeholder="Full Name"
              required
              maxLength={100}
              className="bg-card border-border text-foreground placeholder:text-muted-foreground"
            />
            <Input
              name="email"
              placeholder="Email"
              type="email"
              required
              maxLength={255}
              className="bg-card border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              name="company"
              placeholder="Company Name"
              required
              maxLength={100}
              className="bg-card border-border text-foreground placeholder:text-muted-foreground"
            />
            <Input
              name="role"
              placeholder="Role / Title (optional)"
              maxLength={100}
              className="bg-card border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Textarea
            name="message"
            placeholder="Tell us about your AI compliance needs..."
            rows={4}
            maxLength={1000}
            className="bg-card border-border text-foreground placeholder:text-muted-foreground resize-none"
          />
          <Button variant="hero" className="w-full" disabled={sending}>
            {sending ? "Submitting..." : "Submit Request"}
          </Button>
        </motion.form>
      </div>
    </section>
  );
});

ContactSection.displayName = "ContactSection";

export default ContactSection;
