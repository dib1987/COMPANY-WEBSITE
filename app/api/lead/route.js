// Next.js App Router serverless function — handles the contact form.
// Path: app/api/lead/route.js  → endpoint: POST /api/lead
// Notifies you of the lead AND sends the person a personalized auto-reply.

import { autoReplyEmail, sendViaResend } from "../../../lib/email";

export const runtime = "nodejs";

// --- tiny in-memory rate limiter (per IP) -------------------------------
// Stops casual abuse. For real protection across serverless instances,
// swap for Upstash Redis (see README).
const HITS = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_PER_WINDOW = 5;

function rateLimited(ip) {
  const now = Date.now();
  const rec = HITS.get(ip) || { count: 0, start: now };
  if (now - rec.start > WINDOW_MS) {
    HITS.set(ip, { count: 1, start: now });
    return false;
  }
  rec.count += 1;
  HITS.set(ip, rec);
  return rec.count > MAX_PER_WINDOW;
}

// --- helpers ------------------------------------------------------------
const isEmail = (v) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const clean = (v, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (rateLimited(ip)) {
      return json({ ok: false, error: "Too many requests. Please try again shortly." }, 429);
    }

    const body = await req.json().catch(() => ({}));

    // 1) Honeypot — real users never fill this. Pretend success for bots.
    if (clean(body.company_website)) {
      return json({ ok: true });
    }

    // 2) Validate + sanitize
    const lead = {
      name: clean(body.name, 120),
      company_name: clean(body.company_name, 160),
      email: clean(body.email, 200),
      phone: clean(body.phone, 40),
      industry: clean(body.industry, 80),
      company_size: clean(body.company_size, 40),
      tools: clean(body.tools, 300),
      problem: clean(body.problem, 4000),
      budget: clean(body.budget, 40),
      contact_method: clean(body.contact_method, 40),
      submitted_at: new Date().toISOString(),
      ip,
    };

    const missing = [];
    if (!lead.name) missing.push("name");
    if (!lead.company_name) missing.push("company_name");
    if (!isEmail(lead.email)) missing.push("email");
    if (!lead.problem) missing.push("problem");
    if (missing.length) {
      return json({ ok: false, error: `Missing or invalid: ${missing.join(", ")}` }, 400);
    }

    const resendReady = !!process.env.RESEND_API_KEY;
    const fromEmail = process.env.LEAD_FROM_EMAIL || "leads@yourdomain.com";

    // 3) Notify YOU about the lead (webhook and/or email). These decide success.
    const tasks = [];

    if (process.env.LEAD_WEBHOOK_URL) {
      tasks.push(
        fetch(process.env.LEAD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
        }).then((r) => {
          if (!r.ok) throw new Error("webhook failed");
          return r;
        })
      );
    }

    if (resendReady && process.env.LEAD_TO_EMAIL) {
      const ownerText = Object.entries(lead).map(([k, v]) => `${k}: ${v}`).join("\n");
      tasks.push(
        sendViaResend({
          from: fromEmail,
          to: process.env.LEAD_TO_EMAIL,
          replyTo: lead.email,
          subject: `New lead: ${lead.name} — ${lead.company_name}`,
          text: ownerText,
        })
      );
    }

    if (tasks.length === 0) {
      console.log("LEAD (no delivery configured):", lead);
    } else {
      const results = await Promise.allSettled(tasks);
      const anyDelivered = results.some((r) => r.status === "fulfilled");
      if (!anyDelivered) {
        return json({ ok: false, error: "Could not deliver your request. Please email us directly." }, 502);
      }
    }

    // 4) Personalized auto-reply to the person who reached out.
    //    Best-effort: awaited so it actually sends on serverless, but a
    //    failure here never blocks accepting the lead.
    if (resendReady) {
      try {
        const reply = autoReplyEmail(lead);
        await sendViaResend({
          from: `Dib — Bharat AI Automation Labs <${fromEmail}>`,
          to: lead.email,
          replyTo: process.env.LEAD_TO_EMAIL || fromEmail,
          subject: reply.subject,
          text: reply.text,
          html: reply.html,
        });
      } catch (e) {
        console.error("auto-reply failed:", e.message);
      }
    }

    return json({ ok: true });
  } catch (err) {
    console.error("lead route error:", err);
    return json({ ok: false, error: "Server error." }, 500);
  }
}

export async function GET() {
  return json({ ok: false, error: "Method not allowed." }, 405);
}
