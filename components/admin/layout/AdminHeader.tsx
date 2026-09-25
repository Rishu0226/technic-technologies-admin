"use client";

import React from "react";
import { Search, Bell, User, Menu } from "lucide-react";

export default function AdminHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="h-16 border-b border-technic-border bg-white sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shrink-0">
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <button
          type="button"
          className="md:hidden p-2 rounded-lg border border-technic-border text-technic-text"
          onClick={onMenu}
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative max-w-md w-full hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-technic-muted" />
          </div>
          <input
            type="search"
            aria-label="Search"
            className="block w-full pl-10 pr-3 py-2 border border-technic-border rounded-xl bg-technic-bg text-technic-text placeholder:text-technic-muted focus:outline-none focus:border-technic-cyan focus:ring-4 focus:ring-technic-cyan/20 sm:text-sm transition-all"
            placeholder="Search anything..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="p-2 rounded-full text-technic-secondary hover:text-technic-cyan-deep hover:bg-technic-cyan-soft transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-technic-orange" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-technic-border">
          <div className="w-8 h-8 rounded-full bg-technic-cyan-soft border border-technic-cyan/30 flex items-center justify-center">
            <User className="w-4 h-4 text-technic-cyan-deep" />
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-technic-text leading-none">Admin</span>
            <span className="text-xs text-technic-muted mt-1">Superuser</span>
          </div>
        </div>
      </div>
    </header>
  );
}
