import React, { useState } from "react";
import { FaTag, FaCopy, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";

const VoucherCard = ({ voucher }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (voucher?.code) {
      navigator.clipboard.writeText(voucher.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="relative bg-white min-w-[240px] sm:min-w-[280px] h-[160px] rounded-md shadow-md 
        overflow-hidden border border-[#001F5D] hover:border-[#0039b3] 
        hover:shadow-lg transition-all duration-300 flex-shrink-0"
    >
      {/* Phần đầu voucher gợn sóng */}
      <div className="absolute top-0 left-0 w-full h-[40px] sm:h-[45px] bg-[#001F5D] text-white flex items-center justify-center font-semibold text-[14px] sm:text-[15px]">
        <svg
          className="absolute bottom-[-1px] left-0 w-full"
          viewBox="0 0 500 50"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 C150,70 350,0 500,30 L500,0 L0,0 Z"
            fill="#001F5D"
          ></path>
        </svg>

        <div className="relative z-10 flex items-center gap-2">
          <FaTag className="text-[15px] sm:text-[17px]" />
          <span className="truncate max-w-[120px]">
            {voucher?.code?.toUpperCase() || "VOUCHER"}
          </span>
        </div>
      </div>

      {/* Thân voucher */}
      <div className="flex flex-col justify-between items-center h-full px-3 pt-[52px] pb-3 text-center">
        <div>
          <h3 className="text-[16px] sm:text-[18px] font-bold text-[#001F5D] leading-tight">
            {voucher?.discount ? `${voucher.discount}% GIẢM` : "ƯU ĐÃI ĐẶC BIỆT"}
          </h3>
          <p className="text-gray-600 text-[12px] sm:text-[14px] mt-1 leading-tight">
            {voucher?.description || "Áp dụng cho đơn hàng của bạn"}
          </p>
          <p className="text-[12px] text-gray-500 mt-1">
            HSD:{" "}
            <span className="font-medium text-[#001F5D]">
              {voucher?.expiryDate
                ? new Date(voucher.expiryDate).toLocaleDateString("vi-VN")
                : "Không thời hạn"}
            </span>
          </p>
        </div>

        {/* Nút sao chép */}
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-1 sm:gap-2 text-[#001F5D] border border-[#001F5D] px-2 sm:px-3 py-[4px] rounded-md text-[11px] sm:text-[13px] mt-auto hover:bg-[#001F5D] hover:text-white transition-all duration-300"
        >
          {copied ? (
            <>
              <FaCheck className="text-[11px] sm:text-[12px]" /> Đã sao chép
            </>
          ) : (
            <>
              <FaCopy className="text-[11px] sm:text-[12px]" /> Sao chép mã
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default VoucherCard;
