import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { signInWithGooglePopup } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../firebase";
import { API_BASE_URL } from "../../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGooglePopup();
      const firebaseToken = await result.user.getIdToken();

      const res = await fetch(`${API_BASE_URL}/api/users/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseToken}`,
        },
      });

      const data = await res.json();

      if (!data.user) {
        alert("Google login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);

      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await auth.signOut();

    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);

      if (res.data.user.isAdmin) navigate("/admin/dashboard");
      else navigate("/dashboard");
    } catch (error) {
      console.error("Login error", error.response?.data);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#030804] text-white flex items-center justify-center px-4">
      <div className="grid lg:grid-cols-2 w-full max-w-6xl bg-[#080f09] border border-[#182219] rounded-xl overflow-hidden shadow-2xl">
        {/* Left Section (Desktop Branding) */}
        <div className="hidden lg:flex flex-col justify-center px-14 bg-gradient-to-br from-[#030804] to-[#08140a]">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Welcome to <span className="text-[#00ff57] italic">FitLife</span>
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed">
            Track workouts, monitor progress, and achieve your goals with
            next-generation AI fitness analytics and performance tracking.
          </p>

          <div className="mt-10 text-sm text-gray-500">
            Smart fitness platform designed for athletes and everyday champions.
          </div>
        </div>

        {/* Right Section (Login Form) */}
        <div className="flex flex-col justify-center px-8 py-10 md:px-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Login</h2>
            <p className="text-gray-400 text-sm">
              Enter your email and password to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm text-gray-300 mb-1 block">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full bg-[#030804] border border-[#1c2a1f] rounded-md px-4 py-2.5 focus:outline-none focus:border-[#00ff57] transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-300 mb-1 block">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full bg-[#030804] border border-[#1c2a1f] rounded-md px-4 py-2.5 focus:outline-none focus:border-[#00ff57] transition"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#00ff57] hover:bg-[#00e64d] text-black py-2.5 rounded-md font-semibold transition"
            >
              Login
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-[1px] bg-[#182219]" />
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 h-[1px] bg-[#182219]" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-[#1c2a1f] py-2.5 rounded-md hover:border-[#00ff57] transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />

              <span className="text-sm">Login with Google</span>
            </button>
          </form>

          {/* Register */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?
            <Link
              to="/register"
              className="text-[#00ff57] ml-1 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
