import AdminChat from "@/components/admin/AdminChat";

export const dynamic = "force-dynamic";

export default function AdminChatPage() {
  return (
    // Bound the page to the viewport (minus the admin chrome) so the chat panel
    // fills the remaining space instead of overflowing below the browser fold.
    // lg subtracts the 4rem header + 4rem main padding; smaller screens subtract
    // the mobile top bar + their main padding.
    <div className="flex h-[calc(100dvh-5.75rem)] min-h-[460px] flex-col sm:h-[calc(100dvh-6.75rem)] lg:h-[calc(100dvh-8rem)]">
      <div className="shrink-0">
        <h1 className="font-display text-2xl font-extrabold">Live Chat</h1>
        <p className="mt-1 text-sm text-muted">
          Reply to visitors chatting from the website in real time. New messages arrive automatically.
        </p>
      </div>
      <AdminChat />
    </div>
  );
}
