import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api/api";

const purposeColor = (purpose) => {
  const p = purpose?.toLowerCase();
  if (p?.includes("weight loss") || p?.includes("loss"))
    return {
      color: "#ff6b9d",
      bg: "rgba(255,107,157,0.08)",
      border: "rgba(255,107,157,0.25)",
      icon: "🔥",
    };
  if (p?.includes("muscle") || p?.includes("gain"))
    return {
      color: "#00cfff",
      bg: "rgba(0,207,255,0.08)",
      border: "rgba(0,207,255,0.25)",
      icon: "💪",
    };
  if (p?.includes("maintain"))
    return {
      color: "#ff9f43",
      bg: "rgba(255,159,67,0.08)",
      border: "rgba(255,159,67,0.25)",
      icon: "⚖️",
    };
  return {
    color: "#00ff57",
    bg: "rgba(0,255,87,0.08)",
    border: "rgba(0,255,87,0.25)",
    icon: "🥗",
  };
};

const MacroBar = ({ label, value, max, color }) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ flex: 1, minWidth: 80 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "#6b7280",
            fontFamily: "'JetBrains Mono',monospace",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color,
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          {value}
        </span>
      </div>
      <div
        style={{
          height: 4,
          background: "#1e2d1e",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 999,
            transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </div>
    </div>
  );
};

const Nutrition = () => {
  const [meals, setMeals] = useState({});
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/diet`);
        const data = await res.json();
        const grouped = {};
        let totalCalories = 0,
          totalProtein = 0,
          totalCarbs = 0,
          totalFats = 0;

        data.data.forEach((diet) => {
          const key = diet.purpose?.toLowerCase() || "general";
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(diet);
          totalCalories += parseInt(diet.calories) || 0;
          totalProtein += parseInt(diet.protein) || 0;
          totalCarbs += parseInt(diet.carbs) || 0;
          totalFats += parseInt(diet.fats) || 0;
        });

        setMeals(grouped);
        setTotals({
          calories: totalCalories,
          protein: totalProtein,
          carbs: totalCarbs,
          fats: totalFats,
        });
        // open all sections by default
        const init = {};
        Object.keys(grouped).forEach((k) => {
          init[k] = true;
        });
        setOpenSections(init);
      } catch (err) {
        console.error("Failed to load diets", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDiets();
  }, []);

  const toggle = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
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
            Loading Nutrition
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

  if (!Object.keys(meals).length) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0f0b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🥗</div>
          <p style={{ color: "#8a9e8a", fontSize: 15 }}>No meals found.</p>
        </div>
      </div>
    );
  }

  const maxCal = Math.max(
    ...Object.values(meals)
      .flat()
      .map((d) => parseInt(d.calories) || 0),
    1,
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0f0b",
        color: "white",
        fontFamily: "'Sora',sans-serif",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes fadeUp  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pring   { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.2);opacity:0} }

        .nt-enter { opacity:0; animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }

        /* Meal item card */
        .meal-card {
          background: #111a12; border: 1px solid #1e2d1e; border-radius: 14px;
          padding: 20px 22px; position: relative; overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }
        .meal-card:hover { border-color: #2a3d2a; box-shadow: 0 8px 32px rgba(0,0,0,0.4); transform: translateY(-2px); }
        .meal-card::before { content:''; position:absolute; top:0; left:0; bottom:0; width:3px; border-radius:0 2px 2px 0; }

        /* Summary card */
        .sum-card {
          background: #111a12; border: 1px solid #1e2d1e; border-radius: 14px;
          padding: 22px; position: relative; overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .sum-card:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,0.4); }

        /* Section toggle btn */
        .sec-toggle { background: none; border: none; cursor: pointer; color: white;
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 0; font-family: 'Sora',sans-serif; }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #0a0f0b; }
        ::-webkit-scrollbar-thumb { background: #00ff5740; border-radius: 2px; }

        @media (max-width: 640px) {
          .totals-grid { grid-template-columns: 1fr 1fr !important; }
          .macro-row   { flex-direction: column !important; gap: 14px !important; }
        }
      `}</style>

      {/* Background glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 80% 10%, rgba(0,255,87,0.04) 0%, transparent 50%), radial-gradient(ellipse at 20% 90%, rgba(0,207,255,0.03) 0%, transparent 50%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1000,
          margin: "0 auto",
          padding: "clamp(28px,4vw,56px) clamp(16px,4vw,40px)",
        }}
      >
        {/* ── PAGE HEADER ───────────────────────────────────────────────── */}
        <div
          className="nt-enter"
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
              Nutrition Hub
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Barlow Condensed',sans-serif",
              fontWeight: 900,
              fontSize: "clamp(36px,6vw,64px)",
              lineHeight: 0.92,
              letterSpacing: "0.01em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            DAILY
            <br />
            <span
              style={{
                color: "#00ff57",
                fontStyle: "italic",
                textShadow: "0 0 50px rgba(0,255,87,0.25)",
              }}
            >
              MEAL PLAN
            </span>
          </h1>
          <p
            style={{
              color: "#8a9e8a",
              fontSize: 15,
              fontWeight: 400,
              maxWidth: 480,
              lineHeight: 1.7,
            }}
          >
            Your full nutrition breakdown organized by goal. Track macros,
            calories, and meal timing all in one place.
          </p>
        </div>

        {/* ── TOTALS SUMMARY CARDS ──────────────────────────────────────── */}
        <div
          className="nt-enter totals-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            marginBottom: 48,
            animationDelay: "0.1s",
          }}
        >
          {[
            {
              label: "Total Calories",
              value: totals.calories,
              unit: "kcal",
              color: "#00ff57",
              icon: "🔥",
            },
            {
              label: "Total Protein",
              value: totals.protein,
              unit: "g",
              color: "#00cfff",
              icon: "💪",
            },
            {
              label: "Total Carbs",
              value: totals.carbs,
              unit: "g",
              color: "#ff9f43",
              icon: "⚡",
            },
            {
              label: "Total Fats",
              value: totals.fats,
              unit: "g",
              color: "#ff6b9d",
              icon: "🥑",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="sum-card"
              style={{ animationDelay: `${0.1 + i * 0.06}s` }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: s.color,
                }}
              />
              <div style={{ fontSize: 20, marginBottom: 10 }}>{s.icon}</div>
              <div
                style={{
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontWeight: 800,
                  fontStyle: "italic",
                  fontSize: 30,
                  color: s.color,
                  lineHeight: 1,
                }}
              >
                {s.value}
                <span
                  style={{
                    fontSize: 14,
                    marginLeft: 4,
                    fontStyle: "normal",
                    opacity: 0.8,
                  }}
                >
                  {s.unit}
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  marginTop: 6,
                  fontFamily: "'JetBrains Mono',monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── MEAL SECTIONS ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {Object.entries(meals).map(([mealType, items], si) => {
            const pc = purposeColor(mealType);
            const isOpen = openSections[mealType];
            const sectionCals = items.reduce(
              (a, d) => a + (parseInt(d.calories) || 0),
              0,
            );
            const sectionProt = items.reduce(
              (a, d) => a + (parseInt(d.protein) || 0),
              0,
            );

            return (
              <div
                key={mealType}
                className="nt-enter"
                style={{ animationDelay: `${0.2 + si * 0.1}s` }}
              >
                {/* Section header */}
                <button
                  className="sec-toggle"
                  onClick={() => toggle(mealType)}
                  style={{ marginBottom: isOpen ? 16 : 0 }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 14 }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: pc.bg,
                        border: `1px solid ${pc.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      {pc.icon}
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        <h2
                          style={{
                            fontFamily: "'Barlow Condensed',sans-serif",
                            fontWeight: 800,
                            fontStyle: "italic",
                            fontSize: "clamp(20px,3vw,28px)",
                            textTransform: "uppercase",
                            letterSpacing: "0.02em",
                            margin: 0,
                            color: "#f0f0f0",
                          }}
                        >
                          {mealType}
                        </h2>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: pc.color,
                            background: pc.bg,
                            border: `1px solid ${pc.border}`,
                            borderRadius: 999,
                            padding: "3px 10px",
                            fontFamily: "'JetBrains Mono',monospace",
                          }}
                        >
                          {items.length} item{items.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          marginTop: 4,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            color: "#6b7280",
                            fontFamily: "'JetBrains Mono',monospace",
                          }}
                        >
                          <span style={{ color: "#00ff57" }}>
                            {sectionCals}
                          </span>{" "}
                          kcal
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "#6b7280",
                            fontFamily: "'JetBrains Mono',monospace",
                          }}
                        >
                          <span style={{ color: "#00cfff" }}>
                            {sectionProt}g
                          </span>{" "}
                          protein
                        </span>
                      </div>
                    </div>
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4b5563"
                    strokeWidth="2"
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                      flexShrink: 0,
                    }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {/* Meal items */}
                {isOpen && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="meal-card"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        {/* Left accent bar */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            width: 3,
                            background: pc.color,
                            borderRadius: "14px 0 0 14px",
                          }}
                        />

                        <div style={{ paddingLeft: 8 }}>
                          {/* Item name */}
                          <h3
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: "#f0f0f0",
                              marginBottom: 8,
                              lineHeight: 1.5,
                            }}
                          >
                            {item.items?.join(", ")}
                          </h3>

                          {/* Macro bars */}
                          <div
                            className="macro-row"
                            style={{
                              display: "flex",
                              gap: 16,
                              marginBottom: 12,
                            }}
                          >
                            <MacroBar
                              label="Calories"
                              value={parseInt(item.calories) || 0}
                              max={maxCal}
                              color="#00ff57"
                            />
                            <MacroBar
                              label="Protein"
                              value={parseInt(item.protein) || 0}
                              max={totals.protein || 1}
                              color="#00cfff"
                            />
                            <MacroBar
                              label="Carbs"
                              value={parseInt(item.carbs) || 0}
                              max={totals.carbs || 1}
                              color="#ff9f43"
                            />
                            <MacroBar
                              label="Fats"
                              value={parseInt(item.fats) || 0}
                              max={totals.fats || 1}
                              color="#ff6b9d"
                            />
                          </div>

                          {/* Quick macro badges */}
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 8,
                            }}
                          >
                            {[
                              { l: "kcal", v: item.calories, c: "#00ff57" },
                              { l: "protein", v: item.protein, c: "#00cfff" },
                              { l: "carbs", v: item.carbs, c: "#ff9f43" },
                              { l: "fats", v: item.fats, c: "#ff6b9d" },
                            ].map((m) => (
                              <div
                                key={m.l}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 5,
                                  background: "#0f1a10",
                                  border: `1px solid ${m.c}25`,
                                  borderRadius: 8,
                                  padding: "5px 12px",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: m.c,
                                    fontFamily: "'JetBrains Mono',monospace",
                                  }}
                                >
                                  {m.v}
                                </span>
                                <span
                                  style={{
                                    fontSize: 10,
                                    color: "#4b5563",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    fontFamily: "'JetBrains Mono',monospace",
                                  }}
                                >
                                  {m.l}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Section divider */}
                <div
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(to right, transparent, #1e2d1e 20%, #1e2d1e 80%, transparent)",
                    marginTop: 32,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* ── OVERALL MACRO BREAKDOWN ───────────────────────────────────── */}
        <div
          className="nt-enter"
          style={{
            marginTop: 48,
            background: "#111a12",
            border: "1px solid #1e2d1e",
            borderRadius: 18,
            padding: "28px",
            animationDelay: "0.5s",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
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
              Daily Summary
            </span>
          </div>
          <h3
            style={{
              fontFamily: "'Barlow Condensed',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(20px,3vw,28px)",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              marginBottom: 24,
              color: "#f0f0f0",
            }}
          >
            Macro Breakdown
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              {
                label: "Calories",
                value: totals.calories,
                max: totals.calories,
                unit: "kcal",
                color: "#00ff57",
              },
              {
                label: "Protein",
                value: totals.protein,
                max: totals.calories / 4,
                unit: "g",
                color: "#00cfff",
              },
              {
                label: "Carbs",
                value: totals.carbs,
                max: totals.calories / 4,
                unit: "g",
                color: "#ff9f43",
              },
              {
                label: "Fats",
                value: totals.fats,
                max: totals.calories / 9,
                unit: "g",
                color: "#ff6b9d",
              },
            ].map((m) => {
              const pct = Math.min((m.value / (m.max || 1)) * 100, 100);
              return (
                <div key={m.label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: m.color,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#d1d5db",
                        }}
                      >
                        {m.label}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: 14,
                        fontWeight: 700,
                        color: m.color,
                      }}
                    >
                      {m.value} {m.unit}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "#1e2d1e",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: m.color,
                        borderRadius: 999,
                        boxShadow: `0 0 8px ${m.color}60`,
                        transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── FOOTER ────────────────────────────────────────────────────── */}
        <div
          className="nt-enter"
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
            animationDelay: "0.6s",
            borderTop: "1px solid #1e2d1e",
            paddingTop: 18,
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 12,
              color: "#374137",
            }}
          >
            NUTRITION STATUS <span style={{ color: "#00ff57" }}>● TRACKED</span>
          </span>
          <span
            style={{
              fontSize: 12,
              color: "#374137",
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            FitLife Nutrition v2.0
          </span>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
