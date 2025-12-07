import React from "react";
import { LuClock3 } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const BlogItem = ({ blog }) => {
  return (
    <div className="group relative bg-white shadow-md hover:shadow-xl transition-all duration-500 rounded-xl overflow-hidden border border-gray-100">
      {/* ẢNH */}
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={blog.thumbnail || "/no-images.png"}
          alt={blog.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Overlay + Ngày tháng */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition-all duration-500"></div>

        <span className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm bg-black/50 backdrop-blur-md px-2 py-1 rounded-md">
          <LuClock3 className="text-[15px]" />
          {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
        </span>
      </div>

      {/* THÔNG TIN */}
      <div className="p-5 flex flex-col justify-between h-[220px]">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300 line-clamp-2">
            <Link to={`/blog/${blog._id}`} className="hover:underline">
              {blog.title}
            </Link>
          </h2>

          <div className="text-gray-600 text-[15px] font-light mt-2 leading-relaxed line-clamp-3">
            {blog.content?.replace(/<[^>]+>/g, "").slice(0, 150)}...
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500 italic">
            ✍️ {blog.author || "Tác giả ẩn danh"}
          </span>

          <Link
            to={`/blog/${blog._id}`}
            className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all text-[15px]"
          >
            Đọc thêm <FaArrowRight className="text-[14px]" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
