"use client";

import React from "react";
import { Search, Bell, User } from "lucide-react";

const AdminHeader: React.FC = () => {
  return (
    <header className="h-16 border-b border-white/10 bg-[#0B1221]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 shrink-0">
      <div className="flex-1 flex items-center">
        {/* Search Bar */}
        <div className="relative max-w-md w-full hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl bg-white/5 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-all"
            placeholder="Search anything..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse border border-[#0B1221]"></span>
        </button>

        {/* Profile Dropdown Toggle */}
        <button className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-amber-300 flex items-center justify-center p-0.5">
            <div className="w-full h-full bg-[#0B1221] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-orange-400" />
            </div>
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-white leading-none">Admin</span>
            <span className="text-xs text-slate-500 mt-1">Superuser</span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
