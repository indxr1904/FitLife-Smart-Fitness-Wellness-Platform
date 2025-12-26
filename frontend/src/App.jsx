import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ExercisePlans from "./pages/ExercisePlans";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

import UserLayout from "./components/common/Layouts/UserLayout";
import AdminLayout from "./components/common/Layouts/AdminLayout";
import Week1 from "./pages/Week1";
import Week2 from "./pages/Week2";
import Nutrition from "./pages/Nutrition";
import Profile from "./pages/Profile";
import WeeklyWorkout from "./pages/WeeklyWorkouts";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminRoute from "./components/common/AdminRoutes/AdminRoute";
import ExerciseManagement from "./pages/Admin/ExerciseManagement";
import AdminLayouts from "./pages/Admin/Layout/AdminLayout";
import EditExercise from "./pages/Admin/EditExercise";
import AddExercise from "./pages/Admin/AddExercise";
import DietManagement from "./pages/Admin/DietManagement";
import AddDiet from "./pages/Admin/AddDiet";
import EditDiet from "./pages/Admin/EditDiet";
import PlanManagement from "./pages/Admin/PlanManagement";
import AddPlan from "./pages/Admin/AddPlan";
import EditPlan from "./pages/Admin/EditPlan";
import SingleExercises from "./pages/SingleExercises";
import Features from "./pages/Features";
import Support from "./pages/Support";
import Contact from "./pages/Contact";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return <div className="text-center py-10 text-white">Loading...</div>;
  return !user ? children : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      {/* ✅ Toasts available everywhere */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
      <Routes>
        <Route element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route
            path="login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="features"
            element={
              <PublicRoute>
                <Features />
              </PublicRoute>
            }
          />
          <Route
            path="support"
            element={
              <PublicRoute>
                <Support />
              </PublicRoute>
            }
          />
          <Route
            path="contact"
            element={
              <PublicRoute>
                <Contact />
              </PublicRoute>
            }
          />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="exercise" element={<ExercisePlans />} />
          <Route path="plans" element={<ExercisePlans />} />
          <Route path="weeklyPlans/:id" element={<WeeklyWorkout />} />
          <Route path="week1" element={<Week1 />} />
          <Route path="week2" element={<Week2 />} />
          <Route path="nutrition" element={<Nutrition />} />
          <Route path="profile" element={<Profile />} />
          <Route path="workouts" element={<SingleExercises />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminLayouts />
              </AdminRoute>
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route
            path="/admin/exercisemanagement"
            element={<ExerciseManagement />}
          />
          <Route path="/admin/editexercise/:id" element={<EditExercise />} />
          <Route path="/admin/addexercise" element={<AddExercise />} />
          <Route path="/admin/dietmanagement" element={<DietManagement />} />
          <Route path="/admin/adddiet" element={<AddDiet />} />
          <Route path="/admin/editdiet/:id" element={<EditDiet />} />
          <Route path="/admin/planmanagement" element={<PlanManagement />} />
          <Route path="/admin/addplan" element={<AddPlan />} />
          <Route path="/admin/editplan/:id" element={<EditPlan />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
