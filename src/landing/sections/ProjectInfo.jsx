"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Carousel, Card } from "../../components/cardsCarousel";

export default function ProjectInfo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const cards = data.map((card, index) => (
    <Card key={index} card={card} index={index} />
  ));

  return (
    <section className="w-full py-20 md:py-28" style={{ background: "#FFFFF3" }}>
      <div className="w-full">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="px-4 md:px-10 max-w-7xl mx-auto mb-2"
        >
          <p
            className="font-mono text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: "#FF4365" }}
          >
            Step by Step
          </p>
          <h2
            className="text-3xl md:text-5xl font-black tracking-tight"
            style={{ color: "#030301" }}
          >
            How it works.
          </h2>
        </motion.div>

        <div className="min-h-[60vh] flex items-center">
          <Carousel items={cards} />
        </div>
      </div>
    </section>
  );
}

const CardContent = ({ text }) => (
  <div
    className="p-6 md:p-8 rounded-2xl"
    style={{ background: "rgba(3,3,1,0.04)" }}
  >
    <p className="text-sm md:text-base leading-relaxed" style={{ color: "#030301" }}>
      {text}
    </p>
  </div>
);

const data = [
  {
    category: "Step 1",
    title: "Upload Content",
    description:
      "Users can upload a video file directly or provide a URL from any platform. The system securely ingests and validates the content before initiating the analysis pipeline.",
    src: "https://images.unsplash.com/photo-1581091215367-59ab6b7e0b47?q=80&w=2000",
    content: <CardContent text="Uploaded content is normalized and prepared for further processing without altering its original structure." />,
  },
  {
    category: "Step 2",
    title: "Frame Extraction",
    description:
      "The video is broken into strategically selected key frames at regular and adaptive intervals, focusing only on meaningful visual segments.",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000",
    content: <CardContent text="Efficient frame extraction ensures faster processing while maintaining analytical accuracy." />,
  },
  {
    category: "Step 3",
    title: "AI Matching",
    description:
      "Each extracted frame is converted into feature embeddings and compared using deep learning models that analyze patterns, textures, and structures.",
    src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000",
    content: <CardContent text="Advanced models enable high-accuracy detection even with partial or modified content." />,
  },
  {
    category: "Step 4",
    title: "Source Discovery",
    description:
      "A discovery agent scans multiple platforms to locate potential matches, filtered by similarity thresholds and verified to eliminate false positives.",
    src: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=2000",
    content: <CardContent text="The system continuously refines results to ensure only relevant matches are surfaced." />,
  },
  {
    category: "Step 5",
    title: "Detection Result",
    description:
      "The final output presents detected sources with confidence scores and similarity metrics in a clear dashboard breakdown.",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000",
    content: <CardContent text="All results are structured for easy interpretation and actionable insights." />,
  },
];