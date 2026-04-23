// LoginForm.jsx
import { motion } from "motion/react";

const LoginForm = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "300px",
        background: "#1a1a1a",
        padding: "2rem",
        borderRadius: "12px",
        color: "white",
        textAlign: "center",
        zIndex: 20,
      }}
    >
      <h2>Kritrium</h2>
      <p>Sign in to your account</p>

      <form style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        <input
          type="email"
          placeholder="you@example.com"
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #444",
          }}
        />
        <input
          type="password"
          placeholder="••••••••"
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #444",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem",
            background: "white",
            color: "black",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Sign In
        </button>
      </form>
    </motion.div>
  );
};

export default LoginForm;