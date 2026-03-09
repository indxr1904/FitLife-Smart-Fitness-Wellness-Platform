import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { HiOutlineMenu } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const location = useLocation();

  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Contact", path: "/contact" },
    { name: "Support", path: "/support" },
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#030804] border-b border-[#182219] backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-5 md:px-8">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-bold tracking-tight text-white"
            style={{ fontFamily: "Barlow Condensed, sans-serif" }}
          >
            <span className="text-[#00ff57] italic">Fit</span>Life
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-white font-medium">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative text-sm tracking-wide transition-colors duration-300
                ${
                  location.pathname === item.path
                    ? "text-[#00ff57]"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}

                {/* Neon underline */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-[#00ff57] transition-all duration-300 ${
                    location.pathname === item.path
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Login Button */}
          <Link to="/login" className="hidden md:block">
            <button className="px-6 py-2.5 bg-[#00ff57] text-black font-semibold rounded-md hover:bg-[#00e64d] transition duration-300">
              Login
            </button>
          </Link>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={toggleNavDrawer}>
            <HiOutlineMenu className="h-7 w-7" />
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 right-0 w-3/4 sm:w-1/2 h-full bg-[#030804] border-l border-[#182219] text-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b border-[#182219]">
          <h2 className="text-lg font-semibold">Menu</h2>

          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-400 hover:text-white transition" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={toggleNavDrawer}
              className={`block text-lg transition-colors duration-300 ${
                location.pathname === item.path
                  ? "text-[#00ff57]"
                  : "text-gray-300 hover:text-[#00ff57]"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="p-6 border-t border-[#182219]">
          <Link to="/login" onClick={toggleNavDrawer}>
            <button className="w-full bg-[#00ff57] text-black font-semibold py-3 rounded-md hover:bg-[#00e64d] transition">
              Login
            </button>
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {navDrawerOpen && (
        <div
          onClick={toggleNavDrawer}
          className="fixed inset-0 bg-black/60 z-40"
        />
      )}
    </>
  );
};

export default Navbar;
