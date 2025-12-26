import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { HiOutlineMenu } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (!isHomePage) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  return (
    <>
      <nav
        className={`fixed top-[40px] left-0 w-full z-40 transition-all duration-500 ease-in-out ${
          isHomePage
            ? scrolled
              ? "bg-[#0b0f0c]/95 backdrop-blur-md shadow-md"
              : "bg-transparent"
            : "bg-[#0b0f0c] border-b border-gray-800 shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-5 md:px-8">
          {/* Left: Logo */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-bold text-white tracking-tight"
          >
            FitLife
          </Link>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-8 text-white font-medium">
              {["Home", "Features", "Contact", "Support"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className={`transition-colors duration-300 text-base hover:text-[#00ff57] ${
                    location.pathname ===
                    (item === "Home" ? "/" : `/${item.toLowerCase()}`)
                      ? "text-[#00ff57]"
                      : "text-white"
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>

            <Link to="/login" className="hidden md:block">
              <button className="px-5 py-2.5 bg-[#00ff57] text-black font-semibold rounded-md cursor-pointer hover:bg-[#00e64d] transition duration-300">
                Login
              </button>
            </Link>

            <button
              className="md:hidden block text-white"
              onClick={toggleNavDrawer}
            >
              <HiOutlineMenu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed top-0 right-0 w-3/4 sm:w-1/2 h-full bg-[#0b0f0c] text-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-400 hover:text-white transition" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {["Home", "Features", "Contact", "Support"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              onClick={toggleNavDrawer}
              className={`block text-lg transition-colors duration-300 ${
                location.pathname ===
                (item === "Home" ? "/" : `/${item.toLowerCase()}`)
                  ? "text-[#00ff57]"
                  : "text-gray-300 hover:text-[#00ff57]"
              }`}
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="p-6 border-t border-gray-700">
          <Link to="/login" onClick={toggleNavDrawer}>
            <button className="w-full bg-[#00ff57] text-black font-semibold py-3 rounded-md hover:bg-[#00e64d] transition">
              Login
            </button>
          </Link>
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
