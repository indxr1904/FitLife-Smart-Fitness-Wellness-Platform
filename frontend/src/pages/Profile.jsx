import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { updateProfile, updateEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../api/api";

const Profile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
  });
  const [loading, setLoading] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      const localUser = JSON.parse(localStorage.getItem("user"));
      setFormData({
        name: firebaseUser?.displayName || localUser?.name || "",
        email: firebaseUser?.email || localUser?.email || "",
        photoURL: firebaseUser?.photoURL || localUser?.photoURL || "",
      });
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      const token = localStorage.getItem("token");

      if (!user && !token) {
        toast.error("User not authenticated");
        return;
      }

      // Update Firebase
      if (user) {
        if (user.displayName !== formData.name) {
          await updateProfile(user, { displayName: formData.name });
        }

        if (user.email !== formData.email) {
          await updateEmail(user, formData.email);
        }
      }

      // 🔹 Call backend API

      const res = await fetch(`${API_BASE_URL}/api/users/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      // Update local storage
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: data.name,
          email: data.email,
          // photoURL: user.photoURL,
        }),
      );

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.clear();
      toast.success("Logged out successfully");
      setTimeout(() => navigate("/login", { replace: true }), 500);
    } catch (error) {
      console.error(error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const getInitial = () =>
    formData.name ? formData.name.charAt(0).toUpperCase() : "P";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes fadeUp  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pring   { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.2);opacity:0} }
        @keyframes scaleIn { from { transform:scale(0.93); opacity:0; } to { transform:scale(1); opacity:1; } }
        @keyframes spin    { to { transform: rotate(360deg); } }

        .pf-enter { opacity:0; animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) forwards; }

        /* Input */
        .pf-input {
          width: 100%; background: #0f1a10; border: 1px solid #1e2d1e;
          border-radius: 10px; padding: 13px 16px;
          color: white; font-size: 14px; font-family: 'Sora',sans-serif; outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .pf-input::placeholder { color: #4b5563; }
        .pf-input:focus { border-color: #00ff5760; box-shadow: 0 0 0 3px rgba(0,255,87,0.08); }

        /* Btn primary */
        .btn-primary {
          width: 100%; background: #00ff57; color: #000;
          padding: 13px 24px; border-radius: 10px; font-size: 14px; font-weight: 700;
          font-family: 'Sora',sans-serif; cursor: pointer; border: 1px solid #00ff57; outline: none;
          transition: all 0.25s ease; letter-spacing: 0.04em;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-primary:hover:not(:disabled) { box-shadow: 0 10px 30px rgba(0,255,87,0.35); transform: translateY(-2px); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        /* Btn danger */
        .btn-danger {
          width: 100%; background: rgba(239,68,68,0.1); color: #f87171;
          padding: 13px 24px; border-radius: 10px; font-size: 14px; font-weight: 700;
          font-family: 'Sora',sans-serif; cursor: pointer; border: 1px solid rgba(239,68,68,0.3); outline: none;
          transition: all 0.25s ease; letter-spacing: 0.04em;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-danger:hover { background: rgba(239,68,68,0.18); border-color: rgba(239,68,68,0.55); transform: translateY(-2px); }

        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.78);
          backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 50; }
        .modal-box { background: #111a12; border: 1px solid #1e2d1e; border-radius: 18px;
          padding: 32px; width: 90%; max-width: 420px; color: white;
          animation: scaleIn 0.3s cubic-bezier(0.16,1,0.3,1); }

        // /* Avatar ring */
        // .avatar-ring {
        //   position: absolute; inset: -4px; border-radius: 50%;
        //   border: 2px solid #00ff57; opacity: 0.5;
        //   animation: pring 2.5s ease-out infinite;
        // }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #0a0f0b; }
        ::-webkit-scrollbar-thumb { background: #00ff5740; border-radius: 2px; }

        @media (max-width: 640px) {
          .info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#0a0f0b",
          color: "white",
          fontFamily: "'Sora',sans-serif",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at 20% 10%, rgba(0,255,87,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 90%, rgba(0,207,255,0.03) 0%, transparent 50%)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 680,
            margin: "0 auto",
            padding: "clamp(80px,10vw,120px) clamp(16px,4vw,32px) 48px",
          }}
        >
          {/* ── PAGE HEADER ─────────────────────────────────────────── */}
          <div
            className="pf-enter"
            style={{ marginBottom: 36, animationDelay: "0s" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(0,255,87,0.07)",
                border: "1px solid rgba(0,255,87,0.18)",
                borderRadius: 999,
                padding: "6px 16px",
                marginBottom: 18,
              }}
            >
              <div style={{ position: "relative", width: 8, height: 8 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#00ff57",
                    position: "absolute",
                  }}
                />
                <div
                  style={{
                    width: 8,
                    height: 8,
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
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  color: "#00ff57",
                  textTransform: "uppercase",
                }}
              >
                Account
              </span>
            </div>
            <h1
              style={{
                fontFamily: "'Barlow Condensed',sans-serif",
                fontWeight: 900,
                fontSize: "clamp(34px,6vw,58px)",
                lineHeight: 0.92,
                letterSpacing: "0.01em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              YOUR
              <br />
              <span
                style={{
                  color: "#00ff57",
                  fontStyle: "italic",
                  textShadow: "0 0 50px rgba(0,255,87,0.25)",
                }}
              >
                PROFILE
              </span>
            </h1>
            <p
              style={{
                color: "#8a9e8a",
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.7,
              }}
            >
              Manage your personal information and account settings.
            </p>
          </div>

          {/* ── AVATAR CARD ─────────────────────────────────────────── */}
          <div
            className="pf-enter"
            style={{
              background: "#111a12",
              border: "1px solid #1e2d1e",
              borderRadius: 20,
              padding: "28px",
              marginBottom: 20,
              animationDelay: "0.1s",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              {/* Avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ position: "relative", width: 88, height: 88 }}>
                  {/* <div className="avatar-ring" /> */}
                  {formData.photoURL ? (
                    <img
                      src={formData.photoURL}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      style={{
                        width: 88,
                        height: 88,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #1e2d1e",
                        position: "relative",
                        zIndex: 1,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 88,
                        height: 88,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #0f2b12, #1a3d1e)",
                        border: "2px solid #1e2d1e",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Barlow Condensed',sans-serif",
                          fontWeight: 900,
                          fontSize: 36,
                          color: "#00ff57",
                          fontStyle: "italic",
                        }}
                      >
                        {getInitial()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Name + email preview */}
              <div style={{ flex: 1, minWidth: 180 }}>
                <h2
                  style={{
                    fontFamily: "'Barlow Condensed',sans-serif",
                    fontWeight: 800,
                    fontStyle: "italic",
                    fontSize: "clamp(22px,3vw,30px)",
                    textTransform: "uppercase",
                    color: "#f0f0f0",
                    marginBottom: 4,
                    lineHeight: 1.1,
                  }}
                >
                  {formData.name || "Your Name"}
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    fontFamily: "'JetBrains Mono',monospace",
                    marginBottom: 12,
                  }}
                >
                  {formData.email || "your@email.com"}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(0,255,87,0.07)",
                    border: "1px solid rgba(0,255,87,0.18)",
                    borderRadius: 999,
                    padding: "4px 12px",
                    width: "fit-content",
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
                      fontSize: 11,
                      color: "#00ff57",
                      fontFamily: "'JetBrains Mono',monospace",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Active Member
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── PROFILE FORM ────────────────────────────────────────── */}
          <div
            className="pf-enter"
            style={{
              background: "#111a12",
              border: "1px solid #1e2d1e",
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 20,
              animationDelay: "0.18s",
            }}
          >
            {/* Card header */}
            <div
              style={{
                padding: "20px 28px",
                borderBottom: "1px solid #1e2d1e",
                background: "#0f1710",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 20,
                    height: 2,
                    background: "#00ff57",
                    borderRadius: 1,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 11,
                    color: "#00ff57",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  Edit Details
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(18px,3vw,24px)",
                  textTransform: "uppercase",
                  margin: "6px 0 0",
                  color: "#f0f0f0",
                }}
              >
                Personal Information
              </h3>
            </div>

            <form onSubmit={handleUpdateProfile} style={{ padding: "28px" }}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {/* Full Name */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      color: "#6b7280",
                      marginBottom: 8,
                      fontFamily: "'JetBrains Mono',monospace",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Full Name
                  </label>
                  <div style={{ position: "relative" }}>
                    <svg
                      style={{
                        position: "absolute",
                        left: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                      }}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4b5563"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pf-input"
                      style={{ paddingLeft: 44 }}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      color: "#6b7280",
                      marginBottom: 8,
                      fontFamily: "'JetBrains Mono',monospace",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <svg
                      style={{
                        position: "absolute",
                        left: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                      }}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4b5563"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pf-input"
                      style={{ paddingLeft: 44 }}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ marginTop: 4 }}
                >
                  {loading ? (
                    <>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          border: "2px solid #00000040",
                          borderTopColor: "#000",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ── INFO GRID (read-only stats) ──────────────────────────── */}
          <div
            className="pf-enter info-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginBottom: 20,
              animationDelay: "0.24s",
            }}
          >
            {[
              {
                label: "Provider",
                value:
                  auth.currentUser?.providerData?.[0]?.providerId ===
                  "google.com"
                    ? "Google"
                    : "Email",
                icon: "🔐",
                color: "#00cfff",
              },
              {
                label: "Account",
                value: "Active",
                icon: "✅",
                color: "#00ff57",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#111a12",
                  border: "1px solid #1e2d1e",
                  borderRadius: 14,
                  padding: "18px 20px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: item.color,
                  }}
                />
                <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
                <div
                  style={{
                    fontFamily: "'Barlow Condensed',sans-serif",
                    fontWeight: 800,
                    fontStyle: "italic",
                    fontSize: 22,
                    color: item.color,
                    lineHeight: 1,
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    marginTop: 4,
                    fontFamily: "'JetBrains Mono',monospace",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── DANGER ZONE ─────────────────────────────────────────── */}
          <div
            className="pf-enter"
            style={{
              background: "#150f0f",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 20,
              overflow: "hidden",
              animationDelay: "0.3s",
            }}
          >
            <div
              style={{
                padding: "20px 28px",
                borderBottom: "1px solid rgba(239,68,68,0.15)",
                background: "#120c0c",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 20,
                    height: 2,
                    background: "#ef4444",
                    borderRadius: 1,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 11,
                    color: "#ef4444",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  Danger Zone
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(18px,3vw,24px)",
                  textTransform: "uppercase",
                  margin: "6px 0 0",
                  color: "#fca5a5",
                }}
              >
                Session & Logout
              </h3>
            </div>

            <div style={{ padding: "28px" }}>
              <p
                style={{
                  color: "#8a9e8a",
                  fontSize: 14,
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}
              >
                Signing out will end your current session. You'll need to log in
                again to access your dashboard and plans.
              </p>
              <button
                className="btn-danger"
                onClick={() => setLogoutModal(true)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>

          {/* ── FOOTER ──────────────────────────────────────────────── */}
          <div
            className="pf-enter"
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
              borderTop: "1px solid #1e2d1e",
              paddingTop: 18,
              animationDelay: "0.38s",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 12,
                color: "#374137",
              }}
            >
              SESSION <span style={{ color: "#00ff57" }}>● SECURE</span>
            </span>
            <span
              style={{
                fontSize: 12,
                color: "#374137",
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              FitLife Profile v2.0
            </span>
          </div>
        </div>
      </div>

      {/* ── LOGOUT CONFIRM MODAL ────────────────────────────────────── */}
      {logoutModal && (
        <div className="modal-overlay" onClick={() => setLogoutModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                🚪
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "'Barlow Condensed',sans-serif",
                    fontWeight: 800,
                    fontSize: 24,
                    textTransform: "uppercase",
                    margin: 0,
                    color: "#f0f0f0",
                  }}
                >
                  Sign Out?
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "#4b5563",
                    margin: 0,
                    fontFamily: "'JetBrains Mono',monospace",
                  }}
                >
                  This will end your session
                </p>
              </div>
            </div>

            <p
              style={{
                color: "#8a9e8a",
                fontSize: 14,
                lineHeight: 1.7,
                marginBottom: 28,
              }}
            >
              Are you sure you want to sign out? You'll be redirected to the
              login page.
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setLogoutModal(false)}
                style={{
                  flex: 1,
                  padding: "11px 20px",
                  borderRadius: 10,
                  background: "#1a241a",
                  border: "1px solid #1e2d1e",
                  color: "#8a9e8a",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'Sora',sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#2a3d2a";
                  e.currentTarget.style.color = "#e5e7eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#1e2d1e";
                  e.currentTarget.style.color = "#8a9e8a";
                }}
              >
                Stay
              </button>
              <button
                onClick={() => {
                  setLogoutModal(false);
                  handleLogout();
                }}
                style={{
                  flex: 1,
                  padding: "11px 20px",
                  borderRadius: 10,
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.35)",
                  color: "#f87171",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "'Sora',sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(239,68,68,0.22)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(239,68,68,0.12)")
                }
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
