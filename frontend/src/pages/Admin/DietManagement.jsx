import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Salad,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../api/api";

const DietManagement = () => {
  const navigate = useNavigate();
  const [diets, setDiets] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/diet`);
        const result = await res.json();
        setDiets(result?.data || []);
      } catch (error) {
        console.error(error, "Server Error");
        toast.error("Failed to load diets");
      } finally {
        setLoading(false);
      }
    };
    fetchDiets();
  }, []);

  const toggleExpand = (id) =>
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleEdit = (id) => navigate(`/admin/editdiet/${id}`);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/diet/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.status === "success") {
        setDiets((prev) => prev.filter((item) => item._id !== id));
        toast.success("Diet deleted successfully");
        setDeleteId(null);
      } else {
        toast.error(result.message || "Failed to delete");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleAddDiet = (e) => {
    e.preventDefault();
    navigate("/admin/adddiet");
  };

  const purposeColor = (purpose) => {
    const p = purpose?.toLowerCase();
    if (p?.includes("weight loss") || p?.includes("cut"))
      return { color: "#ff6b9d", bg: "#ff6b9d18" };
    if (p?.includes("muscle") || p?.includes("bulk"))
      return { color: "#00cfff", bg: "#00cfff18" };
    if (p?.includes("maintain")) return { color: "#ff9f43", bg: "#ff9f4318" };
    return { color: "#00ff57", bg: "#00ff5718" };
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
            Loading diets
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

        /* TABLET & MOBILE */
        @media (max-width: 1024px) {
          .desktop-table { display: none; }
          .mobile-cards { display: block; }
        }

        /* CARD STYLES */
        .diet-card { background: #111811; border: 1px solid #1e2d22; border-radius: 12px; padding: 16px; margin-bottom: 12px; transition: border-color 0.2s ease; }
        .diet-card:hover { border-color: #2a3d2a; }
        .diet-card-body { margin-top: 14px; padding-top: 14px; border-top: 1px solid #1a221a; }

        /* DESKTOP ROW */
        .diet-row { transition: background 0.15s ease; border-bottom: 1px solid #1a221a; }
        .diet-row:hover { background: #111f11 !important; }
        .diet-row:last-child { border-bottom: none; }

        .modal-cancel:hover { background: #374151 !important; }
        .modal-delete:hover { background: #dc2626 !important; }
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
              Diet <span style={{ color: "#00ff57" }}>Management</span>
            </h1>
            <p style={{ color: "#6b7280", marginTop: "4px", fontSize: "14px" }}>
              {diets.length} diet plan{diets.length !== 1 ? "s" : ""} in library
            </p>
          </div>
          <button
            className="add-btn"
            onClick={handleAddDiet}
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
            Add Diet
          </button>
        </div>

        {/* STAT CHIPS */}
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
            <Salad size={14} color="#00ff57" />
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "14px",
                fontWeight: 700,
                color: "#00ff57",
              }}
            >
              {diets.length}
            </span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              Total Diets
            </span>
          </div>
          {["weight loss", "muscle", "maintain"].map((tag) => {
            const count = diets.filter((d) =>
              d.purpose?.toLowerCase().includes(tag),
            ).length;
            const { color } = purposeColor(tag);
            return count > 0 ? (
              <div
                key={tag}
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
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "14px",
                    fontWeight: 700,
                    color,
                  }}
                >
                  {count}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    textTransform: "capitalize",
                  }}
                >
                  {tag}
                </span>
              </div>
            ) : null;
          })}
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
              gridTemplateColumns: "1.8fr 0.8fr 0.8fr 0.7fr 0.7fr 1.5fr 1.2fr",
              gap: "12px",
              padding: "13px 24px",
              borderBottom: "1px solid #1e2d22",
              background: "#0e150e",
            }}
          >
            {[
              "Items",
              "Calories",
              "Protein",
              "Carbs",
              "Fats",
              "Purpose",
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

          {diets.length === 0 ? (
            <div
              style={{ padding: "60px", textAlign: "center", color: "#4b5563" }}
            >
              <Salad
                size={32}
                color="#1e2d22"
                style={{ margin: "0 auto 12px" }}
              />
              <p style={{ margin: 0, fontSize: "14px" }}>
                No diets found. Add your first one.
              </p>
            </div>
          ) : (
            diets.map((diet, index) => {
              const { color: pColor, bg: pBg } = purposeColor(diet.purpose);
              return (
                <div
                  key={index}
                  className="diet-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1.8fr 0.8fr 0.8fr 0.7fr 0.7fr 1.5fr 1.2fr",
                    gap: "12px",
                    padding: "16px 24px",
                    alignItems: "start",
                    background: "transparent",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
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
                      <Salad size={14} color="#00ff57" />
                    </div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "white",
                      }}
                    >
                      {Array.isArray(diet.items)
                        ? diet.items.join(", ")
                        : diet.items}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#ff9f43",
                      }}
                    >
                      {diet.calories}
                    </span>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: "10px",
                        color: "#4b5563",
                      }}
                    >
                      kcal
                    </p>
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#00cfff",
                      }}
                    >
                      {diet.protein}
                    </span>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: "10px",
                        color: "#4b5563",
                      }}
                    >
                      protein
                    </p>
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#00ff57",
                      }}
                    >
                      {diet.carbs}
                    </span>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: "10px",
                        color: "#4b5563",
                      }}
                    >
                      carbs
                    </p>
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#ff6b9d",
                      }}
                    >
                      {diet.fats}
                    </span>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: "10px",
                        color: "#4b5563",
                      }}
                    >
                      fats
                    </p>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: pColor,
                        background: pBg,
                        padding: "3px 10px",
                        borderRadius: "999px",
                        display: "inline-block",
                        textTransform: "capitalize",
                      }}
                    >
                      {diet.purpose}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(diet?._id)}
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
                      onClick={() => setDeleteId(diet?._id)}
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
              );
            })
          )}
        </div>

        {/* ── MOBILE / TABLET CARDS (<1024px) ── */}
        <div
          className="mobile-cards fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          {diets.length === 0 ? (
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
              <Salad
                size={32}
                color="#1e2d22"
                style={{ margin: "0 auto 12px" }}
              />
              <p style={{ margin: 0, fontSize: "14px" }}>
                No diets found. Add your first one.
              </p>
            </div>
          ) : (
            diets.map((diet, index) => {
              const { color: pColor, bg: pBg } = purposeColor(diet.purpose);
              const isOpen = expandedRows[`card-${diet._id}`];
              return (
                <div key={index} className="diet-card">
                  {/* Card Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
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
                        <Salad size={16} color="#00ff57" />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "white",
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {Array.isArray(diet.items)
                            ? diet.items.join(", ")
                            : diet.items}
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            color: pColor,
                            background: pBg,
                            padding: "2px 8px",
                            borderRadius: "999px",
                            textTransform: "capitalize",
                            marginTop: "4px",
                            display: "inline-block",
                          }}
                        >
                          {diet.purpose}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleExpand(`card-${diet._id}`)}
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
                      {isOpen ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>

                  {/* Macro Stats — always visible */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr 1fr",
                      gap: "8px",
                      marginTop: "12px",
                    }}
                  >
                    {[
                      { label: "KCAL", value: diet.calories, color: "#ff9f43" },
                      {
                        label: "PROTEIN",
                        value: diet.protein,
                        color: "#00cfff",
                      },
                      { label: "CARBS", value: diet.carbs, color: "#00ff57" },
                      { label: "FATS", value: diet.fats, color: "#ff6b9d" },
                    ].map((macro) => (
                      <div
                        key={macro.label}
                        style={{
                          background: "#0e150e",
                          borderRadius: "7px",
                          padding: "7px 6px",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "14px",
                            fontWeight: 700,
                            color: macro.color,
                          }}
                        >
                          {macro.value}
                        </span>
                        <p
                          style={{
                            margin: "2px 0 0",
                            fontSize: "9px",
                            color: "#4b5563",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {macro.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Expanded details */}
                  {isOpen && (
                    <div className="diet-card-body">
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "10px",
                          marginBottom: "4px",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontSize: "10px",
                              letterSpacing: "0.1em",
                              color: "#4b5563",
                              textTransform: "uppercase",
                              fontFamily: "'DM Mono', monospace",
                              margin: "0 0 4px",
                            }}
                          >
                            Purpose
                          </p>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 600,
                              color: pColor,
                              background: pBg,
                              padding: "3px 10px",
                              borderRadius: "999px",
                              textTransform: "capitalize",
                            }}
                          >
                            {diet.purpose}
                          </span>
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: "10px",
                              letterSpacing: "0.1em",
                              color: "#4b5563",
                              textTransform: "uppercase",
                              fontFamily: "'DM Mono', monospace",
                              margin: "0 0 4px",
                            }}
                          >
                            Calories
                          </p>
                          <span
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "14px",
                              fontWeight: 700,
                              color: "#ff9f43",
                            }}
                          >
                            {diet.calories} kcal
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions — always visible */}
                  <div
                    style={{ display: "flex", gap: "8px", marginTop: "12px" }}
                  >
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(diet?._id)}
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
                      onClick={() => setDeleteId(diet?._id)}
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
              );
            })
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
              Delete Diet?
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
                {Array.isArray(diets.find((d) => d._id === deleteId)?.items)
                  ? diets.find((d) => d._id === deleteId)?.items[0]
                  : diets.find((d) => d._id === deleteId)?.items}
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

export default DietManagement;
