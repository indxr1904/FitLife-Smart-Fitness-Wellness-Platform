import React, { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Dumbbell,
  Salad,
  ClipboardList,
  Users,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      to: "/admin/exercisemanagement",
      label: "Exercise Management",
      icon: Dumbbell,
    },
    { to: "/admin/dietmanagement", label: "Diet Management", icon: Salad },
    {
      to: "/admin/planmanagement",
      label: "Plans & Progress",
      icon: ClipboardList,
    },
    { to: "/admin/usermanagement", label: "User Management", icon: Users },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0b0f0c",
        color: "white",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        /* OVERLAY */
        .sidebar-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(2px);
          z-index: 40;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .sidebar-overlay.open { opacity: 1; pointer-events: all; }

        /* SIDEBAR */
        .admin-sidebar {
          position: fixed;
          top: 0; left: 0;
          height: 100%;
          width: 280px;
          background: #0e150e;
          border-right: 1px solid #1e2d22;
          display: flex;
          flex-direction: column;
          z-index: 50;
          transform: translateX(-100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease;
        }
        .admin-sidebar.open {
          transform: translateX(0);
          box-shadow: 8px 0 40px rgba(0,0,0,0.5);
        }
        @media (min-width: 768px) {
          .admin-sidebar {
            position: static;
            transform: translateX(0) !important;
            box-shadow: none !important;
            border-right: 1px solid #1e2d22;
          }
          .sidebar-overlay { display: none; }
          .mobile-header { display: none !important; }
        }

        /* NAV ITEMS */
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          border-radius: 10px;
          margin-bottom: 4px;
          cursor: pointer;
          text-decoration: none;
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease;
          position: relative;
          overflow: hidden;
        }
        .nav-item:hover {
          background: #1e2d22;
          color: white;
          transform: translateX(2px);
        }
        .nav-item.active {
          background: #1e2d22;
          color: #00ff57;
          font-weight: 600;
        }
        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0; top: 20%; bottom: 20%;
          width: 3px;
          background: #00ff57;
          border-radius: 0 3px 3px 0;
        }
        .nav-item .nav-arrow {
          margin-left: auto;
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.2s, transform 0.2s;
        }
        .nav-item:hover .nav-arrow,
        .nav-item.active .nav-arrow {
          opacity: 1;
          transform: translateX(0);
        }
        .nav-icon-wrap {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: #1a231a;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s ease;
        }
        .nav-item:hover .nav-icon-wrap,
        .nav-item.active .nav-icon-wrap {
          background: #243628;
        }

        /* LOGOUT BTN */
        .logout-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%;
          padding: 11px;
          border-radius: 10px;
          background: #00ff57;
          border: none;
          color: black;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .logout-btn:hover { background: #00e14f; transform: translateY(-1px); }

        /* HAMBURGER LINES */
        .ham-line {
          display: block; width: 22px; height: 2px;
          background: #9ca3af;
          border-radius: 2px;
          transition: transform 0.3s ease, opacity 0.3s ease, background 0.2s ease;
        }

        /* PULSE DOT */
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }

        /* MAIN CONTENT */
        .admin-main {
          flex: 1;
          overflow-y: auto;
          background: #0d130d;
          padding: 32px 24px;
        }
        @media (max-width: 767px) {
          .admin-main { padding: 80px 16px 24px; }
        }
      `}</style>

      {/* OVERLAY */}
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        {/* LOGO / BRAND */}
        <div
          style={{
            padding: "24px 20px 20px",
            borderBottom: "1px solid #1e2d22",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                }}
              >
                <div
                  className="pulse-dot"
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#00ff57",
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    color: "#4b5563",
                    textTransform: "uppercase",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  System Online
                </span>
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                Admin <span style={{ color: "#00ff57" }}>Panel</span>
              </h2>
            </div>
            {/* Mobile close */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "#1e2d22",
                border: "none",
                borderRadius: "8px",
                padding: "7px",
                cursor: "pointer",
                color: "#9ca3af",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="md:hidden"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* NAV */}
        <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.15em",
              color: "#374151",
              textTransform: "uppercase",
              fontFamily: "'DM Mono', monospace",
              marginBottom: "10px",
              paddingLeft: "8px",
            }}
          >
            Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-item ${active ? "active" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                <div className="nav-icon-wrap">
                  <Icon
                    size={15}
                    color={active ? "#00ff57" : "#6b7280"}
                    strokeWidth={2}
                  />
                </div>
                {item.label}
                <ChevronRight size={14} className="nav-arrow" />
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div
          style={{ padding: "16px 12px 20px", borderTop: "1px solid #1e2d22" }}
        >
          <div
            style={{
              background: "#111811",
              borderRadius: "10px",
              padding: "12px",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "#1e2d22",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: 700,
                color: "#00ff57",
                flexShrink: 0,
              }}
            >
              A
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 600 }}>
                Administrator
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "11px",
                  color: "#4b5563",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                admin@fitlife.com
              </p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={15} strokeWidth={2.5} />
            Logout
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header
        className="mobile-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          background: "#0e150e",
          padding: "14px 16px",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 30,
          borderBottom: "1px solid #1e2d22",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            className="pulse-dot"
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#00ff57",
            }}
          />
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>
            Admin <span style={{ color: "#00ff57" }}>Panel</span>
          </h2>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: "#1e2d22",
            border: "none",
            borderRadius: "8px",
            padding: "8px 10px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            alignItems: "center",
          }}
        >
          <span
            className="ham-line"
            style={{
              transform: isOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
              background: isOpen ? "#00ff57" : "#9ca3af",
            }}
          />
          <span
            className="ham-line"
            style={{
              opacity: isOpen ? 0 : 1,
              transform: isOpen ? "translateX(-8px)" : "none",
            }}
          />
          <span
            className="ham-line"
            style={{
              transform: isOpen
                ? "rotate(-45deg) translate(5px, -5px)"
                : "none",
              background: isOpen ? "#00ff57" : "#9ca3af",
            }}
          />
        </button>
      </header>

      {/* MAIN */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
