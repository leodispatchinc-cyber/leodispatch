"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deletePostAction } from "@/app/admin/blog/actions";

export default function DeletePostButton({ id, title }: { id: string; title: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`Delete "${title}"? This cannot be undone.`)) {
          start(() => deletePostAction(id));
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-red-400 hover:text-red-400 disabled:opacity-50"
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Delete
    </button>
  );
}
