import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

function useScramble(target, trigger) {
  const [display, setDisplay] = useState(target);
  const iter = useRef(0);

  useEffect(() => {
    if (!trigger) return;
    iter.current = 0;
    const interval = setInterval(() => {
      setDisplay(
        target
          .split("")
          .map((char, idx) => {
            if (char === " ") return " ";
            if (idx < iter.current) return target[idx];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      if (iter.current >= target.length) clearInterval(interval);
      iter.current += 0.4;
    }, 30);
    return () => clearInterval(interval);
  }, [trigger, target]);

  return display;
}

export default function HeroVideo() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [entered, setEntered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const titleText = useScramble("KRITRIUM", entered);
  const subText = useScramble("PIRACY DETECTION SYSTEM", entered);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* VIDEO */}
      <motion.div
        style={{ scale: videoScale, opacity: videoOpacity }}
        className="absolute inset-0"
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setLoaded(true)}
          className="w-full h-full object-cover"
          src="/2nd.mp4"
        />

        {/* Dark gradient overlay bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(3,3,1,0.85) 100%)",
          }}
        />
        {/* Vignette sides */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />
      </motion.div>

      {/* CONTENT */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
      >
        {/* Blur backdrop behind heading */}
        <div
          className="absolute"
          style={{
            width: "min(700px, 90vw)",
            height: "360px",
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          {/* TOP LABEL */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : -12 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-mono font-extrabold tracking-[0.28em] text-[9px] sm:text-[10px] md:text-[11px] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3"
            style={{ color: "#00D9C0" }}
          >
            <span
              className="w-6 sm:w-8 h-[1px]"
              style={{ background: "#00D9C0" }}
            />
            CONTENT INTELLIGENCE PLATFORM
            <span
              className="w-6 sm:w-8 h-[1px]"
              style={{ background: "#00D9C0" }}
            />
          </motion.div>

          {/* TITLE */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: entered ? 1 : 0 }}
            className="font-mono font-extrabold uppercase tracking-[0.12em] text-white leading-none text-[48px] sm:text-[72px] md:text-[96px] lg:text-[120px]"
          >
            {titleText}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: entered ? 1 : 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="block h-[2px] sm:h-[3px] mt-2 origin-left"
              style={{
                background: "#FF4365",
                boxShadow: "0 0 12px #FF4365",
              }}
            />
          </motion.h1>

          {/* SUBTEXT */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: entered ? 1 : 0 }}
            transition={{ delay: 0.6 }}
            className="font-mono tracking-[0.2em] text-[10px] sm:text-[12px] md:text-[14px] mt-4 sm:mt-6"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {subText}
          </motion.p>

          {/* CTA BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 20 }}
            transition={{ delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10"
          >
            <a
              href="/dashboard"
              className="font-mono font-extrabold tracking-[0.12em] text-[10px] sm:text-[12px] px-6 sm:px-8 py-3 rounded transition-all duration-200 hover:-translate-y-[2px]"
              style={{
                background: "#FF4365",
                color: "#FFFFF3",
              }}
            >
              ENTER SYSTEM →
            </a>
            <a
              href="#about"
              className="font-mono font-extrabold tracking-[0.12em] text-[10px] sm:text-[12px] px-5 sm:px-7 py-3 rounded transition-all duration-200 hover:text-white"
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              LEARN MORE
            </a>
          </motion.div>

          {/* STATUS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: entered ? 1 : 0 }}
            transition={{ delay: 1.8 }}
            className="flex items-center gap-2 mt-6 sm:mt-8 font-mono text-[9px] sm:text-[10px] tracking-[0.1em]"
            style={{ color: "#00D9C0" }}
          >
            <span
              className="w-[6px] h-[6px] rounded-full animate-pulse"
              style={{ background: "#00D9C0" }}
            />
            SYSTEM ONLINE — SCANNING ACTIVE
          </motion.div>
        </div>
      </motion.div>

      {/* SCROLL INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: entered ? 1 : 0 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span
          className="font-mono text-[8px] tracking-[0.2em]"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          className="w-[1px] h-6"
          style={{
            background: "linear-gradient(to bottom, #FF4365, transparent)",
          }}
        />
      </motion.div>

      {/* Bottom fade to #FFFFF3 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #030301)",
        }}
      />
    </section>
  );
}