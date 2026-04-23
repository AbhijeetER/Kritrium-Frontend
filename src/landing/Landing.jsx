export default function Landing() {
    return (
      <div className="scroll-smooth bg-white text-slate-900">
  
        <HeroVideo />
        <VelocityText text="AI • PIRACY DETECTION • FORENSIC ANALYSIS •" />
  
        <SmoothScrollHero />
        <VelocityText text="FRAME MATCHING • OCR • AUDIO ANALYSIS •" />
  
        <ProjectInfo />
        <VelocityText text="REAL-TIME PIPELINE • CLOUD • ML •" />
  
        <RevealBento />
        <Tools />
  
      </div>
    );
  }