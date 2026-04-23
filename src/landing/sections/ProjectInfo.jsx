import { motion } from "framer-motion";

export default function ProjectInfo() {
  return (
    <section className="py-20 px-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold">How It Works</h2>
        <p className="mt-4">
          Our system extracts frames, compares embeddings, and detects piracy.
        </p>
      </motion.div>
    </section>
  );
}