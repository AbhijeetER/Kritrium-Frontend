import { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/dist/lenis-react";
import { motion, useInView } from "framer-motion";
import HeroVideo from "./sections/HeroVideo";
import { SmoothScrollHero } from "../components/SmoothScrollHero";
import ProjectInfo from "./sections/ProjectInfo";
import { RevealBento } from "../components/RevealBento";
import FloatingUploadButton from "../components/FloatingUploadButton";
import FeaturesCarousel from "./sections/FeaturesCarousel";
import TrustSection from "./sections/TrustSection";
import CTASection from "./sections/CTASection";

export default function Landing() {
  return (
    <ReactLenis root options={{ lerp: 0.075, duration: 1.2 }}>
      <div
        className="overflow-x-hidden"
        style={{ background: "#FFFFF3", color: "#030301" }}
      >
        <FloatingUploadButton />

        {/* 1 — HERO */}
        <section className="w-full min-h-screen">
          <HeroVideo />
        </section>
        {/* 2 — TRUST / INTRO */}
        <section className="w-full" style={{ background: "#FFFFF3" }}>
          <TrustSection />
        </section>

        {/* 3 — FEATURES CAROUSEL */}
        <section className="w-full" style={{ background: "#B7AD99" }}>
          <FeaturesCarousel />
        </section>

        {/* 4 — VISUAL DEPTH */}
        <section className="w-full" style={{ background: "#FFFFF3" }}>
          <SmoothScrollHero />
        </section>

        {/* 5 — PRODUCT EXPLANATION */}
        <section className="w-full" style={{ background: "#FFFFF3" }}>
          <ProjectInfo />
        </section>

        {/* 6 — FINAL CTA + BENTO */}
        <section className="w-full" style={{ background: "#030301" }}>
          <CTASection />
          <div className="pb-10">
            <RevealBento />
          </div>
        </section>
      </div>
    </ReactLenis>
  );
}