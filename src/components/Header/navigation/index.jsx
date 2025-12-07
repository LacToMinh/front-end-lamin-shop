// src/components/Header/Navigation/Navigation.jsx
import { useEffect, useRef, useState } from "react";
import MegaMenu from "./MegaMenu";
import { LiaAngleDownSolid } from "react-icons/lia";
import { getDataFromApi } from "../../../utils/api";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const CLOSE_DELAY = 400;

const Navigation = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [cats, setCats] = useState([]);
  const closeTimer = useRef(null);

  // Hủy timer → KHÔNG ĐÓNG
  const cancelClose = () => clearTimeout(closeTimer.current);

  // Bắt đầu timer → ĐÓNG
  const handleGlobalMouseLeave = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpenMenu(null);
    }, CLOSE_DELAY);
  };

  // Mở item
  const openAndCancelClose = (key) => {
   cancelClose();
    setOpenMenu(key);
  };

  useEffect(() => {
    getDataFromApi("/api/category").then((res) => setCats(res?.data || []));
    return () => clearTimeout(closeTimer.current);
  }, []);

  /* -------------------- DESKTOP -------------------- */
  const DesktopNav = () => (
    <ul
      className="hidden md:flex container mx-auto items-center justify-center gap-10 py-4 text-[16px] font-semibold"
      onMouseEnter={cancelClose}
      onMouseLeave={handleGlobalMouseLeave}
    >
      {["products", "denim", "collection"].map((key) => (
        <li key={key} onMouseEnter={() => openAndCancelClose(key)}>
          <button className="flex items-center gap-1 hover:text-[#001F5D] transition-colors">
            {key === "products" && "Sản phẩm"}
            {key === "denim" && "DENIM"}
            {key === "collection" && "Collection"}
            <LiaAngleDownSolid size={14} />
          </button>

          <MegaMenu
            isOpen={openMenu === key}
            cats={cats}
            anchorId="main-navbar"
            onPanelEnter={cancelClose}
            onPanelLeave={handleGlobalMouseLeave}
          />
        </li>
      ))}

      <li><button className="hover:text-[#001F5D]">Hàng Mới</button></li>
      <li><button className="hover:text-[#001F5D]">Hàng Bán Chạy</button></li>
    </ul>
  );

  /* -------------------- MOBILE -------------------- */
  const MobileNav = () => {
    const scrollRef = useRef(null);

    const items = [
      { key: "products", label: "Sản Phẩm" },
      { key: "new", label: "Hàng Mới" },
      { key: "best", label: "Hàng Bán Chạy" },
      { key: "denim", label: "DENIM" },
      { key: "collection", label: "Collection" },
    ];

    return (
      <div className="md:hidden relative overflow-hidden">
        <div ref={scrollRef} className="no-scrollbar flex gap-6 px-8 py-3 overflow-x-auto">
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => setOpenMenu(openMenu === it.key ? null : it.key)}
              className={`whitespace-nowrap font-semibold flex items-center gap-1 transition-colors ${
                openMenu === it.key ? "text-[#001F5D]" : "text-gray-900"
              }`}
            >
              {it.label}
              {["products", "denim", "collection"].includes(it.key) && <LiaAngleDownSolid size={14} />}
            </button>
          ))}
        </div>

        {["products", "denim", "collection"].map((key) => (
          <MegaMenu
            key={key}
            isOpen={openMenu === key}
            cats={cats}
            anchorId="main-navbar"
            onPanelEnter={cancelClose}
            onPanelLeave={handleGlobalMouseLeave}
          />
        ))}
      </div>
    );
  };

  return (
    <nav id="main-navbar" className="w-full bg-white shadow-sm border-b border-gray-200 z-[100]">
      <DesktopNav />
      <MobileNav />
    </nav>
  );
};

export default Navigation;
