import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithGooglePopup } from "../firebase";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { API_BASE_URL } from "../../api/api";
import { ToastContainer, toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithGooglePopup();
      const firebaseToken = await result.user.getIdToken();

      const res = await fetch(`${API_BASE_URL}/api/users/google-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseToken}`,
        },
      });

      const data = await res.json();

      if (res.status === 400 || data.message?.includes("already exists")) {
        alert("User already exists. Please login instead.");
        await auth.signOut();
        navigate("/login");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google register error:", error);
      alert("Registration failed");
      await auth.signOut();
      navigate("/login");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/signup`, {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      // alert("User already exists. Please login!");

      // It should instead be reading the server message:
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#030804] text-white flex items-center justify-center px-4">
      <div className="grid lg:grid-cols-2 w-full max-w-6xl bg-[#080f09] border border-[#182219] rounded-xl overflow-hidden shadow-2xl">
        {/* Left Branding Section */}
        <div className="hidden lg:flex flex-col justify-center px-14 bg-gradient-to-br from-[#030804] to-[#08140a]">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Join <span className="text-[#00ff57] italic">FitLife</span>
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed">
            Create your account and unlock powerful workout tracking, AI-powered
            insights, and a supportive fitness community.
          </p>

          <div className="mt-10 text-sm text-gray-500">
            Your journey to smarter fitness starts today.
          </div>
        </div>

        {/* Register Form */}
        <div className="flex flex-col justify-center px-8 py-10 md:px-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-gray-400 text-sm">
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-300 mb-1 block">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
                className="w-full bg-[#030804] border border-[#1c2a1f] rounded-md px-4 py-2.5 focus:outline-none focus:border-[#00ff57] transition"
              />
            </div>

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
                placeholder="Create a password"
                className="w-full bg-[#030804] border border-[#1c2a1f] rounded-md px-4 py-2.5 focus:outline-none focus:border-[#00ff57] transition"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-[#00ff57] hover:bg-[#00e64d] text-black py-2.5 rounded-md font-semibold transition"
            >
              Register
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-[1px] bg-[#182219]" />
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 h-[1px] bg-[#182219]" />
            </div>

            {/* Google Register */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full flex items-center justify-center gap-3 border border-[#1c2a1f] py-2.5 rounded-md hover:border-[#00ff57] transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />

              <span className="text-sm">Signup with Google</span>
            </button>
          </form>

          {/* Login Redirect */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?
            <Link to="/login" className="text-[#00ff57] ml-1 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
