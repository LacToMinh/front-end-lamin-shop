// frontend/src/components/MotionGrid/index.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/** Grid container: bật layout để animate reflow */
export const MotionGrid = ({ children, isGrid = true }) => {
  return (
    <motion.div
      layout
      className={`grid ${
        isGrid ? "grid-cols-5 md:grid-cols-5 gap-2 mt-3" : "grid-cols-1 md:grid-cols-1 gap-0"
      }`}
      transition={{ layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
    >
      {children}
    </motion.div>
  );
};

/** Item: animate vào/ra + layout reflow */
export const MotionCard = ({ i, columns = 5, children, id }) => {
  const row = Math.floor(i / columns);
  const col = i % columns;
  const delay = row * 0.03 + col * 0.05; // “wave”

  return (
    <motion.div
      key={id ?? i}
      layout
      layoutId={String(id ?? i)} // giúp animate mượt khi giữ cùng identity
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -12 }}
      transition={{
        layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        duration: 0.22,
        delay,
        ease: "easeOut",
      }}
      style={{
        transformOrigin: "50% 50%",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  );
};
