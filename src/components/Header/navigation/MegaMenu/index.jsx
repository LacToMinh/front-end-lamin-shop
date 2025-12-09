// src/components/Header/Navigation/MegaMenu.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const variants = {
  hidden: { opacity: 0, y: -12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.18 } },
};

const MegaMenu = ({ isOpen, cats = [], onPanelEnter, onPanelLeave }) => {
  const [top, setTop] = useState(0);

  // ====== TÍNH VỊ TRÍ CHÍNH XÁC DƯỚI NAVBAR ======
  useEffect(() => {
    const navbar = document.getElementById("main-navbar");
    if (navbar) {
      const rect = navbar.getBoundingClientRect();
      setTop(rect.bottom + window.scrollY);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <motion.div
      id="mega-menu-panel"
      variants={variants}
      initial="hidden"
      animate="show"
      exit="exit"
      onMouseEnter={onPanelEnter}
      onMouseLeave={onPanelLeave}
      className="fixed mt-4 inset-x-0 z-[9999] mx-auto w-[min(94vw,1200px)] rounded-none bg-white/70 backdrop-blur-2xl border border-white/30 shadow-xl p-8 max-h-[78vh] overflow-y-auto"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
        {cats.slice(0, 4).map((parent) => (
          <div key={parent._id}>
            <h3 className="font-bold text-lg mb-4">{parent.name}</h3>

            <ul className="space-y-3">
              {parent.children?.map((child) => (
                <li key={child._id}>
                  <Link
                    to={`/productListing?subCatId=${child._id}`}
                    className="font-medium text-gray-700 hover:text-[#001F5D]"
                  >
                    {child.name}
                  </Link>

                  {child.children?.length > 0 && (
                    <ul
                      className="mt-2 pl-4 border-l-2 space-y-2"
                      style={{ borderColor: "#F2C94C" }}
                    >
                      {child.children.map((lv3) => (
                        <li key={lv3._id}>
                          <Link
                            to={`/productListing?thirdSubCatId=${lv3._id}`}
                            className="text-gray-600 hover:text-[#001F5D] text-sm"
                          >
                            {lv3.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Cột hình */}
        <div className="space-y-6">
          <div className="group cursor-pointer overflow-hidden rounded-xl shadow-lg">
            <img
              src="https://res.cloudinary.com/diwj0b37p/image/upload/v1763427540/1763427533695_retro_sport.png"
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform"
            />
            <p className="font-bold text-sm mt-3">Retro Sports</p>
          </div>

          <div className="group cursor-pointer overflow-hidden rounded-xl shadow-lg">
            <img
              src="https://res.cloudinary.com/diwj0b37p/image/upload/v1758799062/1758799059364_banner_banner_slider_3.jpg"
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform"
            />
            <p className="font-bold text-sm mt-3">Đồ Thu Đông 2025</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MegaMenu;
