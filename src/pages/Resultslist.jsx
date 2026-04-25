import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getResults } from "../api";

// ─── SHARED PRIMITIVES ───────────────────────────────────────
const CARD   = "bg-[#F8F8F9] border border-[#C5C3C6] rounded-lg";
const SLABEL = "font-mono text-[9px] font-extrabold tracking-[0.12em] uppercase text-[#4C5C68] mb-2.5";

const confCls = (v) =>
  v > 0.8 ? "text-[#C0392B] font-extrabold"
  : v > 0.5 ? "text-[#B7620A] font-extrabold"
  : "text-[#1A8C5C] font-extrabold";

// Tab color map
const TAB_META = {
  all:     { accent: "#46494C", activeBg: "rgba(70,73,76,0.07)",    activeBorder: "#46494C" },
  pirated: { accent: "#C0392B", activeBg: "rgba(192,57,43,0.08)",   activeBorder: "#C0392B" },
  clean:   { accent: "#1A8C5C", activeBg: "rgba(26,140,92,0.08)",   activeBorder: "#1A8C5C" },
  pending: { accent: "#B7620A", activeBg: "rgba(183,98,10,0.08)",   activeBorder: "#B7620A" },
};

export default function ResultsList() {
  const navigate = useNavigate();
  const [data,    setData]   = useState({ summary: {}, results: [] });
  const [filter,  setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const d = await getResults({ limit: 100 });
        setData(d);
      } catch {
        setData({ summary: {}, results: [] });
      }
      setLoading(false);
    }
    load();
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, []);

  const filtered = data.results?.filter(r => {
    if (filter === "all")     return true;
    if (filter === "pirated") return r.is_pirated;
    if (filter === "clean")   return !r.is_pirated && r.status === "completed";
    if (filter === "pending") return r.status !== "completed" && r.status !== "failed";
    return true;
  }) ?? [];

  const tabs = [
    { key: "all",     label: "All",     count: data.summary?.total   || 0 },
    { key: "pirated", label: "Pirated", count: data.summary?.pirated || 0 },
    { key: "clean",   label: "Clean",   count: data.summary?.clean   || 0 },
    { key: "pending", label: "Pending", count: data.summary?.pending || 0 },
  ];

  return (
    <div>
      {/* PAGE HEADER */}
      <h1 className="text-[20px] font-semibold text-[#46494C] mb-1">Forensic Analysis</h1>
      <p  className="text-[13px] text-[#4C5C68] mb-7">
        All scanned jobs — click any row to view full forensic breakdown
      </p>

      {/* SUMMARY FILTER TABS */}
      <div className="flex gap-2.5 mb-5 flex-wrap">
        {tabs.map(tab => {
          const m      = TAB_META[tab.key];
          const active = filter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className="flex flex-col items-center px-5 py-3 rounded-lg border font-sans cursor-pointer transition-all duration-150 min-w-[80px]"
              style={{
                background:   active ? m.activeBg     : "#F8F8F9",
                borderColor:  active ? m.activeBorder : "#C5C3C6",
                borderWidth:  active ? "2px"          : "1px",
              }}
            >
              <span
                className="font-mono text-[22px] font-extrabold leading-none"
                style={{ color: m.accent }}
              >
                {tab.count}
              </span>
              <span className="text-[11px] font-semibold text-[#4C5C68] mt-0.5 tracking-[0.04em]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* TABLE CARD */}
      <div className={`${CARD} overflow-hidden`}>
        {loading && filtered.length === 0 ? (
          <div className="flex items-center justify-center py-12 font-mono text-[12px] tracking-[0.1em] text-[#4C5C68]">
            [ LOADING TELEMETRY... ]
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-12 font-mono text-[12px] tracking-[0.1em] text-[#4C5C68]">
            [ NO RESULTS FOR THIS FILTER ]
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-[11.5px]">
              <thead>
                <tr className="border-b border-[#C5C3C6] bg-[#DCDCDD]">
                  {["JOB ID", "TARGET", "SOURCE", "CONFIDENCE", "VISUAL", "AUDIO", "TEMPORAL", "STATUS", "TIME"].map(h => (
                    <th key={h} className="text-left px-3.5 py-2.5 text-[9px] font-extrabold tracking-[0.1em] text-[#4C5C68] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((r, i) => (
                    <motion.tr
                      key={r.job_id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18, delay: i * 0.025 }}
                      onClick={() => navigate(`/results/${r.job_id}`)}
                      className="cursor-pointer transition-colors duration-150 hover:bg-[rgba(25,133,161,0.04)] border-b border-[rgba(197,195,198,0.3)]"
                    >
                      {/* JOB ID */}
                      <td className="px-3.5 py-2.5 text-[#4C5C68] text-[10.5px]">
                        {r.job_id?.slice(0, 12)}…
                      </td>

                      {/* TARGET */}
                      <td className="px-3.5 py-2.5 text-[#46494C] max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {truncateUrl(r.video_url)}
                      </td>

                      {/* SOURCE */}
                      <td className="px-3.5 py-2.5">
                        <span className="text-[9.5px] font-extrabold tracking-[0.06em] px-[5px] py-[1px] rounded-[3px] bg-[#DCDCDD] border border-[#C5C3C6] text-[#4C5C68]">
                          {r.source || "manual"}
                        </span>
                      </td>

                      {/* CONFIDENCE */}
                      <td className={`px-3.5 py-2.5 ${confCls(r.confidence)}`}>
                        {r.confidence != null ? (r.confidence * 100).toFixed(1) + "%" : "—"}
                      </td>

                      {/* VISUAL */}
                      <td className="px-3.5 py-2.5 text-[#4C5C68]">
                        {r.scores?.visual?.toFixed(3) ?? "—"}
                      </td>

                      {/* AUDIO */}
                      <td className="px-3.5 py-2.5 text-[#4C5C68]">
                        {r.scores?.audio?.toFixed(3) ?? "—"}
                      </td>

                      {/* TEMPORAL */}
                      <td className="px-3.5 py-2.5 text-[#4C5C68]">
                        {r.scores?.temporal?.toFixed(3) ?? "—"}
                      </td>

                      {/* STATUS */}
                      <td className="px-3.5 py-2.5">
                        <StatusBadge r={r} />
                      </td>

                      {/* TIME */}
                      <td className="px-3.5 py-2.5 text-[#4C5C68] text-[10.5px] whitespace-nowrap">
                        {r.completed_at
                          ? new Date(r.completed_at).toLocaleTimeString()
                          : r.created_at
                          ? new Date(r.created_at).toLocaleTimeString()
                          : "—"}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────
function StatusBadge({ r }) {
  const base = "inline-flex items-center font-mono text-[10px] font-extrabold px-[7px] py-[2px] rounded-[3px] tracking-[0.05em]";

  if (r.status === "completed") {
    return (
      <span className={`${base} ${r.is_pirated
        ? "bg-[rgba(192,57,43,0.08)] text-[#C0392B]"
        : "bg-[rgba(26,140,92,0.08)] text-[#1A8C5C]"}`}>
        {r.is_pirated ? "PIRATED" : "CLEAN"}
      </span>
    );
  }
  if (r.status === "failed") {
    return <span className={`${base} bg-[rgba(192,57,43,0.08)] text-[#C0392B]`}>FAILED</span>;
  }
  return (
    <span className={`${base} bg-[rgba(25,133,161,0.08)] text-[#1985A1]`}>
      {r.status?.toUpperCase() || "QUEUED"}
    </span>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────
function truncateUrl(url) {
  if (!url) return "—";
  try {
    const u = new URL(url);
    const p = u.pathname.slice(0, 20);
    return u.hostname + p + (u.pathname.length > 20 ? "…" : "");
  } catch {
    return url.slice(0, 36) + (url.length > 36 ? "…" : "");
  }
}