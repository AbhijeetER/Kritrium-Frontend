import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function FloatingUploadButton() {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate("/upload")}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 2.5 }}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.96 }}
      className="fixed top-5 right-5 z-50 font-mono font-bold text-xs tracking-[0.15em] px-5 py-2.5 rounded-full transition-all duration-200"
      style={{
        background: "#FF4365",
        color: "#FFFFF3",
        boxShadow: "0 4px 20px rgba(255,67,101,0.35)",
      }}
    >
      UPLOAD
    </motion.button>
  );
}