import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: "96%", label: "Detection Confidence" },
  { value: "< 2s", label: "Analysis Latency" },
  { value: "60fps", label: "Frame Sampling Rate" },
  { value: "4-layer", label: "Scoring Model" },
];

const pillars = [
  {
    number: "01",
    title: "Visual Fingerprinting",
    body: "Every frame is hashed into a perceptual embedding. Even re-encoded, cropped, or color-shifted copies can't escape the model.",
  },
  {
    number: "02",
    title: "Temporal Coherence",
    body: "We analyze motion patterns across time — not just individual frames. Sequence-level matching catches what single-frame methods miss.",
  },
  {
    number: "03",
    title: "Audio DNA",
    body: "Spectral fingerprints of the audio track are cross-referenced against the original. Dubbed or silent clips are still matched on visuals.",
  },
  {
    number: "04",
    title: "OCR Layer",
    body: "On-screen text, watermarks, and branding in the clip are extracted and scored independently — adding a final layer of verification.",
  },
];

function StatCard({ value, label, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex flex-col items-center text-center p-6 rounded-2xl"
      style={{
        background: "rgba(3,3,1,0.04)",
        border: "1px solid rgba(3,3,1,0.08)",
      }}
    >
      <span
        className="font-mono font-black text-4xl md:text-5xl tracking-tight leading-none"
        style={{ color: "#FF4365" }}
      >
        {value}
      </span>
      <span
        className="mt-2 text-xs font-medium tracking-widest uppercase"
        style={{ color: "rgba(3,3,1,0.45)" }}
      >
        {label}
      </span>
    </motion.div>
  );
}

function PillarCard({ number, title, body, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      className="group p-6 rounded-2xl transition-all duration-300 cursor-default"
      style={{
        background: "#FFFFF3",
        border: "1px solid rgba(3,3,1,0.1)",
      }}
      whileHover={{
        borderColor: "rgba(0,217,192,0.4)",
        boxShadow: "0 0 0 1px rgba(0,217,192,0.2), 0 8px 32px rgba(0,217,192,0.08)",
        y: -4,
      }}
    >
      <span
        className="font-mono text-xs tracking-widest font-bold"
        style={{ color: "#00D9C0" }}
      >
        {number}
      </span>
      <h3
        className="mt-2 text-lg font-bold tracking-tight"
        style={{ color: "#030301" }}
      >
        {title}
      </h3>
      <p
        className="mt-2 text-sm leading-relaxed"
        style={{ color: "rgba(3,3,1,0.55)" }}
      >
        {body}
      </p>
    </motion.div>
  );
}

export default function TrustSection() {
  const headRef = useRef(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });

  return (
    <section id="about" className="w-full py-24 md:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 40 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-20"
        >
          <p
            className="font-mono text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: "#FF4365" }}
          >
            Why Kritrium
          </p>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] max-w-3xl"
            style={{ color: "#030301" }}
          >
            Built for content that{" "}
            <span
              style={{
                WebkitTextStroke: "2px #030301",
                color: "transparent",
              }}
            >
              demands
            </span>{" "}
            protection.
          </h2>
          <p
            className="mt-6 text-base md:text-lg max-w-xl leading-relaxed"
            style={{ color: "rgba(3,3,1,0.5)" }}
          >
            Multi-signal AI analysis that goes beyond simple frame comparison —
            combining visual, temporal, audio and OCR signals into a single
            confidence score.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} index={i} />
          ))}
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map((p, i) => (
            <PillarCard key={p.number} {...p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}