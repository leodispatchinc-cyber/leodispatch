"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import LeoLogo from "@/components/LeoLogo";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: fd.get("username"),
          password: fd.get("password"),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        window.location.href = "/admin";
        return;
      }
      setError(json.error || "Login failed. Please try again.");
    } catch {
      setError("Network error. Please try again.");
    }
    setPending(false);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4 text-paper">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2">
          <LeoLogo className="h-8" />
        </div>
        <h1 className="mt-6 flex items-center gap-2 font-display text-2xl font-bold">
          <Lock className="h-5 w-5 text-gold" /> Admin Login
        </h1>
        <p className="mt-1 text-sm text-muted">Leo Dispatch Inc dashboard</p>

        <label className="mt-6 block text-xs font-medium uppercase tracking-wide text-muted">
          Username
        </label>
        <input
          name="username"
          autoComplete="username"
          required
          className="field-input mt-1"
          placeholder="admin"
        />

        <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-muted">
          Password
        </label>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="field-input mt-1"
          placeholder="••••••••"
        />

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-full bg-yellow px-5 py-3 text-sm font-semibold text-black transition-all hover:bg-gold active:scale-[0.98] disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign In"}
        </button>

        <Link
          href="/admin/forgot"
          className="mt-4 block text-center text-xs text-muted transition-colors hover:text-gold"
        >
          Forgot password?
        </Link>
      </form>
    </div>
  );
}
