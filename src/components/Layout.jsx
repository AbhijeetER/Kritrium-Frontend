import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const NAV = [
  { path: "/dashboard", label: "Command Center",   icon: <GridIcon /> },
  { path: "/upload",    label: "Ingestion Engine",  icon: <UploadIcon /> },
  { path: "/results",   label: "Forensic Analysis", icon: <ScanIcon /> },
];

export default function Layout({ children }) {
  const { state } = useApp();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const crumbs = location.pathname.split("/").filter(Boolean);

  return (
    <div className={`grid h-screen overflow-hidden ${collapsed ? "[--sidebar-w:60px]" : "[--sidebar-w:220px]"}`}
         style={{ gridTemplateColumns: collapsed ? "60px 1fr" : "220px 1fr" }}>

      {/* SIDEBAR */}
      <aside className="bg-surface border-r border-border flex flex-col overflow-hidden relative z-10">

        {/* Logo */}
        <div
          onClick={() => setCollapsed(c => !c)}
          className="flex items-center gap-2.5 px-4 h-[52px] border-b border-border cursor-pointer select-none"
        >
          <OwlIcon />
          {!collapsed && (
            <span className="font-sans font-semibold text-[13px] tracking-[0.18em] text-iron whitespace-nowrap">
              KRITRIUM
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 flex flex-col gap-0.5">
          {NAV.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-[9px] text-[13px] border-l-2 transition-all whitespace-nowrap overflow-hidden
                 ${isActive
                   ? "border-cyan bg-cyan/[0.08] text-cyan font-semibold"
                   : "border-transparent text-slate hover:bg-iron/5 hover:text-iron font-normal"
                 }`
              }
            >
              <span className="flex-shrink-0 flex">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-[26px] h-[26px] rounded-full bg-cyan/[0.08] border border-cyan text-cyan text-[11px] font-semibold flex items-center justify-center flex-shrink-0">
                {state.username ? state.username[0].toUpperCase() : "?"}
              </div>
              <span className="text-[12px] text-slate truncate">{state.username || "anonymous"}</span>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex flex-col overflow-hidden h-screen">

        {/* Topbar */}
        <header className="h-[52px] border-b border-border bg-surface flex items-center px-6 gap-4 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-[12px] whitespace-nowrap">
            <span className="text-slate">Kritrium</span>
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                <span className="text-border">/</span>
                <span className="text-iron font-semibold">{c.charAt(0).toUpperCase() + c.slice(1)}</span>
              </React.Fragment>
            ))}
          </div>

          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 bg-bg border border-border rounded-md px-3 py-1.5 w-full max-w-[400px]">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search jobs, URLs, originals..."
                className="bg-transparent border-none outline-none font-sans text-[13px] text-iron flex-1 min-w-0 placeholder:text-border"
              />
              <kbd className="bg-surface border border-border rounded-[3px] font-mono text-[10px] px-[5px] py-px text-slate">
                /
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-3 whitespace-nowrap">
            <div className={`flex items-center gap-1.5 text-[11.5px] font-mono ${state.health ? "text-green" : "text-amber"}`}>
              <span className="w-[7px] h-[7px] rounded-full bg-current animate-pulse" />
              <span>{state.health ? "ML Hub: Connected" : "ML Hub: Checking"}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-7 scrollbar-thin scrollbar-color-[var(--border)]">
          {children}
        </main>
      </div>
    </div>
  );
}

