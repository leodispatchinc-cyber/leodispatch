"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Msg {
  id: string;
  from: "visitor" | "admin";
  text: string;
  at: string;
}

const LS_ID = "leo_chat_id";
const LS_SEEN = "leo_chat_seen";

function makeId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* ignore */
  }
  return `c-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [convId, setConvId] = useState<string>("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [unseen, setUnseen] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // init id from localStorage
  useEffect(() => {
    let id = "";
    try {
      id = localStorage.getItem(LS_ID) || "";
      setName(localStorage.getItem("leo_chat_name") || "");
      setEmail(localStorage.getItem("leo_chat_email") || "");
    } catch {
      /* ignore */
    }
    if (!id) {
      id = makeId();
      try {
        localStorage.setItem(LS_ID, id);
      } catch {
        /* ignore */
      }
    }
    setConvId(id);
  }, []);

  // poll for messages
  useEffect(() => {
    if (!convId) return;
    let active = true;
    const poll = async () => {
      try {
        const r = await fetch(`/api/chat?conversationId=${encodeURIComponent(convId)}`, { cache: "no-store" });
        if (!r.ok) return;
        const d = await r.json();
        if (!active) return;
        const msgs: Msg[] = d.messages || [];
        setMessages(msgs);
        if (!open) {
          let seen = 0;
          try {
            seen = Number(localStorage.getItem(LS_SEEN) || "0");
          } catch {
            /* ignore */
          }
          const adminCount = msgs.filter((m) => m.from === "admin").length;
          setUnseen(Math.max(0, adminCount - seen));
        }
      } catch {
        /* ignore */
      }
    };
    poll();
    const t = setInterval(poll, open ? 4000 : 9000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [convId, open]);

  // mark admin messages seen when opening, and scroll to bottom
  useEffect(() => {
    if (open) {
      const adminCount = messages.filter((m) => m.from === "admin").length;
      try {
        localStorage.setItem(LS_SEEN, String(adminCount));
      } catch {
        /* ignore */
      }
      setUnseen(0);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  }, [open, messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body || !convId || sending) return;
    setSending(true);
    // optimistic
    const optimistic: Msg = { id: `tmp-${Date.now()}`, from: "visitor", text: body, at: new Date().toISOString() };
    setMessages((m) => [...m, optimistic]);
    setText("");
    try {
      try {
        if (name) localStorage.setItem("leo_chat_name", name);
        if (email) localStorage.setItem("leo_chat_email", email);
      } catch {
        /* ignore */
      }
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: convId, name, email, text: body }),
      });
      const d = await r.json();
      if (d.messages) setMessages(d.messages);
    } catch {
      /* keep optimistic message */
    } finally {
      setSending(false);
    }
  }

  const hasSent = messages.some((m) => m.from === "visitor");

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open live chat"
          className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-full bg-yellow px-5 py-3.5 font-semibold text-black shadow-glow transition-transform hover:scale-105"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Chat with us</span>
          {unseen > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-black px-1.5 text-[11px] font-bold text-yellow">
              {unseen}
            </span>
          )}
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-[60] flex h-[70vh] max-h-[560px] w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-glow">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-line bg-ink px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="relative grid h-9 w-9 place-items-center rounded-full bg-yellow text-black">
                <MessageCircle className="h-4.5 w-4.5" />
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink bg-success" />
              </span>
              <div>
                <div className="text-sm font-bold text-paper">Leo Dispatch</div>
                <div className="text-[11px] text-success">We typically reply in minutes</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:text-paper"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-ink/40 p-4">
            <div className="rounded-2xl rounded-tl-sm bg-surface-2 px-3.5 py-2.5 text-sm text-paper/90">
              👋 Hi! Ask us anything about dispatch, onboarding or your authority — a dispatcher will reply right here.
            </div>
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "visitor" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                    m.from === "visitor"
                      ? "rounded-br-sm bg-yellow text-black"
                      : "rounded-tl-sm bg-surface-2 text-paper/90"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Composer */}
          <form onSubmit={send} className="border-t border-line bg-surface p-3">
            {!hasSent && (
              <div className="mb-2 grid grid-cols-2 gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="field-input !py-2 text-sm"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email (optional)"
                  className="field-input !py-2 text-sm"
                />
              </div>
            )}
            <div className="flex items-end gap-2">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(e);
                  }
                }}
                rows={1}
                placeholder="Type your message…"
                className="field-input max-h-28 min-h-[44px] flex-1 resize-none !py-2.5 text-sm"
              />
              <button
                type="submit"
                disabled={sending || !text.trim()}
                aria-label="Send"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-yellow text-black transition-colors hover:bg-gold disabled:opacity-50"
              >
                {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
