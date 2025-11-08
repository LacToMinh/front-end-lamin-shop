import { useContext, useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { IoSearchSharp, IoCloseOutline } from "react-icons/io5";
import { MyContext } from "../../App";
import { postData, getDataFromApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";

const Search = () => {
  const context = useContext(MyContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Framer Motion animation
  const y = useMotionValue(-10);
  const shadowOpacity = useTransform(y, [-10, 0], [0, 0.25]);
  const smoothY = useSpring(y, { stiffness: 120, damping: 20 });

  // Load history
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setRecentSearches(history);
  }, []);

  // Debounce suggest API
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      const res = await getDataFromApi(
        `/api/product/search-suggest?query=${searchQuery}`
      );
      if (res?.success) setSuggestions(res.data);
    }, 300);
  }, [searchQuery]);

  const saveSearchHistory = (item) => {
    if (!item || !item.name) return;
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    const filtered = history.filter((p) => p.name !== item.name);
    const updated = [
      { name: item.name, price: item.price, image: item.images?.[0] },
      ...filtered,
    ].slice(0, 6);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const handleSelectSuggestion = (item) => {
    saveSearchHistory(item);
    navigate(`/product/${item._id}`);
    setSearchQuery("");
    setShowSuggestions(false);
    setShowMobileSearch(false);
  };

  const search = async () => {
    if (!searchQuery.trim()) return;
    if (suggestions.length > 0) saveSearchHistory(suggestions[0]);
    else saveSearchHistory({ name: searchQuery, price: 0, images: [] });

    try {
      const res = await postData("/api/product/search", {
        page: 1,
        limit: 5,
        query: searchQuery,
      });
      context?.setSearchData(res);
      context?.setIsSearchMode(true);
      navigate("/search");
      setShowSuggestions(false);
      setShowMobileSearch(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
      setShowMobileSearch(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("searchHistory");
    setRecentSearches([]);
  };

  const deleteHistoryItem = (index) => {
    const updated = recentSearches.filter((_, i) => i !== index);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
    setRecentSearches(updated);
  };

  return (
    <>
      {/* 🔍 ICON search chỉ cho mobile */}
      <div className="flex sm:hidden justify-end mb-1">
        <button onClick={() => setShowMobileSearch(true)}>
          <IoSearchSharp className="text-[24px] text-black" />
        </button>
      </div>

      {/* 🔎 FORM search (ẩn trên mobile nếu chưa mở) */}
      <div
        className={`relative w-full h-[37px] border border-black rounded-[8px] p-[7px] bg-white ${
          showMobileSearch ? "block" : "hidden"
        } md:block`}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="focus:outline-none font-medium text-primary w-full pl-2 pr-8"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setShowSuggestions(true);
            y.set(0);
          }}
        />
        <Button
          className="!absolute top-[0px] right-[1px] z-1 !w-[30px] !min-w-[50px] !min-h-[40x] !rounded-full !text-black"
          onClick={search}
        >
          <IoSearchSharp className="text-black text-[24px]" />
        </Button>

        {/* GỢI Ý popup */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              style={{
                boxShadow: shadowOpacity.get()
                  ? `0 10px 25px rgba(0,0,0,${shadowOpacity.get()})`
                  : "0 0 0 rgba(0,0,0,0)",
              }}
              initial={{
                opacity: 0,
                y: -10,
                clipPath: "inset(50% 50% 50% 50%)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                clipPath: "inset(0% 0% 0% 0%)",
                transition: {
                  type: "spring",
                  stiffness: 120,
                  damping: 16,
                  duration: 0.35,
                },
              }}
              exit={{
                opacity: 0,
                y: -10,
                clipPath: "inset(50% 50% 50% 50%)",
                transition: { duration: 0.25 },
              }}
              className="absolute left-0 top-[42px] w-full bg-white border border-gray-200 rounded-md z-50 max-h-[320px] overflow-y-auto backdrop-blur-[2px]"
            >
              {searchQuery && suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <motion.div
                    key={item._id}
                    whileHover={{
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(245,245,245,1) 100%)",
                      transition: { duration: 0.25 },
                    }}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer transition-all"
                    onClick={() => handleSelectSuggestion(item)}
                  >
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="w-[40px] h-[40px] object-cover rounded-md"
                    />
                    <div>
                      <p className="text-[14px] font-medium line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[13px] text-gray-600">
                        {item.price.toLocaleString()}₫
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : !searchQuery && recentSearches.length > 0 ? (
                <>
                  <div className="flex items-center justify-between px-3 py-1 text-[13px] text-gray-500">
                    <span>🔍 Tìm kiếm gần đây</span>
                    <button
                      onClick={clearHistory}
                      className="text-[12px] text-blue-600 hover:underline"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                  <AnimatePresence>
                    {recentSearches.map((item, idx) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="group flex items-center justify-between px-3 py-2 cursor-pointer rounded-md relative"
                        whileHover={{
                          background:
                            "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(245,245,245,1) 100%)",
                          boxShadow:
                            "inset 0 0 15px rgba(255,255,255,0.5), 0 1px 3px rgba(0,0,0,0.05)",
                          transition: { duration: 0.25 },
                        }}
                      >
                        <div
                          className="flex items-center gap-3 w-full"
                          onClick={() => {
                            setSearchQuery(item.name);
                            search();
                          }}
                        >
                          <img
                            src={item.image || "/no-image.png"}
                            alt={item.name}
                            className="w-[40px] h-[40px] object-cover rounded-md"
                          />
                          <div>
                            <p className="text-[14px] font-medium line-clamp-1">
                              {item.name}
                            </p>
                            {item.price > 0 && (
                              <p className="text-[13px] text-gray-600">
                                {item.price.toLocaleString()}₫
                              </p>
                            )}
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.15, color: "#dc2626" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHistoryItem(idx);
                          }}
                          className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Xóa mục này"
                        >
                          <IoCloseOutline className="text-[18px]" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </>
              ) : (
                <p className="px-3 py-2 text-gray-500 text-[14px]">
                  Không có kết quả
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Search;
