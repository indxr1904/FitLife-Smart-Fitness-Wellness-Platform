import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#0b0b0b] text-white relative">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed md:static h-full top-0 left-0 bg-[#111] p-6 flex flex-col justify-between border-r border-gray-800 transform transition-transform duration-300 ease-in-out 
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-[70%] sm:w-[60%] md:w-[300px] z-50`}
      >
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <button
              className="md:hidden text-gray-400 hover:text-[#00ff57]"
              onClick={() => setIsOpen(false)}
            >
              <X size={28} />
            </button>
          </div>

          <nav className="flex flex-col gap-4 mb-8">
            <Link
              to="/admin/dashboard"
              className="hover:text-[#00ff57] transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>

            <Link
              to="/admin/exercisemanagement"
              className="hover:text-[#00ff57] transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Exercise Management
            </Link>

            <Link
              to="/admin/dietmanagement"
              className="hover:text-[#00ff57] transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Diet Management
            </Link>

            <Link
              to="/admin/planmanagement"
              className="hover:text-[#00ff57] transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Plans & Progress
            </Link>

            <Link
              to="/admin/settings"
              className="hover:text-[#00ff57] transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
          </nav>
        </div>

        <div className="border-t border-gray-700 pt-6 mt-6">
          <button
            onClick={handleLogout}
            className="w-full bg-[#00ff57] text-black py-2 rounded-lg font-semibold hover:bg-[#20e050] transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <header className="md:hidden flex justify-between items-center w-full bg-[#111] p-4 fixed top-0 left-0 z-30 border-b border-gray-800">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
        <button
          className="text-gray-400 hover:text-[#00ff57]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={28} />
        </button>
      </header>

      <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0 overflow-y-auto w-full bg-[#111811]">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
