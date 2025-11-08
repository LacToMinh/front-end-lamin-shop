import React, { useEffect, useState } from "react";
import CategoryCollapse from "../CategoryCollapse";
// import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "../Siderbar/style.css";
import { Collapse } from "react-collapse";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { Button } from "@mui/material";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import Rating from "@mui/material/Rating";
import { useContext } from "react";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";

const Sidebar = (props) => {
  const [isOpenCategoryFilter, setIsOpenCategoryFilter] = useState(true);
  const [isOpenAvailFilter, setIsOpenAvailFilter] = useState(true);
  const [isOpenSizeFilter, setIsOpenSizeFilter] = useState(true);
  const context = useContext(MyContext);
  const location = useLocation(); // ✅ đúng cách
  const [price, setPrice] = useState([0, 600]);
  const didMountRef = useRef(false);
  const sidebarRef = useRef(null);

  const [filter, setFilter] = useState({
    catId: [],
    subCatId: [],
    thirdSubCatId: [],
    minPrice: "",
    maxPrice: "",
    rating: [],
    page: 1,
    limit: 5,
  });

  const navigate = useNavigate();

  // ✅ Chỉ gọi khi người dùng chọn filter hoặc url thay đổi
  const filterData = async () => {
    try {
      props.setIsLoading(true);

      // Nếu đang search, không gọi filter
      if (context?.isSearchMode || context?.searchData?.data?.length > 0) {
        props.setProductData(context.searchData.data);
        props.setTotalPages(context.searchData.totalPages || 1);
        props.setIsLoading(false);
        return;
      }

      const res = await postData(`/api/product/filter`, filter);
      props.setProductData(res?.data || []);
      props.setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Filter fetch failed:", err);
    } finally {
      props.setIsLoading(false);
      window.scrollTo(0, 0);
    }
  };

  // ✅ Khi URL đổi → set catId/subCatId/thirdSubCatId tương ứng, KHÔNG gọi API liên tục
  useEffect(() => {
    const queryParameters = new URLSearchParams(location.search);
    const updatedFilter = { ...filter, page: 1 };

    if (location.search.includes("catId")) {
      const catIdParam = queryParameters.get("catId");

      // ✅ nếu có nhiều id ngăn cách bằng dấu phẩy → tách thành mảng
      updatedFilter.catId = catIdParam ? catIdParam.split(",") : [];

      updatedFilter.subCatId = [];
      updatedFilter.thirdSubCatId = [];
      updatedFilter.rating = [];
      context.setSearchData([]);
    } else if (location.search.includes("subCatId")) {
      updatedFilter.subCatId = [queryParameters.get("subCatId")];
      updatedFilter.catId = [];
      updatedFilter.thirdSubCatId = [];
      updatedFilter.rating = [];
      context.setSearchData([]);
    } else if (location.search.includes("thirdSubCatId")) {
      updatedFilter.thirdSubCatId = [queryParameters.get("thirdSubCatId")];
      updatedFilter.catId = [];
      updatedFilter.subCatId = [];
      updatedFilter.rating = [];
      context.setSearchData([]);
    }

    setFilter(updatedFilter);
  }, [location.search]);

  // ✅ Tự động gọi API khi filter thay đổi (chỉ khi có điều kiện hợp lệ)
  useEffect(() => {
    // Không có filter nào => bỏ qua
    if (
      !filter.catId.length &&
      !filter.subCatId.length &&
      !filter.thirdSubCatId.length &&
      !filter.rating.length &&
      !filter.minPrice &&
      !filter.maxPrice
    )
      return;

    // 🔹 Chặn lần mount đầu tiên (StrictMode render double)
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    // 🔹 Nếu URL vừa đổi (vd: /?catId=...) thì đừng gọi API filter ngay
    if (
      location.search.includes("catId") ||
      location.search.includes("subCatId") ||
      location.search.includes("thirdSubCatId")
    )
      return;

    // 🔹 Gọi API filter có debounce để UI mượt
    const timeout = setTimeout(() => {
      console.log("🔥 Gọi API filter với:", filter);
      filterData();
    }, 300);

    return () => clearTimeout(timeout);
  }, [filter]);

  // ✅ Gọi khi người dùng click chọn filter, không tự chạy liên tục
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilter((prev) => ({
        ...prev,
        minPrice: price[0],
        maxPrice: price[1],
      }));
    }, 300);
    return () => clearTimeout(timeout);
  }, [price]);

  const handleCheckboxChange = (field, value) => {
    context.setIsSearchMode(false);

    setFilter((prev) => {
      const currentValues = prev[field] || [];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      // ✅ Cập nhật URL mỗi khi tick
      const params = new URLSearchParams();
      if (updatedValues.length > 0) {
        params.set("catId", updatedValues.join(",")); // nhiều id cách nhau bằng dấu phẩy
      }
      navigate(`?${params.toString()}`, { replace: true });

      return { ...prev, [field]: updatedValues, page: 1 };
    });
  };

  const handleApplyFilters = () => {
    filterData(); // ✅ chỉ chạy khi nhấn nút
  };

  // 💡 Cập nhật vị trí gradient theo chuột
  const handleMouseMove = (e) => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    const rect = sidebar.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    sidebar.style.setProperty("--x", `${x}%`);
    sidebar.style.setProperty("--y", `${y}%`);
  };

  return (
    <aside
      ref={sidebarRef}
      onMouseMove={handleMouseMove}
      className="sidebar relative rounded-sm p-4 border border-white/30 
      shadow-[0_4px_30px_rgba(0,0,0,0.1)] bg-white/10 backdrop-blur-md 
      text-sm transition-all duration-300"
    >
      {/* Ánh sáng phản chiếu nhẹ */}
      <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none"></div>

      {/* DANH MỤC */}
      <div className="box mb-4 relative z-10">
        <h3 className="flex items-center justify-between text-[15px] font-semibold text-gray-900 mb-1">
          Danh mục
          <Button
            className="!ml-1 !w-8 !h-8 !min-w-0 !rounded-full !p-0 hover:!bg-white/20"
            onClick={() => setIsOpenCategoryFilter(!isOpenCategoryFilter)}
          >
            {isOpenCategoryFilter ? (
              <FaAngleUp className="text-[18px] text-gray-700" />
            ) : (
              <FaAngleDown className="text-[18px] text-gray-700" />
            )}
          </Button>
        </h3>

        <Collapse isOpened={isOpenCategoryFilter}>
          <div className="sidebar  scroll max-h-[180px] overflow-y-auto space-y-1">
            {context?.catData?.map((item, index) => (
              <FormControlLabel
                key={index}
                value={item?._id}
                control={
                  <Checkbox
                    size="small"
                    icon={
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          fill="rgba(255,255,255,0.3)"
                          stroke="#001F5D"
                          strokeWidth="2"
                        />
                      </svg>
                    }
                    checkedIcon={
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          transformOrigin: "center",
                          animation: "popIn 0.2s ease-out",
                        }}
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          fill="#001F5D"
                          stroke="#001F5D"
                          strokeWidth="2"
                        />
                        <path
                          d="M7 12l3 3 7-7"
                          stroke="#FFC107"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                    sx={{
                      color: "#001F5D",
                      "& .MuiSvgIcon-root": { fontSize: "20px" },

                      // 💡 Hover hiệu ứng nhẹ
                      "&:hover svg rect": {
                        fill: "rgba(0, 31, 93, 0.15)", // nền xanh nhạt hơn khi hover
                        stroke: "#001F5D",
                        transition: "all 0.2s ease",
                      },

                      "&.Mui-checked:hover svg rect": {
                        fill: "#002A8D", // xanh đậm hơn khi hover ở trạng thái checked
                        filter: "drop-shadow(0 0 3px rgba(0,31,93,0.4))", // hiệu ứng sáng viền nhẹ
                      },

                      "@keyframes popIn": {
                        "0%": { transform: "scale(0.6)", opacity: 0 },
                        "80%": { transform: "scale(1.1)", opacity: 1 },
                        "100%": { transform: "scale(1)", opacity: 1 },
                      },
                    }}
                  />
                }
                checked={filter?.catId?.includes(item?._id)}
                label={item?.name}
                onChange={() => handleCheckboxChange("catId", item?._id)}
                className="ripple-container w-full hover:bg-[#001f5d11] rounded-md px-1 transition-all "
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "15px",
                    fontWeight: "400",
                    marginLeft: "6px",
                    color: "#1a1a1a",
                  },
                }}
              />
            ))}
          </div>
        </Collapse>
      </div>

      {/* KHẢ DỤNG */}
      <div className="box mb-4 relative z-10">
        <h3 className="flex items-center justify-between text-[15px] font-semibold text-gray-900 mb-1">
          Khả dụng
          <Button
            className="!ml-1 !w-8 !h-8 !min-w-0 !rounded-full !p-0 hover:!bg-white/20"
            onClick={() => setIsOpenAvailFilter(!isOpenAvailFilter)}
          >
            {isOpenAvailFilter ? (
              <FaAngleUp className="text-[18px] text-gray-700" />
            ) : (
              <FaAngleDown className="text-[18px] text-gray-700" />
            )}
          </Button>
        </h3>

        <Collapse isOpened={isOpenAvailFilter}>
          <div className="space-y-1">
            {["Có sẵn", "InStock", "Not Available"].map((label, i) => (
              <div
                key={i}
                className="flex items-center justify-between hover:bg-white/20 rounded-md px-1 transition-all"
              >
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={label}
                  className="w-full"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "15px",
                      fontWeight: "400",
                      marginLeft: "6px",
                      color: "#1a1a1a",
                    },
                  }}
                />
                <span className="text-[14px] text-gray-700">(16)</span>
              </div>
            ))}
          </div>
        </Collapse>
      </div>

      {/* SIZE */}
      <div className="box mb-4 relative z-10">
        <h3 className="flex items-center justify-between text-[15px] font-semibold text-gray-900 mb-1">
          Size
          <Button
            className="!ml-1 !w-8 !h-8 !min-w-0 !rounded-full !p-0 hover:!bg-white/20"
            onClick={() => setIsOpenSizeFilter(!isOpenSizeFilter)}
          >
            {isOpenSizeFilter ? (
              <FaAngleUp className="text-[18px] text-gray-700" />
            ) : (
              <FaAngleDown className="text-[18px] text-gray-700" />
            )}
          </Button>
        </h3>

        <Collapse isOpened={isOpenSizeFilter}>
          <div className="space-y-1">
            {["Small size", "Medium size", "Large size", "XL", "XXL"].map(
              (label, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between hover:bg-white/20 rounded-md px-1 transition-all"
                >
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    label={label}
                    className="w-full"
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: "15px",
                        fontWeight: "400",
                        marginLeft: "6px",
                        color: "#1a1a1a",
                      },
                    }}
                  />
                  <span className="text-[14px] text-gray-700">(16)</span>
                </div>
              )
            )}
          </div>
        </Collapse>
      </div>

      {/* GIÁ */}
      <div className="box mb-4 relative z-10">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-1">
          Lọc theo giá
        </h3>
        <RangeSlider
          value={price}
          onInput={setPrice}
          min={100}
          max={600}
          step={5}
          className="my-3 accent-blue-600"
        />
        <div className="flex justify-between text-[14px] text-gray-700">
          <span>{price[0].toLocaleString("vi-VN")}</span>
          <span>{price[1].toLocaleString("vi-VN")},000 VNĐ</span>
        </div>
      </div>

      {/* RATING */}
      <div className="box relative z-10">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-1">
          Đánh giá
        </h3>
        {[5, 4, 3, 2, 1].map((rating) => (
          <div
            key={rating}
            className="flex items-center justify-between mt-1 hover:bg-white/20 rounded-md px-1 transition-all"
          >
            <FormControlLabel
              value={rating}
              control={<Checkbox size="small" />}
              className="w-full"
              checked={filter?.rating?.includes(rating)}
              onChange={() => handleCheckboxChange("rating", rating)}
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "15px",
                  fontWeight: "400",
                  marginLeft: "6px",
                  color: "#1a1a1a",
                },
              }}
            />
            <Rating name="rating" value={rating} size="small" readOnly />
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
