"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, ArrowLeft, Loader2, User, Trash2 } from "lucide-react";

interface Msg {
  id: string;
  from: "visitor" | "admin";
  text: string;
  at: string;
}
interface Conversation {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  messages: Msg[];
  adminUnread: number;
}

function time(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function AdminChat() {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  // poll conversations
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const r = await fetch("/api/chat/admin", { cache: "no-store" });
        if (!r.ok) return;
        const d = await r.json();
        if (active) {
          setConvos(d.conversations || []);
          setLoaded(true);
        }
      } catch {
        /* ignore */
      }
    };
    load();
    const t = setInterval(load, 4000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, []);

  const active = useMemo(() => convos.find((c) => c.id === activeId) || null, [convos, activeId]);
  const totalUnread = convos.reduce((n, c) => n + (c.adminUnread || 0), 0);

  // auto-scroll the open thread
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [active?.messages.length, activeId]);

  async function openConversation(id: string) {
    setActiveId(id);
    // optimistic clear of the unread badge
    setConvos((cs) => cs.map((c) => (c.id === id ? { ...c, adminUnread: 0 } : c)));
    try {
      await fetch("/api/chat/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: id, action: "read" }),
      });
    } catch {
      /* ignore */
    }
  }

  async function deleteConversation(id: string) {
    if (!confirm("Delete this entire conversation? This cannot be undone.")) return;
    setConvos((cs) => cs.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
    try {
      await fetch("/api/chat/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: id, action: "delete" }),
      });
    } catch {
      /* ignore */
    }
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    const text = reply.trim();
    if (!text || !activeId || sending) return;
    setSending(true);
    const optimistic: Msg = { id: `tmp-${Date.now()}`, from: "admin", text, at: new Date().toISOString() };
    setConvos((cs) =>
      cs.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, optimistic] } : c))
    );
    setReply("");
    try {
      const r = await fetch("/api/chat/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeId, text }),
      });
      const d = await r.json();
      if (d.conversation) {
        setConvos((cs) => cs.map((c) => (c.id === activeId ? d.conversation : c)));
      }
    } catch {
      /* keep optimistic */
    } finally {
      setSending(false);
    }
  }

  function lastPreview(c: Conversation): string {
    const m = c.messages[c.messages.length - 1];
    if (!m) return "";
    return `${m.from === "admin" ? "You: " : ""}${m.text}`;
  }

  return (
    <div className="mt-6 grid min-h-0 flex-1 overflow-hidden rounded-2xl border border-line bg-surface lg:grid-cols-[320px_1fr]">
      {/* List */}
      <div className={`flex min-h-0 flex-col border-line lg:border-r ${active ? "hidden lg:flex" : "flex"}`}>
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="text-sm font-bold text-paper">Conversations</span>
          {totalUnread > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-yellow px-1.5 text-[11px] font-bold text-black">
              {totalUnread}
            </span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {!loaded ? (
            <div className="grid place-items-center py-16 text-muted">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : convos.length === 0 ? (
            <div className="grid place-items-center px-5 py-16 text-center">
              <MessageCircle className="h-9 w-9 text-gold" />
              <p className="mt-3 text-sm text-muted">No chats yet. Messages from the website chat widget land here.</p>
            </div>
          ) : (
            convos.map((c) => (
              <button
                key={c.id}
                onClick={() => openConversation(c.id)}
                className={`flex w-full items-start gap-3 border-b border-line px-4 py-3 text-left transition-colors hover:bg-surface-2 ${
                  activeId === c.id ? "bg-surface-2" : ""
                }`}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-yellow/15 text-gold">
                  <User className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-paper">{c.name || "Website visitor"}</span>
                    <span className="shrink-0 text-[10px] text-muted">{time(c.updatedAt)}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted">{lastPreview(c)}</span>
                </span>
                {c.adminUnread > 0 && (
                  <span className="mt-1 grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-yellow px-1.5 text-[11px] font-bold text-black">
                    {c.adminUnread}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Thread */}
      <div className={`min-h-0 flex-col ${active ? "flex" : "hidden lg:flex"}`}>
        {!active ? (
          <div className="hidden flex-1 place-items-center text-center lg:grid">
            <div>
              <MessageCircle className="mx-auto h-10 w-10 text-gold" />
              <p className="mt-3 text-sm text-muted">Select a conversation to reply.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Thread header */}
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <button
                onClick={() => setActiveId(null)}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:text-paper lg:hidden"
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-yellow/15 text-gold">
                <User className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-paper">{active.name || "Website visitor"}</div>
                <div className="truncate text-xs text-muted">{active.email || "No email provided"}</div>
              </div>
              <button
                onClick={() => deleteConversation(active.id)}
                className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                aria-label="Delete conversation"
                title="Delete conversation"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={threadRef} className="flex-1 space-y-3 overflow-y-auto bg-ink/40 p-4">
              {active.messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === "admin" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm ${
                      m.from === "admin"
                        ? "rounded-br-sm bg-yellow text-black"
                        : "rounded-tl-sm bg-surface-2 text-paper/90"
                    }`}
                  >
                    {m.text}
                    <div className={`mt-1 text-[10px] ${m.from === "admin" ? "text-black/60" : "text-muted"}`}>
                      {time(m.at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply */}
            <form onSubmit={sendReply} className="flex items-end gap-2 border-t border-line p-3">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendReply(e);
                  }
                }}
                rows={1}
                placeholder="Type your reply…"
                className="field-input max-h-28 min-h-[44px] flex-1 resize-none !py-2.5 text-sm"
              />
              <button
                type="submit"
                disabled={sending || !reply.trim()}
                aria-label="Send reply"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-yellow text-black transition-colors hover:bg-gold disabled:opacity-50"
              >
                {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
