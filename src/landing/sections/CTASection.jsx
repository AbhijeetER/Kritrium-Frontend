import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="w-full pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p
            className="font-mono text-xs tracking-[0.3em] uppercase mb-6"
            style={{ color: "#00D9C0" }}
          >
            Get Started
          </p>

          <h2
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8"
            style={{ color: "#FFFFF3" }}
          >
            Stop piracy.
            <br />
            <span style={{ color: "#FF4365" }}>Start scanning.</span>
          </h2>

          <p
            className="text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ color: "rgba(255,255,253,0.4)" }}
          >
            Upload a video URL or file and receive a multi-signal piracy
            confidence score in under two seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/upload"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="font-mono font-bold tracking-[0.1em] text-sm px-8 py-4 rounded-xl transition-all duration-200"
              style={{
                background: "#FF4365",
                color: "#FFFFF3",
              }}
            >
              ANALYZE A VIDEO →
            </motion.a>
            <motion.a
              href="/dashboard"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="font-mono font-bold tracking-[0.1em] text-sm px-8 py-4 rounded-xl transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,253,0.15)",
                color: "rgba(255,255,253,0.6)",
              }}
            >
              VIEW DASHBOARD
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}