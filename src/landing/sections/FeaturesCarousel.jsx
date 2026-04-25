import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Carousel, Card } from "../../components/cardsCarousel";

const featureData = [
  {
    category: "Visual",
    title: "Frame Hashing",
    description:
      "Perceptual hash embeddings survive re-encoding, cropping, and color grading. Our model detects similarity even in heavily modified copies.",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000",
    content: (
      <div
        className="p-6 rounded-2xl"
        style={{ background: "rgba(3,3,1,0.04)" }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "#030301" }}>
          Frame-level perceptual hashing captures structural fingerprints
          resistant to standard video processing transformations.
        </p>
      </div>
    ),
  },
  {
    category: "Temporal",
    title: "Motion Patterns",
    description:
      "Sequence-level analysis across consecutive frames catches cut-and-paste edits that fool single-frame detectors.",
    src: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=2000",
    content: (
      <div
        className="p-6 rounded-2xl"
        style={{ background: "rgba(3,3,1,0.04)" }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "#030301" }}>
          Temporal coherence scoring maps the rhythm of scene changes, making
          edited highlights and remixes identifiable.
        </p>
      </div>
    ),
  },
  {
    category: "Audio",
    title: "Spectral Match",
    description:
      "Audio fingerprints survive pitch-shifting, speed changes, and ambient noise. Silent clips fall back to visual-only scoring.",
    src: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2000",
    content: (
      <div
        className="p-6 rounded-2xl"
        style={{ background: "rgba(3,3,1,0.04)" }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "#030301" }}>
          Mel-frequency spectral analysis combined with chroma features creates
          robust audio fingerprints for broadcast-grade content.
        </p>
      </div>
    ),
  },
  {
    category: "OCR",
    title: "Text Extraction",
    description:
      "On-screen watermarks, scoreboards, and branding burned into the video are extracted and cross-referenced with the original.",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000",
    content: (
      <div
        className="p-6 rounded-2xl"
        style={{ background: "rgba(3,3,1,0.04)" }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "#030301" }}>
          Real-time OCR on extracted frames identifies broadcaster logos, match
          overlays, and embedded text unique to the original broadcast.
        </p>
      </div>
    ),
  },
  {
    category: "Scoring",
    title: "Confidence Engine",
    description:
      "Four independent signals are fused into a single 0–1 confidence score with a matched-frames count and piracy verdict.",
    src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000",
    content: (
      <div
        className="p-6 rounded-2xl"
        style={{ background: "rgba(3,3,1,0.04)" }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "#030301" }}>
          Weighted fusion of visual (0.89), temporal (0.53), audio (0.7), and
          OCR (0.1) signals produces a calibrated confidence output.
        </p>
      </div>
    ),
  },
];

export default function FeaturesCarousel() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const cards = featureData.map((card, index) => (
    <Card key={index} card={card} index={index} />
  ));

  return (
    <section className="w-full py-20 md:py-28">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="px-4 mb-2"
        >
          <p
            className="font-mono text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: "#030301", opacity: 0.5 }}
          >
            Detection Signals
          </p>
          <h2
            className="text-3xl md:text-5xl font-black tracking-tight"
            style={{ color: "#030301" }}
          >
            Four layers. One verdict.
          </h2>
        </motion.div>
        <Carousel items={cards} />
      </div>
    </section>
  );
}