import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  Users,
  Dumbbell,
  Salad,
  ClipboardList,
  TrendingUp,
  Activity,
  ArrowUpRight,
} from "lucide-react";

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#111811",
        border: "1px solid #1e2d22",
        borderRadius: "8px",
        padding: "10px 14px",
      }}
    >
      {label && (
        <p
          style={{
            margin: "0 0 4px",
            fontSize: "11px",
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {label}
        </p>
      )}
      {payload.map((p, i) => (
        <p
          key={i}
          style={{
            margin: "2px 0",
            fontSize: "14px",
            fontWeight: 700,
            color: p.color || "#00ff57",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

// ─── Section Label ────────────────────────────────────────────────────────────
const SectionLabel = ({ children, delay = "0s" }) => (
  <div
    className="fade-up"
    style={{
      animationDelay: delay,
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "16px",
    }}
  >
    <span
      style={{
        fontSize: "11px",
        letterSpacing: "0.15em",
        color: "#4b5563",
        textTransform: "uppercase",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {children}
    </span>
    <div style={{ flex: 1, height: "1px", background: "#1e2d22" }} />
  </div>
);

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d) =>
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  const formatDate = (d) =>
    d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div
      style={{
        background: "#111811",
        border: "1px solid #1e2d22",
        borderRadius: "12px",
        padding: "14px 20px",
        textAlign: "right",
      }}
    >
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "22px",
          fontWeight: 500,
          color: "#00ff57",
        }}
      >
        {formatTime(time)}
        {/* <LiveClock /> */}
      </div>
      <div style={{ fontSize: "11px", color: "#4b5563", marginTop: "4px" }}>
        {formatDate(time)}
        {/* <LiveClock /> */}
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    plans: 0,
    exercises: 0,
    diets: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${API_BASE_URL}/api/admin/dashboard/documents`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.status === 401) {
          toast.error("Session expired");
          navigate("/login");
          return;
        }
        const data = await res.json();
        setStats({
          users: data.user ?? 0,
          plans: data.plan ?? 0,
          exercises: data.exercise ?? 0,
          diets: data.diet ?? 0,
        });
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // const formatTime = (d) =>
  //   d.toLocaleTimeString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //   });
  // const formatDate = (d) =>
  //   d.toLocaleDateString("en-US", {
  //     weekday: "long",
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   });

  // ── Derived chart data from real stats ──────────────────────────────────────
  const statCards = [
    {
      label: "Total Users",
      key: "users",
      icon: Users,
      route: "/admin/usermanagement",
      color: "#00ff57",
    },
    {
      label: "Active Plans",
      key: "plans",
      icon: ClipboardList,
      route: "/admin/planmanagement",
      color: "#00cfff",
    },
    {
      label: "Exercises",
      key: "exercises",
      icon: Dumbbell,
      route: "/admin/exercisemanagement",
      color: "#ff9f43",
    },
    {
      label: "Diet Plans",
      key: "diets",
      icon: Salad,
      route: "/admin/dietmanagement",
      color: "#ff6b9d",
    },
  ];

  const barData = [
    { name: "Users", value: stats.users, fill: "#00ff57" },
    { name: "Plans", value: stats.plans, fill: "#00cfff" },
    { name: "Exercises", value: stats.exercises, fill: "#ff9f43" },
    { name: "Diets", value: stats.diets, fill: "#ff6b9d" },
  ];

  const pieData = [
    { name: "Users", value: stats.users || 1 },
    { name: "Plans", value: stats.plans || 1 },
    { name: "Exercises", value: stats.exercises || 1 },
    { name: "Diets", value: stats.diets || 1 },
  ];
  const PIE_COLORS = ["#00ff57", "#00cfff", "#ff9f43", "#ff6b9d"];

  // Simulated weekly activity trend (proportional to real stats)
  const weeklyLine = useMemo(() => {
    const total =
      stats.users + stats.plans + stats.exercises + stats.diets || 1;
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return weekDays.map((day, i) => ({
      day,
      users: Math.round((stats.users / total) * (30 + i * 4)),
      plans: Math.round((stats.plans / total) * (20 + i * 3)),
      exercises: Math.round((stats.exercises / total) * (40 + i * 2)),
    }));
  }, [stats]);

  // Radial / progress data
  const radialData = [
    { name: "Users", value: Math.min(stats.users * 10, 100), fill: "#00ff57" },
    { name: "Plans", value: Math.min(stats.plans * 10, 100), fill: "#00cfff" },
    {
      name: "Exercises",
      value: Math.min(stats.exercises * 5, 100),
      fill: "#ff9f43",
    },
    { name: "Diets", value: Math.min(stats.diets * 5, 100), fill: "#ff6b9d" },
  ];

  // Recent activity table (simulated from counts)
  const activityTable = [
    {
      type: "User registered",
      entity: "Platform",
      status: "active",
      time: "2m ago",
      color: "#00ff57",
    },
    {
      type: "Plan created",
      entity: "Admin",
      status: "success",
      time: "15m ago",
      color: "#00cfff",
    },
    {
      type: "Exercise added",
      entity: "Admin",
      status: "success",
      time: "1h ago",
      color: "#ff9f43",
    },
    {
      type: "Diet plan added",
      entity: "Admin",
      status: "success",
      time: "2h ago",
      color: "#ff6b9d",
    },
    {
      type: "User enrolled",
      entity: "Platform",
      status: "active",
      time: "3h ago",
      color: "#00ff57",
    },
    {
      type: "Plan updated",
      entity: "Admin",
      status: "pending",
      time: "5h ago",
      color: "#00cfff",
    },
  ];

  const quickActions = [
    {
      label: "Add Exercise",
      icon: "＋",
      route: "/admin/addexercise",
      desc: "Create new exercise entry",
    },
    {
      label: "Create Plan",
      icon: "＋",
      route: "/admin/addplan",
      desc: "Build a new workout plan",
    },
    {
      label: "Add Diet",
      icon: "＋",
      route: "/admin/adddiet",
      desc: "Add nutrition plan",
    },
    {
      label: "Manage Users",
      icon: "⚙",
      route: "/admin/usermanagement",
      desc: "View & edit user accounts",
    },
  ];

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
            Loading dashboard
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
        padding: "28px 20px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .fade-up { animation: fadeUp 0.6s ease forwards; opacity: 0; transform: translateY(12px); }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        .stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; cursor: pointer; }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.5); border-color: #2a3d2a !important; }
        .action-card { transition: transform 0.2s ease, background 0.2s ease; cursor: pointer; }
        .action-card:hover { transform: translateY(-2px); background: #1a2a1a !important; }
        .chart-card { background: #111811; border: 1px solid #1e2d22; border-radius: 14px; padding: 20px; }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        .table-row { transition: background 0.15s ease; border-bottom: 1px solid #1a221a; }
        .table-row:hover { background: #131a13 !important; }
        .table-row:last-child { border-bottom: none; }
        @media (max-width: 768px) {
          .charts-grid { grid-template-columns: 1fr !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* ── HEADER ─────────────────────────────────────────────────────────── */}
        <div
          className="fade-up"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
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
                  width: "8px",
                  height: "8px",
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
                fontSize: "clamp(22px, 4vw, 34px)",
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Welcome back, <span style={{ color: "#00ff57" }}>Admin</span>
            </h1>
            <p style={{ color: "#6b7280", marginTop: "6px", fontSize: "14px" }}>
              Here's your platform overview for today.
            </p>
          </div>
          <div
            style={{
              background: "#111811",
              border: "1px solid #1e2d22",
              borderRadius: "12px",
              padding: "14px 20px",
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "22px",
                fontWeight: 500,
                color: "#00ff57",
              }}
            >
              <LiveClock />
            </div>
            <div
              style={{ fontSize: "11px", color: "#4b5563", marginTop: "4px" }}
            >
              {/* <LiveClock /> */}
            </div>
          </div>
        </div>

        {/* ── STAT CARDS ─────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "14px",
            marginBottom: "32px",
          }}
        >
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="stat-card fade-up"
                onClick={() => navigate(card.route)}
                style={{
                  background: "#111811",
                  border: "1px solid #1e2d22",
                  borderRadius: "14px",
                  padding: "22px",
                  animationDelay: `${i * 0.08}s`,
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
                    height: "2px",
                    background: card.color,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      background: `${card.color}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={18} color={card.color} strokeWidth={2} />
                  </div>
                  <ArrowUpRight size={14} color="#374151" />
                </div>
                <div
                  style={{
                    fontSize: "34px",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: card.color,
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {stats[card.key]}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginTop: "4px",
                    fontWeight: 500,
                  }}
                >
                  {card.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CHARTS ROW 1: Bar + Pie ─────────────────────────────────────────── */}
        <SectionLabel delay="0.2s">Analytics Overview</SectionLabel>
        <div
          className="charts-grid fade-up"
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr",
            gap: "14px",
            marginBottom: "14px",
            animationDelay: "0.25s",
          }}
        >
          {/* Bar Chart */}
          <div className="chart-card">
            <p
              style={{
                margin: "0 0 4px",
                fontSize: "13px",
                fontWeight: 600,
                color: "white",
              }}
            >
              Content Distribution
            </p>
            <p
              style={{ margin: "0 0 20px", fontSize: "11px", color: "#6b7280" }}
            >
              Total entities across all categories
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barCategoryGap="30%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e2d22"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{
                    fill: "#6b7280",
                    fontSize: 11,
                    fontFamily: "'DM Mono'",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fill: "#6b7280",
                    fontSize: 11,
                    fontFamily: "'DM Mono'",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<DarkTooltip />}
                  cursor={{ fill: "#1e2d2240" }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div
            className="chart-card"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <p
              style={{
                margin: "0 0 4px",
                fontSize: "13px",
                fontWeight: 600,
                color: "white",
              }}
            >
              Platform Composition
            </p>
            <p
              style={{ margin: "0 0 12px", fontSize: "11px", color: "#6b7280" }}
            >
              Share of each content type
            </p>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
                marginTop: "8px",
              }}
            >
              {pieData.map((d, i) => (
                <div
                  key={d.name}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "2px",
                      background: PIE_COLORS[i],
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>
                    {d.name}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: PIE_COLORS[i],
                      fontFamily: "'DM Mono', monospace",
                      marginLeft: "auto",
                    }}
                  >
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CHARTS ROW 2: Line + Radial ─────────────────────────────────────── */}
        <div
          className="charts-grid fade-up"
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr",
            gap: "14px",
            marginBottom: "32px",
            animationDelay: "0.35s",
          }}
        >
          {/* Line Chart */}
          <div className="chart-card">
            <p
              style={{
                margin: "0 0 4px",
                fontSize: "13px",
                fontWeight: 600,
                color: "white",
              }}
            >
              Weekly Activity Trend
            </p>
            <p
              style={{ margin: "0 0 20px", fontSize: "11px", color: "#6b7280" }}
            >
              Projected engagement across content types
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weeklyLine}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e2d22"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{
                    fill: "#6b7280",
                    fontSize: 11,
                    fontFamily: "'DM Mono'",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fill: "#6b7280",
                    fontSize: 11,
                    fontFamily: "'DM Mono'",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<DarkTooltip />} />
                <Line
                  type="monotone"
                  dataKey="users"
                  name="Users"
                  stroke="#00ff57"
                  strokeWidth={2}
                  dot={{ fill: "#00ff57", r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="plans"
                  name="Plans"
                  stroke="#00cfff"
                  strokeWidth={2}
                  dot={{ fill: "#00cfff", r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="exercises"
                  name="Exercises"
                  stroke="#ff9f43"
                  strokeWidth={2}
                  dot={{ fill: "#ff9f43", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Radial Bar Chart */}
          <div
            className="chart-card"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <p
              style={{
                margin: "0 0 4px",
                fontSize: "13px",
                fontWeight: 600,
                color: "white",
              }}
            >
              Growth Indicators
            </p>
            <p
              style={{ margin: "0 0 12px", fontSize: "11px", color: "#6b7280" }}
            >
              Relative growth scores per category
            </p>
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height={170}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="90%"
                  data={radialData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={4}
                    background={{ fill: "#1e2d22" }}
                  />
                  <Tooltip content={<DarkTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginTop: "8px",
              }}
            >
              {radialData.map((d) => (
                <div
                  key={d.name}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "2px",
                      background: d.fill,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "#6b7280", flex: 1 }}>
                    {d.name}
                  </span>
                  <div
                    style={{
                      width: "80px",
                      height: "4px",
                      background: "#1e2d22",
                      borderRadius: "999px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${d.value}%`,
                        height: "100%",
                        background: d.fill,
                        borderRadius: "999px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      color: d.fill,
                      fontFamily: "'DM Mono', monospace",
                      minWidth: "30px",
                      textAlign: "right",
                    }}
                  >
                    {d.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW: Activity Table + Quick Actions ───────────────────────── */}
        <SectionLabel delay="0.45s">Activity & Actions</SectionLabel>
        <div
          className="bottom-grid fade-up"
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr",
            gap: "14px",
            marginBottom: "32px",
            animationDelay: "0.5s",
          }}
        >
          {/* Recent Activity Table */}
          <div
            className="chart-card"
            style={{ padding: 0, overflow: "hidden" }}
          >
            <div
              style={{
                padding: "18px 20px 14px",
                borderBottom: "1px solid #1e2d22",
              }}
            >
              <p
                style={{
                  margin: "0 0 2px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "white",
                }}
              >
                Recent Activity
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "#6b7280" }}>
                Latest platform events
              </p>
            </div>
            {/* Table Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                gap: "12px",
                padding: "10px 20px",
                borderBottom: "1px solid #1e2d22",
                background: "#0e150e",
              }}
            >
              {["Event", "Source", "Status", "Time"].map((h) => (
                <span
                  key={h}
                  style={{
                    fontSize: "10px",
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
            {activityTable.map((row, i) => (
              <div
                key={i}
                className="table-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  gap: "12px",
                  padding: "12px 20px",
                  background: "transparent",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: row.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "13px", color: "#e5e7eb" }}>
                    {row.type}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {row.entity}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color:
                      row.status === "active"
                        ? "#00ff57"
                        : row.status === "success"
                          ? "#00cfff"
                          : "#ff9f43",
                    background:
                      row.status === "active"
                        ? "#00ff5718"
                        : row.status === "success"
                          ? "#00cfff18"
                          : "#ff9f4318",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    width: "fit-content",
                  }}
                >
                  {row.status}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#4b5563",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {row.time}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div
              style={{
                background: "#111811",
                border: "1px solid #1e2d22",
                borderRadius: "14px",
                padding: "18px 20px 14px",
                marginBottom: "2px",
              }}
            >
              <p
                style={{
                  margin: "0 0 2px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "white",
                }}
              >
                Quick Actions
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "#6b7280" }}>
                Common admin tasks
              </p>
            </div>
            {quickActions.map((action) => (
              <div
                key={action.label}
                className="action-card"
                onClick={() => navigate(action.route)}
                style={{
                  background: "#111811",
                  border: "1px solid #1e2d22",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "9px",
                    background: "#1e2d22",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    color: "#00ff57",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {action.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>
                    {action.label}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#4b5563",
                      marginTop: "1px",
                    }}
                  >
                    {action.desc}
                  </div>
                </div>
                <ArrowUpRight size={14} color="#374151" />
              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
        <div
          className="fade-up"
          style={{
            animationDelay: "0.6s",
            borderTop: "1px solid #1e2d22",
            paddingTop: "18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: "#374151",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            SYSTEM STATUS <span style={{ color: "#00ff57" }}>● ONLINE</span>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{
                fontSize: "12px",
                color: "#374151",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              <Activity
                size={12}
                style={{
                  display: "inline",
                  marginRight: "4px",
                  verticalAlign: "middle",
                }}
                color="#00ff57"
              />
              {stats.users + stats.plans + stats.exercises + stats.diets} total
              records
            </span>
            <span style={{ fontSize: "12px", color: "#374151" }}>
              Admin Dashboard v2.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
