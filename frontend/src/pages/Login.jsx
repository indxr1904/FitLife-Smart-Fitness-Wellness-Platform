import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { signInWithGooglePopup } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGooglePopup();
      const firebaseToken = await result.user.getIdToken();

      const res = await fetch("http://localhost:9000/api/users/google-login", {
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
      const res = await axios.post("http://localhost:9000/api/users/login", {
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
    <div className="flex justify-center items-center mt-25 ">
      <div className="w-full md:w-1/1  flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-[#111811] text-white p-8 rounded-lg border border-gray-700 shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">FitLife</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Hey there!</h2>
          <p className="text-center mb-6">
            Enter your username and password to Login.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border-gray-700 border rounded"
              placeholder="Enter your email address"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border-gray-700 border rounded"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#00ff57] hover:bg-[#25d660] text-black p-2 rounded-lg font-semibold cursor-pointer transition"
          >
            Login
          </button>

          <div className="my-6 flex items-center">
            <hr className="grow border-gray-300" />
            <span className="px-3 text-gray-500 text-sm">or</span>
            <hr className="grow border-gray-300" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-700 p-2 rounded-lg hover:bg-gray-700 hover:text-black cursor-pointer transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span className="font-semibold text-white">Login with Google</span>
          </button>

          <p className="mt-6 text-center text-sm">
            Don't have an account?
            <Link to="/register" className="text-[#00ff57] ml-1">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
