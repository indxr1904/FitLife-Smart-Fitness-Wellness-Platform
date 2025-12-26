import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { updateProfile, updateEmail } from "firebase/auth";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ FIX: Handle Firebase async user + localStorage fallback
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      const localUser = JSON.parse(localStorage.getItem("user"));

      setFormData({
        name: firebaseUser?.displayName || localUser?.name || "",
        email: firebaseUser?.email || localUser?.email || "",
        photoURL: firebaseUser?.photoURL || localUser?.photoURL || "",
      });
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      // Update display name
      if (user.displayName !== formData.name) {
        await updateProfile(user, {
          displayName: formData.name,
        });
      }

      // Update email if changed
      if (user.email !== formData.email) {
        await updateEmail(user, formData.email);
      }

      // ✅ Store normalized user in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        })
      );

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.clear();

      toast.success("Logged out successfully");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const getInitialLetter = () =>
    formData.name ? formData.name.charAt(0).toUpperCase() : "P";

  return (
    <div className="min-h-screen bg-[#0b0f0c] text-white px-4 md:px-8 pt-28 pb-12">
      <div className="max-w-3xl mx-auto bg-[#111] border border-gray-800 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>

        {/* Avatar */}
        <div className="flex justify-center mb-8">
          {formData.photoURL ? (
            <img
              src={formData.photoURL}
              alt="Profile"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              className="w-28 h-28 rounded-full object-cover border-4 border-[#1f2937]"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-[#1a2e1a] flex items-center justify-center text-4xl font-bold text-green-400 border-4 border-[#1f2937]">
              {getInitialLetter()}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#0b0f0c] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:border-green-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#0b0f0c] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:border-green-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a2e1a] hover:bg-[#2c4a2c] transition py-2.5 rounded-md font-medium"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Logout */}
      <div className="max-w-3xl mx-auto mt-8">
        <div className="bg-[#1a0f0f] border border-red-900 rounded-xl p-6">
          <h3 className="text-red-400 font-semibold mb-2">Logout</h3>
          <p className="text-gray-400 text-sm mb-4">
            You will be logged out from this session.
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 transition py-2.5 rounded-md font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
