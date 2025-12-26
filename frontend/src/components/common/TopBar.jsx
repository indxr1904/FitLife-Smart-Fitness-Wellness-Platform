import React from "react";
import { FiInfo } from "react-icons/fi";

const TopBar = () => {
  return (
    <div className="w-full bg-[#0f1f14] text-[#9dffb8] text-xs sm:text-sm py-2.5 px-3 sm:px-4 md:px-8 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 z-50 relative">
      <div className="flex items-center gap-1 sm:gap-2">
        <FiInfo className="text-[#00ff57] text-sm sm:text-base" />
        <span className="font-medium">Demo Login</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-center">
        <span>
          Email:
          <span className="ml-1 font-semibold text-white break-all">
            demo@fitlife.com
          </span>
        </span>

        <span className="hidden sm:inline mx-1">|</span>

        <span>
          Password:
          <span className="ml-1 font-semibold text-white">demo123</span>
        </span>
      </div>
    </div>
  );
};

export default TopBar;
