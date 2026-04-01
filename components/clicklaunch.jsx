"use client";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ClickLaunch v1 — Production Website Template
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * INSTRUCTIONS FOR CLAUDE (READ THIS FIRST)
 * ──────────────────────────────────────────
 * This file has TWO clearly marked sections:
 *
 *   🔒 CORE SYSTEM (lines marked with "CORE")
 *      DO NOT MODIFY. This is the admin panel, webhook integration, form
 *      submission logic, navigation, footer, and design system.
 *      It is identical across every ClickLaunch site.
 *
 *   ✏️  CLIENT-GENERATED (lines marked with "CLIENT")
 *      YOU WRITE THIS. Generate unique, industry-specific copy, headlines,
 *      descriptions, FAQ answers, blog content, and page layouts for this
 *      specific client. Use the config data but write REAL marketing copy —
 *      not generic filler. Adjust tone, emphasis, and section ordering to
 *      fit the client's industry and market.
 *
 * WHAT TO GENERATE:
 *   - DEFAULT_CONFIG values (business info, services, reviews, blog, FAQ, etc.)
 *   - All page components: PHome, PAbout, PServices, PService, PLocations,
 *     PLocation, PBlog, PBlogPost, PContact, FAQSection
 *   - Unique headlines, CTAs, value propositions per industry
 *   - Service descriptions that sound expert, not templated
 *   - Blog posts with real, helpful content
 *   - FAQ answers that address actual customer concerns
 *
 * WHAT TO KEEP IDENTICAL:
 *   - Everything in the CORE section
 *   - Component signatures (props must match what CORE expects)
 *   - The export default App() structure
 *   - Database IDs (site_id, org_id) — set at deploy time
 *   - Webhook integration — never remove or alter
 *
 * RULES FOR GENERATED COPY:
 *   1. Write like a human marketer, not a template engine
 *   2. Use industry-specific language (a roofer talks differently than a plumber)
 *   3. Vary sentence structure — no "We offer X. We provide Y. We deliver Z."
 *   4. Include local references if location data is available
 *   5. CTAs should feel urgent but not pushy
 *   6. FAQ answers should be genuinely helpful, not just keyword-stuffed
 *   7. Blog posts should teach something real
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Webhook Integration:
 *   site_id   — UUID assigned at deploy time (from sites.websites)
 *   org_id    — UUID of the owning organization
 *   webhooks  — Form submissions POST to GoHighLevel (or any webhook URL)
 *
 * @module ClickLaunch
 * @version 1.0.0
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                                                                         ║
// ║   🔒 CORE SYSTEM — DO NOT MODIFY                                       ║
// ║                                                                         ║
// ║   Everything from here until the CLIENT-GENERATED marker is identical   ║
// ║   across every ClickLaunch site. It handles: admin panel, UI system,    ║
// ║   icons, CSS, form submission, webhooks, nav, footer, popups, and the   ║
// ║   main App shell.                                                       ║
// ║                                                                         ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

// ── CORE: Utilities ───────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);

// ── CORE: Icons ───────────────────────────────────────────────
const ICO = {
  close: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>,
  edit: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  plus: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>,
  trash: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /></svg>,
  eye: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>,
  star: () => <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
  arrow: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>,
  check: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>,
  phone: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.8 19.8 0 014.12 4.18 2 2 0 016.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" /></svg>,
  chev: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>,
  user: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  pin: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  google: () => <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>,
  webhook: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>,
  send: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>,
};

// ── CORE: Global CSS ──────────────────────────────────────────
function GlobalCSS({ p, a, hf, bf }) {
  const headingFont = hf || "Outfit";
  const bodyFont = bf || "Source Sans 3";
  const gfHeading = headingFont.replace(/ /g, "+");
  const gfBody = bodyFont.replace(/ /g, "+");
  return <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Source+Sans+3:wght@400;500;600;700&family=${gfHeading}:wght@300;400;500;600;700;800;900&family=${gfBody}:wght@400;500;600;700&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    :root { --p:${p}; --a:${a}; --hf:${headingFont}; --bf:${bodyFont}; --dk:#070B14; --cd:#0F1629; --bd:#1A2340; --mt:#5A6B8A; --tx:#B4C1DC; --wh:#EFF3FB; }
    ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-track { background:var(--dk); } ::-webkit-scrollbar-thumb { background:var(--bd); border-radius:3px; }
    .mo { position:fixed; inset:0; background:rgba(0,0,0,.75); backdrop-filter:blur(10px); display:flex; align-items:center; justify-content:center; z-index:1000; padding:16px; }
    .mc { background:var(--cd); border:1px solid var(--bd); border-radius:14px; width:100%; max-width:600px; max-height:88vh; overflow-y:auto; padding:26px 28px; }
    .mc.wide { max-width:700px; }
    @keyframes fu { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
    @keyframes si { from { opacity:0; transform:scale(.96); } to { opacity:1; transform:scale(1); } }
    @keyframes su { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
    .fu { animation:fu .4s ease both; } .si { animation:si .25s ease both; } .su { animation:su .35s ease both; }
    .ai:focus { border-color:var(--a) !important; outline:none; box-shadow:0 0 0 3px ${a}20; }
    .sc:hover { transform:translateY(-3px); box-shadow:0 8px 30px rgba(0,0,0,.1); border-color:var(--a) !important; } .sc { transition:all .2s ease; }
    .ac:hover { border-color:var(--a) !important; transform:translateY(-1px); } .ac { transition:all .15s ease; cursor:pointer; }
    .faq-a { max-height:0; overflow:hidden; transition:max-height .3s ease, padding .3s ease; padding:0 18px; }
    .faq-a.open { max-height:500px; padding:0 18px 18px; }
    .po { position:fixed; inset:0; background:rgba(0,0,0,.6); backdrop-filter:blur(6px); z-index:999; display:flex; align-items:center; justify-content:center; padding:16px; }
  `}</style>;
}

// ── CORE: UI Primitives ───────────────────────────────────────
function Lb({ children }) { return <label style={{ display: "block", fontSize: 10.5, fontWeight: 600, color: "var(--mt)", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".07em", fontFamily: "Source Sans 3" }}>{children}</label>; }
function In({ style: es, ...r }) { return <input className="ai" {...r} style={{ width: "100%", padding: "8px 12px", fontSize: 13, background: "var(--dk)", border: "1px solid var(--bd)", borderRadius: 7, color: "var(--tx)", fontFamily: "Source Sans 3", ...es }} />; }
function Ta({ style: es, ...r }) { return <textarea className="ai" {...r} style={{ width: "100%", padding: "8px 12px", fontSize: 13, background: "var(--dk)", border: "1px solid var(--bd)", borderRadius: 7, color: "var(--tx)", fontFamily: "Source Sans 3", minHeight: 80, resize: "vertical", ...es }} />; }
function Fd({ label, children }) { return <div style={{ marginBottom: 14 }}><Lb>{label}</Lb>{children}</div>; }
function Btn({ accent, sm, children, style: es, ...r }) { return <button {...r} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: sm ? "5px 10px" : "7px 14px", fontSize: sm ? 11 : 12, fontWeight: 600, color: accent ? "#fff" : "var(--tx)", background: accent ? "var(--a)" : "transparent", border: accent ? "none" : "1px solid var(--bd)", borderRadius: 7, cursor: "pointer", fontFamily: "Source Sans 3", ...es }}>{children}</button>; }
function Badge({ color, children }) { const bg = color === "green" ? "#132F1F" : color === "red" ? "#2A1A1A" : "#0C2340"; const fg = color === "green" ? "#3FB950" : color === "red" ? "#F85149" : "#58A6FF"; return <span style={{ padding: "2px 8px", fontSize: 10, fontWeight: 600, borderRadius: 8, background: bg, color: fg }}>{children}</span>; }

function Modal({ open, onClose, title, wide, children }) {
  if (!open) return null;
  return (
    <div className="mo" onClick={onClose}>
      <div className={`mc si${wide ? " wide" : ""}`} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17, color: "var(--wh)" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--mt)", cursor: "pointer" }}><ICO.close /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SH({ title, desc, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, gap: 12, flexWrap: "wrap" }}>
      <div><h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, color: "var(--wh)", marginBottom: 3 }}>{title}</h2><p style={{ fontSize: 12.5, color: "var(--mt)", fontFamily: "Source Sans 3" }}>{desc}</p></div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  );
}

// ── CORE: Admin Tab Definitions ───────────────────────────────
const TABS = [
  { k: "business", l: "Business", i: "🏢" },
  { k: "hero", l: "Hero", i: "🎯" },
  { k: "about", l: "About", i: "📖" },
  { k: "team", l: "Team", i: "👥" },
  { k: "services", l: "Services", i: "⚡" },
  { k: "locations", l: "Locations", i: "📍" },
  { k: "reviews", l: "Reviews", i: "⭐" },
  { k: "faq", l: "FAQ", i: "❓" },
  { k: "blog", l: "Blog", i: "📝" },
  { k: "formFields", l: "Form Fields", i: "📋" },
  { k: "popup", l: "Popup & Forms", i: "💬" },
  { k: "formRouting", l: "Routing", i: "📩" },
  { k: "webhooks", l: "Webhooks", i: "🔗" },
  { k: "design", l: "Design", i: "🎨" },
  { k: "cta", l: "Page CTAs", i: "📣" },
  { k: "tracking", l: "Tracking", i: "📊" },
  { k: "seo", l: "SEO", i: "🔍" },
  { k: "users", l: "Users", i: "👤" },
];

// ── CORE: Admin Panel Sections ────────────────────────────────

function ABusiness({ c, s }) { const u = (f, v) => s(p => ({ ...p, business: { ...p.business, [f]: v } })); return <div><SH title="Business Info" desc="Core details." /><div style={{ marginTop: 18 }}>{[["name", "Business Name"], ["tagline", "Tagline"], ["phone", "Phone"], ["email", "Email"], ["address", "Address"], ["serviceArea", "Service Areas"], ["license", "License"], ["yearEstablished", "Year Est."], ["hours", "Business Hours"]].map(([f, l]) => <Fd key={f} label={l}><In value={c.business[f] || ""} onChange={e => u(f, e.target.value)} /></Fd>)}</div></div>; }

function AHero({ c, s }) { const u = (f, v) => s(p => ({ ...p, hero: { ...p.hero, [f]: v } })); return <div><SH title="Hero" desc="First thing visitors see." /><div style={{ marginTop: 18 }}><Fd label="Headline"><Ta value={c.hero.headline} onChange={e => u("headline", e.target.value)} style={{ minHeight: 60 }} /></Fd>{[["subheadline", "Subtext"], ["ctaText", "CTA Button"], ["ctaPhone", "CTA Phone"]].map(([f, l]) => <Fd key={f} label={l}><In value={c.hero[f]} onChange={e => u(f, e.target.value)} /></Fd>)}
    <div style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 10, padding: 16, marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><span style={{ fontSize: 14 }}>🖼️</span><span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 13, color: "var(--wh)" }}>Hero Background Image</span></div>
      <Fd label="Desktop Image URL (1920×800 rec.)"><In value={c.hero.imageDesktop} onChange={e => u("imageDesktop", e.target.value)} placeholder="https://... (landscape, min 1920px wide)" /></Fd>
      <Fd label="Mobile Image URL (800×600 rec.)"><In value={c.hero.imageMobile} onChange={e => u("imageMobile", e.target.value)} placeholder="https://... (portrait/square, optimized for mobile)" /></Fd>
      <Fd label="Overlay Darkness (0-1)"><In type="number" step="0.05" min="0" max="1" value={c.hero.imageOverlay} onChange={e => u("imageOverlay", parseFloat(e.target.value) || 0.7)} /></Fd>
      <p style={{ fontSize: 11, color: "var(--mt)", lineHeight: 1.5 }}>Tip: Upload images to Cloudinary/imgix for auto-optimization.</p>
      {c.hero.imageDesktop && <div style={{ marginTop: 10, borderRadius: 8, overflow: "hidden", border: "1px solid var(--bd)", height: 120 }}><img src={c.hero.imageDesktop} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} /></div>}
    </div>
  </div></div>; }

function AAbout({ c, s }) {
  const u = (f, v) => s(p => ({ ...p, about: { ...p.about, [f]: v } }));
  const uv = (i, f, v) => s(p => ({ ...p, about: { ...p.about, values: p.about.values.map((x, j) => j === i ? { ...x, [f]: v } : x) } }));
  return (<div><SH title="About" desc="Story, stats, values." /><div style={{ marginTop: 18 }}><Fd label="Headline"><In value={c.about.headline} onChange={e => u("headline", e.target.value)} /></Fd><Fd label="Homepage Snippet"><Ta value={c.about.homeSnippet} onChange={e => u("homeSnippet", e.target.value)} style={{ minHeight: 70 }} /></Fd><Fd label="Full Story"><Ta value={c.about.story} onChange={e => u("story", e.target.value)} style={{ minHeight: 130 }} /></Fd><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}><Fd label="Team"><In value={c.about.teamSize} onChange={e => u("teamSize", e.target.value)} /></Fd><Fd label="Jobs"><In value={c.about.jobsCompleted} onChange={e => u("jobsCompleted", e.target.value)} /></Fd><Fd label="Rating"><In value={c.about.avgRating} onChange={e => u("avgRating", e.target.value)} /></Fd></div><Lb>Values</Lb>{c.about.values.map((v, i) => <div key={v.id} style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 9, padding: 12, marginBottom: 8 }}><Fd label={`Value ${i + 1}`}><In value={v.title} onChange={e => uv(i, "title", e.target.value)} /></Fd><Fd label="Desc"><In value={v.desc} onChange={e => uv(i, "desc", e.target.value)} /></Fd></div>)}</div></div>);
}

function ATeam({ c, s }) {
  const [ed, sE] = useState(null); const [d, sD] = useState(null);
  const open = m => { sD({ ...m }); sE(m.id); }; const close = () => { sE(null); sD(null); };
  const save = () => { s(p => ({ ...p, team: p.team.map(t => t.id === ed ? d : t) })); close(); };
  const add = () => { const n = { id: uid(), name: "New Member", role: "", bio: "", photo: "" }; s(p => ({ ...p, team: [...p.team, n] })); open(n); };
  const del = id => { s(p => ({ ...p, team: p.team.filter(t => t.id !== id) })); close(); };
  return (<div><SH title="Team" desc="Shown on About page." right={<Btn onClick={add}><ICO.plus /> Add</Btn>} /><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12, marginTop: 18 }}>{c.team.map(m => <div key={m.id} className="ac" onClick={() => open(m)} style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 10, padding: 16, textAlign: "center" }}><div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--bd)", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mt)" }}><ICO.user /></div><div style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: 13, color: "var(--wh)" }}>{m.name}</div><div style={{ fontSize: 11, color: "var(--mt)" }}>{m.role}</div></div>)}</div><Modal open={!!ed} onClose={close} title={d ? `Edit: ${d.name}` : ""}>{d && <div><Fd label="Name"><In value={d.name} onChange={e => sD({ ...d, name: e.target.value })} /></Fd><Fd label="Role"><In value={d.role} onChange={e => sD({ ...d, role: e.target.value })} /></Fd><Fd label="Bio"><Ta value={d.bio} onChange={e => sD({ ...d, bio: e.target.value })} /></Fd><Fd label="Photo URL"><In value={d.photo} onChange={e => sD({ ...d, photo: e.target.value })} /></Fd><div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--bd)", paddingTop: 16, marginTop: 6 }}><Btn onClick={() => del(d.id)} style={{ color: "#EF4444", borderColor: "#EF4444" }}><ICO.trash /> Remove</Btn><Btn accent onClick={save}>Save</Btn></div></div>}</Modal></div>);
}

function AServices({ c, s }) {
  const [ed, sE] = useState(null); const [d, sD] = useState(null);
  const open = svc => { sD({ ...svc, features: [...(svc.features || [])] }); sE(svc.id); }; const close = () => { sE(null); sD(null); };
  const save = () => { s(p => ({ ...p, services: p.services.map(x => x.id === ed ? d : x) })); close(); };
  const add = () => { const n = { id: `svc-${uid()}`, name: "New Service", shortDesc: "", fullDesc: "", icon: "🔧", price: "", features: [] }; s(p => ({ ...p, services: [...p.services, n] })); open(n); };
  const del = id => { s(p => ({ ...p, services: p.services.filter(x => x.id !== id) })); close(); };
  return (<div><SH title="Services" desc="Each creates its own page." right={<Btn onClick={add}><ICO.plus /> Add</Btn>} /><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(185px,1fr))", gap: 12, marginTop: 18 }}>{c.services.map(svc => <div key={svc.id} className="ac" onClick={() => open(svc)} style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 10, padding: 16, position: "relative" }}><div style={{ fontSize: 26, marginBottom: 8 }}>{svc.icon}</div><div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 13, color: "var(--wh)", marginBottom: 2 }}>{svc.name}</div><div style={{ fontSize: 11, color: "var(--mt)", marginBottom: 8 }}>{svc.shortDesc}</div><div style={{ fontSize: 12, fontWeight: 700, color: "var(--a)" }}>{svc.price}</div></div>)}</div><Modal open={!!ed} onClose={close} title={d ? `Edit: ${d.name}` : ""} wide>{d && <div><div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 8 }}><Fd label="Icon"><In value={d.icon} onChange={e => sD({ ...d, icon: e.target.value })} style={{ textAlign: "center", fontSize: 20 }} /></Fd><Fd label="Name"><In value={d.name} onChange={e => sD({ ...d, name: e.target.value })} /></Fd></div><Fd label="Short Desc"><In value={d.shortDesc} onChange={e => sD({ ...d, shortDesc: e.target.value })} /></Fd><Fd label="Price"><In value={d.price} onChange={e => sD({ ...d, price: e.target.value })} /></Fd><Fd label="Full Description"><Ta value={d.fullDesc} onChange={e => sD({ ...d, fullDesc: e.target.value })} style={{ minHeight: 110 }} /></Fd><Lb>Features</Lb>{d.features.map((f, i) => <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}><In value={f} onChange={e => { const nf = [...d.features]; nf[i] = e.target.value; sD({ ...d, features: nf }); }} style={{ flex: 1 }} /><button onClick={() => sD({ ...d, features: d.features.filter((_, j) => j !== i) })} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer" }}><ICO.trash /></button></div>)}<button onClick={() => sD({ ...d, features: [...d.features, ""] })} style={{ fontSize: 11, color: "var(--a)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, marginBottom: 14 }}>+ Add Feature</button><div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--bd)", paddingTop: 16 }}><Btn onClick={() => del(d.id)} style={{ color: "#EF4444", borderColor: "#EF4444" }}><ICO.trash /> Delete</Btn><Btn accent onClick={save}>Save</Btn></div></div>}</Modal></div>);
}

function ALocations({ c, s }) {
  const [ed, sE] = useState(null); const [d, sD] = useState(null);
  const open = l => { sD({ ...l, neighborhoods: [...(l.neighborhoods || [])], servicesHighlighted: [...(l.servicesHighlighted || [])] }); sE(l.id); }; const close = () => { sE(null); sD(null); };
  const save = () => { s(p => ({ ...p, locations: p.locations.map(x => x.id === ed ? d : x) })); close(); };
  const add = () => { const n = { id: uid(), name: "", slug: "", headline: "", description: "", neighborhoods: [], servicesHighlighted: [], metaTitle: "", metaDesc: "" }; s(p => ({ ...p, locations: [...p.locations, n] })); open(n); };
  const del = id => { s(p => ({ ...p, locations: p.locations.filter(x => x.id !== id) })); close(); };
  const toggleSvc = sid => sD(prev => ({ ...prev, servicesHighlighted: prev.servicesHighlighted.includes(sid) ? prev.servicesHighlighted.filter(x => x !== sid) : [...prev.servicesHighlighted, sid] }));
  return (<div><SH title="Locations" desc="Location pages for local SEO." right={<Btn onClick={add}><ICO.plus /> Add</Btn>} /><div style={{ display: "grid", gap: 10, marginTop: 18 }}>{c.locations.map(l => <div key={l.id} className="ac" onClick={() => open(l)} style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 10, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ color: "var(--a)" }}><ICO.pin /></span><div><div style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: 13, color: "var(--wh)" }}>{l.name || "Untitled"}</div><div style={{ fontSize: 11, color: "var(--mt)" }}>{l.neighborhoods?.length || 0} areas</div></div></div><ICO.edit /></div>)}</div><Modal open={!!ed} onClose={close} title={d ? `Edit: ${d.name || "Location"}` : ""} wide>{d && <div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><Fd label="Name"><In value={d.name} onChange={e => sD({ ...d, name: e.target.value })} /></Fd><Fd label="Slug"><In value={d.slug} onChange={e => sD({ ...d, slug: e.target.value })} /></Fd></div><Fd label="Headline"><In value={d.headline} onChange={e => sD({ ...d, headline: e.target.value })} /></Fd><Fd label="Description"><Ta value={d.description} onChange={e => sD({ ...d, description: e.target.value })} style={{ minHeight: 100 }} /></Fd><Lb>Neighborhoods</Lb><div style={{ marginBottom: 14 }}>{d.neighborhoods.map((n, i) => <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5 }}><In value={n} onChange={e => { const nn = [...d.neighborhoods]; nn[i] = e.target.value; sD({ ...d, neighborhoods: nn }); }} style={{ flex: 1 }} /><button onClick={() => sD({ ...d, neighborhoods: d.neighborhoods.filter((_, j) => j !== i) })} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer" }}><ICO.trash /></button></div>)}<button onClick={() => sD({ ...d, neighborhoods: [...d.neighborhoods, ""] })} style={{ fontSize: 11, color: "var(--a)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add</button></div><Lb>Highlighted Services</Lb><div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>{c.services.map(svc => <button key={svc.id} onClick={() => toggleSvc(svc.id)} style={{ padding: "5px 12px", fontSize: 11, borderRadius: 7, border: `1px solid ${d.servicesHighlighted.includes(svc.id) ? "var(--a)" : "var(--bd)"}`, background: d.servicesHighlighted.includes(svc.id) ? "rgba(212,136,43,.12)" : "var(--dk)", color: d.servicesHighlighted.includes(svc.id) ? "var(--a)" : "var(--mt)", cursor: "pointer" }}>{svc.icon} {svc.name}</button>)}</div><Fd label="Meta Title"><In value={d.metaTitle} onChange={e => sD({ ...d, metaTitle: e.target.value })} /></Fd><Fd label="Meta Desc"><In value={d.metaDesc} onChange={e => sD({ ...d, metaDesc: e.target.value })} /></Fd><div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--bd)", paddingTop: 16 }}><Btn onClick={() => del(d.id)} style={{ color: "#EF4444", borderColor: "#EF4444" }}><ICO.trash /> Delete</Btn><Btn accent onClick={save}>Save</Btn></div></div>}</Modal></div>);
}

function AReviews({ c, s }) {
  const [ed, sE] = useState(null); const [d, sD] = useState(null);
  const ug = (f, v) => s(p => ({ ...p, reviews: { ...p.reviews, [f]: v } }));
  const openMR = r => { sD({ ...r }); sE(r.id); }; const closeMR = () => { sE(null); sD(null); };
  const saveMR = () => { s(p => ({ ...p, reviews: { ...p.reviews, manualReviews: p.reviews.manualReviews.map(r => r.id === ed ? d : r) } })); closeMR(); };
  const addMR = () => { const n = { id: uid(), author: "", rating: 5, source: "Yelp", text: "" }; s(p => ({ ...p, reviews: { ...p.reviews, manualReviews: [...p.reviews.manualReviews, n] } })); openMR(n); };
  const delMR = id => { s(p => ({ ...p, reviews: { ...p.reviews, manualReviews: p.reviews.manualReviews.filter(r => r.id !== id) } })); closeMR(); };
  return (<div><SH title="Reviews" desc="Google + manual." /><div style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 10, padding: 20, marginTop: 18, marginBottom: 14 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><ICO.google /><span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 13, color: "var(--wh)" }}>Google</span></div><Fd label="Place ID"><In value={c.reviews.googlePlaceId} onChange={e => ug("googlePlaceId", e.target.value)} placeholder="ChIJ..." /></Fd><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><Fd label="Rating"><In type="number" step="0.1" value={c.reviews.overallRating} onChange={e => ug("overallRating", parseFloat(e.target.value) || 0)} /></Fd><Fd label="Total"><In type="number" value={c.reviews.totalReviews} onChange={e => ug("totalReviews", parseInt(e.target.value) || 0)} /></Fd></div></div><div style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 10, padding: 20 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 13, color: "var(--wh)" }}>Manual ({c.reviews.manualReviews.length})</span><Btn sm onClick={addMR}><ICO.plus /> Add</Btn></div>{c.reviews.manualReviews.map(r => <div key={r.id} className="ac" onClick={() => openMR(r)} style={{ background: "var(--dk)", border: "1px solid var(--bd)", borderRadius: 8, padding: 10, marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 12, color: "var(--wh)" }}>{r.author || "—"} ({r.source})</span><ICO.edit /></div>)}</div><Modal open={!!ed} onClose={closeMR} title="Edit Review">{d && <div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><Fd label="Author"><In value={d.author} onChange={e => sD({ ...d, author: e.target.value })} /></Fd><Fd label="Source"><In value={d.source} onChange={e => sD({ ...d, source: e.target.value })} /></Fd></div><Fd label="Rating"><In type="number" min="1" max="5" value={d.rating} onChange={e => sD({ ...d, rating: parseInt(e.target.value) || 5 })} /></Fd><Fd label="Text"><Ta value={d.text} onChange={e => sD({ ...d, text: e.target.value })} /></Fd><div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--bd)", paddingTop: 16, marginTop: 6 }}><Btn onClick={() => delMR(d.id)} style={{ color: "#EF4444", borderColor: "#EF4444" }}><ICO.trash /> Remove</Btn><Btn accent onClick={saveMR}>Save</Btn></div></div>}</Modal></div>);
}

function AFAQ({ c, s }) {
  const [ed, sE] = useState(null); const [d, sD] = useState(null);
  const open = f => { sD({ ...f }); sE(f.id); }; const close = () => { sE(null); sD(null); };
  const save = () => { s(p => ({ ...p, faq: p.faq.map(f => f.id === ed ? d : f) })); close(); };
  const add = () => { const n = { id: uid(), question: "", answer: "" }; s(p => ({ ...p, faq: [...p.faq, n] })); open(n); };
  const del = id => { s(p => ({ ...p, faq: p.faq.filter(f => f.id !== id) })); close(); };
  return (<div><SH title="FAQ" desc="Shown on homepage." right={<Btn onClick={add}><ICO.plus /> Add</Btn>} /><div style={{ display: "grid", gap: 8, marginTop: 18 }}>{c.faq.map((f, i) => <div key={f.id} className="ac" onClick={() => open(f)} style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 8, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: 12.5, color: "var(--wh)" }}>Q{i + 1}: {f.question || "—"}</span><ICO.edit /></div>)}</div><Modal open={!!ed} onClose={close} title="Edit FAQ">{d && <div><Fd label="Question"><In value={d.question} onChange={e => sD({ ...d, question: e.target.value })} /></Fd><Fd label="Answer"><Ta value={d.answer} onChange={e => sD({ ...d, answer: e.target.value })} /></Fd><div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--bd)", paddingTop: 16, marginTop: 6 }}><Btn onClick={() => del(d.id)} style={{ color: "#EF4444", borderColor: "#EF4444" }}><ICO.trash /> Remove</Btn><Btn accent onClick={save}>Save</Btn></div></div>}</Modal></div>);
}

// ── CORE: WYSIWYG Editor ──────────────────────────────────────
function WysiwygEditor({ value, onChange }) {
  const edRef = useRef(null);
  const exec = (cmd, val) => { document.execCommand(cmd, false, val); edRef.current && onChange(edRef.current.innerHTML); };
  const insertImg = () => { const url = prompt("Image URL:"); if (url) exec("insertImage", url); };
  const tb = [
    { cmd: "bold", icon: "B", style: { fontWeight: 800 } },
    { cmd: "italic", icon: "I", style: { fontStyle: "italic" } },
    { cmd: "underline", icon: "U", style: { textDecoration: "underline" } },
    { cmd: "strikeThrough", icon: "S", style: { textDecoration: "line-through" } },
  ];
  const blocks = [
    { cmd: "formatBlock", val: "h2", label: "H2" },
    { cmd: "formatBlock", val: "h3", label: "H3" },
    { cmd: "formatBlock", val: "p", label: "P" },
    { cmd: "insertUnorderedList", val: null, label: "• List" },
    { cmd: "insertOrderedList", val: null, label: "1. List" },
  ];
  const btnS = { padding: "4px 8px", fontSize: 11, background: "var(--dk)", border: "1px solid var(--bd)", borderRadius: 5, color: "var(--tx)", cursor: "pointer", fontFamily: "Source Sans 3" };
  return (<div>
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6, padding: "6px 8px", background: "var(--dk)", border: "1px solid var(--bd)", borderRadius: "7px 7px 0 0" }}>
      {tb.map(b => <button key={b.cmd} onMouseDown={e => { e.preventDefault(); exec(b.cmd); }} style={{ ...btnS, ...b.style, width: 28, textAlign: "center", padding: "4px 0" }}>{b.icon}</button>)}
      <span style={{ width: 1, background: "var(--bd)", margin: "0 4px" }} />
      {blocks.map(b => <button key={b.label} onMouseDown={e => { e.preventDefault(); exec(b.cmd, b.val ? `<${b.val}>` : undefined); }} style={btnS}>{b.label}</button>)}
      <span style={{ width: 1, background: "var(--bd)", margin: "0 4px" }} />
      <button onMouseDown={e => { e.preventDefault(); insertImg(); }} style={{ ...btnS, color: "var(--a)" }}>🖼 Image</button>
      <button onMouseDown={e => { e.preventDefault(); const url = prompt("Link URL:"); if (url) exec("createLink", url); }} style={{ ...btnS, color: "var(--a)" }}>🔗 Link</button>
    </div>
    <div ref={edRef} contentEditable suppressContentEditableWarning onBlur={() => edRef.current && onChange(edRef.current.innerHTML)} dangerouslySetInnerHTML={{ __html: value }} style={{ minHeight: 220, padding: "12px 14px", background: "var(--dk)", border: "1px solid var(--bd)", borderTop: "none", borderRadius: "0 0 7px 7px", color: "var(--tx)", fontSize: 13, lineHeight: 1.7, fontFamily: "Source Sans 3", outline: "none", overflow: "auto" }} />
    <style>{`.ai [contenteditable] h2,.ai [contenteditable] h3{color:var(--wh);margin:12px 0 6px} [contenteditable] img{max-width:100%;border-radius:6px;margin:8px 0} [contenteditable] a{color:var(--a)}`}</style>
  </div>);
}

function ABlog({ c, s }) {
  const [ed, sE] = useState(null); const [d, sD] = useState(null);
  const open = b => { sD({ ...b }); sE(b.id); }; const close = () => { sE(null); sD(null); };
  const save = () => { s(p => ({ ...p, blog: p.blog.map(b => b.id === ed ? d : b) })); close(); };
  const add = () => { const n = { id: uid(), title: "", slug: "", excerpt: "", content: "", featuredImage: "", date: new Date().toISOString().slice(0, 10), author: c.business.name, published: false }; s(p => ({ ...p, blog: [...p.blog, n] })); open(n); };
  const del = id => { s(p => ({ ...p, blog: p.blog.filter(b => b.id !== id) })); close(); };
  return (<div><SH title="Blog" desc="Auto-hides when empty." right={<Btn onClick={add}><ICO.plus /> New</Btn>} /><div style={{ display: "grid", gap: 8, marginTop: 18 }}>{c.blog.map(b => <div key={b.id} className="ac" onClick={() => open(b)} style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 8, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", gap: 10, alignItems: "center" }}>{b.featuredImage && <div style={{ width: 40, height: 40, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}><img src={b.featuredImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>}<div><div style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: 12.5, color: "var(--wh)" }}>{b.title || "Untitled"}</div><div style={{ fontSize: 11, color: "var(--mt)" }}>{b.date}</div></div></div><Badge color={b.published ? "green" : "red"}>{b.published ? "Live" : "Draft"}</Badge></div>)}</div>
    <Modal open={!!ed} onClose={close} title="Edit Post" wide>{d && <div>
      <Fd label="Title"><In value={d.title} onChange={e => sD({ ...d, title: e.target.value })} /></Fd>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}><Fd label="Slug"><In value={d.slug} onChange={e => sD({ ...d, slug: e.target.value })} /></Fd><Fd label="Date"><In type="date" value={d.date} onChange={e => sD({ ...d, date: e.target.value })} /></Fd><Fd label="Author"><In value={d.author} onChange={e => sD({ ...d, author: e.target.value })} /></Fd></div>
      <Fd label="Featured Image URL"><In value={d.featuredImage || ""} onChange={e => sD({ ...d, featuredImage: e.target.value })} placeholder="https://... (1200×630 recommended)" /></Fd>
      {d.featuredImage && <div style={{ marginBottom: 14, borderRadius: 8, overflow: "hidden", border: "1px solid var(--bd)", height: 120 }}><img src={d.featuredImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>}
      <Fd label="Excerpt"><Ta value={d.excerpt} onChange={e => sD({ ...d, excerpt: e.target.value })} style={{ minHeight: 50 }} /></Fd>
      <Lb>Content (Rich Text)</Lb>
      <WysiwygEditor value={d.content} onChange={html => sD(prev => ({ ...prev, content: html }))} />
      <div style={{ marginTop: 12 }}><label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--tx)", cursor: "pointer", marginBottom: 14 }}><input type="checkbox" checked={d.published} onChange={e => sD({ ...d, published: e.target.checked })} />Published</label></div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--bd)", paddingTop: 16 }}><Btn onClick={() => del(d.id)} style={{ color: "#EF4444", borderColor: "#EF4444" }}><ICO.trash /> Delete</Btn><Btn accent onClick={save}>Save</Btn></div>
    </div>}</Modal></div>);
}

function AFormFields({ c, s }) {
  const [af, setAF] = useState("contactForm");
  const labels = { contactForm: "Contact Form", popupForm: "Popup Form", heroForm: "Hero Form" };
  const fields = c.formFields[af] || [];
  const addF = () => s(p => ({ ...p, formFields: { ...p.formFields, [af]: [...p.formFields[af], { id: uid(), label: "", type: "text", placeholder: "", required: false }] } }));
  const upF = (id, f, v) => s(p => ({ ...p, formFields: { ...p.formFields, [af]: p.formFields[af].map(x => x.id === id ? { ...x, [f]: v } : x) } }));
  const rmF = id => s(p => ({ ...p, formFields: { ...p.formFields, [af]: p.formFields[af].filter(x => x.id !== id) } }));
  const types = [{ v: "text", l: "Text" }, { v: "tel", l: "Phone" }, { v: "email", l: "Email" }, { v: "select", l: "Dropdown" }, { v: "textarea", l: "Textarea" }, { v: "number", l: "Number" }];
  return (<div><SH title="Form Fields" desc="Customize each form." /><div style={{ display: "flex", gap: 6, marginTop: 16, marginBottom: 20 }}>{Object.entries(labels).map(([k, l]) => <button key={k} onClick={() => setAF(k)} style={{ padding: "7px 14px", fontSize: 12, fontWeight: af === k ? 600 : 400, color: af === k ? "var(--wh)" : "var(--mt)", background: af === k ? "var(--bd)" : "transparent", border: "none", borderRadius: 7, cursor: "pointer" }}>{l}</button>)}</div><div style={{ display: "grid", gap: 10 }}>{fields.map((f, i) => <div key={f.id} style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 10, padding: 14 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><span style={{ fontSize: 11, fontWeight: 600, color: "var(--mt)" }}>Field {i + 1}</span><div style={{ display: "flex", alignItems: "center", gap: 6 }}><label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--mt)", cursor: "pointer" }}><input type="checkbox" checked={f.required} onChange={e => upF(f.id, "required", e.target.checked)} />Req</label><button onClick={() => rmF(f.id)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer" }}><ICO.trash /></button></div></div><div style={{ display: "grid", gridTemplateColumns: "1fr 110px", gap: 8, marginBottom: 8 }}><In value={f.label} onChange={e => upF(f.id, "label", e.target.value)} placeholder="Label" /><select className="ai" value={f.type} onChange={e => upF(f.id, "type", e.target.value)} style={{ padding: "8px 10px", fontSize: 12, background: "var(--dk)", border: "1px solid var(--bd)", borderRadius: 7, color: "var(--tx)" }}>{types.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}</select></div><In value={f.placeholder} onChange={e => upF(f.id, "placeholder", e.target.value)} placeholder="Placeholder" style={{ fontSize: 12 }} />{f.type === "select" && <div style={{ marginTop: 6 }}><label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--mt)", cursor: "pointer" }}><input type="checkbox" checked={f.useServices || false} onChange={e => upF(f.id, "useServices", e.target.checked)} />Auto-fill services</label></div>}</div>)}</div><div style={{ marginTop: 12 }}><Btn onClick={addF}><ICO.plus /> Add Field</Btn></div></div>);
}

function APopup({ c, s }) {
  const up = (f, v) => s(p => ({ ...p, popup: { ...p.popup, [f]: v } }));
  const uh = (f, v) => s(p => ({ ...p, heroForm: { ...p.heroForm, [f]: v } }));
  return (<div><SH title="Popup & Hero Form" desc="Lead capture." /><div style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 10, padding: 20, marginTop: 18, marginBottom: 14 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 13, color: "var(--wh)" }}>Hero Form</span><label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--tx)", cursor: "pointer" }}><input type="checkbox" checked={c.heroForm.enabled} onChange={e => uh("enabled", e.target.checked)} /> On</label></div><Fd label="Headline"><In value={c.heroForm.headline} onChange={e => uh("headline", e.target.value)} /></Fd><Fd label="Button"><In value={c.heroForm.buttonText} onChange={e => uh("buttonText", e.target.value)} /></Fd></div><div style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 10, padding: 20 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 13, color: "var(--wh)" }}>Popup</span><label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--tx)", cursor: "pointer" }}><input type="checkbox" checked={c.popup.enabled} onChange={e => up("enabled", e.target.checked)} /> On</label></div><Fd label="Headline"><In value={c.popup.headline} onChange={e => up("headline", e.target.value)} /></Fd><Fd label="Subtext"><In value={c.popup.subtext} onChange={e => up("subtext", e.target.value)} /></Fd><Fd label="Delay (sec)"><In type="number" min="0" value={c.popup.delay} onChange={e => up("delay", parseInt(e.target.value) || 0)} /></Fd></div></div>);
}

function AFormRouting({ c, s }) {
  const u = (f, v) => s(p => ({ ...p, forms: { ...p.forms, [f]: v } }));
  return (<div><SH title="Form Routing" desc="Where leads go." /><div style={{ display: "grid", gap: 8, marginTop: 18, marginBottom: 16 }}>{[["email", "Email"], ["webhook", "Webhook"], ["zapier", "Zapier/Make"]].map(([k, l]) => <div key={k} onClick={() => u("destination", k)} className="ac" style={{ background: c.forms.destination === k ? "rgba(212,136,43,.06)" : "var(--cd)", border: `1px solid ${c.forms.destination === k ? "var(--a)" : "var(--bd)"}`, borderRadius: 8, padding: 12 }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${c.forms.destination === k ? "var(--a)" : "var(--mt)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.forms.destination === k && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--a)" }} />}</div><span style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: 12.5, color: "var(--wh)" }}>{l}</span></div></div>)}</div>{c.forms.destination === "email" && <Fd label="Email"><In value={c.forms.email} onChange={e => u("email", e.target.value)} /></Fd>}{c.forms.destination === "webhook" && <Fd label="URL"><In value={c.forms.webhookUrl} onChange={e => u("webhookUrl", e.target.value)} /></Fd>}{c.forms.destination === "zapier" && <Fd label="URL"><In value={c.forms.zapierUrl} onChange={e => u("zapierUrl", e.target.value)} /></Fd>}<Fd label="SMS (opt)"><In value={c.forms.notifyPhone} onChange={e => u("notifyPhone", e.target.value)} /></Fd></div>);
}

// ── CORE: Webhooks Admin Tab ──────────────────────────────────
function AWebhooks({ c, s, submissionLog }) {
  const uw = (f, v) => s(p => ({ ...p, webhooks: { ...p.webhooks, [f]: v } }));
  const [testing, setTesting] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const fireTest = async (type) => {
    const url = type === "form" ? c.webhooks.form_submission_url : c.webhooks.site_deployed_url;
    if (!url) { setTestResult({ ok: false, msg: "No URL configured." }); return; }
    setTesting(type); setTestResult(null);
    const payload = type === "form"
      ? { site_id: c.site_id, org_id: c.org_id, form_type: "test", submitted_at: new Date().toISOString(), data: { name: "Test User", phone: "(555) 000-0000", service: "Test" } }
      : { site_id: c.site_id, org_id: c.org_id, event: "site_deployed", deployed_at: new Date().toISOString() };
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setTestResult({ ok: res.ok, msg: `${res.status} ${res.statusText}` });
    } catch (err) { setTestResult({ ok: false, msg: err.message }); }
    setTesting(null);
  };

  return (<div><SH title="Webhooks" desc="Database integration and webhook endpoints." />
    <div style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 10, padding: 20, marginTop: 18, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}><span style={{ fontSize: 14 }}>🗄️</span><span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 13, color: "var(--wh)" }}>Database IDs</span></div>
      <p style={{ fontSize: 11, color: "var(--mt)", lineHeight: 1.5, marginBottom: 14 }}>Set automatically at deploy time. Included in every webhook payload to identify this site.</p>
      <Fd label="Site ID"><In value={c.site_id || "(assigned at deploy)"} readOnly style={{ opacity: c.site_id ? 1 : 0.5 }} /></Fd>
      <Fd label="Org ID"><In value={c.org_id || "(assigned at deploy)"} readOnly style={{ opacity: c.org_id ? 1 : 0.5 }} /></Fd>
    </div>
    <div style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 10, padding: 20, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}><ICO.webhook /><span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 13, color: "var(--wh)" }}>Endpoints</span></div>
      <Fd label="Form Submission URL"><In value={c.webhooks.form_submission_url} onChange={e => uw("form_submission_url", e.target.value)} placeholder="https://your-api.com/webhooks/form" /></Fd>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}><Btn sm onClick={() => fireTest("form")} style={{ opacity: testing === "form" ? 0.5 : 1 }}><ICO.send /> {testing === "form" ? "Sending..." : "Test"}</Btn></div>
      <Fd label="Site Deployed URL"><In value={c.webhooks.site_deployed_url} onChange={e => uw("site_deployed_url", e.target.value)} placeholder="https://your-api.com/webhooks/deployed" /></Fd>
      <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn sm onClick={() => fireTest("deploy")} style={{ opacity: testing === "deploy" ? 0.5 : 1 }}><ICO.send /> {testing === "deploy" ? "Sending..." : "Test"}</Btn></div>
      {testResult && <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 7, background: testResult.ok ? "rgba(63,185,80,.08)" : "rgba(248,81,73,.08)", border: `1px solid ${testResult.ok ? "#3FB950" : "#F85149"}`, fontSize: 12, color: testResult.ok ? "#3FB950" : "#F85149" }}>{testResult.ok ? "✓" : "✗"} {testResult.msg}</div>}
    </div>
    <div style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 10, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 13, color: "var(--wh)" }}>Delivery History ({submissionLog.length})</span></div>
      {submissionLog.length === 0 && <p style={{ fontSize: 12, color: "var(--mt)" }}>No submissions yet.</p>}
      {submissionLog.slice(0, 20).map((entry, i) => <div key={i} style={{ background: "var(--dk)", border: "1px solid var(--bd)", borderRadius: 8, padding: 10, marginBottom: 6 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Badge color={entry.status === "ok" ? "green" : "red"}>{entry.status}</Badge><span style={{ fontSize: 12, color: "var(--wh)" }}>{entry.form_type}</span></div><span style={{ fontSize: 10, color: "var(--mt)" }}>{entry.submitted_at}</span></div></div>)}
    </div>
    <div style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 10, padding: 20, marginTop: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}><span style={{ fontSize: 14 }}>📄</span><span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 13, color: "var(--wh)" }}>Example Payload</span></div>
      <pre style={{ fontSize: 11, color: "var(--tx)", background: "var(--dk)", border: "1px solid var(--bd)", borderRadius: 7, padding: 12, overflow: "auto", lineHeight: 1.6 }}>{JSON.stringify({ site_id: c.site_id || "uuid-123", org_id: c.org_id || "uuid-456", form_type: "contact", submitted_at: new Date().toISOString(), name: "John Doe", phone: "(555) 123-4567", email: "john@example.com", service: "Emergency Repairs", data: { "Full Name": "John Doe", "Phone": "(555) 123-4567", "Email": "john@example.com", "Service": "Emergency Repairs" }, source_url: "https://example.com/?utm_source=google", utm_source: "google", utm_medium: "cpc", utm_campaign: "spring_promo", user_agent: "Mozilla/5.0..." }, null, 2)}</pre>
    </div>
  </div>);
}

function ADesign({ c, s }) {
  const sp = v => s(p => ({ ...p, design: { ...p.design, primaryColor: v } }));
  const sa = v => s(p => ({ ...p, design: { ...p.design, accentColor: v } }));
  const sf = (f, v) => s(p => ({ ...p, design: { ...p.design, [f]: v } }));
  const fonts = ["Outfit", "Poppins", "Inter", "Montserrat", "Raleway", "Playfair Display", "DM Sans", "Plus Jakarta Sans"];
  const bodyFonts = ["Source Sans 3", "Open Sans", "Lato", "Roboto", "Nunito", "Work Sans", "DM Sans", "Inter"];
  return <div><SH title="Design" desc="Colors and typography." /><div style={{ marginTop: 18 }}><Lb>Primary</Lb><div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>{["#0C2E4E", "#1a3c24", "#3D1308", "#1C1145", "#0F4C5C", "#4A1A00"].map(cl => <div key={cl} onClick={() => sp(cl)} style={{ width: 32, height: 32, borderRadius: 8, background: cl, border: c.design.primaryColor === cl ? "3px solid var(--wh)" : "3px solid transparent", cursor: "pointer" }} />)}<In value={c.design.primaryColor} onChange={e => sp(e.target.value)} style={{ width: 85 }} /></div><Lb>Accent</Lb><div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>{["#D4882B", "#E85D3A", "#2ECC71", "#3498DB", "#C0392B", "#1ABC9C"].map(cl => <div key={cl} onClick={() => sa(cl)} style={{ width: 32, height: 32, borderRadius: 8, background: cl, border: c.design.accentColor === cl ? "3px solid var(--wh)" : "3px solid transparent", cursor: "pointer" }} />)}<In value={c.design.accentColor} onChange={e => sa(e.target.value)} style={{ width: 85 }} /></div>
    <Lb>Heading Font</Lb><div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>{fonts.map(f => <button key={f} onClick={() => sf("headingFont", f)} style={{ padding: "6px 14px", fontSize: 12, fontFamily: f, fontWeight: 700, borderRadius: 7, border: `1px solid ${c.design.headingFont === f ? "var(--a)" : "var(--bd)"}`, background: c.design.headingFont === f ? "rgba(212,136,43,.08)" : "var(--dk)", color: c.design.headingFont === f ? "var(--a)" : "var(--tx)", cursor: "pointer" }}>{f}</button>)}</div>
    <Lb>Body Font</Lb><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{bodyFonts.map(f => <button key={f} onClick={() => sf("bodyFont", f)} style={{ padding: "6px 14px", fontSize: 12, fontFamily: f, borderRadius: 7, border: `1px solid ${c.design.bodyFont === f ? "var(--a)" : "var(--bd)"}`, background: c.design.bodyFont === f ? "rgba(212,136,43,.08)" : "var(--dk)", color: c.design.bodyFont === f ? "var(--a)" : "var(--tx)", cursor: "pointer" }}>{f}</button>)}</div>
  </div></div>;
}

function ACta({ c, s }) {
  const u = (f, v) => s(p => ({ ...p, pageCta: { ...p.pageCta, [f]: v } }));
  const ub = (id, f, v) => s(p => ({ ...p, pageCta: { ...p.pageCta, buttons: p.pageCta.buttons.map(b => b.id === id ? { ...b, [f]: v } : b) } }));
  const addBtn = () => s(p => ({ ...p, pageCta: { ...p.pageCta, buttons: [...p.pageCta.buttons, { id: uid(), label: "New Button", type: "link", target: "contact", style: "accent" }] } }));
  const rmBtn = id => s(p => ({ ...p, pageCta: { ...p.pageCta, buttons: p.pageCta.buttons.filter(b => b.id !== id) } }));
  const pages = [{ v: "home", l: "Home" }, { v: "about", l: "About" }, { v: "services", l: "Services" }, { v: "locations", l: "Locations" }, { v: "blog", l: "Blog" }, { v: "contact", l: "Contact" }];
  const toggleExclude = pg => u("excludePages", c.pageCta.excludePages.includes(pg) ? c.pageCta.excludePages.filter(x => x !== pg) : [...c.pageCta.excludePages, pg]);
  return (<div><SH title="Page CTAs" desc="Call-to-action bar above footer." />
    <div style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 10, padding: 20, marginTop: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 13, color: "var(--wh)" }}>CTA Section</span><label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--tx)", cursor: "pointer" }}><input type="checkbox" checked={c.pageCta.enabled} onChange={e => u("enabled", e.target.checked)} /> On</label></div>
      <Fd label="Headline"><In value={c.pageCta.headline} onChange={e => u("headline", e.target.value)} /></Fd>
      <Fd label="Supporting Text"><In value={c.pageCta.subtext} onChange={e => u("subtext", e.target.value)} /></Fd>
      <Lb>Buttons</Lb>
      {c.pageCta.buttons.map((b, i) => <div key={b.id} style={{ background: "var(--dk)", border: "1px solid var(--bd)", borderRadius: 8, padding: 12, marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><span style={{ fontSize: 11, fontWeight: 600, color: "var(--mt)" }}>Button {i + 1}</span><button onClick={() => rmBtn(b.id)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer" }}><ICO.trash /></button></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px", gap: 6, marginBottom: 6 }}>
          <In value={b.label} onChange={e => ub(b.id, "label", e.target.value)} placeholder="Button text" />
          <select className="ai" value={b.type} onChange={e => ub(b.id, "type", e.target.value)} style={{ padding: "6px 8px", fontSize: 11, background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 6, color: "var(--tx)" }}><option value="link">Go to page</option><option value="phone">Call phone</option><option value="url">External URL</option></select>
          <select className="ai" value={b.style} onChange={e => ub(b.id, "style", e.target.value)} style={{ padding: "6px 8px", fontSize: 11, background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 6, color: "var(--tx)" }}><option value="accent">Filled (accent)</option><option value="outline">Outline (white)</option><option value="primary">Filled (primary)</option></select>
        </div>
        {b.type === "link" && <select className="ai" value={b.target} onChange={e => ub(b.id, "target", e.target.value)} style={{ width: "100%", padding: "6px 8px", fontSize: 11, background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 6, color: "var(--tx)" }}><option value="contact">Contact Page</option><option value="services">Services Page</option><option value="about">About Page</option><option value="locations">Locations Page</option></select>}
        {b.type === "url" && <In value={b.target} onChange={e => ub(b.id, "target", e.target.value)} placeholder="https://..." style={{ fontSize: 11 }} />}
      </div>)}
      <Btn sm onClick={addBtn}><ICO.plus /> Add Button</Btn>
    </div>
    <div style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 10, padding: 16, marginTop: 12 }}>
      <Lb>Hide CTA on these pages</Lb>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>{pages.map(pg => <button key={pg.v} onClick={() => toggleExclude(pg.v)} style={{ padding: "5px 12px", fontSize: 11, borderRadius: 7, border: `1px solid ${c.pageCta.excludePages.includes(pg.v) ? "#EF4444" : "var(--bd)"}`, background: c.pageCta.excludePages.includes(pg.v) ? "rgba(239,68,68,.08)" : "var(--dk)", color: c.pageCta.excludePages.includes(pg.v) ? "#EF4444" : "var(--mt)", cursor: "pointer" }}>{c.pageCta.excludePages.includes(pg.v) ? "✗ " : ""}{pg.l}</button>)}</div>
    </div>
  </div>);
}

function ATracking({ c, s }) { const u = (f, v) => s(p => ({ ...p, tracking: { ...p.tracking, [f]: v } })); return <div><SH title="Tracking" desc="Auto-injected." /><div style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 10, padding: 18, marginTop: 18, marginBottom: 12 }}>{[["gtmId", "GTM"], ["metaPixelId", "Meta Pixel"], ["googleAdsId", "Google Ads"], ["callRailId", "CallRail"]].map(([f, l]) => <Fd key={f} label={l}><In value={c.tracking[f] || ""} onChange={e => u(f, e.target.value)} /></Fd>)}</div><div style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 10, padding: 18 }}><Fd label="Custom head"><Ta value={c.tracking.customHeadCode || ""} onChange={e => u("customHeadCode", e.target.value)} style={{ fontFamily: "monospace", fontSize: 11 }} /></Fd><Fd label="Custom body"><Ta value={c.tracking.customBodyCode || ""} onChange={e => u("customBodyCode", e.target.value)} style={{ fontFamily: "monospace", fontSize: 11 }} /></Fd></div></div>; }

function ASEO({ c, s }) { const u = (f, v) => s(p => ({ ...p, seo: { ...p.seo, [f]: v } })); return <div><SH title="SEO" desc="Meta + schema." /><div style={{ marginTop: 18 }}><Fd label={`Title (${(c.seo.metaTitle || "").length}/60)`}><In value={c.seo.metaTitle} onChange={e => u("metaTitle", e.target.value)} /></Fd><Fd label={`Desc (${(c.seo.metaDescription || "").length}/160)`}><Ta value={c.seo.metaDescription} onChange={e => u("metaDescription", e.target.value)} style={{ minHeight: 55 }} /></Fd><Fd label="Schema"><select className="ai" value={c.seo.schemaType} onChange={e => u("schemaType", e.target.value)} style={{ width: "100%", padding: "8px 12px", fontSize: 13, background: "var(--dk)", border: "1px solid var(--bd)", borderRadius: 7, color: "var(--tx)" }}>{["Plumber", "Electrician", "HVACBusiness", "RoofingContractor", "Painter", "MovingCompany", "PestControlService", "LandscapingBusiness"].map(t => <option key={t}>{t}</option>)}</select></Fd></div></div>; }

function AUsers({ c, s }) {
  const [ed, sE] = useState(null); const [d, sD] = useState(null);
  const open = u => { sD({ ...u }); sE(u.id); }; const close = () => { sE(null); sD(null); };
  const save = () => { s(p => ({ ...p, users: p.users.map(u => u.id === ed ? d : u) })); close(); };
  const add = () => { const n = { id: uid(), name: "", email: "", role: "editor", status: "invited" }; s(p => ({ ...p, users: [...p.users, n] })); open(n); };
  const del = id => { s(p => ({ ...p, users: p.users.filter(u => u.id !== id) })); close(); };
  const roles = [{ v: "owner", l: "Owner" }, { v: "client_admin", l: "Client Admin" }, { v: "editor", l: "Editor" }, { v: "viewer", l: "Viewer" }];
  return (<div><SH title="Users" desc="Manage access." right={<Btn onClick={add}><ICO.plus /> Invite</Btn>} /><div style={{ display: "grid", gap: 8, marginTop: 18 }}>{c.users.map(u => <div key={u.id} className="ac" onClick={() => open(u)} style={{ background: "var(--cd)", border: "1px solid var(--bd)", borderRadius: 9, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--bd)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mt)", fontSize: 14, fontWeight: 700 }}>{u.name ? u.name[0] : "?"}</div><div><div style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: 13, color: "var(--wh)" }}>{u.name || "—"}</div><div style={{ fontSize: 11, color: "var(--mt)" }}>{u.email}</div></div></div><div style={{ display: "flex", gap: 6 }}><Badge color={u.role === "owner" ? "blue" : "green"}>{u.role}</Badge><Badge color={u.status === "active" ? "green" : "red"}>{u.status}</Badge></div></div>)}</div><Modal open={!!ed} onClose={close} title="Edit User">{d && <div><Fd label="Name"><In value={d.name} onChange={e => sD({ ...d, name: e.target.value })} /></Fd><Fd label="Email"><In type="email" value={d.email} onChange={e => sD({ ...d, email: e.target.value })} /></Fd><Lb>Role</Lb><div style={{ display: "grid", gap: 6, marginBottom: 14 }}>{roles.map(r => <div key={r.v} onClick={() => sD({ ...d, role: r.v })} className="ac" style={{ background: d.role === r.v ? "rgba(212,136,43,.06)" : "var(--dk)", border: `1px solid ${d.role === r.v ? "var(--a)" : "var(--bd)"}`, borderRadius: 7, padding: 10 }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${d.role === r.v ? "var(--a)" : "var(--mt)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{d.role === r.v && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--a)" }} />}</div><span style={{ fontSize: 12, fontWeight: 600, color: "var(--wh)" }}>{r.l}</span></div></div>)}</div><Lb>Status</Lb><div style={{ display: "flex", gap: 6, marginBottom: 14 }}>{["active", "invited", "disabled"].map(st => <button key={st} onClick={() => sD({ ...d, status: st })} style={{ padding: "5px 12px", fontSize: 11, borderRadius: 7, border: `1px solid ${d.status === st ? "var(--a)" : "var(--bd)"}`, background: d.status === st ? "rgba(212,136,43,.08)" : "var(--dk)", color: d.status === st ? "var(--a)" : "var(--mt)", cursor: "pointer", textTransform: "capitalize" }}>{st}</button>)}</div><div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--bd)", paddingTop: 16 }}><Btn onClick={() => del(d.id)} style={{ color: "#EF4444", borderColor: "#EF4444" }}><ICO.trash /> Remove</Btn><Btn accent onClick={save}>Save</Btn></div></div>}</Modal></div>);
}

// ── CORE: UTM / Source Helpers ─────────────────────────────────
/** Extract UTM params and source URL from the current page. */
function getTrackingContext() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    source_url: window.location.href,
    utm_source: params.get("utm_source") || null,
    utm_medium: params.get("utm_medium") || null,
    utm_campaign: params.get("utm_campaign") || null,
    user_agent: navigator.userAgent,
  };
}

// ── CORE: Form Submission Handler ─────────────────────────────
/**
 * Sends form data to the configured webhook with site_id + org_id.
 * Includes UTM params, source URL, and user agent so the receiving
 * system (GoHighLevel, Zapier, etc.) has full attribution data.
 */
async function submitForm(config, formType, formData, onLog) {
  const tracking = getTrackingContext();
  const payload = {
    site_id: config.site_id,
    org_id: config.org_id,
    form_type: formType,
    submitted_at: new Date().toISOString(),
    data: formData,
    // Top-level fields for easy mapping in GHL/Zapier
    name: formData["Full Name"] || formData["Name"] || formData["name"] || null,
    phone: formData["Phone"] || formData["phone"] || null,
    email: formData["Email"] || formData["email"] || null,
    service: formData["Service"] || formData["service"] || null,
    ...tracking,
  };
  const url = config.webhooks.form_submission_url;
  let status = "ok";
  if (url) {
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) status = `error:${res.status}`;
    } catch (err) { status = `error:${err.message}`; }
  }
  onLog({ ...payload, status });
}

// ── CORE: RenderForm ──────────────────────────────────────────
function RenderForm({ fields, c, layout, onSubmit, formType, onLog }) {
  const a = c.design.accentColor;
  const hz = layout === "horizontal";
  const formRef = useRef({});
  const handleSubmit = () => {
    const formData = {};
    fields.forEach(f => { formData[f.label] = formRef.current[f.id] || ""; });
    submitForm(c, formType || "contact", formData, onLog);
    if (onSubmit) onSubmit();
  };
  return (
    <div style={hz ? { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" } : { display: "grid", gap: 10 }}>
      {fields.map(f => {
        const base = { padding: hz ? "11px 14px" : "12px 15px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13.5, fontFamily: "var(--bf)", boxSizing: "border-box", flex: hz ? "1 1 150px" : undefined, width: hz ? "auto" : "100%" };
        if (f.type === "select") { const opts = f.useServices ? c.services.map(sv => sv.name) : []; return <select key={f.id} onChange={e => formRef.current[f.id] = e.target.value} style={{ ...base, color: "#666" }}><option value="">{f.placeholder || f.label}</option>{opts.map(o => <option key={o}>{o}</option>)}</select>; }
        if (f.type === "textarea" && !hz) return <textarea key={f.id} placeholder={f.placeholder} onChange={e => formRef.current[f.id] = e.target.value} style={{ ...base, minHeight: 80, resize: "vertical" }} />;
        return <input key={f.id} type={f.type} placeholder={f.placeholder} onChange={e => formRef.current[f.id] = e.target.value} style={base} />;
      })}
      <button onClick={handleSubmit} style={{ padding: hz ? "11px 24px" : "14px", background: a, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: hz ? 13.5 : 15, cursor: "pointer", fontFamily: "var(--hf)", whiteSpace: "nowrap", width: hz ? "auto" : "100%" }}>{hz ? c.heroForm.buttonText : "Request Free Quote →"}</button>
    </div>
  );
}

// ── CORE: Site Navigation ─────────────────────────────────────
function SiteNav({ c, pg, go }) {
  const p = c.design.primaryColor, a = c.design.accentColor;
  const links = [{ k: "home", l: "Home" }, { k: "about", l: "About" }, { k: "services", l: "Services" }, { k: "locations", l: "Areas" }];
  if (c.blog.filter(b => b.published).length > 0) links.push({ k: "blog", l: "Blog" });
  links.push({ k: "contact", l: "Contact" });
  return <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", background: "#fff", borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 50, flexWrap: "wrap", gap: 8 }}><div onClick={() => go("home")} style={{ fontFamily: "var(--hf)", fontSize: 18, fontWeight: 800, color: p, cursor: "pointer" }}>{c.business.name}</div><div style={{ display: "flex", alignItems: "center", gap: 20 }}>{links.map(l => <span key={l.k} onClick={() => go(l.k)} style={{ fontSize: 13, fontWeight: pg === l.k ? 700 : 500, color: pg === l.k ? p : "#555", cursor: "pointer", borderBottom: pg === l.k ? `2px solid ${a}` : "2px solid transparent", paddingBottom: 2 }}>{l.l}</span>)}<a href={`tel:${c.business.phone}`} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", background: a, color: "#fff", borderRadius: 7, fontWeight: 700, fontSize: 12.5, textDecoration: "none" }}><ICO.phone /> {c.business.phone}</a></div></nav>;
}

// ── CORE: Page CTA Bar ────────────────────────────────────────
function PageCTA({ c, pg, go }) {
  if (!c.pageCta.enabled) return null;
  if (c.pageCta.excludePages.includes(pg)) return null;
  const p = c.design.primaryColor, a = c.design.accentColor;
  const btnStyle = (style) => {
    if (style === "accent") return { padding: "14px 32px", background: a, color: "#fff", border: "none", borderRadius: 9, fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "var(--hf)" };
    if (style === "outline") return { padding: "14px 32px", background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,.4)", borderRadius: 9, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "var(--hf)" };
    return { padding: "14px 32px", background: "#fff", color: p, border: "none", borderRadius: 9, fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "var(--hf)" };
  };
  return (<section style={{ background: `linear-gradient(135deg,${p},${p}dd)`, color: "#fff", padding: "56px 24px", textAlign: "center" }}><h2 style={{ fontFamily: "var(--hf)", fontSize: "clamp(20px,4vw,32px)", fontWeight: 800, marginBottom: 6 }}>{c.pageCta.headline}</h2>{c.pageCta.subtext && <p style={{ fontSize: 14, opacity: .8, marginBottom: 24 }}>{c.pageCta.subtext}</p>}<div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>{c.pageCta.buttons.map(b => {
    if (b.type === "phone") return <a key={b.id} href={`tel:${c.business.phone}`} style={{ ...btnStyle(b.style), textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}><ICO.phone /> {b.label}</a>;
    if (b.type === "url") return <a key={b.id} href={b.target} style={{ ...btnStyle(b.style), textDecoration: "none" }}>{b.label}</a>;
    return <button key={b.id} onClick={() => go(b.target)} style={btnStyle(b.style)}>{b.label}</button>;
  })}</div></section>);
}

// ── CORE: Site Footer ─────────────────────────────────────────
function SiteFooter({ c }) { return <footer style={{ background: c.design.primaryColor, color: "rgba(255,255,255,.6)", padding: "40px 24px 24px" }}><div style={{ maxWidth: 1040, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 24, marginBottom: 24 }}><div><div style={{ fontFamily: "var(--hf)", fontWeight: 800, fontSize: 17, color: "#fff", marginBottom: 8 }}>{c.business.name}</div><div style={{ fontSize: 12.5, lineHeight: 1.6 }}>{c.business.tagline}</div></div><div><div style={{ fontWeight: 700, color: "#fff", marginBottom: 8, fontSize: 12.5 }}>Contact</div><div style={{ fontSize: 12, lineHeight: 2 }}>{c.business.phone}<br />{c.business.email}</div></div><div><div style={{ fontWeight: 700, color: "#fff", marginBottom: 8, fontSize: 12.5 }}>Areas</div><div style={{ fontSize: 12, lineHeight: 2 }}>{c.business.serviceArea}</div></div></div><div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 16, textAlign: "center", fontSize: 11 }}>© {new Date().getFullYear()} {c.business.name}. {c.business.license}</div></footer>; }

// ── CORE: Quote Popup ─────────────────────────────────────────
function QuotePopup({ c, open: isOpen, onClose, onLog }) {
  const [done, setDone] = useState(false);
  if (!isOpen) return null;
  const p = c.design.primaryColor;
  return <div className="po" onClick={onClose}><div className="su" onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, padding: 32, maxWidth: 460, width: "100%", position: "relative" }}><button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: "#999", cursor: "pointer" }}><ICO.close /></button>{done ? <div style={{ textAlign: "center", padding: 16 }}><div style={{ fontSize: 40, marginBottom: 10 }}>✓</div><h3 style={{ fontFamily: "var(--hf)", fontWeight: 700, fontSize: 18, color: p }}>Received!</h3></div> : <div><h3 style={{ fontFamily: "var(--hf)", fontWeight: 800, fontSize: 20, color: p, marginBottom: 4 }}>{c.popup.headline}</h3><p style={{ fontSize: 13, color: "#666", marginBottom: 20 }}>{c.popup.subtext}</p><RenderForm fields={c.formFields.popupForm} c={c} layout="vertical" formType="popup" onLog={onLog} onSubmit={() => setDone(true)} /></div>}</div></div>;
}

// ── CORE: Hero Form Bar ───────────────────────────────────────
function HeroForm({ c, onLog }) {
  const [done, setDone] = useState(false);
  if (!c.heroForm.enabled) return null;
  if (done) return <div style={{ background: c.design.primaryColor, padding: "16px 24px", textAlign: "center" }}><span style={{ color: "#fff", fontFamily: "var(--hf)", fontWeight: 700, fontSize: 14 }}>✓ Submitted!</span></div>;
  return <div style={{ background: c.design.primaryColor, padding: "20px 24px" }}><div style={{ maxWidth: 1040, margin: "0 auto" }}><div style={{ fontFamily: "var(--hf)", fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 12, textAlign: "center" }}>{c.heroForm.headline}</div><RenderForm fields={c.formFields.heroForm} c={c} layout="horizontal" formType="hero" onLog={onLog} onSubmit={() => setDone(true)} /></div></div>;
}




// ── CLIENT: DEFAULT_CONFIG ────────────────────────────────────
const DEFAULT_CONFIG = {
  site_id: "",
  org_id: "",

  business: {
    name: "Godinez Solutions",
    tagline: "Fast, Reliable Plumbing & HVAC — When You Need It Most.",
    phone: "7123634765",
    email: "info@godinez.solutions",
    address: "Las Vegas, NV",
    serviceArea: "Las Vegas, Henderson, Boulder City & Surrounding Areas",
    license: "LIC-12345",
    yearEstablished: "2014",
    hours: "24/7 Emergency Service Available",
  },
  about: {
    headline: "Built on Trust, Backed by 10 Years of Experience",
    story: "Godinez Solutions was founded in 2014 with a simple mission: provide Las Vegas homeowners with honest, reliable plumbing and HVAC services when they need it most. What started as a one-man operation has grown into a trusted team of licensed professionals, but our commitment to treating every customer like family remains unchanged.\n\nOwner Timothy Godinez knows that plumbing emergencies don't wait for business hours. That's why we've built our business around 24/7 availability, transparent pricing, and quality work that lasts. Whether it's a burst pipe at midnight or an HVAC system that fails during Vegas's scorching summer, our team is ready to restore comfort to your home.\n\nAfter a decade of serving the Las Vegas community, we've learned that trust isn't just earned through technical expertise — it's built through clear communication, fair pricing, and showing up when we say we will. That's the Godinez Solutions difference.",
    homeSnippet: "For 10 years, Godinez Solutions has been Las Vegas's trusted partner for plumbing and HVAC emergencies. We combine licensed expertise with honest pricing and 24/7 availability, because your comfort can't wait.",
    values: [
      { id: "1", title: "24/7 Emergency Response", desc: "Plumbing disasters don't follow business hours. Our emergency team is available around the clock to restore your peace of mind." },
      { id: "2", title: "Transparent, Upfront Pricing", desc: "No surprises, no hidden fees. You'll know exactly what the job costs before we start, with free estimates on all work." },
      { id: "3", title: "Licensed & Fully Insured", desc: "Every technician is licensed, background-checked, and insured. Your home and family are protected with every service call." }
    ],
    teamSize: "8+ Licensed Technicians",
    jobsCompleted: "3,000+ Jobs Completed",
    avgRating: "4.9",
  },
  team: [],
  hero: {
    headline: "Las Vegas's Most Trusted\nPlumbing & HVAC Team",
    subheadline: "24/7 Emergency Service • Licensed & Insured • Free Estimates • Same-Day Service",
    ctaText: "Call Now For A Free Estimate",
    ctaPhone: "7123634765",
    imageDesktop: "",
    imageMobile: "",
    imageOverlay: 0.7,
  },
  services: [
    {
      id: "emergency-plumbing",
      name: "Emergency Plumbing",
      shortDesc: "Burst pipe? Water everywhere? Our emergency team responds fast to stop the damage and get your plumbing back to normal.",
      fullDesc: "When disaster strikes your plumbing system, every minute counts. Our emergency plumbing team is available 24/7 to handle burst pipes, major leaks, sewer backups, and any other plumbing crisis that can't wait.\n\nWe arrive equipped with professional-grade tools and parts to handle most repairs on the spot. Our trucks are stocked with common replacement parts, so you won't wait days for a follow-up visit. We'll assess the situation, explain your options, and get to work stopping the damage immediately.\n\nDon't let a plumbing emergency flood your home or disrupt your life. Call us now — we'll dispatch a licensed technician to your location within the hour in most cases.",
      icon: "🚨",
      price: "Starting at $149",
      features: [
        "Available 24/7, including holidays",
        "Rapid response within 1 hour",
        "All parts and labor included in quote",
        "Licensed, insured technicians",
        "No overtime charges for emergencies"
      ]
    },
    {
      id: "drain-cleaning",
      name: "Drain Cleaning & Repair",
      shortDesc: "Stubborn clog that won't budge? Our hydro-jetting and snaking services clear the toughest blockages without damaging your pipes.",
      fullDesc: "A slow drain isn't just annoying — it's often a sign of a bigger problem brewing in your pipes. Our professional drain cleaning services use advanced techniques like hydro-jetting and motorized snaking to clear blockages completely, not just temporarily.\n\nUnlike store-bought drain cleaners that can damage pipes and harm the environment, our methods are safe and effective. We use camera inspection to identify the exact location and cause of clogs, then choose the right tool for the job. From hair and grease buildup to tree roots and mineral deposits, we clear it all.\n\nWe also offer preventive maintenance plans to keep your drains flowing freely year-round, saving you money and hassle in the long run.",
      icon: "🌊",
      price: "Starting at $129",
      features: [
        "Hydro-jetting for tough blockages",
        "Camera inspection included",
        "Environmentally safe methods",
        "Same-day service available",
        "Preventive maintenance plans"
      ]
    },
    {
      id: "water-heater",
      name: "Water Heater Services",
      shortDesc: "No hot water? Strange noises? We repair and replace all types of water heaters, including tankless systems.",
      fullDesc: "Nothing ruins your morning like stepping into a cold shower. Our water heater specialists handle everything from minor repairs to full system replacements, working with all major brands and fuel types.\n\nWe service traditional tank water heaters, tankless systems, and hybrid heat pump units. Whether your water heater is making strange noises, not heating properly, or completely failed, we'll diagnose the issue and recommend the most cost-effective solution.\n\nWhen replacement is necessary, we'll help you choose the right size and efficiency rating for your home and family's needs. All installations come with manufacturer warranties plus our own guarantee on workmanship.",
      icon: "🔥",
      price: "Starting at $179",
      features: [
        "Same-day repairs in most cases",
        "All brands and fuel types",
        "Energy-efficient replacement options",
        "Extended warranties available",
        "Professional installation guaranteed"
      ]
    },
    {
      id: "leak-detection",
      name: "Leak Detection & Repair",
      shortDesc: "High water bills? Hidden leaks can waste thousands of gallons. Our electronic detection finds leaks fast, even behind walls.",
      fullDesc: "Hidden water leaks are silent budget-killers and home-wreckers. A small leak behind a wall or under a slab can waste hundreds of dollars in water while causing expensive structural damage you won't see until it's too late.\n\nOur leak detection specialists use advanced electronic equipment and thermal imaging to locate leaks precisely, even when they're hidden behind walls, under concrete, or buried in your yard. We can find the exact source without unnecessary demolition or guesswork.\n\nOnce we locate the leak, we provide minimally invasive repairs that restore your plumbing without destroying your home's finishes. Fast detection and repair saves you money on water bills and prevents costly damage to floors, walls, and foundations.",
      icon: "🔍",
      price: "Starting at $199",
      features: [
        "Electronic leak detection equipment",
        "Thermal imaging technology",
        "Minimal disruption to your home",
        "Slab leak specialists",
        "Insurance claim assistance"
      ]
    },
    {
      id: "hvac-repair",
      name: "HVAC Repair & Maintenance",
      shortDesc: "AC not cooling? Heater not working? Our HVAC technicians keep Las Vegas homes comfortable year-round.",
      fullDesc: "Las Vegas weather is extreme — scorching summers and chilly winters mean your HVAC system works overtime. When your air conditioning fails in July or your heater goes out in January, you need fast, professional service.\n\nOur HVAC technicians are trained on all major brands and system types. We handle everything from simple filter changes and tune-ups to complex repairs and full system replacements. Regular maintenance prevents most breakdowns and keeps your energy bills in check.\n\nWe offer flexible maintenance plans that include priority service, discounted repairs, and extended warranties. Don't wait for a breakdown — preventive care keeps your family comfortable and saves money on utility bills.",
      icon: "❄️",
      price: "Starting at $149",
      features: [
        "All major brands serviced",
        "Same-day repairs available",
        "Preventive maintenance plans",
        "Energy efficiency consultations",
        "Priority emergency service"
      ]
    },
    {
      id: "repiping",
      name: "Repiping Services",
      shortDesc: "Old pipes causing constant problems? Complete repiping with modern materials eliminates leaks and improves water pressure.",
      fullDesc: "If you're dealing with frequent leaks, low water pressure, discolored water, or sky-high repair bills, it might be time to replace your home's plumbing system entirely. Repiping sounds expensive and disruptive, but modern techniques make it surprisingly manageable.\n\nWe specialize in replacing outdated galvanized steel, cast iron, and polybutylene pipes with durable PEX or copper systems. Our repiping process minimizes wall damage and completes most homes in 2-3 days, not weeks.\n\nNew plumbing increases your home's value, improves water pressure and quality, and eliminates the constant stress of plumbing failures. We provide detailed estimates and work with your schedule to make the process as smooth as possible.",
      icon: "🔧",
      price: "Free Consultation",
      features: [
        "Complete home repiping specialists",
        "Modern PEX and copper materials",
        "Minimal wall damage techniques",
        "Completion in 2-3 days typically",
        "Increases home value"
      ]
    }
  ],
  reviews: {
    googlePlaceId: "",
    overallRating: 4.9,
    totalReviews: 149,
    googleReviews: [],
    manualReviews: [
      {
        id: "1",
        author: "Sarah M.",
        rating: 5,
        source: "Google",
        text: "Called at 11 PM with a burst pipe flooding our kitchen. Tim arrived within 45 minutes and had it fixed in under an hour. Professional, fair pricing, and saved our hardwood floors. Highly recommend!"
      },
      {
        id: "2",
        author: "Mike R.",
        rating: 5,
        source: "Google",
        text: "Our AC died on the hottest day of summer. Godinez Solutions came out same day and had us back up and running. The technician was knowledgeable and didn't try to sell us anything we didn't need."
      },
      {
        id: "3",
        author: "Jennifer L.",
        rating: 5,
        source: "Yelp",
        text: "Excellent service from start to finish. They found a hidden leak that was costing us hundreds in water bills. The repair was clean and professional. Very happy with their work."
      },
      {
        id: "4",
        author: "Carlos V.",
        rating: 5,
        source: "Google",
        text: "Timothy and his team repiped our entire house. They were respectful of our home, completed on schedule, and the final result is fantastic. Water pressure is amazing now!"
      },
      {
        id: "5",
        author: "Amanda K.",
        rating: 4,
        source: "Google",
        text: "Quick response for our water heater replacement. Fair price and quality installation. The only reason it's not 5 stars is they were running a bit behind schedule, but they called to let us know."
      },
      {
        id: "6",
        author: "David H.",
        rating: 5,
        source: "Nextdoor",
        text: "Been using Godinez Solutions for 3 years now. Always professional, always fair. They've become our go-to for all plumbing and HVAC needs. Wouldn't call anyone else."
      }
    ]
  },
  faq: [
    {
      id: "1",
      question: "How much will my plumbing repair cost?",
      answer: "We provide free, upfront estimates before starting any work. Most basic repairs range from $129-$299, while major issues like repiping or water heater replacement are quoted individually. We'll never start work without your approval, and there are no hidden fees or surprise charges."
    },
    {
      id: "2",
      question: "Do you really offer 24/7 emergency service?",
      answer: "Yes! Our emergency team is available 24 hours a day, 7 days a week, including holidays. We understand that plumbing disasters don't wait for business hours. Emergency calls are typically answered within 1 hour in the Las Vegas valley."
    },
    {
      id: "3",
      question: "Are your technicians licensed and insured?",
      answer: "Absolutely. All our technicians are licensed by the state of Nevada, fully insured, and background-checked for your peace of mind. We carry comprehensive liability insurance and workers' compensation coverage on all our employees."
    },
    {
      id: "4",
      question: "Will you damage my walls or floors during repairs?",
      answer: "We take great care to minimize damage to your home. Our technicians use drop cloths, shoe covers, and specialized tools to access pipes with minimal disruption. When wall or floor access is necessary, we make the smallest opening possible and can recommend trusted contractors for repairs."
    },
    {
      id: "5",
      question: "Do you offer warranties on your work?",
      answer: "Yes! We warranty all our workmanship for a minimum of one year. Parts warranties vary by manufacturer but are typically 1-10 years depending on the component. We'll explain all applicable warranties before starting your project."
    },
    {
      id: "6",
      question: "Can you help with insurance claims for water damage?",
      answer: "We work with insurance companies regularly and can provide detailed documentation of the damage and repairs needed. While we can't guarantee coverage, we'll provide all the paperwork and photos your insurance adjuster needs to process your claim."
    },
    {
      id: "7",
      question: "How quickly can you respond to emergency calls?",
      answer: "For true emergencies like burst pipes or major leaks, we typically arrive within 1 hour in Las Vegas, Henderson, and Boulder City. Non-emergency service calls are usually scheduled within 24 hours, often same-day if you call before 2 PM."
    },
    {
      id: "8",
      question: "Do you service all areas of Las Vegas?",
      answer: "We provide full service throughout Las Vegas, Henderson, Boulder City, and most surrounding communities. If you're unsure whether we service your area, just give us a call — we're often willing to travel a bit further for the right job."
    }
  ],
  blog: [
    {
      id: "winter-plumbing-tips",
      title: "5 Ways to Protect Your Pipes This Winter",
      slug: "winter-plumbing-tips",
      excerpt: "Las Vegas winters may be mild, but they can still cause serious plumbing problems. Learn how to prevent frozen pipes and expensive water damage.",
      content: "<p>While Las Vegas doesn't experience the harsh winters of northern states, we do get cold snaps that can wreak havoc on your home's plumbing. Even a few hours below freezing can cause pipes to burst and create thousands of dollars in water damage.</p><h2>1. Insulate Exposed Pipes</h2><p>Pipes in unheated areas like garages, crawl spaces, and exterior walls are most vulnerable. Foam pipe insulation costs just a few dollars and can prevent expensive repairs. Pay special attention to pipes on the north side of your home, which get less sun during winter months.</p><h2>2. Keep Cabinet Doors Open</h2><p>During cold nights, open cabinet doors under sinks to allow warm air to circulate around pipes. This simple step can prevent pipes in exterior walls from freezing. It's especially important for kitchen sinks on outside walls.</p><h2>3. Let Faucets Drip</h2><p>If temperatures are expected to drop below 32°F, let faucets connected to vulnerable pipes drip slightly. Moving water is much less likely to freeze than stagnant water. The small increase in your water bill is nothing compared to the cost of burst pipe repairs.</p><h2>4. Know Your Water Shut-Off Location</h2><p>Every adult in your home should know where the main water shut-off valve is located and how to operate it. If a pipe does burst, shutting off the water quickly can save thousands of dollars in damage. The valve is typically located near where the water line enters your home.</p><h2>5. Disconnect Garden Hoses</h2><p>Water trapped in connected hoses can freeze and expand back into your home's pipes, causing them to crack. Disconnect all hoses and drain exterior faucets before the first freeze. Consider installing frost-proof exterior faucets if you haven't already.</p><p><strong>What to Do If Pipes Freeze:</strong> If you turn on a faucet and only a trickle comes out, you likely have a frozen pipe. Never use a torch or open flame to thaw pipes — this can cause fires or make pipes burst. Instead, use a hair dryer, heating pad, or warm towels. If you can't locate the frozen section or can't access it safely, call Godinez Solutions immediately at (712) 363-4765.</p>",
      featuredImage: "",
      date: "December 15, 2023",
      author: "Timothy Godinez",
      published: true
    },
    {
      id: "water-heater-warning-signs",
      title: "6 Warning Signs Your Water Heater is About to Fail",
      slug: "water-heater-warning-signs",
      excerpt: "Don't get stuck with cold showers and emergency replacement costs. Learn the early warning signs that your water heater needs attention.",
      content: "<p>Your water heater is one of those appliances you don't think about until it stops working. But water heaters rarely fail without warning — they usually give you several signs that trouble is brewing. Catching these signs early can save you from emergency replacement costs and the inconvenience of cold showers.</p><h2>1. Age of Your Water Heater</h2><p>Traditional tank water heaters typically last 8-12 years, while tankless units can last 15-20 years. If your water heater is approaching the end of its expected lifespan and showing other warning signs, it's time to start planning for replacement. Don't wait for complete failure — planned replacement is always cheaper than emergency replacement.</p><h2>2. Rusty or Discolored Water</h2><p>If you notice rusty or brown water coming from your hot water taps, it could indicate internal corrosion in your water heater tank. This is especially concerning if the cold water runs clear. Internal rust means the tank is deteriorating and may begin leaking soon.</p><h2>3. Strange Noises</h2><p>Rumbling, banging, or crackling sounds coming from your water heater usually indicate sediment buildup at the bottom of the tank. As sediment accumulates, it causes the heating element to work harder and can eventually lead to tank failure. Professional flushing can sometimes resolve this issue if caught early.</p><h2>4. Inconsistent Water Temperature</h2><p>If your water temperature fluctuates during use or you're running out of hot water faster than usual, your water heater's heating elements may be failing. This is often one of the first signs of trouble and usually gets worse over time.</p><h2>5. Water Around the Unit</h2><p>Any moisture or puddles around your water heater are cause for immediate concern. Small leaks often indicate internal pressure problems or tank corrosion. While sometimes repairable, leaks often signal that replacement is necessary.</p><h2>6. Higher Energy Bills</h2><p>A sudden increase in your energy bills without other explanation could indicate your water heater is working inefficiently. As internal components wear out, the unit requires more energy to heat water to the desired temperature.</p><p><strong>Don't Wait for Complete Failure:</strong> If you're experiencing any of these warning signs, contact Godinez Solutions for a professional inspection. We can often extend your water heater's life with maintenance or help you plan for replacement before you're stuck with cold water. Call us at (712) 363-4765 for a free evaluation.</p>",
      featuredImage: "",
      date: "November 28, 2023",
      author: "Timothy Godinez",
      published: true
    },
    {
      id: "hvac-maintenance-vegas",
      title: "Las Vegas HVAC Maintenance: Beat the Heat Before It Beats You",
      slug: "hvac-maintenance-vegas",
      excerpt: "Las Vegas summers are brutal on HVAC systems. Learn why spring maintenance is crucial and what you can do to keep your AC running strong when you need it most.",
      content: "<p>Las Vegas summers are legendary for their intensity, with temperatures regularly exceeding 110°F for months on end. Your HVAC system works harder here than almost anywhere else in the country, which is why preventive maintenance isn't just recommended — it's essential for survival.</p><h2>Why Las Vegas is Tough on HVAC Systems</h2><p>The combination of extreme heat, dust storms, and constant operation puts enormous stress on air conditioning systems. What might be a minor issue in a milder climate can quickly become a major failure when your AC is running 12+ hours a day for months. The last thing you want is a breakdown in July when repair companies are swamped and replacement parts are scarce.</p><h2>Spring Maintenance Checklist</h2><p><strong>Clean or Replace Air Filters:</strong> Vegas dust clogs filters quickly, restricting airflow and forcing your system to work harder. Check monthly during heavy-use periods and replace as needed.</p><p><strong>Clear the Outdoor Unit:</strong> Remove debris, weeds, and anything blocking airflow around your condenser unit. Ensure at least 2 feet of clearance on all sides for proper operation.</p><p><strong>Check Refrigerant Levels:</strong> Low refrigerant is a common problem that reduces efficiency and can damage your compressor. This should be checked by a professional as part of annual maintenance.</p><p><strong>Inspect Ductwork:</strong> Leaky ducts waste energy and reduce comfort. Look for visible damage and have your system's ductwork professionally inspected every few years.</p><p><strong>Test Thermostat Operation:</strong> Make sure your thermostat is reading temperatures accurately and responding properly to setting changes. Consider upgrading to a programmable or smart thermostat for better efficiency.</p><h2>Signs Your AC Needs Professional Attention</h2><p>Don't wait for complete failure. Call for service if you notice:</p><ul><li>Reduced airflow from vents</li><li>Strange noises during operation</li><li>Inconsistent cooling throughout your home</li><li>Unusual odors when the system runs</li><li>Dramatically higher energy bills</li><li>Ice forming on the outdoor unit</li></ul><h2>The Cost of Skipping Maintenance</h2><p>Regular maintenance typically costs $150-$200 annually but can prevent thousands in emergency repairs and premature replacement. A well-maintained system also operates 15-20% more efficiently, saving money on every electric bill.</p><p><strong>Don't Get Caught Off Guard:</strong> Schedule your HVAC maintenance before the heat arrives. Godinez Solutions offers comprehensive maintenance plans that include priority service and discounted repairs. Call (712) 363-4765 to schedule your spring tune-up and beat the Vegas heat with confidence.</p>",
      featuredImage: "",
      date: "March 22, 2024",
      author: "Timothy Godinez",
      published: true
    }
  ],
  locations: [
    {
      id: "las-vegas",
      name: "Las Vegas",
      slug: "las-vegas",
      headline: "Trusted Plumbing & HVAC Services Throughout Las Vegas",
      description: "Godinez Solutions has been serving Las Vegas homeowners for over 10 years, building a reputation for reliable emergency response and quality workmanship. Our team knows the unique challenges of desert living — from hard water mineral buildup to HVAC systems that work overtime in extreme heat.\n\nWe're proud to be your neighbors' choice for plumbing and HVAC services throughout the Las Vegas valley. Whether you're dealing with a plumbing emergency in the middle of the night or planning a major home improvement project, our licensed technicians are ready to help with honest advice and quality work.",
      neighborhoods: [
        "Summerlin",
        "Henderson",
        "Green Valley",
        "Spring Valley",
        "Paradise",
        "Enterprise",
        "Southwest Las Vegas",
        "Northwest Las Vegas",
        "Downtown Las Vegas",
        "East Las Vegas"
      ],
      servicesHighlighted: ["emergency-plumbing", "hvac-repair", "water-heater"],
      metaTitle: "Las Vegas Plumbing & HVAC Services | Godinez Solutions",
      metaDesc: "Trusted Las Vegas plumbing and HVAC services. 24/7 emergency response, licensed technicians, free estimates. Serving all Las Vegas neighborhoods."
    },
    {
      id: "henderson",
      name: "Henderson",
      slug: "henderson",
      headline: "Professional Plumbing & HVAC Services in Henderson, NV",
      description: "Henderson residents trust Godinez Solutions for fast, reliable plumbing and HVAC services. We understand the specific needs of Henderson homes, from older neighborhoods with aging pipes to newer developments with modern systems that require specialized knowledge.\n\nOur Henderson service area includes Green Valley, Anthem, McDonald Ranch, and all surrounding communities. We maintain quick response times throughout Henderson with emergency service available 24/7. Our team is familiar with local building codes and common plumbing issues specific to the area.",
      neighborhoods: [
        "Green Valley",
        "Green Valley Ranch",
        "Anthem",
        "McDonald Ranch",
        "Gibson Springs",
        "Inspirada",
        "Cadence",
        "Seven Hills",
        "Lake Las Vegas",
        "Whitney Ranch"
      ],
      servicesHighlighted: ["leak-detection", "drain-cleaning", "repiping"],
      metaTitle: "Henderson NV Plumber & HVAC | Emergency Service | Godinez Solutions",
      metaDesc: "Henderson plumbing and HVAC experts. Same-day service, licensed technicians, transparent pricing. Serving Green Valley, Anthem, and all Henderson areas."
    },
    {
      id: "boulder-city",
      name: "Boulder City",
      slug: "boulder-city",
      headline: "Boulder City's Reliable Plumbing & HVAC Specialists",
      description: "Boulder City homeowners have unique needs, from historic homes with aging plumbing systems to desert properties with well water challenges. Godinez Solutions understands these specific requirements and provides tailored solutions for Boulder City residents.\n\nWe're committed to serving Boulder City with the same quick response times and quality service that Las Vegas and Henderson customers have come to expect. Our technicians are familiar with the area's infrastructure and common issues, ensuring efficient service every time.",
      neighborhoods: [
        "Historic Boulder City",
        "Boulder Creek",
        "Del Webb at Miramonte",
        "Desert Foothills",
        "Lake Mountain Estates",
        "River Mountain",
        "ABC Streets",
        "Avenue B District"
      ],
      servicesHighlighted: ["emergency-plumbing", "water-heater", "hvac-repair"],
      metaTitle: "Boulder City Plumber & HVAC | 24/7 Service | Godinez Solutions",
      metaDesc: "Boulder City plumbing and HVAC services. Historic home specialists, well water systems, emergency response. Licensed, insured, trusted locally."
    }
  ],
  formFields: {
    contactForm: [
      { id: "name", label: "Full Name", type: "text", placeholder: "Your name", required: true },
      { id: "phone", label: "Phone Number", type: "tel", placeholder: "Your phone number", required: true },
      { id: "email", label: "Email Address", type: "email", placeholder: "Your email", required: true },
      { id: "service", label: "Service Needed", type: "select", required: true, useServices: true },
      { id: "details", label: "Project Details", type: "textarea", placeholder: "Tell us about your plumbing or HVAC needs...", required: false }
    ],
    popupForm: [
      { id: "name", label: "Name", type: "text", placeholder: "Your name", required: true },
      { id: "phone", label: "Phone", type: "tel", placeholder: "Your phone", required: true },
      { id: "service", label: "Service", type: "select", required: true, useServices: true }
    ],
    heroForm: [
      { id: "name", label: "Name", type: "text", placeholder: "Your name", required: true },
      { id: "phone", label: "Phone", type: "tel", placeholder: "Your phone", required: true },
      { id: "service", label: "Service", type: "select", required: false, useServices: true }
    ]
  },
  popup: {
    enabled: true,
    headline: "Emergency Plumbing? We're Available 24/7!",
    subtext: "Don't let plumbing disasters ruin your day. Get fast, professional help now.",
    delay: 8
  },
  heroForm: {
    enabled: true,
    headline: "Get Your Free Estimate Now",
    buttonText: "Get Free Quote"
  },
  design: {
    primaryColor: "#3b82f6",
    accentColor: "#050505",
    headingFont: "Poppins",
    bodyFont: "Open Sans"
  },
  tracking: {
    gtmId: "",
    metaPixelId: "",
    googleAdsId: "",
    callRailId: "",
    customHeadCode: "",
    customBodyCode: ""
  },
  seo: {
    metaTitle: "Las Vegas Plumber & HVAC | 24/7 Emergency | Godinez Solutions",
    metaDescription: "Las Vegas's trusted plumbing & HVAC experts. 24/7 emergency service, licensed technicians, free estimates. Serving Las Vegas, Henderson, Boulder City.",
    schemaType: "Plumber"
  },
  forms: {
    destination: "email",
    email: "info@godinez.solutions",
    webhookUrl: "",
    zapierUrl: "",
    notifyPhone: "7123634765"
  },
  pageCta: {
    enabled: true,
    headline: "Need Plumbing or HVAC Help?",
    subtext: "Don't wait for small problems to become big disasters.",
    buttons: [
      { text: "Get Free Quote", action: "form" },
      { text: "Call Now", action: "phone" }
    ],
    excludePages: ["contact"]
  },
  users: [],
  webhooks: {
    form_submission_url: "",
    site_deployed_url: ""
  }
};

// ── CLIENT: FAQ Section ───────────────────────────────────────
function FAQSection({ c }) {
  const [oi, setOI] = useState(null);
  if (!c.faq.length) return null;
  const p = c.design.primaryColor;
  return (
    <section style={{ padding: "56px 24px", maxWidth: 740, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "var(--hf)", fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, textAlign: "center", marginBottom: 32, color: p }}>
        Frequently Asked Questions
      </h2>
      <div style={{ display: "grid", gap: 8 }}>
        {c.faq.map(f => (
          <div key={f.id} style={{ border: "1px solid #e8e8e8", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
            <button onClick={() => setOI(oi === f.id ? null : f.id)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--hf)", fontWeight: 700, fontSize: 14, color: p, textAlign: "left" }}>
              {f.question}
              <span style={{ transform: oi === f.id ? "rotate(180deg)" : "", transition: "transform .2s", flexShrink: 0, marginLeft: 10 }}><ICO.chev /></span>
            </button>
            <div className={`faq-a${oi === f.id ? " open" : ""}`}>
              <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "#555" }}>{f.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── CLIENT: Home Page ─────────────────────────────────────────
function PHome({ c, go, onLog }) {
  const p = c.design.primaryColor, a = c.design.accentColor;
  const allR = [...c.reviews.googleReviews, ...c.reviews.manualReviews];
  return (<div>
    {/* Hero */}
    <section style={{ background: c.hero.imageDesktop ? "none" : `linear-gradient(150deg,${p},${p}ee,${p}cc)`, color: "#fff", padding: "76px 24px 68px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      {c.hero.imageDesktop && <><picture style={{ position: "absolute", inset: 0 }}>{c.hero.imageMobile && <source media="(max-width:768px)" srcSet={c.hero.imageMobile} />}<img src={c.hero.imageDesktop} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /></picture><div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${c.hero.imageOverlay})` }} /></>}
      {!c.hero.imageDesktop && <div style={{ position: "absolute", inset: 0, opacity: .04, backgroundImage: `repeating-linear-gradient(45deg,transparent,transparent 40px,${a} 40px,${a} 41px)` }} />}
      <div className="fu" style={{ position: "relative", maxWidth: 740, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--hf)", fontSize: "clamp(28px,5.5vw,50px)", fontWeight: 900, lineHeight: 1.05, marginBottom: 16, whiteSpace: "pre-line" }}>{c.hero.headline}</h1>
        <p style={{ fontSize: "clamp(13px,2vw,17px)", opacity: .85, marginBottom: 28 }}>{c.hero.subheadline}</p>
        <a href={`tel:${c.hero.ctaPhone}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 36px", background: a, color: "#fff", borderRadius: 9, fontWeight: 800, fontSize: 15, textDecoration: "none", fontFamily: "var(--hf)" }}>{c.hero.ctaText} <ICO.arrow /></a>
      </div>
    </section>

    <HeroForm c={c} onLog={onLog} />

    {/* Trust Bar */}
    <div style={{ display: "flex", justifyContent: "center", gap: 32, padding: "18px 24px", background: "#f7f8fa", flexWrap: "wrap" }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>✓ Licensed & Insured</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>✓ 24/7 Emergency Service</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>✓ Est. 2014</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>✓ 4.9★ (149 Reviews)</span>
    </div>

    {/* Services Grid */}
    <section style={{ padding: "56px 24px", maxWidth: 1040, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "var(--hf)", fontSize: "clamp(22px,4vw,34px)", fontWeight: 800, textAlign: "center", marginBottom: 36, color: p }}>Emergency & Scheduled Services</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
        {c.services.map(sv => (
          <div key={sv.id} className="sc" onClick={() => go(`service-${sv.id}`)} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, padding: "24px 22px", cursor: "pointer" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{sv.icon}</div>
            <div style={{ fontFamily: "var(--hf)", fontWeight: 700, fontSize: 15, marginBottom: 5, color: p }}>{sv.name}</div>
            <div style={{ fontSize: 12.5, color: "#666", marginBottom: 12, lineHeight: 1.5 }}>{sv.shortDesc}</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: a }}>{sv.price}</span>
              <span style={{ fontSize: 11.5, color: a, fontWeight: 600 }}>Learn More →</span>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* About Preview */}
    <section style={{ background: "#f7f8fa", padding: "56px 24px" }}>
      <div style={{ maxWidth: 880, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
        <div>
          <h2 style={{ fontFamily: "var(--hf)", fontSize: "clamp(22px,3.5vw,30px)", fontWeight: 800, color: p, marginBottom: 14 }}>{c.about.headline}</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "#555", marginBottom: 20 }}>{c.about.homeSnippet}</p>
          <button onClick={() => go("about")} style={{ padding: "10px 24px", background: a, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "var(--hf)" }}>About Us →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: "#fff", borderRadius: 10, padding: 20, textAlign: "center", border: "1px solid #eee" }}>
            <div style={{ fontFamily: "var(--hf)", fontSize: 24, fontWeight: 900, color: p }}>8+</div>
            <div style={{ fontSize: 11.5, color: "#888", marginTop: 2 }}>Technicians</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 10, padding: 20, textAlign: "center", border: "1px solid #eee" }}>
            <div style={{ fontFamily: "var(--hf)", fontSize: 24, fontWeight: 900, color: p }}>3,000+</div>
            <div style={{ fontSize: 11.5, color: "#888", marginTop: 2 }}>Jobs</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 10, padding: 20, textAlign: "center", border: "1px solid #eee" }}>
            <div style={{ fontFamily: "var(--hf)", fontSize: 24, fontWeight: 900, color: p }}>4.9★</div>
            <div style={{ fontSize: 11.5, color: "#888", marginTop: 2 }}>Rating</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 10, padding: 20, textAlign: "center", border: "1px solid #eee" }}>
            <div style={{ fontFamily: "var(--hf)", fontSize: 24, fontWeight: 900, color: p }}>10</div>
            <div style={{ fontSize: 11.5, color: "#888", marginTop: 2 }}>Years</div>
          </div>
        </div>
      </div>
    </section>

    {/* Reviews */}
    <section style={{ padding: "56px 24px" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 2, marginBottom: 8, color: a }}>{[0,1,2,3,4].map(i => <ICO.star key={i} />)}</div>
          <h2 style={{ fontFamily: "var(--hf)", fontSize: "clamp(22px,4vw,34px)", fontWeight: 800, color: p }}>{c.reviews.overallRating} Stars • {c.reviews.totalReviews} Reviews</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
          {allR.slice(0, 6).map(r => (
            <div key={r.id} style={{ background: "#fff", borderRadius: 12, padding: 22, border: "1px solid #e8e8e8" }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 8, color: a }}>{Array.from({ length: r.rating }).map((_, j) => <ICO.star key={j} />)}</div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "#444", marginBottom: 12, fontStyle: "italic" }}>"{r.text}"</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: p }}>{r.author}</span>
                <span style={{ fontSize: 10.5, color: "#999" }}>{r.source}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <FAQSection c={c} />
  </div>);
}

// ── CLIENT: About Page ────────────────────────────────────────
function PAbout({ c }) {
  const p = c.design.primaryColor, a = c.design.accentColor;
  return (<div>
    <section style={{ background: `linear-gradient(150deg,${p},${p}dd)`, color: "#fff", padding: "50px 24px", textAlign: "center" }}>
      <h1 style={{ fontFamily: "var(--hf)", fontSize: "clamp(24px,5vw,40px)", fontWeight: 900 }}>{c.about.headline}</h1>
    </section>
    <section style={{ maxWidth: 740, margin: "0 auto", padding: "50px 24px" }}>
      {c.about.story.split("\n\n").map((t, i) => <p key={i} style={{ fontSize: 15, lineHeight: 1.8, color: "#444", marginBottom: 20 }}>{t}</p>)}
    </section>
    <section style={{ background: "#f7f8fa", padding: "40px 24px" }}>
      <div style={{ maxWidth: 740, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, textAlign: "center" }}>
        <div><div style={{ fontFamily: "var(--hf)", fontSize: 30, fontWeight: 900, color: p }}>8+</div><div style={{ fontSize: 12, color: "#888" }}>Licensed Technicians</div></div>
        <div><div style={{ fontFamily: "var(--hf)", fontSize: 30, fontWeight: 900, color: p }}>3,000+</div><div style={{ fontSize: 12, color: "#888" }}>Jobs Completed</div></div>
        <div><div style={{ fontFamily: "var(--hf)", fontSize: 30, fontWeight: 900, color: p }}>4.9★</div><div style={{ fontSize: 12, color: "#888" }}>Average Rating</div></div>
      </div>
    </section>
    <section style={{ maxWidth: 740, margin: "0 auto", padding: "50px 24px" }}>
      <h2 style={{ fontFamily: "var(--hf)", fontSize: 22, fontWeight: 800, color: p, textAlign: "center", marginBottom: 28 }}>Our Promises to You</h2>
      <div style={{ display: "grid", gap: 14 }}>
        {c.about.values.map(v => (
          <div key={v.id} style={{ display: "flex", gap: 12, padding: 20, background: "#fff", border: "1px solid #eee", borderRadius: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${a}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: a }}><ICO.check /></div>
            <div><div style={{ fontFamily: "var(--hf)", fontWeight: 700, fontSize: 14, color: p, marginBottom: 2 }}>{v.title}</div><div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>{v.desc}</div></div>
          </div>
        ))}
      </div>
    </section>
  </div>);
}

// ── CLIENT: Services Page ─────────────────────────────────────
function PServices({ c, go }) {
  const p = c.design.primaryColor, a = c.design.accentColor;
  return (<div>
    <section style={{ background: `linear-gradient(150deg,${p},${p}dd)`, color: "#fff", padding: "50px 24px", textAlign: "center" }}>
      <h1 style={{ fontFamily: "var(--hf)", fontSize: "clamp(24px,5vw,40px)", fontWeight: 900 }}>Plumbing & HVAC Services</h1>
    </section>
    <section style={{ maxWidth: 1040, margin: "0 auto", padding: "50px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
        {c.services.map(sv => (
          <div key={sv.id} className="sc" onClick={() => go(`service-${sv.id}`)} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, padding: "24px 22px", cursor: "pointer" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{sv.icon}</div>
            <div style={{ fontFamily: "var(--hf)", fontWeight: 700, fontSize: 15, marginBottom: 5, color: p }}>{sv.name}</div>
            <div style={{ fontSize: 12.5, color: "#666", marginBottom: 12, lineHeight: 1.5 }}>{sv.shortDesc}</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 13, fontWeight: 700, color: a }}>{sv.price}</span><span style={{ fontSize: 11.5, color: a, fontWeight: 600 }}>Details →</span></div>
          </div>
        ))}
      </div>
    </section>
  </div>);
}

// ── CLIENT: Single Service Page ───────────────────────────────
function PService({ svc, c, go }) {
  const p = c.design.primaryColor, a = c.design.accentColor;
  if (!svc) return null;
  return (<div>
    <section style={{ background: `linear-gradient(150deg,${p},${p}dd)`, color: "#fff", padding: "50px 24px" }}>
      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        <button onClick={() => go("services")} style={{ background: "none", border: "none", color: "rgba(255,255,255,.7)", cursor: "pointer", fontSize: 12.5, marginBottom: 12 }}>← Back</button>
        <div style={{ fontSize: 40, marginBottom: 12 }}>{svc.icon}</div>
        <h1 style={{ fontFamily: "var(--hf)", fontSize: "clamp(24px,5vw,40px)", fontWeight: 900, marginBottom: 6 }}>{svc.name}</h1>
        <div style={{ fontSize: 17, fontWeight: 700, color: a }}>{svc.price}</div>
      </div>
    </section>
    <section style={{ maxWidth: 740, margin: "0 auto", padding: "50px 24px" }}>
      {svc.fullDesc.split("\n\n").map((t, i) => <p key={i} style={{ fontSize: 15, lineHeight: 1.8, color: "#444", marginBottom: 20 }}>{t}</p>)}
      {svc.features?.length > 0 && (
        <div style={{ background: "#f7f8fa", borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontFamily: "var(--hf)", fontWeight: 700, fontSize: 16, color: p, marginBottom: 16 }}>What's Included</h3>
          {svc.features.map((f, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}><span style={{ color: a }}><ICO.check /></span><span style={{ fontSize: 13.5, color: "#444" }}>{f}</span></div>)}
        </div>
      )}
      <div style={{ background: `${p}0D`, border: `1px solid ${p}30`, borderRadius: 12, padding: 24, textAlign: "center" }}>
        <h3 style={{ fontFamily: "var(--hf)", fontWeight: 700, fontSize: 17, color: p, marginBottom: 16 }}>Need {svc.name}? We're Ready to Help</h3>
        <a href={`tel:${c.business.phone}`} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 26px", background: p, color: "#fff", borderRadius: 8, fontWeight: 800, fontSize: 14, textDecoration: "none", fontFamily: "var(--hf)" }}><ICO.phone /> {c.business.phone}</a>
      </div>
    </section>
  </div>);
}

// ── CLIENT: Locations Page ────────────────────────────────────
function PLocations({ c, go }) {
  const p = c.design.primaryColor, a = c.design.accentColor;
  return (<div>
    <section style={{ background: `linear-gradient(150deg,${p},${p}dd)`, color: "#fff", padding: "50px 24px", textAlign: "center" }}>
      <h1 style={{ fontFamily: "var(--hf)", fontSize: "clamp(24px,5vw,40px)", fontWeight: 900 }}>Areas We Serve</h1>
    </section>
    <section style={{ maxWidth: 1040, margin: "0 auto", padding: "50px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
        {c.locations.map(l => (
          <div key={l.id} className="sc" onClick={() => go(`loc-${l.id}`)} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, padding: 24, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><span style={{ color: a }}><ICO.pin /></span><h3 style={{ fontFamily: "var(--hf)", fontWeight: 700, fontSize: 17, color: p }}>{l.name}</h3></div>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.5, marginBottom: 14 }}>{l.description?.slice(0, 120)}...</p>
            {l.neighborhoods?.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{l.neighborhoods.slice(0, 4).map(n => <span key={n} style={{ padding: "3px 10px", fontSize: 11, background: "#f0f2f5", borderRadius: 6, color: "#555" }}>{n}</span>)}</div>}
          </div>
        ))}
      </div>
    </section>
  </div>);
}

// ── CLIENT: Single Location Page ──────────────────────────────
function PLocation({ loc, c, go }) {
  const p = c.design.primaryColor, a = c.design.accentColor;
  if (!loc) return null;
  const hl = c.services.filter(sv => loc.servicesHighlighted?.includes(sv.id));
  return (<div>
    <section style={{ background: `linear-gradient(150deg,${p},${p}dd)`, color: "#fff", padding: "50px 24px" }}>
      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        <button onClick={() => go("locations")} style={{ background: "none", border: "none", color: "rgba(255,255,255,.7)", cursor: "pointer", fontSize: 12.5, marginBottom: 12 }}>← All Areas</button>
        <h1 style={{ fontFamily: "var(--hf)", fontSize: "clamp(24px,5vw,38px)", fontWeight: 900 }}>{loc.headline}</h1>
      </div>
    </section>
    <section style={{ maxWidth: 740, margin: "0 auto", padding: "50px 24px" }}>
      {loc.description.split("\n\n").map((t, i) => <p key={i} style={{ fontSize: 15, lineHeight: 1.8, color: "#444", marginBottom: 20 }}>{t}</p>)}
      {loc.neighborhoods?.length > 0 && (
        <div style={{ background: "#f7f8fa", borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontFamily: "var(--hf)", fontWeight: 700, fontSize: 16, color: p, marginBottom: 14 }}>Neighborhoods in {loc.name}</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{loc.neighborhoods.map(n => <span key={n} style={{ padding: "6px 14px", background: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 600, color: p, border: "1px solid #e8e8e8" }}>{n}</span>)}</div>
        </div>
      )}
      {hl.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: "var(--hf)", fontWeight: 700, fontSize: 16, color: p, marginBottom: 14 }}>Featured Services in {loc.name}</h3>
          {hl.map(sv => (
            <div key={sv.id} className="sc" onClick={() => go(`service-${sv.id}`)} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: 18, cursor: "pointer", display: "flex", gap: 14, alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 26 }}>{sv.icon}</span>
              <div style={{ flex: 1 }}><div style={{ fontFamily: "var(--hf)", fontWeight: 700, fontSize: 14, color: p }}>{sv.name}</div><div style={{ fontSize: 12, color: "#666" }}>{sv.shortDesc}</div></div>
              <span style={{ fontSize: 13, fontWeight: 700, color: a }}>{sv.price}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ background: `${p}0D`, border: `1px solid ${p}30`, borderRadius: 12, padding: 24, textAlign: "center" }}>
        <h3 style={{ fontFamily: "var(--hf)", fontWeight: 700, fontSize: 17, color: p, marginBottom: 12 }}>Need Service in {loc.name}?</h3>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>Fast response times throughout the {loc.name} area</p>
        <a href={`tel:${c.business.phone}`} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 26px", background: p, color: "#fff", borderRadius: 8, fontWeight: 800, fontSize: 14, textDecoration: "none", fontFamily: "var(--hf)" }}><ICO.phone /> {c.business.phone}</a>
      </div>
    </section>
  </div>);
}

// ── CLIENT: Blog List Page ────────────────────────────────────
function PBlog({ c, go }) {
  const p = c.design.primaryColor, a = c.design.accentColor;
  const posts = c.blog.filter(b => b.published);
  return (<div>
    <section style={{ background: `linear-gradient(150deg,${p},${p}dd)`, color: "#fff", padding: "50px 24px", textAlign: "center" }}>
      <h1 style={{ fontFamily: "var(--hf)", fontSize: "clamp(24px,5vw,40px)", fontWeight: 900 }}>Helpful Tips & Guides</h1>
    </section>
    <section style={{ maxWidth: 820, margin: "0 auto", padding: "50px 24px" }}>
      {posts.map(b => (
        <div key={b.id} className="sc" onClick={() => go(`blog-${b.id}`)} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, overflow: "hidden", marginBottom: 16, cursor: "pointer" }}>
          {b.featuredImage && <div style={{ height: 180, overflow: "hidden" }}><img src={b.featuredImage} alt={b.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>}
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 11.5, color: "#888", marginBottom: 6 }}>{b.date} • {b.author}</div>
            <h3 style={{ fontFamily: "var(--hf)", fontWeight: 700, fontSize: 18, color: p, marginBottom: 6 }}>{b.title}</h3>
            <p style={{ fontSize: 13.5, color: "#666", marginBottom: 10 }}>{b.excerpt}</p>
            <span style={{ fontSize: 12.5, color: a, fontWeight: 600 }}>Read More →</span>
          </div>
        </div>
      ))}
    </section>
  </div>);
}

// ── CLIENT: Blog Post Page ────────────────────────────────────
function PBlogPost({ post, c, go }) {
  const p = c.design.primaryColor;
  if (!post) return null;
  return (<div>
    <section style={{ background: `linear-gradient(150deg,${p},${p}dd)`, color: "#fff", padding: "50px 24px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <button onClick={() => go("blog")} style={{ background: "none", border: "none", color: "rgba(255,255,255,.7)", cursor: "pointer", fontSize: 12.5, marginBottom: 12 }}>← Back to Blog</button>
        <h1 style={{ fontFamily: "var(--hf)", fontSize: "clamp(22px,4vw,34px)", fontWeight: 900, lineHeight: 1.15 }}>{post.title}</h1>
        <div style={{ fontSize: 13, opacity: .75, marginTop: 10 }}>{post.date} • {post.author}</div>
      </div>
    </section>
    {post.featuredImage && <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px" }}><img src={post.featuredImage} alt={post.title} style={{ width: "100%", borderRadius: 12, marginTop: -20, position: "relative", zIndex: 1, boxShadow: "0 8px 30px rgba(0,0,0,.12)" }} /></div>}
    <section style={{ maxWidth: 680, margin: "0 auto", padding: "30px 24px 44px" }}>
      <div dangerouslySetInnerHTML={{ __html: post.content }} style={{ fontSize: 15, lineHeight: 1.8, color: "#444" }} />
      <style>{`section h2,section h3{font-family:var(--hf);font-weight:700;color:${p};margin:24px 0 8px} section img{max-width:100%;border-radius:8px;margin:16px 0} section a{color:${c.design.accentColor}} section ul,section ol{margin:12px 0;padding-left:24px} section li{margin:4px 0}`}</style>
    </section>
  </div>);
}

// ── CLIENT: Contact Page ──────────────────────────────────────
function PContact({ c, onLog }) {
  const p = c.design.primaryColor, a = c.design.accentColor;
  const [done, setDone] = useState(false);
  return (<div>
    <section style={{ background: `linear-gradient(150deg,${p},${p}dd)`, color: "#fff", padding: "50px 24px", textAlign: "center" }}>
      <h1 style={{ fontFamily: "var(--hf)", fontSize: "clamp(24px,5vw,40px)", fontWeight: 900 }}>Get Your Free Estimate</h1>
      <p style={{ fontSize: 16, opacity: 0.85, marginTop: 8 }}>Ready to solve your plumbing or HVAC problem? We're here to help.</p>
    </section>
    <section style={{ maxWidth: 1040, margin: "0 auto", padding: "50px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
      <div>
        {done
          ? <div style={{ textAlign: "center", padding: 32 }}><div style={{ fontSize: 40, marginBottom: 10 }}>✓</div><h3 style={{ fontFamily: "var(--hf)", fontWeight: 700, fontSize: 18, color: p }}>Thanks! We'll Contact You Soon</h3><p style={{ fontSize: 14, color: "#666", marginTop: 8 }}>A licensed technician will reach out within 2 hours during business hours.</p></div>
          : <RenderForm fields={c.formFields.contactForm} c={c} layout="vertical" formType="contact" onLog={onLog} onSubmit={() => setDone(true)} />
        }
      </div>
      <div>
        <div style={{ background: "#f7f8fa", borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontFamily: "var(--hf)", fontWeight: 700, fontSize: 16, color: p, marginBottom: 16 }}>Contact Information</h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}><span style={{ fontSize: 16 }}>📞</span><div><div style={{ fontSize: 11, color: "#888" }}>Phone</div><div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{c.business.phone}</div></div></div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}><span style={{ fontSize: 16 }}>✉️</span><div><div style={{ fontSize: 11, color: "#888" }}>Email</div><div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{c.business.email}</div></div></div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}><span style={{ fontSize: 16 }}>📍</span><div><div style={{ fontSize: 11, color: "#888" }}>Service Area</div><div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{c.business.serviceArea}</div></div></div>
          <div style={{ display: "flex", gap: 10 }}><span style={{ fontSize: 16 }}>🕒</span><div><div style={{ fontSize: 11, color: "#888" }}>Hours</div><div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{c.business.hours}</div></div></div>
        </div>
        <div style={{ background: p, borderRadius: 12, padding: 24, color: "#fff", textAlign: "center" }}>
          <h3 style={{ fontFamily: "var(--hf)", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Emergency Service Available</h3>
          <p style={{ fontSize: 13, opacity: 0.85, marginBottom: 16 }}>Plumbing disasters don't wait for business hours</p>
          <a href={`tel:${c.business.phone}`} style={{ fontSize: 20, fontWeight: 900, color: "#fff", textDecoration: "none", fontFamily: "var(--hf)", display: "block", padding: "10px", background: "rgba(255,255,255,0.1)", borderRadius: 8 }}>{c.business.phone}</a>
        </div>
      </div>
    </section>
  </div>);
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                                                                         ║
// ║   🔒 CORE SYSTEM — APP SHELL (DO NOT MODIFY)                           ║
// ║                                                                         ║
// ║   The main App component wires CORE admin + CLIENT pages together.      ║
// ║   Do not change routing, state management, or the admin panel layout.   ║
// ║                                                                         ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

export default function App() {
  const [c, setC] = useState(DEFAULT_CONFIG);
  const [tab, setTab] = useState("business");
  const [view, setView] = useState("admin");
  const [pg, setPg] = useState("home");
  const [saved, setSaved] = useState(false);
  const [popup, setPopup] = useState(false);
  const [submissionLog, setSubmissionLog] = useState([]);
  const addLog = useCallback((entry) => { setSubmissionLog(prev => [entry, ...prev]); }, []);

  useEffect(() => { if (view === "preview" && c.popup.enabled) { const t = setTimeout(() => setPopup(true), c.popup.delay * 1000); return () => clearTimeout(t); } }, [view]);

  // ── Preview Mode ──
  if (view === "preview") {
    const svcM = pg.startsWith("service-") ? c.services.find(sv => sv.id === pg.replace("service-", "")) : null;
    const blogM = pg.startsWith("blog-") ? c.blog.find(b => b.id === pg.replace("blog-", "")) : null;
    const locM = pg.startsWith("loc-") ? c.locations.find(l => l.id === pg.replace("loc-", "")) : null;
    return (
      <div style={{ fontFamily: c.design.bodyFont || "Source Sans 3" }}>
        <GlobalCSS p={c.design.primaryColor} a={c.design.accentColor} hf={c.design.headingFont} bf={c.design.bodyFont} />
        <QuotePopup c={c} open={popup} onClose={() => setPopup(false)} onLog={addLog} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", background: "var(--dk)", borderBottom: "1px solid var(--bd)", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444" }} /><span style={{ fontSize: 12, color: "var(--mt)" }}>Preview — <strong style={{ color: "var(--wh)" }}>{c.business.name || "ClickLaunch Site"}</strong></span></div>
          <div style={{ display: "flex", gap: 6 }}><Btn sm onClick={() => setPopup(true)}>Test Popup</Btn><Btn sm onClick={() => { setView("admin"); setPopup(false); }}>← Admin</Btn></div>
        </div>
        <SiteNav c={c} pg={pg} go={setPg} />
        {pg === "home" && <PHome c={c} go={setPg} onLog={addLog} />}
        {pg === "about" && <PAbout c={c} />}
        {pg === "services" && <PServices c={c} go={setPg} />}
        {pg === "locations" && <PLocations c={c} go={setPg} />}
        {pg === "contact" && <PContact c={c} onLog={addLog} />}
        {pg === "blog" && <PBlog c={c} go={setPg} />}
        {svcM && <PService svc={svcM} c={c} go={setPg} />}
        {blogM && <PBlogPost post={blogM} c={c} go={setPg} />}
        {locM && <PLocation loc={locM} c={c} go={setPg} />}
        <PageCTA c={c} pg={pg.startsWith("service-") ? "services" : pg.startsWith("blog-") ? "blog" : pg.startsWith("loc-") ? "locations" : pg} go={setPg} />
        <SiteFooter c={c} />
      </div>
    );
  }

  // ── Admin Mode ──
  return (
    <div style={{ fontFamily: "Source Sans 3", minHeight: "100vh", background: "var(--dk)", color: "var(--tx)" }}>
      <GlobalCSS p={c.design.primaryColor} a={c.design.accentColor} hf={c.design.headingFont} bf={c.design.bodyFont} />
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: "1px solid var(--bd)", background: "var(--cd)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 18 }}>⚡</span><span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 15, color: "var(--wh)" }}>ClickLaunch</span><Badge color="green">v1</Badge></div>
        <div style={{ display: "flex", gap: 6 }}><Btn onClick={() => { setView("preview"); setPg("home"); setPopup(false); }}><ICO.eye /> Preview</Btn><Btn accent onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>{saved ? "✓ Saved" : "Save"}</Btn></div>
      </header>
      <div style={{ display: "flex", minHeight: "calc(100vh - 48px)" }}>
        <aside style={{ width: 185, borderRight: "1px solid var(--bd)", background: "var(--cd)", padding: "8px 0", flexShrink: 0, overflowY: "auto" }}>
          {TABS.map(t => <button key={t.k} onClick={() => setTab(t.k)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 16px", fontSize: 12, fontWeight: tab === t.k ? 600 : 400, color: tab === t.k ? "var(--wh)" : "var(--mt)", background: tab === t.k ? "var(--dk)" : "transparent", border: "none", borderLeft: tab === t.k ? "2px solid var(--a)" : "2px solid transparent", cursor: "pointer", textAlign: "left" }}><span style={{ fontSize: 13 }}>{t.i}</span>{t.l}</button>)}
        </aside>
        <main style={{ flex: 1, padding: "24px 32px", maxWidth: 720, overflowY: "auto" }}>
          {tab === "business" && <ABusiness c={c} s={setC} />}
          {tab === "hero" && <AHero c={c} s={setC} />}
          {tab === "about" && <AAbout c={c} s={setC} />}
          {tab === "team" && <ATeam c={c} s={setC} />}
          {tab === "services" && <AServices c={c} s={setC} />}
          {tab === "locations" && <ALocations c={c} s={setC} />}
          {tab === "reviews" && <AReviews c={c} s={setC} />}
          {tab === "faq" && <AFAQ c={c} s={setC} />}
          {tab === "blog" && <ABlog c={c} s={setC} />}
          {tab === "formFields" && <AFormFields c={c} s={setC} />}
          {tab === "popup" && <APopup c={c} s={setC} />}
          {tab === "formRouting" && <AFormRouting c={c} s={setC} />}
          {tab === "webhooks" && <AWebhooks c={c} s={setC} submissionLog={submissionLog} />}
          {tab === "design" && <ADesign c={c} s={setC} />}
          {tab === "cta" && <ACta c={c} s={setC} />}
          {tab === "tracking" && <ATracking c={c} s={setC} />}
          {tab === "seo" && <ASEO c={c} s={setC} />}
          {tab === "users" && <AUsers c={c} s={setC} />}
        </main>
      </div>
    </div>
  );
}
