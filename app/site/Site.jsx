'use client';

import React, { useState, useEffect, useRef } from "react";

/**
 * AI Automation Studio — Version 1
 * Single self-contained React artifact. Tailwind for layout, an injected
 * design-system stylesheet for tokens, type, motion and bespoke component styles.
 *
 * Ports cleanly to Next.js + Tailwind:
 *  - The design-system CSS now lives in app/globals.css.
 *  - Replace the `page` state router with the Next.js App Router (one file per page).
 *  - Keep the SVG components and section components as-is.
 *
 * Design system
 *  Display: Space Grotesk | Body: Inter
 *  Ink #0B1020 · Navy #11193A · Cream #F6F7F9 · Accent (electric blue) #2B59FF
 *  Signature device: a single electric-blue flow thread that runs through the site
 *  and becomes the connector inside every workflow diagram.
 */

/* ------------------------------------------------------------------ */
/*  Scroll reveal hook                                                 */
/* ------------------------------------------------------------------ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

/* ------------------------------------------------------------------ */
/*  Bespoke icon set (custom line icons, no clichés)                   */
/* ------------------------------------------------------------------ */
const ic = { fill: "none", stroke: "#2B59FF", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
const IconLead = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" {...ic}><path d="M3 7l9 6 9-6"/><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M16 19l2 2 4-4"/></svg>
);
const IconProcess = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" {...ic}><circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.4 6H15a3 3 0 0 1 3 3v6.4"/><path d="M15.6 18H9a3 3 0 0 1-3-3V8.6"/></svg>
);
const IconDoc = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" {...ic}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13l1.6 1.6L14 11"/></svg>
);
const IconQA = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" {...ic}><path d="M9 8l-4 4 4 4"/><path d="M15 8l4 4-4 4"/><path d="M13 5l-2 14"/></svg>
);
const IconAgent = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" {...ic}><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/></svg>
);
const IconCompass = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" {...ic}><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>
);
const IconClock = () => (<svg width="26" height="26" viewBox="0 0 24 24" {...ic}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>);
const IconRepeat = () => (<svg width="26" height="26" viewBox="0 0 24 24" {...ic}><path d="M4 9a6 6 0 0 1 10-4l3 3"/><path d="M20 15a6 6 0 0 1-10 4l-3-3"/><path d="M17 4v4h-4M7 20v-4h4"/></svg>);
const IconBrainless = () => (<svg width="26" height="26" viewBox="0 0 24 24" {...ic}><path d="M4 18l5-6 4 3 7-9"/><path d="M16 6h4v4"/></svg>);

/* ------------------------------------------------------------------ */
/*  Logo                                                               */
/* ------------------------------------------------------------------ */
function Logo({ dark }) {
  const c = dark ? "#fff" : "#0B1020";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
        <rect x="1" y="1" width="30" height="30" rx="8" fill="#2B59FF" />
        <path d="M8 21l5-11 5 11" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.5 17h5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="23" cy="11" r="2.4" fill="#fff" />
      </svg>
      <span style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "1.06rem", color: c, letterSpacing: "-0.01em" }}>
        Bharat<span className="text-accent"> AI Automation</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Workflow diagrams (bespoke inline SVG, animated flow thread)       */
/* ------------------------------------------------------------------ */
function FlowNode({ x, label, sub, active }) {
  return (
    <g>
      <rect x={x} y={34} width="118" height="60" rx="12" fill={active ? "#11193A" : "rgba(255,255,255,.04)"} stroke={active ? "#2B59FF" : "rgba(255,255,255,.18)"} strokeWidth="1.3" />
      <text x={x + 59} y={60} textAnchor="middle" fill="#fff" fontFamily="Space Grotesk" fontSize="12.5" fontWeight="600">{label}</text>
      <text x={x + 59} y={78} textAnchor="middle" fill="#9AA3BE" fontFamily="Inter" fontSize="9.5">{sub}</text>
    </g>
  );
}
function LeadFlowDiagram() {
  const xs = [16, 186, 356, 526];
  return (
    <svg viewBox="0 0 660 130" width="100%" style={{ maxWidth: 720 }} role="img" aria-label="Lead capture to AI follow-up to booked appointment">
      {[0, 1, 2].map((i) => (
        <line key={i} x1={xs[i] + 118} y1="64" x2={xs[i + 1]} y2="64" stroke="#2B59FF" strokeWidth="2" className="flow-dash" />
      ))}
      {[0, 1, 2].map((i) => (
        <circle key={"d" + i} cx={(xs[i] + 118 + xs[i + 1]) / 2} cy="64" r="3.4" fill="#5B82FF" className="pulse-node" />
      ))}
      <FlowNode x={xs[0]} label="Lead capture" sub="form · site · call" active />
      <FlowNode x={xs[1]} label="Qualify" sub="intent + routing" />
      <FlowNode x={xs[2]} label="AI follow-up" sub="email / SMS" />
      <FlowNode x={xs[3]} label="Booked" sub="appointment set" active />
    </svg>
  );
}
function DocFlowDiagram() {
  const xs = [16, 186, 356, 526];
  return (
    <svg viewBox="0 0 660 130" width="100%" style={{ maxWidth: 720 }} role="img" aria-label="Document upload to extraction to validation to approval">
      {[0, 1, 2].map((i) => (
        <line key={i} x1={xs[i] + 118} y1="64" x2={xs[i + 1]} y2="64" stroke="#2B59FF" strokeWidth="2" className="flow-dash" />
      ))}
      {[0, 1, 2].map((i) => (
        <circle key={"d" + i} cx={(xs[i] + 118 + xs[i + 1]) / 2} cy="64" r="3.4" fill="#5B82FF" className="pulse-node" />
      ))}
      <FlowNode x={xs[0]} label="Upload" sub="intake doc" active />
      <FlowNode x={xs[1]} label="Extract" sub="fields + data" />
      <FlowNode x={xs[2]} label="Validate" sub="flag missing" />
      <FlowNode x={xs[3]} label="Approve" sub="route + audit" active />
    </svg>
  );
}

/* Hero animated orbit graphic (custom) */
function HeroGraphic() {
  return (
    <svg viewBox="0 0 460 420" width="100%" className="float-y" aria-hidden="true">
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2B59FF" />
          <stop offset="1" stopColor="#5B82FF" />
        </linearGradient>
        <radialGradient id="hglow" cx="50%" cy="42%" r="55%">
          <stop offset="0" stopColor="rgba(43,89,255,.30)" />
          <stop offset="1" stopColor="rgba(43,89,255,0)" />
        </radialGradient>
      </defs>
      <circle cx="230" cy="195" r="190" fill="url(#hglow)" />
      <circle cx="230" cy="195" r="150" fill="none" stroke="rgba(255,255,255,.10)" />
      <circle cx="230" cy="195" r="108" fill="none" stroke="rgba(255,255,255,.13)" />
      <circle cx="230" cy="195" r="64" fill="none" stroke="rgba(91,130,255,.5)" className="draw" />
      {/* flow thread weaving through */}
      <path d="M40 250 C150 180 150 120 230 120 S360 210 430 150" fill="none" stroke="url(#hg)" strokeWidth="2.4" className="flow-dash" />
      <path d="M40 150 C140 230 200 270 230 270 S350 180 430 250" fill="none" stroke="rgba(91,130,255,.55)" strokeWidth="1.6" strokeDasharray="3 7" />
      {/* nodes */}
      {[[230,120],[230,270],[40,250],[430,150],[40,150],[430,250]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="6.5" fill="#0B1020" stroke="#2B59FF" strokeWidth="2" className="pulse-node" style={{animationDelay:`${i*0.3}s`}}/>
      ))}
      {/* core */}
      <rect x="196" y="161" width="68" height="68" rx="16" fill="url(#hg)" />
      <path d="M214 213l11-26 11 26" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M219 205h12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared layout pieces                                               */
/* ------------------------------------------------------------------ */
const NAV = [
  ["home", "Home"],
  ["services", "Services"],
  ["usecases", "Use Cases"],
  ["about", "About"],
  ["contact", "Contact"],
];

function Nav({ page, go, scrolled }) {
  const [open, setOpen] = useState(false);
  return (
    <header className={"nav " + (scrolled ? "nav-scrolled" : "")}>
      <div className="nav-inner" style={{ maxWidth: 1200, margin: "0 auto", padding: scrolled ? "0.7rem 1.4rem" : "1.15rem 1.4rem" }}>
        <button onClick={() => { go("home"); setOpen(false); }} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <Logo dark />
        </button>

        <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="desktop-nav">
          <div style={{ display: "flex", gap: "1.7rem" }} className="nav-links-row">
            {NAV.map(([id, label]) => (
              <button key={id} onClick={() => go(id)} className={"nav-link " + (page === id ? "active" : "")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                {label}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm cta-desktop" onClick={() => go("contact")}>
            Book a Free Consultation <span className="arrow">→</span>
          </button>
        </nav>

        <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label="Menu"
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5 }}>
          <span style={{ width: 24, height: 2, background: "#fff", display: "block" }} />
          <span style={{ width: 24, height: 2, background: "#fff", display: "block" }} />
          <span style={{ width: 24, height: 2, background: "#fff", display: "block" }} />
        </button>
      </div>

      {open && (
        <div className="mobile-menu" style={{ background: "rgba(11,16,32,.97)", backdropFilter: "blur(14px)", borderTop: "1px solid var(--line-dark)", padding: "1rem 1.4rem 1.6rem" }}>
          {NAV.map(([id, label]) => (
            <button key={id} onClick={() => { go(id); setOpen(false); }}
              style={{ display: "block", width: "100%", textAlign: "left", padding: ".9rem 0", background: "none", border: "none", borderBottom: "1px solid var(--line-dark)", color: page === id ? "#fff" : "rgba(255,255,255,.7)", fontSize: "1.05rem", fontWeight: 500, cursor: "pointer", fontFamily: "var(--display)" }}>
              {label}
            </button>
          ))}
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1.1rem" }} onClick={() => { go("contact"); setOpen(false); }}>
            Book a Free Consultation →
          </button>
        </div>
      )}

      <style>{`
        @media(max-width:880px){
          .desktop-nav{display:none!important;}
          .mobile-toggle{display:flex!important;}
        }
        @media(min-width:881px){ .mobile-menu{display:none;} }
      `}</style>
    </header>
  );
}

function Section({ children, dark, navy, className = "", id, style }) {
  const bg = dark ? "ink-gradient" : navy ? "navy-gradient" : "bg-cream";
  return (
    <section id={id} className={`${bg} ${className}`} style={{ position: "relative", ...style }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "5.5rem 1.4rem", position: "relative", zIndex: 2 }}>
        {children}
      </div>
    </section>
  );
}

function SectionTag({ children, dark }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: ".7rem", marginBottom: "1.1rem" }}>
      <span className="hr-accent" />
      <span className="eyebrow" style={{ color: dark ? "var(--accent-2)" : "var(--accent)" }}>{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HOME                                                               */
/* ------------------------------------------------------------------ */
function Home({ go }) {
  return (
    <>
      {/* HERO */}
      <section className="ink-gradient grain" style={{ position: "relative", overflow: "hidden", paddingTop: "7rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.4rem 5rem", position: "relative", zIndex: 2 }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: "2rem", alignItems: "center" }}>
            <div>
              <div className="reveal in" style={{ display: "inline-flex", alignItems: "center", gap: ".6rem", padding: ".4rem .9rem", borderRadius: 999, border: "1px solid var(--line-dark)", background: "rgba(255,255,255,.04)", marginBottom: "1.6rem" }}>
                <span style={{ width: 7, height: 7, borderRadius: 99, background: "var(--accent)" }} className="pulse-node" />
                <span style={{ color: "var(--muted-dark)", fontSize: ".8rem", fontWeight: 500 }}>AI systems for service businesses</span>
              </div>
              <h1 className="text-white reveal in" style={{ fontSize: "clamp(2.3rem,5vw,3.9rem)", fontWeight: 700, marginBottom: "1.4rem" }}>
                AI Automation Solutions for Businesses That Want to <span className="text-accent">Save Time</span>, <span className="text-accent">Recover Leads</span>, and Reduce Manual Work
              </h1>
              <p className="text-muted-dark reveal in" style={{ fontSize: "1.12rem", maxWidth: 560, marginBottom: "2.1rem" }}>
                We help service-based businesses build practical AI workflows for lead follow-up, document processing, customer communication, AI training, and internal operations.
              </p>
              <div className="reveal in" style={{ display: "flex", gap: ".9rem", flexWrap: "wrap" }}>
                <button className="btn btn-primary" onClick={() => go("contact")}>Book a Free Consultation <span className="arrow">→</span></button>
                <button className="btn btn-ghost-dark" onClick={() => go("usecases")}>Explore Use Cases</button>
              </div>
            </div>
            <div className="hero-art reveal in">
              <HeroGraphic />
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: "linear-gradient(180deg,transparent,var(--cream))", zIndex: 2 }} />
        <style>{`@media(max-width:880px){.hero-grid{grid-template-columns:1fr!important;}.hero-art{display:none;}}`}</style>
      </section>

      {/* STAT MARQUEE BAND */}
      <div className="bg-ink" style={{ borderTop: "1px solid var(--line-dark)", borderBottom: "1px solid var(--line-dark)", padding: "1.1rem 0", overflow: "hidden" }}>
        <div className="marquee-mask">
          <div className="marquee">
            {[...Array(2)].map((_, k) => (
              <div key={k} style={{ display: "flex", gap: "3rem", paddingRight: "3rem", alignItems: "center" }}>
                {["Lead follow-up in minutes, not days", "Fewer missed inquiries", "Less manual document checking", "Faster customer response", "Repetitive work, automated", "Teams trained to build with AI", "One system, your existing workflow"].map((t, i) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", color: "rgba(255,255,255,.62)", fontFamily: "var(--display)", fontWeight: 500, fontSize: "1rem", whiteSpace: "nowrap" }}>
                    <span style={{ color: "var(--accent)" }}>✦</span> {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BENEFIT CARDS */}
      <Section>
        <div className="reveal"><SectionTag>Why it matters</SectionTag>
          <h2 style={{ fontSize: "clamp(1.8rem,3.4vw,2.6rem)", maxWidth: 640, marginBottom: "2.8rem" }}>Three things a practical AI system actually changes.</h2>
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.4rem" }}>
          {[
            { icon: <IconLead />, t: "Recover Missed Leads", d: "Automatically follow up with website visitors, form submissions, and missed inquiries.", n: "01" },
            { icon: <IconRepeat />, t: "Automate Repetitive Work", d: "Reduce manual tasks across emails, forms, documents, CRM, and internal operations.", n: "02" },
            { icon: <IconBrainless />, t: "Improve Decision Making", d: "Use AI to analyze pain points, leads, documents, and customer intent.", n: "03" },
          ].map((c, i) => (
            <div key={i} className="card reveal" style={{ padding: "2rem 1.8rem", transitionDelay: `${i * 0.08}s` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.4rem" }}>
                <div className="icon-chip">{c.icon}</div>
                <span style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "1.5rem", color: "var(--cream-2)" }}>{c.n}</span>
              </div>
              <h3 style={{ fontSize: "1.3rem", marginBottom: ".7rem" }}>{c.t}</h3>
              <p className="text-muted" style={{ fontSize: ".98rem" }}>{c.d}</p>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:780px){.grid-3{grid-template-columns:1fr!important;}}`}</style>
      </Section>

      {/* PROBLEM — dark, parallax */}
      <section className="grain fixed-bg" style={{ position: "relative", backgroundImage: "linear-gradient(160deg, rgba(8,12,24,.92), rgba(11,16,32,.96)), radial-gradient(80% 60% at 80% 10%, rgba(43,89,255,.18), transparent)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "6.5rem 1.4rem", position: "relative", zIndex: 2 }}>
          <div className="reveal"><SectionTag dark>The real problem</SectionTag></div>
          <h2 className="text-white reveal" style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)", maxWidth: 900, marginBottom: "2.5rem" }}>
            Most businesses do not have an AI problem. They have a <span className="text-accent">process problem.</span>
          </h2>
          <div className="grid-prob reveal" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "1rem" }}>
            {["Leads are missed", "Follow-ups delayed", "Documents checked manually", "Teams repeat the same tasks daily", "Customer data scattered across emails, forms, spreadsheets & CRMs"].map((t, i) => (
              <div key={i} className="card-dark" style={{ padding: "1.3rem" }}>
                <span style={{ color: "var(--accent-2)", fontFamily: "var(--display)", fontWeight: 700, fontSize: ".85rem" }}>0{i + 1}</span>
                <p className="text-white" style={{ marginTop: ".6rem", fontSize: ".95rem", lineHeight: 1.4 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:900px){.grid-prob{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
      </section>

      {/* SOLUTION */}
      <Section>
        <div className="sol-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div className="reveal">
            <SectionTag>The approach</SectionTag>
            <h2 style={{ fontSize: "clamp(1.9rem,3.6vw,2.7rem)", marginBottom: "1.3rem" }}>
              We design AI systems that fit into your existing business workflow.
            </h2>
            <p className="text-muted" style={{ fontSize: "1.08rem", maxWidth: 480 }}>
              From lead capture to follow-up, document review to internal task automation — solutions that help teams move faster without adding manual work.
            </p>
          </div>
          <div className="reveal card" style={{ padding: "2rem 1.6rem", background: "#fff" }}>
            <p className="eyebrow text-muted" style={{ marginBottom: "1.2rem" }}>How a lead becomes a booking</p>
            <div style={{ background: "var(--ink)", borderRadius: 14, padding: "1.4rem 1rem" }}>
              <LeadFlowDiagram />
            </div>
          </div>
        </div>
        <style>{`@media(max-width:820px){.sol-grid{grid-template-columns:1fr!important;}}`}</style>
      </Section>

      {/* SERVICES PREVIEW */}
      <Section navy className="grain">
        <div className="reveal"><SectionTag dark>What we build</SectionTag>
          <h2 className="text-white" style={{ fontSize: "clamp(1.8rem,3.4vw,2.5rem)", marginBottom: "1rem", maxWidth: 600 }}>Four systems most service businesses need first.</h2>
          <p className="text-muted-dark" style={{ maxWidth: 560, marginBottom: "2.6rem", fontSize: "1.02rem" }}>And once the systems run, we train your team to use AI with confidence — practical, hands-on sessions built around your real work, so the tools actually get adopted.</p>
        </div>
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.2rem" }}>
          {[
            { icon: <IconLead />, t: "Lead Recovery Automation" },
            { icon: <IconDoc />, t: "Document Processing AI" },
            { icon: <IconProcess />, t: "Business Workflow Automation" },
            { icon: <IconQA />, t: "AI Training & Enablement" },
          ].map((c, i) => (
            <div key={i} className="card-dark reveal" style={{ padding: "1.7rem 1.4rem", transitionDelay: `${i * 0.07}s` }}>
              <div className="icon-chip" style={{ marginBottom: "1.2rem" }}>{c.icon}</div>
              <h3 className="text-white" style={{ fontSize: "1.12rem", lineHeight: 1.25 }}>{c.t}</h3>
            </div>
          ))}
        </div>
        <div className="reveal" style={{ marginTop: "2.2rem" }}>
          <button className="btn btn-ghost-dark" onClick={() => go("services")}>See all six services →</button>
        </div>
        <style>{`@media(max-width:880px){.grid-4{grid-template-columns:repeat(2,1fr)!important;}}@media(max-width:480px){.grid-4{grid-template-columns:1fr!important;}}`}</style>
      </Section>

      {/* LEAD MAGNET — featured */}
      <Section>
        <div className="reveal card" style={{ position: "relative", overflow: "hidden", padding: 0 }}>
          <div className="audit-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr" }}>
            <div style={{ padding: "3rem 2.6rem" }}>
              <span className="eyebrow text-accent">Free · No obligation</span>
              <h2 style={{ fontSize: "clamp(1.7rem,3.2vw,2.4rem)", margin: ".8rem 0 1rem" }}>Free AI Automation Opportunity Audit</h2>
              <p className="text-muted" style={{ fontSize: "1.06rem", maxWidth: 460, marginBottom: "1.8rem" }}>
                Share your current business workflow. We will identify 3–5 places where AI automation can save time, reduce manual effort, or improve lead conversion.
              </p>
              <button className="btn btn-primary" onClick={() => go("contact")}>Get my free audit <span className="arrow">→</span></button>
            </div>
            <div className="ink-gradient grain" style={{ position: "relative", padding: "2.4rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
                {["Where leads leak", "Hours lost to manual work", "Slow or missed follow-ups"].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: ".9rem", padding: ".95rem 1.1rem", marginBottom: ".7rem", borderRadius: 12, background: "rgba(255,255,255,.05)", border: "1px solid var(--line-dark)" }}>
                    <span style={{ width: 26, height: 26, borderRadius: 8, background: "var(--accent-soft)", border: "1px solid rgba(43,89,255,.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-2)", fontWeight: 700, fontSize: ".8rem" }}>{i + 1}</span>
                    <span className="text-white" style={{ fontSize: ".95rem", fontWeight: 500 }}>{t}</span>
                  </div>
                ))}
                <p className="text-muted-dark" style={{ fontSize: ".82rem", marginTop: ".8rem" }}>You get 3–5 concrete opportunities, ranked by impact.</p>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:820px){.audit-grid{grid-template-columns:1fr!important;}}`}</style>
      </Section>

      {/* CLOSING CTA */}
      <section className="ink-gradient grain" style={{ position: "relative" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "6rem 1.4rem", textAlign: "center", position: "relative", zIndex: 2 }}>
          <h2 className="text-white reveal" style={{ fontSize: "clamp(2rem,4vw,3rem)", marginBottom: "1rem" }}>Not sure where AI fits in your business?</h2>
          <p className="text-muted-dark reveal" style={{ fontSize: "1.1rem", maxWidth: 520, margin: "0 auto 2rem" }}>
            Start with a simple process review. We look at how work moves through your business and show you where automation pays off first.
          </p>
          <div className="reveal"><button className="btn btn-primary" onClick={() => go("contact")}>Request Free Review <span className="arrow">→</span></button></div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  SERVICES                                                           */
/* ------------------------------------------------------------------ */
function Services({ go }) {
  const items = [
    { icon: <IconLead />, tag: "Gyms · Dentists · Clinics · Real estate · Coaching", t: "AI Lead Recovery & Follow-up Automation", d: "Captures leads from forms, websites, social, or missed calls and follows up automatically via email, SMS, and workflows." },
    { icon: <IconProcess />, tag: "Operations", t: "AI Business Process Automation", d: "Form processing, email routing, customer onboarding, internal approvals, CRM updates, reminders, and task creation." },
    { icon: <IconDoc />, tag: "Healthcare · Insurance · Finance · HR · Legal admin", t: "AI Document Processing", d: "Intake forms, validation, missing-field detection, risk scoring, approval / rejection routing, and a full audit trail." },
    { icon: <IconQA />, tag: "Teams · Founders · Startups", t: "AI Training & Enablement", d: "Practical, hands-on AI training and workflow design for your team — so people actually adopt AI and start building with it, not just talking about it.", strong: true },
    { icon: <IconAgent />, tag: "Custom", t: "Custom AI Agents & Workflows", d: "Chatbot, internal assistant, sales assistant, support assistant, and data extraction agent — built around your process." },
    { icon: <IconCompass />, tag: "Strategy", t: "AI Readiness Consultation", d: "We analyze your current process and identify where AI can reduce cost, save time, or increase revenue." },
  ];
  return (
    <>
      <PageHero eyebrow="Services" title={<>Six systems. <span className="text-accent">Plain-English</span> outcomes.</>}
        sub="Every service below is described by what it does for your business — not the technology under the hood." />
      <Section>
        <div className="grid-svc" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.4rem" }}>
          {items.map((s, i) => (
            <div key={i} className="card reveal" style={{ padding: "2rem 1.9rem", position: "relative", transitionDelay: `${(i % 2) * 0.07}s` }}>
              {s.strong && <span style={{ position: "absolute", top: 18, right: 18, fontSize: ".68rem", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--accent)", background: "var(--accent-soft)", padding: ".3rem .6rem", borderRadius: 999 }}>Strongest area</span>}
              <div className="icon-chip" style={{ marginBottom: "1.3rem" }}>{s.icon}</div>
              <p className="eyebrow text-muted" style={{ marginBottom: ".6rem", fontSize: ".66rem" }}>{s.tag}</p>
              <h3 style={{ fontSize: "1.32rem", marginBottom: ".7rem" }}>{s.t}</h3>
              <p className="text-muted" style={{ fontSize: ".98rem" }}>{s.d}</p>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:820px){.grid-svc{grid-template-columns:1fr!important;}}`}</style>
      </Section>
      <CTAband go={go} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  USE CASES                                                          */
/* ------------------------------------------------------------------ */
function UseCases({ go }) {
  const cases = [
    { tag: "Fitness", t: "Gym Lead Follow-up Agent", p: "Leads submit forms but staff follow up late — or forget.", s: "AI responds, qualifies, answers common questions, and nudges the lead to book a visit.", o: "Faster response, fewer lost leads, better conversion.", metric: "Minutes, not days, to first reply", diagram: <LeadFlowDiagram /> },
    { tag: "Dental", t: "Dental Missed Appointment Recovery", p: "Missed calls and website visitors don't always convert.", s: "An AI follow-up workflow engages them and sends booking reminders.", o: "Recovered appointments that would otherwise be lost.", metric: "More chairs filled from existing demand", diagram: <LeadFlowDiagram /> },
    { tag: "Healthcare", t: "Healthcare Document Review Agent", p: "Staff manually check intake docs, insurance forms, and missing info.", s: "AI extracts, validates, flags missing data, and routes for review.", o: "Less manual checking, faster intake.", metric: "Manual document review, sharply reduced", diagram: <DocFlowDiagram /> },
    { tag: "Teams & Founders", t: "AI Training & Enablement", p: "Teams want to use AI but don't know where to start — or how to do it safely.", s: "Hands-on AI training and workflow design built around your real business tasks, not generic theory.", o: "Teams that actually adopt AI and start building with it.", metric: "From curious to capable, fast", diagram: <TrainDiagram /> },
  ];
  return (
    <>
      <PageHero eyebrow="Use Cases" title={<>Examples sell better than <span className="text-accent">services.</span></>}
        sub="Each one mapped the same way: the problem, the system we build, and the business outcome." />
      <Section>
        {cases.map((c, i) => (
          <div key={i} className="case-row reveal" style={{ display: "grid", gridTemplateColumns: i % 2 ? "1fr 1.05fr" : "1.05fr 1fr", gap: "2.4rem", alignItems: "center", padding: "2.6rem 0", borderTop: i ? "1px solid var(--line)" : "none" }}>
            <div style={{ order: i % 2 ? 2 : 1 }}>
              <span className="eyebrow text-accent">{c.tag}</span>
              <h3 style={{ fontSize: "clamp(1.5rem,2.6vw,2rem)", margin: ".7rem 0 1.3rem" }}>{c.t}</h3>
              <Step label="Problem" text={c.p} />
              <Step label="Solution" text={c.s} />
              <Step label="Outcome" text={c.o} last />
              <div style={{ marginTop: "1.3rem", display: "inline-flex", alignItems: "center", gap: ".7rem", padding: ".6rem 1rem", borderRadius: 999, background: "var(--accent-soft)", border: "1px solid rgba(43,89,255,.2)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--accent)" }} />
                <span style={{ color: "var(--accent)", fontWeight: 600, fontSize: ".9rem" }}>{c.metric}</span>
              </div>
            </div>
            <div style={{ order: i % 2 ? 1 : 2 }} className="case-diagram ink-gradient grain" >
              <div style={{ position: "relative", zIndex: 2, padding: "2rem 1.4rem", borderRadius: 18 }}>
                <p className="eyebrow text-muted-dark" style={{ marginBottom: "1.2rem" }}>The workflow</p>
                {c.diagram}
              </div>
            </div>
          </div>
        ))}
        <style>{`
          .case-diagram{border-radius:18px;}
          @media(max-width:820px){.case-row{grid-template-columns:1fr!important;}.case-row > div{order:initial!important;}}
        `}</style>
      </Section>
      <CTAband go={go} />
    </>
  );
}
function TrainDiagram() {
  const xs = [16, 186, 356, 526];
  return (
    <svg viewBox="0 0 660 130" width="100%" style={{ maxWidth: 720 }} role="img" aria-label="Assess to train to apply to scale">
      {[0, 1, 2].map((i) => (<line key={i} x1={xs[i] + 118} y1="64" x2={xs[i + 1]} y2="64" stroke="#2B59FF" strokeWidth="2" className="flow-dash" />))}
      {[0, 1, 2].map((i) => (<circle key={"d" + i} cx={(xs[i] + 118 + xs[i + 1]) / 2} cy="64" r="3.4" fill="#5B82FF" className="pulse-node" />))}
      <FlowNode x={xs[0]} label="Assess" sub="real tasks" active />
      <FlowNode x={xs[1]} label="Train" sub="hands-on" />
      <FlowNode x={xs[2]} label="Apply" sub="to your work" />
      <FlowNode x={xs[3]} label="Scale" sub="team adopts" active />
    </svg>
  );
}
function Step({ label, text, last }) {
  return (
    <div style={{ display: "flex", gap: "1rem", marginBottom: last ? 0 : "1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: ".66rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: last ? "var(--accent)" : "var(--muted)", whiteSpace: "nowrap", width: 64 }}>{label}</span>
      </div>
      <p className="text-ink" style={{ fontSize: "1rem", marginTop: "-2px" }}>{text}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ABOUT                                                              */
/* ------------------------------------------------------------------ */
function About({ go }) {
  return (
    <>
      <PageHero eyebrow="About" title={<>Practical AI, built from <span className="text-accent">delivery experience.</span></>}
        sub="Founder-led. No hype. Working systems that reduce manual effort and create measurable value." />
      <Section>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3.4rem", alignItems: "start" }}>
          <div className="reveal">
            <p style={{ fontSize: "1.18rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              <span style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "1.6rem" }}>I'm Dibyendu Mondal — Dib.</span> 12+ years building software, automating how businesses run, and now designing AI workflows and agentic solutions that do real, measurable work.
            </p>
            <p className="text-muted" style={{ fontSize: "1.06rem", marginBottom: "1.3rem" }}>
              The recurring pattern: businesses lose time and money not because people are lazy, but because processes are disconnected, repetitive, and hard to scale.
            </p>
            <p className="text-muted" style={{ fontSize: "1.06rem" }}>
              Now I help businesses use AI automation practically — not as hype, but as working systems that reduce manual effort, improve follow-up, and create measurable value.
            </p>
            <div style={{ marginTop: "2rem" }}>
              <button className="btn btn-primary" onClick={() => go("contact")}>Book a Free Consultation <span className="arrow">→</span></button>
            </div>
          </div>
          <div className="reveal" style={{ display: "grid", gap: "1rem" }}>
            {[
              { k: "12+ yrs", v: "Software development & automation" },
              { k: "AI Workflows", v: "Agentic solutions that do real work" },
              { k: "Process-first", v: "Systems that fit how you already work" },
              { k: "No hype", v: "Outcomes over buzzwords" },
            ].map((s, i) => (
              <div key={i} className="card" style={{ padding: "1.4rem 1.6rem", display: "flex", alignItems: "baseline", gap: "1.2rem" }}>
                <span style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: "1.4rem", color: "var(--accent)", minWidth: 150 }}>{s.k}</span>
                <span className="text-muted" style={{ fontSize: ".98rem" }}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:820px){.about-grid{grid-template-columns:1fr!important;gap:2rem!important;}}`}</style>
      </Section>

      {/* principles band */}
      <Section navy className="grain">
        <div className="reveal"><SectionTag dark>How I work</SectionTag>
          <h2 className="text-white" style={{ fontSize: "clamp(1.7rem,3.2vw,2.4rem)", maxWidth: 600, marginBottom: "2.4rem" }}>A few principles that keep the work honest.</h2>
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.2rem" }}>
          {[
            { t: "Start with the process", d: "We map how work actually moves before automating anything. The bottleneck is rarely where people assume." },
            { t: "Build for your stack", d: "Solutions fit your existing tools and workflow — not a rip-and-replace that nobody adopts." },
            { t: "Measure the outcome", d: "Time saved, leads recovered, manual checks removed. If it can't be measured, it isn't done." },
          ].map((c, i) => (
            <div key={i} className="card-dark reveal" style={{ padding: "1.8rem 1.5rem", transitionDelay: `${i * 0.07}s` }}>
              <span style={{ color: "var(--accent-2)", fontFamily: "var(--display)", fontWeight: 700 }}>0{i + 1}</span>
              <h3 className="text-white" style={{ fontSize: "1.18rem", margin: ".7rem 0 .6rem" }}>{c.t}</h3>
              <p className="text-muted-dark" style={{ fontSize: ".95rem" }}>{c.d}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  CONTACT                                                            */
/* ------------------------------------------------------------------ */
function Contact() {
  // Point this at your deployed endpoint (see the backend/ folder). Set to "" to keep a local demo success state.
  const FORM_ENDPOINT = "/api/lead";
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.company_website) return;           // honeypot: a bot filled the hidden field
    if (!FORM_ENDPOINT) { setSent(true); return; } // demo mode, no backend wired
    try {
      setSubmitting(true);
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      setSent(true);
    } catch (err) {
      setError("Something went wrong. Please try again, or email us directly.");
    } finally {
      setSubmitting(false);
    }
  }
  const industries = ["Gym / Fitness studio", "Dental / Healthcare clinic", "Real estate", "Coaching / Consulting", "Software / Startup", "Insurance / Finance", "Other local service"];
  const companySizes = ["1-10", "11-50", "51-200", "201-1000", "1001-5000", "5000+"];
  const budgets = ["Not sure yet", "Under $1k", "$1k – $5k", "$5k – $15k", "$15k +"];
  const contactPref = ["Email", "Phone"];
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Request a <span className="text-accent">Free AI Automation Review.</span></>}
        sub="Tell us where work gets stuck. We'll show you where automation pays off first — no obligation." />
      <Section>
        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: "2.4rem", alignItems: "start" }}>
          {/* FORM */}
          <div className="reveal card" style={{ padding: "2.4rem 2.2rem" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div className="icon-chip" style={{ margin: "0 auto 1.2rem", width: 64, height: 64 }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" {...ic}><path d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 style={{ fontSize: "1.5rem", marginBottom: ".6rem" }}>Request received.</h3>
                <p className="text-muted">We'll review your workflow and reply with 3–5 concrete automation opportunities, usually within one business day.</p>
                <button className="btn btn-ghost" style={{ marginTop: "1.4rem" }} onClick={() => setSent(false)}>Send another →</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* honeypot — invisible to people, bots fill it and get silently dropped */}
                <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
                <div className="form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.1rem" }}>
                  <Field label="Name" required><input name="name" className="field" required placeholder="Your name" /></Field>
                  <Field label="Email" required><input type="email" name="email" className="field" required placeholder="you@business.com" /></Field>
                </div>
                <div className="form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.1rem" }}>
                  <Field label="Company name" required><input name="company_name" className="field" required placeholder="Your company" /></Field>
                  <Field label="Phone"><input type="tel" name="phone" className="field" placeholder="+91 ..." /></Field>
                </div>
                <div className="form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.1rem" }}>
                  <Field label="Industry">
                    <select name="industry" className="field" defaultValue=""><option value="" disabled>Select industry</option>{industries.map((x) => <option key={x}>{x}</option>)}</select>
                  </Field>
                  <Field label="Company size">
                    <select name="company_size" className="field" defaultValue=""><option value="" disabled>Select company size</option>{companySizes.map((x) => <option key={x}>{x}</option>)}</select>
                  </Field>
                </div>
                <Field label="Current tools used"><input name="tools" className="field" placeholder="CRM, email, spreadsheets..." /></Field>
                <Field label="What problem are you trying to solve?" required>
                  <textarea name="problem" className="field" rows={4} required placeholder="e.g. leads come in but we follow up too late and lose them" style={{ resize: "vertical" }} />
                </Field>
                <div className="form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.1rem" }}>
                  <Field label="Budget range (optional)">
                    <select name="budget" className="field" defaultValue=""><option value="" disabled>Select range</option>{budgets.map((x) => <option key={x}>{x}</option>)}</select>
                  </Field>
                  <Field label="Preferred contact method">
                    <select name="contact_method" className="field" defaultValue=""><option value="" disabled>Select method</option>{contactPref.map((x) => <option key={x}>{x}</option>)}</select>
                  </Field>
                </div>
                {error && <p style={{ color: "#D14343", fontSize: ".85rem", marginTop: ".5rem" }}>{error}</p>}
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: ".6rem", opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}>
                  {submitting ? "Sending..." : <>Request a Free AI Automation Review <span className="arrow">→</span></>}
                </button>
                <p className="text-muted" style={{ fontSize: ".78rem", textAlign: "center", marginTop: ".9rem" }}>We typically reply within one business day.</p>
              </form>
            )}
          </div>

          {/* Calendly widget hidden for now — re-enable when ready to embed */}
          <div className="reveal" style={{ display: "grid", gap: "1.2rem" }}>
            <div className="card" style={{ padding: "1.6rem" }}>
              <p className="eyebrow text-muted" style={{ marginBottom: ".9rem" }}>What happens next</p>
              {["Tell us about your business and where work gets stuck", "We map your workflow and find the automation opportunities", "You get 3–5 ranked opportunities, usually within one business day"].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: ".8rem", alignItems: "center", marginBottom: ".7rem" }}>
                  <span style={{ width: 24, height: 24, borderRadius: 99, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: ".8rem", flexShrink: 0 }}>{i + 1}</span>
                  <span className="text-muted" style={{ fontSize: ".92rem" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media(max-width:860px){.contact-grid{grid-template-columns:1fr!important;}}@media(max-width:520px){.form-2col{grid-template-columns:1fr!important;}}`}</style>
      </Section>
    </>
  );
}
function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label className="label">{label}{required && <span style={{ color: "var(--accent)" }}> *</span>}</label>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable page hero + CTA band                                      */
/* ------------------------------------------------------------------ */
function PageHero({ eyebrow, title, sub }) {
  return (
    <section className="ink-gradient grain" style={{ position: "relative", overflow: "hidden", paddingTop: "8.5rem" }}>
      <div style={{ position: "absolute", top: -120, right: -80, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,89,255,.22), transparent 65%)", zIndex: 1 }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.4rem 4rem", position: "relative", zIndex: 2 }}>
        <div className="reveal in"><SectionTag dark>{eyebrow}</SectionTag></div>
        <h1 className="text-white reveal in" style={{ fontSize: "clamp(2.2rem,5vw,3.6rem)", maxWidth: 880, marginBottom: "1.2rem" }}>{title}</h1>
        <p className="text-muted-dark reveal in" style={{ fontSize: "1.12rem", maxWidth: 560 }}>{sub}</p>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 70, background: "linear-gradient(180deg,transparent,var(--cream))", zIndex: 2 }} />
    </section>
  );
}
function CTAband({ go }) {
  return (
    <section className="grain fixed-bg" style={{ position: "relative", backgroundImage: "linear-gradient(160deg, rgba(11,16,32,.95), rgba(8,12,24,.97)), radial-gradient(70% 60% at 20% 20%, rgba(43,89,255,.2), transparent)" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "5.5rem 1.4rem", textAlign: "center", position: "relative", zIndex: 2 }}>
        <h2 className="text-white reveal" style={{ fontSize: "clamp(1.9rem,3.8vw,2.8rem)", marginBottom: "1rem" }}>See where AI pays off first.</h2>
        <p className="text-muted-dark reveal" style={{ fontSize: "1.05rem", maxWidth: 480, margin: "0 auto 1.8rem" }}>Tell us about your business and we'll map your highest-impact automation opportunities — free, no obligation.</p>
        <div className="reveal"><button className="btn btn-primary" onClick={() => go("contact")}>Get Your Free AI Automation Review <span className="arrow">→</span></button></div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */
function Footer({ go }) {
  return (
    <footer className="bg-ink grain" style={{ position: "relative", borderTop: "1px solid var(--line-dark)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3.5rem 1.4rem 2.2rem", position: "relative", zIndex: 2 }}>
        <div className="foot-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "2rem", marginBottom: "2.5rem" }}>
          <div>
            <Logo dark />
            <p className="text-muted-dark" style={{ marginTop: "1rem", maxWidth: 320, fontSize: ".95rem" }}>
              AI Systems That Help Businesses Save Time and Recover Lost Opportunities.
            </p>
          </div>
          <div>
            <p className="eyebrow text-muted-dark" style={{ marginBottom: "1rem" }}>Navigate</p>
            {NAV.map(([id, label]) => (
              <button key={id} onClick={() => go(id)} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,.7)", cursor: "pointer", padding: ".3rem 0", fontSize: ".95rem", fontFamily: "var(--body)" }}>{label}</button>
            ))}
          </div>
          <div>
            <p className="eyebrow text-muted-dark" style={{ marginBottom: "1rem" }}>Start here</p>
            <button className="btn btn-primary btn-sm" onClick={() => go("contact")}>Free Automation Audit →</button>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--line-dark)", paddingTop: "1.4rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: ".6rem" }}>
          <span className="text-muted-dark" style={{ fontSize: ".82rem" }}>© {new Date().getFullYear()} Bharat AI Automation. All rights reserved.</span>
          <span className="text-muted-dark" style={{ fontSize: ".82rem" }}>Built for service businesses that want to move faster.</span>
        </div>
      </div>
      <style>{`@media(max-width:720px){.foot-grid{grid-template-columns:1fr!important;}}`}</style>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Sticky contact FAB                                                 */
/* ------------------------------------------------------------------ */
function ContactFab({ go, page }) {
  if (page === "contact") return null;
  return (
    <button className="contact-fab btn btn-primary" onClick={() => go("contact")} aria-label="Contact" style={{ boxShadow: "0 14px 34px -10px rgba(43,89,255,.7)" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
      <span className="fab-label">Let's talk</span>
      <style>{`@media(max-width:520px){.fab-label{display:none;}}`}</style>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */
export default function App() {
  const [page, setPage] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const topRef = useRef(null);

  useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="site-root" ref={topRef}>
      <Nav page={page} go={go} scrolled={scrolled} />
      <main>
        {page === "home" && <Home go={go} />}
        {page === "services" && <Services go={go} />}
        {page === "usecases" && <UseCases go={go} />}
        {page === "about" && <About go={go} />}
        {page === "contact" && <Contact go={go} />}
      </main>
      <Footer go={go} />
      <ContactFab go={go} page={page} />
    </div>
  );
}
