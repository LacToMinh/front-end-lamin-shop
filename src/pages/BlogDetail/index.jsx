import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { LuClock3 } from "react-icons/lu";
import { getDataFromApi } from "../../utils/api";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await getDataFromApi(`/api/blog/${id}`);
      if (res?.success) setBlog(res.data);
    };
    fetchBlog();
  }, [id]);

  if (!blog) {
    return (
      <div className="py-10 text-center text-gray-600 text-lg">
        Đang tải bài viết...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <img
        src={blog.thumbnail || "/no-image.png"}
        alt={blog.title}
        className="w-full rounded-md mb-5"
      />

      <h1 className="text-3xl font-semibold mb-2">{blog.title}</h1>

      <div className="flex items-center text-gray-500 text-sm gap-4 mb-6">
        <span className="flex items-center gap-1">
          <LuClock3 />
          {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
        </span>
        <span>Tác giả: {blog.author || "Không rõ"}</span>
        {blog.category && <span>Danh mục: {blog.category}</span>}
      </div>

      <div
        className="prose max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-8">
          <h3 className="font-medium mb-2">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-gray-100 border border-gray-300 text-gray-700 px-2 py-1 rounded-md text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <Link
          to="/"
          className="text-blue-600 underline hover:text-blue-800 transition"
        >
          ← Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
};

export default BlogDetail;
