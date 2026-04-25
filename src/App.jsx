import "./index.css";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Landing from "./landing/Landing";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import { RetractingSidebar } from "./components/RetractingSidebar";

function LayoutWrapper({ children }) {
  const location = useLocation();

  const hideSidebar = location.pathname.startsWith("/");

  return (
    <div className="flex">
      {!hideSidebar && <RetractingSidebar />}
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}