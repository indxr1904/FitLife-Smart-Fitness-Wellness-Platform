import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../api/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/users/all`, {
          headers,
        });
        if (res.status === 401) {
          toast.error("Session expired");
          return;
        }
        const data = await res.json();
        if (data.users) setUsers(data.users);
        else if (Array.isArray(data)) setUsers(data);
        else setUsers([]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const openEdit = (user) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email });
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/users/${editUser._id}`,
        { method: "PUT", headers, body: JSON.stringify(editForm) },
      );
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === editUser._id ? { ...u, ...data } : u)),
        );
        toast.success("User updated successfully");
        setEditUser(null);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        toast.success("User deleted");
        setDeleteConfirm(null);
      } else {
        const data = await res.json();
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?";

  const providerColor = (provider) =>
    provider === "google"
      ? "#4285f4"
      : provider === "local"
        ? "#00ff57"
        : "#9ca3af";

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
            Loading users
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
        .user-row { transition: background 0.15s ease; border-bottom: 1px solid #1a221a; }
        .user-row:hover { background: #131a13 !important; }
        .user-row:last-child { border-bottom: none; }
        .icon-btn { background: none; border: none; cursor: pointer; padding: 6px 10px; border-radius: 6px; font-size: 13px; transition: background 0.15s ease; }
        .icon-btn:hover { background: #1e2d22; }
        .search-input:focus { outline: none; border-color: #00ff57 !important; }
        .modal-input:focus { outline: none; border-color: #00ff57 !important; }
        .save-btn:hover { background: #00e14f !important; }
        .cancel-btn:hover { background: #374151 !important; }

        /* RESPONSIVE */
        .desktop-table { display: block; }
        .mobile-cards  { display: none; }
        @media (max-width: 768px) {
          .desktop-table { display: none; }
          .mobile-cards  { display: block; }
          .header-row { flex-direction: column; align-items: flex-start !important; }
          .search-input { width: 100% !important; }
          .stats-row { display: grid !important; grid-template-columns: 1fr 1fr; }
        }

        /* USER CARD */
        .user-card { background: #111811; border: 1px solid #1e2d22; border-radius: 12px; padding: 16px; margin-bottom: 10px; transition: border-color 0.2s; }
        .user-card:hover { border-color: #2a3d2a; }
        .edit-btn-card { transition: background 0.15s; }
        .edit-btn-card:hover { background: #00e14f !important; }
        .del-btn-card { transition: background 0.15s, border-color 0.15s; }
        .del-btn-card:hover { background: #ef444420 !important; border-color: #ef4444 !important; }
        .modal-cancel:hover { background: #374151 !important; }
        .modal-delete:hover { background: #dc2626 !important; }
      `}</style>

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* HEADER */}
        <div className="fade-up" style={{ marginBottom: "24px" }}>
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
          <div
            className="header-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "clamp(20px, 4vw, 32px)",
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                User <span style={{ color: "#00ff57" }}>Management</span>
              </h1>
              <p
                style={{ color: "#6b7280", marginTop: "4px", fontSize: "14px" }}
              >
                {users.length} total users registered
              </p>
            </div>
            <input
              className="search-input"
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "#111811",
                border: "1px solid #1e2d22",
                borderRadius: "8px",
                padding: "10px 16px",
                color: "white",
                fontSize: "13px",
                width: "260px",
                fontFamily: "'DM Sans', sans-serif",
                transition: "border-color 0.2s ease",
              }}
            />
          </div>
        </div>

        {/* STATS ROW */}
        <div
          className="fade-up stats-row"
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "24px",
            flexWrap: "wrap",
            animationDelay: "0.1s",
          }}
        >
          {[
            { label: "Total", value: users.length, color: "#00ff57" },
            {
              label: "Google",
              value: users.filter((u) => u.provider === "google").length,
              color: "#4285f4",
            },
            {
              label: "Local",
              value: users.filter((u) => u.provider === "local").length,
              color: "#ff9f43",
            },
            {
              label: "Admins",
              value: users.filter((u) => u.isAdmin).length,
              color: "#ff6b9d",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "#111811",
                border: "1px solid #1e2d22",
                borderRadius: "10px",
                padding: "12px 20px",
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flex: "1 1 auto",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: s.color,
                }}
              >
                {s.value}
              </span>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── DESKTOP TABLE (≥768px) ── */}
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
              gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr",
              gap: "16px",
              padding: "14px 24px",
              borderBottom: "1px solid #1e2d22",
              background: "#0e150e",
            }}
          >
            {["User", "Email", "Provider", "Role", "Actions"].map((h) => (
              <span
                key={h}
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  color: "#4b5563",
                  textTransform: "uppercase",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div
              style={{ padding: "48px", textAlign: "center", color: "#4b5563" }}
            >
              No users found.
            </div>
          ) : (
            filtered.map((user, i) => (
              <div
                key={user._id}
                className="user-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr",
                  gap: "16px",
                  padding: "16px 24px",
                  borderBottom:
                    i < filtered.length - 1 ? "1px solid #1a221a" : "none",
                  alignItems: "center",
                  background: "transparent",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid #1e2d22",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#1e2d22",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#00ff57",
                      }}
                    >
                      {getInitials(user.name)}
                    </div>
                  )}
                  <span style={{ fontSize: "14px", fontWeight: 500 }}>
                    {user.name || "—"}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    color: "#9ca3af",
                    fontFamily: "'DM Mono', monospace",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.email}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: providerColor(user.provider),
                    background: `${providerColor(user.provider)}18`,
                    padding: "3px 10px",
                    borderRadius: "999px",
                    textTransform: "capitalize",
                    width: "fit-content",
                  }}
                >
                  {user.provider || "local"}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: user.isAdmin ? "#ff6b9d" : "#6b7280",
                    background: user.isAdmin ? "#ff6b9d18" : "#1e2d22",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    width: "fit-content",
                  }}
                >
                  {user.isAdmin ? "Admin" : "User"}
                </span>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    className="icon-btn"
                    onClick={() => openEdit(user)}
                    style={{ color: "#00ff57" }}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => setDeleteConfirm(user)}
                    style={{ color: "#ef4444" }}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── MOBILE CARDS (<768px) ── */}
        <div
          className="mobile-cards fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                background: "#111811",
                border: "1px solid #1e2d22",
                borderRadius: "14px",
                padding: "48px",
                textAlign: "center",
                color: "#4b5563",
              }}
            >
              No users found.
            </div>
          ) : (
            filtered.map((user) => (
              <div key={user._id} className="user-card">
                {/* Card Header — Avatar + Name + Badges */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid #1e2d22",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: "#1e2d22",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#00ff57",
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "white",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.name || "—"}
                    </p>
                    <p
                      style={{
                        margin: "3px 0 0",
                        fontSize: "12px",
                        color: "#6b7280",
                        fontFamily: "'DM Mono', monospace",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.email}
                    </p>
                  </div>
                  {/* Badges */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      flexShrink: 0,
                      alignItems: "flex-end",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: providerColor(user.provider),
                        background: `${providerColor(user.provider)}18`,
                        padding: "2px 8px",
                        borderRadius: "999px",
                        textTransform: "capitalize",
                      }}
                    >
                      {user.provider || "local"}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: user.isAdmin ? "#ff6b9d" : "#6b7280",
                        background: user.isAdmin ? "#ff6b9d18" : "#1e2d22",
                        padding: "2px 8px",
                        borderRadius: "999px",
                      }}
                    >
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <button
                    className="edit-btn-card"
                    onClick={() => openEdit(user)}
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
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="del-btn-card"
                    onClick={() => setDeleteConfirm(user)}
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
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editUser && (
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
              border: "1px solid #1e2d22",
              borderRadius: "16px",
              padding: "28px",
              width: "100%",
              maxWidth: "420px",
            }}
          >
            <h3
              style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "18px" }}
            >
              Edit User
            </h3>
            <p
              style={{
                color: "#6b7280",
                fontSize: "13px",
                marginBottom: "24px",
              }}
            >
              Update user information
            </p>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  letterSpacing: "0.05em",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                NAME
              </label>
              <input
                className="modal-input"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                style={{
                  width: "100%",
                  background: "#0b0f0c",
                  border: "1px solid #1e2d22",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  color: "white",
                  fontSize: "14px",
                  fontFamily: "'DM Sans', sans-serif",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s ease",
                }}
              />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  letterSpacing: "0.05em",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                EMAIL
              </label>
              <input
                className="modal-input"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                style={{
                  width: "100%",
                  background: "#0b0f0c",
                  border: "1px solid #1e2d22",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  color: "white",
                  fontSize: "14px",
                  fontFamily: "'DM Sans', sans-serif",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s ease",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="cancel-btn"
                onClick={() => setEditUser(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#1e2d22",
                  border: "none",
                  color: "#9ca3af",
                  cursor: "pointer",
                  fontSize: "13px",
                  transition: "background 0.15s",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                className="save-btn"
                onClick={handleUpdate}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#00ff57",
                  border: "none",
                  color: "black",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "13px",
                  transition: "background 0.15s",
                  opacity: saving ? 0.7 : 1,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
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
              Delete User?
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
                {deleteConfirm.name}
              </span>
              . This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="modal-cancel"
                onClick={() => setDeleteConfirm(null)}
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
                onClick={() => handleDelete(deleteConfirm._id)}
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

export default UserManagement;
