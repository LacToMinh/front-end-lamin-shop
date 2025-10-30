import React from "react";
import { LuClock3 } from "react-icons/lu";
import { Link } from "react-router-dom"
import { FaArrowRight } from "react-icons/fa";

const BlogItem = () => {
  return (
    <div className="blogItem group">
      <div className="imgWrapper w-full overflow-hidden relative">
        <img
          src="/blog_1.webp"
          alt="blog image"
          loading="lazy"
          className="w-full transition-all duration-700 group-hover:scale-105 cursor-pointer relative"
        />
        <span className="flex items-center justify-center text-white absolute bottom-[15px] right-[15px] z-[100] bg-primary rounded-md p-1 text-[14px] font-medium gap-1">
          <LuClock3 className="text-[15px]" /> 5 APRIL, 2023
        </span>
        <div className="absolute inset-0 bg-black/50 opacity-50 transition-opacity duration-700 delay-700 ease-in-out z-[50] group-hover:bg-black/70 group-hover:delay-700 pointer-events-none cursor-pointer" />
      </div>

      <div className="info py-4">
        <h2 className="blog-title text-[18px] font-semibold">
          <Link to="/" className="link">Gợi ý outfit thời trang mùa hè nam 2025 đẹp, dẫn đầu xu hướng</Link>
        </h2>
        <p className="blog-desc text-[14px] font-light">Mùa hè 2025 đang đến gần, mang theo làn gió mới trong thế giới thời trang mùa hè nam giới. Đây là thời điểm lý tưởng ...</p>
        <Link to="/login" className="link text-[15px] font-medium underline flex items-center gap-1" >Đọc thêm <FaArrowRight /></Link>
      </div>
    </div>
  );
};

export default BlogItem;
