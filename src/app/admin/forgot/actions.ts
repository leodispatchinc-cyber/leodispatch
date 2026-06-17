"use server";

import { isMailConfigured, sendMail } from "@/lib/mailer";

export type ForgotState = { ok?: boolean; message?: string; error?: string };

// crude per-instance throttle so the button can't be used to spam the inbox
let lastSentAt = 0;
const THROTTLE_MS = 60_000;

export async function forgotAction(
  _prev: ForgotState,
  _formData: FormData
): Promise<ForgotState> {
  const to = process.env.ADMIN_NOTIFY_EMAIL || "leodispatchinc@gmail.com";
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    return { error: "No admin password is configured on the server." };
  }
  if (!isMailConfigured()) {
    return {
      error:
        "Email delivery isn't set up yet. Add the Gmail App Password (SMTP_PASS) to enable this.",
    };
  }

  const now = Date.now();
  if (now - lastSentAt < THROTTLE_MS) {
    return { error: "Please wait a minute before requesting again." };
  }
  lastSentAt = now;

  try {
    await sendMail({
      to,
      subject: "Leo Dispatch Inc — Admin login details",
      text: [
        "Here are your Leo Dispatch Inc admin login details:",
        "",
        "Login URL: https://leodispatchinc.com/admin",
        `Username:  ${username}`,
        `Password:  ${password}`,
        "",
        "If you did not request this, change the ADMIN_PASSWORD env var immediately.",
      ].join("\n"),
    });
    return { ok: true, message: `Your login details were sent to ${to}.` };
  } catch {
    lastSentAt = 0; // allow a retry on failure
    return { error: "Could not send the email. Check the SMTP credentials and try again." };
  }
}
