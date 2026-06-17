"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { forgotAction, type ForgotState } from "./actions";

const initial: ForgotState = {};

export default function AdminForgotPage() {
  const [state, action, pending] = useActionState(forgotAction, initial);

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4 text-paper">
      <form
        action={action}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-2xl"
      >
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
          <Mail className="h-5 w-5 text-gold" /> Forgot Password
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We&apos;ll email the admin login details to the registered address
          (leodispatchinc@gmail.com).
        </p>

        {state?.ok ? (
          <p className="mt-5 rounded-xl border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
            {state.message}
          </p>
        ) : (
          <>
            {state?.error && <p className="mt-4 text-sm text-red-400">{state.error}</p>}
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
