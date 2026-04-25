import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeFile, analyzeUrl, getOriginals } from "../api";
import { useApp } from "../context/AppContext";
import { usePolling } from "../hooks/usePolling";

const SPORTS = ["Cricket", "Football", "Basketball", "Tennis", "Baseball", "Other"];

// ─── SHARED PRIMITIVES ────────────────────────────────────────
const LABEL  = "block text-[11px] font-semibold text-[#4C5C68] uppercase tracking-[0.06em] mb-1.5";
const INPUT  = "w-full bg-[#DCDCDD] border border-[#C5C3C6] rounded-md px-3 py-[9px] font-sans text-[13px] text-[#46494C] outline-none transition-colors duration-150 focus:border-[#1985A1] disabled:opacity-50 disabled:cursor-not-allowed";
const SELECT = "w-full bg-[#DCDCDD] border border-[#C5C3C6] rounded-md px-3 py-[9px] font-sans text-[13px] text-[#46494C] outline-none cursor-pointer appearance-none transition-colors duration-150 focus:border-[#1985A1] disabled:opacity-50";
const CARD   = "bg-[#F8F8F9] border border-[#C5C3C6] rounded-lg p-5";
const SLABEL = "font-mono text-[9px] font-extrabold tracking-[0.12em] uppercase text-[#4C5C68] mb-2.5";
const CHEVRON_BG = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%234C5C68' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: "32px",
};

export default function Upload() {
  const { state, setUsername, setUploadState, setUploadError, setActiveJob } = useApp();
  const navigate  = useNavigate();

  const [mode,       setMode]       = useState("file");
  const [file,       setFile]       = useState(null);
  const [videoUrl,   setVideoUrl]   = useState("");
  const [originalId, setOriginalId] = useState("");
  const [sport,      setSport]      = useState("Cricket");
  const [notes,      setNotes]      = useState("");
  const [localUser,  setLocalUser]  = useState(state.username || "");
  const [dragOver,   setDragOver]   = useState(false);
  const [originals,  setOriginals]  = useState([]);
  const [jobId,      setJobId]      = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    getOriginals().then(setOriginals).catch(() => setOriginals([]));
  }, []);

  usePolling(jobId);

  useEffect(() => {
    if (state.uploadState === "done" && state.activeJob?.job_id) {
      navigate(`/results/${state.activeJob.job_id}`);
    }
  }, [state.uploadState, state.activeJob, navigate]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);
  const onDragOver  = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = () => setDragOver(false);

  const handleSubmit = async () => {
    if (!localUser.trim())                  { setUploadError("Please enter your username."); return; }
    if (mode === "file" && !file)           { setUploadError("Please select a video file."); return; }
    if (mode === "url" && !videoUrl.trim()) { setUploadError("Please enter a URL."); return; }
    if (!originalId)                        { setUploadError("Please select a reference original."); return; }

    setUsername(localUser.trim());
    setUploadState("uploading");
    setUploadError(null);

    try {
      const result = mode === "file"
        ? await analyzeFile({ file, original_id: originalId, notes, username: localUser.trim() })
        : await analyzeUrl({ video_url: videoUrl.trim(), original_id: originalId, notes, source: "manual" });
      setActiveJob(result);
      setJobId(result.job_id);
    } catch (err) {
      setUploadError("Submission failed: " + err.message);
    }
  };

  const isSubmitting = ["uploading", "polling"].includes(state.uploadState);

  return (
    <div className="max-w-[960px]">

      {/* PAGE HEADER */}
      <h1 className="text-[20px] font-semibold text-[#46494C] mb-1">Ingestion Engine</h1>
      <p  className="text-[13px] text-[#4C5C68] mb-7">
        Submit a video asset or stream URL for perceptual fingerprint analysis.
      </p>

      {/* ANALYST IDENTITY */}
      <div className={`${CARD} mb-5`}>
        <div className={SLABEL}>Analyst Identity</div>
        <div className="flex items-center gap-4 mt-2">
          <input
            className={INPUT}
            placeholder="Enter your username"
            value={localUser}
            onChange={e => setLocalUser(e.target.value)}
            disabled={isSubmitting}
          />
          <div className="font-mono text-[11px] font-extrabold text-[#4C5C68] tracking-[0.1em] bg-[#DCDCDD] border border-[#C5C3C6] rounded px-3 py-2 whitespace-nowrap flex-shrink-0 select-none">
            KRIT-{Math.abs(hashStr(localUser || "anon")).toString(16).slice(0, 6).toUpperCase()}
          </div>
        </div>
      </div>

      {/* BODY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4 mb-4">

        {/* LEFT — UPLOAD ZONE */}
        <div className="flex flex-col">

          {/* Mode pill toggle */}
          <div className="flex bg-[#DCDCDD] border border-[#C5C3C6] rounded-md p-[3px] w-fit mb-4">
            {[{ key: "file", label: "Upload File" }, { key: "url", label: "Submit URL" }].map(m => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                disabled={isSubmitting}
                className={`
                  px-5 py-[7px] rounded text-[13px] font-semibold transition-all border-none cursor-pointer select-none
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${mode === m.key
                    ? "bg-[#F8F8F9] text-[#1985A1] shadow-sm"
                    : "bg-transparent text-[#4C5C68] hover:text-[#46494C]"}
                `}
              >
                {m.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === "file" ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
                className="flex-1"
              >
                <div
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onClick={() => !isSubmitting && fileRef.current?.click()}
                  className={`
                    min-h-[280px] rounded-lg border-2 border-dashed
                    flex items-center justify-center
                    transition-all duration-200 select-none
                    ${isSubmitting ? "pointer-events-none opacity-60" : "cursor-pointer"}
                    ${dragOver
                      ? "border-[#1985A1] border-solid bg-[rgba(25,133,161,0.05)]"
                      : file
                        ? "border-[#1985A1] border-solid bg-[#F8F8F9]"
                        : "border-[#C5C3C6] bg-[#F8F8F9] hover:border-[#1985A1] hover:bg-[rgba(25,133,161,0.02)]"
                    }
                  `}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="video/*,.mp4,.ts,.mkv,.m3u8"
                    className="hidden"
                    onChange={e => setFile(e.target.files[0])}
                  />
                  {file ? (
                    <div className="flex flex-col items-center gap-2 text-center px-6">
                      <FileIcon />
                      <p className="font-mono text-[12px] font-extrabold text-[#1985A1] break-all max-w-[260px]">
                        {file.name}
                      </p>
                      <p className="font-mono text-[10px] text-[#4C5C68]">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        onClick={e => { e.stopPropagation(); setFile(null); }}
                        className="mt-1 text-[12px] font-semibold text-[#4C5C68] border border-[#C5C3C6] bg-transparent rounded px-3 py-[5px] hover:bg-[rgba(70,73,76,0.06)] transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-center px-8">
                      <DropIcon />
                      <p className="text-[14px] font-semibold text-[#46494C] max-w-[240px] leading-snug">
                        Drop Video Asset or Raw Stream Manifest
                      </p>
                      <p className="font-mono text-[10px] tracking-[0.1em] text-[#4C5C68]">
                        .mp4 · .ts · .mkv · .m3u8
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="url-input"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
                className="py-4"
              >
                <label className={LABEL}>Suspected stream or video URL</label>
                <input
                  className={INPUT}
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  disabled={isSubmitting}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT — CONFIG PANEL */}
        <div className={CARD}>
          <div className={SLABEL}>Metadata Configuration</div>

          <div className="mb-[18px]">
            <label className={LABEL}>Reference Fingerprint</label>
            <select className={SELECT} style={CHEVRON_BG} value={originalId}
              onChange={e => setOriginalId(e.target.value)} disabled={isSubmitting}>
              <option value="">— Select authorized original —</option>
              {originals.filter(o => o.status === "ready").map(o => (
                <option key={o.original_id} value={o.original_id}>
                  {o.title} ({o.sport})
                </option>
              ))}
            </select>
            {originals.length === 0 && (
              <p className="font-mono text-[10px] text-[#4C5C68] mt-1.5 opacity-70">
                No originals indexed yet — upload one via POST /api/originals
              </p>
            )}
          </div>

          <div className="mb-[18px]">
            <label className={LABEL}>Content Category</label>
            <select className={SELECT} style={CHEVRON_BG} value={sport}
              onChange={e => setSport(e.target.value)} disabled={isSubmitting}>
              {SPORTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className={LABEL}>Notes (optional)</label>
            <textarea
              className={`${INPUT} resize-y`}
              placeholder="Describe where you found this content..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* STATUS BANNER */}
      <AnimatePresence>
        {(state.uploadState !== "idle" || state.uploadError) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`${CARD} mb-4 border-l-[3px] ${state.uploadError ? "border-l-[#C0392B]" : "border-l-[#1985A1]"}`}
          >
            <p className={`font-mono text-[11px] font-extrabold tracking-[0.1em] mb-1.5 ${state.uploadError ? "text-[#C0392B]" : "text-[#1985A1]"}`}>
              {state.uploadError
                ? "⚠ ERROR"
                : state.uploadState === "uploading" ? "⟳ UPLOADING..."
                : state.uploadState === "polling"   ? `⟳ ANALYZING... JOB ${state.activeJob?.job_id || ""}`
                : state.uploadState === "done"      ? "✓ COMPLETE — REDIRECTING"
                : ""}
            </p>
            {state.uploadError && (
              <p className="text-[13px] text-[#C0392B]">{state.uploadError}</p>
            )}
            {state.uploadState === "polling" && state.activeJob && (
              <div className="flex flex-col gap-2 mt-1">
                <p className="font-mono text-[11px] text-[#4C5C68]">
                  Status: <span className="text-[#1985A1] font-extrabold">{state.activeJob.status?.toUpperCase()}</span>
                </p>
                <div className="h-[3px] bg-[#C5C3C6] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#1985A1] rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: state.activeJob.status === "analyzing" ? "66%" : "33%" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                {state.activeJob.matched_frames != null && (
                  <p className="font-mono text-[11px] text-[#4C5C68]">
                    Frames matched: {state.activeJob.matched_frames} / {state.activeJob.total_frames}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUBMIT FOOTER */}
      <div className="pt-2 border-t border-[#C5C3C6]">
        <motion.button
          onClick={handleSubmit}
          disabled={isSubmitting}
          whileHover={!isSubmitting ? { y: -1 } : {}}
          whileTap={!isSubmitting  ? { scale: 0.98 } : {}}
          className={`
            inline-flex items-center gap-2 px-7 py-3 rounded-md
            font-sans text-[14px] font-semibold text-white border-none
            transition-colors duration-150
            ${isSubmitting ? "bg-[#1985A1] opacity-50 cursor-not-allowed" : "bg-[#1985A1] hover:bg-[#146e87] cursor-pointer"}
          `}
        >
          {isSubmitting ? <SpinIcon /> : <ScanIcon />}
          {isSubmitting ? "Processing..." : "Commence Perceptual Scan"}
        </motion.button>
      </div>
    </div>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────
function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  return h;
}

// ─── ICONS ───────────────────────────────────────────────────
function DropIcon() {
  return <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
}
function FileIcon() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>;
}
function ScanIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
}
function SpinIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>;
}