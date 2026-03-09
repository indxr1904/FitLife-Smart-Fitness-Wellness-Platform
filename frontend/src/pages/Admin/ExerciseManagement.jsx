import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Dumbbell,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../api/api";

const ExerciseManagement = () => {
  const navigate = useNavigate();
  const [exercises, setExercise] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/exercise`);
        const result = await res.json();
        const allData = result?.data || [];
        setExercise(allData);
      } catch (error) {
        console.error(error, "Server Error");
        toast.error("Failed to load exercises");
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
  }, []);

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEdit = (id) => navigate(`/admin/editexercise/${id}`);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/exercise/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.status === "success") {
        setExercise((prev) => prev.filter((item) => item._id !== id));
        toast.success("Exercise deleted successfully");
        setDeleteId(null);
      } else {
        toast.error(result.message || "Failed to delete");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleAddExercise = (e) => {
    e.preventDefault();
    navigate("/admin/addexercise");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0b0f0c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
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
          <p
            style={{
              color: "#9ca3af",
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Loading exercises
          </p>
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
          @keyframes pulse { 0%,100%{opacity:.4;transform:translate(-50%,-50%) scale(.8)} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.2)} }
          @keyframes slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(350%)} }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh",
        background: "#0b0f0c",
        color: "white",
        padding: "24px 16px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .fade-up { animation: fadeUp 0.5s ease forwards; opacity: 0; transform: translateY(10px); }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
        .add-btn:hover { background: #00e14f !important; transform: translateY(-1px); }
        .edit-btn:hover { background: #00e14f !important; }
        .del-btn:hover { background: #ef444420 !important; border-color: #ef4444 !important; }
        .read-more { background: none; border: none; color: #00ff57; font-size: 11px; cursor: pointer; padding: 0; margin-top: 4px; font-family: 'DM Mono', monospace; }
        .read-more:hover { text-decoration: underline; }

        /* DESKTOP TABLE */
        .desktop-table { display: block; }
        .mobile-cards { display: none; }

        /* TABLET */
        @media (max-width: 1024px) {
          .desktop-table { display: none; }
          .mobile-cards { display: block; }
        }

        /* CARD STYLES */
        .ex-card { background: #111811; border: 1px solid #1e2d22; border-radius: 12px; padding: 16px; margin-bottom: 12px; transition: border-color 0.2s ease; }
        .ex-card:hover { border-color: #2a3d2a; }
        .ex-card-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .ex-card-body { margin-top: 14px; padding-top: 14px; border-top: 1px solid #1a221a; }
        .ex-card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
        .ex-card-stat { background: #0e150e; border-radius: 8px; padding: 8px 12px; }

        /* DESKTOP ROW */
        .ex-row { transition: background 0.15s ease; border-bottom: 1px solid #1a221a; }
        .ex-row:hover { background: #111f11 !important; }
        .ex-row:last-child { border-bottom: none; }

        .modal-cancel:hover { background: #374151 !important; }
        .modal-delete:hover { background: #dc2626 !important; }

        @media (max-width: 480px) {
          .ex-card-grid { grid-template-columns: 1fr 1fr; }
          .action-row { flex-direction: row; }
        }
      `}</style>

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* HEADER */}
        <div
          className="fade-up"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
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
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  color: "#4b5563",
                  textTransform: "uppercase",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                Admin Panel
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(20px, 4vw, 32px)",
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Exercise <span style={{ color: "#00ff57" }}>Management</span>
            </h1>
            <p style={{ color: "#6b7280", marginTop: "4px", fontSize: "14px" }}>
              {exercises.length} exercise{exercises.length !== 1 ? "s" : ""} in
              library
            </p>
          </div>
          <button
            className="add-btn"
            onClick={handleAddExercise}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#00ff57",
              border: "none",
              borderRadius: "10px",
              padding: "10px 18px",
              color: "black",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "background 0.2s, transform 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            <Plus size={15} strokeWidth={3} />
            Add Exercise
          </button>
        </div>

        {/* STAT CHIP */}
        <div
          className="fade-up"
          style={{
            animationDelay: "0.1s",
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: "#111811",
              border: "1px solid #1e2d22",
              borderRadius: "8px",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Dumbbell size={14} color="#00ff57" />
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "14px",
                fontWeight: 700,
                color: "#00ff57",
              }}
            >
              {exercises.length}
            </span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              Total Exercises
            </span>
          </div>
        </div>

        {/* ── DESKTOP TABLE (≥1024px) ── */}
        <div
          className="desktop-table fade-up"
          style={{
            animationDelay: "0.2s",
            background: "#111811",
            border: "1px solid #1e2d22",
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 2fr 0.5fr 0.5fr 2fr 1.2fr",
              gap: "12px",
              padding: "13px 24px",
              borderBottom: "1px solid #1e2d22",
              background: "#0e150e",
            }}
          >
            {[
              "Exercise",
              "Description",
              "Reps",
              "Sets",
              "Details",
              "Actions",
            ].map((h) => (
              <span
                key={h}
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  color: "#4b5563",
                  textTransform: "uppercase",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {exercises.length === 0 ? (
            <div
              style={{ padding: "60px", textAlign: "center", color: "#4b5563" }}
            >
              <Dumbbell
                size={32}
                color="#1e2d22"
                style={{ margin: "0 auto 12px" }}
              />
              <p style={{ margin: 0, fontSize: "14px" }}>
                No exercises found. Add your first one.
              </p>
            </div>
          ) : (
            exercises.map((exercise, index) => (
              <div
                key={index}
                className="ex-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 2fr 0.5fr 0.5fr 2fr 1.2fr",
                  gap: "12px",
                  padding: "16px 24px",
                  alignItems: "start",
                  background: "transparent",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "#1e2d22",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Dumbbell size={14} color="#00ff57" />
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    {exercise.title}
                  </span>
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "#9ca3af",
                      lineHeight: "1.5",
                      display: "-webkit-box",
                      WebkitLineClamp: expandedRows[exercise.id] ? "unset" : 2,
                      WebkitBoxOrient: "vertical",
                      overflow: expandedRows[exercise.id]
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    {exercise.description}
                  </p>
                  <button
                    className="read-more"
                    onClick={() => toggleExpand(exercise.id)}
                  >
                    {expandedRows[exercise.id] ? "Show Less ↑" : "Read More ↓"}
                  </button>
                </div>
                <div style={{ textAlign: "center" }}>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#00ff57",
                    }}
                  >
                    {exercise.reps}
                  </span>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: "10px",
                      color: "#4b5563",
                    }}
                  >
                    reps
                  </p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#00cfff",
                    }}
                  >
                    {exercise.sets}
                  </span>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: "10px",
                      color: "#4b5563",
                    }}
                  >
                    sets
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "#9ca3af",
                      lineHeight: "1.5",
                      display: "-webkit-box",
                      WebkitLineClamp: expandedRows[`details-${exercise.id}`]
                        ? "unset"
                        : 2,
                      WebkitBoxOrient: "vertical",
                      overflow: expandedRows[`details-${exercise.id}`]
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    {exercise.detail}
                  </p>
                  <button
                    className="read-more"
                    onClick={() => toggleExpand(`details-${exercise.id}`)}
                  >
                    {expandedRows[`details-${exercise.id}`]
                      ? "Show Less ↑"
                      : "Read More ↓"}
                  </button>
                </div>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(exercise?._id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      background: "#00ff57",
                      border: "none",
                      borderRadius: "7px",
                      padding: "7px 12px",
                      color: "black",
                      fontWeight: 700,
                      fontSize: "12px",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "background 0.15s",
                    }}
                  >
                    <Pencil size={12} strokeWidth={2.5} /> Edit
                  </button>
                  <button
                    className="del-btn"
                    onClick={() => setDeleteId(exercise?._id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      background: "#1e2d22",
                      border: "1px solid #ef444430",
                      borderRadius: "7px",
                      padding: "7px 12px",
                      color: "#ef4444",
                      fontWeight: 600,
                      fontSize: "12px",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                  >
                    <Trash2 size={12} strokeWidth={2.5} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── MOBILE / TABLET CARDS (<1024px) ── */}
        <div
          className="mobile-cards fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          {exercises.length === 0 ? (
            <div
              style={{
                background: "#111811",
                border: "1px solid #1e2d22",
                borderRadius: "14px",
                padding: "60px",
                textAlign: "center",
                color: "#4b5563",
              }}
            >
              <Dumbbell
                size={32}
                color="#1e2d22"
                style={{ margin: "0 auto 12px" }}
              />
              <p style={{ margin: 0, fontSize: "14px" }}>
                No exercises found. Add your first one.
              </p>
            </div>
          ) : (
            exercises.map((exercise, index) => (
              <div key={index} className="ex-card">
                {/* Card Header */}
                <div className="ex-card-header">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "9px",
                        background: "#1e2d22",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Dumbbell size={16} color="#00ff57" />
                    </div>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "white",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {exercise.title}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleExpand(`card-${exercise._id}`)}
                    style={{
                      background: "#1e2d22",
                      border: "none",
                      borderRadius: "6px",
                      padding: "5px 8px",
                      color: "#9ca3af",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    {expandedRows[`card-${exercise._id}`] ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                </div>

                {/* Reps / Sets always visible */}
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <div
                    style={{
                      background: "#0e150e",
                      borderRadius: "7px",
                      padding: "6px 14px",
                      flex: 1,
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#00ff57",
                      }}
                    >
                      {exercise.reps}
                    </span>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: "10px",
                        color: "#4b5563",
                      }}
                    >
                      REPS
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#0e150e",
                      borderRadius: "7px",
                      padding: "6px 14px",
                      flex: 1,
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#00cfff",
                      }}
                    >
                      {exercise.sets}
                    </span>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: "10px",
                        color: "#4b5563",
                      }}
                    >
                      SETS
                    </p>
                  </div>
                </div>

                {/* Expanded details */}
                {expandedRows[`card-${exercise._id}`] && (
                  <div className="ex-card-body">
                    {exercise.description && (
                      <div style={{ marginBottom: "10px" }}>
                        <p
                          style={{
                            fontSize: "10px",
                            letterSpacing: "0.1em",
                            color: "#4b5563",
                            textTransform: "uppercase",
                            fontFamily: "'DM Mono', monospace",
                            marginBottom: "4px",
                          }}
                        >
                          Description
                        </p>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "#9ca3af",
                            margin: 0,
                            lineHeight: "1.6",
                          }}
                        >
                          {exercise.description}
                        </p>
                      </div>
                    )}
                    {exercise.detail && (
                      <div style={{ marginBottom: "10px" }}>
                        <p
                          style={{
                            fontSize: "10px",
                            letterSpacing: "0.1em",
                            color: "#4b5563",
                            textTransform: "uppercase",
                            fontFamily: "'DM Mono', monospace",
                            marginBottom: "4px",
                          }}
                        >
                          Details
                        </p>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "#9ca3af",
                            margin: 0,
                            lineHeight: "1.6",
                          }}
                        >
                          {exercise.detail}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions always visible */}
                <div
                  className="action-row"
                  style={{ display: "flex", gap: "8px", marginTop: "12px" }}
                >
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(exercise?._id)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      background: "#00ff57",
                      border: "none",
                      borderRadius: "8px",
                      padding: "9px",
                      color: "black",
                      fontWeight: 700,
                      fontSize: "13px",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "background 0.15s",
                    }}
                  >
                    <Pencil size={13} strokeWidth={2.5} /> Edit
                  </button>
                  <button
                    className="del-btn"
                    onClick={() => setDeleteId(exercise?._id)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      background: "#1e2d22",
                      border: "1px solid #ef444430",
                      borderRadius: "8px",
                      padding: "9px",
                      color: "#ef4444",
                      fontWeight: 600,
                      fontSize: "13px",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                  >
                    <Trash2 size={13} strokeWidth={2.5} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "#111811",
              border: "1px solid #2d1e1e",
              borderRadius: "16px",
              padding: "28px",
              width: "100%",
              maxWidth: "380px",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚠️</div>
            <h3
              style={{ margin: "0 0 8px", fontWeight: 700, fontSize: "18px" }}
            >
              Delete Exercise?
            </h3>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              This will permanently delete{" "}
              <span style={{ color: "white", fontWeight: 600 }}>
                {exercises.find((e) => e._id === deleteId)?.title}
              </span>
              . This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="modal-cancel"
                onClick={() => setDeleteId(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#1e2d22",
                  border: "none",
                  color: "#9ca3af",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "background 0.15s",
                }}
              >
                Cancel
              </button>
              <button
                className="modal-delete"
                onClick={() => handleDelete(deleteId)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#ef4444",
                  border: "none",
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "13px",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "background 0.15s",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseManagement;
