import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithGooglePopup } from "../firebase";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

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

      const res = await fetch(
        "http://localhost:9000/api/users/google-register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseToken}`,
          },
        }
      );

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
      const res = await axios.post("http://localhost:9000/api/users/signup", {
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
      alert("User already exists. Please login!");
    }
  };

  return (
    <div className="flex justify-center items-center mt-25">
      <div className="w-full flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-[#111811] text-white p-8 rounded-lg border border-gray-700 shadow-sm"
        >
          {/* Header */}
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">FitLife</h2>
          </div>

          <h2 className="text-2xl font-bold text-center mb-6">Hey there!</h2>

          <p className="text-center mb-6 ">
            Enter your details to create your account.
          </p>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border-gray-700 border rounded"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border-gray-700 border rounded"
              placeholder="Enter your email address"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border-gray-700 border rounded"
              placeholder="Create a password"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#00ff57] hover:bg-[#25d660] text-black p-2 rounded-lg font-semibold cursor-pointer transition"
          >
            Register
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <hr className="grow border-gray-300" />
            <span className="px-3 text-gray-500 text-sm">or</span>
            <hr className="grow border-gray-300" />
          </div>

          {/* Google Signup */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center gap-3 border border-gray-700 p-2 rounded-lg hover:bg-gray-700 hover:text-black cursor-pointer transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span className="font-semibold text-white">Signup with Google</span>
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-sm">
            Already have an account?
            <Link to="/login" className="text-[#00ff57] ml-1">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
