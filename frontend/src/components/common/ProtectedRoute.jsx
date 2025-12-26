import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const ProtectedRoute = ({ children }) => {
  const { user, loading, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || isTokenExpired())) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null); // ✅ SAFE inside useEffect
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate, setUser]);

  if (loading) {
    return <div className="text-center py-10 text-white">Loading...</div>;
  }

  if (!user || isTokenExpired()) {
    return null; // ⛔ block render while redirect happens
  }

  // Admin protection
  if (user.isAdmin && !location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // User protection
  if (!user.isAdmin && location.pathname.startsWith("/admin")) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
