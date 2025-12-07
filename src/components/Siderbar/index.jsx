// frontend/src/components/Siderbar/index.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "../Siderbar/style.css";
import { Collapse } from "react-collapse";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { Button } from "@mui/material";
import Rating from "@mui/material/Rating";
import { MyContext } from "../../App";
import { getDataFromApi, postData } from "../../utils/api";
import { useLocation, useNavigate } from "react-router-dom";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

const currencyVN = (n) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(+n) ? +n : 0);

const Sidebar = (props) => {
  const {
    setProductData,
    setTotalPages,
    setIsLoading,
    page,
    setIsFiltering,
    PRICE_MIN = 0,
    PRICE_MAX = 900_000,
    PRICE_STEP = 10_000,
  } = props;

  const [isOpenCategoryFilter, setIsOpenCategoryFilter] = useState(true);
  const [isOpenAvailFilter, setIsOpenAvailFilter] = useState(true);
  const [isOpenSizeFilter, setIsOpenSizeFilter] = useState(true);

  const context = useContext(MyContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [sizes, setSizes] = useState([]);
  const didMountRef = useRef(false); // chỉ đánh dấu đã mount (why: tránh race ở effect page)
  const sidebarRef = useRef(null);

  const [price, setPrice] = useState([PRICE_MIN, PRICE_MAX]);
  const [priceInput, setPriceInput] = useState({
    min: PRICE_MIN,
    max: PRICE_MAX,
  });

  const [filter, setFilter] = useState({
    catId: [],
    subCatId: [],
    thirdSubCatId: [],
    minPrice: "",
    maxPrice: "",
    rating: [],
    size: [],
    page: 1,
    limit: 10,
  });

  const isFilterEmpty = (f) =>
    !f.catId.length &&
    !f.subCatId.length &&
    !f.thirdSubCatId.length &&
    !f.rating.length &&
    !f.minPrice &&
    !f.maxPrice &&
    !f.size.length;

  const filterData = async (opts = {}) => {
    try {
      setIsLoading(true);

      // ưu tiên dữ liệu search nếu đang search
      if (context?.isSearchMode || context?.searchData?.data?.length > 0) {
        setProductData(context.searchData.data);
        setTotalPages(context.searchData.totalPages || 1);
        setIsFiltering(true);
        return;
      }

      const body = {
        ...filter,
        page: opts.page ?? filter.page,
        limit: filter.limit,
      };

      const res = await postData(`/api/product/filter`, body);
      setProductData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Filter fetch failed:", err);
    } finally {
      setIsLoading(false);
      window.scrollTo(0, 0);
    }
  };

  // mark mounted
  useEffect(() => {
    didMountRef.current = true;
  }, []);

  // Sizes
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const data = await getDataFromApi("/api/product/sizes");
        if (data?.success && Array.isArray(data.data)) {
          setSizes(
            data.data
              .map((s) => (s == null ? "" : s.toString().trim()))
              .filter(Boolean)
          );
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách size:", err);
      }
    };
    fetchSizes();
  }, []);

  // Sync filter từ URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catIdParam = params.get("catId");
    const subCatIdParam = params.get("subCatId");
    const thirdSubCatIdParam = params.get("thirdSubCatId");

    if (catIdParam || subCatIdParam || thirdSubCatIdParam) {
      const newFilter = {
        catId: [],
        subCatId: [],
        thirdSubCatId: [],
        rating: [],
        minPrice: filter.minPrice || "",
        maxPrice: filter.maxPrice || "",
        size: filter.size || [],
        page: 1,
        limit: filter.limit,
      };

      if (catIdParam) newFilter.catId = catIdParam.split(",").filter(Boolean);
      else if (subCatIdParam) newFilter.subCatId = [subCatIdParam];
      else if (thirdSubCatIdParam)
        newFilter.thirdSubCatId = [thirdSubCatIdParam];

      if (JSON.stringify(newFilter) !== JSON.stringify(filter)) {
        setIsFiltering(true); // why: ngăn fetch mặc định ở parent ngay khi URL sync
        setFilter(newFilter); // gọi API sẽ do effect [filter] xử lý
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Gọi filter khi filter thay đổi (DEBOUNCE, không skip first change)
  useEffect(() => {
    const empty = isFilterEmpty(filter);

    if (empty) {
      setIsFiltering(false);
      return;
    }

    const t = setTimeout(() => {
      setIsFiltering(true);
      filterData();
    }, 300);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Đồng bộ page từ parent
  useEffect(() => {
    setFilter((prev) => ({ ...prev, page: page || 1 }));
  }, [page]);

  // Khi page trong filter đổi → fetch trang mới (nếu đang lọc)
  useEffect(() => {
    if (!isFilterEmpty(filter) && didMountRef.current) {
      filterData({ page });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.page]);

  // Debounce đồng bộ range -> filter
  useEffect(() => {
    const t = setTimeout(() => {
      setFilter((prev) => ({
        ...prev,
        minPrice: price[0],
        maxPrice: price[1],
        page: 1,
      }));
      setPriceInput({ min: price[0], max: price[1] });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price]);

  // Nhập tay giá
  const setPriceSafe = (min, max) => {
    const m = Math.max(PRICE_MIN, Math.min(min, PRICE_MAX));
    const M = Math.max(PRICE_MIN, Math.min(max, PRICE_MAX));
    const fixed = m > M ? [M, M] : [m, M];
    setPrice(fixed);
    setPriceInput({ min: fixed[0], max: fixed[1] });
  };

  const onPriceInputChange = (key, value) => {
    const num = Number(value || 0);
    const draft = { ...priceInput, [key]: num };
    setPriceInput(draft);
  };

  const onPriceInputBlur = () => {
    setPriceSafe(priceInput.min, priceInput.max);
  };

  // Checkbox chung
  const handleCheckboxChange = (field, valueRaw) => {
    context.setIsSearchMode(false);
    const value =
      valueRaw == null
        ? ""
        : typeof valueRaw === "number"
        ? valueRaw
        : valueRaw.toString().trim();

    setFilter((prev) => {
      const currentValues = prev[field] || [];
      const exists = currentValues.includes(value);
      const updatedValues = exists
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      if (field === "catId") {
        const params = new URLSearchParams(location.search);
        if (updatedValues.length > 0)
          params.set("catId", updatedValues.join(","));
        else params.delete("catId");
        navigate(`?${params.toString()}`, { replace: true });
      }

      return { ...prev, [field]: updatedValues, page: 1 };
    });
  };

  const handleMouseMove = (e) => {
    const el = sidebarRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--x", `${x}%`);
    el.style.setProperty("--y", `${y}%`);
  };

  return (
    <aside
      ref={sidebarRef}
      onMouseMove={handleMouseMove}
      className="sidebar relative rounded-sm p-4 border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] bg-white/10 backdrop-blur-md text-sm transition-all duration-300"
    >
      {/* Danh mục */}
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
          <div className="sidebar scroll max-h-[180px] overflow-y-auto space-y-1">
            {context?.catData?.map((item) => (
              <FormControlLabel
                key={item?._id}
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
                  />
                }
                checked={filter?.catId?.includes(item?._id)}
                label={item?.name}
                onChange={() => handleCheckboxChange("catId", item?._id)}
                className="ripple-container w-full hover:bg-[#001f5d11] rounded-md px-1 transition-all "
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "15px",
                    fontWeight: 400,
                    marginLeft: "6px",
                    color: "#1a1a1a",
                  },
                }}
              />
            ))}
          </div>
        </Collapse>
      </div>

      {/* Khả dụng (demo) */}
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
            {["Có sẵn", "InStock", "Not Available"].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between hover:bg-white/20 rounded-md px-1 transition-all"
              >
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={label}
                  className="w-full"
                />
                <span className="text-[14px] text-gray-700">(16)</span>
              </div>
            ))}
          </div>
        </Collapse>
      </div>

      {/* Lọc theo giá */}
      <div className="box mb-4 relative z-10">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-2">
          Lọc theo giá
        </h3>

        <RangeSlider
          value={price}
          onInput={setPrice}
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          className="my-3"
        />

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-xs text-gray-600 mb-1">Từ</label>
            <input
              type="number"
              className="w-full border rounded px-2 py-1 text-sm"
              value={priceInput.min}
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              onChange={(e) => onPriceInputChange("min", e.target.value)}
              onBlur={onPriceInputBlur}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-600 mb-1">Đến</label>
            <input
              type="number"
              className="w-full border rounded px-2 py-1 text-sm"
              value={priceInput.max}
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              onChange={(e) => onPriceInputChange("max", e.target.value)}
              onBlur={onPriceInputBlur}
            />
          </div>
        </div>

        <div className="flex justify-between text-[13px] text-gray-700 mt-2">
          <span>{currencyVN(price[0])}</span>
          <span>{currencyVN(price[1])}</span>
        </div>
      </div>

      {/* Size */}
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
          <div className="space-y-1 max-h-[200px] overflow-y-auto">
            {sizes?.length > 0 ? (
              sizes.map((sizeLabel) => {
                const key = sizeLabel.toString();
                const checked = filter.size?.includes(key);
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between hover:bg-[#001f5d11] rounded-md px-1 transition-all cursor-pointer"
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={checked}
                          onChange={() => handleCheckboxChange("size", key)}
                          icon={
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
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
                        />
                      }
                      label={key}
                      className="w-full"
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontSize: "15px",
                          fontWeight: 400,
                          marginLeft: "6px",
                          color: "#1a1a1a",
                        },
                      }}
                    />
                    <span className="text-[14px] text-gray-700 ml-2"></span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 py-2 px-1">
                Không có kích thước
              </p>
            )}
          </div>
        </Collapse>
      </div>

      {/* Rating */}
      <div className="box relative z-10">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-1">
          Đánh giá
        </h3>
        {[5, 4, 3, 2, 1].map((r) => (
          <div
            key={r}
            className="flex items-center justify-between mt-1 hover:bg-white/20 rounded-md px-1 transition-all"
          >
            <FormControlLabel
              value={r}
              control={<Checkbox size="small" />}
              className="w-full"
              checked={filter?.rating?.includes(r)}
              onChange={() => handleCheckboxChange("rating", r)}
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "15px",
                  fontWeight: 400,
                  marginLeft: "6px",
                  color: "#1a1a1a",
                },
              }}
            />
            <Rating name="rating" value={r} size="small" readOnly />
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
