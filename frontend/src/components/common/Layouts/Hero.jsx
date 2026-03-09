import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./../Navbar";
import img from "./../../../assets/ing.png";
import feature1 from "./../../../assets/f1.jpg";
import feature2 from "./../../../assets/f2.jpg";
import feature3 from "../../../assets/f3.jpg";
import testi1 from "../../../assets/t.jpg";
import testi2 from "../../../assets/testi2.png";
import testi3 from "../../../assets/testi3.png";
import { FaHeartbeat, FaChartLine, FaUsers, FaRunning } from "react-icons/fa";

// ─── Intersection Observer Hook ───────────────────────────────────────────────
const useReveal = (threshold = 0.12) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
};

// ─── Animated Counter ─────────────────────────────────────────────────────────
const Counter = ({ end, suffix = "", duration = 2200 }) => {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal(0.3);
  useEffect(() => {
    if (!visible) return;
    let raf;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * end));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, end, duration]);
  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// ─── Global Styles ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,700&family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    .fl-page { font-family: 'Sora', sans-serif; background: #030804; color: #fff; overflow-x: hidden; }
    .fl-page a { text-decoration: none; }

    /* Reveal system */
    .rv       { opacity: 0; transform: translateY(48px);   transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
    .rv-l     { opacity: 0; transform: translateX(-56px);  transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
    .rv-r     { opacity: 0; transform: translateX(56px);   transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
    .rv-s     { opacity: 0; transform: scale(0.9);         transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
    .rv.on, .rv-l.on, .rv-r.on, .rv-s.on { opacity: 1; transform: none; }
    .d1 { transition-delay: 0.08s !important; }
    .d2 { transition-delay: 0.16s !important; }
    .d3 { transition-delay: 0.24s !important; }
    .d4 { transition-delay: 0.32s !important; }
    .d5 { transition-delay: 0.4s  !important; }
    .d6 { transition-delay: 0.48s !important; }

    /* Hero entrance */
    .h-line1 { opacity:0; transform:translateY(72px) skewY(2deg);
      transition: opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.15s; }
    .h-line2 { opacity:0; transform:translateY(72px) skewY(2deg);
      transition: opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.35s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.35s; }
    .h-sub   { opacity:0; transform:translateY(32px);
      transition: opacity 0.9s ease 0.7s, transform 0.9s ease 0.7s; }
    .h-cta   { opacity:0; transform:translateY(24px);
      transition: opacity 0.9s ease 0.95s, transform 0.9s ease 0.95s; }
    .h-badge { opacity:0; transform:translateX(-16px);
      transition: opacity 0.7s ease 1.2s, transform 0.7s ease 1.2s; }
    .loaded .h-line1, .loaded .h-line2, .loaded .h-sub,
    .loaded .h-cta, .loaded .h-badge { opacity:1; transform:none; }

    /* Buttons */
    .btn-g {
      display: inline-flex; align-items: center; gap: 8px;
      background: #00ff57; color: #000;
      padding: 15px 36px; border-radius: 6px;
      font-family: 'Sora', sans-serif; font-weight: 700; font-size: 13px;
      letter-spacing: 0.08em; text-transform: uppercase;
      position: relative; overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .btn-g::after { content:''; position:absolute; inset:0;
      background: linear-gradient(135deg, #1aff6b, #00ff57);
      opacity:0; transition: opacity 0.3s ease; }
    .btn-g:hover { transform: translateY(-3px); box-shadow: 0 14px 44px rgba(0,255,87,0.45); }
    .btn-g:hover::after { opacity:1; }
    .btn-g span { position: relative; z-index:1; }

    .btn-o {
      display: inline-flex; align-items: center; gap: 8px;
      background: transparent;
      border: 1px solid rgba(255,255,255,0.14);
      color: #fff; padding: 15px 32px; border-radius: 6px;
      font-family: 'Sora', sans-serif; font-weight: 600; font-size: 13px;
      letter-spacing: 0.05em; backdrop-filter: blur(12px);
      transition: background 0.25s ease, border-color 0.25s ease, transform 0.2s ease;
    }
    .btn-o:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.28); transform: translateY(-2px); }

    /* Feature cards */
    .fc {
      background: #080f09; border: 1px solid #182219;
      border-radius: 18px; padding: 32px 28px;
      position: relative; overflow: hidden;
      transition: transform 0.45s cubic-bezier(0.16,1,0.3,1),
                  box-shadow 0.45s ease, border-color 0.3s ease;
    }
    .fc::before { content:''; position:absolute; top:0; left:0; right:0; height:1px;
      background: linear-gradient(90deg, #00ff57 0%, transparent 80%); }
    .fc:hover { transform: translateY(-10px); box-shadow: 0 28px 64px rgba(0,255,87,0.1); border-color: #00ff5730; }
    .fc:hover .fc-icon { background: rgba(0,255,87,0.18) !important; transform: scale(1.12) rotate(-3deg); }
    .fc-icon { transition: background 0.3s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1); }

    /* Benefit cards */
    .bc { border-radius: 18px; overflow: hidden; background: #080f09; border: 1px solid #182219;
      transition: transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s ease; }
    .bc:hover { transform: translateY(-8px); box-shadow: 0 24px 60px rgba(0,0,0,0.6); }
    .bc:hover .bc-img { transform: scale(1.08); }
    .bc-img { transition: transform 0.7s cubic-bezier(0.16,1,0.3,1); }

    /* Testi cards */
    .tc { background: #080f09; border: 1px solid #182219; border-radius: 18px; padding: 30px;
      position: relative; overflow: hidden;
      transition: transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s ease, border-color 0.3s ease; }
    .tc:hover { transform: translateY(-8px); box-shadow: 0 24px 60px rgba(0,0,0,0.6); border-color: #00ff5730; }

    /* Stat numbers */
    .stat-n { font-family: 'Barlow Condensed', sans-serif; font-style: italic; }

    /* Marquee */
    @keyframes mq { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    .mq-inner { animation: mq 28s linear infinite; display:inline-flex; white-space:nowrap; }
    .mq-inner:hover { animation-play-state:paused; }

    /* Glow orb pulse */
    @keyframes glowB { 0%,100%{opacity:0.35} 50%{opacity:0.7} }
    .gorb { animation: glowB 5s ease-in-out infinite; }

    /* Pulse ring */
    @keyframes pr { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(1.9);opacity:0} }
    .pring { animation: pr 2.2s ease-out infinite; }

    /* Diagonal grid background */
    .diag-grid {
      background-image:
        linear-gradient(rgba(0,255,87,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,87,0.03) 1px, transparent 1px);
      background-size: 64px 64px;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #030804; }
    ::-webkit-scrollbar-thumb { background: #00ff5740; border-radius: 2px; }

    /* Section label */
    .sl { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #00ff57; }

    /* Number accent */
    .num-accent { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-style: italic; }
  `}</style>
);

// ─── Reveal wrapper component ─────────────────────────────────────────────────
const Reveal = ({ children, cls = "rv", delay = "", style = {} }) => {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`${cls} ${delay} ${visible ? "on" : ""}`}
      style={style}
    >
      {children}
    </div>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHead = ({ eyebrow, title, accent, sub, center = false }) => {
  const [ref, visible] = useReveal(0.1);
  return (
    <div
      ref={ref}
      style={{ textAlign: center ? "center" : "left", marginBottom: "56px" }}
    >
      <div
        className={`rv d1 ${visible ? "on" : ""}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "14px",
        }}
      >
        <div style={{ width: "28px", height: "2px", background: "#00ff57" }} />
        <span className="sl">{eyebrow}</span>
      </div>
      <h2
        className={`rv d2 ${visible ? "on" : ""}`}
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(40px, 6vw, 72px)",
          lineHeight: 0.93,
          letterSpacing: "0.01em",
          textTransform: "uppercase",
          marginBottom: sub ? "20px" : 0,
        }}
      >
        {title}{" "}
        {accent && (
          <span
            style={{
              color: "#00ff57",
              fontStyle: "italic",
              textShadow: "0 0 50px rgba(0,255,87,0.25)",
            }}
          >
            {accent}
          </span>
        )}
      </h2>
      {sub && (
        <p
          className={`rv d3 ${visible ? "on" : ""}`}
          style={{
            color: "#6b7280",
            fontSize: "15px",
            lineHeight: 1.75,
            fontWeight: 300,
            maxWidth: center ? "520px" : "400px",
            margin: center ? "0 auto" : 0,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const HomePage = () => {
  const [loaded, setLoaded] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const h = (e) =>
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const stats = [
    { val: 50000, suf: "+", label: "Active Members" },
    { val: 1200, suf: "+", label: "Workout Plans" },
    { val: 98, suf: "%", label: "Satisfaction" },
    { val: 24, suf: "/7", label: "Support" },
  ];

  const features = [
    {
      icon: <FaHeartbeat size={20} />,
      title: "Heart Rate Monitoring",
      desc: "Real-time biometric tracking synced to your sessions for peak performance zones.",
      tag: "HEALTH",
    },
    {
      icon: <FaRunning size={20} />,
      title: "Activity Tracking",
      desc: "Auto-detect workouts, log steps and calories with intelligent classification.",
      tag: "MOTION",
    },
    {
      icon: <FaChartLine size={20} />,
      title: "Progress Analysis",
      desc: "Smart visual insights derived from your personal data — week by week.",
      tag: "DATA",
    },
    {
      icon: <FaUsers size={20} />,
      title: "Community Support",
      desc: "Group challenges, leaderboards, and peer accountability to keep you moving.",
      tag: "SOCIAL",
    },
  ];

  const benefits = [
    {
      img: feature1,
      num: "01",
      title: "Improved Health",
      desc: "Transform your lifestyle and enhance overall well-being with science-backed programming.",
    },
    {
      img: feature2,
      num: "02",
      title: "Increased Motivation",
      desc: "Streak tracking, milestone badges, and daily achievable goals to sustain momentum.",
    },
    {
      img: feature3,
      num: "03",
      title: "Personalized Guidance",
      desc: "AI-tailored workout and nutrition plans that evolve as you do.",
    },
  ];

  const testis = [
    {
      img: testi1,
      name: "Emily R.",
      role: "Marathon Runner",
      q: "This app completely transformed my training. I shaved 8 minutes off my marathon PR using the heart rate zones.",
    },
    {
      img: testi2,
      name: "Mark T.",
      role: "CrossFit Athlete",
      q: "The analytics are insane. Clean design, zero friction — I actually look forward to logging every session.",
    },
    {
      img: testi3,
      name: "Sarah P.",
      role: "Yoga Instructor",
      q: "Even as a trainer, the data taught me things about my own body I never knew. Absolute must-have.",
    },
  ];

  return (
    <div className="fl-page">
      <GlobalStyles />
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          minHeight: 660,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* BG image */}
        <img
          src={img}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 25%",
            filter: "brightness(0.28) saturate(0.7)",
          }}
        />

        {/* Mouse-reactive gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(0,255,87,0.07) 0%, transparent 55%), linear-gradient(105deg, rgba(3,8,4,0.97) 35%, rgba(3,8,4,0.45) 100%)`,
            transition: "background 0.4s ease",
          }}
        />

        {/* Ambient glow */}
        <div
          className="gorb"
          style={{
            position: "absolute",
            top: "15%",
            right: "20%",
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,255,87,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Vertical rail */}
        <div
          style={{
            position: "absolute",
            left: "7%",
            top: 0,
            bottom: 0,
            width: 1,
            background:
              "linear-gradient(to bottom, transparent, rgba(0,255,87,0.25) 30%, rgba(0,255,87,0.25) 70%, transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "calc(7% + 12px)",
            top: "30%",
            width: 1,
            height: "40%",
            background: "rgba(0,255,87,0.08)",
          }}
        />

        {/* Hero content */}
        <div
          className={loaded ? "loaded" : ""}
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 clamp(24px,6vw,80px)",
            width: "100%",
          }}
        >
          {/* Badge */}
          <div
            className="h-badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(0,255,87,0.07)",
              border: "1px solid rgba(0,255,87,0.18)",
              borderRadius: 999,
              padding: "6px 16px",
              marginBottom: 28,
            }}
          >
            <div style={{ position: "relative", width: 8, height: 8 }}>
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "#00ff57",
                }}
              />
              <span
                className="pring"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "#00ff57",
                }}
              />
            </div>
            <span style={{ fontSize: 12, letterSpacing: "0.1em" }}>
              AI FITNESS TRACKING
            </span>
          </div>

          {/* Hero Heading */}
          <h1
            className="h-line1"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(64px,10vw,140px)",
              lineHeight: 0.9,
              textTransform: "uppercase",
            }}
          >
            Train
          </h1>

          <h1
            className="h-line2"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(64px,10vw,140px)",
              lineHeight: 0.9,
              textTransform: "uppercase",
            }}
          >
            Smarter
          </h1>

          <p
            className="h-sub"
            style={{
              maxWidth: 520,
              color: "#9ca3af",
              fontSize: 16,
              lineHeight: 1.7,
              marginTop: 20,
            }}
          >
            Next-generation performance tracking platform designed to optimize
            your workouts with AI analytics, biometric monitoring, and
            community-driven motivation.
          </p>

          {/* CTA Buttons */}
          <div
            className="h-cta"
            style={{
              display: "flex",
              gap: 16,
              marginTop: 40,
              flexWrap: "wrap",
            }}
          >
            <Link to="/register" className="btn-g">
              <span>Start Training</span>
            </Link>

            <Link to="/features" className="btn-o">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────── */}
      <section style={{ padding: "100px 6vw", background: "#020603" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 40,
            textAlign: "center",
          }}
        >
          {stats.map((s, i) => (
            <Reveal key={i} cls="rv-s">
              <div>
                <div
                  className="stat-n"
                  style={{
                    fontSize: 60,
                    color: "#00ff57",
                    marginBottom: 10,
                  }}
                >
                  <Counter end={s.val} suffix={s.suf} />
                </div>
                <div style={{ color: "#9ca3af", fontSize: 14 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────── */}
      <section style={{ padding: "120px 6vw" }}>
        <SectionHead
          eyebrow="Core Features"
          title="Smart Fitness"
          accent="Technology"
          sub="Everything you need to monitor, analyze, and elevate your fitness journey."
        />

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 30,
          }}
        >
          {features.map((f, i) => (
            <Reveal key={i}>
              <div className="fc">
                <div
                  className="fc-icon"
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    background: "rgba(0,255,87,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    color: "#00ff57",
                  }}
                >
                  {f.icon}
                </div>

                <h3 style={{ fontSize: 20, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── BENEFITS ───────────────────────────────────── */}
      <section style={{ padding: "120px 6vw", background: "#020603" }}>
        <SectionHead eyebrow="Benefits" title="Why Choose" accent="Us" center />

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 30,
          }}
        >
          {benefits.map((b, i) => (
            <Reveal key={i}>
              <div className="bc">
                <img
                  src={b.img}
                  className="bc-img"
                  style={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",
                  }}
                />

                <div style={{ padding: 24 }}>
                  <div
                    className="num-accent"
                    style={{ fontSize: 36, color: "#00ff57" }}
                  >
                    {b.num}
                  </div>
                  <h3 style={{ marginTop: 6 }}>{b.title}</h3>
                  <p style={{ color: "#9ca3af", fontSize: 14 }}>{b.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────── */}
      <section style={{ padding: "120px 6vw" }}>
        <SectionHead
          eyebrow="Testimonials"
          title="Athlete"
          accent="Stories"
          center
        />

        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 30,
          }}
        >
          {testis.map((t, i) => (
            <Reveal key={i}>
              <div className="tc">
                <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 20 }}>
                  "{t.q}"
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img
                    src={t.img}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      {/* <footer
        style={{
          padding: "60px 6vw",
          borderTop: "1px solid #182219",
          textAlign: "center",
          color: "#6b7280",
          fontSize: 13,
        }}
      >
        © {new Date().getFullYear()} FitLogic. All rights reserved.
      </footer> */}
    </div>
  );
};

export default HomePage;
