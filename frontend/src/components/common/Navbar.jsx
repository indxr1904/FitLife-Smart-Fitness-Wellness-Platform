import { useAuth } from "../../hooks/useAuth";
import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    name: "Home",
    path: "/",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    name: "Features",
    path: "/features",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    name: "Contact",
    path: "/contact",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    name: "Support",
    path: "/support",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

const Navbar = () => {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes slideInR  { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes pring     { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.2);opacity:0} }
        @keyframes fadeDown  { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }

        /* Desktop nav links */
        .lp-link {
          position: relative; font-family: 'Sora',sans-serif; font-size: 13px;
          font-weight: 600; letter-spacing: 0.04em; text-decoration: none;
          color: #8a9e8a; transition: color 0.25s ease; padding: 6px 0;
          white-space: nowrap;
        }
        .lp-link::after {
          content:''; position:absolute; bottom: -1px; left:0; right:0;
          height: 2px; background: #00ff57; border-radius: 999px;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.28s cubic-bezier(0.16,1,0.3,1);
        }
        .lp-link:hover        { color: #e5e7eb; }
        .lp-link:hover::after { transform: scaleX(1); }
        .lp-link.active       { color: #00ff57; }
        .lp-link.active::after{ transform: scaleX(1); }

        /* Login btn */
        .lp-login-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 22px; border-radius: 8px; font-size: 13px; font-weight: 700;
          font-family: 'Sora',sans-serif; letter-spacing: 0.05em; cursor: pointer;
          background: #00ff57; color: #000; border: 1px solid #00ff57; outline: none;
          transition: all 0.25s ease; text-decoration: none; white-space: nowrap;
        }
        .lp-login-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,255,87,0.35); }

        /* Hamburger */
        .lp-ham {
          width: 38px; height: 38px; border-radius: 8px; border: 1px solid #1e2d1e;
          background: #111a12; cursor: pointer; display: none; flex-direction: column;
          align-items: center; justify-content: center; gap: 4px; outline: none;
          transition: border-color 0.25s ease;
        }
        .lp-ham:hover { border-color: #2a3d2a; }
        .lp-ham span {
          display: block; width: 16px; height: 1.5px; background: #8a9e8a;
          border-radius: 999px; transition: all 0.3s ease;
        }
        .lp-ham.open span:nth-child(1) { transform: translateY(5.5px) rotate(45deg); }
        .lp-ham.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .lp-ham.open span:nth-child(3) { transform: translateY(-5.5px) rotate(-45deg); }

        /* Drawer */
        .lp-drawer {
          position: fixed; top: 0; right: 0; height: 100vh;
          width: min(320px, 85vw); background: #0d1510;
          border-left: 1px solid #1e2d1e; z-index: 60;
          display: flex; flex-direction: column;
          box-shadow: -20px 0 60px rgba(0,0,0,0.7);
          animation: slideInR 0.35s cubic-bezier(0.16,1,0.3,1);
        }

        .lp-drawer-link {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 24px; color: #8a9e8a; text-decoration: none;
          font-family: 'Sora',sans-serif; font-size: 14px; font-weight: 600;
          border-left: 3px solid transparent;
          transition: all 0.25s ease;
        }
        .lp-drawer-link:hover { color: #e5e7eb; background: rgba(0,255,87,0.04); border-left-color: #2a3d2a; }
        .lp-drawer-link.active { color: #00ff57; background: rgba(0,255,87,0.06); border-left-color: #00ff57; }

        .lp-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.72); z-index: 55;
          animation: fadeIn 0.25s ease; backdrop-filter: blur(4px);
        }

        @media (max-width: 768px) {
          .lp-desktop-nav  { display: none !important; }
          .lp-desktop-btn  { display: none !important; }
          .lp-ham          { display: flex !important; }
        }
      `}</style>

      {/* ── NAVBAR ───────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 50,
          background: scrolled ? "rgba(10,15,11,0.96)" : "rgba(3,8,4,0.85)",
          borderBottom: scrolled
            ? "1px solid #1a221a"
            : "1px solid rgba(24,34,25,0.5)",
          backdropFilter: "blur(16px)",
          transition: "all 0.35s ease",
          animation: "fadeDown 0.5s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 clamp(16px,4vw,32px)",
            height: 64,
          }}
        >
          {/* ── LOGO ── */}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#00ff57",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000"
                strokeWidth="2.5"
              >
                <path d="M6 4v6a6 6 0 0 0 12 0V4" />
                <line x1="6" y1="20" x2="18" y2="20" />
              </svg>
            </div> */}
            <span
              style={{
                fontFamily: "'Barlow Condensed',sans-serif",
                fontWeight: 900,
                fontSize: 22,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "white",
              }}
            >
              Fit<span style={{ color: "#00ff57" }}>Life</span>
            </span>
          </Link>

          {/* ── DESKTOP LINKS ── */}
          <div
            className="lp-desktop-nav"
            style={{ display: "flex", alignItems: "center", gap: 36 }}
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`lp-link ${isActive(item.path) ? "active" : ""}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* ── DESKTOP LOGIN BTN ── */}
          <div
            className="lp-desktop-btn"
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            {/* Subtle live badge */}
            {/* <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(0,255,87,0.06)",
                border: "1px solid rgba(0,255,87,0.15)",
                borderRadius: 999,
                padding: "4px 12px",
              }}
            >
              <div style={{ position: "relative", width: 6, height: 6 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#00ff57",
                    position: "absolute",
                  }}
                />
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    border: "1px solid #00ff57",
                    position: "absolute",
                    animation: "pring 2.2s ease-out infinite",
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 10,
                  color: "#00ff57",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Live
              </span>
            </div> */}

            {user ? (
              <Link to="/dashboard" className="lp-login-btn">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="lp-login-btn">
                Login
              </Link>
            )}
          </div>

          {/* ── HAMBURGER ── */}
          <button
            className={`lp-ham ${drawerOpen ? "open" : ""}`}
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ─────────────────────────────────────────── */}
      {drawerOpen && (
        <>
          <div className="lp-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="lp-drawer">
            {/* Drawer header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                height: 64,
                borderBottom: "1px solid #1e2d1e",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 6,
                    background: "#00ff57",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2.5"
                  >
                    <path d="M6 4v6a6 6 0 0 0 12 0V4" />
                    <line x1="6" y1="20" x2="18" y2="20" />
                  </svg>
                </div>
                <span
                  style={{
                    fontFamily: "'Barlow Condensed',sans-serif",
                    fontWeight: 900,
                    fontSize: 18,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "white",
                  }}
                >
                  <span style={{ color: "#00ff57" }}>Fit</span>Life
                </span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid #1e2d1e",
                  background: "#111a12",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#8a9e8a",
                }}
              >
                <IoMdClose size={18} />
              </button>
            </div>

            {/* Nav links */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
              <p
                style={{
                  fontSize: 10,
                  color: "#374137",
                  fontFamily: "'JetBrains Mono',monospace",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "4px 24px 12px",
                }}
              >
                Navigation
              </p>
              {navItems.map((item, i) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`lp-drawer-link ${isActive(item.path) ? "active" : ""}`}
                  onClick={() => setDrawerOpen(false)}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <span
                    style={{
                      opacity: isActive(item.path) ? 1 : 0.45,
                      color: isActive(item.path) ? "#00ff57" : "currentColor",
                    }}
                  >
                    {item.icon}
                  </span>
                  {item.name}
                  {isActive(item.path) && (
                    <div
                      style={{
                        marginLeft: "auto",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#00ff57",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Drawer CTA */}
            <div
              style={{
                padding: "20px 24px",
                borderTop: "1px solid #1e2d1e",
                flexShrink: 0,
              }}
            >
              {user ? (
                <Link to="/dashboard" className="lp-login-btn">
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" className="lp-login-btn">
                  Login
                </Link>
              )}

              {/* Footer status */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 10,
                    color: "#374137",
                  }}
                >
                  SYSTEM <span style={{ color: "#00ff57" }}>● ONLINE</span>
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: "#374137",
                    fontFamily: "'JetBrains Mono',monospace",
                  }}
                >
                  v2.0
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
