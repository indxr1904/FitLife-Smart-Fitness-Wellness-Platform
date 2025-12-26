import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./../AdminLayouts/AdminNavbar";
import Footer from "../Footer";

const PrivateLayout = () => {
  return (
    <>
      <AdminNavbar />
      <main className="pt-14 bg-[#0b0f0c]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default PrivateLayout;
