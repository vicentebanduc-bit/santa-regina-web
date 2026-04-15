import { useState, useEffect, useRef, createContext, useContext } from "react";

const RouterCtx = createContext({ page: "inicio", go: () => {} });

/* Corporate blue accent color - Updated March 30, 2026 */
const ACCENT = "#5B8EC2";
const ACCENT_LIGHT = "rgba(91,142,194,";
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
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: transparent ? "transparent" : `rgba(11,22,40,0.97)`, backdropFilter: transparent ? "none" : "blur(20px)", borderBottom: transparent ? "none" : `1px solid ${ACCENT_LIGHT}0.12)`, transition: "all 0.5s ease" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: transparent ? 76 : 64, transition: "height 0.5s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => go("inicio")}>
          <div style={{ width: 36, height: 36, border: `1.5px solid ${ACCENT}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: ACCENT, letterSpacing: 1 }}>SR</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "#fff", letterSpacing: 2, lineHeight: 1.1 }}>SANTA REGINA</div>
            <div style={{ fontSize: 9, color: `${ACCENT_LIGHT}0.8)`, letterSpacing: 3, textTransform: "uppercase" }}>Family Office</div>
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
      <div style={{ position: "absolute", top: "20%", right: "15%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT_LIGHT}0.05) 0%, transparent 70%)` }} />
      <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1, opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(24px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s" }}>
        <div style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: ACCENT, marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>{tag}</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 500, color: "#fff", lineHeight: 1.15, margin: "0 0 20px", letterSpacing: -0.5 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>{subtitle}</p>}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${ACCENT_LIGHT}0.15), transparent)` }} />
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  const { go } = useContext(RouterCtx);
  return (
    <footer style={{ background: DARK_BG, padding: "64px 32px 32px", borderTop: `1px solid ${ACCENT_LIGHT}0.08)` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, border: `1px solid ${ACCENT_LIGHT}0.3)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontWeight: 600, color: ACCENT }}>SR</span>
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
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif" }}>© 2026 Santa Regina Family Office. Todos los derechos reservados.</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif" }}>Santiago, Chile</div>
        </div>
      </div>
    </footer>
  );
}

/* ─── CTA BAND (simple contact) ─── */
function CtaBand() {
  const { go } = useContext(RouterCtx);
  return (
    <section style={{ background: `linear-gradient(165deg, ${DARK_BG} 0%, ${DARK_MID} 100%)`, padding: "80px 32px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${ACCENT_LIGHT}0.15), transparent)` }} />
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <FadeIn>
          <div style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: ACCENT, marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>Contacto</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 500, color: "#fff", margin: "0 0 16px", lineHeight: 1.3 }}>Conversemos</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", margin: "0 auto 36px", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>Conversemos sobre cómo podemos ayudarle a construir y proteger su patrimonio familiar.</p>
          <button onClick={() => go("contacto")} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", padding: "16px 48px", background: ACCENT, color: "#fff", border: "none", cursor: "pointer", fontWeight: 500, transition: "opacity 0.3s" }}
            onMouseEnter={e => e.target.style.opacity = "0.85"} onMouseLeave={e => e.target.style.opacity = "1"}
          >Contactar</button>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── SHARED: 4 AREAS DE NEGOCIO ─── */
const AREAS = [
  { tag: "Mercado de capitales", title: "Inversiones Financieras", desc: "Mercado de capitales, renta fija e inversiones alternativas locales y extranjeras.", accent: ACCENT },
  { tag: "Inmobiliario", title: "Portafolio Inmobiliario", desc: "Centros de bodegaje, activos industriales build to suit y locales comerciales.", accent: "#5FA37A" },
  { tag: "Operaciones", title: "Negocios Reales", desc: "Rubro de transporte, logística y comercialización.", accent: "#8B7EC2" },
  { tag: "Inversión directa", title: "Negocios Directos", desc: "Deuda privada originada in house, coinversiones inmobiliarias, venture capital y otros.", accent: "#C2845B" },
];

function AreasGrid({ onClickArea }) {
  const { go } = useContext(RouterCtx);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
      {AREAS.map((s, i) => (
        <FadeIn key={i} delay={i * 0.1}>
          <div style={{ background: "#fff", padding: 36, border: "1px solid rgba(0,0,0,0.06)", transition: "all 0.3s", cursor: onClickArea ? "pointer" : "default", height: "100%", position: "relative", overflow: "hidden" }}
            onClick={() => onClickArea && go("servicios")}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${ACCENT_LIGHT}0.3)`; if (onClickArea) e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; if (onClickArea) e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: s.accent, opacity: 0.5 }} />
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: s.accent, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>{s.tag}</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 500, color: "#0A0F1C", margin: "0 0 12px" }}>{s.title}</h3>
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, margin: 0 }}>{s.desc}</p>
            {onClickArea && <span style={{ display: "inline-block", marginTop: 16, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: ACCENT, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Ver más →</span>}
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
      {/* HERO with Sanhattan.jpg background */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: `linear-gradient(165deg, rgba(11,22,40,0.85) 0%, rgba(15,29,51,0.82) 40%, rgba(22,38,62,0.85) 70%, rgba(11,22,40,0.9) 100%), url('/Sanhattan.jpg') center/cover no-repeat`,
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `radial-gradient(circle at 1px 1px, ${ACCENT} 0.5px, transparent 0)`, backgroundSize: "48px 48px" }} />
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT_LIGHT}0.06) 0%, transparent 70%)` }} />
        <div style={{ position: "absolute", bottom: "15%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT_LIGHT}0.04) 0%, transparent 70%)` }} />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "120px 32px 80px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.2s" }}>
            <div style={{ width: 64, height: 64, border: `1.5px solid ${ACCENT_LIGHT}0.4)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px" }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: ACCENT }}>SR</span>
            </div>
          </div>
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.4s" }}>
            <div style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: ACCENT, marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>Santa Regina Family Office</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5.5vw, 68px)", fontWeight: 500, color: "#fff", lineHeight: 1.1, margin: "0 0 24px", letterSpacing: -0.5 }}>
              Patrimonio construido<br /><span style={{ color: ACCENT }}>activo por activo</span>
            </h1>
          </div>
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.6s" }}>
            <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 48px", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>Con una visión de largo plazo</p>
          </div>
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.8s", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => go("servicios")} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", padding: "16px 40px", background: ACCENT, color: "#fff", border: "none", cursor: "pointer", fontWeight: 500 }}>Conocer más</button>
            <button onClick={() => go("contacto")} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", padding: "16px 40px", background: "transparent", color: ACCENT, border: `1px solid ${ACCENT_LIGHT}0.4)`, cursor: "pointer" }}>Contactar</button>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", opacity: loaded ? 1 : 0, transition: "opacity 1.5s ease 1.5s" }}>
          <div style={{ width: 1, height: 48, background: `linear-gradient(to bottom, ${ACCENT_LIGHT}0.4), transparent)` }} />
        </div>
      </section>

      {/* QUÉ HACEMOS - 4 ÁREAS */}
      <section style={{ background: "#FAFAF7", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn><div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: ACCENT, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>Qué hacemos</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 500, color: "#0A0F1C", margin: 0 }}>Áreas de negocio</h2>
          </div></FadeIn>
          <AreasGrid onClickArea />
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
      <PageHeader tag="Quiénes somos" title="Quiénes Somos" subtitle="Creemos en una visión de largo plazo para la administración patrimonial." />
      <section style={{ background: "#FAFAF7", padding: "100px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48 }}>
              <div>
                <p style={{ fontSize: 17, color: "#333", lineHeight: 1.9, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, margin: "0 0 24px" }}>Creemos en una visión de largo plazo para la administración patrimonial, velando siempre por los intereses de cada familia y su legado.</p>
                <p style={{ fontSize: 17, color: "#333", lineHeight: 1.9, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, margin: "0 0 24px" }}>Nuestra gestión se caracteriza por el rigor institucional y la prudencia financiera. Cada decisión es tomada considerando la seguridad jurídica y la transparencia.</p>
                <p style={{ fontSize: 17, color: "#555", lineHeight: 1.9, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontStyle: "italic", margin: 0 }}>La confianza mutua es nuestro principal activo; impulsamos relaciones sólidas gracias a la seriedad y el respaldo de Santa Regina Family Office.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, alignContent: "start" }}>
                {[
                  { t: "Equipo profesional externo a la familia", d: "Gestión independiente con estándares institucionales y mirada objetiva" },
                  { t: "Mirada sostenible de largo plazo", d: "Decisiones orientadas a preservar y hacer crecer el patrimonio generación tras generación" },
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
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn><div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: ACCENT, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>Nuestro equipo</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 500, color: "#0A0F1C", margin: 0 }}>Profesionales comprometidos</h2>
          </div></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, justifyItems: "center" }}>
            {[{ i: "VB", n: "Vicente B.", r: "Director General" }, { i: "AD", n: "Andrés D.", r: "Director de Inversiones" }, { i: "MR", n: "Martín R.", r: "Director Operaciones" }].map((m, idx) => (
              <FadeIn key={idx} delay={idx * 0.12}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 96, height: 96, borderRadius: "50%", background: DARK_BG, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, color: ACCENT }}>{m.i}</span>
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, color: "#0A0F1C", marginBottom: 4 }}>{m.n}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#999", fontWeight: 300 }}>{m.r}</div>
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
   PAGE: QUÉ HACEMOS (ex Servicios)
   ═══════════════════════════════════════════ */
function PageServicios() {
  return (
    <>
      <PageHeader tag="Qué hacemos" title="Áreas de negocio" subtitle="Inversiones financieras, portafolio inmobiliario, negocios reales y negocios directos." />
      <section style={{ background: "#FAFAF7", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {AREAS.map((s, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)", padding: 40, height: "100%", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", transition: "all 0.3s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `${ACCENT_LIGHT}0.3)`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: s.accent, opacity: 0.5 }} />
                  <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: s.accent, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>{s.tag}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, color: "#0A0F1C", margin: "0 0 14px" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "#888", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, margin: 0 }}>{s.desc}</p>
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
            {[{ s: "01", t: "Diagnóstico", d: "Entendemos la situación y necesidades" }, { s: "02", t: "Estrategia", d: "Definimos objetivos y plan" }, { s: "03", t: "Implementación", d: "Ejecutamos acciones patrimoniales" }, { s: "04", t: "Seguimiento", d: "Monitoreo y ajuste continuo" }].map((p, i) => (
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


/* ═══════════════════════════════════════════
   PAGE: ARRIENDOS (ex Centros de Bodega)
   ═══════════════════════════════════════════ */
function PageBodegas() {
  return (
    <>
      <PageHeader tag="Arriendos" title="Centros de Bodega" subtitle="Una expresión de nuestra convicción inmobiliaria. Activos físicos, flujos estables y valor de largo plazo." bgImage="/CentroDeBodega.jpg" />

      <section style={{ background: "#FAFAF7", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ background: DARK_BG, padding: "44px 48px", marginBottom: 60, border: `1px solid ${ACCENT_LIGHT}0.15)` }}>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.9, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, margin: 0, textAlign: "center", maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
                Más del 60% de las inversiones de Santa Regina son activos reales. Los Centros de Bodega no son un negocio separado — son parte de una estrategia patrimonial integral, seleccionados, estructurados y operados con la misma rigurosidad institucional que aplicamos a cada inversión del portafolio.
              </p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {[
              { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>, title: "Ubicación estratégica", desc: "Centros conectados a las principales vías logísticas, maximizando accesibilidad y demanda." },
              { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>, title: "Infraestructura moderna", desc: "Espacios diseñados con estándares de primer nivel para operación eficiente y segura." },
              { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, title: "Soporte permanente", desc: "Equipo operativo dedicado con atención continua para cada centro y sus arrendatarios." },
            ].map((c, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <div style={{ background: "#fff", padding: 40, border: "1px solid rgba(0,0,0,0.06)", height: "100%", transition: "all 0.3s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `${ACCENT_LIGHT}0.3)`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"}>
                  <div style={{ marginBottom: 20 }}>{c.icon}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 500, color: "#0A0F1C", margin: "0 0 12px" }}>{c.title}</h3>
                  <p style={{ fontSize: 14, color: "#888", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, margin: 0 }}>{c.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DUVIFY ARRIENDO SECTION ─── */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ border: `1px solid ${ACCENT_LIGHT}0.2)`, padding: "56px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${ACCENT}, #7AAED4, ${ACCENT})` }} />
              <div style={{ position: "absolute", inset: 0, opacity: 0.015, backgroundImage: `radial-gradient(circle at 1px 1px, ${ACCENT} 0.5px, transparent 0)`, backgroundSize: "32px 32px" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${ACCENT_LIGHT}0.08)`, padding: "8px 20px", marginBottom: 28, border: `1px solid ${ACCENT_LIGHT}0.15)` }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5"><path d="M15 3h6v6" /><path d="M10 14L21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
                  <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: ACCENT, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Plataforma de arriendo</span>
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 500, color: "#0A0F1C", margin: "0 0 16px", lineHeight: 1.2 }}>Arriende su bodega online</h2>
                <p style={{ fontSize: 16, color: "#777", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, maxWidth: 540, margin: "0 auto 16px" }}>
                  Explore nuestra disponibilidad de bodegas, compare tamaños y ubicaciones, y gestione su arriendo directamente a través de nuestra plataforma en Duvify.
                </p>
                <p style={{ fontSize: 14, color: "#aaa", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, maxWidth: 480, margin: "0 auto 36px" }}>
                  Cotización instantánea · Contratos digitales · Soporte dedicado
                </p>
                <a href="https://santaregina.duvify.com" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 14, letterSpacing: 2, textTransform: "uppercase", padding: "18px 48px", background: DARK_BG, color: ACCENT, border: "none", cursor: "pointer", fontWeight: 500, textDecoration: "none", transition: "all 0.3s" }}
                  onMouseEnter={e => e.currentTarget.style.background = DARK_LIGHT}
                  onMouseLeave={e => e.currentTarget.style.background = DARK_BG}>
                  Ver bodegas disponibles
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
                </a>
                <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
                  {[{ n: "20+", l: "Bodegas disponibles" }, { n: "24/7", l: "Acceso seguro" }, { n: "100%", l: "Digital" }].map((s, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, color: ACCENT, lineHeight: 1 }}>{s.n}</div>
                      <div style={{ fontSize: 11, color: "#aaa", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
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
  const [sent, setSent] = useState(false);
  const handle = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const inputStyle = { width: "100%", padding: "14px 16px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", background: "#FAFAF7", border: "1px solid rgba(0,0,0,0.08)", outline: "none", transition: "border-color 0.3s", color: "#0A0F1C", boxSizing: "border-box" };

  return (
    <>
      <PageHeader tag="Contacto" title="Conversemos" subtitle="Envíanos tu consulta y te responderemos a la mayor brevedad." />
      <section style={{ background: "#FAFAF7", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 64, alignItems: "start" }}>
            <FadeIn>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, color: "#0A0F1C", margin: "0 0 24px" }}>Datos de contacto</h3>
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 24 }}>
                  {[
                    { label: "Dirección", value: "Av. El Bosque Norte 0123, Las Condes, Santiago" },
                    { label: "Teléfono", value: "+56 2 2345 6789" },
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
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0A0F1C", fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>Confidencialidad garantizada</div>
                  <div style={{ fontSize: 13, color: "#999", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.7 }}>Santa Regina Family Office opera bajo estrictos estándares de confidencialidad.</div>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div style={{ background: "#fff", padding: 48, border: "1px solid rgba(0,0,0,0.04)" }}>
                {sent ? (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${ACCENT_LIGHT}0.1)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2"><polyline points="20,6 9,17 4,12" /></svg>
                    </div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "#0A0F1C", margin: "0 0 8px" }}>Mensaje enviado</h3>
                    <p style={{ fontSize: 14, color: "#999", fontFamily: "'DM Sans', sans-serif" }}>Nos pondremos en contacto pronto.</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#999", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 8 }}>Nombre</label>
                      <input type="text" value={form.name} onChange={handle("name")} placeholder="Su nombre" style={inputStyle} onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.08)"} />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#999", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 8 }}>Email</label>
                      <input type="email" value={form.email} onChange={handle("email")} placeholder="email@ejemplo.com" style={inputStyle} onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.08)"} />
                    </div>
                    <div style={{ marginBottom: 28 }}>
                      <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#999", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 8 }}>Mensaje</label>
                      <textarea value={form.message} onChange={handle("message")} placeholder="¿En qué podemos ayudarle?" rows={5} style={{ ...inputStyle, resize: "vertical" }} onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.08)"} />
                    </div>
                    <button onClick={() => setSent(true)} style={{ width: "100%", padding: "16px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", background: DARK_BG, color: ACCENT, border: "none", cursor: "pointer", fontWeight: 500 }}>Enviar mensaje</button>
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
          ::selection { background: ${ACCENT_LIGHT}0.3); color: ${DARK_BG}; }
          @media (max-width: 768px) { .sr-nav-desk { display: none !important; } .sr-nav-mob { display: block !important; } }
          @media (min-width: 769px) { .sr-nav-mob { display: none !important; } }
          input::placeholder, textarea::placeholder { color: #bbb; }
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
