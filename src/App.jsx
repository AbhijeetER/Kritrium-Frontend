import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

// Landing
import Landing from "./landing/Landing";

// Dashboard shell
import Layout from "./components/layout/Layout";

// Pages
import Dashboard  from "./pages/Dashboard";
import Upload     from "./pages/Upload";
import ResultsList from "./pages/ResultsList";
import Analysis   from "./pages/Analysis";

// Global styles (Tailwind base + JetBrains Mono font import)
import "./index.css";

// ─── inner router: decides whether to wrap in Layout ────────
function AppRoutes() {
  const location = useLocation();

  // Landing page gets NO sidebar/topbar shell
  const isLanding = location.pathname === "/";

  if (isLanding) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/dashboard"          element={<Dashboard />} />
        <Route path="/upload"             element={<Upload />} />
        <Route path="/results"            element={<ResultsList />} />
        <Route path="/results/:jobId"     element={<Analysis />} />
        {/* catch-all → dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}