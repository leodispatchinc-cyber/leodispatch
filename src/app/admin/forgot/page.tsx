"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

type State = { ok?: boolean; message?: string; error?: string };

export default function AdminForgotPage() {
  const [state, setState] = useState<State>({});
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setState({});
    try {
      const res = await fetch("/api/admin/forgot", { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) setState({ ok: true, message: json.message });
      else setState({ error: json.error || "Could not send the email." });
    } catch {
      setState({ error: "Network error. Please try again." });
    }
    setPending(false);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4 text-paper">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-2xl"
      >
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
          <Mail className="h-5 w-5 text-gold" /> Forgot Password
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We&apos;ll email the admin login details to the registered address
          (leodispatchinc@gmail.com).
        </p>

        {state.ok ? (
          <p className="mt-5 rounded-xl border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
            {state.message}
          </p>
        ) : (
          <>
            {state.error && <p className="mt-4 text-sm text-red-400">{state.error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="mt-6 w-full rounded-full bg-yellow px-5 py-3 text-sm font-semibold text-black transition-all hover:bg-gold active:scale-[0.98] disabled:opacity-60"
            >
              {pending ? "Sending…" : "Email me the login details"}
            </button>
          </>
        )}

        <Link
          href="/admin/login"
          className="mt-4 flex items-center justify-center gap-1 text-xs text-muted transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to login
        </Link>
      </form>
    </div>
  );
}
