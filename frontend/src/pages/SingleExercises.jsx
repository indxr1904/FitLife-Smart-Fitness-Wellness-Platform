import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api/api";

const muscleColor = (muscle) => {
  const m = muscle?.toLowerCase();
  if (m?.includes("chest"))
    return {
      color: "#ff6b9d",
      bg: "rgba(255,107,157,0.08)",
      border: "rgba(255,107,157,0.25)",
    };
  if (m?.includes("back"))
    return {
      color: "#00cfff",
      bg: "rgba(0,207,255,0.08)",
      border: "rgba(0,207,255,0.25)",
    };
  if (m?.includes("leg") || m?.includes("glute"))
    return {
      color: "#ff9f43",
      bg: "rgba(255,159,67,0.08)",
      border: "rgba(255,159,67,0.25)",
    };
  if (m?.includes("shoulder") || m?.includes("arm"))
    return {
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.08)",
      border: "rgba(167,139,250,0.25)",
    };
  if (m?.includes("core") || m?.includes("abs"))
    return {
      color: "#00ff57",
      bg: "rgba(0,255,87,0.08)",
      border: "rgba(0,255,87,0.25)",
    };
  return {
    color: "#00ff57",
    bg: "rgba(0,255,87,0.08)",
    border: "rgba(0,255,87,0.25)",
  };
};

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/exercise`);
        const data = await res.json();
        setExercises(data.data || []);
        setFiltered(data.data || []);
      } catch (err) {
        console.error("Failed to load exercises", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  // filter + search
  useEffect(() => {
    let list = exercises;
    if (activeFilter !== "All")
      list = list.filter(
        (e) =>
          e.category?.toLowerCase() === activeFilter.toLowerCase() ||
          e.muscleGroup?.toLowerCase().includes(activeFilter.toLowerCase()),
      );
    if (search.trim())
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(search.toLowerCase()) ||
          e.description?.toLowerCase().includes(search.toLowerCase()),
      );
    setFiltered(list);
  }, [search, activeFilter, exercises]);

  const categories = [
    "All",
    ...Array.from(new Set(exercises.map((e) => e.category).filter(Boolean))),
  ];

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
            Loading Exercises
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

        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pring  { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.2);opacity:0} }

        .ex-enter { opacity:0; animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) forwards; }

        /* Search input */
        .ex-search {
          width: 100%; background: #111a12; border: 1px solid #1e2d1e;
          border-radius: 10px; padding: 12px 18px 12px 44px;
          color: white; font-size: 14px; font-family: 'Sora',sans-serif; outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .ex-search::placeholder { color: #4b5563; }
        .ex-search:focus { border-color: #00ff5760; box-shadow: 0 0 0 3px rgba(0,255,87,0.08); }

        /* Filter pill */
        .fp { padding: 8px 20px; border-radius: 999px; font-size: 13px; font-weight: 600;
          font-family: 'Sora',sans-serif; cursor: pointer; outline: none;
          transition: all 0.22s ease; letter-spacing: 0.04em; white-space: nowrap; }
        .fp-active   { background: #00ff57; color: #000; border: 1px solid #00ff57; box-shadow: 0 4px 14px rgba(0,255,87,0.28); }
        .fp-inactive { background: #111a12; color: #8a9e8a; border: 1px solid #1e2d1e; }
        .fp-inactive:hover { background: #182118; border-color: #2a3d2a; color: #e5e7eb; }

        /* Exercise card */
        .ex-card {
          background: #111a12; border: 1px solid #1e2d1e; border-radius: 16px;
          overflow: hidden; display: flex; flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          cursor: pointer;
        }
        .ex-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.5); border-color: #2a3d2a; }

        /* Stat badge */
        .stat-badge {
          display: flex; flex-direction: column; align-items: center;
          background: #0f1a10; border: 1px solid #1e2d1e; border-radius: 10px; padding: 10px 14px;
        }

        /* Video wrapper */
        .vid-wrap { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 10px; }
        .vid-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #0a0f0b; }
        ::-webkit-scrollbar-thumb { background: #00ff5740; border-radius: 2px; }

        @media (max-width: 480px) {
          .ex-grid { grid-template-columns: 1fr !important; }
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
            "radial-gradient(ellipse at 10% 10%, rgba(0,255,87,0.04) 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(167,139,250,0.03) 0%, transparent 50%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(28px,4vw,56px) clamp(16px,4vw,40px)",
        }}
      >
        {/* ── PAGE HEADER ─────────────────────────────────────────────── */}
        <div
          className="ex-enter"
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
              Movement Library
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
            EXERCISE
            <br />
            <span
              style={{
                color: "#00ff57",
                fontStyle: "italic",
                textShadow: "0 0 50px rgba(0,255,87,0.25)",
              }}
            >
              LIBRARY
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
            Browse all exercises with reps, sets, and video guidance. Click any
            card to expand details.
          </p>
        </div>

        {/* ── STATS ROW ───────────────────────────────────────────────── */}
        <div
          className="ex-enter"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            marginBottom: 40,
            animationDelay: "0.08s",
          }}
        >
          {[
            {
              label: "Total Exercises",
              value: exercises.length,
              color: "#00ff57",
            },
            {
              label: "With Video",
              value: exercises.filter((e) => e.videoURL).length,
              color: "#00cfff",
            },
            {
              label: "Categories",
              value: categories.length - 1 || "—",
              color: "#ff9f43",
            },
            { label: "Showing", value: filtered.length, color: "#a78bfa" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: "#111a12",
                border: "1px solid #1e2d1e",
                borderRadius: 12,
                padding: "14px 22px",
                display: "flex",
                alignItems: "center",
                gap: 12,
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
                  background: s.color,
                }}
              />
              <span
                style={{
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontWeight: 800,
                  fontStyle: "italic",
                  fontSize: 26,
                  color: s.color,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  fontFamily: "'JetBrains Mono',monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── SEARCH + FILTER ─────────────────────────────────────────── */}
        <div
          className="ex-enter"
          style={{ marginBottom: 40, animationDelay: "0.12s" }}
        >
          {/* Search */}
          <div
            style={{ position: "relative", maxWidth: 480, marginBottom: 16 }}
          >
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
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              className="ex-search"
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6b7280",
                  fontSize: 16,
                  padding: 0,
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Category pills */}
          {categories.length > 1 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {categories.map((c) => (
                <button
                  key={c}
                  className={`fp ${activeFilter === c ? "fp-active" : "fp-inactive"}`}
                  onClick={() => setActiveFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── EMPTY STATE ─────────────────────────────────────────────── */}
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
              No Exercises Found
            </h3>
            <p style={{ color: "#8a9e8a", fontSize: 15 }}>
              Try adjusting your search or filter.
            </p>
          </div>
        )}

        {/* ── EXERCISE GRID ───────────────────────────────────────────── */}
        <div
          className="ex-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 20,
            alignItems: "start",
          }}
        >
          {filtered.map((exercise, index) => {
            const mc = muscleColor(exercise.muscleGroup || exercise.category);
            const isOpen = expandedId === index;

            return (
              <div
                key={exercise._id || index}
                className="ex-card ex-enter"
                style={{ animationDelay: `${0.15 + index * 0.05}s` }}
                onClick={() => setExpandedId(isOpen ? null : index)}
              >
                {/* Top accent */}
                <div
                  style={{
                    height: 3,
                    background: `linear-gradient(to right, ${mc.color}, transparent)`,
                  }}
                />

                <div style={{ padding: "22px 22px 0" }}>
                  {/* Meta row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      {exercise.muscleGroup && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: mc.color,
                            background: mc.bg,
                            border: `1px solid ${mc.border}`,
                            borderRadius: 999,
                            padding: "3px 10px",
                            fontFamily: "'JetBrains Mono',monospace",
                            textTransform: "uppercase",
                            letterSpacing: "0.07em",
                          }}
                        >
                          {exercise.muscleGroup}
                        </span>
                      )}
                      {exercise.category && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "#6b7280",
                            background: "#0f1a10",
                            border: "1px solid #1e2d1e",
                            borderRadius: 999,
                            padding: "3px 10px",
                            fontFamily: "'JetBrains Mono',monospace",
                            textTransform: "uppercase",
                            letterSpacing: "0.07em",
                          }}
                        >
                          {exercise.category}
                        </span>
                      )}
                    </div>
                    {/* Expand chevron */}
                    <svg
                      width="18"
                      height="18"
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
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "'Barlow Condensed',sans-serif",
                      fontWeight: 800,
                      fontStyle: "italic",
                      fontSize: "clamp(20px,2.5vw,26px)",
                      textTransform: "uppercase",
                      letterSpacing: "0.01em",
                      marginBottom: 10,
                      color: "#f0f0f0",
                      lineHeight: 1.1,
                    }}
                  >
                    {exercise.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: 14,
                      color: "#8a9e8a",
                      lineHeight: 1.7,
                      marginBottom: 18,
                    }}
                  >
                    {exercise.description}
                  </p>

                  {/* Reps / Sets / Duration */}
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      marginBottom: 20,
                      flexWrap: "wrap",
                    }}
                  >
                    {exercise.sets && (
                      <div className="stat-badge">
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: 18,
                            fontWeight: 700,
                            color: mc.color,
                            lineHeight: 1,
                          }}
                        >
                          {exercise.sets}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            color: "#4b5563",
                            marginTop: 4,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            fontFamily: "'JetBrains Mono',monospace",
                          }}
                        >
                          Sets
                        </span>
                      </div>
                    )}
                    {exercise.reps && (
                      <div className="stat-badge">
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#00cfff",
                            lineHeight: 1,
                          }}
                        >
                          {exercise.reps}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            color: "#4b5563",
                            marginTop: 4,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            fontFamily: "'JetBrains Mono',monospace",
                          }}
                        >
                          Reps
                        </span>
                      </div>
                    )}
                    {exercise.duration && (
                      <div className="stat-badge">
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#ff9f43",
                            lineHeight: 1,
                          }}
                        >
                          {exercise.duration}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            color: "#4b5563",
                            marginTop: 4,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            fontFamily: "'JetBrains Mono',monospace",
                          }}
                        >
                          Secs
                        </span>
                      </div>
                    )}
                    {exercise.rest && (
                      <div className="stat-badge">
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#a78bfa",
                            lineHeight: 1,
                          }}
                        >
                          {exercise.rest}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            color: "#4b5563",
                            marginTop: 4,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            fontFamily: "'JetBrains Mono',monospace",
                          }}
                        >
                          Rest
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── EXPANDED SECTION ── */}
                {isOpen && (
                  <div
                    style={{
                      padding: "0 22px 22px",
                      animation: "fadeUp 0.3s ease",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Divider */}
                    <div
                      style={{
                        height: 1,
                        background:
                          "linear-gradient(to right, transparent, #1e2d1e 20%, #1e2d1e 80%, transparent)",
                        marginBottom: 18,
                      }}
                    />

                    {/* Detail text */}
                    {exercise.detail && (
                      <div
                        style={{
                          background: "#0f1a10",
                          border: "1px solid #1e2d1e",
                          borderRadius: 10,
                          padding: "14px 16px",
                          marginBottom: 18,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 8,
                          }}
                        >
                          <div
                            style={{
                              width: 14,
                              height: 2,
                              background: mc.color,
                              borderRadius: 1,
                            }}
                          />
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: 10,
                              color: mc.color,
                              letterSpacing: "0.16em",
                              textTransform: "uppercase",
                            }}
                          >
                            Instructions
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: 13,
                            color: "#a0b0a0",
                            lineHeight: 1.75,
                            margin: 0,
                          }}
                        >
                          {exercise.detail}
                        </p>
                      </div>
                    )}

                    {/* Video */}
                    {exercise.videoURL && (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 14,
                              height: 2,
                              background: "#ff6b9d",
                              borderRadius: 1,
                            }}
                          />
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: 10,
                              color: "#ff6b9d",
                              letterSpacing: "0.16em",
                              textTransform: "uppercase",
                            }}
                          >
                            Video Guide
                          </span>
                        </div>
                        <div className="vid-wrap">
                          <iframe
                            src={exercise.videoURL.replace(
                              "watch?v=",
                              "embed/",
                            )}
                            title={exercise.title}
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}

                    {/* No video fallback */}
                    {!exercise.videoURL && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          background: "#0f1a10",
                          border: "1px solid #1e2d1e",
                          borderRadius: 10,
                          padding: "12px 16px",
                        }}
                      >
                        <span style={{ fontSize: 16 }}>🎬</span>
                        <span
                          style={{
                            fontSize: 13,
                            color: "#4b5563",
                            fontFamily: "'JetBrains Mono',monospace",
                          }}
                        >
                          No video available for this exercise
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Click hint when collapsed */}
                {!isOpen && (
                  <div style={{ padding: "0 22px 18px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: "#374137",
                          fontFamily: "'JetBrains Mono',monospace",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {exercise.videoURL
                          ? "▶ VIDEO AVAILABLE — TAP TO EXPAND"
                          : "TAP TO EXPAND DETAILS"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── FOOTER ─────────────────────────────────────────────────── */}
        <div
          className="ex-enter"
          style={{
            marginTop: 48,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
            borderTop: "1px solid #1e2d1e",
            paddingTop: 18,
            animationDelay: "0.4s",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 12,
              color: "#374137",
            }}
          >
            LIBRARY STATUS <span style={{ color: "#00ff57" }}>● ONLINE</span>
          </span>
          <span
            style={{
              fontSize: 12,
              color: "#374137",
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            FitLife Exercises v2.0
          </span>
        </div>
      </div>
    </div>
  );
};

export default Exercises;

// import React, { useEffect, useState } from "react";
// import { API_BASE_URL } from "../../api/api";

// const muscleColor = (muscle) => {
//   const m = muscle?.toLowerCase();
//   if (m?.includes("chest"))                           return { color: "#ff6b9d", bg: "rgba(255,107,157,0.08)", border: "rgba(255,107,157,0.25)" };
//   if (m?.includes("back"))                            return { color: "#00cfff", bg: "rgba(0,207,255,0.08)",   border: "rgba(0,207,255,0.25)"   };
//   if (m?.includes("leg") || m?.includes("glute"))    return { color: "#ff9f43", bg: "rgba(255,159,67,0.08)",  border: "rgba(255,159,67,0.25)"  };
//   if (m?.includes("shoulder") || m?.includes("arm")) return { color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.25)" };
//   if (m?.includes("core") || m?.includes("abs"))     return { color: "#00ff57", bg: "rgba(0,255,87,0.08)",    border: "rgba(0,255,87,0.25)"    };
//   return                                                     { color: "#00ff57", bg: "rgba(0,255,87,0.08)",    border: "rgba(0,255,87,0.25)"    };
// };

// const Exercises = () => {
//   const [exercises, setExercises]       = useState([]);
//   const [filtered, setFiltered]         = useState([]);
//   const [loading, setLoading]           = useState(true);
//   const [search, setSearch]             = useState("");
//   const [activeFilter, setActiveFilter] = useState("All");

//   useEffect(() => {
//     const fetchExercises = async () => {
//       try {
//         const res  = await fetch(`${API_BASE_URL}/api/admin/exercise`);
//         const data = await res.json();
//         setExercises(data.data || []);
//         setFiltered(data.data  || []);
//       } catch (err) {
//         console.error("Failed to load exercises", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchExercises();
//   }, []);

//   useEffect(() => {
//     let list = exercises;
//     if (activeFilter !== "All")
//       list = list.filter(e =>
//         e.category?.toLowerCase() === activeFilter.toLowerCase() ||
//         e.muscleGroup?.toLowerCase().includes(activeFilter.toLowerCase())
//       );
//     if (search.trim())
//       list = list.filter(e =>
//         e.title?.toLowerCase().includes(search.toLowerCase()) ||
//         e.description?.toLowerCase().includes(search.toLowerCase())
//       );
//     setFiltered(list);
//   }, [search, activeFilter, exercises]);

//   const categories = ["All", ...Array.from(new Set(exercises.map(e => e.category).filter(Boolean)))];

//   // ── Loading ──────────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div style={{ minHeight: "100vh", background: "#0a0f0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <style>{`
//           @keyframes spin  { to { transform: rotate(360deg); } }
//           @keyframes pulse { 0%,100%{opacity:.4;transform:translate(-50%,-50%) scale(.8)} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.2)} }
//           @keyframes slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(350%)} }
//         `}</style>
//         <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
//           <div style={{ position: "relative", width: 64, height: 64 }}>
//             <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid #1e2d22" }} />
//             <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#00ff57", animation: "spin 1s linear infinite" }} />
//             <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#9ca3af", animation: "spin 1.5s linear infinite reverse" }} />
//             <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 8, height: 8, borderRadius: "50%", background: "#00ff57", animation: "pulse 1s ease-in-out infinite" }} />
//           </div>
//           <p style={{ color: "#9ca3af", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace" }}>Loading Exercises</p>
//           <div style={{ width: 120, height: 2, background: "#1e2d22", borderRadius: 999, overflow: "hidden" }}>
//             <div style={{ height: "100%", width: "40%", background: "#00ff57", borderRadius: 999, animation: "slide 1.2s ease-in-out infinite" }} />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ minHeight: "100vh", background: "#0a0f0b", color: "white", fontFamily: "'Sora',sans-serif", position: "relative" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
//         *, *::before, *::after { box-sizing: border-box; }

//         @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes pring  { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.2);opacity:0} }

//         .ex-enter { opacity:0; animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) forwards; }

//         .ex-search {
//           width: 100%; background: #111a12; border: 1px solid #1e2d1e;
//           border-radius: 10px; padding: 12px 18px 12px 44px;
//           color: white; font-size: 14px; font-family: 'Sora',sans-serif; outline: none;
//           transition: border-color 0.25s ease, box-shadow 0.25s ease;
//         }
//         .ex-search::placeholder { color: #4b5563; }
//         .ex-search:focus { border-color: #00ff5760; box-shadow: 0 0 0 3px rgba(0,255,87,0.08); }

//         .fp { padding: 8px 20px; border-radius: 999px; font-size: 13px; font-weight: 600;
//           font-family: 'Sora',sans-serif; cursor: pointer; outline: none;
//           transition: all 0.22s ease; letter-spacing: 0.04em; white-space: nowrap; }
//         .fp-active   { background: #00ff57; color: #000; border: 1px solid #00ff57; box-shadow: 0 4px 14px rgba(0,255,87,0.28); }
//         .fp-inactive { background: #111a12; color: #8a9e8a; border: 1px solid #1e2d1e; }
//         .fp-inactive:hover { background: #182118; border-color: #2a3d2a; color: #e5e7eb; }

//         .ex-card {
//           background: #111a12; border: 1px solid #1e2d1e; border-radius: 16px;
//           overflow: hidden; display: flex; flex-direction: column;
//           transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
//         }
//         .ex-card:hover { transform: translateY(-4px); box-shadow: 0 20px 56px rgba(0,0,0,0.55); border-color: #2a3d2a; }

//         .stat-badge {
//           display: flex; flex-direction: column; align-items: center;
//           background: #0f1a10; border: 1px solid #1e2d1e; border-radius: 10px; padding: 10px 16px;
//           min-width: 62px;
//         }

//         .vid-wrap { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; }
//         .vid-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }

//         ::-webkit-scrollbar { width: 3px; }
//         ::-webkit-scrollbar-track { background: #0a0f0b; }
//         ::-webkit-scrollbar-thumb { background: #00ff5740; border-radius: 2px; }

//         @media (max-width: 480px) {
//           .ex-grid { grid-template-columns: 1fr !important; }
//         }
//       `}</style>

//       {/* Background glow */}
//       <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
//         background: "radial-gradient(ellipse at 10% 10%, rgba(0,255,87,0.04) 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(167,139,250,0.03) 0%, transparent 50%)" }} />

//       <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "clamp(28px,4vw,56px) clamp(16px,4vw,40px)" }}>

//         {/* ── PAGE HEADER ─────────────────────────────────────────────── */}
//         <div className="ex-enter" style={{ marginBottom: 40, animationDelay: "0s" }}>
//           <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,255,87,0.07)", border: "1px solid rgba(0,255,87,0.18)", borderRadius: 999, padding: "6px 16px", marginBottom: 18 }}>
//             <div style={{ position: "relative", width: 8, height: 8 }}>
//               <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff57", position: "absolute" }} />
//               <div style={{ width: 8, height: 8, borderRadius: "50%", border: "1px solid #00ff57", position: "absolute", animation: "pring 2.2s ease-out infinite" }} />
//             </div>
//             <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: "0.18em", color: "#00ff57", textTransform: "uppercase" }}>
//               Movement Library
//             </span>
//           </div>
//           <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(36px,6vw,64px)", lineHeight: 0.92, letterSpacing: "0.01em", textTransform: "uppercase", marginBottom: 14 }}>
//             EXERCISE<br />
//             <span style={{ color: "#00ff57", fontStyle: "italic", textShadow: "0 0 50px rgba(0,255,87,0.25)" }}>LIBRARY</span>
//           </h1>
//           <p style={{ color: "#8a9e8a", fontSize: 15, fontWeight: 400, maxWidth: 480, lineHeight: 1.7 }}>
//             Browse all exercises with reps, sets, and embedded video guides.
//           </p>
//         </div>

//         {/* ── STATS ROW ───────────────────────────────────────────────── */}
//         <div className="ex-enter" style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 40, animationDelay: "0.08s" }}>
//           {[
//             { label: "Total Exercises", value: exercises.length,                         color: "#00ff57" },
//             { label: "With Video",      value: exercises.filter(e => e.videoURL).length, color: "#00cfff" },
//             { label: "Categories",      value: categories.length - 1 || "—",             color: "#ff9f43" },
//             { label: "Showing",         value: filtered.length,                          color: "#a78bfa" },
//           ].map((s, i) => (
//             <div key={i} style={{ background: "#111a12", border: "1px solid #1e2d1e", borderRadius: 12, padding: "14px 22px", display: "flex", alignItems: "center", gap: 12, position: "relative", overflow: "hidden" }}>
//               <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: s.color }} />
//               <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 26, color: s.color, lineHeight: 1 }}>{s.value}</span>
//               <span style={{ fontSize: 12, color: "#6b7280", fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</span>
//             </div>
//           ))}
//         </div>

//         {/* ── SEARCH + FILTER ─────────────────────────────────────────── */}
//         <div className="ex-enter" style={{ marginBottom: 40, animationDelay: "0.12s" }}>
//           <div style={{ position: "relative", maxWidth: 480, marginBottom: 16 }}>
//             <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
//               width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2">
//               <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
//             </svg>
//             <input
//               className="ex-search"
//               placeholder="Search exercises..."
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//             />
//             {search && (
//               <button onClick={() => setSearch("")} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 16, padding: 0 }}>✕</button>
//             )}
//           </div>
//           {categories.length > 1 && (
//             <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//               {categories.map(c => (
//                 <button key={c} className={`fp ${activeFilter === c ? "fp-active" : "fp-inactive"}`} onClick={() => setActiveFilter(c)}>
//                   {c}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ── EMPTY STATE ─────────────────────────────────────────────── */}
//         {!filtered.length && (
//           <div style={{ textAlign: "center", padding: "80px 24px" }}>
//             <div style={{ fontSize: 48, marginBottom: 16 }}>🏋️</div>
//             <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 28, textTransform: "uppercase", marginBottom: 10 }}>No Exercises Found</h3>
//             <p style={{ color: "#8a9e8a", fontSize: 15 }}>Try adjusting your search or filter.</p>
//           </div>
//         )}

//         {/* ── EXERCISE GRID ───────────────────────────────────────────── */}
//         <div className="ex-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
//           {filtered.map((exercise, index) => {
//             const mc = muscleColor(exercise.muscleGroup || exercise.category);

//             return (
//               <div
//                 key={exercise._id}
//                 className="ex-card ex-enter"
//                 style={{ animationDelay: `${0.15 + index * 0.05}s` }}
//               >
//                 {/* ── VIDEO at TOP ── */}
//                 {exercise.videoURL ? (
//                   <div style={{ background: "#0a0f0b", position: "relative" }}>
//                     <div className="vid-wrap">
//                       <iframe
//                         src={exercise.videoURL.replace("watch?v=", "embed/")}
//                         title={exercise.title}
//                         allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                         allowFullScreen
//                       />
//                     </div>
//                     {/* Video label badge */}
//                     <div style={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 5, background: "rgba(10,15,11,0.85)", border: "1px solid rgba(255,107,157,0.3)", borderRadius: 6, padding: "4px 10px", backdropFilter: "blur(8px)" }}>
//                       <span style={{ fontSize: 10 }}>▶</span>
//                       <span style={{ fontSize: 10, color: "#ff6b9d", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>Video</span>
//                     </div>
//                   </div>
//                 ) : (
//                   /* No-video placeholder */
//                   <div style={{ background: "#0d150e", borderBottom: "1px solid #1e2d1e", height: 120, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
//                     <span style={{ fontSize: 28 }}>🏋️</span>
//                     <span style={{ fontSize: 12, color: "#2a3d2a", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em" }}>NO VIDEO</span>
//                   </div>
//                 )}

//                 {/* Top accent line */}
//                 <div style={{ height: 3, background: `linear-gradient(to right, ${mc.color}, transparent)` }} />

//                 {/* ── CARD BODY ── */}
//                 <div style={{ padding: "20px 22px", flex: 1, display: "flex", flexDirection: "column" }}>

//                   {/* Tags */}
//                   <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
//                     {exercise.muscleGroup && (
//                       <span style={{ fontSize: 11, fontWeight: 700, color: mc.color, background: mc.bg, border: `1px solid ${mc.border}`, borderRadius: 999, padding: "3px 10px", fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.07em" }}>
//                         {exercise.muscleGroup}
//                       </span>
//                     )}
//                     {exercise.category && (
//                       <span style={{ fontSize: 11, color: "#6b7280", background: "#0f1a10", border: "1px solid #1e2d1e", borderRadius: 999, padding: "3px 10px", fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.07em" }}>
//                         {exercise.category}
//                       </span>
//                     )}
//                   </div>

//                   {/* Title */}
//                   <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: "clamp(20px,2.5vw,26px)", textTransform: "uppercase", letterSpacing: "0.01em", marginBottom: 10, color: "#f0f0f0", lineHeight: 1.1 }}>
//                     {exercise.title}
//                   </h3>

//                   {/* Description */}
//                   <p style={{ fontSize: 14, color: "#8a9e8a", lineHeight: 1.7, marginBottom: 18 }}>
//                     {exercise.description}
//                   </p>

//                   {/* Stat badges */}
//                   <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
//                     {exercise.sets && (
//                       <div className="stat-badge">
//                         <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 700, color: mc.color, lineHeight: 1 }}>{exercise.sets}</span>
//                         <span style={{ fontSize: 10, color: "#4b5563", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'JetBrains Mono',monospace" }}>Sets</span>
//                       </div>
//                     )}
//                     {exercise.reps && (
//                       <div className="stat-badge">
//                         <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 700, color: "#00cfff", lineHeight: 1 }}>{exercise.reps}</span>
//                         <span style={{ fontSize: 10, color: "#4b5563", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'JetBrains Mono',monospace" }}>Reps</span>
//                       </div>
//                     )}
//                     {exercise.duration && (
//                       <div className="stat-badge">
//                         <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 700, color: "#ff9f43", lineHeight: 1 }}>{exercise.duration}</span>
//                         <span style={{ fontSize: 10, color: "#4b5563", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'JetBrains Mono',monospace" }}>Secs</span>
//                       </div>
//                     )}
//                     {exercise.rest && (
//                       <div className="stat-badge">
//                         <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 700, color: "#a78bfa", lineHeight: 1 }}>{exercise.rest}</span>
//                         <span style={{ fontSize: 10, color: "#4b5563", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'JetBrains Mono',monospace" }}>Rest</span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Detail / Instructions */}
//                   {exercise.detail && (
//                     <div style={{ background: "#0f1a10", border: "1px solid #1e2d1e", borderRadius: 10, padding: "14px 16px", marginTop: "auto" }}>
//                       <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
//                         <div style={{ width: 14, height: 2, background: mc.color, borderRadius: 1 }} />
//                         <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: mc.color, letterSpacing: "0.16em", textTransform: "uppercase" }}>Instructions</span>
//                       </div>
//                       <p style={{ fontSize: 13, color: "#a0b0a0", lineHeight: 1.75, margin: 0 }}>{exercise.detail}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* ── FOOTER ──────────────────────────────────────────────────── */}
//         <div className="ex-enter" style={{ marginTop: 48, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, borderTop: "1px solid #1e2d1e", paddingTop: 18, animationDelay: "0.4s" }}>
//           <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#374137" }}>
//             LIBRARY STATUS <span style={{ color: "#00ff57" }}>● ONLINE</span>
//           </span>
//           <span style={{ fontSize: 12, color: "#374137", fontFamily: "'JetBrains Mono',monospace" }}>FitLife Exercises v2.0</span>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Exercises;
