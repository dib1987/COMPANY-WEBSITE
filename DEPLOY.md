# Deploy to Vercel (GitHub) + test — step by step

This project is a complete Next.js 14 app. It has been build-tested:
`next build` compiles clean, with `/`, `/api/lead`, and `/api/calendly`.

Order: set up Resend (so the auto-reply works on your first test) -> push to
GitHub -> import in Vercel -> add env vars -> test.

---

## Part 1 — Resend (email), ~10-15 min

You need this for the lead email + the personalized auto-reply.

1. Sign up at https://resend.com (free tier is fine to start).
2. Add your domain: **Domains -> Add Domain** (e.g. `bharataiautomation.com`).
   - If you don't own a domain yet, buy one first (Namecheap, Cloudflare, etc.).
   - You can test with Resend's shared `onboarding@resend.dev` sender, but real
     deliverability needs your own verified domain. Do the domain.
3. Resend shows you DNS records (SPF, DKIM, and a MX/return-path). Add them in
   your domain's DNS panel. Wait for Resend to show **Verified** (minutes to a
   few hours depending on your DNS host).
4. Create an API key: **API Keys -> Create**. Copy it (starts with `re_`).
5. Decide two addresses:
   - `LEAD_FROM_EMAIL` -> e.g. `leads@yourdomain.com` (must be on the verified domain)
   - `LEAD_TO_EMAIL`   -> where you want new leads to land (your inbox)

Keep the API key handy for Part 3.

---

## Part 2 — Push to GitHub

From inside the `nextjs-app` folder:

```bash
cd nextjs-app
git init
git add .
git commit -m "Bharat AI Automation - v1"
```

Create an empty repo on github.com (no README), then:

```bash
git remote add origin https://github.com/<you>/<repo>.git
git branch -M main
git push -u origin main
```

`node_modules` and `.env*` are gitignored, so nothing secret or heavy is pushed.

---

## Part 3 — Import in Vercel

1. Go to https://vercel.com -> **Add New -> Project** -> import your GitHub repo.
2. **Root Directory:** if you pushed the *whole* `ai-automation-website` folder,
   set Root Directory to `nextjs-app`. If you pushed `nextjs-app` itself as the
   repo root, leave it as `.`. (Framework auto-detects as Next.js. Leave build
   and output settings default.)
3. **Environment Variables** — add these before the first deploy:

   | Name | Value |
   |------|-------|
   | `RESEND_API_KEY` | your `re_...` key |
   | `LEAD_TO_EMAIL` | where leads should land |
   | `LEAD_FROM_EMAIL` | `leads@yourdomain.com` (verified domain) |

   Optional now, recommended later:
   | `LEAD_WEBHOOK_URL` | n8n/Make/Zapier webhook, if you want leads in a CRM too |
   | `CALENDLY_WEBHOOK_SIGNING_KEY` | only if you wire the Calendly webhook |

4. Click **Deploy**. Vercel runs `next build` (the same build that passed here)
   and gives you a live URL like `https://your-project.vercel.app`.

---

## Part 4 — Test it

1. Open the live URL. Click through all 5 pages on desktop and on your phone.
2. Go to **Contact**, fill the form with your *own* email, submit.
   - You should see the "Request received" state.
   - **You** get a "New lead: ..." email at `LEAD_TO_EMAIL`.
   - **The submitter address** gets the personalized auto-reply within seconds.
3. If an email doesn't arrive:
   - Check spam.
   - In Vercel: **Project -> Logs**, find the `/api/lead` request and read the
     log line. `auto-reply failed: ...` or a Resend error tells you exactly what.
   - Most common cause: domain not fully verified in Resend, or `LEAD_FROM_EMAIL`
     is not on the verified domain.

That's the full test loop. Nothing here touches your content, so you can deploy,
test, and only then decide on changes.

---

## Part 5 — Calendly booking email (optional, later)

Calendly already emails its own confirmation. To also send your branded one:

1. Add a Calendly widget on the Contact page (replace the placeholder block in
   `app/site/Site.jsx` with your real inline embed).
2. Calendly (Pro+) -> create a webhook subscription for `invitee.created`
   pointing at `https://your-project.vercel.app/api/calendly`.
3. Copy the webhook signing key into the `CALENDLY_WEBHOOK_SIGNING_KEY` env var
   in Vercel and redeploy.
4. Book a test slot -> you get the personalized booking email.

---

## Quick reference: local run

```bash
cd nextjs-app
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (what Vercel runs)
```
