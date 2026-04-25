import React from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { SiGithub, SiYoutube} from "react-icons/si";
import {
  FaUserAstronaut,
  FaUserNinja,
  FaUserSecret,
  FaUserTie,
} from "react-icons/fa";
import BorderGlow from "./BuildBoxShadow";
import { CiLinkedin } from "react-icons/ci";


export const RevealBento = () => {
  return (
    <div className="px-4 py-10" style={{ background: "#030301" }}>
      <motion.div
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.06 }}
        className="mx-auto grid max-w-5xl grid-cols-12 gap-4"
      >
        <HeaderBlock />
        <SocialsBlock />
        <AboutBlock />
        <TeamBlock />
      </motion.div>
    </div>
  );
};

const Block = ({ className, ...rest }) => (
  <motion.div
    variants={{
      initial: { scale: 0.7, y: 40, opacity: 0 },
      animate: { scale: 1, y: 0, opacity: 1 },
    }}
    transition={{ type: "spring", stiffness: 280, damping: 22 }}
    className={twMerge("rounded-2xl border p-6", className)}
    style={{ borderColor: "rgba(255,255,255,0.07)" }}
    {...rest}
  />
);

const HeaderBlock = () => (
  <Block
    className="col-span-12 md:col-span-6"
    style={{ background: "#FFFFF3" }}
  >
    <img src="/icon.webp" className="mb-4 h-12 w-12" alt="Kritrium logo" />
    <h1
      className="text-3xl md:text-4xl leading-tight font-black tracking-tight"
      style={{ color: "#030301" }}
    >
      we are{" "}
      <span style={{ color: "#FF4365" }}>KRITRIUM</span>
      {" — "}
      <span style={{ color: "rgba(3,3,1,0.4)" }}>
        intelligent piracy detection.
      </span>
    </h1>
  </Block>
);

const SocialsBlock = () => (
  <div className="col-span-12 md:col-span-6 grid grid-cols-2 gap-4">
    <GlowWrapper>
      <Block
        className="flex items-center justify-center h-[100px]"
        style={{ background: "#FF4365" }}
      >
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
        >
          <SiYoutube className="text-3xl text-white" />
        </a>
      </Block>
    </GlowWrapper>

    <GlowWrapper>
      <Block
        className="flex items-center justify-center h-[100px]"
        style={{ background: "#0A66C2" }}
      >
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <CiLinkedin className="text-3xl text-white" />
        </a>
      </Block>
    </GlowWrapper>

    <GlowWrapper>
      <Block
        className="flex items-center justify-center h-[100px] font-mono font-bold text-sm tracking-widest"
        style={{ background: "#00D9C0", color: "#030301" }}
      >
        <a href="/upload">TRY PLATFORM →</a>
      </Block>
    </GlowWrapper>

    <GlowWrapper>
      <Block
        className="flex items-center justify-center h-[100px]"
        style={{ background: "#030301", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <SiGithub className="text-3xl" style={{ color: "#FFFFF3" }} />
        </a>
      </Block>
    </GlowWrapper>
  </div>
);

const AboutBlock = () => (
  <Block
    className="col-span-12 md:col-span-6 text-2xl leading-snug"
    style={{ background: "#111" }}
  >
    <p style={{ color: "rgba(255,255,253,0.9)" }}>
      Our platform —{" "}
      <span style={{ color: "rgba(255,255,253,0.35)" }}>
        an AI-powered system to detect unauthorized content usage across the web,
        in real-time, at scale.
      </span>
    </p>
  </Block>
);

const TeamBlock = () => {
  const members = [
    { icon: <FaUserAstronaut />, link: "https://linkedin.com" },
    { icon: <FaUserNinja />, link: "https://linkedin.com" },
    { icon: <FaUserSecret />, link: "https://linkedin.com" },
    { icon: <FaUserTie />, link: "https://linkedin.com" },
  ];

  return (
    <GlowWrapper className="col-span-12 md:col-span-6">
      <Block style={{ background: "#111" }}>
        <p
          className="mb-6 text-sm font-mono font-bold tracking-widest uppercase"
          style={{ color: "#00D9C0" }}
        >
          Team
        </p>
        <div className="grid grid-cols-4 gap-3">
          {members.map((m, i) => (
            <a
              key={i}
              href={m.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-4 rounded-xl text-xl transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,253,0.5)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,217,192,0.1)";
                e.currentTarget.style.color = "#00D9C0";
                e.currentTarget.style.borderColor = "rgba(0,217,192,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(255,255,253,0.5)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              {m.icon}
            </a>
          ))}
        </div>
      </Block>
    </GlowWrapper>
  );
};

const GlowWrapper = ({ children, className }) => (
  <div className={className}>
    <BorderGlow
      glowColor="180 100 50"
      borderRadius={16}
      glowRadius={80}
      glowIntensity={4}
      backgroundColor="#111111"
      colors={["#00D9C0", "#FF4365", "#FFFFF3"]}
      fillOpacity={0.3}
    >
      {children}
    </BorderGlow>
  </div>
);