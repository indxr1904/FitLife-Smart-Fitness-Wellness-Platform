import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { HiOutlineMenu } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./../../../hooks/useAuth";

const Navbar = () => {
  const { user } = useAuth(); // ✅ single source of truth
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const name = user?.name || user?.displayName || "User";
  const email = user?.email || "No email";
  const photo = user?.photo || user?.photoURL || null;

  const getInitial = (name) =>
    typeof name === "string" && name.length > 0
      ? name.charAt(0).toUpperCase()
      : "?";

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isHomePage
            ? scrolled
              ? "bg-[#0b0f0c]/95 backdrop-blur border-b border-gray-800"
              : "bg-transparent"
            : "bg-[#0b0f0c] border-b border-gray-800"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-5 md:px-8">
          <Link to="/dashboard" className="text-3xl font-bold text-white">
            FitLife
          </Link>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-8">
              {["Dashboard", "Plans", "Nutrition", "Workouts"].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className={`hover:text-[#00ff57] ${
                    location.pathname === `/${item.toLowerCase()}`
                      ? "text-[#00ff57]"
                      : "text-white"
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* DESKTOP PROFILE */}
            <Link to="/profile" className="hidden md:block">
              {photo ? (
                <img
                  src={photo}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className="w-10 h-10 rounded-full border-2 border-[#00ff57]"
                  alt="profile"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#1e2d22] border-2 border-[#00ff57] flex items-center justify-center font-bold">
                  {getInitial(name)}
                </div>
              )}
            </Link>

            <button className="md:hidden" onClick={toggleNavDrawer}>
              <HiOutlineMenu className="w-7 h-7 text-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 right-0 w-3/4 sm:w-1/2 h-full bg-[#0b0f0c] z-50 transform transition-transform ${
          navDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between p-5 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Menu</h2>
          <IoMdClose
            onClick={toggleNavDrawer}
            className="w-6 h-6 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-3 p-5 border-b border-gray-700">
          {photo ? (
            <img
              src={photo}
              className="w-10 h-10 rounded-full border-2 border-[#00ff57]"
              alt="profile"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#1e2d22] border-2 border-[#00ff57] flex items-center justify-center font-bold">
              {getInitial(name)}
            </div>
          )}
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-gray-400">{email}</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {["Dashboard", "Plans", "Nutrition", "Workouts", "Profile"].map(
            (item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                onClick={toggleNavDrawer}
                className="block text-lg hover:text-[#00ff57]"
              >
                {item}
              </Link>
            )
          )}
        </div>
      </div>

      {navDrawerOpen && (
        <div
          onClick={toggleNavDrawer}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}
    </>
  );
};

export default Navbar;
