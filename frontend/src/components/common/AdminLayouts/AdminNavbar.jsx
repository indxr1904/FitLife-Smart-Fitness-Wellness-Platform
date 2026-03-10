import React, { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { HiOutlineMenu } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./../../../hooks/useAuth";

const navLinks = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: "Plans",
    to: "/plans",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: "Nutrition",
    to: "/nutrition",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    label: "Workouts",
    to: "/workouts",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 4v6a6 6 0 0 0 12 0V4" />
        <line x1="6" y1="20" x2="18" y2="20" />
      </svg>
    ),
  },
];

const Navbar = () => {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const name = user?.name || user?.displayName || "User";
  const email = user?.email || "No email";
  const photo = user?.photo || user?.photoURL || null;
  const initial =
    typeof name === "string" && name.length > 0
      ? name.charAt(0).toUpperCase()
      : "?";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes fadeDown  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideInR  { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes pring     { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2);opacity:0} }

        .nb-link {
          position: relative; font-family: 'Sora',sans-serif; font-size: 13px;
          font-weight: 600; letter-spacing: 0.04em; text-decoration: none;
          color: #8a9e8a; transition: color 0.25s ease; padding: 4px 0;
        }
        .nb-link::after {
          content:''; position:absolute; bottom:-2px; left:0; right:0;
          height:2px; background:#00ff57; border-radius:999px;
          transform:scaleX(0); transition:transform 0.25s ease;
        }
        .nb-link:hover { color: #e5e7eb; }
        .nb-link:hover::after { transform: scaleX(1); }
        .nb-link.active { color: #00ff57; }
        .nb-link.active::after { transform: scaleX(1); }

        .profile-btn {
          width: 38px; height: 38px; border-radius: 50%;
          border: 2px solid #1e2d1e; cursor: pointer; overflow: hidden;
          background: linear-gradient(135deg, #0f2b12, #1a3d1e);
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
          position: relative;
        }
        .profile-btn:hover { border-color: #00ff57; box-shadow: 0 0 0 3px rgba(0,255,87,0.15); }
        .profile-btn.open  { border-color: #00ff57; box-shadow: 0 0 0 3px rgba(0,255,87,0.15); }

        .profile-dropdown {
          position: absolute; top: calc(100% + 12px); right: 0;
          background: #111a12; border: 1px solid #1e2d1e; border-radius: 14px;
          min-width: 220px; z-index: 100; overflow: hidden;
          animation: fadeDown 0.25s cubic-bezier(0.16,1,0.3,1);
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        }

        .pd-item {
          display: flex; align-items: center; gap: 10; padding: 11px 16px;
          color: #8a9e8a; font-family:'Sora',sans-serif; font-size:13px;
          font-weight:600; text-decoration:none; transition: all 0.2s ease;
          border: none; background: none; cursor: pointer; width: 100%;
        }
        .pd-item:hover { background: rgba(0,255,87,0.05); color: #e5e7eb; }
        .pd-item.danger:hover { background: rgba(239,68,68,0.08); color: #f87171; }

        /* Drawer */
        .drawer {
          position: fixed; top: 0; right: 0; height: 100vh;
          width: min(340px, 85vw); background: #0d1510;
          border-left: 1px solid #1e2d1e; z-index: 60;
          display: flex; flex-direction: column;
          box-shadow: -20px 0 60px rgba(0,0,0,0.7);
        }
        .drawer-enter { animation: slideInR 0.35s cubic-bezier(0.16,1,0.3,1); }

        .drawer-link {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 24px; color: #8a9e8a; text-decoration: none;
          font-family: 'Sora',sans-serif; font-size: 14px; font-weight: 600;
          border-left: 3px solid transparent;
          transition: all 0.25s ease;
        }
        .drawer-link:hover { color: #e5e7eb; background: rgba(0,255,87,0.04); border-left-color: #2a3d2a; }
        .drawer-link.active { color: #00ff57; background: rgba(0,255,87,0.06); border-left-color: #00ff57; }

        .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:55; animation: fadeIn 0.25s ease; backdrop-filter: blur(4px); }

        .hamburger-btn {
          width: 38px; height: 38px; border-radius: 8px; border: 1px solid #1e2d1e;
          background: #111a12; cursor: pointer; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 4px;
          transition: border-color 0.25s ease;
        }
        .hamburger-btn:hover { border-color: #2a3d2a; }
        .hamburger-btn span {
          display: block; width: 16px; height: 1.5px; background: #8a9e8a;
          border-radius: 999px; transition: all 0.3s ease;
        }
        .hamburger-btn.open span:nth-child(1) { transform: translateY(5.5px) rotate(45deg); }
        .hamburger-btn.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger-btn.open span:nth-child(3) { transform: translateY(-5.5px) rotate(-45deg); }
      `}</style>

      {/* ── NAVBAR ────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 50,
          fontFamily: "'Sora',sans-serif",
          background:
            isHome && !scrolled ? "transparent" : "rgba(10,15,11,0.95)",
          borderBottom:
            isHome && !scrolled ? "1px solid transparent" : "1px solid #1a221a",
          backdropFilter: isHome && !scrolled ? "none" : "blur(16px)",
          transition: "all 0.35s ease",
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
          {/* Logo */}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* <div style={{ position: "relative" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "#00ff57",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
              </div>
            </div> */}
            <span
              style={{
                fontFamily: "'Barlow Condensed',sans-serif",
                fontWeight: 900,
                fontSize: 22,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "white",
                textDecoration: "none",
              }}
            >
              Fit<span style={{ color: "#00ff57" }}>Life</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 32 }}
            className="desktop-nav"
          >
            <style>{`.desktop-nav { display: flex; } @media(max-width:768px){.desktop-nav{display:none!important;}}`}</style>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`nb-link ${isActive(link.to) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Profile dropdown — desktop only */}
            <div
              ref={profileRef}
              style={{ position: "relative" }}
              className="desktop-profile"
            >
              <style>{`.desktop-profile{display:flex;} @media(max-width:768px){.desktop-profile{display:none!important;}}`}</style>

              <button
                className={`profile-btn ${profileOpen ? "open" : ""}`}
                onClick={() => setProfileOpen(!profileOpen)}
              >
                {photo ? (
                  <img
                    src={photo}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    alt="profile"
                  />
                ) : (
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed',sans-serif",
                      fontWeight: 900,
                      fontSize: 16,
                      color: "#00ff57",
                      fontStyle: "italic",
                    }}
                  >
                    {initial}
                  </span>
                )}
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  {/* User info */}
                  <div
                    style={{
                      padding: "16px",
                      borderBottom: "1px solid #1e2d1e",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #0f2b12, #1a3d1e)",
                        border: "1px solid #1e2d1e",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        overflow: "hidden",
                      }}
                    >
                      {photo ? (
                        <img
                          src={photo}
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          alt="p"
                        />
                      ) : (
                        <span
                          style={{
                            fontFamily: "'Barlow Condensed',sans-serif",
                            fontWeight: 900,
                            fontSize: 18,
                            color: "#00ff57",
                            fontStyle: "italic",
                          }}
                        >
                          {initial}
                        </span>
                      )}
                    </div>
                    <div style={{ overflow: "hidden" }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#f0f0f0",
                          margin: 0,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {name}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#6b7280",
                          margin: 0,
                          fontFamily: "'JetBrains Mono',monospace",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {email}
                      </p>
                    </div>
                  </div>

                  {/* Links */}
                  <div style={{ padding: "8px 0" }}>
                    {[
                      {
                        label: "Dashboard",
                        to: "/dashboard",
                        icon: (
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                          </svg>
                        ),
                      },
                      {
                        label: "Profile",
                        to: "/profile",
                        icon: (
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        ),
                      },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        className="pd-item"
                        onClick={() => setProfileOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "11px 16px",
                          color: "#8a9e8a",
                          fontFamily: "'Sora',sans-serif",
                          fontSize: 13,
                          fontWeight: 600,
                          textDecoration: "none",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(0,255,87,0.05)";
                          e.currentTarget.style.color = "#e5e7eb";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "none";
                          e.currentTarget.style.color = "#8a9e8a";
                        }}
                      >
                        <span style={{ color: "#4b5563" }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  {/* Active badge */}
                  <div
                    style={{
                      padding: "10px 16px",
                      borderTop: "1px solid #1e2d1e",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "rgba(0,255,87,0.06)",
                        border: "1px solid rgba(0,255,87,0.15)",
                        borderRadius: 8,
                        padding: "6px 10px",
                      }}
                    >
                      <div
                        style={{ position: "relative", width: 7, height: 7 }}
                      >
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "#00ff57",
                            position: "absolute",
                          }}
                        />
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            border: "1px solid #00ff57",
                            position: "absolute",
                            animation: "pring 2.2s ease-out infinite",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          color: "#00ff57",
                          fontFamily: "'JetBrains Mono',monospace",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                        }}
                      >
                        Session Active
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger — mobile only */}
            <button
              className={`hamburger-btn ${drawerOpen ? "open" : ""}`}
              onClick={() => setDrawerOpen(!drawerOpen)}
              style={{ display: "none" }}
              id="hamburger"
            >
              <span />
              <span />
              <span />
            </button>
            <style>{`#hamburger { display: none; } @media(max-width:768px){#hamburger{display:flex!important;}}`}</style>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ─────────────────────────────────────────── */}
      {drawerOpen && (
        <>
          <div className="overlay" onClick={() => setDrawerOpen(false)} />
          <div className="drawer drawer-enter">
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
              <span
                style={{
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontWeight: 900,
                  fontSize: 20,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "white",
                }}
              >
                FitLife
              </span>
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

            {/* User info */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #1e2d1e",
                display: "flex",
                alignItems: "center",
                gap: 14,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #0f2b12, #1a3d1e)",
                  border: "2px solid #1e2d1e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {photo ? (
                  <img
                    src={photo}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    alt="p"
                  />
                ) : (
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed',sans-serif",
                      fontWeight: 900,
                      fontSize: 20,
                      color: "#00ff57",
                      fontStyle: "italic",
                    }}
                  >
                    {initial}
                  </span>
                )}
              </div>
              <div style={{ overflow: "hidden", flex: 1 }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#f0f0f0",
                    margin: 0,
                  }}
                >
                  {name}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    margin: "2px 0 0",
                    fontFamily: "'JetBrains Mono',monospace",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {email}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(0,255,87,0.07)",
                  border: "1px solid rgba(0,255,87,0.18)",
                  borderRadius: 999,
                  padding: "4px 10px",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#00ff57",
                  }}
                />
                <span
                  style={{
                    fontSize: 9,
                    color: "#00ff57",
                    fontFamily: "'JetBrains Mono',monospace",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Live
                </span>
              </div>
            </div>

            {/* Nav links */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
              <p
                style={{
                  fontSize: 10,
                  color: "#374137",
                  fontFamily: "'JetBrains Mono',monospace",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "8px 24px 4px",
                }}
              >
                Navigation
              </p>
              {navLinks.map((link, i) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`drawer-link ${isActive(link.to) ? "active" : ""}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => setDrawerOpen(false)}
                >
                  <span style={{ opacity: isActive(link.to) ? 1 : 0.5 }}>
                    {link.icon}
                  </span>
                  {link.label}
                  {isActive(link.to) && (
                    <div
                      style={{
                        marginLeft: "auto",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#00ff57",
                      }}
                    />
                  )}
                </Link>
              ))}

              <div
                style={{
                  height: 1,
                  background:
                    "linear-gradient(to right, transparent, #1e2d1e 30%, #1e2d1e 70%, transparent)",
                  margin: "12px 0",
                }}
              />

              <p
                style={{
                  fontSize: 10,
                  color: "#374137",
                  fontFamily: "'JetBrains Mono',monospace",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "4px 24px",
                }}
              >
                Account
              </p>

              <Link
                to="/profile"
                className="drawer-link"
                onClick={() => setDrawerOpen(false)}
              >
                <span style={{ opacity: 0.5 }}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                Profile
              </Link>
            </div>

            {/* Drawer footer */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #1e2d1e",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 11,
                    color: "#374137",
                  }}
                >
                  SYSTEM <span style={{ color: "#00ff57" }}>● ONLINE</span>
                </span>
                <span
                  style={{
                    fontSize: 11,
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
