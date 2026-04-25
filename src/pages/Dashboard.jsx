import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, Cell,
} from "recharts";
import { useDashboard } from "../hooks/useDashboard";
import { useApp } from "../context/AppContext";

const TT_STYLE = {
  background: "#F8F8F9",
  border: "1px solid #C5C3C6",
  borderRadius: 4,
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 11,
  color: "#46494C",
};

// ─── SHARED PRIMITIVES ───────────────────────────────────────
const CARD   = "bg-[#F8F8F9] border border-[#C5C3C6] rounded-lg p-5";
const SLABEL = "font-mono text-[9px] font-extrabold tracking-[0.12em] uppercase text-[#4C5C68] mb-2.5";

// conf color helper
const confCls = (v) =>
  v > 0.8 ? "text-[#C0392B]" : v > 0.5 ? "text-[#B7620A]" : "text-[#1A8C5C]";

export default function Dashboard() {
  const { state }   = useApp();
  const { refresh } = useDashboard();
  const navigate    = useNavigate();
  const { summary, results, resultsLoading, health } = state;

  // Rolling telemetry history
  const historyRef = useRef([]);
  useEffect(() => {
    if (results.length === 0) return;
    const now   = new Date();
    const label = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    historyRef.current = [
      ...historyRef.current.slice(-19),
      { t: label, pirated: summary.pirated, clean: summary.clean, pending: summary.pending },
    ];
  }, [results, summary]);

  // Confidence distribution buckets
  const confBuckets = React.useMemo(() => {
    const buckets = [
      { range: "0–20%",    count: 0 },
      { range: "20–40%",   count: 0 },
      { range: "40–60%",   count: 0 },
      { range: "60–80%",   count: 0 },
      { range: "80–100%",  count: 0 },
    ];
    results.forEach(r => {
      if (r.confidence == null) return;
      const idx = Math.min(Math.floor(r.confidence * 5), 4);
      buckets[idx].count += 1;
    });
    return buckets;
  }, [results]);

  const recentCompleted = results.filter(r => r.status === "completed").slice(0, 8);
  const scanning        = results.filter(r => r.status === "processing" || r.status === "analyzing");

  return (
    <div>
      {/* ── PAGE HEADER ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[#46494C] mb-1">Command Center</h1>
          <p className="text-[13px] text-[#4C5C68]">Live telemetry — refreshes every 8s</p>
        </div>
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/upload")}
          className="inline-flex items-center gap-1.5 px-[18px] py-[9px] rounded-md bg-[#1985A1] hover:bg-[#146e87] text-white text-[13px] font-semibold border-none cursor-pointer transition-colors duration-150"
        >
          <PlusIcon /> Initiate Manual Scan
        </motion.button>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="TOTAL SCANNED" value={summary.total}   accent="#46494C" />
        <StatCard label="PIRATED"       value={summary.pirated} accent="#C0392B" blink={summary.pirated > 0} />
        <StatCard label="CLEAN"         value={summary.clean}   accent="#1A8C5C" />
        <StatCard label="PENDING"       value={summary.pending} accent="#B7620A" />
      </div>

      {/* ── BENTO GRID ── */}
      <div className="grid gap-3.5"
        style={{ gridTemplateColumns: "repeat(2, 1fr)", gridTemplateRows: "auto auto auto" }}>

        {/* Trend line — col 1 row 1 */}
        <div className={`${CARD}`} style={{ gridColumn: "1", gridRow: "1" }}>
          <div className={SLABEL}>Match Rate — Rolling Window</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={historyRef.current} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#C5C3C6" strokeDasharray="3 3" strokeOpacity={0.4} />
              <XAxis dataKey="t"
                tick={{ fontFamily: "JetBrains Mono", fontSize: 9, fill: "#4C5C68" }}
                interval="preserveStartEnd" />
              <YAxis tick={{ fontFamily: "JetBrains Mono", fontSize: 9, fill: "#4C5C68" }} />
              <Tooltip contentStyle={TT_STYLE} />
              <Line type="monotone" dataKey="pirated" stroke="#C0392B" strokeWidth={1.5} dot={false} name="Pirated" />
              <Line type="monotone" dataKey="clean"   stroke="#1A8C5C" strokeWidth={1.5} dot={false} name="Clean" />
              <Line type="monotone" dataKey="pending" stroke="#B7620A" strokeWidth={1}   dot={false} name="Pending" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Confidence distribution — col 2 row 1 */}
        <div className={CARD} style={{ gridColumn: "2", gridRow: "1" }}>
          <div className={SLABEL}>Confidence Distribution</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={confBuckets} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#C5C3C6" strokeDasharray="3 3" strokeOpacity={0.3} vertical={false} />
              <XAxis dataKey="range" tick={{ fontFamily: "JetBrains Mono", fontSize: 9, fill: "#4C5C68" }} />
              <YAxis tick={{ fontFamily: "JetBrains Mono", fontSize: 9, fill: "#4C5C68" }} allowDecimals={false} />
              <Tooltip contentStyle={TT_STYLE} />
              <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                {confBuckets.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={idx >= 3 ? "#C0392B" : idx >= 2 ? "#B7620A" : "#1985A1"}
                    opacity={0.75}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* System health — col 2 row 2 */}
        <div className={CARD} style={{ gridColumn: "2", gridRow: "2" }}>
          <div className={SLABEL}>System Health</div>
          <div className="flex flex-col gap-2.5 mt-1">
            <HealthRow label="ML Backend"    ok={!!health} />
            <HealthRow label="API Gateway"   ok={!!health} />
            <HealthRow label="Job Queue"     ok={summary.pending < 50} />
            <HealthRow label="Agent Crawler" ok={!!health} />
          </div>
        </div>

        {/* Live telemetry table — full width row 3 */}
        <div className={CARD} style={{ gridColumn: "1 / -1", gridRow: "3" }}>
          <div className={SLABEL}>Active Threat Telemetry</div>

          {resultsLoading && results.length === 0 ? (
            <div className="flex items-center justify-center py-8 font-mono text-[12px] tracking-[0.1em] text-[#4C5C68]">
              [ AWAITING TELEMETRY DATA ]
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-mono text-[11.5px]">
                <thead>
                  <tr className="border-b border-[#C5C3C6]">
                    {["TIME", "TARGET", "CONFIDENCE", "VISUAL", "AUDIO", "STATUS"].map(h => (
                      <th key={h} className="text-left px-3 py-1.5 text-[9px] font-extrabold tracking-[0.1em] text-[#4C5C68]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentCompleted.map(r => (
                    <tr
                      key={r.job_id}
                      onClick={() => navigate(`/results/${r.job_id}`)}
                      className="cursor-pointer transition-colors duration-150 hover:bg-[rgba(25,133,161,0.04)] border-b border-[rgba(197,195,198,0.35)]"
                    >
                      <td className="px-3 py-2.5 text-[#46494C]">
                        {r.completed_at ? new Date(r.completed_at).toLocaleTimeString() : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-[#46494C] max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {truncateUrl(r.video_url)}
                      </td>
                      <td className={`px-3 py-2.5 font-extrabold ${confCls(r.confidence)}`}>
                        {r.confidence != null ? (r.confidence * 100).toFixed(1) + "%" : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-[#4C5C68]">
                        {r.scores?.visual != null ? r.scores.visual.toFixed(3) : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-[#4C5C68]">
                        {r.scores?.audio != null ? r.scores.audio.toFixed(3) : "—"}
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge pirated={r.is_pirated} status="completed" />
                      </td>
                    </tr>
                  ))}

                  {scanning.map(r => (
                    <tr
                      key={r.job_id}
                      className="opacity-70 border-b border-[rgba(197,195,198,0.35)]"
                    >
                      <td className="px-3 py-2.5 text-[#4C5C68]">—</td>
                      <td className="px-3 py-2.5 text-[#46494C] max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {truncateUrl(r.video_url)}
                      </td>
                      <td className="px-3 py-2.5 text-[#4C5C68]">—</td>
                      <td className="px-3 py-2.5 text-[#4C5C68]">—</td>
                      <td className="px-3 py-2.5 text-[#4C5C68]">—</td>
                      <td className="px-3 py-2.5">
                        <Badge status="processing" />
                      </td>
                    </tr>
                  ))}

                  {recentCompleted.length === 0 && scanning.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center font-mono text-[12px] tracking-[0.1em] text-[#4C5C68]">
                        [ NO DATA YET — SUBMIT A SCAN TO BEGIN ]
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────
function StatCard({ label, value, accent, blink }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#F8F8F9] border border-[#C5C3C6] rounded-lg p-5"
      style={{ borderTopWidth: "3px", borderTopColor: accent }}
    >
      <p className="font-mono text-[9px] font-extrabold tracking-[0.12em] text-[#4C5C68] mb-2">
        {label}
      </p>
      <p
        className="font-mono text-[32px] font-extrabold leading-none"
        style={{
          color: accent,
          animation: blink ? "blink-val 2s ease-in-out infinite" : "none",
        }}
      >
        {value ?? "—"}
      </p>
      <style>{`@keyframes blink-val { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </motion.div>
  );
}

function HealthRow({ label, ok }) {
  return (
    <div className="flex items-center gap-2.5 text-[12px]">
      <span
        className="w-[7px] h-[7px] rounded-full flex-shrink-0 animate-pulse"
        style={{ background: ok ? "#1A8C5C" : "#B7620A" }}
      />
      <span className="flex-1 text-[#46494C]">{label}</span>
      <span
        className="font-mono text-[10px] font-extrabold tracking-[0.06em]"
        style={{ color: ok ? "#1A8C5C" : "#B7620A" }}
      >
        {ok ? "NOMINAL" : "DEGRADED"}
      </span>
    </div>
  );
}

function Badge({ pirated, status }) {
  if (status === "processing") {
    return (
      <span className="inline-flex items-center font-mono text-[10px] font-extrabold px-[7px] py-[2px] rounded-[3px] tracking-[0.05em] bg-[rgba(25,133,161,0.08)] text-[#1985A1]">
        SCANNING
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center font-mono text-[10px] font-extrabold px-[7px] py-[2px] rounded-[3px] tracking-[0.05em]
      ${pirated
        ? "bg-[rgba(192,57,43,0.08)] text-[#C0392B]"
        : "bg-[rgba(26,140,92,0.08)] text-[#1A8C5C]"
      }`}>
      {pirated ? "PIRATED" : "CLEAN"}
    </span>
  );
}

// ─── HELPERS & ICONS ─────────────────────────────────────────
function truncateUrl(url) {
  if (!url) return "—";
  try {
    const u = new URL(url);
    return u.hostname + u.pathname.slice(0, 24) + (u.pathname.length > 24 ? "…" : "");
  } catch {
    return url.slice(0, 40) + (url.length > 40 ? "…" : "");
  }
}
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5"  y1="12" x2="19" y2="12"/>
    </svg>
  );
}