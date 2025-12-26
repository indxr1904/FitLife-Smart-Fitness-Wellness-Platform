import React from "react";
import Navbar from "./Navbar";
import TopBar from "./TopBar";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <TopBar />
      <Navbar />
    </header>
  );
};

export default Header;
