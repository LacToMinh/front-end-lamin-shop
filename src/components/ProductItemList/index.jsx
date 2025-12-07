import React from "react";
import Rating from "@mui/material/Rating";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

import { FaRegHeart } from "react-icons/fa";
import { IoMdGitCompare } from "react-icons/io";
import { MdZoomOutMap } from "react-icons/md";

const ProductItem = ({ item }) => {
  return (
    <div
      className="
      my-2
      product-card 
      w-full 
      bg-white 
      rounded-none
      shadow-sm 
      hover:shadow-lg 
      transition-all 
      duration-300 
      p-4 
      flex 
      gap-20
      border 
      border-gray-100
    "
    >
      {/* IMAGE */}
      <div className="relative w-[200px] h-[200px] group rounded-xl overflow-hidden">
        <Link to={`/product/${item?._id}`}>
          <img
            src={item?.images?.[0]}
            alt={item?.name}
            className="w-[90%] h-full object-cover rounded-xl transition-all duration-500 group-hover:scale-110"
          />
        </Link>

        {/* HOVER ACTION ICONS */}
        <div
          className="
            absolute 
            bottom-3 
            left-1/2 
            -translate-x-1/2 
            flex 
            items-center 
            gap-3
            opacity-0 
            group-hover:opacity-100 
            transition-all 
            duration-300
          "
        >
          <Tooltip title="Yêu thích">
            <button className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-red-50 text-gray-700 hover:text-red-600 transition">
              <FaRegHeart size={20} />
            </button>
          </Tooltip>

          <Tooltip title="So sánh">
            <button className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition">
              <IoMdGitCompare size={20} />
            </button>
          </Tooltip>

          <Tooltip title="Phóng to">
            <button className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-green-50 text-gray-700 hover:text-green-600 transition">
              <MdZoomOutMap size={20} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* INFO */}
      <div className="flex flex-col justify-between flex-1 py-2">
        {/* NAME */}
        <Link to={`/product/${item?._id}`}>
          <h3 className="font-semibold text-[18px] text-gray-800 line-clamp-2 hover:text-[#001F5D] transition">
            {item?.name}
          </h3>
        </Link>

        {/* RATING */}
        <Rating value={4} size="small" readOnly className="mt-1" />

        {/* PRICE */}
        <div className="mt-3 flex items-center gap-3">
          <span className="text-[20px] font-bold text-[#001F5D]">
            {item?.price?.toLocaleString("vi-VN")}₫
          </span>

          {item?.oldPrice && (
            <span className="line-through text-gray-400 text-[14px]">
              {item?.oldPrice?.toLocaleString("vi-VN")}₫
            </span>
          )}

          <span className="bg-red-600 text-white px-2 py-[2px] rounded-full text-[13px] font-semibold">
            -10%
          </span>
        </div>

        {/* ADD TO CART */}
        <Button
          variant="contained"
          className="
            w-fit
            !mt-5 
            !bg-[#001F5D] 
            !rounded-md 
            !py-1 
            !px-4 
            !text-white 
            hover:!bg-[#002b8a]
            transition-all 
            duration-300
          "
        >
          <span className="text-white">Thêm vào giỏ</span>
        </Button>
      </div>
    </div>
  );
};

export default ProductItem;
