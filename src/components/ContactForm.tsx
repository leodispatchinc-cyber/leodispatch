"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Send } from "lucide-react";

type Status = "idle" | "sending" | "done" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="grid place-items-center rounded-3xl border border-success/40 bg-surface p-10 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold">Message sent!</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Thanks for reaching out — a dispatcher will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-muted">Full Name</span>
          <input className="field-input" value={form.name} onChange={set("name")} placeholder="John Carrier" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-muted">Phone</span>
          <input className="field-input" value={form.phone} onChange={set("phone")} placeholder="(555) 010-2030" />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium text-muted">
          Email <span className="text-gold">*</span>
        </span>
        <input
          type="email"
          required
          className="field-input"
          value={form.email}
          onChange={set("email")}
          placeholder="you@email.com"
        />
      </label>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium text-muted">How can we help?</span>
        <textarea
          className="field-input min-h-[130px] resize-y"
          value={form.message}
          onChange={set("message")}
          placeholder="Tell us about your truck, your authority and your lanes…"
        />
      </label>

      {status === "error" && (
        <p className="mt-3 text-sm text-red-400">Something went wrong. Please try again or call us.</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-yellow px-8 py-3.5 text-sm font-semibold text-black transition-all hover:bg-gold disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send Message <Send className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
