import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api/api";
const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/exercise`);
        const data = await res.json();
        setExercises(data.data || []);
      } catch (err) {
        console.error("Failed to load exercises", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0b0f0c] min-h-screen flex items-center justify-center">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* Spinning ring */}
          <div style={{ position: "relative", width: "64px", height: "64px" }}>
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
                inset: "8px",
                borderRadius: "50%",
                border: "2px solid transparent",
                borderTopColor: "#9ca3af",
                animation: "spin 1.5s linear infinite reverse",
              }}
            />
            {/* Center dot */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#00ff57",
                animation: "pulse 1s ease-in-out infinite",
              }}
            />
          </div>

          {/* Text */}
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "600",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Loading
            </p>
            <p
              style={{
                color: "#4b5563",
                fontSize: "12px",
                letterSpacing: "0.1em",
                marginTop: "6px",
              }}
            >
              Please wait...
            </p>
          </div>

          {/* Bar */}
          <div
            style={{
              width: "120px",
              height: "2px",
              backgroundColor: "#1e2d22",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "40%",
                backgroundColor: "#00ff57",
                borderRadius: "999px",
                animation: "slide 1.2s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.8); } 50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); } }
        @keyframes slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }
      `}</style>
      </div>
    );
  }

  // Empty state
  if (!exercises.length) {
    return (
      <div className="bg-[#0b0f0c] min-h-screen text-white flex items-center justify-center">
        <p className="text-gray-400">No exercises found.</p>
      </div>
    );
  }

  return (
    <div className="text-white px-4 sm:px-6 lg:px-10 pt-10 mb-10">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Exercise Library
        </h1>
        <p className="text-gray-400 mt-3 max-w-3xl mx-auto">
          Browse all available exercises with reps, sets, and video guidance.
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {exercises.map((exercise) => (
          <div
            key={exercise._id}
            className="bg-[#111811] border border-[#1e2d22] rounded-xl p-5 shadow-lg flex flex-col"
          >
            <h3 className="text-lg font-semibold mb-1">{exercise.title}</h3>

            <p className="text-gray-400 text-sm mb-3">{exercise.description}</p>

            <div className="flex gap-4 text-sm mb-3">
              <span className="bg-[#1e2d22] px-3 py-1 rounded">
                Reps: {exercise.reps || "-"}
              </span>
              <span className="bg-[#1e2d22] px-3 py-1 rounded">
                Sets: {exercise.sets || "-"}
              </span>
            </div>

            <p className="text-gray-400 text-sm mb-4">{exercise.detail}</p>

            {/* VIDEO */}
            {exercise.videoURL && (
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg mt-auto">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={exercise.videoURL.replace("watch?v=", "embed/")}
                  title={exercise.title}
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exercises;
