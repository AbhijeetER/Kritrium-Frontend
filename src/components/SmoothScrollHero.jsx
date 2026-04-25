import { ReactLenis } from "lenis/dist/lenis-react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.png";
import img5 from "../assets/img5.png";
import img6 from "../assets/img6.png";
import img7 from "../assets/img7.webp";
// import img8 from "../assets/img8.png";

const SECTION_HEIGHT = 900;

const images = [img1, img2, img3, img4, img5, img6, img7];
const timeline = [
  {
    phase: "01",
    title: "Project Kickoff",
    description: "18th Apr 2026 — Ideation, architecture planning, and defining core piracy detection pipeline.",
  },
  {
    phase: "02",
    title: "MVP Part 1 (URL Analysis)",
    description: "18th Apr → 26th Apr — Built core pipeline: video download, frame extraction, summary generation, and AI-based detection using URL input.",
  },
  {
    phase: "03",
    title: "MVP Part 2 (Multi-Input Support)",
    description: "Post 26th Apr — Extending system to support direct image & video uploads alongside URLs for broader detection coverage.",
  },
  {
    phase: "04",
    title: "Enhanced Detection Engine",
    description: "Improving accuracy with multi-signal scoring (visual, audio, temporal, OCR) and better confidence calibration.",
  },
  {
    phase: "05",
    title: "Dashboard & Monitoring",
    description: "Building real-time dashboard with telemetry, analysis reports, and forensic insights for detected content.",
  },
  {
    phase: "06",
    title: "Live Streaming Detection (Future)",
    description: "Planned — Real-time piracy detection for live streams using continuous frame sampling and behavioral tracking.",
  },
];

export const SmoothScrollHero = () => {
  return (
    <div style={{ background: "#FFFFF3", color: "#030301" }}>
      <Hero />
      <Timeline />
    </div>
  );
};

const Hero = () => (
  <div
    style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
    className="relative w-full"
  >
    <CenterImage />
    <ParallaxImages />
    <div
      className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
      style={{
        background: "linear-gradient(to bottom, transparent, #FFFFF3)",
      }}
    />
  </div>
);

const CenterImage = () => {
  const { scrollY } = useScroll();
  const clip1 = useTransform(scrollY, [0, 900], [22, 0]);
  const clip2 = useTransform(scrollY, [0, 900], [78, 100]);
  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;
  const scale = useTransform(scrollY, [0, 900], [1.12, 1]);

  return (
    <motion.div
      className="sticky top-0 h-screen w-full"
      style={{
        clipPath,
        scale,
        backgroundImage: "url(/image.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
};

const ParallaxImages = () => (
  <div className="mx-auto max-w-6xl px-4 pt-[120px] grid grid-cols-2 md:grid-cols-3 gap-5">
    {images.map((src, i) => (
      <ParallaxImg key={i} src={src} start={i % 2 === 0 ? -70 : 70} end={i % 2 === 0 ? 70 : -70} />
    ))}
  </div>
);

const ParallaxImg = ({ src, start, end }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  return (
    <motion.img
      ref={ref}
      src={src}
      className="w-full h-[200px] object-cover rounded-xl"
      style={{
        y,
        scale,
        boxShadow: "0 4px 24px rgba(3,3,1,0.08)",
      }}
    />
  );
};

const Timeline = () => (
  <section className="mx-auto max-w-5xl px-4 py-28">
    <motion.h2
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="mb-16 text-3xl md:text-4xl font-black tracking-tight"
      style={{ color: "#030301" }}
    >
      TimeLine
    </motion.h2>

    <div className="space-y-8">
      {timeline.map((item, i) => (
        <motion.div
          key={i}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="pl-6"
          style={{ borderLeft: `2px solid #FF4365` }}
        >
          <p
            className="font-mono text-xs font-bold tracking-widest uppercase mb-1"
            style={{ color: "#FF4365" }}
          >
            {item.phase}
          </p>
          <p className="text-base font-bold" style={{ color: "#030301" }}>
            {item.title}
          </p>
          <p className="text-sm mt-0.5" style={{ color: "rgba(3,3,1,0.45)" }}>
            {item.description}
          </p>
        </motion.div>
      ))}
    </div>
  </section>
);