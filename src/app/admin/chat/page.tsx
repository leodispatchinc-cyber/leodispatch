import AdminChat from "@/components/admin/AdminChat";

export const dynamic = "force-dynamic";

export default function AdminChatPage() {
  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-extrabold">Live Chat</h1>
        <p className="mt-1 text-sm text-muted">
          Reply to visitors chatting from the website in real time. New messages arrive automatically.
        </p>
      </div>
      <AdminChat />
    </div>
  );
}
