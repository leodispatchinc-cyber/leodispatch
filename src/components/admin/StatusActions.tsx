import { CheckCircle2, Clock3, XCircle, RotateCcw } from "lucide-react";
import { setOnboardingStatus } from "@/app/admin/actions";
import type { OnboardingSubmission } from "@/lib/store";

const OPTIONS: {
  status: OnboardingSubmission["status"];
  label: string;
  icon: typeof CheckCircle2;
  active: string;
}[] = [
  { status: "approved", label: "Approve", icon: CheckCircle2, active: "border-success text-success" },
  { status: "in-review", label: "In review", icon: Clock3, active: "border-blue-400 text-blue-400" },
  { status: "rejected", label: "Reject", icon: XCircle, active: "border-red-400 text-red-400" },
  { status: "new", label: "Reset", icon: RotateCcw, active: "border-yellow text-yellow" },
];

/**
 * Approve / review / reject controls for a submission.
 * Each button is a tiny <form> bound to the server action — no client JS.
 */
export default function StatusActions({
  id,
  current,
}: {
  id: string;
  current: OnboardingSubmission["status"];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((o) => {
        const isCurrent = current === o.status;
        return (
          <form key={o.status} action={setOnboardingStatus.bind(null, id, o.status)}>
            <button
              type="submit"
              disabled={isCurrent}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                isCurrent
                  ? `${o.active} cursor-default opacity-100`
                  : "border-line text-muted hover:border-paper hover:text-paper"
              }`}
            >
              <o.icon className="h-3.5 w-3.5" /> {o.label}
            </button>
          </form>
        );
      })}
    </div>
  );
}
