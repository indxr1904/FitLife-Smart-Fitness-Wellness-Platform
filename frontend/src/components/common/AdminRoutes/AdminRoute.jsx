import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./../../../hooks/useAuth";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading)
    return <div className="text-center py-10 text-white">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
