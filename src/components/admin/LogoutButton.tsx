"use client";

export default function LogoutButton() {
  const onClick = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {}
    window.location.href = "/admin/login";
  };

  return (
    <button
      onClick={onClick}
      className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-gold hover:text-gold"
    >
      Log out
    </button>
  );
}
