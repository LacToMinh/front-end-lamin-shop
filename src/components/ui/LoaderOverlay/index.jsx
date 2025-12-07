// frontend/src/components/ui/LoaderOverlay.jsx
import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * LoaderOverlay
 * - show: boolean
 * - label?: string
 * - sublabel?: string
 */
const TIPS = [
  "Mẹo: Kết hợp Size + Giá để lọc nhanh hơn.",
  "Bạn có thể sắp xếp theo giá sau khi lọc.",
  "Giữ Shift khi cuộn để cuộn ngang grid.",
  "Chia sẻ link có sẵn catId để đồng bộ danh mục.",
];

const LoaderOverlay = ({ show, label = "Đang tải dữ liệu…", sublabel }) => {
  const tip = useMemo(() => TIPS[Math.floor(Math.random() * TIPS.length)], []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          aria-live="polite"
          aria-busy="true"
          role="status"
        >
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-md bg-black/20"
          />

          {/* card */}
          <motion.div
            initial={{ y: 10, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 6, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative mx-4 w-full max-w-[420px] rounded-2xl border border-white/20 bg-white/30 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
          >
            {/* Spinner */}
            <div className="mx-auto mb-4 grid place-items-center">
              <div className="relative h-20 w-20">
                {/* ring bg */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/50 via-white/10 to-white/0" />
                {/* svg spinner */}
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 120 120"
                  fill="none"
                >
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#001F5D" />
                      <stop offset="50%" stopColor="#2F6BFF" />
                      <stop offset="100%" stopColor="#7DA8FF" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <circle
                    cx="60"
                    cy="60"
                    r="44"
                    stroke="url(#g1)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="60 300"
                    filter="url(#glow)"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 60 60"
                      to="360 60 60"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx="60"
                    cy="60"
                    r="36"
                    stroke="#ffffff66"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </div>

            {/* Texts */}
            <div className="text-center">
              <p className="text-[15px] font-semibold text-[#001F5D]">
                {label}
              </p>
              {sublabel ? (
                <p className="mt-1 text-sm text-[#0b255f99]">{sublabel}</p>
              ) : (
                <p className="mt-1 text-sm text-[#0b255f99]">{tip}</p>
              )}
            </div>

            {/* Progress line */}
            <div className="mt-5 h-[6px] w-full overflow-hidden rounded-full bg-white/40">
              <motion.span
                initial={{ x: "-100%" }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="block h-full w-1/3 rounded-full bg-gradient-to-r from-[#001F5D] via-[#2F6BFF] to-[#7DA8FF]"
              />
            </div>

            {/* Dots */}
            <div className="mt-3 flex items-center justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-2 rounded-full bg-[#001F5D]"
                  animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 0.9,
                    delay: 0.12 * i,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoaderOverlay;
