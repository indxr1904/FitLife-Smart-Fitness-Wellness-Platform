import React, { useEffect, useState } from "react";
import { GoArrowRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../api/api";

const ExercisePlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [activePlanId, setActivePlanId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingPlanId, setPendingPlanId] = useState(null);
  const [pendingUnenrollPlanId, setPendingUnenrollPlanId] = useState(null); // renamed
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/plan`);
        const data = await res.json();
        setPlans(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    const fetchActivePlan = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/my-plans`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.status === "success" && data.plans.length > 0)
          setActivePlanId(data.plans[0]._id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchActivePlan();
  }, []);

  const startPlan = (planId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login to start a plan");
      return;
    }
    if (activePlanId && activePlanId !== planId) {
      setPendingPlanId(planId);
      return;
    }
    submitPlan(planId);
  };

  const submitPlan = async (planId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/start-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setActivePlanId(planId);
        toast.success("Plan started successfully");
        navigate(`/weeklyPlans/${planId}`);
      } else if (data.status === "already_enrolled") {
        toast.info("Already enrolled in this plan");
        navigate(`/weeklyPlans/${planId}`);
      } else {
        toast.error(data.message || "Unable to start plan");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const unenrollPlan = async (planId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/unenroll-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setActivePlanId(null);
        toast.success("Plan unenrolled successfully");
      } else {
        toast.error(data.message || "Unable to unenroll from plan");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const levelColor = (level) => {
    const l = level?.toLowerCase();
    if (l === "beginner")
      return {
        color: "#00ff57",
        bg: "rgba(0,255,87,0.08)",
        border: "rgba(0,255,87,0.25)",
      };
    if (l === "intermediate")
      return {
        color: "#ff9f43",
        bg: "rgba(255,159,67,0.08)",
        border: "rgba(255,159,67,0.25)",
      };
    if (l === "advanced")
      return {
        color: "#ff6b9d",
        bg: "rgba(255,107,157,0.08)",
        border: "rgba(255,107,157,0.25)",
      };
    return {
      color: "#00cfff",
      bg: "rgba(0,207,255,0.08)",
      border: "rgba(0,207,255,0.25)",
    };
  };

  const filters = ["All", "Beginner", "Intermediate", "Advanced"];
  const filtered =
    activeFilter === "All"
      ? plans
      : plans.filter(
          (p) => p.level?.toLowerCase() === activeFilter.toLowerCase(),
        );

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
            Loading Plans
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pring   { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.2);opacity:0} }
        @keyframes scaleIn { from { transform:scale(0.92); opacity:0; } to { transform:scale(1); opacity:1; } }
        .ep-enter { opacity:0; animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
        .fp { padding:9px 22px; border-radius:999px; font-size:13px; font-weight:600; font-family:'Sora',sans-serif; cursor:pointer; outline:none; transition:all 0.25s ease; letter-spacing:0.04em; }
        .fp-active   { background:#00ff57; color:#000; border:1px solid #00ff57; box-shadow:0 4px 16px rgba(0,255,87,0.3); }
        .fp-inactive { background:#111a12; color:#8a9e8a; border:1px solid #1e2d1e; }
        .fp-inactive:hover { background:#182118; border-color:#2a3d2a; color:#e5e7eb; }
        .plan-row { transition: opacity 0.3s ease; }
        .plan-img-wrap { overflow:hidden; border-radius:14px; border:1px solid #1e2d1e; transition:border-color 0.4s ease,box-shadow 0.4s ease; }
        .plan-img-wrap:hover { border-color:#00ff5760; box-shadow:0 12px 40px rgba(0,255,87,0.12); }
        .plan-img-wrap img { transition:transform 0.7s cubic-bezier(0.16,1,0.3,1); width:100%; height:100%; object-fit:cover; display:block; }
        .plan-img-wrap:hover img { transform:scale(1.07); }
        .btn-view { display:inline-flex; align-items:center; gap:8px; background:#111a12; border:1px solid #1e2d1e; color:#e5e7eb; padding:11px 22px; border-radius:8px; font-size:14px; font-weight:600; font-family:'Sora',sans-serif; cursor:pointer; outline:none; transition:all 0.25s ease; }
        .btn-view:hover { border-color:#00ff57; background:#141f14; transform:translateY(-2px); }
        .btn-start { display:inline-flex; align-items:center; gap:8px; background:#00ff57; color:#000; padding:11px 24px; border-radius:8px; font-size:14px; font-weight:700; font-family:'Sora',sans-serif; cursor:pointer; border:1px solid #00ff57; outline:none; transition:all 0.25s ease; letter-spacing:0.04em; }
        .btn-start:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(0,255,87,0.35); }
        .btn-start:disabled { background:#1e2d1e; color:#4b5563; border-color:#1e2d1e; cursor:not-allowed; transform:none; box-shadow:none; }
        .btn-unenroll { display:inline-flex; align-items:center; gap:8px; background:rgba(255,159,67,0.08); color:#ff9f43; padding:11px 22px; border-radius:8px; font-size:14px; font-weight:600; font-family:'Sora',sans-serif; cursor:pointer; border:1px solid rgba(255,159,67,0.25); outline:none; transition:all 0.25s ease; letter-spacing:0.04em; }
        .btn-unenroll:hover { background:rgba(255,159,67,0.15); border-color:rgba(255,159,67,0.5); transform:translateY(-2px); box-shadow:0 8px 24px rgba(255,159,67,0.2); }
        .plan-divider { height:1px; background:linear-gradient(to right,transparent,#1e2d1e 20%,#1e2d1e 80%,transparent); margin:56px 0; }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.75); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; z-index:50; }
        .modal-box { background:#111a12; border:1px solid #1e2d1e; border-radius:16px; padding:32px; width:90%; max-width:400px; color:white; animation:scaleIn 0.3s cubic-bezier(0.16,1,0.3,1); }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-track { background:#0a0f0b; }
        ::-webkit-scrollbar-thumb { background:#00ff5740; border-radius:2px; }
        @media (max-width:768px) {
          .plan-layout  { flex-direction:column !important; }
          .plan-img-col { width:100% !important; }
          .plan-txt-col { width:100% !important; }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#0a0f0b",
          color: "white",
          fontFamily: "'Sora',sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at 15% 10%, rgba(0,255,87,0.05) 0%, transparent 50%), radial-gradient(ellipse at 85% 85%, rgba(0,207,255,0.03) 0%, transparent 50%)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1100,
            margin: "0 auto",
            padding: "clamp(28px,4vw,56px) clamp(16px,4vw,40px)",
          }}
        >
          {/* PAGE HEADER */}
          <div
            className="ep-enter"
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
                Fitness Programs
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
              CHOOSE YOUR <br />
              <span
                style={{
                  color: "#00ff57",
                  fontStyle: "italic",
                  textShadow: "0 0 50px rgba(0,255,87,0.25)",
                }}
              >
                WORKOUT PLAN
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
              Select a plan that matches your fitness level and goals. Each
              program is structured week-by-week for maximum results.
            </p>
          </div>

          {/* FILTER PILLS */}
          <div
            className="ep-enter"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 48,
              animationDelay: "0.1s",
            }}
          >
            {filters.map((f) => (
              <button
                key={f}
                className={`fp ${activeFilter === f ? "fp-active" : "fp-inactive"}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
                {f !== "All" && (
                  <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.7 }}>
                    (
                    {
                      plans.filter(
                        (p) => p.level?.toLowerCase() === f.toLowerCase(),
                      ).length
                    }
                    )
                  </span>
                )}
              </button>
            ))}
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 11,
                  color: "#4b5563",
                }}
              >
                {filtered.length} plan{filtered.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </div>

          {/* EMPTY STATE */}
          {!filtered.length && (
            <div style={{ textAlign: "center", padding: "80px 24px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏋️</div>
              <h3
                style={{
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontWeight: 800,
                  fontSize: 28,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                No {activeFilter} Plans Found
              </h3>
              <p style={{ color: "#8a9e8a", fontSize: 15 }}>
                Try selecting a different level filter.
              </p>
            </div>
          )}

          {/* PLAN LIST */}
          {filtered.map((plan, index) => {
            const lc = levelColor(plan.level);
            const isActive = activePlanId === plan._id;
            return (
              <div key={plan._id}>
                <div
                  className="ep-enter plan-row"
                  style={{ animationDelay: `${0.15 + index * 0.1}s` }}
                >
                  <div
                    className="plan-layout"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "clamp(24px,4vw,64px)",
                    }}
                  >
                    {/* TEXT SIDE */}
                    <div className="plan-txt-col" style={{ flex: 1 }}>
                      {/* Meta row */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 14,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: 11,
                            color: "#4b5563",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                          }}
                        >
                          #{String(index + 1).padStart(2, "0")} · Weekly Plan
                        </span>
                        {plan.level && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: lc.color,
                              background: lc.bg,
                              border: `1px solid ${lc.border}`,
                              borderRadius: 999,
                              padding: "3px 12px",
                              fontFamily: "'JetBrains Mono',monospace",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                            }}
                          >
                            {plan.level}
                          </span>
                        )}
                        {isActive && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: "#00ff57",
                              background: "rgba(0,255,87,0.08)",
                              border: "1px solid rgba(0,255,87,0.25)",
                              borderRadius: 999,
                              padding: "3px 12px",
                              fontFamily: "'JetBrains Mono',monospace",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "#00ff57",
                                display: "inline-block",
                              }}
                            />
                            Active
                          </span>
                        )}
                      </div>

                      {/* Plan name */}
                      <h3
                        style={{
                          fontFamily: "'Barlow Condensed',sans-serif",
                          fontWeight: 800,
                          fontStyle: "italic",
                          fontSize: "clamp(26px,3.5vw,40px)",
                          lineHeight: 0.95,
                          textTransform: "uppercase",
                          letterSpacing: "0.01em",
                          marginBottom: 14,
                          color: "#f0f0f0",
                        }}
                      >
                        {plan.name}
                      </h3>

                      {/* Description */}
                      <p
                        style={{
                          color: "#8a9e8a",
                          fontSize: 15,
                          lineHeight: 1.75,
                          marginBottom: 20,
                          fontWeight: 400,
                          maxWidth: 480,
                        }}
                      >
                        {plan.description}
                      </p>

                      {/* Days pills */}
                      {plan.days?.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 6,
                            marginBottom: 24,
                          }}
                        >
                          {plan.days.slice(0, 7).map((day, di) => (
                            <span
                              key={di}
                              style={{
                                fontSize: 11,
                                color: "#6b7280",
                                background: "#111a12",
                                border: "1px solid #1e2d1e",
                                borderRadius: 6,
                                padding: "4px 10px",
                                fontFamily: "'JetBrains Mono',monospace",
                              }}
                            >
                              {typeof day === "string" ? day : `Day ${di + 1}`}
                            </span>
                          ))}
                          {plan.days.length > 7 && (
                            <span
                              style={{
                                fontSize: 11,
                                color: "#4b5563",
                                background: "#111a12",
                                border: "1px solid #1e2d1e",
                                borderRadius: 6,
                                padding: "4px 10px",
                                fontFamily: "'JetBrains Mono',monospace",
                              }}
                            >
                              +{plan.days.length - 7} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
                      >
                        <button
                          className="btn-view"
                          onClick={() => navigate(`/weeklyPlans/${plan._id}`)}
                        >
                          View Details <GoArrowRight size={16} />
                        </button>
                        <button
                          className="btn-start"
                          onClick={() => startPlan(plan._id)}
                          disabled={isActive}
                        >
                          {isActive ? "✓ Enrolled" : "Start Plan"}
                        </button>
                        {/* UNENROLL — only visible on the enrolled plan */}
                        {isActive && (
                          <button
                            className="btn-unenroll"
                            onClick={() => setPendingUnenrollPlanId(plan._id)}
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                            Deselect Plan
                          </button>
                        )}
                      </div>
                    </div>

                    {/* IMAGE SIDE */}
                    <div
                      className="plan-img-col"
                      style={{ width: "38%", flexShrink: 0 }}
                    >
                      <div
                        className="plan-img-wrap"
                        style={{ aspectRatio: "16/10", position: "relative" }}
                      >
                        <img
                          src={plan.image}
                          alt={plan.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/default-plan.jpg";
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to top, rgba(10,15,11,0.5) 0%, transparent 50%)",
                            pointerEvents: "none",
                          }}
                        />
                        {plan.level && (
                          <div
                            style={{
                              position: "absolute",
                              top: 14,
                              left: 14,
                              fontSize: 11,
                              fontWeight: 700,
                              color: lc.color,
                              background: "rgba(10,15,11,0.85)",
                              border: `1px solid ${lc.border}`,
                              borderRadius: 6,
                              padding: "4px 12px",
                              fontFamily: "'JetBrains Mono',monospace",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              backdropFilter: "blur(8px)",
                            }}
                          >
                            {plan.level}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {index < filtered.length - 1 && (
                  <div className="plan-divider" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SWITCH PLAN MODAL */}
      {pendingPlanId && (
        <div className="modal-overlay" onClick={() => setPendingPlanId(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(255,159,67,0.1)",
                  border: "1px solid rgba(255,159,67,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                ⚠️
              </div>
              <h3
                style={{
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontWeight: 800,
                  fontSize: 22,
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Switch Plan?
              </h3>
            </div>
            <p
              style={{
                color: "#8a9e8a",
                fontSize: 15,
                lineHeight: 1.7,
                marginBottom: 28,
              }}
            >
              Starting a new plan will replace your current active plan. Your
              previous progress will be saved.
            </p>
            <div
              style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
            >
              <button
                onClick={() => setPendingPlanId(null)}
                style={{
                  padding: "10px 22px",
                  borderRadius: 8,
                  background: "#1a241a",
                  border: "1px solid #1e2d1e",
                  color: "#8a9e8a",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'Sora',sans-serif",
                  cursor: "pointer",
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
                Cancel
              </button>
              <button
                onClick={() => {
                  submitPlan(pendingPlanId);
                  setPendingPlanId(null);
                }}
                style={{
                  padding: "10px 24px",
                  borderRadius: 8,
                  background: "#00ff57",
                  border: "1px solid #00ff57",
                  color: "#000",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "'Sora',sans-serif",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,255,87,0.35)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                Confirm Switch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNENROLL PLAN MODAL */}
      {pendingUnenrollPlanId && (
        <div
          className="modal-overlay"
          onClick={() => setPendingUnenrollPlanId(null)}
        >
          <div
            className="modal-box"
            style={{ border: "1px solid rgba(255,159,67,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(255,159,67,0.1)",
                  border: "1px solid rgba(255,159,67,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                📋
              </div>
              <h3
                style={{
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontWeight: 800,
                  fontSize: 22,
                  textTransform: "uppercase",
                  margin: 0,
                  color: "#ff9f43",
                }}
              >
                Deselect Plan?
              </h3>
            </div>
            <p
              style={{
                color: "#8a9e8a",
                fontSize: 15,
                lineHeight: 1.7,
                marginBottom: 28,
              }}
            >
              You will be unenrolled from this plan. Your progress will be saved
              and you can re-enroll anytime.
            </p>
            <div
              style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
            >
              <button
                onClick={() => setPendingUnenrollPlanId(null)}
                style={{
                  padding: "10px 22px",
                  borderRadius: 8,
                  background: "#1a241a",
                  border: "1px solid #1e2d1e",
                  color: "#8a9e8a",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'Sora',sans-serif",
                  cursor: "pointer",
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
                Cancel
              </button>
              <button
                onClick={() => {
                  unenrollPlan(pendingUnenrollPlanId);
                  setPendingUnenrollPlanId(null);
                }}
                style={{
                  padding: "10px 24px",
                  borderRadius: 8,
                  background: "#ff9f43",
                  border: "1px solid #ff9f43",
                  color: "#000",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "'Sora',sans-serif",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(255,159,67,0.35)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                Confirm Deselect
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExercisePlans;
