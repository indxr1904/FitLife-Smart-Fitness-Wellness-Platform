// WeeklyWorkout.jsx
import React, { useEffect, useState } from "react";
import WorkoutDay from "./WorkoutDay";
import DietPlan from "./DietPlan";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../api/api";

const WeeklyWorkout = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDay, setOpenDay] = useState(0);
  const [activeTabs, setActiveTabs] = useState([]);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/plan/${id}`);
        const data = await res.json();
        setPlan(data.data);
        setActiveTabs(data.data.schedule.map(() => "exercises"));
        setOpenDay(0);
      } catch (err) {
        console.error("Error fetching plan:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  const toggleDay = (i) => setOpenDay(openDay === i ? null : i);
  const setTabForDay = (i, tab) =>
    setActiveTabs((prev) => {
      const u = [...prev];
      u[i] = tab;
      return u;
    });

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          background: "#0a0f0b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>{`
          @keyframes spin  { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%,100%{opacity:.4;transform:translate(-50%,-50%) scale(.8)} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.2)} }
          @keyframes slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(350%)} }
        `}</style>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div style={{ position: "relative", width: 64, height: 64 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2px solid #1e2d22",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2px solid transparent",
                borderTopColor: "#00ff57",
                animation: "spin 1s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 8,
                borderRadius: "50%",
                border: "2px solid transparent",
                borderTopColor: "#9ca3af",
                animation: "spin 1.5s linear infinite reverse",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#00ff57",
                animation: "pulse 1s ease-in-out infinite",
              }}
            />
          </div>
          <p
            style={{
              color: "#9ca3af",
              fontSize: 13,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            Loading Plan
          </p>
          <div
            style={{
              width: 120,
              height: 2,
              background: "#1e2d22",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "40%",
                background: "#00ff57",
                borderRadius: 999,
                animation: "slide 1.2s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div
        style={{
          minHeight: "60vh",
          background: "#0a0f0b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{ color: "#6b7280", fontFamily: "'JetBrains Mono',monospace" }}
        >
          Plan not found.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#0a0f0b",
        color: "white",
        fontFamily: "'Sora',sans-serif",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pring  { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.2);opacity:0} }
        @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }

        .ww-enter { opacity:0; animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) forwards; }

        .day-toggle {
          width: 100%; background: none; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 24px; color: white; font-family: 'Sora',sans-serif;
          transition: background 0.25s ease;
        }
        .day-toggle:hover { background: rgba(0,255,87,0.04); }

        .tab-btn {
          padding: 9px 24px; border-radius: 999px; font-size: 13px; font-weight: 700;
          font-family: 'Sora',sans-serif; cursor: pointer; outline: none;
          transition: all 0.22s ease; letter-spacing: 0.04em;
        }
        .tab-active   { background: #00ff57; color: #000; border: 1px solid #00ff57; box-shadow: 0 4px 14px rgba(0,255,87,0.28); }
        .tab-inactive { background: #111a12; color: #8a9e8a; border: 1px solid #1e2d1e; }
        .tab-inactive:hover { background: #182118; border-color: #2a3d2a; color: #e5e7eb; }

        .day-content { animation: slideDown 0.35s cubic-bezier(0.16,1,0.3,1); }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #0a0f0b; }
        ::-webkit-scrollbar-thumb { background: #00ff5740; border-radius: 2px; }
      `}</style>

      {/* Background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 15% 10%, rgba(0,255,87,0.04) 0%, transparent 50%), radial-gradient(ellipse at 85% 85%, rgba(0,207,255,0.03) 0%, transparent 50%), #0a0f0b",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1000,
          margin: "0 auto",
          padding: "clamp(80px,10vw,110px) clamp(16px,4vw,32px) 60px",
        }}
      >
        {/* ── PAGE HEADER ─────────────────────────────────────────── */}
        <div
          className="ww-enter"
          style={{ marginBottom: 40, animationDelay: "0s" }}
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
              Weekly Program · {plan.schedule?.length || 0} Days
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Barlow Condensed',sans-serif",
              fontWeight: 900,
              fontSize: "clamp(34px,6vw,60px)",
              lineHeight: 0.92,
              letterSpacing: "0.01em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            {plan.name?.split(" ").slice(0, -1).join(" ")}
            <br />
            <span
              style={{
                color: "#00ff57",
                fontStyle: "italic",
                textShadow: "0 0 50px rgba(0,255,87,0.25)",
              }}
            >
              {plan.name?.split(" ").slice(-1)}
            </span>
          </h1>
          <p
            style={{
              color: "#8a9e8a",
              fontSize: 15,
              fontWeight: 400,
              maxWidth: 560,
              lineHeight: 1.7,
            }}
          >
            {plan.description}
          </p>

          {/* Plan meta badges */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 20,
            }}
          >
            {plan.level && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#ff9f43",
                  background: "rgba(255,159,67,0.08)",
                  border: "1px solid rgba(255,159,67,0.25)",
                  borderRadius: 999,
                  padding: "4px 14px",
                  fontFamily: "'JetBrains Mono',monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {plan.level}
              </span>
            )}
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#00cfff",
                background: "rgba(0,207,255,0.08)",
                border: "1px solid rgba(0,207,255,0.25)",
                borderRadius: 999,
                padding: "4px 14px",
                fontFamily: "'JetBrains Mono',monospace",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {plan.schedule?.length} Days
            </span>
            {plan.duration && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#a78bfa",
                  background: "rgba(167,139,250,0.08)",
                  border: "1px solid rgba(167,139,250,0.25)",
                  borderRadius: 999,
                  padding: "4px 14px",
                  fontFamily: "'JetBrains Mono',monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {plan.duration}
              </span>
            )}
          </div>
        </div>

        {/* ── DAY ACCORDIONS ──────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {plan.schedule.map((day, index) => {
            const isOpen = openDay === index;
            const activeTab = activeTabs[index] || "exercises";

            return (
              <div
                key={index}
                className="ww-enter"
                style={{
                  background: "#111a12",
                  border: `1px solid ${isOpen ? "#2a3d2a" : "#1e2d1e"}`,
                  borderRadius: 16,
                  overflow: "hidden",
                  animationDelay: `${0.1 + index * 0.06}s`,
                  boxShadow: isOpen ? "0 8px 32px rgba(0,0,0,0.4)" : "none",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                {/* Day toggle header */}
                <button className="day-toggle" onClick={() => toggleDay(index)}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 16 }}
                  >
                    {/* Day number */}
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: isOpen ? "#00ff57" : "#0f1a10",
                        border: `1px solid ${isOpen ? "#00ff57" : "#1e2d1e"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.3s ease",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Barlow Condensed',sans-serif",
                          fontWeight: 900,
                          fontSize: 16,
                          color: isOpen ? "#000" : "#6b7280",
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div
                        style={{
                          fontFamily: "'Barlow Condensed',sans-serif",
                          fontWeight: 800,
                          fontStyle: "italic",
                          fontSize: "clamp(16px,2.5vw,22px)",
                          textTransform: "uppercase",
                          letterSpacing: "0.02em",
                          color: isOpen ? "#f0f0f0" : "#8a9e8a",
                          transition: "color 0.3s ease",
                        }}
                      >
                        {day.dayName}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          marginTop: 3,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: "#4b5563",
                            fontFamily: "'JetBrains Mono',monospace",
                          }}
                        >
                          {day.exercises?.length || 0} exercises
                        </span>
                        {day.diets?.length > 0 && (
                          <span
                            style={{
                              fontSize: 11,
                              color: "#4b5563",
                              fontFamily: "'JetBrains Mono',monospace",
                            }}
                          >
                            · {day.diets.length} meals
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Chevron */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isOpen ? "#00ff57" : "#4b5563"}
                    strokeWidth="2"
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease, stroke 0.3s ease",
                      flexShrink: 0,
                    }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {/* Day content */}
                {isOpen && (
                  <div
                    className="day-content"
                    style={{ borderTop: "1px solid #1e2d1e" }}
                  >
                    {/* Tab switcher */}
                    <div
                      style={{
                        padding: "16px 24px",
                        borderBottom: "1px solid #1e2d1e",
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        className={`tab-btn ${activeTab === "exercises" ? "tab-active" : "tab-inactive"}`}
                        onClick={() => setTabForDay(index, "exercises")}
                      >
                        🏋️ Exercises
                      </button>
                      <button
                        className={`tab-btn ${activeTab === "diet" ? "tab-active" : "tab-inactive"}`}
                        onClick={() => setTabForDay(index, "diet")}
                      >
                        🥗 Diet Plan
                      </button>
                    </div>

                    {/* Tab content */}
                    <div style={{ padding: "24px" }}>
                      {activeTab === "exercises" && (
                        <WorkoutDay dayData={day} />
                      )}
                      {activeTab === "diet" && <DietPlan dayData={day} />}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── FOOTER ──────────────────────────────────────────────── */}
        <div
          style={{
            marginTop: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
            borderTop: "1px solid #1e2d1e",
            paddingTop: 20,
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            PROGRAM <span style={{ color: "#00ff57" }}>● ACTIVE</span>
          </span>
          <span
            style={{
              fontSize: 12,
              color: "#6b7280",
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            FitLife Weekly v2.0
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyWorkout;
