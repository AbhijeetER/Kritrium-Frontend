import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import React, { useRef } from "react";

export const VelocityText = ({ text }) => {
  const targetRef = useRef(null);

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const scrollVelocity = useVelocity(scrollYProgress);

  // Base position
  const baseX = useMotionValue(0);

  // Smooth velocity
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  // Skew effect
  const skewX = useSpring(useMotionValue(0), {
    mass: 3,
    stiffness: 400,
    damping: 50,
  });

  // 🔥 Repeat text to avoid gaps
  const repeatedText = Array(6).fill(text).join("   •   ");

  useAnimationFrame((t, delta) => {
    let moveBy = -0.5 * delta; // default auto scroll

    const velocity = smoothVelocity.get();

    // Override on scroll
    if (Math.abs(velocity) > 0.001) {
      moveBy = velocity * 2000;
    }

    baseX.set(baseX.get() + moveBy);

    // Dynamic skew
    skewX.set(velocity * -30);

    // Optional loop reset (prevents overflow drift)
    if (baseX.get() < -3000) {
      baseX.set(0);
    }
  });

  return (
    <section
      ref={targetRef}
      className="h-[300vh] bg-neutral-50 text-neutral-950"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.p
          style={{
            x: baseX,
            skewX,
          }}
          className="origin-bottom-left whitespace-nowrap text-8xl font-black uppercase leading-[0.85] md:text-7xl"
        >
          {repeatedText}
        </motion.p>
      </div>
    </section>
  );
};