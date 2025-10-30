import { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import clsx from "clsx";

const QtyBoxCart = ({ value, min = 1, max = 10, onChange }) => {
  const handleDec = () => {
    if (value > min) onChange(value - 1);
  };
  const handleInc = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center bg-[#f6f6fa] border rounded-xl px-1 py-[2px] w-fit">
      <button
        onClick={handleDec}
        className={clsx(
          "p-1 rounded-full hover:bg-[#eaeaea] transition",
          value <= min && "opacity-50 cursor-not-allowed"
        )}
        disabled={value <= min}
        title="Giảm số lượng"
      >
        <FiMinus className="text-[14px]" />
      </button>
      <span className="px-2 min-w-[24px] text-[14px] font-bold text-[#001F5D] select-none">
        {value}
      </span>
      <button
        onClick={handleInc}
        className={clsx(
          "p-1 rounded-full hover:bg-[#eaeaea] transition",
          value >= max && "opacity-50 cursor-not-allowed"
        )}
        disabled={value >= max}
        title="Tăng số lượng"
      >
        <FiPlus className="text-[14px]" />
      </button>
    </div>
  );
};

export default QtyBoxCart;
