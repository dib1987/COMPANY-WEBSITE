// lib/email.js — shared email helpers for the lead + Calendly routes.
// One place to keep tone, branding, and the Resend call.

export function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const firstName = (name = "") => (name.trim().split(/\s+/)[0] || "there");

const BRAND = "Bharat AI Automation";
const SIGNOFF_NAME = "Dib";
const SIGNOFF_FULL = "Dibyendu Mondal";

// Shell that wraps any email body in the branded layout. Email clients need
// inline styles, so everything is inlined on purpose.
function shell(innerHtml, footerNote) {
  return `<div style="margin:0;padding:0;background:#f6f7f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f9;padding:24px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e3e6ed;">
        <tr><td style="background:#0b1020;padding:22px 28px;">
          <span style="color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:-0.3px;">Bharat <span style="color:#2b59ff;">AI Automation</span></span>
        </td></tr>
        <tr><td style="padding:28px;">${innerHtml}</td></tr>
        <tr><td style="padding:16px 28px;background:#f6f7f9;border-top:1px solid #e3e6ed;">
          <p style="margin:0;font-size:12px;color:#8a90a2;">${escapeHtml(footerNote)}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</div>`;
}

const sig = `<p style="margin:0;font-size:15px;color:#0b1020;line-height:1.5;">Talk soon,<br/><strong>${SIGNOFF_NAME}</strong><br/><span style="color:#5b6478;">${SIGNOFF_FULL} · ${BRAND}</span></p>`;

// ---------------------------------------------------------------------------
// Auto-reply: sent to the person who submitted the contact form.
// ---------------------------------------------------------------------------
// Light industry-specific framing so the reply feels written for this lead,
// not a generic template. Falls back to a neutral line for unknown industries.
const INDUSTRY_HOOKS = {
  "Gym / Fitness studio": "missed-call follow-ups and trial-membership drop-off",
  "Dental / Healthcare clinic": "appointment reminders, no-shows, and patient follow-up",
  "Real estate": "speed-to-lead on new inquiries and listing follow-ups",
  "Coaching / Consulting": "discovery-call booking and lead nurture",
  "Software / Startup": "demo requests, onboarding, and support follow-up",
  "Insurance / Finance": "quote follow-ups and document collection",
  "Other local service": "lead follow-up and scheduling",
};

const SIZE_HOOKS = {
  "1-10": "where a small team feels every dropped lead",
  "11-50": "where a growing team needs follow-up to stay consistent",
  "51-200": "where manual follow-up starts to break down across a bigger team",
  "201-1000": "where process gaps multiply across departments",
  "1001-5000": "where small process gaps get expensive at scale",
  "5000+": "where small process gaps get expensive at scale",
};

export function autoReplyEmail({ name, company_name, industry, company_size, problem }) {
  const fn = firstName(name);
  const company = company_name && company_name.trim() ? company_name.trim() : "your business";
  const subject = `Got it, ${fn} — your AI automation review for ${company} is on the way`;

  const industryHook = INDUSTRY_HOOKS[industry];
  const sizeHook = SIZE_HOOKS[company_size];
  const contextLine = industryHook
    ? `I work with a lot of ${industry.toLowerCase()} businesses, and ${industryHook} is almost always one of the first places automation pays off${sizeHook ? ` — especially ${sizeHook}` : ""}.`
    : sizeHook
    ? `That's exactly the kind of thing I look for first — ${sizeHook}.`
    : null;

  const text = [
    `Hi ${fn},`,
    ``,
    `Thanks for reaching out. I've got your request for a free AI automation review for ${company}.`,
    ``,
    problem ? `Here's what you told me you're trying to solve:\n"${problem.trim()}"\n` : ``,
    contextLine ? `${contextLine}\n` : ``,
    `What happens next:`,
    `1. I look at how work actually moves through ${company}.`,
    `2. I find 3-5 places where automation can save time, recover leads, or cut manual effort.`,
    `3. You get them back from me, ranked by impact - usually within one business day.`,
    ``,
    `No pitch. No jargon. Just where AI pays off for you.`,
    ``,
    `If something's urgent, reply to this email and we'll sort a time.`,
    ``,
    `Talk soon,`,
    SIGNOFF_NAME,
    SIGNOFF_FULL,
    BRAND,
  ].filter((l) => l !== undefined).join("\n");

  const inner = `
    <p style="margin:0 0 14px;font-size:16px;color:#0b1020;">Hi ${escapeHtml(fn)},</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#33384a;">Thanks for reaching out. I've got your request for a free AI automation review for <strong>${escapeHtml(company)}</strong>.</p>
    ${problem ? `<div style="margin:0 0 18px;padding:12px 16px;background:#f1f4ff;border-left:3px solid #2b59ff;border-radius:6px;"><p style="margin:0;font-size:14px;color:#33384a;font-style:italic;">&ldquo;${escapeHtml(problem.trim())}&rdquo;</p></div>` : ``}
    ${contextLine ? `<p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#33384a;">${escapeHtml(contextLine)}</p>` : ``}
    <p style="margin:0 0 8px;font-size:15px;color:#0b1020;font-weight:bold;">What happens next</p>
    <p style="margin:0 0 6px;font-size:15px;line-height:1.55;color:#33384a;">1. I look at how work actually moves through ${escapeHtml(company)}.</p>
    <p style="margin:0 0 6px;font-size:15px;line-height:1.55;color:#33384a;">2. I find 3-5 places where automation can save time, recover leads, or cut manual effort.</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#33384a;">3. You get them back, ranked by impact - usually within one business day.</p>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#33384a;">No pitch. No jargon. Just where AI pays off for you.</p>
    <p style="margin:0 0 22px;font-size:15px;line-height:1.55;color:#33384a;">If something's urgent, just reply to this email.</p>
    ${sig}`;

  return { subject, text, html: shell(inner, `You're getting this because you requested a free automation review at ${BRAND}.`) };
}

// ---------------------------------------------------------------------------
// Booking confirmation: sent when someone books a call via Calendly.
// ---------------------------------------------------------------------------
export function bookingConfirmEmail({ name, eventName, startTime, timezone }) {
  const fn = firstName(name);
  const when = formatWhen(startTime, timezone);
  const ev = eventName && eventName.trim() ? eventName.trim() : "our call";
  const subject = `You're booked, ${fn} — ${when}`;

  const text = [
    `Hi ${fn},`,
    ``,
    `You're booked in for ${ev}.`,
    `When: ${when}${timezone ? ` (${timezone})` : ""}`,
    ``,
    `Before we talk, have a rough idea of where work gets stuck for you - missed leads, slow follow-ups, manual document checking, repetitive tasks. That's all I need to point you at the highest-impact automation first.`,
    ``,
    `Need to move it? Use the reschedule link in your Calendly confirmation, or just reply here.`,
    ``,
    `Talk soon,`,
    SIGNOFF_NAME,
    SIGNOFF_FULL,
    BRAND,
  ].join("\n");

  const inner = `
    <p style="margin:0 0 14px;font-size:16px;color:#0b1020;">Hi ${escapeHtml(fn)},</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#33384a;">You're booked in for <strong>${escapeHtml(ev)}</strong>.</p>
    <div style="margin:0 0 18px;padding:14px 16px;background:#f1f4ff;border-left:3px solid #2b59ff;border-radius:6px;">
      <p style="margin:0;font-size:15px;color:#0b1020;"><strong>When:</strong> ${escapeHtml(when)}${timezone ? ` <span style="color:#5b6478;">(${escapeHtml(timezone)})</span>` : ""}</p>
    </div>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#33384a;">Before we talk, have a rough idea of where work gets stuck for you - missed leads, slow follow-ups, manual document checking, repetitive tasks. That's all I need to point you at the highest-impact automation first.</p>
    <p style="margin:0 0 22px;font-size:15px;line-height:1.55;color:#33384a;">Need to move it? Use the reschedule link in your Calendly confirmation, or just reply here.</p>
    ${sig}`;

  return { subject, text, html: shell(inner, `Booking confirmation from ${BRAND}.`) };
}

function formatWhen(startTime, timezone) {
  if (!startTime) return "the time you picked";
  try {
    const d = new Date(startTime);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit",
      timeZone: timezone || undefined,
    }).format(d);
  } catch {
    return String(startTime);
  }
}

// ---------------------------------------------------------------------------
// Resend transport. Throws on failure so callers can decide what's critical.
// ---------------------------------------------------------------------------
export async function sendViaResend({ from, to, replyTo, subject, text, html }) {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, reply_to: replyTo, subject, text, html }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${detail}`);
  }
  return res.json();
}
