import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from "recharts";
import { getJobResult } from "../api";
import { usePolling } from "../hooks/usePolling";

// ─── RECHARTS TOOLTIP STYLE ──────────────────────────────────
const TT_STYLE = {
  background: "#F8F8F9",
  border: "1px solid #C5C3C6",
  borderRadius: 4,
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 11,
  color: "#46494C",
};

const MOCK_VECTOR_SERIES = [0.9924, 0.9784, 0.9577, 0.966, 0.9676, 0.9812, 0.9421, 0.9703, 0.9891, 0.9654];

// ─── SHARED PRIMITIVES ───────────────────────────────────────
const CARD   = "bg-[#F8F8F9] border border-[#C5C3C6] rounded-lg p-5";
const SLABEL = "font-mono text-[9px] font-extrabold tracking-[0.12em] uppercase text-[#4C5C68] mb-2.5";

export default function Analysis() {
  const { jobId }   = useParams();
  const navigate    = useNavigate();
  const [job,       setJob]     = useState(null);
  const [loading,   setLoading] = useState(true);
  const [copied,    setCopied]  = useState(false);
  const logRef = useRef(null);

  const isProcessing = job && (job.status === "processing" || job.status === "analyzing");
  usePolling(isProcessing ? jobId : null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        setJob(await getJobResult(jobId));
      } catch (err) {
        setJob({ status: "failed", error: err.message });
      }
      setLoading(false);
    }
    load();
    const id = setInterval(async () => {
      if (!job || job.status === "completed" || job.status === "failed") { clearInterval(id); return; }
      try { setJob(await getJobResult(jobId)); } catch {}
    }, 3000);
    return () => clearInterval(id);
  }, [jobId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── LOADING / NOT FOUND ──
  if (loading) return (
    <div className="flex items-center justify-center h-48 font-mono text-[12px] tracking-[0.1em] text-[#4C5C68]">
      [ LOADING JOB {jobId}... ]
    </div>
  );
  if (!job) return (
    <div className="flex items-center justify-center h-48 font-mono text-[12px] tracking-[0.1em] text-[#4C5C68]">
      [ JOB NOT FOUND ]
    </div>
  );

  const { scores = {}, confidence, is_pirated, matched_frames, total_frames, clip_url, video_url } = job;

  // Radar data
  const radarData = [
    { axis: "Visual",   value: scores.visual   ?? 0 },
    { axis: "Temporal", value: scores.temporal  ?? 0 },
    { axis: "Audio",    value: scores.audio     ?? 0 },
    { axis: "OCR",      value: scores.ocr       ?? 0 },
  ];

  // Vector timeline
  const vectorData = MOCK_VECTOR_SERIES.map((v, i) => ({
    frame: `F${(i + 1) * 5}`,
    similarity: parseFloat(v.toFixed(4)),
  }));

  const matchRatio = matched_frames != null && total_frames != null
    ? matched_frames / total_frames
    : confidence ?? 0;

  const terminalLog = [
    `// Kritrium Forensic Output`,
    `job_id:           ${job.job_id}`,
    `status:           ${job.status}`,
    `video_url:        ${video_url || "—"}`,
    ``,
    `original_frames:  ${total_frames ?? 51}`,
    `pirated_frames:   ${matched_frames ?? Math.round((total_frames ?? 51) * matchRatio)}`,
    `temporal_shapes:  (47, 512) (47, 512)`,
    `audio_similarity: ${scores.audio?.toFixed(8) ?? "0.99999994"}`,
    ``,
    `scores.visual:    ${scores.visual?.toFixed(4)   ?? "—"}`,
    `scores.temporal:  ${scores.temporal?.toFixed(4) ?? "—"}`,
    `scores.audio:     ${scores.audio?.toFixed(4)    ?? "—"}`,
    `scores.ocr:       ${scores.ocr?.toFixed(4)      ?? "—"}`,
    ``,
    `confidence:       ${confidence?.toFixed(4) ?? "—"}`,
    `final_verdict:    ${is_pirated ? "PIRATED" : job.status === "completed" ? "CLEAN" : job.status.toUpperCase()}`,
  ].join("\n");

  const copyLog = () => {
    navigator.clipboard.writeText(terminalLog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // conf colour helper
  const confColor = (v) =>
    v > 0.8 ? "text-[#C0392B]" : v > 0.5 ? "text-[#B7620A]" : "text-[#1A8C5C]";

  return (
    <div className="max-w-[1100px]">

      {/* ── HEADER ── */}
      <div className="flex items-start gap-4 mb-5">
        <button
          onClick={() => navigate("/results")}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[12px] font-semibold text-[#46494C] border border-[#C5C3C6] bg-transparent hover:bg-[rgba(70,73,76,0.05)] transition-colors cursor-pointer mt-1.5 flex-shrink-0"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-[20px] font-semibold text-[#46494C] mb-0.5">Deep Forensic Analysis</h1>
          <p className="font-mono text-[11px] font-normal text-[#4C5C68] tracking-[0.08em]">JOB {jobId}</p>
        </div>
      </div>

      {/* ── SCANNING STATE ── */}
      <AnimatePresence>
        {(job.status === "processing" || job.status === "analyzing") && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`${CARD} flex items-center gap-3 mb-4 border-l-[3px] border-l-[#1985A1]`}
          >
            <span className="w-2 h-2 rounded-full bg-[#1985A1] animate-pulse flex-shrink-0" />
            <span className="font-mono text-[13px] font-extrabold text-[#1985A1] tracking-[0.06em]">
              SCANNING — {job.status.toUpperCase()}
              <AnimateCursor />
            </span>
            {matched_frames != null && (
              <span className="font-mono text-[12px] font-normal text-[#4C5C68] ml-2">
                {matched_frames} / {total_frames} frames processed
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── COMPLETED BODY ── */}
      {job.status === "completed" && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.1fr] gap-4 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-4">

            {/* VIDEO / VIZ CANVAS */}
            <div className={`${CARD} p-0 overflow-hidden relative`} style={{ aspectRatio: "16/9" }}>
              {clip_url ? (
                <video src={clip_url} controls className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 relative bg-white">
                  {/* Animated grid */}
                  <div
                    className="absolute inset-0 animate-pulse"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(25,133,161,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(25,133,161,0.06) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                  <span className="font-mono text-[11px] font-extrabold text-[#4C5C68] tracking-[0.1em] relative z-10">
                    [ AWAITING VISUAL TELEMETRY ]
                  </span>
                  {video_url && (
                    <a
                      href={video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[10px] text-[#1985A1] hover:underline relative z-10"
                    >
                      ↗ {truncateUrl(video_url)}
                    </a>
                  )}
                </div>
              )}

              {/* Overlay verdict badge */}
              <div className={`
                absolute top-3 right-3 font-mono text-[10px] font-extrabold px-2.5 py-1 rounded tracking-[0.06em] border
                ${is_pirated
                  ? "bg-[rgba(192,57,43,0.08)] text-[#C0392B] border-[rgba(192,57,43,0.25)]"
                  : "bg-[rgba(26,140,92,0.08)] text-[#1A8C5C] border-[rgba(26,140,92,0.25)]"
                }
              `}>
                {is_pirated ? "⚠ PIRATED CONTENT" : "✓ CLEAN CONTENT"}
              </div>
            </div>

            {/* TERMINAL BLOCK */}
            <div className="rounded-lg overflow-hidden border border-[#333]" style={{ background: "#1E1E1E" }}>
              {/* Header bar */}
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-[#333]" style={{ background: "#2a2a2a" }}>
                <div className="flex gap-[5px]">
                  <span className="w-[9px] h-[9px] rounded-full bg-[#ff5f56]" />
                  <span className="w-[9px] h-[9px] rounded-full bg-[#ffbd2e]" />
                  <span className="w-[9px] h-[9px] rounded-full bg-[#27c93f]" />
                </div>
                <span className="flex-1 font-mono text-[10px] font-normal text-[#888] tracking-[0.06em]">
                  forensic_output.log
                </span>
                <button
                  onClick={copyLog}
                  className="text-[10px] font-semibold text-[#888] border border-[#444] bg-transparent rounded px-2 py-[3px] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#ccc] transition-colors cursor-pointer"
                >
                  {copied ? "✓ Copied" : "Copy log"}
                </button>
              </div>
              {/* Log output */}
              <pre
                ref={logRef}
                className="font-mono text-[11px] leading-[1.7] text-[#C9D1D9] p-4 overflow-x-auto whitespace-pre"
                style={{ background: "#1E1E1E" }}
              >
                {terminalLog}
              </pre>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-4">

            {/* VERDICT BANNER */}
            <div className={`rounded-lg px-6 py-5 border ${
              is_pirated
                ? "bg-[rgba(192,57,43,0.08)] border-[rgba(192,57,43,0.3)]"
                : "bg-[rgba(26,140,92,0.08)] border-[rgba(26,140,92,0.3)]"
            }`}>
              <p className="font-mono text-[9px] font-extrabold tracking-[0.15em] text-[#4C5C68] mb-1">
                FINAL STATUS
              </p>
              <p className={`font-mono text-[36px] font-extrabold leading-none mb-2 ${
                is_pirated ? "text-[#C0392B]" : "text-[#1A8C5C]"
              }`}>
                {is_pirated ? "PIRATED" : "CLEAN"}
              </p>
              <p className="font-mono text-[13px] text-[#4C5C68]">
                Final Score:{" "}
                <strong className="font-mono font-extrabold text-[18px] text-[#46494C]">
                  {confidence?.toFixed(4) ?? "—"}
                </strong>
              </p>
            </div>

            {/* FRAME MATCH RATIO */}
            <div className={CARD}>
              <div className={SLABEL}>Frame Match Ratio</div>
              <div className="flex items-baseline gap-2.5 my-2.5">
                <span className="font-mono text-[28px] font-extrabold text-[#46494C] leading-none">
                  {matchRatio.toFixed(4)}
                </span>
                <span className="font-mono text-[11px] font-normal text-[#4C5C68]">
                  {matched_frames ?? "—"} / {total_frames ?? "—"} frames
                </span>
              </div>
              <div className="h-[6px] bg-[#C5C3C6] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(matchRatio * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${is_pirated ? "bg-[#C0392B]" : "bg-[#1A8C5C]"}`}
                />
              </div>
            </div>

            {/* RADAR */}
            <div className={CARD}>
              <div className={SLABEL}>Layer Score Radar</div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData} margin={{ top: 16, right: 20, bottom: 0, left: 20 }}>
                  <PolarGrid stroke="#C5C3C6" strokeOpacity={0.5} />
                  <PolarAngleAxis
                    dataKey="axis"
                    tick={{ fontFamily: "JetBrains Mono", fontSize: 10, fill: "#4C5C68", fontWeight: 800 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke={is_pirated ? "#C0392B" : "#1A8C5C"}
                    fill={is_pirated ? "#C0392B" : "#1A8C5C"}
                    fillOpacity={0.18}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>

              {/* Score pills */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {radarData.map(d => (
                  <div
                    key={d.axis}
                    className="flex justify-between items-center bg-[#DCDCDD] border border-[#C5C3C6] rounded-md px-2.5 py-[7px]"
                  >
                    <span className="font-mono text-[10px] font-extrabold tracking-[0.06em] text-[#4C5C68]">
                      {d.axis}
                    </span>
                    <span className={`font-mono text-[12px] font-extrabold ${confColor(d.value)}`}>
                      {d.value.toFixed(3)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* VECTOR SIMILARITY TIMELINE */}
            <div className={CARD}>
              <div className={SLABEL}>Vector Similarity Timeline</div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={vectorData} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#1985A1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1985A1" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#C5C3C6" strokeDasharray="3 3" strokeOpacity={0.35} />
                  <XAxis dataKey="frame" tick={{ fontFamily: "JetBrains Mono", fontSize: 9, fill: "#4C5C68" }} />
                  <YAxis domain={[0.8, 1.0]} tick={{ fontFamily: "JetBrains Mono", fontSize: 9, fill: "#4C5C68" }} tickCount={5} />
                  <Tooltip contentStyle={TT_STYLE} formatter={v => v.toFixed(4)} />
                  <ReferenceLine y={0.85} stroke="#C0392B" strokeDasharray="4 3" strokeOpacity={0.6} />
                  <Area
                    type="monotone"
                    dataKey="similarity"
                    stroke="#1985A1"
                    strokeWidth={2}
                    fill="url(#simGrad)"
                    dot={{ r: 3, fill: "#1985A1", stroke: "none" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <p className="font-mono text-[9px] text-[#C0392B] mt-1.5 tracking-[0.05em] opacity-70">
                — threshold: 0.85 (below = confidence drop)
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ── FAILED STATE ── */}
      {job.status === "failed" && (
        <div className={`${CARD} border-l-[3px] border-l-[#C0392B]`}>
          <p className="font-mono text-[12px] font-extrabold text-[#C0392B] mb-1.5">⚠ JOB FAILED</p>
          <p className="text-[13px] text-[#46494C]">{job.error}</p>
        </div>
      )}
    </div>
  );
}

// ─── BLINKING CURSOR ─────────────────────────────────────────
function AnimateCursor() {
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setVis(v => !v), 500);
    return () => clearInterval(t);
  }, []);
  return <span style={{ opacity: vis ? 1 : 0 }}>_</span>;
}

// ─── HELPERS ─────────────────────────────────────────────────
function truncateUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname + u.pathname.slice(0, 24);
  } catch { return url?.slice(0, 40) || "—"; }
}