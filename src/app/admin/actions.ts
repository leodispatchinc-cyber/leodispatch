"use server";

import { revalidatePath } from "next/cache";
import { updateOnboarding, type OnboardingSubmission } from "@/lib/store";

/**
 * Admin server action — update the review status of an onboarding submission.
 * Used by the Document Verification section and the submission detail page.
 */
export async function setOnboardingStatus(
  id: string,
  status: OnboardingSubmission["status"]
) {
  await updateOnboarding(id, { status });
  // refresh every view that reflects a submission's status
  revalidatePath("/admin");
  revalidatePath("/admin/onboarding");
  revalidatePath(`/admin/onboarding/${id}`);
  revalidatePath("/admin/document-verification");
  revalidatePath("/admin/owner-operators");
  revalidatePath("/admin/analytics");
}
