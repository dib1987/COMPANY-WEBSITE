// Next.js App Router serverless function — Calendly booking webhook.
// Path: app/api/calendly/route.js  → endpoint: POST /api/calendly
// When someone books a call, Calendly fires "invitee.created" here and we
// send a personalized, branded booking confirmation.
//
// NOTE: Calendly already sends its own confirmation. This adds your branded,
// personal touch on top. Optional — only set up if you want it.

import { createHmac, timingSafeEqual } from "crypto";
import { bookingConfirmEmail, sendViaResend } from "../../../lib/email";

export const runtime = "nodejs";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Verify Calendly's signature header: "t=<ts>,v1=<hex>".
// Signed value is `${t}.${rawBody}` with HMAC-SHA256 over your signing key.
function signatureValid(rawBody, header, key) {
  if (!key) return true; // verification disabled — accept (dev only)
  if (!header) return false;
  try {
    const parts = Object.fromEntries(header.split(",").map((p) => p.split("=")));
    const t = parts.t;
    const v1 = parts.v1;
    if (!t || !v1) return false;
    const expected = createHmac("sha256", key).update(`${t}.${rawBody}`).digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(v1);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(req) {
  try {
    const raw = await req.text();

    if (!signatureValid(raw, req.headers.get("calendly-webhook-signature"), process.env.CALENDLY_WEBHOOK_SIGNING_KEY)) {
      return json({ ok: false, error: "Invalid signature." }, 401);
    }

    const body = JSON.parse(raw || "{}");
    if (body.event !== "invitee.created") {
      return json({ ok: true, skipped: body.event || "unknown" });
    }

    const p = body.payload || {};
    const invitee = {
      name: p.name || "",
      email: p.email || "",
      eventName: p.scheduled_event?.name || "",
      startTime: p.scheduled_event?.start_time || "",
      timezone: p.timezone || "",
    };

    if (!invitee.email) {
      return json({ ok: false, error: "No invitee email in payload." }, 400);
    }

    if (process.env.RESEND_API_KEY) {
      const fromEmail = process.env.LEAD_FROM_EMAIL || "leads@yourdomain.com";
      const mail = bookingConfirmEmail(invitee);
      try {
        await sendViaResend({
          from: `Dib — Bharat AI Automation <${fromEmail}>`,
          to: invitee.email,
          replyTo: process.env.LEAD_TO_EMAIL || fromEmail,
          subject: mail.subject,
          text: mail.text,
          html: mail.html,
        });
      } catch (e) {
        console.error("booking confirm failed:", e.message);
        return json({ ok: false, error: "Email send failed." }, 502);
      }
    } else {
      console.log("BOOKING (no email configured):", invitee);
    }

    return json({ ok: true });
  } catch (err) {
    console.error("calendly route error:", err);
    return json({ ok: false, error: "Server error." }, 500);
  }
}
