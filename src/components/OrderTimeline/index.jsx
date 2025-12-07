import React, { useEffect, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  FaClipboardList,
  FaMoneyBillWave,
  FaTruck,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";
import { motion } from "framer-motion";

// ===== Connector =====
const AnimatedConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 26,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    borderRadius: 2,
    backgroundColor: "#e0e0e0",
    position: "relative",
    overflow: "hidden",
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}::after,
    &.${stepConnectorClasses.completed} .${stepConnectorClasses.line}::after`]: {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    background: "linear-gradient(90deg, #00c853, #00e676)",
    animation: "fillLine 1.4s ease-in-out forwards",
  },
  "@keyframes fillLine": {
    "0%": { width: "0%" },
    "100%": { width: "100%" },
  },
}));

// ===== Step icon =====
const StepIconRoot = styled("div")(({ ownerState }) => ({
  position: "relative",
  width: 50,
  height: 50,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  backgroundColor: "white",
  color: ownerState.active || ownerState.completed ? "#00c853" : "#bdbdbd",
  transition: "all 0.4s ease",
  transform: ownerState.active ? "scale(1.1)" : "scale(1)",
  boxShadow: ownerState.active ? "0 0 10px rgba(0,200,83,0.3)" : "none",
}));

function AnimatedStepIcon(props) {
  const { active, completed, icon } = props;
  const icons = {
    1: <FaClipboardList />,
    2: <FaMoneyBillWave />,
    3: <FaTruck />,
    4: <FaCheckCircle />,
    5: <FaStar />,
  };

  return (
    <StepIconRoot ownerState={{ active, completed }}>
      {(active || completed) && (
        <motion.svg
          viewBox="0 0 60 60"
          width="60"
          height="60"
          style={{
            position: "absolute",
            top: "-5px",
            left: "-5px",
            transform: "rotate(-90deg)",
          }}
        >
          <motion.circle
            cx="30"
            cy="30"
            r="27"
            fill="transparent"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00c853" />
              <stop offset="100%" stopColor="#00e676" />
            </linearGradient>
          </defs>
        </motion.svg>
      )}
      {icons[String(icon)]}
    </StepIconRoot>
  );
}

// ===== Main component =====
const steps = [
  { label: "Đơn hàng đã đặt", key: "updatedAt" },
  { label: "Đã xác nhận", key: "updatedAt" },
  { label: "Đang giao hàng", key: "updatedAt" },
  { label: "Hoàn tất", key: "updatedAt" },
  // { label: "Đánh giá", key: "updatedAt" },
];

export default function OrderStepperPro({ status, timestamps = {} }) {
  const stepIndexMap = {
    pending: 0,
    confirmed: 1,
    shipping: 2,
    completed: 3,
    review: 4,
  };

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const targetStep = stepIndexMap[status] ?? 0;
    let current = 0;
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < targetStep) return prev + 1;
        clearInterval(timer);
        return targetStep;
      });
      current++;
    }, 700);
    return () => clearInterval(timer);
  }, [status]);

  // Format thời gian
  const formatDate = (time) => {
    if (!time) return null;
    const date = new Date(time);
    return date.toLocaleString("vi-VN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 md:px-8 rounded-2xl bg-white/80">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<AnimatedConnector />}
        >
          {steps.map((step, index) => {
            const time = timestamps[step.key];
            const isVisible = activeStep >= index && time;
            return (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={AnimatedStepIcon}
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: activeStep >= index ? "#00c853" : "#9e9e9e",
                      mt: 1,
                      textShadow:
                        activeStep >= index
                          ? "0 0 6px rgba(0,200,83,0.3)"
                          : "none",
                    },
                  }}
                >
                  <div className="flex flex-col items-center">
                    {step.label}
                    {isVisible && (
                      <motion.span
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-[12px] text-gray-500 font-medium mt-[2px]"
                      >
                        {formatDate(time)}
                      </motion.span>
                    )}
                  </div>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </motion.div>
    </div>
  );
}
