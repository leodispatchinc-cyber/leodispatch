"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  updateOnboarding,
  deleteOnboarding,
  deleteContact,
  deleteApplication,
  type OnboardingSubmission,
} from "@/lib/store";

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

/** Delete an onboarding submission (+ its uploaded files) and return to the list. */
export async function deleteOnboardingAction(id: string) {
  await deleteOnboarding(id);
  revalidatePath("/admin");
  revalidatePath("/admin/onboarding");
  revalidatePath("/admin/uploaded-documents");
  revalidatePath("/admin/owner-operators");
  revalidatePath("/admin/document-verification");
  revalidatePath("/admin/dispatch-leads");
  revalidatePath("/admin/analytics");
  redirect("/admin/onboarding");
}

export async function deleteContactAction(id: string) {
  await deleteContact(id);
  revalidatePath("/admin");
  revalidatePath("/admin/contact-requests");
  revalidatePath("/admin/dispatch-leads");
}

export async function deleteApplicationAction(id: string) {
  await deleteApplication(id);
  revalidatePath("/admin");
  revalidatePath("/admin/applications");
  revalidatePath("/admin/dispatch-leads");
}
