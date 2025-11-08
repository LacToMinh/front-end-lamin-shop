import { useRef, useState, useEffect } from "react";
import { Button } from "@mui/material";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getDataFromApi } from "../../../utils/api";

const ScrollableMenu = () => {
  const [catData, setCatData] = useState([]);
  const scrollRef = useRef();

  // Gọi API lấy danh mục
  useEffect(() => {
    getDataFromApi("/api/category").then((res) => {
      setCatData(res?.data || []);
    });
  }, []);

  // Cuộn danh sách trái/phải
  const scrollMenu = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 150;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full flex items-center justify-center py-2">
      {/* Nút cuộn trái - chỉ hiện ở mobile */}
      <button
        onClick={() => scrollMenu("left")}
        className="absolute left-2 z-10 flex sm:hidden items-center justify-center w-8 h-8 rounded-full bg-[#001F5D] text-yellow-400 hover:scale-105 transition-transform shadow-md"
      >
        <FaChevronLeft size={13} />
      </button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-none whitespace-nowrap scroll-smooth mx-10 sm:mx-0"
      >
        <ul className="flex items-center gap-5 justify-center sm:justify-start">
          <li>
            <Button className="!text-[15px] !font-semibold !text-black hover:!text-[#001F5D]">
              Trang Chủ
            </Button>
          </li>

          {catData?.map((cat) => (
            <li key={cat._id}>
              <Link to={`/productListing?catId=${cat._id}`}>
                <Button className="!text-[15px] !font-semibold !text-black hover:!text-[#001F5D]">
                  {cat.name}
                </Button>
              </Link>
            </li>
          ))}

          <li>
            <Button className="!text-[15px] !font-semibold !text-black hover:!text-[#001F5D]">
              Hàng Mới
            </Button>
          </li>
          <li>
            <Button className="!text-[15px] !font-semibold !text-black hover:!text-[#001F5D]">
              Hàng Bán Chạy
            </Button>
          </li>
        </ul>
      </div>

      {/* Nút cuộn phải - chỉ hiện ở mobile */}
      <button
        onClick={() => scrollMenu("right")}
        className="absolute right-2 z-10 flex sm:hidden items-center justify-center w-8 h-8 rounded-full bg-[#001F5D] text-yellow-400 hover:scale-105 transition-transform shadow-md"
      >
        <FaChevronRight size={13} />
      </button>
    </div>
  );
};

export default ScrollableMenu;
