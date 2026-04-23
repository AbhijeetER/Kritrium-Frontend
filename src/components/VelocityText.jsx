import '../index.css'
// import {
//     motion,
//     useScroll,
//     useVelocity,
//     useTransform,
//     useSpring,
//   } from "framer-motion";
//   import React, { useRef } from "react";
  
//   export const VelocityText = () => {
//     const targetRef = useRef(null);
  
//     const { scrollYProgress } = useScroll({
//       target: targetRef,
//       offset: ["start start", "end start"],
//     });
  
//     const scrollVelocity = useVelocity(scrollYProgress);
  
//     const skewXRaw = useTransform(
//       scrollVelocity,
//       [-0.5, 0.5],
//       ["45deg", "-45deg"]
//     );
//     const skewX = useSpring(skewXRaw, { mass: 3, stiffness: 400, damping: 50 });
  
//     const xRaw = useTransform(scrollYProgress, [0, 1], [0, -4000]);
//     const x = useSpring(xRaw, { mass: 3, stiffness: 400, damping: 50 });
  
//     return (
//       <section
//         ref={targetRef}
//         className="h-[1000vh] bg-neutral-50 text-neutral-950"
//       >
//         <div className="sticky top-0 flex h-screen items-center overflow-hidden">
//           <motion.p
//             style={{ skewX, x }}
//             className="origin-bottom-left whitespace-nowrap text-8xl font-black uppercase leading-[0.85] md:text-7xl md:leading-[0.85]"
//           >
//            This project is a web application that helps users detect unauthorized use of their digital content across the internet. Users upload a file or provide a URL, and the system analyzes it to find similar content on external platforms. A discovery agent identifies potential sources, and an AI model verifies matches based on similarity. The backend coordinates the process and returns results to a dashboard where users can view detected sources and confidence scores. The system does not control or block content—it only monitors and notifies users about possible misuse.
//           </motion.p>
//         </div>
//       </section>
//     );
//   };

import { useEffect, useState } from "react";

export default function VelocityText({ text }) {
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const diff = Math.abs(window.scrollY - lastY);
      setSpeed(1 + diff * 0.05);
      lastY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="overflow-hidden whitespace-nowrap bg-indigo-100 py-2">
      <div
        className="inline-block"
        style={{
          animation: `scroll ${10 / speed}s linear infinite`,
        }}
      >
        {text.repeat(5)}
      </div>
    </div>
  );
}