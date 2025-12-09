// src/components/Header/Navigation/Navigation.jsx
import { useEffect, useState } from "react";
import MegaMenu from "./MegaMenu";
import { LiaAngleDownSolid } from "react-icons/lia";
import { getDataFromApi } from "../../../utils/api";

const Navigation = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [cats, setCats] = useState([]);

  useEffect(() => {
    getDataFromApi("/api/category").then((res) => setCats(res?.data || []));
  }, []);

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200 z-[100] main-navbar">
      <ul className="hidden md:flex container mx-auto items-center justify-center gap-10 py-4 text-[16px] font-semibold">
        
        {["products", "denim", "collection"].map((key) => (
          <li
            key={key}
            className="relative"
            onMouseEnter={() => setOpenMenu(key)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            {/* BUTTON */}
            <button className="flex items-center gap-1 hover:text-[#001F5D] transition-colors">
              {key === "products" && "Sản phẩm"}
              {key === "denim" && "DENIM"}
              {key === "collection" && "Collection"}
              <LiaAngleDownSolid size={14} />
            </button>

            {/* MEGA MENU */}
            {openMenu === key && (
              <MegaMenu
                isOpen={true}
                cats={cats}
                onPanelEnter={() => setOpenMenu(key)}
                onPanelLeave={() => setOpenMenu(null)}
              />
            )}
          </li>
        ))}

        <li>
          <button className="hover:text-[#001F5D]">Hàng Mới</button>
        </li>
        <li>
          <button className="hover:text-[#001F5D]">Hàng Bán Chạy</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
