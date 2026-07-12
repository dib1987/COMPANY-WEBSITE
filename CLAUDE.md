# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server at http://localhost:3000
npm run build      # production build (what Vercel runs)
npm run start      # serve the production build locally
```

No linting, testing, or type-checking scripts are configured.

## Architecture

**Next.js 14 (App Router) marketing website** for Bharat AI Automation Labs. Deployed to Vercel.

### Routing model — important
The site is a **single-page app driven by React state**, not by Next.js file-based routing. `app/page.js` renders `<Site />` from `app/site/Site.jsx`, which holds all five "pages" (Home, Services, UseCases, About, Contact) as React components. Navigation is done by a `page` state string and a `go(pageId)` function. There are no additional Next.js route segments for the UI.

### File map
| Path | Role |
|---|---|
| `app/site/Site.jsx` | Entire frontend — all page components, icons, SVG diagrams, nav, footer, and the client-side router |
| `app/globals.css` | Design system: CSS custom properties (tokens), utility classes, scroll-reveal animation (`.reveal / .in`), SVG animations (`.flow-dash`, `.pulse-node`), responsive helpers |
| `app/layout.js` | HTML shell, page `<title>` and `<meta description>` |
| `app/api/lead/route.js` | `POST /api/lead` — contact form handler: honeypot check, validation, rate limiter, webhook forward, owner notification email, personalized auto-reply |
| `app/api/calendly/route.js` | `POST /api/calendly` — Calendly `invitee.created` webhook: HMAC-SHA256 signature verification, branded booking confirmation email |
| `lib/email.js` | Shared email layer: `autoReplyEmail()`, `bookingConfirmEmail()`, `sendViaResend()`, branded HTML shell, industry/size personalization hooks |

### Design system (no Tailwind)
All styling is custom CSS in `app/globals.css`. Key tokens:
- **Display font:** Space Grotesk (`var(--display)`) · **Body:** Inter (`var(--body)`)
- **Colors:** Ink `#0B1020` · Navy `#11193A` · Cream `#F6F7F9` · Accent blue `#2B59FF`
- **Backgrounds:** `.ink-gradient` · `.navy-gradient` · `.bg-cream` · `.bg-ink`
- **Scroll reveal:** add class `reveal` to an element; the `useReveal()` hook (IntersectionObserver) adds `in` when it enters the viewport
- **SVG animation classes:** `.flow-dash` (animated stroke-dashoffset) · `.pulse-node` (opacity pulse) · `.draw` (stroke draw-on)
- Responsive breakpoints are inline `<style>` tags scoped to each section, not a global grid system

### Environment variables
Defined in `.env.example`. Copy to `.env.local` for local development.

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Required for all email sending (Resend) |
| `LEAD_TO_EMAIL` | Where owner notification emails land |
| `LEAD_FROM_EMAIL` | Verified sender address on your Resend domain |
| `LEAD_WEBHOOK_URL` | Optional: forward leads to n8n/Make/Zapier |
| `CALENDLY_WEBHOOK_SIGNING_KEY` | Optional: HMAC key to verify Calendly webhook signatures |

If neither `RESEND_API_KEY` nor `LEAD_WEBHOOK_URL` is set, leads are logged to console only (safe for first-run testing).

### API route behavior
- `/api/lead`: honeypot field (`company_website`) silently accepts bot submissions; real validation requires `name`, `company_name`, valid `email`, and `problem`. In-memory rate limiter (5 req/min/IP — resets on cold start; not cross-instance safe).
- `/api/calendly`: skips non-`invitee.created` events. Signature verification is bypassed if `CALENDLY_WEBHOOK_SIGNING_KEY` is unset (dev only).
- Email send failures in the auto-reply path are swallowed and logged; they do not fail the lead submission.

### Calendly embed
The Calendly widget is commented out in `Contact` in `Site.jsx`. To enable it, replace the placeholder block with your real inline embed code and set up the webhook per `DEPLOY.md`.
