import React, { useState } from "react";
import { FiHome, FiMonitor, FiBarChart, FiChevronsRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

export const RetractingSidebar = () => {
  const location = useLocation();
  if (location.pathname === "/") return null;
  return (
    <div className="flex">
      <Sidebar />
    </div>
  );
};

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const selected = location.pathname;

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0"
      style={{
        width: open ? "220px" : "68px",
        background: "#FFFFF3",
        borderRight: "1px solid rgba(3,3,1,0.08)",
        padding: "8px",
      }}
    >
      <TitleSection open={open} />
      <div className="space-y-1">
        {[
          { Icon: FiHome, title: "Home", route: "/" },
          { Icon: FiMonitor, title: "Upload", route: "/upload" },
          { Icon: FiBarChart, title: "Dashboard", route: "/dashboard" },
        ].map(({ Icon, title, route }) => (
          <Option
            key={route}
            Icon={Icon}
            title={title}
            route={route}
            selected={selected}
            open={open}
            navigate={navigate}
          />
        ))}
      </div>
      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option = ({ Icon, title, route, selected, open, navigate }) => {
  const active = selected === route;
  return (
    <motion.button
      layout
      onClick={() => navigate(route)}
      className="flex h-10 w-full items-center rounded-xl transition-all duration-150"
      style={{
        background: active ? "rgba(255,67,101,0.1)" : "transparent",
        color: active ? "#FF4365" : "rgba(3,3,1,0.4)",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "rgba(3,3,1,0.05)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      <div className="grid w-10 place-content-center text-lg">
        <Icon />
      </div>
      {open && (
        <span className="text-sm font-medium">{title}</span>
      )}
    </motion.button>
  );
};

const TitleSection = ({ open }) => (
  <div
    className="mb-3 pb-3"
    style={{ borderBottom: "1px solid rgba(3,3,1,0.08)" }}
  >
    <div className="flex items-center gap-2">
      <Logo />
      {open && (
        <div>
          <span
            className="block text-sm font-black tracking-wider"
            style={{ color: "#030301" }}
          >
            Kritrium
          </span>
          <span
            className="block text-[10px] font-mono tracking-widest uppercase"
            style={{ color: "rgba(3,3,1,0.35)" }}
          >
            Dashboard
          </span>
        </div>
      )}
    </div>
  </div>
);

const Logo = () => (
  <div
    className="grid size-9 place-content-center rounded-lg shrink-0"
    style={{ background: "#FF4365" }}
  >
    <img src="/image.png" alt="logo" className="w-5 h-5 object-contain" />
  </div>
);

const ToggleClose = ({ open, setOpen }) => (
  <motion.button
    layout
    onClick={() => setOpen((p) => !p)}
    className="absolute bottom-0 left-0 right-0 flex items-center p-2 transition-all duration-150"
    style={{
      borderTop: "1px solid rgba(3,3,1,0.08)",
      color: "rgba(3,3,1,0.35)",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(3,3,1,0.04)")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
  >
    <div className="grid size-10 place-content-center text-lg">
      <FiChevronsRight
        className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      />
    </div>
    {open && (
      <span className="text-sm font-medium" style={{ color: "rgba(3,3,1,0.4)" }}>
        Collapse
      </span>
    )}
  </motion.button>
);