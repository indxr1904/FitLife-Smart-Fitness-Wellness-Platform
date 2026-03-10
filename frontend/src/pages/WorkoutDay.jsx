// WorkoutDay.jsx
import React, { useState, useRef } from "react";

const WorkoutDay = ({ dayData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);

  const exercises = dayData?.exercises || [];
  const currentExercise = exercises[currentIndex];

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) setCurrentIndex((p) => p + 1);
  };
  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((p) => p - 1);
  };

  if (!exercises.length) {
    return (
      <div style={{ textAlign: "center", padding: "40px 24px" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🏋️</div>
        <p
          style={{
            color: "#6b7280",
            fontSize: 14,
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          No exercises added for this day.
        </p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Sora',sans-serif", color: "white" }}>
      {/* ── HEADER ── */}
      <div style={{ marginBottom: 24 }}>
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
              width: 18,
              height: 2,
              background: "#00ff57",
              borderRadius: 1,
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 10,
              color: "#00ff57",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Exercise {currentIndex + 1} of {exercises.length}
          </span>
        </div>
        <h2
          style={{
            fontFamily: "'Barlow Condensed',sans-serif",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: "clamp(22px,3vw,32px)",
            textTransform: "uppercase",
            margin: 0,
            color: "#f0f0f0",
          }}
        >
          {dayData.dayName} — Workout
        </h2>
        <p
          style={{
            color: "#8a9e8a",
            fontSize: 14,
            marginTop: 6,
            lineHeight: 1.6,
          }}
        >
          Follow your daily exercise plan and maintain consistency for best
          results.
        </p>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div
        style={{
          height: 3,
          background: "#1e2d1e",
          borderRadius: 999,
          marginBottom: 24,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${((currentIndex + 1) / exercises.length) * 100}%`,
            background: "#00ff57",
            borderRadius: 999,
            transition: "width 0.4s ease",
          }}
        />
      </div>

      {/* ── EXERCISE CARD ── */}
      {currentExercise && (
        <div
          style={{
            background: "#0f1a10",
            border: "1px solid #1e2d1e",
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          {/* Card top accent */}
          <div
            style={{
              height: 3,
              background: "linear-gradient(to right, #00ff57, transparent)",
            }}
          />

          <div style={{ padding: "22px 24px" }}>
            {/* Title + badges */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <h3
                style={{
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontWeight: 800,
                  fontStyle: "italic",
                  fontSize: "clamp(18px,2.5vw,24px)",
                  textTransform: "uppercase",
                  margin: 0,
                  color: "#f0f0f0",
                }}
              >
                {currentExercise.exerciseId?.title || "Exercise"}
              </h3>
              {currentExercise.exerciseId?.muscleGroup && (
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
                    letterSpacing: "0.07em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentExercise.exerciseId.muscleGroup}
                </span>
              )}
            </div>

            {/* Description */}
            <p
              style={{
                color: "#8a9e8a",
                fontSize: 14,
                lineHeight: 1.7,
                marginBottom: 20,
              }}
            >
              {currentExercise.exerciseId?.description ||
                "No description available."}
            </p>

            {/* Reps / Sets / Rest stat tiles */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 20,
              }}
            >
              {[
                {
                  label: "Reps",
                  value: currentExercise.exerciseId?.reps,
                  color: "#00cfff",
                },
                {
                  label: "Sets",
                  value: currentExercise.exerciseId?.sets,
                  color: "#00ff57",
                },
                {
                  label: "Rest",
                  value: currentExercise.exerciseId?.rest,
                  color: "#a78bfa",
                },
                {
                  label: "Secs",
                  value: currentExercise.exerciseId?.duration,
                  color: "#ff9f43",
                },
              ]
                .filter((s) => s.value)
                .map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      background: "#141f14",
                      border: "1px solid #1e2d1e",
                      borderRadius: 10,
                      padding: "12px 20px",
                      minWidth: 72,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: 20,
                        fontWeight: 700,
                        color: s.color,
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "#4b5563",
                        marginTop: 5,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontFamily: "'JetBrains Mono',monospace",
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
            </div>

            {/* Detail / Instructions */}
            {currentExercise.exerciseId?.detail && (
              <div
                style={{
                  background: "#141f14",
                  border: "1px solid #1e2d1e",
                  borderRadius: 10,
                  padding: "14px 16px",
                  marginBottom: 20,
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
                      background: "#00ff57",
                      borderRadius: 1,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 10,
                      color: "#00ff57",
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
                  {currentExercise.exerciseId.detail}
                </p>
              </div>
            )}

            {/* Video */}
            {currentExercise.exerciseId?.videoURL && (
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
                <div
                  style={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                    overflow: "hidden",
                    borderRadius: 12,
                    border: "1px solid #1e2d1e",
                  }}
                >
                  <iframe
                    ref={videoRef}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                    src={currentExercise.exerciseId.videoURL.replace(
                      "watch?v=",
                      "embed/",
                    )}
                    title={
                      currentExercise.exerciseId?.title || "Exercise Video"
                    }
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── NAVIGATION ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          style={{
            flex: 1,
            minWidth: 120,
            padding: "12px 24px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'Sora',sans-serif",
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
            background: currentIndex === 0 ? "#1a241a" : "#111a12",
            color: currentIndex === 0 ? "#374137" : "#e5e7eb",
            border:
              currentIndex === 0 ? "1px solid #1a241a" : "1px solid #1e2d1e",
            transition: "all 0.25s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
          onMouseEnter={(e) => {
            if (currentIndex !== 0)
              e.currentTarget.style.borderColor = "#2a3d2a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor =
              currentIndex === 0 ? "#1a241a" : "#1e2d1e";
          }}
        >
          ← Previous
        </button>

        {/* Dot indicators */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {exercises.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                width: i === currentIndex ? 20 : 6,
                height: 6,
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                background: i === currentIndex ? "#00ff57" : "#1e2d1e",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === exercises.length - 1}
          style={{
            flex: 1,
            minWidth: 120,
            padding: "12px 24px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'Sora',sans-serif",
            cursor:
              currentIndex === exercises.length - 1 ? "not-allowed" : "pointer",
            background:
              currentIndex === exercises.length - 1 ? "#1a241a" : "#00ff57",
            color: currentIndex === exercises.length - 1 ? "#374137" : "#000",
            border:
              currentIndex === exercises.length - 1
                ? "1px solid #1a241a"
                : "1px solid #00ff57",
            transition: "all 0.25s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
          onMouseEnter={(e) => {
            if (currentIndex !== exercises.length - 1)
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(0,255,87,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default WorkoutDay;
