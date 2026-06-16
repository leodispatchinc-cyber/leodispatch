import type { LucideIcon } from "lucide-react";

export default function Empty({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="mt-6 grid place-items-center rounded-2xl border border-dashed border-line bg-surface py-20 text-center">
      <Icon className="h-10 w-10 text-gold" />
      <p className="mt-4 max-w-sm text-sm text-muted">{label}</p>
    </div>
  );
}
