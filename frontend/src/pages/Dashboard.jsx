import { useEffect, useState } from "react";
import WorkoutDay from "./WorkoutDay";
import { API_BASE_URL } from "../../api/api";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};
const getDayName = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long" });
const getDateStr = () =>
  new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const MacroPill = ({ label, value, color }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: "#0f1a10",
      border: `1px solid ${color}35`,
      borderRadius: 10,
      padding: "12px 18px",
      minWidth: 76,
    }}
  >
    <span
      style={{
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: 16,
        fontWeight: 700,
        color,
      }}
    >
      {value}
    </span>
    <span
      style={{
        fontSize: 11,
        color: "#6b7280",
        marginTop: 4,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontFamily: "'JetBrains Mono',monospace",
      }}
    >
      {label}
    </span>
  </div>
);

const DietCard = ({ diet, index }) => {
  const [open, setOpen] = useState(true);
  const mealColors = {
    breakfast: "#00ff57",
    lunch: "#00cfff",
    dinner: "#ff9f43",
    snack: "#ff6b9d",
  };
  const color = mealColors[diet.mealType?.toLowerCase()] || "#00ff57";

  return (
    <div
      style={{
        background: "#0f1a10",
        border: "1px solid #1e2d1e",
        borderRadius: 14,
        overflow: "hidden",
        animation: `fadeUp 0.5s ease forwards ${index * 0.08}s`,
        opacity: 0,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 22px",
          color: "white",
          fontFamily: "'Sora',sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: color,
              flexShrink: 0,
            }}
          />
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                textTransform: "capitalize",
                color: "#f0f0f0",
              }}
            >
              {diet.mealType}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#6b7280",
                marginTop: 3,
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              {diet.mealTime}
            </div>
          </div>
        </div>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            flexShrink: 0,
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            padding: "0 22px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {diet.dietId?.map((d, i) => (
            <div
              key={d._id || i}
              style={{
                background: "#141f14",
                border: "1px solid #1e2d1e",
                borderRadius: 10,
                padding: "16px 18px",
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#e5e7eb",
                  marginBottom: 12,
                  lineHeight: 1.6,
                }}
              >
                {d.items?.join(", ")}
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <MacroPill label="kcal" value={d.calories} color="#00ff57" />
                <MacroPill label="protein" value={d.protein} color="#00cfff" />
                <MacroPill label="carbs" value={d.carbs} color="#ff9f43" />
                <MacroPill label="fats" value={d.fats} color="#ff6b9d" />
              </div>
              {d.purpose && (
                <p
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    fontStyle: "italic",
                    fontFamily: "'JetBrains Mono',monospace",
                  }}
                >
                  {d.purpose}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [todayPlan, setTodayPlan] = useState(null);
  const [isRestDay, setIsRestDay] = useState(false); // NEW
  const [hasPlan, setHasPlan] = useState(false); // NEW
  const [profile, setProfile] = useState({});
  const [activeTab, setActiveTab] = useState("exercises");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/users/today-plan`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // User has an enrolled plan
        if (data.planId) {
          setHasPlan(true);
          if (data.schedule) {
            setTodayPlan(data.schedule);
            setIsRestDay(false);
          } else {
            // Plan exists but no schedule for today = rest day
            setTodayPlan(null);
            setIsRestDay(true);
          }
        } else {
          // No plan enrolled at all
          setHasPlan(false);
          setIsRestDay(false);
          setTodayPlan(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, []);

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
            Loading dashboard
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

  const totalCalories =
    todayPlan?.diets?.reduce(
      (acc, meal) =>
        acc +
        (meal.dietId?.reduce((s, d) => s + (parseInt(d.calories) || 0), 0) ||
          0),
      0,
    ) || 0;
  const exerciseCount = todayPlan?.exercises?.length || 0;

  return (
    <div
      style={{
        background: "#0a0f0b",
        color: "white",
        fontFamily: "'Sora', sans-serif",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pring  { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.2);opacity:0} }
        @keyframes restFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .db-enter { opacity:0; animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
        .fl-tab { padding: 11px 28px; border-radius: 8px; font-weight: 700; font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; font-family: 'Sora', sans-serif; transition: all 0.25s ease; outline: none; }
        .fl-tab-active { background: #00ff57 !important; color: #000 !important; border: 1px solid #00ff57 !important; box-shadow: 0 6px 20px rgba(0,255,87,0.28); }
        .fl-tab-inactive { background: #131c14 !important; color: #8a9e8a !important; border: 1px solid #1e2d1e !important; }
        .fl-tab-inactive:hover { color: #e5e7eb !important; border-color: #2a3d2a !important; background: #182118 !important; }
        .qstat { background: #111a12; border: 1px solid #1e2d1e; border-radius: 16px; padding: 22px; position: relative; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
        .qstat:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.5); border-color: #2a3d2a; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #0a0f0b; }
        ::-webkit-scrollbar-thumb { background: #00ff5740; border-radius: 2px; }
        @media (max-width: 768px) {
          .stats-grid      { grid-template-columns: 1fr 1fr !important; }
          .card-header-row { flex-direction: column !important; align-items: flex-start !important; }
          .fl-tab          { padding: 10px 18px !important; font-size: 12px !important; }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 20% 10%, rgba(0,255,87,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(0,207,255,0.03) 0%, transparent 50%), #0a0f0b",
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
        {/* HEADER */}
        <div
          className="db-enter"
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
                letterSpacing: "0.16em",
                color: "#00ff57",
                textTransform: "uppercase",
              }}
            >
              {getDayName()} · {getDateStr()}
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Barlow Condensed',sans-serif",
              fontWeight: 900,
              fontSize: "clamp(34px,5vw,56px)",
              lineHeight: 0.95,
              letterSpacing: "0.01em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            {getGreeting()},&nbsp;
            <span
              style={{
                color: "#00ff57",
                fontStyle: "italic",
                textShadow: "0 0 40px rgba(0,255,87,0.25)",
              }}
            >
              {profile?.name || "Athlete"}
            </span>
          </h1>
          <p
            style={{
              color: "#8a9e8a",
              fontSize: 15,
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Here's your training &amp; nutrition plan for today.
          </p>
        </div>

        {/* QUICK STATS */}
        <div
          className="db-enter stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            marginBottom: 32,
            animationDelay: "0.1s",
          }}
        >
          {[
            {
              label: "Exercises Today",
              value: isRestDay ? "Rest" : exerciseCount,
              color: "#00ff57",
              icon: "🏋️",
            },
            {
              label: "Total Calories",
              value: isRestDay ? "—" : `${totalCalories}`,
              color: "#ff9f43",
              icon: "🔥",
              sub: isRestDay ? "" : "kcal",
            },
            {
              label: "Meals Planned",
              value: isRestDay ? "—" : todayPlan?.diets?.length || 0,
              color: "#00cfff",
              icon: "🥗",
            },
            {
              label: "Plan Active",
              value: hasPlan ? "Yes" : "None",
              color: "#ff6b9d",
              icon: "📋",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="qstat"
              style={{ animationDelay: `${0.08 + i * 0.06}s` }}
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
              <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
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
                {s.sub && (
                  <span
                    style={{
                      fontSize: 14,
                      marginLeft: 4,
                      fontStyle: "normal",
                      opacity: 0.8,
                    }}
                  >
                    {s.sub}
                  </span>
                )}
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

        {/* MAIN CARD */}
        <div
          style={{
            background: "#111a12",
            border: "1px solid #1e2d1e",
            borderRadius: 20,
          }}
        >
          {/* Card header */}
          <div
            style={{
              padding: "22px 28px",
              borderBottom: "1px solid #1e2d1e",
              background: "#0f1710",
              borderRadius: "20px 20px 0 0",
            }}
          >
            <div
              className="card-header-row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div>
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
                      width: 22,
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
                    Today's Plan
                  </span>
                </div>
                <h2
                  style={{
                    fontFamily: "'Barlow Condensed',sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(22px,3vw,30px)",
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                    margin: 0,
                    color: "#f0f0f0",
                  }}
                >
                  Training &amp; Nutrition
                </h2>
              </div>
              {/* Only show tabs when there's actual schedule data today */}
              {todayPlan && !isRestDay && (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexShrink: 0,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    className={`fl-tab ${activeTab === "exercises" ? "fl-tab-active" : "fl-tab-inactive"}`}
                    onClick={() => setActiveTab("exercises")}
                  >
                    Exercises
                  </button>
                  <button
                    className={`fl-tab ${activeTab === "diet" ? "fl-tab-active" : "fl-tab-inactive"}`}
                    onClick={() => setActiveTab("diet")}
                  >
                    Diet Plan
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Card body */}
          <div style={{ padding: "28px" }}>
            {/* Case 1: No plan enrolled */}
            {!hasPlan && (
              <div style={{ textAlign: "center", padding: "60px 24px" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🏃</div>
                <h3
                  style={{
                    fontFamily: "'Barlow Condensed',sans-serif",
                    fontWeight: 800,
                    fontSize: 28,
                    textTransform: "uppercase",
                    marginBottom: 12,
                    color: "#f0f0f0",
                  }}
                >
                  No Plan Selected
                </h3>
                <p
                  style={{
                    color: "#8a9e8a",
                    fontSize: 15,
                    fontWeight: 400,
                    maxWidth: 340,
                    margin: "0 auto 28px",
                    lineHeight: 1.7,
                  }}
                >
                  You haven't enrolled in a workout plan yet. Browse our plans
                  to get started.
                </p>

                <a
                  href="/plans"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#00ff57",
                    color: "black",
                    padding: "13px 32px",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 28px rgba(0,255,87,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Browse Plans →
                </a>
              </div>
            )}

            {/* Case 2: Plan enrolled but today is a rest day */}
            {hasPlan && isRestDay && (
              <div style={{ textAlign: "center", padding: "60px 24px" }}>
                <div
                  style={{
                    fontSize: 64,
                    marginBottom: 20,
                    animation: "restFloat 3s ease-in-out infinite",
                  }}
                >
                  😴
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(0,207,255,0.07)",
                    border: "1px solid rgba(0,207,255,0.2)",
                    borderRadius: 999,
                    padding: "6px 18px",
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 11,
                      color: "#00cfff",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                    }}
                  >
                    {getDayName()} · Rest Day
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Barlow Condensed',sans-serif",
                    fontWeight: 900,
                    fontStyle: "italic",
                    fontSize: "clamp(28px,4vw,42px)",
                    textTransform: "uppercase",
                    marginBottom: 14,
                    color: "#f0f0f0",
                    lineHeight: 1,
                  }}
                >
                  No Training Today
                </h3>
                <p
                  style={{
                    color: "#8a9e8a",
                    fontSize: 15,
                    fontWeight: 400,
                    maxWidth: 400,
                    margin: "0 auto 28px",
                    lineHeight: 1.8,
                  }}
                >
                  Today is a scheduled rest day in your plan. Recovery is just
                  as important as training — use this time to recharge, stretch,
                  or stay hydrated.
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  {[
                    "💧 Stay Hydrated",
                    "🧘 Light Stretching",
                    "😴 Prioritize Sleep",
                  ].map((tip) => (
                    <span
                      key={tip}
                      style={{
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: 12,
                        color: "#6b7280",
                        background: "#111a12",
                        border: "1px solid #1e2d1e",
                        borderRadius: 999,
                        padding: "8px 16px",
                      }}
                    >
                      {tip}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Case 3: Plan enrolled and has schedule today */}
            {hasPlan &&
              !isRestDay &&
              todayPlan &&
              (activeTab === "exercises" ? (
                <WorkoutDay dayData={todayPlan} />
              ) : (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 22,
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Barlow Condensed',sans-serif",
                        fontWeight: 800,
                        fontSize: "clamp(20px,3vw,26px)",
                        textTransform: "uppercase",
                        letterSpacing: "0.02em",
                        margin: 0,
                        color: "#f0f0f0",
                      }}
                    >
                      Today's Nutrition
                    </h3>
                    {totalCalories > 0 && (
                      <div
                        style={{
                          background: "rgba(255,159,67,0.08)",
                          border: "1px solid rgba(255,159,67,0.2)",
                          borderRadius: 999,
                          padding: "6px 16px",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span style={{ fontSize: 14 }}>🔥</span>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: 12,
                            color: "#ff9f43",
                            fontWeight: 500,
                          }}
                        >
                          {totalCalories} total kcal
                        </span>
                      </div>
                    )}
                  </div>
                  {todayPlan?.diets?.length ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      {todayPlan.diets.map((diet, i) => (
                        <DietCard key={i} diet={diet} index={i} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "48px 24px" }}>
                      <div style={{ fontSize: 40, marginBottom: 14 }}>🥗</div>
                      <p style={{ color: "#8a9e8a", fontSize: 15 }}>
                        No diet schedule for today
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
