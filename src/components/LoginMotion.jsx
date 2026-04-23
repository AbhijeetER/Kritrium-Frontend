import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import LoginForm from "./LoginForm";

const LoginMotion = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <div style={{ height: "100vh", position: "relative", overflow: "hidden" }}>
      
      {/* Login Button */}
      <button
        onClick={() => {
          setShowLogin(true);
          setShowForm(false);
        }}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          padding: "0.5rem 1rem",
          background: "black",
          color: "white",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Login
      </button>

      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ rotate: "0deg", scale: 0 }}
            animate={{ rotate: "720deg", scale: 20 }}
            exit={{ rotate: "0deg", scale: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            onAnimationComplete={() => setShowForm(true)} // 👈 key part
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 150,
              height: 150,
              background: "black",
              transform: "translate(-50%, -50%)",
              borderRadius: "8px",
              zIndex: 10,
            }}
          />
        )}
      </AnimatePresence>

      {/* Login Form appears AFTER animation */}
      <AnimatePresence>
        {showForm && <LoginForm />}
      </AnimatePresence>
    </div>
  );
};

export default LoginMotion;