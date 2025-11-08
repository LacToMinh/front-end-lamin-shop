import Button from "@mui/material/Button";
import { CgMenuGridR } from "react-icons/cg";
import { LiaAngleDownSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { GoRocket } from "react-icons/go";
import CategoryPanel from "./CategoryPanel";
import { useEffect, useRef, useState } from "react";
import { getDataFromApi } from "../../../utils/api";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Navigation = () => {
  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);
  const [catData, setCatData] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    getDataFromApi("/api/category").then((res) => {
      setCatData(res?.data || []);
    });
  }, []);

  const openCategoryPanel = () => {
    setIsOpenCatPanel(!isOpenCatPanel);
  };

  const scrollMenu = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 150;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-30 w-full transition-all duration-500 ${
          isScrolled ? "pt-2 bg-white shadow-md" : "pt-0"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between gap-4 py-2">
          {/* col1 – chỉ hiển thị khi chưa scroll */}
          {!isScrolled && (
            <div className="hidden md:block items-center gap-2 w-[20%]">
              <Button
                className="!text-black gap-2 !text-sm md:!text-base !px-0 !font-semibold"
                onClick={openCategoryPanel}
              >
                <CgMenuGridR className="text-base" />
                Shop by Categories
                <LiaAngleDownSolid className="mt-[-4px] text-sm" />
              </Button>
            </div>
          )}

          {/* col2 – thanh menu cuộn bằng nút */}
          <div
            className={`relative md:w-[80%] w-full transition-all duration-500 ${
              isScrolled
                ? "fixed top-0 left-1/2 -translate-x-1/2 z-[0] w-[95%] sm:w-[80%] lg:w-fit backdrop-blur-xl bg-[rgba(20,20,20,0.5)] bg-gradient-to-r from-[rgba(20,20,20,0.55)] to-[rgba(60,60,60,0.35)] border border-white/20 rounded-2xl ring-1 ring-white/30 px-10 py-2 shadow-[0_8px_25px_rgba(0,0,0,0.15)]"
                : ""
            }`}
          >
            {/* Nút cuộn trái */}
            <button
              onClick={() => scrollMenu("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-[999]
             w-6 h-6 bg-transparent text-[#001F5D] hover:text-yellow-500
             transition-all block md:hidden"
            >
              <FaChevronLeft size={16} />
            </button>

            {/* Menu cuộn */}
            <div
              ref={scrollRef}
              className="mx-8 overflow-hidden whitespace-nowrap scroll-smooth pl-56 md:pl-0"
            >
              <ul className="flex items-center justify-center gap-0">
                <li>
                  <Button
                    className={`!text-sm md:!text-base !font-semibold !p-0 ${
                      isScrolled
                        ? "!text-[#FFD700] drop-shadow-[0_0_6px_rgba(255,215,0,0.6)]"
                        : "!text-black hover:!text-[#001F5D]"
                    }`}
                  >
                    Trang Chủ
                  </Button>
                </li>

                {catData?.map((cat) => (
                  <li key={cat._id}>
                    <Link to={`/productListing?catId=${cat._id}`}>
                      <Button
                        className={`!text-sm md:!text-base !font-semibold ${
                          isScrolled
                            ? "!text-[#FFD700] drop-shadow-[0_0_6px_rgba(255,215,0,0.6)]"
                            : "!text-black hover:!text-[#001F5D]"
                        }`}
                      >
                        {cat.name}
                      </Button>
                    </Link>
                  </li>
                ))}

                <li>
                  <Button
                    className={`!text-sm md:!text-base !font-semibold ${
                      isScrolled
                        ? "!text-[#FFD700] drop-shadow-[0_0_6px_rgba(255,215,0,0.6)]"
                        : "!text-black hover:!text-[#001F5D]"
                    }`}
                  >
                    Hàng Mới
                  </Button>
                </li>
                <li>
                  <Button
                    className={`!text-sm md:!text-base !font-semibold ${
                      isScrolled
                        ? "!text-[#FFD700] drop-shadow-[0_0_6px_rgba(255,215,0,0.6)]"
                        : "!text-black hover:!text-[#001F5D]"
                    }`}
                  >
                    Hàng Bán Chạy
                  </Button>
                </li>
              </ul>
            </div>

            {/* Nút cuộn phải */}
            <button
              onClick={() => scrollMenu("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-[999]
               w-6 h-6 bg-transparent text-[#001F5D] hover:text-yellow-500 transition-all block md:hidden"
            >
              <FaChevronRight size={16} />
            </button>
          </div>

          {/* col3 – chỉ hiển thị khi chưa scroll */}
          {!isScrolled && (
            <div className="hidden md:flex items-center gap-2 w-0 md:w-[20%]">
              <GoRocket className="text-xl" />
              <p className="text-sm text-black/80 font-medium">
                Free International Delivery
              </p>
            </div>
          )}
        </div>
      </nav>

      {/* CategoryPanel */}
      {catData?.length > 0 && (
        <CategoryPanel
          openCategoryPanel={openCategoryPanel}
          isOpenCatPanel={isOpenCatPanel}
          data={catData}
        />
      )}
    </>
  );
};

export default Navigation;
