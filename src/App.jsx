import { useState, useEffect, useRef, createContext, useContext } from "react";

const RouterCtx = createContext({ page: "inicio", go: () => {} });

/* Refined lighter corporate blue */
const ACCENT = "#6B9ECE";
const AL = "rgba(107,158,206,";
const DARK_BG = "#0B1628";
const DARK_MID = "#0F1D33";
const DARK_LIGHT = "#16263E";

function useInView(th = 0.12) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: th });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} style={{ ...style, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
      {children}
    </div>
  );
}

/* ─── NAV ─── */
function Nav() {
  const { page, go } = useContext(RouterCtx);
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 60); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  useEffect(() => setMob(false), [page]);

  const links = [
    { id: "inicio", label: "Inicio" },
    { id: "nosotros", label: "Quiénes Somos" },
    { id: "servicios", label: "Qué Hacemos" },
    { id: "bodegas", label: "Arriendos" },
    { id: "contacto", label: "Contacto" },
  ];
  const transparent = page === "inicio" && !scrolled;

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: transparent ? "transparent" : `rgba(11,22,40,0.97)`, backdropFilter: transparent ? "none" : "blur(20px)", borderBottom: transparent ? "none" : `1px solid ${AL}0.12)`, transition: "all 0.5s ease" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: transparent ? 76 : 64, transition: "height 0.5s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => go("inicio")}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${AL}0.25)`, flexShrink: 0 }}>
            <img src="/InversionesSantaRegina.jpg" alt="SR" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: `${AL}0.8)`, letterSpacing: 3, textTransform: "uppercase", lineHeight: 1.2 }}>Inversiones</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "#fff", letterSpacing: 2, lineHeight: 1.1 }}>SANTA REGINA</div>
          </div>
        </div>
        <div className="sr-nav-desk" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {links.map(l => (
            <button key={l.id} onClick={() => go(l.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", color: page === l.id ? ACCENT : "rgba(255,255,255,0.65)", borderBottom: page === l.id ? `1px solid ${ACCENT}` : "1px solid transparent", transition: "all 0.3s" }}>{l.label}</button>
          ))}
        </div>
        <button className="sr-nav-mob" onClick={() => setMob(!mob)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">{mob ? <path d="M6 6l12 12M6 18L18 6" /> : <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>}</svg>
        </button>
      </div>
      {mob && (
        <div style={{ background: `rgba(11,22,40,0.98)`, padding: "16px 32px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {links.map(l => <button key={l.id} onClick={() => go(l.id)} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "8px 0", fontFamily: "'DM Sans', sans-serif", fontSize: 14, letterSpacing: 1.5, textTransform: "uppercase", color: page === l.id ? ACCENT : "rgba(255,255,255,0.65)" }}>{l.label}</button>)}
        </div>
      )}
    </nav>
  );
}

/* ─── PAGE HEADER ─── */
function PageHeader({ tag, title, subtitle, bgImage }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);
  return (
    <section style={{
      background: bgImage
        ? `linear-gradient(165deg, rgba(11,22,40,0.88) 0%, rgba(15,29,51,0.85) 40%, rgba(22,38,62,0.88) 100%), url('${bgImage}') center/cover no-repeat`
        : `linear-gradient(165deg, ${DARK_BG} 0%, ${DARK_MID} 40%, ${DARK_LIGHT} 70%, ${DARK_BG} 100%)`,
      padding: "140px 32px 80px", position: "relative", overflow: "hidden", textAlign: "center"
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `radial-gradient(circle at 1px 1px, ${ACCENT} 0.5px, transparent 0)`, backgroundSize: "48px 48px" }} />
      <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1, opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(24px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s" }}>
        <div style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: ACCENT, marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>{tag}</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 500, color: "#fff", lineHeight: 1.15, margin: "0 0 20px", letterSpacing: -0.5 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>{subtitle}</p>}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${AL}0.15), transparent)` }} />
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  const { go } = useContext(RouterCtx);
  return (
    <footer style={{ background: DARK_BG, padding: "64px 32px 32px", borderTop: `1px solid ${AL}0.08)` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: `1px solid ${AL}0.2)`, flexShrink: 0 }}>
                <img src="/InversionesSantaRegina.jpg" alt="SR" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#fff", letterSpacing: 1.5 }}>SANTA REGINA</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, maxWidth: 260 }}>Patrimonio construido activo por activo, con una visión de largo plazo.</p>
          </div>
          {[
            { title: "Compañía", items: [{ l: "Inicio", p: "inicio" }, { l: "Quiénes Somos", p: "nosotros" }, { l: "Qué Hacemos", p: "servicios" }, { l: "Arriendos", p: "bodegas" }] },
            { title: "Contacto", items: [{ l: "Formulario", p: "contacto" }, { l: "info@santaregina.cl" }, { l: "Santiago, Chile" }] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: ACCENT, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>{col.title}</div>
              {col.items.map((it, j) => (
                <div key={j} onClick={() => it.p && go(it.p)} style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, marginBottom: 10, cursor: it.p ? "pointer" : "default", transition: "color 0.2s" }}
                  onMouseEnter={e => it.p && (e.target.style.color = "rgba(255,255,255,0.7)")}
                  onMouseLeave={e => it.p && (e.target.style.color = "rgba(255,255,255,0.4)")}
                >{it.l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif" }}>© 2026 Inversiones Santa Regina. Todos los derechos reservados.</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif" }}>Santiago, Chile</div>
        </div>
      </div>
    </footer>
  );
}

/* ─── CTA BAND ─── */
function CtaBand() {
  const { go } = useContext(RouterCtx);
  return (
    <section style={{ background: `linear-gradient(165deg, ${DARK_BG} 0%, ${DARK_MID} 100%)`, padding: "80px 32px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${AL}0.15), transparent)` }} />
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <FadeIn>
          <div style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: ACCENT, marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>Contacto</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 500, color: "#fff", margin: "0 0 36px", lineHeight: 1.3 }}>Estamos en Santiago</h2>
          <button onClick={() => go("contacto")} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", padding: "16px 48px", background: ACCENT, color: "#fff", border: "none", cursor: "pointer", fontWeight: 500, transition: "opacity 0.3s" }}
            onMouseEnter={e => e.target.style.opacity = "0.85"} onMouseLeave={e => e.target.style.opacity = "1"}
          >Ir a contacto</button>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── SHARED: 4 AREAS DE NEGOCIO ─── */
const AREAS = [
  { tag: "Mercado de capitales", title: "Inversiones Financieras", desc: "Mercado de capitales, renta fija e inversiones alternativas locales y extranjeras.", accent: ACCENT, href: null },
  { tag: "Inmobiliario", title: "Portafolio Inmobiliario", desc: "Centros de bodegaje, activos industriales build to suit y locales comerciales.", accent: "#5FA37A", href: null },
  { tag: "Operaciones", title: "Negocios Reales", desc: "Rubro de transporte, logística y comercialización.", accent: "#8B7EC2", href: "https://www.transportesnazar.cl/" },
  { tag: "Inversión directa", title: "Negocios Directos", desc: "Deuda privada originada in house, coinversiones inmobiliarias, venture capital y otros.", accent: "#C2845B", href: null },
];

function AreasGrid({ clickable }) {
  const { go } = useContext(RouterCtx);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
      {AREAS.map((s, i) => (
        <FadeIn key={i} delay={i * 0.1}>
          <div style={{ background: "#fff", padding: 36, border: "1px solid rgba(0,0,0,0.06)", transition: "all 0.3s", cursor: (clickable && s.href) ? "pointer" : (clickable ? "pointer" : "default"), height: "100%", position: "relative", overflow: "hidden" }}
            onClick={() => {
              if (s.href) { window.open(s.href, "_blank", "noopener,noreferrer"); }
              else if (clickable) { go("servicios"); }
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${AL}0.3)`; if (clickable) e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; if (clickable) e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: s.accent, opacity: 0.5 }} />
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: s.accent, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>{s.tag}</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 500, color: "#0A0F1C", margin: "0 0 12px" }}>{s.title}</h3>
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, margin: 0 }}>{s.desc}</p>
            {clickable && <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: ACCENT, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
              Ver más {s.href && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>}
              {!s.href && "→"}
            </span>}
          </div>
        </FadeIn>
      ))}
    </div>
  );
}


/* ═══════════════════════════════════════════
   PAGE: INICIO
   ═══════════════════════════════════════════ */
function PageInicio() {
  const { go } = useContext(RouterCtx);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <>
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: `linear-gradient(165deg, rgba(11,22,40,0.85) 0%, rgba(15,29,51,0.82) 40%, rgba(22,38,62,0.85) 70%, rgba(11,22,40,0.9) 100%), url('/Sanhattan.jpg') center/cover no-repeat`,
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `radial-gradient(circle at 1px 1px, ${ACCENT} 0.5px, transparent 0)`, backgroundSize: "48px 48px" }} />
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${AL}0.06) 0%, transparent 70%)` }} />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "120px 32px 80px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.2s" }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${AL}0.3)`, margin: "0 auto 32px", flexShrink: 0 }}>
              <img src="/InversionesSantaRegina.jpg" alt="Inversiones Santa Regina" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          </div>
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.4s" }}>
            <div style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: ACCENT, marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>Inversiones Santa Regina</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5.5vw, 68px)", fontWeight: 500, color: "#fff", lineHeight: 1.1, margin: "0 0 24px", letterSpacing: -0.5 }}>
              Patrimonio construido<br /><span style={{ color: ACCENT }}>activo por activo</span>
            </h1>
          </div>
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.6s" }}>
            <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 48px", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>Con una visión de largo plazo</p>
          </div>
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.8s", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => go("servicios")} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", padding: "16px 40px", background: ACCENT, color: "#fff", border: "none", cursor: "pointer", fontWeight: 500 }}>Conocer más</button>
            <button onClick={() => go("contacto")} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", padding: "16px 40px", background: "transparent", color: ACCENT, border: `1px solid ${AL}0.4)`, cursor: "pointer" }}>Contactar</button>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", opacity: loaded ? 1 : 0, transition: "opacity 1.5s ease 1.5s" }}>
          <div style={{ width: 1, height: 48, background: `linear-gradient(to bottom, ${AL}0.4), transparent)` }} />
        </div>
      </section>

      {/* QUÉ HACEMOS */}
      <section style={{ background: "#FAFAF7", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn><div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: ACCENT, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>Qué hacemos</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 500, color: "#0A0F1C", margin: 0 }}>Áreas de negocio</h2>
          </div></FadeIn>
          <AreasGrid clickable />
        </div>
      </section>

      <CtaBand />
    </>
  );
}


/* ═══════════════════════════════════════════
   PAGE: QUIÉNES SOMOS
   ═══════════════════════════════════════════ */
function PageNosotros() {
  return (
    <>
      <PageHeader tag="Quiénes somos" title="Quiénes Somos" subtitle="Una estructura patrimonial con visión institucional y compromiso de largo plazo." />
      <section style={{ background: "#FAFAF7", padding: "100px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48 }}>
              <div>
                <p style={{ fontSize: 17, color: "#333", lineHeight: 1.9, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, margin: "0 0 24px" }}>
                  Santa Regina es la empresa del grupo, creado para administrar, proteger y hacer crecer el patrimonio con una mirada de largo plazo y estándares institucionales.
                </p>
                <p style={{ fontSize: 17, color: "#333", lineHeight: 1.9, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, margin: "0 0 24px" }}>
                  Operamos con un equipo profesional dedicado, aplicando rigor financiero y prudencia en cada decisión. La gobernanza, la transparencia interna y la seguridad jurídica son pilares de nuestra gestión.
                </p>
                <p style={{ fontSize: 17, color: "#555", lineHeight: 1.9, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontStyle: "italic", margin: 0 }}>
                  Nuestro propósito es preservar el patrimonio y generar valor de forma sostenible, con disciplina institucional y visión estratégica.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, alignContent: "start" }}>
                {[
                  { t: "Equipo profesional dedicado", d: "Gestión con estándares institucionales, gobernanza clara y mirada estratégica" },
                  { t: "Visión sostenible de largo plazo", d: "Decisiones orientadas a preservar y hacer crecer el patrimonio generación tras generación" },
                ].map((c, i) => (
                  <div key={i} style={{ background: "#fff", padding: 28, border: "1px solid rgba(0,0,0,0.06)" }}>
                    <div style={{ color: ACCENT, fontSize: 9, marginBottom: 12, letterSpacing: 2 }}>◆</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#0A0F1C", marginBottom: 6 }}>{c.t}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#999", fontWeight: 300, lineHeight: 1.6 }}>{c.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* EQUIPO */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn><div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: ACCENT, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>Nuestro equipo</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 500, color: "#0A0F1C", margin: 0 }}>Equipo de gestión</h2>
          </div></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, justifyItems: "center" }}>
            {[
              { name: "Ariel Kaufmann", role: "Gerente de Inversiones" },
              { name: "Cristóbal Arbizu", role: "Portfolio Manager" },
              { name: "Vicente Rodríguez", role: "Portfolio Manager" },
              { name: "Vicente Banduc", role: "Investment Analyst Intern" },
            ].map((m, idx) => (
              <FadeIn key={idx} delay={idx * 0.12}>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: 112, height: 112, borderRadius: "50%", margin: "0 auto 16px", overflow: "hidden",
                    background: DARK_BG, display: "flex", alignItems: "center", justifyContent: "center",
                    border: `2px solid ${AL}0.15)`,
                  }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, color: ACCENT }}>{m.name.split(" ").map(w => w[0]).join("")}</span>
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, color: "#0A0F1C", marginBottom: 4 }}>{m.name}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#999", fontWeight: 300 }}>{m.role}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}


/* ═══════════════════════════════════════════
   PAGE: QUÉ HACEMOS
   ═══════════════════════════════════════════ */
function PageServicios() {
  const { go } = useContext(RouterCtx);
  const [expanded, setExpanded] = useState(null);

  const SERVICES = [
    {
      tag: "Mercado de capitales", title: "Inversiones Financieras", desc: "Mercado de capitales, renta fija e inversiones alternativas locales y extranjeras.", accent: ACCENT,
      bullets: ["Renta Variable", "Renta Fija", "Venture Capital", "Alternativos"],
    },
    {
      tag: "Inmobiliario", title: "Portafolio Inmobiliario", desc: "Centros de bodegaje, activos industriales build to suit y locales comerciales.", accent: "#5FA37A",
      goTo: "bodegas",
    },
    {
      tag: "Operaciones", title: "Negocios Reales", desc: "Rubro de transporte, logística y comercialización.", accent: "#8B7EC2",
      href: "https://www.transportesnazar.cl/",
    },
    {
      tag: "Inversión directa", title: "Negocios Directos", desc: "Deuda privada originada in house, coinversiones inmobiliarias, venture capital y otros.", accent: "#C2845B",
      bullets: ["Deuda Privada", "Crédito con Garantía", "Crédito Formato Leasing"],
    },
  ];

  return (
    <>
      <PageHeader tag="Qué hacemos" title="Áreas de negocio" subtitle="Gestión activa del patrimonio a través de inversiones financieras, activos inmobiliarios y operaciones reales." />
      <section style={{ background: "#FAFAF7", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {SERVICES.map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{ background: "#fff", padding: 40, border: "1px solid rgba(0,0,0,0.06)", height: "100%", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", transition: "all 0.3s", cursor: "pointer" }}
                  onClick={() => {
                    if (s.href) { window.open(s.href, "_blank", "noopener,noreferrer"); }
                    else if (s.goTo) { go(s.goTo); }
                    else { setExpanded(expanded === i ? null : i); }
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${AL}0.3)`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: s.accent, opacity: 0.5 }} />
                  <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: s.accent, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>{s.tag}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, color: "#0A0F1C", margin: "0 0 14px" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "#888", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, margin: 0 }}>{s.desc}</p>
                  {/* Expandable bullets */}
                  {s.bullets && expanded === i && (
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${AL}0.1)` }}>
                      {s.bullets.map((b, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <div style={{ width: 4, height: 4, borderRadius: "50%", background: s.accent, flexShrink: 0 }} />
                          <span style={{ fontSize: 13, color: "#555", fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 20, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: s.accent, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                    {s.href ? <>Ver más <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg></> : s.goTo ? "Ver arriendos →" : (expanded === i ? "Ocultar ↑" : "Ver más →")}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <section style={{ background: DARK_BG, padding: "100px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeIn><div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: ACCENT, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>Metodología</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 500, color: "#fff", margin: 0 }}>Nuestro proceso</h2>
          </div></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
            {[{ s: "01", t: "Diagnóstico", d: "Evaluación de la situación patrimonial" }, { s: "02", t: "Estrategia", d: "Definición de objetivos y asignación" }, { s: "03", t: "Ejecución", d: "Implementación de las decisiones de inversión" }, { s: "04", t: "Monitoreo", d: "Seguimiento continuo y ajustes" }].map((p, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{ textAlign: "center", padding: "32px 16px", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: ACCENT, lineHeight: 1, marginBottom: 16 }}>{p.s}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 8 }}>{p.t}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{p.d}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}


/* ─── PROPERTY DATA ─── */
const PROPERTIES = [
  {
    id: "el-pinar", featured: true,
    name: "El Pinar 1",
    location: "El Pinar 451, San Joaquín",
    category: "bodega",
    status: "disponible",
    description: "Centro industrial ubicado en la zona central de Santiago, dentro del anillo de Américo Vespucio. Conectividad directa por Vicuña Mackenna, Carlos Valdovinos, Las Industrias y Salvador Allende. A menos de 1 km de Metro Camino Agrícola. Uso de suelo ZU5, apto para industria, talleres, almacenamiento y bodegaje inofensivo.",
    specs: [
      { label: "Terreno", value: "~9.000 m²" },
      { label: "Galpón", value: "~4.250 m²" },
      { label: "Oficinas", value: "420 m² (2 pisos)" },
      { label: "Altura al hombro", value: "~8,5 m" },
    ],
    images: ["/ElPinar1.JPG", "/ElPinar2.JPG", "/ElPinar3.JPG", "/ElPinar4.JPG", "/ElPinar5.JPG", "/ElPinar6.JPG", "/ElPinar7.JPG", "/ElPinar8.JPG"],
    brochure: "/Brochure El Pinar 16032026.pdf",
    areaNum: 4250, units: "1 galpón", vacantes: 1,
    coords: { lat: -33.4916, lng: -70.6276, gmaps: "https://www.google.com/maps/place/El+Pinar+251,+San+Joaqu%C3%ADn,+Regi%C3%B3n+Metropolitana/@-33.4916202,-70.627613,15z" },
  },
  {
    id: "c1", name: "Bodega Lo Espejo 1", location: "Av. Lo Espejo 02124, San Bernardo", category: "bodega", status: "disponible", area: "16.465 m²", areaNum: 16465, units: "81 bodegas", vacantes: 6,
    coords: { lat: -33.5963, lng: -70.7082, gmaps: "https://www.google.com/maps/search/Av+Lo+Espejo+02124+San+Bernardo+Santiago" },
    availableUnits: [
      { id: "B6", m2: 300, images: ["/B6-1.jpg", "/B6-2.jpg"] },
      { id: "B7", m2: 300, images: ["/B7-1.jpg", "/B7-2.jpg"] },
      { id: "H2", m2: 20 },
      { id: "H3", m2: 74, images: ["/H3-1.jpg", "/H3-2.jpg"] },
      { id: "Oficina 4", m2: 24, images: ["/Oficina4.jpg"] },
      { id: "Oficina 9", m2: 22, images: ["/Oficina9.jpg"] },
    ],
  },
  {
    id: "c2", name: "Bodega Lo Espejo 2", location: "Av. Lo Espejo 02360, San Bernardo", category: "bodega", status: "disponible", area: "11.813 m²", areaNum: 11813, units: "37 bodegas", vacantes: 4,
    coords: { lat: -33.5941, lng: -70.7025, gmaps: "https://www.google.com/maps/search/Av+Lo+Espejo+02360+San+Bernardo+Santiago" },
    availableUnits: [
      { id: "G-14", m2: 1000, images: ["/G14-1.JPG", "/G14-2.JPG"] },
      { id: "G-12", m2: 40 },
      { id: "Of 5", m2: 12, images: ["/Oficina5-1.jpg", "/Oficina5-2.jpg"] },
      { id: "Of 6", m2: 36, images: ["/Oficina6-1.jpg", "/Oficina6-2.jpg"] },
    ],
  },
  { id: "c3", name: "Bodega Lo Espejo 3", location: "Av. Lo Espejo 02128, San Bernardo", category: "bodega", status: "ocupado", area: "3.550 m²", areaNum: 3550, units: "1 galpón", coords: { lat: -33.5910, lng: -70.6985, gmaps: "https://www.google.com/maps/search/Av+Lo+Espejo+02128+San+Bernardo+Santiago" } },
  { id: "c4", name: "Bodega Quilicura 1", location: "Av. Cerro Los Cóndores 111, Quilicura", category: "bodega", status: "ocupado", area: "3.700 m²", areaNum: 3700, units: "1 galpón", coords: { lat: -33.3548, lng: -70.7281, gmaps: "https://www.google.com/maps/search/Av+Cerro+Los+Condores+111+Quilicura+Santiago" } },
  { id: "c5", name: "Bodega Quilicura 2 (Parinacota)", location: "Parinacota 381, Quilicura", category: "bodega", status: "ocupado", area: "875 m²", areaNum: 875, units: "1 galpón", coords: { lat: -33.3580, lng: -70.7250, gmaps: "https://www.google.com/maps/search/Parinacota+381+Quilicura+Santiago" } },
  { id: "c6", name: "El Pinar 2", location: "El Pinar 451, San Joaquín", category: "bodega", status: "ocupado", area: "3.233 m²", areaNum: 3233, units: "1 galpón", coords: { lat: -33.4918, lng: -70.6278, gmaps: "https://www.google.com/maps/place/El+Pinar+251,+San+Joaqu%C3%ADn,+Regi%C3%B3n+Metropolitana/@-33.4916202,-70.627613,15z" } },
  { id: "c7", name: "Local Marathon", location: "Marathon 3762-3830, Macul", category: "local", status: "ocupado", area: "1.040 m²", areaNum: 1040, units: "1 local", coords: { lat: -33.4890, lng: -70.5985, gmaps: "https://www.google.com/maps/search/Marathon+3762+Macul+Santiago" } },
  {
    id: "c8", name: "Locales Apoquindo", location: "Apoquindo 3000, Las Condes", category: "local", status: "disponible", area: "810 m²", areaNum: 810, units: "2 locales", vacantes: 1,
    coords: { lat: -33.4118, lng: -70.5836, gmaps: "https://www.google.com/maps/search/Apoquindo+3000+Las+Condes+Santiago" },
    availableUnits: [
      { id: "Local 1", m2: 429 },
    ],
  },
  {
    id: "c10", name: "Locales La Marina", location: "Av. La Marina 1495, Vitacura", category: "local", status: "disponible", area: "300 m²", areaNum: 300, units: "6 locales", vacantes: 1,
    coords: { lat: -33.3892, lng: -70.5701, gmaps: "https://www.google.com/maps/search/Av+La+Marina+1495+Vitacura+Santiago" },
    availableUnits: [
      { id: "Local 6", m2: 55.75 },
    ],
  },
  { id: "c11", name: "Locales Bustamante", location: "Bustamante 1007, Providencia", category: "local", status: "ocupado", area: "627 m²", areaNum: 627, units: "8 locales", coords: { lat: -33.4448, lng: -70.6327, gmaps: "https://www.google.com/maps/search/Bustamante+1007+Providencia+Santiago" } },
  { id: "c12", name: "Locales Irrarázaval", location: "Irrarázaval 4971, Ñuñoa", category: "local", status: "ocupado", area: "320 m²", areaNum: 320, units: "6 locales", coords: { lat: -33.4558, lng: -70.5942, gmaps: "https://www.google.com/maps/search/Irarrazaval+4971+Nunoa+Santiago" } },
];

/* ─── REUSABLE: Image Lightbox ─── */
function Lightbox({ images, index, onClose }) {
  const [current, setCurrent] = useState(index);
  useEffect(() => { const h = (e) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") setCurrent(c => (c + 1) % images.length); if (e.key === "ArrowLeft") setCurrent(c => (c - 1 + images.length) % images.length); }; window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, []);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out", backdropFilter: "blur(8px)" }}>
      <button onClick={onClose} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: 28, lineHeight: 1, fontWeight: 300 }}>✕</button>
      {images.length > 1 && (
        <>
          <button onClick={e => { e.stopPropagation(); setCurrent((current - 1 + images.length) % images.length); }} style={{ position: "absolute", left: 20, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 44, height: 44, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <button onClick={e => { e.stopPropagation(); setCurrent((current + 1) % images.length); }} style={{ position: "absolute", right: 20, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 44, height: 44, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
        </>
      )}
      <img onClick={e => e.stopPropagation()} src={images[current]} alt="" style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", cursor: "default" }} />
      {images.length > 1 && <div style={{ position: "absolute", bottom: 20, color: "rgba(255,255,255,0.5)", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{current + 1} / {images.length}</div>}
    </div>
  );
}

/* ─── REUSABLE: Property Gallery ─── */
function PropertyGallery({ images }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  return (
    <div>
      <div onClick={() => setLightbox(true)} style={{ width: "100%", aspectRatio: "1.7/1", overflow: "hidden", background: "#e8e8e5", cursor: "zoom-in" }}>
        <img src={images[active]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={e => { e.target.style.display = "none"; }} />
      </div>
      {images.length > 1 && (
        <div style={{ display: "flex", gap: 2, background: "#fff" }}>
          {images.map((img, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              flex: 1, height: 56, overflow: "hidden", cursor: "pointer",
              opacity: active === i ? 1 : 0.45, transition: "opacity 0.25s",
              borderBottom: active === i ? `2px solid ${ACCENT}` : "2px solid transparent",
            }}>
              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          ))}
        </div>
      )}
      {lightbox && <Lightbox images={images} index={active} onClose={() => setLightbox(false)} />}
    </div>
  );
}

/* ─── REUSABLE: Property Card ─── */
function PropertyCard({ prop }) {
  const available = prop.status === "disponible";
  const [expanded, setExpanded] = useState(false);
  const [unitM2Filter, setUnitM2Filter] = useState(0);
  const [unitLightbox, setUnitLightbox] = useState(null);
  const hasUnits = prop.availableUnits && prop.availableUnits.length > 0;
  return (
    <div style={{
      background: "#fff", border: "1px solid rgba(0,0,0,0.06)", height: "100%",
      display: "flex", flexDirection: "column", transition: "all 0.3s", position: "relative",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${AL}0.25)`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: available ? "#5FA37A" : "rgba(0,0,0,0.06)" }} />
      <div style={{ padding: "28px 28px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}>
            {prop.category === "bodega" ? "Centro de bodegas" : "Local comercial"}
          </span>
          <span style={{
            fontSize: 10, letterSpacing: 1, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, padding: "3px 10px",
            background: available ? "rgba(95,163,122,0.08)" : "rgba(0,0,0,0.03)",
            color: available ? "#3D7A52" : "#bbb",
            border: available ? "1px solid rgba(95,163,122,0.15)" : "1px solid rgba(0,0,0,0.04)",
          }}>
            {available ? "Disponible" : "Ocupado"}
          </span>
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 600, color: "#0A0F1C", marginBottom: 4, lineHeight: 1.3 }}>{prop.name}</div>
        <div style={{ fontSize: 13, color: "#aaa", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, marginBottom: 20 }}>{prop.location}</div>
        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.04)", display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#ccc", fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>Superficie</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0A0F1C", fontFamily: "'DM Sans', sans-serif" }}>{prop.area}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#ccc", fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>Unidades</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0A0F1C", fontFamily: "'DM Sans', sans-serif" }}>{prop.units}</div>
          </div>
          {prop.vacantes > 0 && (
            <div>
              <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#ccc", fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>Vacantes</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#3D7A52", fontFamily: "'DM Sans', sans-serif" }}>{prop.vacantes}</div>
            </div>
          )}
        </div>
        {/* Action row: expand units + map */}
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          {hasUnits && (
            <button onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: 1, color: ACCENT, background: `${AL}0.06)`,
              border: `1px solid ${AL}0.12)`, padding: "6px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}><polyline points="6,9 12,15 18,9" /></svg>
              {expanded ? "Ocultar" : "Ver"} unidades
            </button>
          )}
          {prop.coords && (
            <a href={prop.coords.gmaps} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: 1, color: "#999", background: "rgba(0,0,0,0.02)",
              border: "1px solid rgba(0,0,0,0.06)", padding: "6px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, textDecoration: "none", transition: "all 0.2s",
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              Google Maps
            </a>
          )}
        </div>
      </div>
      {/* Expandable units list */}
      {hasUnits && expanded && (
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.04)", padding: "16px 28px 20px", background: "#FAFAF7" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#bbb", fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>Unidades disponibles</div>
          {/* Sub-filter by unit m² */}
          {prop.availableUnits.some(u => u.m2) && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 10, letterSpacing: 1, color: "#ccc", fontFamily: "'DM Sans', sans-serif" }}>Desde</span>
              <select value={unitM2Filter} onChange={e => setUnitM2Filter(Number(e.target.value))} style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#666", padding: "4px 8px",
                border: "1px solid rgba(0,0,0,0.08)", background: "#fff", outline: "none", cursor: "pointer",
              }}>
                <option value={0}>Todas</option>
                <option value={20}>20+ m²</option>
                <option value={50}>50+ m²</option>
                <option value={100}>100+ m²</option>
                <option value={200}>200+ m²</option>
                <option value={500}>500+ m²</option>
              </select>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 6 }}>
            {prop.availableUnits.filter(u => !u.m2 || u.m2 >= unitM2Filter).map((u, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid rgba(95,163,122,0.12)", overflow: "hidden" }}>
                {u.images && u.images.length > 0 && (
                  <div onClick={() => setUnitLightbox(u.images)} style={{ display: "flex", gap: 1, cursor: "zoom-in" }}>
                    {u.images.map((img, j) => (
                      <div key={j} style={{ flex: 1, height: 72, overflow: "hidden" }}>
                        <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px" }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0F1C", fontFamily: "'DM Sans', sans-serif" }}>{u.id}</span>
                  <span style={{ fontSize: 12, color: "#3D7A52", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{u.m2 ? `${u.m2} m²` : "—"}</span>
                </div>
              </div>
            ))}
          </div>
          {unitLightbox && <Lightbox images={unitLightbox} index={0} onClose={() => setUnitLightbox(null)} />}
        </div>
      )}
    </div>
  );
}

/* ─── REUSABLE: Leaflet Map ─── */
function LeafletMap({ properties }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
    if (!mapRef.current || !properties.length) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      const L = window.L;
      const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: true, attributionControl: false });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      const bounds = [];
      properties.forEach(p => {
        if (!p.coords) return;
        const { lat, lng } = p.coords;
        bounds.push([lat, lng]);
        const color = p.status === "disponible" ? "#3D7A52" : "#8896A7";
        const marker = L.circleMarker([lat, lng], {
          radius: 8, fillColor: color, color: "#fff", weight: 2, opacity: 1, fillOpacity: 0.85,
        }).addTo(map);
        marker.bindPopup(
          `<div style="font-family:'DM Sans',sans-serif;min-width:160px">` +
          `<div style="font-size:14px;font-weight:600;margin-bottom:4px">${p.name}</div>` +
          `<div style="font-size:12px;color:#888;margin-bottom:8px">${p.location}</div>` +
          `<a href="${p.coords.gmaps}" target="_blank" rel="noopener noreferrer" style="font-size:11px;color:${ACCENT};text-decoration:none;display:flex;align-items:center;gap:4px">` +
          `Abrir en Google Maps ↗</a></div>`,
          { closeButton: false, className: "sr-popup" }
        );
      });

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      }
      mapInstanceRef.current = map;
    };
    if (!document.querySelector('script[src*="leaflet"]')) {
      document.head.appendChild(script);
    } else if (window.L) {
      script.onload();
    }

    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [properties]);

  return (
    <div ref={mapRef} style={{ width: "100%", height: "100%", minHeight: 420, background: "#e8e8e5" }} />
  );
}


/* ═══════════════════════════════════════════
   PAGE: ARRIENDOS
   ═══════════════════════════════════════════ */
function PageBodegas() {
  const [category, setCategory] = useState("bodega");
  const [availability, setAvailability] = useState("todos");
  const [m2Min, setM2Min] = useState(0);
  const [m2Max, setM2Max] = useState(20000);
  const [showMap, setShowMap] = useState(false);

  const featured = PROPERTIES.find(p => p.featured);
  const listProperties = PROPERTIES.filter(p => !p.featured);

  const filtered = listProperties.filter(p => {
    if (p.category !== category) return false;
    if (availability === "disponible" && p.status !== "disponible") return false;
    if (availability === "ocupado" && p.status !== "ocupado") return false;
    const a = p.areaNum || 0;
    if (a < m2Min || a > m2Max) return false;
    return true;
  });

  const showFeatured = category === "bodega" && (availability === "todos" || availability === "disponible") && (featured.areaNum >= m2Min && featured.areaNum <= m2Max);

  const allForMap = PROPERTIES.filter(p => p.coords && p.category === category);

  const tabStyle = (active) => ({
    fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, letterSpacing: 1,
    padding: "14px 32px", cursor: "pointer", transition: "all 0.3s", border: "none",
    background: active ? DARK_BG : "transparent",
    color: active ? ACCENT : "#888",
    borderBottom: active ? `2px solid ${ACCENT}` : "2px solid transparent",
  });

  const filterStyle = (active) => ({
    fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: 1, fontWeight: active ? 600 : 400,
    padding: "8px 18px", cursor: "pointer", transition: "all 0.25s", border: "none",
    background: active ? `${AL}0.1)` : "transparent",
    color: active ? ACCENT : "#aaa",
    borderRadius: 0,
  });

  const sliderTrack = { width: "100%", height: 3, appearance: "none", WebkitAppearance: "none", background: `linear-gradient(to right, #e0e0e0 0%, ${ACCENT} 0%, ${ACCENT} 100%, #e0e0e0 100%)`, outline: "none", cursor: "pointer" };

  return (
    <>
      <PageHeader tag="Arriendos" title="Activos inmobiliarios" subtitle="Bodegas, galpones industriales y locales comerciales operados con rigurosidad institucional." bgImage="/CentroDeBodega.jpg" />

      {/* ─── CATEGORY TABS + FILTERS ─── */}
      <section style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.06)", position: "sticky", top: 64, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          {/* Row 1: tabs + availability */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex" }}>
              <button onClick={() => { setCategory("bodega"); setAvailability("todos"); }} style={tabStyle(category === "bodega")}>Centro de Bodegas</button>
              <button onClick={() => { setCategory("local"); setAvailability("todos"); }} style={tabStyle(category === "local")}>Locales Comerciales</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#ccc", fontFamily: "'DM Sans', sans-serif", marginRight: 8 }}>Filtrar</span>
              {[{ k: "todos", l: "Todos" }, { k: "disponible", l: "Disponibles" }, { k: "ocupado", l: "Ocupados" }].map(f => (
                <button key={f.k} onClick={() => setAvailability(f.k)} style={filterStyle(availability === f.k)}>{f.l}</button>
              ))}
            </div>
          </div>
          {/* Row 2: m² range + map toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 14px", borderTop: "1px solid rgba(0,0,0,0.03)", gap: 24, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 240, maxWidth: 480 }}>
              <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#ccc", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>Superficie</span>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: "#999", fontFamily: "'DM Sans', sans-serif", minWidth: 28, textAlign: "right" }}>{Math.round(m2Min).toLocaleString()}</span>
                <input type="range" min={0} max={20000} step={100} value={m2Min}
                  onChange={e => { const v = Number(e.target.value); if (v <= m2Max - 100) setM2Min(v); }}
                  style={{ ...sliderTrack, flex: 1 }} />
                <input type="range" min={0} max={20000} step={100} value={m2Max}
                  onChange={e => { const v = Number(e.target.value); if (v >= m2Min + 100) setM2Max(v); }}
                  style={{ ...sliderTrack, flex: 1 }} />
                <span style={{ fontSize: 12, color: "#999", fontFamily: "'DM Sans', sans-serif", minWidth: 46 }}>{Math.round(m2Max).toLocaleString()} m²</span>
              </div>
              {(m2Min > 0 || m2Max < 20000) && (
                <button onClick={() => { setM2Min(0); setM2Max(20000); }} style={{ fontSize: 10, color: "#bbb", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textDecoration: "underline" }}>Reset</button>
              )}
            </div>
            <button onClick={() => setShowMap(!showMap)} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: 1, color: showMap ? ACCENT : "#999",
              background: showMap ? `${AL}0.08)` : "transparent", border: `1px solid ${showMap ? `${AL}0.2)` : "rgba(0,0,0,0.06)"}`,
              padding: "7px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {showMap ? "Ocultar mapa" : "Ver mapa"}
            </button>
          </div>
        </div>
      </section>

      {/* ─── MAP PANEL (Leaflet) ─── */}
      {showMap && (
        <section style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 0, minHeight: 420 }}>
              <LeafletMap properties={allForMap} />
              {/* Side list */}
              <div style={{ borderLeft: "1px solid rgba(0,0,0,0.06)", overflowY: "auto", maxHeight: 420 }}>
                <div style={{ padding: "14px 20px 8px", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                  <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: ACCENT, fontFamily: "'DM Sans', sans-serif" }}>Ubicaciones</span>
                </div>
                {allForMap.map(p => (
                  <a key={p.id} href={p.coords.gmaps} target="_blank" rel="noopener noreferrer" style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "14px 20px",
                    borderBottom: "1px solid rgba(0,0,0,0.03)", textDecoration: "none", transition: "background 0.15s", cursor: "pointer",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FAFAF7"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      background: p.status === "disponible" ? "rgba(95,163,122,0.1)" : "rgba(0,0,0,0.03)",
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={p.status === "disponible" ? "#3D7A52" : "#ccc"} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#0A0F1C", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#aaa", fontFamily: "'DM Sans', sans-serif" }}>{p.location}</div>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── CONTENT ─── */}
      <section style={{ background: "#FAFAF7", padding: "64px 32px 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* ── FEATURED: EL PINAR ── */}
          {showFeatured && featured && (
            <FadeIn>
              <div style={{ border: "1px solid rgba(0,0,0,0.06)", background: "#fff", marginBottom: 48 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,440px), 1fr))" }}>
                  {/* Gallery side */}
                  <PropertyGallery images={featured.images} />
                  {/* Info side */}
                  <div style={{ padding: "36px 40px", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: ACCENT, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Propiedad destacada</span>
                      <span style={{ fontSize: 10, padding: "3px 10px", background: "rgba(95,163,122,0.08)", color: "#3D7A52", border: "1px solid rgba(95,163,122,0.15)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: 1 }}>Disponible</span>
                    </div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 500, color: "#0A0F1C", margin: "0 0 4px", lineHeight: 1.2 }}>{featured.name}</h3>
                    <p style={{ fontSize: 13, color: "#aaa", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, margin: "0 0 20px" }}>{featured.location}</p>
                    <p style={{ fontSize: 14, color: "#666", lineHeight: 1.85, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, margin: "0 0 24px" }}>{featured.description}</p>
                    {/* Specs */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
                      {featured.specs.map((sp, i) => (
                        <div key={i} style={{ padding: "12px 16px", background: "#FAFAF7" }}>
                          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#bbb", fontFamily: "'DM Sans', sans-serif", marginBottom: 3 }}>{sp.label}</div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: "#0A0F1C", fontFamily: "'DM Sans', sans-serif" }}>{sp.value}</div>
                        </div>
                      ))}
                    </div>
                    {/* Brochure button + Map */}
                    <div style={{ marginTop: "auto", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                      <a href={featured.brochure} target="_blank" rel="noopener noreferrer" style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase",
                        padding: "14px 28px", background: DARK_BG, color: ACCENT, textDecoration: "none", fontWeight: 500, transition: "background 0.3s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = DARK_LIGHT}
                        onMouseLeave={e => e.currentTarget.style.background = DARK_BG}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                        Descargar brochure
                      </a>
                      {featured.coords && (
                        <a href={featured.coords.gmaps} target="_blank" rel="noopener noreferrer" style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: 1,
                          padding: "10px 18px", background: "transparent", color: "#999",
                          border: "1px solid rgba(0,0,0,0.1)", textDecoration: "none", transition: "all 0.2s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(107,158,206,0.3)`; e.currentTarget.style.color = ACCENT; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.color = "#999"; }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                          Ver mapa
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {/* ── PROPERTIES GRID ── */}
          {filtered.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
              {filtered.map((prop, i) => (
                <FadeIn key={prop.id} delay={i * 0.05}>
                  <PropertyCard prop={prop} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <p style={{ fontSize: 15, color: "#bbb", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                No hay {category === "bodega" ? "bodegas" : "locales comerciales"} {availability === "disponible" ? "disponibles" : availability === "ocupado" ? "ocupados" : ""} actualmente.
              </p>
            </div>
          )}

          {/* Summary bar */}
          <div style={{ marginTop: 48, padding: "20px 28px", background: "#fff", border: "1px solid rgba(0,0,0,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ fontSize: 13, color: "#999", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              {category === "bodega" ? "Centro de Bodegas" : "Locales Comerciales"} — {filtered.length + (showFeatured && featured ? 1 : 0)} {filtered.length + (showFeatured && featured ? 1 : 0) === 1 ? "activo" : "activos"} {availability !== "todos" ? (availability === "disponible" ? "disponibles" : "ocupados") : "en portafolio"}
            </div>
            <div style={{ fontSize: 12, color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}>
              Portafolio total: ~46.108 m² · 146 unidades · 12 centros
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}


/* ═══════════════════════════════════════════
   PAGE: CONTACTO
   ═══════════════════════════════════════════ */
function PageContacto() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const handle = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const inputStyle = { width: "100%", padding: "14px 16px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", background: "#FAFAF7", border: "1px solid rgba(0,0,0,0.08)", outline: "none", transition: "border-color 0.3s", color: "#0A0F1C", boxSizing: "border-box" };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/maqlbdgn", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
      });
      if (res.ok) { setStatus("sent"); setForm({ name: "", email: "", message: "" }); }
      else { setStatus("error"); }
    } catch { setStatus("error"); }
  };

  return (
    <>
      <PageHeader tag="Contacto" title="Contacto" subtitle="Para consultas o información adicional." />
      <section style={{ background: "#FAFAF7", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 64, alignItems: "start" }}>
            <FadeIn>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, color: "#0A0F1C", margin: "0 0 24px" }}>Datos de contacto</h3>
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 24 }}>
                  {[
                    { label: "Dirección", value: "Av. Alonso de Córdoba 2860, Oficina 603" },
                    { label: "Teléfono", value: "+56 9 8340 6060" },
                    { label: "Email", value: "info@santaregina.cl" },
                    { label: "LinkedIn", value: "linkedin.com/company/santaregina" },
                  ].map((item, i) => (
                    <div key={i} style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: ACCENT, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>{item.label}</div>
                      <div style={{ fontSize: 15, color: "#555", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 24, padding: 24, background: "#fff", border: "1px solid rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0A0F1C", fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>Confidencialidad</div>
                  <div style={{ fontSize: 13, color: "#999", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.7 }}>Inversiones Santa Regina opera bajo estrictos estándares de confidencialidad y reserva.</div>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div style={{ background: "#fff", padding: 48, border: "1px solid rgba(0,0,0,0.04)" }}>
                {status === "sent" ? (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${AL}0.1)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2"><polyline points="20,6 9,17 4,12" /></svg>
                    </div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "#0A0F1C", margin: "0 0 8px" }}>Mensaje recibido</h3>
                    <p style={{ fontSize: 14, color: "#999", fontFamily: "'DM Sans', sans-serif" }}>Revisaremos su consulta a la brevedad.</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#999", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 8 }}>Nombre</label>
                      <input type="text" name="name" value={form.name} onChange={handle("name")} placeholder="Nombre completo" style={inputStyle} onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.08)"} />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#999", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 8 }}>Email</label>
                      <input type="email" name="email" value={form.email} onChange={handle("email")} placeholder="email@ejemplo.com" style={inputStyle} onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.08)"} />
                    </div>
                    <div style={{ marginBottom: 28 }}>
                      <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#999", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 8 }}>Mensaje</label>
                      <textarea name="message" value={form.message} onChange={handle("message")} placeholder="Escriba su consulta" rows={5} style={{ ...inputStyle, resize: "vertical" }} onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.08)"} />
                    </div>
                    {status === "error" && (
                      <div style={{ marginBottom: 16, padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FECACA", fontSize: 13, color: "#991B1B", fontFamily: "'DM Sans', sans-serif" }}>
                        Error al enviar. Intente nuevamente o escriba a info@santaregina.cl
                      </div>
                    )}
                    <button onClick={handleSubmit} disabled={status === "sending"} style={{ width: "100%", padding: "16px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", background: DARK_BG, color: ACCENT, border: "none", cursor: status === "sending" ? "wait" : "pointer", fontWeight: 500, opacity: status === "sending" ? 0.6 : 1 }}>
                      {status === "sending" ? "Enviando..." : "Enviar"}
                    </button>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}


/* ═══════════════════════════════════════════
   APP ROUTER
   ═══════════════════════════════════════════ */
export default function SantaRegina() {
  const [page, setPage] = useState("inicio");
  const [fade, setFade] = useState(true);

  const go = (p) => {
    if (p === page) return;
    setFade(false);
    setTimeout(() => {
      setPage(p);
      window.scrollTo({ top: 0, behavior: "instant" });
      setTimeout(() => setFade(true), 30);
    }, 250);
  };

  const pages = { inicio: PageInicio, nosotros: PageNosotros, servicios: PageServicios, bodegas: PageBodegas, contacto: PageContacto };
  const Page = pages[page] || PageInicio;

  return (
    <RouterCtx.Provider value={{ page, go }}>
      <div style={{ fontFamily: "'DM Sans', sans-serif", WebkitFontSmoothing: "antialiased" }}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap" rel="stylesheet" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          ::selection { background: ${AL}0.3); color: ${DARK_BG}; }
          @media (max-width: 768px) { .sr-nav-desk { display: none !important; } .sr-nav-mob { display: block !important; } }
          @media (min-width: 769px) { .sr-nav-mob { display: none !important; } }
          input::placeholder, textarea::placeholder { color: #bbb; }
          input[type="range"] { -webkit-appearance: none; appearance: none; height: 3px; background: #e0e0e0; outline: none; cursor: pointer; }
          input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: ${ACCENT}; border: 2px solid #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.15); cursor: pointer; }
          input[type="range"]::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: ${ACCENT}; border: 2px solid #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.15); cursor: pointer; }
          .sr-popup .leaflet-popup-content-wrapper { border-radius: 0; box-shadow: 0 2px 12px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.06); }
          .sr-popup .leaflet-popup-tip { display: none; }
          .leaflet-control-zoom a { border-radius: 0 !important; }
        `}</style>
        <Nav />
        <div style={{ opacity: fade ? 1 : 0, transform: fade ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.25s ease, transform 0.25s ease" }}>
          <Page />
        </div>
        <Footer />
      </div>
    </RouterCtx.Provider>
  );
}